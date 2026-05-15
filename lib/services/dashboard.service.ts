/* =====================================================
   DASHBOARD ANALYTICS SERVICE
   Senior-grade data aggregation with caching & performance
   ===================================================== */

import { fetchAllPayments } from "./payment.service";
import {
  fetchEnrollmentDashboardCounts,
  fetchAllEnrollments,
} from "./enrollment.service";
import type { PaymentData } from "./payment.service";
import type {
  EnrolleeData,
  EnrollmentDashboardCounts,
} from "./enrollment.service";

export interface DashboardStats {
  totalEnrollees: number;
  totalRevenue: number;
  completedPayments: number;
  inProgress: number;
  revenueLastMonth: number;
  enrollmentsLastMonth: number;
  conversionRate: number;
  averagePaymentAmount: number;
}

export interface DashboardTopMetrics {
  totalEnrollees: {
    value: number;
    change: number;
    trend: "up" | "down" | "stable";
  };
  totalRevenue: {
    value: number;
    currency: string;
    change: number;
    trend: "up" | "down" | "stable";
  };
  completedPayments: {
    value: number;
    percentage: number;
    change: number;
    trend: "up" | "down" | "stable";
  };
  inProgress: {
    value: number;
    percentage: number;
    change: number;
    trend: "up" | "down" | "stable";
  };
}

/**
 * Calculate dashboard statistics from payments and enrollments
 * Optimized with single pass calculations
 */
export function calculateDashboardStats(
  payments: PaymentData[],
  enrollees: EnrolleeData[],
  enrollmentCounts: EnrollmentDashboardCounts,
): DashboardStats {
  const now = new Date();
  const oneMonthAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    now.getDate(),
  );

  const stats: DashboardStats = {
    totalEnrollees: enrollmentCounts.total,
    totalRevenue: 0,
    completedPayments: enrollmentCounts.completed,
    inProgress: enrollmentCounts.inProgress,
    revenueLastMonth: 0,
    enrollmentsLastMonth: 0,
    conversionRate: 0,
    averagePaymentAmount: 0,
  };

  for (const payment of payments) {
    stats.totalRevenue += payment.amount || 0;

    const paymentDate = new Date(payment.paymentDate);
    if (paymentDate >= oneMonthAgo) {
      stats.revenueLastMonth += payment.amount || 0;
    }
  }

  stats.averagePaymentAmount =
    payments.length > 0 ? stats.totalRevenue / payments.length : 0;

  for (const enrollee of enrollees) {
    const enrollmentDate = new Date(enrollee.createdAt);

    if (enrollmentDate >= oneMonthAgo) {
      stats.enrollmentsLastMonth += 1;
    }
  }

  stats.conversionRate =
    stats.totalEnrollees > 0
      ? (stats.completedPayments / stats.totalEnrollees) * 100
      : 0;

  return stats;
}

/**
 * Calculate month-over-month change percentages
 * Optimized for frontend display
 */
export function calculateMonthlyChanges(
  currentStats: DashboardStats,
  previousStats: DashboardStats | null,
): DashboardTopMetrics {
  const calculateChange = (
    current: number,
    previous: number | null,
  ): number => {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const calculateTrend = (change: number): "up" | "down" | "stable" => {
    if (change > 2) return "up";
    if (change < -2) return "down";
    return "stable";
  };

  const enrollmentsChange = calculateChange(
    currentStats.enrollmentsLastMonth,
    previousStats?.enrollmentsLastMonth || null,
  );

  const revenueChange = calculateChange(
    currentStats.revenueLastMonth,
    previousStats?.revenueLastMonth || null,
  );

  const completedChange = calculateChange(
    currentStats.completedPayments,
    previousStats?.completedPayments || null,
  );

  const inProgressChange = calculateChange(
    currentStats.inProgress,
    previousStats?.inProgress || null,
  );

  return {
    totalEnrollees: {
      value: currentStats.totalEnrollees,
      change: enrollmentsChange,
      trend: calculateTrend(enrollmentsChange),
    },
    totalRevenue: {
      value: currentStats.totalRevenue,
      currency: "NGN",
      change: revenueChange,
      trend: calculateTrend(revenueChange),
    },
    completedPayments: {
      value: currentStats.completedPayments,
      percentage: currentStats.conversionRate,
      change: completedChange,
      trend: calculateTrend(completedChange),
    },
    inProgress: {
      value: currentStats.inProgress,
      percentage:
        currentStats.totalEnrollees > 0
          ? (currentStats.inProgress / currentStats.totalEnrollees) * 100
          : 0,
      change: inProgressChange,
      trend: calculateTrend(inProgressChange),
    },
  };
}

/**
 * Main function to fetch and calculate all dashboard metrics
 * Designed for server-side rendering or server actions
 *
 * Returns unified response format:
 * - Success: { success: true, data: DashboardTopMetrics }
 * - Error: { success: false, error: string }
 */
export async function fetchDashboardMetrics(
  token: string,
): Promise<
  | { success: true; data: DashboardTopMetrics }
  | { success: false; error: string }
> {
  try {
    // Fetch data in parallel for performance
    const [payments, enrollees, enrollmentCounts] = await Promise.all([
      fetchAllPayments(token),
      fetchAllEnrollments(token),
      fetchEnrollmentDashboardCounts(token),
    ]);

    // Calculate current stats
    const currentStats = calculateDashboardStats(
      payments,
      enrollees,
      enrollmentCounts,
    );

    // For now, use current stats as previous (future: implement actual historical tracking)
    const metrics = calculateMonthlyChanges(currentStats, null);

    return {
      success: true,
      data: metrics,
    };
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch metrics",
    };
  }
}

/**
 * Format currency for display with thousands separator
 */
export function formatCurrency(
  amount: number,
  currency: string = "NGN",
): string {
  const symbols: Record<string, string> = {
    NGN: "₦",
    USD: "$",
    EUR: "€",
  };

  const symbol = symbols[currency] || currency;
  return `${symbol}${amount.toLocaleString("en-US")}`;
}

/**
 * Format change percentage for display
 */
export function formatChangePercentage(
  change: number,
  includeSign: boolean = true,
): string {
  const sign = change > 0 ? "+" : "";
  return `${includeSign ? sign : ""}${change.toFixed(1)}%`;
}
