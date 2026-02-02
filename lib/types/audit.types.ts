/**
 * Audit Log Types
 * Enterprise-grade audit trail type definitions
 * 
 * @description Provides type-safe interfaces for audit logging across the application
 * @version 1.0.0
 */

/**
 * Action types for audit logging
 * Extensible enum for tracking different user/system actions
 */
export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "payment_completed"
  | "enrollment_created"
  | "enrollment_updated"
  | "schedule_created"
  | "schedule_updated"
  | "user_login"
  | "user_logout"
  | "user_registered";

/**
 * Entity types being audited
 * Categorizes what type of resource is being tracked
 */
export type AuditEntityType =
  | "schedule"
  | "payment"
  | "enrollment"
  | "user"
  | "batch"
  | "system";

/**
 * Severity levels for audit events
 */
export type AuditSeverity = "info" | "warning" | "error" | "critical";

/**
 * Flexible metadata structure
 * Use this to store action-specific data
 */
export interface AuditMetadata {
  /** Previous value for update operations */
  oldValue?: any;
  /** New value for create/update operations */
  newValue?: any;
  /** Payment amount for payment operations */
  amount?: number;
  /** Plan information */
  planName?: string;
  planId?: string;
  /** Batch information */
  batchName?: string;
  /** Additional custom fields */
  [key: string]: any;
}

/**
 * Core audit log entry interface
 */
export interface AuditLog {
  id?: number;
  documentId?: string;
  action: AuditAction;
  entityType: AuditEntityType;
  entityId?: string;
  userId?: number;
  userName?: string;
  userEmail?: string;
  description: string;
  metadata?: AuditMetadata;
  ipAddress?: string;
  severity: AuditSeverity;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Request payload for creating audit logs
 * Excludes auto-generated fields
 */
export interface CreateAuditLogPayload {
  action: AuditAction;
  entityType: AuditEntityType;
  entityId?: string;
  userId?: number;
  userName?: string;
  userEmail?: string;
  description: string;
  metadata?: AuditMetadata;
  ipAddress?: string;
  severity?: AuditSeverity;
}

/**
 * Query parameters for fetching audit logs
 */
export interface AuditLogQuery {
  /** Filter by action type */
  action?: AuditAction | AuditAction[];
  /** Filter by entity type */
  entityType?: AuditEntityType | AuditEntityType[];
  /** Filter by user ID */
  userId?: number;
  /** Filter by entity ID */
  entityId?: string;
  /** Filter by severity */
  severity?: AuditSeverity;
  /** Pagination: page number (1-based) */
  page?: number;
  /** Pagination: items per page */
  pageSize?: number;
  /** Sort order */
  sortBy?: "createdAt" | "action" | "severity";
  sortOrder?: "asc" | "desc";
  /** Date range filters */
  startDate?: string;
  endDate?: string;
}

/**
 * Response structure for audit log queries
 */
export interface AuditLogResponse {
  data: AuditLog[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Recent activity item (simplified for UI display)
 */
export interface RecentActivity {
  id: number;
  action: AuditAction;
  description: string;
  userName?: string;
  timestamp: string;
  severity: AuditSeverity;
  icon?: string;
  badge?: {
    text: string;
    variant: "default" | "success" | "warning" | "error";
  };
}

/**
 * Helper function to generate human-readable descriptions
 */
export const generateAuditDescription = {
  scheduleCreated: (batchName: string, userName: string) =>
    `${userName} created schedule for ${batchName} batch`,
  
  scheduleUpdated: (batchName: string, userName: string) =>
    `${userName} updated schedule for ${batchName} batch`,
  
  paymentCompleted: (userName: string, amount: number, planName: string) =>
    `${userName} completed payment of ₹${amount.toLocaleString()} for ${planName}`,
  
  enrollmentCreated: (userName: string, courseName?: string) =>
    courseName 
      ? `${userName} enrolled in ${courseName}`
      : `${userName} joined the platform`,
  
  enrollmentUpdated: (userName: string, status: string) =>
    `${userName}'s enrollment status changed to ${status}`,
  
  userRegistered: (userName: string) =>
    `${userName} registered as a new user`,
  
  userLogin: (userName: string) =>
    `${userName} logged in`,
};

/**
 * Helper to map action to icon (for UI display)
 */
export const actionIconMap: Record<AuditAction, string> = {
  create: "➕",
  update: "✏️",
  delete: "🗑️",
  payment_completed: "💳",
  enrollment_created: "🎓",
  enrollment_updated: "📝",
  schedule_created: "📅",
  schedule_updated: "🔄",
  user_login: "🔐",
  user_logout: "👋",
  user_registered: "👤",
};

/**
 * Helper to map severity to badge variant
 */
export const severityBadgeMap: Record<AuditSeverity, "default" | "success" | "warning" | "error"> = {
  info: "default",
  warning: "warning",
  error: "error",
  critical: "error",
};
