/**
 * Batch Actions
 * 
 * Server actions for batch management and analytics.
 * Used primarily for admin dashboards and reporting.
 * 
 * @author Senior Software Engineer
 * @version 1.0.0
 */

"use server";

import { cookies } from "next/headers";
import {
  getBatchStatistics,
  calculateNextBatch,
  getPaidEnrollmentsCount,
  type PaidEnrollmentsCount,
  type BatchInfo,
} from "@/lib/services/batch.service";
import { BATCH_CONFIG } from "@/lib/config/batch.config";

// ============================================================================
// Types
// ============================================================================

export interface BatchStatisticsResult {
  success: boolean;
  data?: PaidEnrollmentsCount;
  message?: string;
}

export interface CurrentBatchInfoResult {
  success: boolean;
  data?: BatchInfo;
  message?: string;
}

export interface BatchConfigResult {
  success: boolean;
  config?: typeof BATCH_CONFIG;
  message?: string;
}

// ============================================================================
// Actions
// ============================================================================

/**
 * Get detailed batch statistics
 * 
 * Returns total count and breakdown by batch.
 * Useful for admin dashboards and analytics.
 * 
 * @returns Batch statistics or error
 */
export async function getBatchStatisticsAction(): Promise<BatchStatisticsResult> {
  try {
    const token = (await cookies()).get("auth_token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const statistics = await getBatchStatistics(token);

    return {
      success: true,
      data: statistics,
    };
  } catch (error) {
    console.error("[BatchActions] Error fetching batch statistics:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to get batch statistics",
    };
  }
}

/**
 * Get current batch information
 * 
 * Returns information about the batch that would be assigned to the next enrollee.
 * Includes capacity, count, and availability.
 * 
 * @returns Current batch info or error
 */
export async function getCurrentBatchInfoAction(): Promise<CurrentBatchInfoResult> {
  try {
    const token = (await cookies()).get("auth_token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const paidCount = await getPaidEnrollmentsCount(token);
    const batchInfo = calculateNextBatch(paidCount);

    return {
      success: true,
      data: batchInfo,
    };
  } catch (error) {
    console.error("[BatchActions] Error fetching current batch info:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to get current batch info",
    };
  }
}

/**
 * Get batch configuration
 * 
 * Returns the current batch configuration settings.
 * Useful for displaying capacity and limits in UI.
 * 
 * @returns Batch configuration
 */
export async function getBatchConfigAction(): Promise<BatchConfigResult> {
  try {
    return {
      success: true,
      config: BATCH_CONFIG,
    };
  } catch (error) {
    console.error("[BatchActions] Error fetching batch config:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to get batch config",
    };
  }
}

/**
 * Get paid enrollments count
 * 
 * Returns the total count of paid enrollments.
 * Useful for quick statistics.
 * 
 * @param useCache - Whether to use cached data (default: true)
 * @returns Count or error
 */
export async function getPaidEnrollmentsCountAction(
  useCache: boolean = true
): Promise<{ success: boolean; count?: number; message?: string }> {
  try {
    const token = (await cookies()).get("auth_token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const count = await getPaidEnrollmentsCount(token, useCache);

    return {
      success: true,
      count,
    };
  } catch (error) {
    console.error("[BatchActions] Error fetching paid enrollments count:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to get paid enrollments count",
    };
  }
}

// ============================================================================
// Exports
// ============================================================================

export const BatchActions = {
  getBatchStatisticsAction,
  getCurrentBatchInfoAction,
  getBatchConfigAction,
  getPaidEnrollmentsCountAction,
};

export default BatchActions;
