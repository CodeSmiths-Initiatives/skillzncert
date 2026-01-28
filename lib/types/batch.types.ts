/**
 * Batch Types
 * 
 * Type definitions for the batch management system.
 * Import these types across your application for type safety.
 * 
 * @author Senior Software Engineer
 * @version 1.0.0
 */

// ============================================================================
// Core Batch Types
// ============================================================================

/**
 * Information about a specific batch
 */
export interface BatchInfo {
  /** Formatted batch name (e.g., "Batch 1") */
  batchName: string;
  /** Numeric batch identifier (1-indexed) */
  batchNumber: number;
  /** Current number of enrollees in this batch */
  enrolleeCount: number;
  /** Number of available slots remaining */
  availableSlots: number;
  /** Whether this batch is at full capacity */
  isFull: boolean;
}

/**
 * Result of a batch assignment operation
 */
export interface BatchAssignmentResult {
  /** Whether the assignment was successful */
  success: boolean;
  /** Name of the assigned batch */
  batchName: string;
  /** Numeric batch identifier */
  batchNumber: number;
  /** Optional message about the assignment */
  message?: string;
}

/**
 * Count of paid enrollments with batch breakdown
 */
export interface PaidEnrollmentsCount {
  /** Total number of paid enrollments */
  total: number;
  /** Breakdown of enrollments by batch name */
  byBatch: Record<string, number>;
}

// ============================================================================
// Enrollment with Batch
// ============================================================================

/**
 * Extended enrollment data with batch information
 */
export interface EnrollmentWithBatch {
  id: number;
  documentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isPaymentDone: boolean;
  /** Assigned batch name (e.g., "Batch 1") */
  batchName?: string;
  /** Timestamp of enrollment creation */
  createdAt: string;
  /** Timestamp of last update */
  updatedAt: string;
}

// ============================================================================
// Action Response Types
// ============================================================================

/**
 * Response from mark enrollment paid action
 */
export interface MarkEnrollmentPaidResponse {
  success: boolean;
  batchName?: string;
  message?: string;
}

/**
 * Response from batch statistics action
 */
export interface BatchStatisticsResponse {
  success: boolean;
  data?: PaidEnrollmentsCount;
  message?: string;
}

/**
 * Response from current batch info action
 */
export interface CurrentBatchInfoResponse {
  success: boolean;
  data?: BatchInfo;
  message?: string;
}

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * Batch configuration object
 */
export interface BatchConfiguration {
  /** Number of enrollees per batch */
  ENROLLEES_PER_BATCH: number;
  /** Template for batch names */
  BATCH_NAME_TEMPLATE: string;
  /** Maximum number of batches (0 = unlimited) */
  MAX_BATCHES: number;
  /** Enable caching for performance */
  ENABLE_CACHING: boolean;
  /** Cache time-to-live in milliseconds */
  CACHE_TTL_MS: number;
  /** Auto-assign batch on payment */
  AUTO_ASSIGN_ON_PAYMENT: boolean;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Batch filter options for queries
 */
export interface BatchFilterOptions {
  /** Filter by specific batch name */
  batchName?: string;
  /** Filter by batch number */
  batchNumber?: number;
  /** Include only paid enrollments */
  paidOnly?: boolean;
}

/**
 * Batch sorting options
 */
export type BatchSortField = "batchNumber" | "enrolleeCount" | "createdAt";
export type SortOrder = "asc" | "desc";

export interface BatchSortOptions {
  field: BatchSortField;
  order: SortOrder;
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * Batch-related error codes
 */
export enum BatchErrorCode {
  UNAUTHORIZED = "UNAUTHORIZED",
  BATCH_FULL = "BATCH_FULL",
  CAPACITY_REACHED = "CAPACITY_REACHED",
  INVALID_BATCH_NAME = "INVALID_BATCH_NAME",
  ASSIGNMENT_FAILED = "ASSIGNMENT_FAILED",
  FETCH_FAILED = "FETCH_FAILED",
}

/**
 * Batch error object
 */
export interface BatchError {
  code: BatchErrorCode;
  message: string;
  details?: any;
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if a value is a valid BatchInfo
 */
export function isBatchInfo(value: any): value is BatchInfo {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.batchName === "string" &&
    typeof value.batchNumber === "number" &&
    typeof value.enrolleeCount === "number" &&
    typeof value.availableSlots === "number" &&
    typeof value.isFull === "boolean"
  );
}

/**
 * Type guard to check if a value is a valid BatchAssignmentResult
 */
export function isBatchAssignmentResult(
  value: any
): value is BatchAssignmentResult {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.success === "boolean" &&
    typeof value.batchName === "string" &&
    typeof value.batchNumber === "number"
  );
}

// ============================================================================
// Exports
// ============================================================================

export type {
  // Re-export for convenience
  BatchInfo as Batch,
  BatchAssignmentResult as BatchAssignment,
  PaidEnrollmentsCount as BatchStatistics,
};
