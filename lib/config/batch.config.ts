/**
 * Batch Configuration
 * 
 * Centralized configuration for batch management system.
 * Modify these values to adjust batch behavior across the application.
 * 
 * @author Senior Software Engineer
 * @version 1.0.0
 */

// ============================================================================
// Batch Configuration
// ============================================================================

export const BATCH_CONFIG = {
  /**
   * Number of enrollees per batch
   * 
   * Change this value to adjust batch capacity.
   * Recommended: 20-30 for classroom settings
   */
  ENROLLEES_PER_BATCH: 20,

  /**
   * Batch naming format
   * 
   * Template for generating batch names
   * Use {number} placeholder for batch number
   */
  BATCH_NAME_TEMPLATE: "Batch {number}",

  /**
   * Maximum number of batches allowed
   * 
   * Set to 0 for unlimited batches
   * Useful for limiting enrollment capacity
   */
  MAX_BATCHES: 0,

  /**
   * Enable batch caching
   * 
   * When enabled, batch counts are cached to reduce API calls
   * Recommended: true for production
   */
  ENABLE_CACHING: true,

  /**
   * Cache TTL in milliseconds
   * 
   * How long to cache batch counts
   * Default: 30 seconds
   */
  CACHE_TTL_MS: 30000,

  /**
   * Auto-assign batch on payment
   * 
   * When enabled, batch is automatically assigned when payment is marked as done
   * Recommended: true
   */
  AUTO_ASSIGN_ON_PAYMENT: true,
} as const;

// ============================================================================
// Type Exports
// ============================================================================

export type BatchConfig = typeof BATCH_CONFIG;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generates a batch name from a batch number
 * 
 * @param batchNumber - Batch number (1-indexed)
 * @returns Formatted batch name
 */
export function generateBatchName(batchNumber: number): string {
  return BATCH_CONFIG.BATCH_NAME_TEMPLATE.replace("{number}", String(batchNumber));
}

/**
 * Validates if batch capacity is reached
 * 
 * @param currentBatchNumber - Current batch number
 * @returns True if capacity is reached, false otherwise
 */
export function isCapacityReached(currentBatchNumber: number): boolean {
  if (BATCH_CONFIG.MAX_BATCHES === 0) {
    return false; // Unlimited batches
  }
  return currentBatchNumber >= BATCH_CONFIG.MAX_BATCHES;
}

/**
 * Gets maximum enrollment capacity
 * 
 * @returns Maximum number of enrollees or Infinity if unlimited
 */
export function getMaxCapacity(): number {
  if (BATCH_CONFIG.MAX_BATCHES === 0) {
    return Infinity;
  }
  return BATCH_CONFIG.MAX_BATCHES * BATCH_CONFIG.ENROLLEES_PER_BATCH;
}

export default BATCH_CONFIG;
