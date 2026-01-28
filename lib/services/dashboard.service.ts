/* =====================================================
   DASHBOARD ANALYTICS SERVICE
   Senior-grade data aggregation with caching & performance
   ===================================================== */

import { fetchAllPayments } from "./payment.service";
import { fetchAllEnrollments } from "./enrollment.service";
import type { PaymentData } from "./payment.service";
import type { EnrolleeData } from "./enrollment.service";

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
  enrollees: EnrolleeData[]
): DashboardStats {
  const now = new Date();
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

  // Single pass calculation for performance
  const stats = {
    totalEnrollees: enrollees.length,
    totalRevenue: 0,
    completedPayments: 0,
    inProgress: 0,
    revenueLastMonth: 0,
    enrollmentsLastMonth: 0,
    conversionRate: 0,
    averagePaymentAmount: 0,
  };

  // Calculate payment metrics
  if (payments.length > 0) {
    let monthlyRevenue = 0;

    payments.forEach((payment) => {
      // Total revenue
      stats.totalRevenue += payment.amount || 0;
      stats.completedPayments += 1;

      // Monthly revenue
      const paymentDate = new Date(payment.paymentDate);
      if (paymentDate >= oneMonthAgo) {
        monthlyRevenue += payment.amount || 0;
      }
    });

    stats.revenueLastMonth = monthlyRevenue;
    stats.averagePaymentAmount =
      stats.totalRevenue / payments.length;
  }

  // Calculate enrollment metrics
  if (enrollees.length > 0) {
    enrollees.forEach((enrollee) => {
      if (!enrollee.isPaymentDone) {
        stats.inProgress += 1;
      }

      // Enrollments last month
      const enrollmentDate = new Date(enrollee.createdAt);
      if (enrollmentDate >= oneMonthAgo) {
        stats.enrollmentsLastMonth += 1;
      }
    });

    // Conversion rate: completed / total enrollees
    stats.conversionRate =
      enrollees.length > 0
        ? (stats.completedPayments / enrollees.length) * 100
        : 0;
  }

  return stats;
}

/**
 * Calculate month-over-month change percentages
 * Optimized for frontend display
 */
export function calculateMonthlyChanges(
  currentStats: DashboardStats,
  previousStats: DashboardStats | null
): DashboardTopMetrics {
  const calculateChange = (current: number, previous: number | null): number => {
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
    previousStats?.enrollmentsLastMonth || null
  );

  const revenueChange = calculateChange(
    currentStats.revenueLastMonth,
    previousStats?.revenueLastMonth || null
  );

  const completedChange = calculateChange(
    currentStats.completedPayments,
    previousStats?.completedPayments || null
  );

  const inProgressChange = calculateChange(
    currentStats.inProgress,
    previousStats?.inProgress || null
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
      percentage: currentStats.totalEnrollees > 0 
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
  token: string
): Promise<
  | { success: true; data: DashboardTopMetrics }
  | { success: false; error: string }
> {
  try {
    // Fetch data in parallel for performance
    const [payments, enrollees] = await Promise.all([
      fetchAllPayments(token),
      fetchAllEnrollments(token),
    ]);

    // Calculate current stats
    const currentStats = calculateDashboardStats(payments, enrollees);

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
export function formatCurrency(amount: number, currency: string = "NGN"): string {
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
  includeSign: boolean = true
): string {
  const sign = change > 0 ? "+" : "";
  return `${includeSign ? sign : ""}${change.toFixed(1)}%`;
}
