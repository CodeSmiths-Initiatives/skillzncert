/**
 * Audit Log Service
 * Enterprise-grade audit trail service for tracking all system activities
 * 
 * @description Centralized service for creating and querying audit logs
 * @features
 * - Automatic timestamp management
 * - Type-safe API
 * - Flexible querying with filters
 * - Performance optimized with pagination
 * - IP address tracking
 * 
 * @version 1.0.0
 */

import type {
  AuditLog,
  AuditLogQuery,
  AuditLogResponse,
  CreateAuditLogPayload,
  RecentActivity,
  AuditAction,
} from "@/lib/types/audit.types";
import { actionIconMap, severityBadgeMap } from "@/lib/types/audit.types";

/**
 * Create an audit log entry
 * 
 * @param payload - Audit log data
 * @param token - Authentication token
 * @returns Created audit log
 * 
 * @example
 * ```ts
 * await createAuditLog({
 *   action: "schedule_updated",
 *   entityType: "schedule",
 *   entityId: "morning",
 *   userId: user.id,
 *   userName: user.username,
 *   description: "Updated morning batch schedule",
 *   metadata: { batchName: "morning" },
 *   severity: "info"
 * }, token);
 * ```
 */
export async function createAuditLog(
  payload: CreateAuditLogPayload,
  token: string
): Promise<AuditLog> {
  const res = await fetch(`${process.env.STRAPI_URL}/api/audit-logs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      data: {
        ...payload,
        severity: payload.severity || "info",
      },
    }),
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.error?.message || "Failed to create audit log");
  }

  return {
    id: json.data.id,
    documentId: json.data.documentId,
    action: json.data.action,
    entityType: json.data.entityType,
    entityId: json.data.entityId,
    userId: json.data.userId,
    userName: json.data.userName,
    userEmail: json.data.userEmail,
    description: json.data.description,
    metadata: json.data.metadata,
    ipAddress: json.data.ipAddress,
    severity: json.data.severity,
    createdAt: json.data.createdAt,
    updatedAt: json.data.updatedAt,
  };
}

/**
 * Query audit logs with flexible filters
 * 
 * @param query - Query parameters
 * @param token - Authentication token
 * @returns Paginated audit logs
 * 
 * @example
 * ```ts
 * const logs = await getAuditLogs({
 *   entityType: "schedule",
 *   page: 1,
 *   pageSize: 10,
 *   sortBy: "createdAt",
 *   sortOrder: "desc"
 * }, token);
 * ```
 */
export async function getAuditLogs(
  query: AuditLogQuery,
  token: string
): Promise<AuditLogResponse> {
  // Build query string
  const params = new URLSearchParams();

  // Pagination
  params.append("pagination[page]", String(query.page || 1));
  params.append("pagination[pageSize]", String(query.pageSize || 25));

  // Sorting
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";
  params.append("sort", `${sortBy}:${sortOrder}`);

  // Filters
  if (query.action) {
    if (Array.isArray(query.action)) {
      query.action.forEach((a) => params.append("filters[action][$in][]", a));
    } else {
      params.append("filters[action][$eq]", query.action);
    }
  }

  if (query.entityType) {
    if (Array.isArray(query.entityType)) {
      query.entityType.forEach((e) =>
        params.append("filters[entityType][$in][]", e)
      );
    } else {
      params.append("filters[entityType][$eq]", query.entityType);
    }
  }

  if (query.userId) {
    params.append("filters[userId][$eq]", String(query.userId));
  }

  if (query.entityId) {
    params.append("filters[entityId][$eq]", query.entityId);
  }

  if (query.severity) {
    params.append("filters[severity][$eq]", query.severity);
  }

  if (query.startDate) {
    params.append("filters[createdAt][$gte]", query.startDate);
  }

  if (query.endDate) {
    params.append("filters[createdAt][$lte]", query.endDate);
  }

  const res = await fetch(
    `${process.env.STRAPI_URL}/api/audit-logs?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch audit logs");
  }

  const json = await res.json();

  return {
    data: json.data.map((item: any) => ({
      id: item.id,
      documentId: item.documentId,
      action: item.action,
      entityType: item.entityType,
      entityId: item.entityId,
      userId: item.userId,
      userName: item.userName,
      userEmail: item.userEmail,
      description: item.description,
      metadata: item.metadata,
      ipAddress: item.ipAddress,
      severity: item.severity,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })),
    meta: json.meta,
  };
}

/**
 * Get recent activity for dashboard display
 * Optimized for UI consumption with minimal data
 * 
 * @param limit - Number of recent activities to fetch
 * @param token - Authentication token
 * @param isAdmin - Whether the user is an admin (admins see all, enrollees see only schedule activities)
 * @returns Recent activity items
 * 
 * @example
 * ```ts
 * const activities = await getRecentActivity(10, token, true);
 * ```
 */
export async function getRecentActivity(
  limit: number = 10,
  token: string,
  isAdmin: boolean = true
): Promise<RecentActivity[]> {
  // Role-based action filtering
  const actions: AuditAction[] = isAdmin
    ? [
        "schedule_created",
        "schedule_updated",
        "payment_completed",
        "enrollment_created",
        "user_registered",
      ]
    : [
        // Enrollees only see schedule-related activities
        "schedule_created",
        "schedule_updated",
      ];

  const response = await getAuditLogs(
    {
      page: 1,
      pageSize: limit,
      sortBy: "createdAt",
      sortOrder: "desc",
      action: actions,
    },
    token
  );

  return response.data.map((log) => ({
    id: log.id!,
    action: log.action,
    description: log.description,
    userName: log.userName,
    timestamp: log.createdAt!,
    severity: log.severity,
    icon: actionIconMap[log.action],
    badge: getBadgeForAction(log.action),
  }));
}

/**
 * Get badge configuration for an action
 * Helper function for UI display
 */
function getBadgeForAction(
  action: string
): { text: string; variant: "default" | "success" | "warning" | "error" } {
  switch (action) {
    case "payment_completed":
      return { text: "Completed", variant: "success" };
    case "enrollment_created":
      return { text: "New Enrollment", variant: "success" };
    case "schedule_created":
      return { text: "Created", variant: "default" };
    case "schedule_updated":
      return { text: "Updated", variant: "default" };
    case "user_registered":
      return { text: "New User", variant: "success" };
    default:
      return { text: "Event", variant: "default" };
  }
}

/**
 * Get audit logs for a specific entity
 * Useful for viewing history of a particular resource
 * 
 * @param entityType - Type of entity
 * @param entityId - ID of the entity
 * @param token - Authentication token
 * @returns Entity's audit trail
 */
export async function getEntityAuditTrail(
  entityType: string,
  entityId: string,
  token: string
): Promise<AuditLog[]> {
  const response = await getAuditLogs(
    {
      entityType: entityType as any,
      entityId,
      sortBy: "createdAt",
      sortOrder: "desc",
      pageSize: 100,
    },
    token
  );

  return response.data;
}

/**
 * Get user activity history
 * 
 * @param userId - User ID
 * @param limit - Number of activities to fetch
 * @param token - Authentication token
 * @returns User's activity history
 */
export async function getUserActivityHistory(
  userId: number,
  limit: number = 50,
  token: string
): Promise<AuditLog[]> {
  const response = await getAuditLogs(
    {
      userId,
      sortBy: "createdAt",
      sortOrder: "desc",
      pageSize: limit,
    },
    token
  );

  return response.data;
}
