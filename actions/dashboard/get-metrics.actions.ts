"use server";

import { fetchDashboardMetrics } from "@/lib/services/dashboard.service";
import { getAuthUser } from "@/lib/auth/get-auth-user";

/**
 * Server Action: Fetch Dashboard Metrics
 * Secure server-side data fetching with auth validation
 */
export async function getDashboardMetricsAction() {
  try {
    // Validate user authentication
    const { user, token } = await getAuthUser();
    
    if (!user || !token) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Fetch metrics using service
    const result = await fetchDashboardMetrics(token);

    return result;
  } catch (error) {
    console.error("Dashboard metrics action error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
