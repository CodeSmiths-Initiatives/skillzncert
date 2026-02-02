"use server";

/**
 * Audit Log Actions
 * Server actions for audit trail management
 * 
 * @description Provides server-side actions for logging and querying audit events
 * @security All actions require authentication
 * 
 * @version 1.0.0
 */

import { getAuthUser } from "@/lib/auth/get-auth-user";
import {
  createAuditLog,
  getAuditLogs,
  getRecentActivity,
} from "@/lib/services/audit.service";
import type {
  CreateAuditLogPayload,
  AuditLogQuery,
  RecentActivity,
} from "@/lib/types/audit.types";

/**
 * Create an audit log entry
 * This is the primary function used throughout the app for logging
 * 
 * @param payload - Audit log data (userId will be auto-filled if not provided)
 * @returns Success/failure response
 * 
 * @example
 * ```ts
 * await logAuditAction({
 *   action: "schedule_updated",
 *   entityType: "schedule",
 *   description: "Updated morning batch schedule",
 *   metadata: { batchName: "morning" }
 * });
 * ```
 */
export async function logAuditAction(payload: CreateAuditLogPayload) {
  const { user, token } = await getAuthUser();

  if (!token) {
    return {
      success: false,
      message: "Unauthorized. Cannot create audit log.",
    };
  }

  try {
    // Auto-fill user information if not provided
    const enrichedPayload: CreateAuditLogPayload = {
      ...payload,
      userId: payload.userId || user?.id,
      userName: payload.userName || user?.username || "System",
      userEmail: payload.userEmail || user?.email,
    };

    await createAuditLog(enrichedPayload, token);

    return {
      success: true,
      message: "Audit log created successfully",
    };
  } catch (error) {
    console.error("Failed to create audit log:", error);
    // Don't fail the main operation if audit logging fails
    // Just log the error
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create audit log",
    };
  }
}

/**
 * Query audit logs with filters
 * 
 * @param query - Query parameters
 * @returns Audit logs with pagination
 */
export async function getAuditLogsAction(query: AuditLogQuery = {}) {
  const { user, token } = await getAuthUser();

  if (!user || !token) {
    return {
      success: false,
      message: "Unauthorized. Please log in again.",
      data: null,
    };
  }

  try {
    const result = await getAuditLogs(query, token);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Failed to fetch audit logs:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch audit logs",
      data: null,
    };
  }
}

/**
 * Get recent activity for dashboard
 * Optimized for Recent Activity widget
 * 
 * @param limit - Number of recent activities (default: 10)
 * @param isAdmin - Whether the user is an admin (default: true)
 * @returns Recent activity items
 */
export async function getRecentActivityAction(limit: number = 10, isAdmin: boolean = true) {
  const { user, token } = await getAuthUser();

  if (!user || !token) {
    return {
      success: false,
      message: "Unauthorized. Please log in again.",
      data: [] as RecentActivity[],
    };
  }

  try {
    // Pass isAdmin to service layer for role-based filtering
    const activities = await getRecentActivity(limit, token, isAdmin);

    return {
      success: true,
      data: activities,
    };
  } catch (error) {
    console.error("Failed to fetch recent activity:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch recent activity",
      data: [] as RecentActivity[],
    };
  }
}

/**
 * Helper function to log schedule changes
 * Pre-configured for schedule-related audit logs
 * 
 * @param action - "schedule_created" or "schedule_updated"
 * @param batchName - Name of the batch
 * @param metadata - Additional data
 */
export async function logScheduleChange(
  action: "schedule_created" | "schedule_updated",
  batchName: string,
  metadata?: any
) {
  const { user } = await getAuthUser();

  return logAuditAction({
    action,
    entityType: "schedule",
    entityId: batchName,
    description:
      action === "schedule_created"
        ? `Created schedule for ${batchName} batch`
        : `Updated schedule for ${batchName} batch`,
    metadata: {
      batchName,
      ...metadata,
    },
    severity: "info",
  });
}

/**
 * Helper function to log payment completion
 * Pre-configured for payment-related audit logs
 * 
 * @param userName - Name of user who made payment
 * @param amount - Payment amount
 * @param planName - Plan name
 * @param paymentId - Payment ID
 * @param metadata - Additional data
 */
export async function logPaymentCompleted(
  userName: string,
  amount: number,
  planName: string,
  paymentId: string,
  metadata?: any
) {
  return logAuditAction({
    action: "payment_completed",
    entityType: "payment",
    entityId: paymentId,
    userName,
    description: `${userName} completed payment of ₹${amount.toLocaleString()} for ${planName}`,
    metadata: {
      amount,
      planName,
      ...metadata,
    },
    severity: "info",
  });
}

/**
 * Helper function to log enrollment creation
 * Pre-configured for enrollment-related audit logs
 * 
 * @param userName - Name of user who enrolled
 * @param enrollmentId - Enrollment ID
 * @param courseName - Course name (optional)
 * @param metadata - Additional data
 */
export async function logEnrollmentCreated(
  userName: string,
  enrollmentId: string,
  courseName?: string,
  metadata?: any
) {
  return logAuditAction({
    action: "enrollment_created",
    entityType: "enrollment",
    entityId: enrollmentId,
    userName,
    description: courseName
      ? `${userName} enrolled in ${courseName}`
      : `${userName} joined the platform`,
    metadata: {
      courseName,
      ...metadata,
    },
    severity: "info",
  });
}
