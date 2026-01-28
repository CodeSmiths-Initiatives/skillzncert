/**
 * Role & Permission Management
 * Centralized, scalable role-based access control
 * 
 * Future Enhancement: Store roles in database/JWT token
 * For now: Hardcoded mapping with environment override
 */

import type { AuthUser } from "./get-auth-user";

export type UserRole = "admin" | "user" | "instructor" | "guest";

/**
 * Admin user IDs - Centralized configuration
 * Future: Move to database or environment config
 */
const ADMIN_USER_IDS = [1]; // Can be extended to [1, 2, 3]

/**
 * Permission definitions for different operations
 */
export const ROLE_PERMISSIONS = {
  admin: [
    "view:all_enrollments",
    "view:metrics",
    "view:revenue",
    "view:payment_analytics",
    "manage:batches",
    "manage:schedules",
    "manage:users",
    "edit:settings",
  ],
  instructor: [
    "view:students_in_batch",
    "view:batch_metrics",
    "submit:attendance",
    "view:assignment",
  ],
  user: [
    "view:own_dashboard",
    "view:own_enrollment",
    "view:own_payments",
    "submit:assignment",
  ],
  guest: [],
} as const;

/**
 * Determine user role based on ID
 * This is the single source of truth for role determination
 * 
 * @param user - Authenticated user object
 * @returns User role
 */
export function getUserRole(user: AuthUser | null): UserRole {
  if (!user) return "guest";

  // Check if user is admin
  if (ADMIN_USER_IDS.includes(user.id)) {
    return "admin";
  }

  // Default to user role (can be extended with instructor check)
  return "user";
}

/**
 * Check if user has specific permission
 * @param user - Authenticated user
 * @param permission - Required permission
 * @returns true if user has permission
 */
export function hasPermission(
  user: AuthUser | null,
  permission: keyof typeof ROLE_PERMISSIONS[keyof typeof ROLE_PERMISSIONS] | string
): boolean {
  const role = getUserRole(user);
  const permissions = ROLE_PERMISSIONS[role];
  return (permissions as unknown as any[]).includes(permission);
}

/**
 * Check if user is admin
 * @param user - Authenticated user
 * @returns true if user is admin
 */
export function isAdmin(user: AuthUser | null): boolean {
  return getUserRole(user) === "admin";
}

/**
 * Verify user has required permission or throw error
 * @param user - Authenticated user
 * @param permission - Required permission
 * @throws Error if user lacks permission
 */
export function requirePermission(
  user: AuthUser | null,
  permission: string
): void {
  if (!hasPermission(user, permission)) {
    throw new PermissionError(
      `Permission denied: ${permission}`,
      getUserRole(user)
    );
  }
}

/**
 * Custom error for permission violations
 */
export class PermissionError extends Error {
  public readonly userRole: UserRole;

  constructor(message: string, userRole: UserRole) {
    super(message);
    this.name = "PermissionError";
    this.userRole = userRole;
  }
}
