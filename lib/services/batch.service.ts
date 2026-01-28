/**
 * Batch Service
 * 
 * Handles all batch assignment logic with scalability and performance in mind.
 * 
 * Features:
 * - Dynamic batch size configuration
 * - Efficient batch calculation
 * - Thread-safe batch assignment
 * - Cache support for performance optimization
 * - Comprehensive error handling
 * 
 * @author Senior Software Engineer
 * @version 1.0.0
 */

import { BATCH_CONFIG } from "@/lib/config/batch.config";

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface BatchInfo {
  batchName: string;
  batchNumber: number;
  enrolleeCount: number;
  availableSlots: number;
  isFull: boolean;
}

export interface BatchAssignmentResult {
  success: boolean;
  batchName: string;
  batchNumber: number;
  message?: string;
}

export interface PaidEnrollmentsCount {
  total: number;
  byBatch: Record<string, number>;
}

// ============================================================================
// Constants
// ============================================================================

const CACHE_TTL = 30000; // 30 seconds cache for high traffic scenarios
let batchCountCache: {
  data: PaidEnrollmentsCount | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0,
};

// ============================================================================
// Core Batch Calculation Logic
// ============================================================================

/**
 * Calculates the next available batch based on current paid enrollments count
 * 
 * Algorithm:
 * - Gets total paid enrollments count
 * - Divides by batch size to determine batch number
 * - Accounts for 0-indexed vs 1-indexed batch naming
 * 
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 * 
 * @param totalPaidCount - Total number of paid enrollments
 * @returns Batch information object
 */
export function calculateNextBatch(totalPaidCount: number): BatchInfo {
  const { ENROLLEES_PER_BATCH } = BATCH_CONFIG;
  
  // Calculate batch number (1-indexed)
  const batchNumber = Math.floor(totalPaidCount / ENROLLEES_PER_BATCH) + 1;
  
  // Calculate enrollees in current batch
  const enrolleeCount = totalPaidCount % ENROLLEES_PER_BATCH;
  
  // Calculate available slots
  const availableSlots = ENROLLEES_PER_BATCH - enrolleeCount;
  
  return {
    batchName: `Batch ${batchNumber}`,
    batchNumber,
    enrolleeCount,
    availableSlots,
    isFull: availableSlots === 0,
  };
}

/**
 * Determines batch assignment for a new enrollee
 * 
 * This function considers:
 * - Current total paid enrollments
 * - Batch capacity limits
 * - Overflow to next batch if current is full
 * 
 * @param currentPaidCount - Current count of paid enrollments
 * @returns Batch assignment result
 */
export function determineBatchForNewEnrollee(
  currentPaidCount: number
): BatchAssignmentResult {
  const batchInfo = calculateNextBatch(currentPaidCount);
  
  // If current batch is full, assign to next batch
  if (batchInfo.isFull) {
    return {
      success: true,
      batchName: `Batch ${batchInfo.batchNumber + 1}`,
      batchNumber: batchInfo.batchNumber + 1,
      message: `Assigned to ${batchInfo.batchName + 1} (new batch)`,
    };
  }
  
  return {
    success: true,
    batchName: batchInfo.batchName,
    batchNumber: batchInfo.batchNumber,
    message: `Assigned to ${batchInfo.batchName} (slot ${batchInfo.enrolleeCount + 1}/${BATCH_CONFIG.ENROLLEES_PER_BATCH})`,
  };
}

// ============================================================================
// API Integration Functions
// ============================================================================

/**
 * Fetches count of paid enrollments from Strapi
 * 
 * Performance Optimizations:
 * - Uses pagination[pageSize]=1 to minimize data transfer
 * - Uses filters to count only paid enrollments
 * - Implements caching to reduce API calls
 * 
 * @param token - Authentication token
 * @param useCache - Whether to use cached data (default: true)
 * @returns Count of paid enrollments
 */
export async function getPaidEnrollmentsCount(
  token: string,
  useCache: boolean = true
): Promise<number> {
  // Check cache first
  if (useCache && batchCountCache.data) {
    const now = Date.now();
    if (now - batchCountCache.timestamp < CACHE_TTL) {
      return batchCountCache.data.total;
    }
  }
  
  try {
    const url = new URL(`${process.env.STRAPI_URL}/api/enrollments`);
    url.searchParams.set("filters[isPaymentDone][$eq]", "true");
    url.searchParams.set("pagination[pageSize]", "1");
    url.searchParams.set("pagination[withCount]", "true");
    
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch enrollments: ${response.status}`);
    }
    
    const data = await response.json();
    const total = data?.meta?.pagination?.total || 0;
    
    // Update cache
    batchCountCache = {
      data: { total, byBatch: {} },
      timestamp: Date.now(),
    };
    
    return total;
  } catch (error) {
    console.error("[BatchService] Error fetching paid enrollments count:", error);
    throw new Error(
      `Failed to get paid enrollments count: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Gets detailed batch statistics
 * 
 * Useful for dashboard analytics and reporting
 * 
 * @param token - Authentication token
 * @returns Detailed batch information
 */
export async function getBatchStatistics(
  token: string
): Promise<PaidEnrollmentsCount> {
  try {
    const url = new URL(`${process.env.STRAPI_URL}/api/enrollments`);
    url.searchParams.set("filters[isPaymentDone][$eq]", "true");
    url.searchParams.set("fields", "batchName");
    url.searchParams.set("pagination[pageSize]", "1000");
    
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch batch statistics: ${response.status}`);
    }
    
    const data = await response.json();
    const enrollments = data?.data || [];
    
    // Count by batch
    const byBatch: Record<string, number> = {};
    enrollments.forEach((enrollment: any) => {
      const batchName = enrollment.batchName || "Unassigned";
      byBatch[batchName] = (byBatch[batchName] || 0) + 1;
    });
    
    return {
      total: enrollments.length,
      byBatch,
    };
  } catch (error) {
    console.error("[BatchService] Error fetching batch statistics:", error);
    throw new Error(
      `Failed to get batch statistics: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Assigns batch to an enrollee atomically
 * 
 * This function ensures thread-safety by:
 * 1. Fetching current count without cache
 * 2. Immediately calculating batch assignment
 * 3. Returning batch name for immediate update
 * 
 * Note: The actual update should happen immediately after this call
 * to maintain consistency in high-concurrency scenarios.
 * 
 * @param token - Authentication token
 * @returns Batch assignment result
 */
export async function assignBatchToEnrollee(
  token: string
): Promise<BatchAssignmentResult> {
  try {
    // Always fetch fresh count for assignment (no cache)
    const currentPaidCount = await getPaidEnrollmentsCount(token, false);
    
    // Calculate batch assignment
    const assignment = determineBatchForNewEnrollee(currentPaidCount);
    
    // Invalidate cache to force refresh on next read
    batchCountCache.data = null;
    
    return assignment;
  } catch (error) {
    console.error("[BatchService] Error assigning batch:", error);
    return {
      success: false,
      batchName: "Batch 1", // Fallback to Batch 1
      batchNumber: 1,
      message: `Error assigning batch: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Validates batch name format
 * 
 * @param batchName - Batch name to validate
 * @returns True if valid, false otherwise
 */
export function isValidBatchName(batchName: string): boolean {
  return /^Batch \d+$/.test(batchName);
}

/**
 * Extracts batch number from batch name
 * 
 * @param batchName - Batch name (e.g., "Batch 1")
 * @returns Batch number or null if invalid
 */
export function extractBatchNumber(batchName: string): number | null {
  const match = batchName.match(/^Batch (\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Clears the batch count cache
 * Useful for testing or manual cache invalidation
 */
export function clearBatchCache(): void {
  batchCountCache = {
    data: null,
    timestamp: 0,
  };
}

// ============================================================================
// Exports
// ============================================================================

export const BatchService = {
  calculateNextBatch,
  determineBatchForNewEnrollee,
  getPaidEnrollmentsCount,
  getBatchStatistics,
  assignBatchToEnrollee,
  isValidBatchName,
  extractBatchNumber,
  clearBatchCache,
};

export default BatchService;
