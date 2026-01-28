/**
 * Batch Statistics Component
 * 
 * Displays batch statistics for admin dashboard.
 * Copy this component to your dashboard features folder.
 * 
 * Usage:
 * ```tsx
 * import BatchStatistics from "@/features/dashboard/BatchStatistics";
 * 
 * export default function AdminDashboard() {
 *   return (
 *     <div>
 *       <BatchStatistics />
 *     </div>
 *   );
 * }
 * ```
 */

"use client";

import { useEffect, useState } from "react";
import { 
  getBatchStatisticsAction, 
  getCurrentBatchInfoAction 
} from "@/actions/batch/batch.actions";
import { BATCH_CONFIG } from "@/lib/config/batch.config";

interface BatchStats {
  total: number;
  byBatch: Record<string, number>;
}

interface CurrentBatch {
  batchName: string;
  batchNumber: number;
  enrolleeCount: number;
  availableSlots: number;
  isFull: boolean;
}

export default function BatchStatistics() {
  const [stats, setStats] = useState<BatchStats | null>(null);
  const [currentBatch, setCurrentBatch] = useState<CurrentBatch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        const [statsResult, currentBatchResult] = await Promise.all([
          getBatchStatisticsAction(),
          getCurrentBatchInfoAction(),
        ]);

        if (statsResult.success && statsResult.data) {
          setStats(statsResult.data);
        }

        if (currentBatchResult.success && currentBatchResult.data) {
          setCurrentBatch(currentBatchResult.data);
        }

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch batch data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600 font-medium">Error loading batch statistics</p>
        <p className="text-red-500 text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Batch Card */}
      <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg shadow-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Current Batch Status</h3>
        
        {currentBatch ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold">{currentBatch.batchName}</p>
                <p className="text-teal-100 text-sm">Next enrollment assigned here</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{currentBatch.enrolleeCount}</p>
                <p className="text-teal-100 text-sm">of {BATCH_CONFIG.ENROLLEES_PER_BATCH} enrolled</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="relative">
              <div className="overflow-hidden h-3 text-xs flex rounded-full bg-teal-700">
                <div
                  style={{ width: `${(currentBatch.enrolleeCount / BATCH_CONFIG.ENROLLEES_PER_BATCH) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-white transition-all duration-500"
                />
              </div>
              <p className="text-teal-100 text-xs mt-1">
                {currentBatch.availableSlots} slots available
              </p>
            </div>

            {currentBatch.isFull && (
              <div className="bg-teal-700 rounded-lg p-3 text-center">
                <p className="font-semibold">🎉 Batch Full!</p>
                <p className="text-sm text-teal-100">Next enrollment starts new batch</p>
              </div>
            )}

            {currentBatch.availableSlots <= 5 && !currentBatch.isFull && (
              <div className="bg-amber-500 rounded-lg p-3 text-center">
                <p className="font-semibold">⚠️ Almost Full</p>
                <p className="text-sm">Only {currentBatch.availableSlots} slots remaining</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-teal-100">No batch data available</p>
        )}
      </div>

      {/* Statistics Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Statistics</h3>
        
        <div className="space-y-4">
          {/* Total Count */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <span className="text-gray-600">Total Paid Enrollments</span>
            <span className="text-2xl font-bold text-teal-600">{stats?.total || 0}</span>
          </div>

          {/* Batch Breakdown */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Enrollment by Batch</h4>
            {stats && Object.keys(stats.byBatch).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(stats.byBatch)
                  .sort((a, b) => {
                    // Sort by batch number
                    const numA = parseInt(a[0].replace("Batch ", ""));
                    const numB = parseInt(b[0].replace("Batch ", ""));
                    return numA - numB;
                  })
                  .map(([batchName, count]) => {
                    const percentage = Math.round((count / (stats.total || 1)) * 100);
                    
                    return (
                      <div key={batchName} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-700">{batchName}</span>
                          <span className="text-gray-600">
                            {count} enrollees ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No batches assigned yet</p>
            )}
          </div>

          {/* Configuration Info */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Configuration</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Batch Capacity</span>
                <p className="font-semibold text-gray-900">
                  {BATCH_CONFIG.ENROLLEES_PER_BATCH} enrollees
                </p>
              </div>
              <div>
                <span className="text-gray-600">Total Batches</span>
                <p className="font-semibold text-gray-900">
                  {stats ? Object.keys(stats.byBatch).length : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
