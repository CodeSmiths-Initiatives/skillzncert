/**
 * Batch System - Centralized Exports
 * 
 * Import batch functionality from this file for consistency.
 * 
 * @example
 * ```typescript
 * import { BatchService, BatchActions, BatchTypes } from "@/lib/batch";
 * 
 * const result = await BatchActions.getBatchStatisticsAction();
 * const batchInfo = BatchService.calculateNextBatch(35);
 * ```
 */

// ============================================================================
// Services
// ============================================================================

export {
  calculateNextBatch,
  determineBatchForNewEnrollee,
  getPaidEnrollmentsCount,
  getBatchStatistics,
  assignBatchToEnrollee,
  isValidBatchName,
  extractBatchNumber,
  clearBatchCache,
  BatchService,
  default as batchServiceDefault,
} from "../services/batch.service";

// ============================================================================
// Actions
// ============================================================================

export {
  getBatchStatisticsAction,
  getCurrentBatchInfoAction,
  getBatchConfigAction,
  getPaidEnrollmentsCountAction,
  BatchActions,
  default as batchActionsDefault,
} from "../../actions/batch/batch.actions";

// ============================================================================
// Configuration
// ============================================================================

export {
  BATCH_CONFIG,
  generateBatchName,
  isCapacityReached,
  getMaxCapacity,
  default as batchConfigDefault,
} from "../config/batch.config";

export type { BatchConfig } from "../config/batch.config";

// ============================================================================
// Types
// ============================================================================

export type {
  BatchInfo,
  BatchAssignmentResult,
  PaidEnrollmentsCount,
  EnrollmentWithBatch,
  MarkEnrollmentPaidResponse,
  BatchStatisticsResponse,
  CurrentBatchInfoResponse,
  BatchConfiguration,
  BatchFilterOptions,
  BatchSortField,
  SortOrder,
  BatchSortOptions,
  BatchErrorCode,
  BatchError,
  // Convenience aliases
  Batch,
  BatchAssignment,
  BatchStatistics,
} from "../types/batch.types";

export { isBatchInfo, isBatchAssignmentResult } from "../types/batch.types";

// ============================================================================
// Constants
// ============================================================================

/**
 * Quick access to commonly used values
 */
export const BATCH_CONSTANTS = {
  ENROLLEES_PER_BATCH: 20,
  DEFAULT_BATCH_NAME: "Batch 1",
  BATCH_NAME_PATTERN: /^Batch \d+$/,
} as const;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Quick check if a batch name is valid
 * 
 * @param batchName - Batch name to validate
 * @returns True if valid format
 */
export function isValidBatch(batchName: string): boolean {
  return BATCH_CONSTANTS.BATCH_NAME_PATTERN.test(batchName);
}

/**
 * Get batch number from name
 * 
 * @param batchName - e.g., "Batch 1"
 * @returns Batch number or null
 */
export function getBatchNumber(batchName: string): number | null {
  const match = batchName.match(/^Batch (\d+)$/);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Create batch name from number
 * 
 * @param batchNumber - e.g., 1
 * @returns Batch name, e.g., "Batch 1"
 */
export function createBatchName(batchNumber: number): string {
  return `Batch ${batchNumber}`;
}

// ============================================================================
// Default Export (Optional - for backward compatibility)
// ============================================================================

import { BatchService as BS } from "../services/batch.service";
import { BatchActions as BA } from "../../actions/batch/batch.actions";
import batchConfig from "../config/batch.config";

export default {
  service: BS,
  actions: BA,
  config: batchConfig,
  constants: BATCH_CONSTANTS,
  utils: {
    isValidBatch,
    getBatchNumber,
    createBatchName,
  },
};
