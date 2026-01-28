"use server";

import { fetchDashboardMetrics } from "@/lib/services/dashboard.service";
import { getAuthUser } from "@/lib/auth/get-auth-user";
import { isAdmin, PermissionError } from "@/lib/auth/roles";
import type { DashboardTopMetrics } from "@/lib/services/dashboard.service";

/**
 * Response type for dashboard metrics server action
 */
export type GetDashboardMetricsResponse =
  | { success: true; data: DashboardTopMetrics }
  | { success: false; error: string; status: 401 | 403 | 500 };

/**
 * Server Action: Fetch Dashboard Metrics
 * Secure server-side data fetching with:
 * - Authentication validation
 * - Authorization/permission checks
 * - Role-based access control
 * - Detailed error classification
 */
export async function getDashboardMetricsAction(): Promise<GetDashboardMetricsResponse> {
  try {
    // Step 1: Validate user authentication
    const { user, token } = await getAuthUser();
    
    if (!user || !token) {
      return {
        success: false,
        error: "Unauthorized",
        status: 401,
      };
    }

    // Step 2: Validate admin permission
    // This prevents non-admin users from fetching sensitive enrollment data
    if (!isAdmin(user)) {
      return {
        success: false,
        error: "Forbidden: Only administrators can access metrics",
        status: 403,
      };
    }

    // Step 3: Fetch metrics using service (safe to call now)
    const result = await fetchDashboardMetrics(token);

    if (!result.success) {
      console.error("Metrics fetch failed:", result.error);
      
      // Return empty metrics instead of error
      // This allows UI to gracefully show "NO records" instead of error message
      return {
        success: true,
        data: {
          totalEnrollees: {
            value: 0,
            change: 0,
            trend: "stable" as const,
          },
          totalRevenue: {
            value: 0,
            currency: "NGN",
            change: 0,
            trend: "stable" as const,
          },
          completedPayments: {
            value: 0,
            percentage: 0,
            change: 0,
            trend: "stable" as const,
          },
          inProgress: {
            value: 0,
            percentage: 0,
            change: 0,
            trend: "stable" as const,
          },
        },
      };
    }

    return result;
  } catch (error) {
    console.error("Dashboard metrics action error:", error);

    // Classify error types for better client-side handling
    if (error instanceof PermissionError) {
      return {
        success: false,
        error: "Permission denied",
        status: 403,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch metrics",
      status: 500,
    };
  }
}
