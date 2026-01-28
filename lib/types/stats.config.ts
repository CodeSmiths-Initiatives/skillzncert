/**
 * Dashboard Stats Configuration
 * Declarative, scalable definition of available stats
 * Separates data structure from UI rendering
 * 
 * Benefits:
 * - Adding new metrics is simple (just add to config)
 * - Type-safe across application
 * - Reusable in multiple components
 * - Easy to extend with conditions, calculations
 */

import { Users, DollarSign, BookOpen, TrendingUp, CheckCircle, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { DashboardTopMetrics } from "@/lib/services/dashboard.service";

/**
 * Stat card definition with metadata
 */
export interface StatConfig {
  id: string;
  title: string;
  icon: LucideIcon;
  format: "text" | "currency" | "percentage" | "count";
  requiredPermission: string;
  description?: string;
}

/**
 * Stat value with trend and change information
 */
export interface StatValue {
  title: string;
  value: string;
  icon: LucideIcon;
  change: number | null;
  trend: "up" | "down" | "stable";
}

/**
 * Admin Stats Configuration
 * Only visible to users with "view:metrics" permission
 */
export const ADMIN_STATS_CONFIG: StatConfig[] = [
  {
    id: "total_enrollees",
    title: "Total Enrollees",
    icon: Users,
    format: "count",
    requiredPermission: "view:metrics",
    description: "Total number of enrollees in the system",
  },
  {
    id: "revenue",
    title: "Revenue",
    icon: DollarSign,
    format: "currency",
    requiredPermission: "view:revenue",
    description: "Total revenue collected",
  },
  {
    id: "completed",
    title: "Completed",
    icon: BookOpen,
    format: "percentage",
    requiredPermission: "view:metrics",
    description: "Completed enrollments percentage",
  },
  {
    id: "in_progress",
    title: "In Progress",
    icon: TrendingUp,
    format: "percentage",
    requiredPermission: "view:metrics",
    description: "In-progress enrollments percentage",
  },
];

/**
 * User Stats Configuration
 * Visible to all authenticated users
 * These are placeholder stats (can be extended with actual user data)
 */
export const USER_STATS_CONFIG: Array<StatConfig & { defaultValue: string }> = [
  {
    id: "attendance",
    title: "Attendance",
    icon: BookOpen,
    format: "percentage",
    requiredPermission: "view:own_dashboard",
    description: "Your attendance rate",
    defaultValue: "90%",
  },
  {
    id: "completed_courses",
    title: "Completed",
    icon: CheckCircle,
    format: "count",
    requiredPermission: "view:own_dashboard",
    description: "Courses completed",
    defaultValue: "3",
  },
  {
    id: "on_leave",
    title: "On Leave",
    icon: Clock,
    format: "count",
    requiredPermission: "view:own_dashboard",
    description: "Current leave count",
    defaultValue: "2",
  },
  {
    id: "plan",
    title: "Plan",
    icon: TrendingUp,
    format: "text",
    requiredPermission: "view:own_dashboard",
    description: "Your subscription plan",
    defaultValue: "Monthly",
  },
];

/**
 * Build admin stats from metrics data
 * Extracted from component for reusability and testability
 * Handles missing or null data gracefully with fallback values
 */
export function buildAdminStats(metrics: DashboardTopMetrics): StatValue[] {
  // Safe access with fallback values
  const totalEnrollees = metrics?.totalEnrollees?.value ?? 0;
  const totalRevenue = metrics?.totalRevenue?.value ?? 0;
  const revenueCurrency = metrics?.totalRevenue?.currency ?? "NGN";
  const completedValue = metrics?.completedPayments?.value ?? 0;
  const completedPercentage = metrics?.completedPayments?.percentage ?? 0;
  const inProgressValue = metrics?.inProgress?.value ?? 0;
  const inProgressPercentage = metrics?.inProgress?.percentage ?? 0;

  return [
    {
      title: "Total Enrollees",
      value: totalEnrollees > 0 ? totalEnrollees.toLocaleString() : "NO records",
      icon: Users,
      change: metrics?.totalEnrollees?.change ?? 0,
      trend: metrics?.totalEnrollees?.trend ?? "stable",
    },
    {
      title: "Revenue",
      value: totalRevenue > 0 
        ? formatMetricValue(totalRevenue, "currency", revenueCurrency)
        : "₦0",
      icon: DollarSign,
      change: metrics?.totalRevenue?.change ?? 0,
      trend: metrics?.totalRevenue?.trend ?? "stable",
    },
    {
      title: "Completed",
      value: completedValue > 0 
        ? `${completedValue} (${completedPercentage.toFixed(1)}%)`
        : "0 (0.0%)",
      icon: BookOpen,
      change: metrics?.completedPayments?.change ?? 0,
      trend: metrics?.completedPayments?.trend ?? "stable",
    },
    {
      title: "In Progress",
      value: inProgressValue > 0
        ? `${inProgressValue} (${inProgressPercentage.toFixed(1)}%)`
        : "0 (0.0%)",
      icon: TrendingUp,
      change: metrics?.inProgress?.change ?? 0,
      trend: metrics?.inProgress?.trend ?? "stable",
    },
  ];
}

/**
 * Build user stats with default values
 * Can be extended later with actual user data from server
 */
export function buildUserStats(): StatValue[] {
  return USER_STATS_CONFIG.map((config) => ({
    title: config.title,
    value: config.defaultValue,
    icon: config.icon,
    change: null,
    trend: "stable" as const,
  }));
}

/**
 * Format metric value based on format type
 * Centralized formatting logic
 */
export function formatMetricValue(
  value: number,
  format: StatConfig["format"],
  currency?: string
): string {
  switch (format) {
    case "currency":
      const symbols: Record<string, string> = {
        NGN: "₦",
        USD: "$",
        EUR: "€",
      };
      const symbol = symbols[currency || "NGN"] || currency || "₦";
      return `${symbol}${value.toLocaleString("en-US")}`;

    case "percentage":
      return `${value.toFixed(1)}%`;

    case "count":
      return value.toLocaleString();

    case "text":
      return String(value);

    default:
      return String(value);
  }
}

/**
 * Get permitted stats for a user based on their role
 * Useful for filtering which stats to display
 */
export function getPermittedStats(
  userPermissions: string[],
  statsConfig: StatConfig[]
): StatConfig[] {
  return statsConfig.filter((stat) =>
    userPermissions.includes(stat.requiredPermission)
  );
}
