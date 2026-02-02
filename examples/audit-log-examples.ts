/**
 * Audit Log Usage Examples
 * 
 * This file contains practical examples of how to use the audit log system
 * in different scenarios throughout the application.
 */

// ============================================================================
// EXAMPLE 1: Basic Usage in a Server Action
// ============================================================================

"use server";

import { logAuditAction } from "@/actions/audit/audit.actions";

export async function updateUserProfileAction(userId: number, data: any) {
  try {
    // Perform the main operation
    const result = await updateUserProfile(userId, data);
    
    // Log the audit trail
    await logAuditAction({
      action: "update",
      entityType: "user",
      entityId: userId.toString(),
      description: `User profile updated`,
      metadata: {
        updatedFields: Object.keys(data),
        timestamp: new Date().toISOString()
      },
      severity: "info"
    });
    
    return { success: true, data: result };
  } catch (error) {
    // Log errors too
    await logAuditAction({
      action: "update",
      entityType: "user",
      entityId: userId.toString(),
      description: `Failed to update user profile`,
      metadata: { error: error instanceof Error ? error.message : String(error) },
      severity: "error"
    });
    
    return { success: false, error };
  }
}

// ============================================================================
// EXAMPLE 2: Using Pre-configured Helpers
// ============================================================================

import {
  logScheduleChange,
  logPaymentCompleted,
  logEnrollmentCreated
} from "@/actions/audit/audit.actions";

export async function createMorningSchedule(scheduleData: any) {
  // Create schedule
  const schedule = await createSchedule(scheduleData);
  
  // Log with helper (cleaner code)
  await logScheduleChange(
    "schedule_created",
    "Morning Batch",
    { scheduleId: schedule.id }
  );
  
  return schedule;
}

export async function processPayment(paymentData: any) {
  const payment = await executePayment(paymentData);
  
  // Helper automatically formats description
  await logPaymentCompleted(
    paymentData.userName,
    paymentData.amount,
    paymentData.planName,
    payment.id,
    { transactionId: payment.transactionId }
  );
  
  return payment;
}

// ============================================================================
// EXAMPLE 3: Component with Recent Activity
// ============================================================================

"use client";

import { useEffect, useState } from "react";
import { getRecentActivityAction } from "@/actions/audit/audit.actions";
import type { RecentActivity } from "@/lib/types/audit.types";

export function RecentActivityWidget() {
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadActivities() {
      try {
        const result = await getRecentActivityAction(10);
        if (result.success) {
          setActivities(result.data);
        }
      } catch (error) {
        console.error("Failed to load activities:", error);
      } finally {
        setLoading(false);
      }
    }

    loadActivities();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h2>Recent Activity</h2>
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center gap-3">
          <span className="text-2xl">{activity.icon}</span>
          <div className="flex-1">
            <p className="font-medium">{activity.description}</p>
            <p className="text-sm text-gray-500">
              {getTimeAgo(activity.timestamp)}
            </p>
          </div>
          {activity.badge && (
            <span className={`badge badge-${activity.badge.variant}`}>
              {activity.badge.text}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Advanced Querying
// ============================================================================

import { getAuditLogsAction } from "@/actions/audit/audit.actions";

export async function getPaymentHistory(userId?: number) {
  const result = await getAuditLogsAction({
    action: "payment_completed",
    userId: userId, // Optional: filter by user
    sortBy: "createdAt",
    sortOrder: "desc",
    pageSize: 50,
    page: 1
  });

  return result.data;
}

export async function getEntityHistory(entityType: string, entityId: string) {
  const result = await getAuditLogsAction({
    entityType: entityType as any,
    entityId: entityId,
    sortBy: "createdAt",
    sortOrder: "desc"
  });

  // Get all actions performed on this entity
  return result.data;
}

export async function getRecentErrors() {
  const result = await getAuditLogsAction({
    severity: "error",
    pageSize: 20,
    sortBy: "createdAt",
    sortOrder: "desc"
  });

  return result.data;
}

// ============================================================================
// EXAMPLE 5: Batch Operations Logging
// ============================================================================

export async function bulkUpdateStudents(students: any[]) {
  const results = [];
  
  for (const student of students) {
    const result = await updateStudent(student);
    results.push(result);
  }
  
  // Log summary instead of individual operations
  await logAuditAction({
    action: "update",
    entityType: "user",
    description: `Bulk updated ${students.length} students`,
    metadata: {
      count: students.length,
      studentIds: students.map(s => s.id),
      updateType: "batch_operation"
    },
    severity: "info"
  });
  
  return results;
}

// ============================================================================
// EXAMPLE 6: Custom Action Types (After extending the system)
// ============================================================================

export async function exportReport(reportType: string) {
  const data = await generateReport(reportType);
  
  await logAuditAction({
    action: "create", // Using generic action
    entityType: "system",
    description: `Generated ${reportType} report`,
    metadata: {
      reportType,
      rowCount: data.length,
      exportedAt: new Date().toISOString()
    },
    severity: "info"
  });
  
  return data;
}

// ============================================================================
// EXAMPLE 7: Error Handling with Audit Logs
// ============================================================================

export async function criticalOperation(data: any) {
  try {
    const result = await performCriticalTask(data);
    
    await logAuditAction({
      action: "update",
      entityType: "system",
      description: "Critical operation completed successfully",
      severity: "info"
    });
    
    return { success: true, result };
  } catch (error) {
    // Log critical errors
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    await logAuditAction({
      action: "update",
      entityType: "system",
      description: `Critical operation failed: ${errorMessage}`,
      metadata: {
        error: errorMessage,
        stack: errorStack,
        input: data
      },
      severity: "critical"
    });
    
    // Also notify admins, send alerts, etc.
    return { success: false, error };
  }
}

// ============================================================================
// EXAMPLE 8: Date-based Filtering
// ============================================================================

export async function getMonthlyReport(year: number, month: number) {
  const startDate = new Date(year, month - 1, 1).toISOString();
  const endDate = new Date(year, month, 0, 23, 59, 59).toISOString();
  
  const result = await getAuditLogsAction({
    action: ["payment_completed", "enrollment_created"],
    startDate,
    endDate,
    pageSize: 1000
  });
  
  // Process data for report
  const payments = result.data?.data.filter(log => log.action === "payment_completed");
  const enrollments = result.data?.data.filter(log => log.action === "enrollment_created");
  
  return {
    totalPayments: payments?.length || 0,
    totalEnrollments: enrollments?.length || 0,
    logs: result.data
  };
}

// ============================================================================
// EXAMPLE 9: Real-time Activity Feed (with polling)
// ============================================================================

export function ActivityFeedWithPolling() {
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  
  useEffect(() => {
    async function loadActivities() {
      const result = await getRecentActivityAction(20);
      if (result.success) {
        setActivities(result.data);
      }
    }
    
    // Initial load
    loadActivities();
    
    // Poll every 30 seconds
    const interval = setInterval(loadActivities, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div>
      <h3>Live Activity Feed</h3>
      {activities.map(activity => (
        <ActivityItem key={activity.id} activity={activity} />
      ))}
    </div>
  );
}

// ============================================================================
// EXAMPLE 10: Metadata Best Practices
// ============================================================================

export async function demonstrateMetadata() {
  // Good: Structured, relevant data
  await logAuditAction({
    action: "payment_completed",
    entityType: "payment",
    description: "Payment processed",
    metadata: {
      amount: 5000,
      currency: "INR",
      paymentMethod: "UPI",
      transactionId: "TXN123456",
      planId: "basic-monthly"
    }
  });
  
  // Good: Include context for updates
  await logAuditAction({
    action: "update",
    entityType: "schedule",
    description: "Schedule timing changed",
    metadata: {
      batchName: "Morning Batch",
      oldTime: { start: "6:00 AM", end: "9:00 AM" },
      newTime: { start: "7:00 AM", end: "10:00 AM" },
      changedBy: "admin@example.com"
    }
  });
  
  // Bad: Too much data (avoid)
  // await logAuditAction({
  //   metadata: {
  //     entireDatabaseDump: {...} // Don't do this!
  //   }
  // });
  
  // Bad: Sensitive data (avoid)
  // await logAuditAction({
  //   metadata: {
  //     password: "secret123", // Never log passwords!
  //     token: "Bearer xyz..." // Never log tokens!
  //   }
  // });
}

// ============================================================================
// Helper Functions
// ============================================================================

function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  return 'Just now';
}

// Placeholder functions (replace with actual implementations)
async function updateUserProfile(userId: number, data: any) { return data; }
async function createSchedule(data: any) { return { id: "1" }; }
async function executePayment(data: any) { return { id: "1", transactionId: "TXN123" }; }
async function updateStudent(student: any) { return student; }
async function generateReport(type: string) { return []; }
async function performCriticalTask(data: any) { return data; }
