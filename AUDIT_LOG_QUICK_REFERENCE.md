# Audit Log System - Quick Reference Guide

## 🚀 Quick Start

### 1. Log an Action (Simplest)
```typescript
import { logAuditAction } from "@/actions/audit/audit.actions";

await logAuditAction({
  action: "update",
  entityType: "user",
  description: "User profile updated"
});
```

### 2. Use Pre-configured Helpers
```typescript
import { 
  logScheduleChange, 
  logPaymentCompleted, 
  logEnrollmentCreated 
} from "@/actions/audit/audit.actions";

// Schedule changes
await logScheduleChange("schedule_updated", "Morning Batch");

// Payments
await logPaymentCompleted("John Doe", 5000, "Basic Plan", "payment_123");

// Enrollments
await logEnrollmentCreated("Jane Smith", "enroll_456", "React Course");
```

### 3. Display Recent Activity
```typescript
import { getRecentActivityAction } from "@/actions/audit/audit.actions";

const { data: activities } = await getRecentActivityAction(10);
// activities is ready for UI display
```

## 📊 Available Action Types

| Action Type | Description | Use Case |
|------------|-------------|----------|
| `create` | Resource created | Generic creation |
| `update` | Resource updated | Generic update |
| `delete` | Resource deleted | Generic deletion |
| `payment_completed` | Payment successful | Payment processing |
| `enrollment_created` | New enrollment | User registration |
| `enrollment_updated` | Enrollment modified | Status changes |
| `schedule_created` | Schedule added | Batch scheduling |
| `schedule_updated` | Schedule changed | Schedule modifications |
| `user_login` | User logged in | Authentication |
| `user_logout` | User logged out | Session end |
| `user_registered` | New user signup | Registration |

## 🎯 Entity Types

- `schedule` - Class schedules
- `payment` - Payment transactions
- `enrollment` - User enrollments
- `user` - User accounts
- `batch` - Training batches
- `system` - System events

## 🔧 Common Patterns

### Pattern 1: Action with Metadata
```typescript
await logAuditAction({
  action: "update",
  entityType: "schedule",
  entityId: "morning_batch",
  description: "Updated morning batch timing",
  metadata: {
    oldTime: "6:00 AM",
    newTime: "7:00 AM",
    dayOfWeek: "Monday"
  },
  severity: "info"
});
```

### Pattern 2: Query Specific Logs
```typescript
// Get last 30 days of payments
const result = await getAuditLogsAction({
  action: "payment_completed",
  startDate: "2026-01-01",
  endDate: "2026-01-31",
  pageSize: 50
});

// Get user's activity
const userActivity = await getAuditLogsAction({
  userId: 123,
  sortBy: "createdAt",
  sortOrder: "desc"
});
```

### Pattern 3: Integrate in Existing Actions
```typescript
export async function myCustomAction(data: any) {
  try {
    // Main operation
    const result = await performOperation(data);
    
    // Log audit trail (non-blocking)
    await logAuditAction({
      action: "custom_action",
      entityType: "custom_entity",
      description: "Custom operation completed",
      metadata: { result }
    });
    
    return { success: true, data: result };
  } catch (error) {
    return { success: false };
  }
}
```

## 🎨 UI Integration

### Display in Dashboard
```tsx
import { getRecentActivityAction } from "@/actions/audit/audit.actions";
import type { RecentActivity } from "@/lib/types/audit.types";

export function ActivityFeed() {
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  
  useEffect(() => {
    async function load() {
      const result = await getRecentActivityAction(10);
      if (result.success) {
        setActivities(result.data);
      }
    }
    load();
  }, []);
  
  return (
    <div>
      {activities.map(activity => (
        <div key={activity.id}>
          <span>{activity.icon}</span>
          <p>{activity.description}</p>
          <Badge>{activity.badge?.text}</Badge>
        </div>
      ))}
    </div>
  );
}
```

## 🔍 Filtering Options

```typescript
interface AuditLogQuery {
  action?: AuditAction | AuditAction[];      // Filter by action(s)
  entityType?: AuditEntityType;              // Filter by entity
  userId?: number;                           // Filter by user
  entityId?: string;                         // Filter by specific entity
  severity?: AuditSeverity;                  // Filter by severity
  page?: number;                             // Pagination
  pageSize?: number;                         // Items per page
  sortBy?: "createdAt" | "action";          // Sort field
  sortOrder?: "asc" | "desc";               // Sort direction
  startDate?: string;                        // Date range start
  endDate?: string;                          // Date range end
}
```

## ⚡ Performance Tips

1. **Use Pagination**: Always specify `pageSize` for large queries
   ```typescript
   await getAuditLogsAction({ pageSize: 25, page: 1 });
   ```

2. **Filter Early**: Use specific filters to reduce data
   ```typescript
   await getAuditLogsAction({ 
     action: "payment_completed",
     startDate: "2026-01-01" 
   });
   ```

3. **Non-Blocking**: Audit logging doesn't block main operations
   ```typescript
   // This is fine - logging happens asynchronously
   await logAuditAction({ ... }); // Won't delay response
   ```

## 🛡️ Security Notes

- ✅ All actions require authentication
- ✅ User info auto-filled from session
- ✅ Logging failures don't affect main operations
- ⚠️ Don't log sensitive data (passwords, tokens)
- ⚠️ Be mindful of metadata size

## 📝 Severity Levels

```typescript
severity: "info"      // Normal operations (default)
severity: "warning"   // Potential issues
severity: "error"     // Errors occurred
severity: "critical"  // System-critical events
```

## 🔄 Extending the System

### Add New Action Type
1. Update Strapi schema enum
2. Update `AuditAction` in `lib/types/audit.types.ts`
3. Add icon in `actionIconMap`
4. Create helper function (optional)

### Create Custom Helper
```typescript
// actions/audit/audit.actions.ts
export async function logCustomEvent(
  description: string,
  metadata?: any
) {
  return logAuditAction({
    action: "custom_action",
    entityType: "custom_entity",
    description,
    metadata,
    severity: "info"
  });
}
```

## 🐛 Debugging

### Check if logs are created
```typescript
const logs = await getAuditLogsAction({ 
  pageSize: 1, 
  sortBy: "createdAt",
  sortOrder: "desc" 
});
console.log("Latest log:", logs.data?.[0]);
```

### Verify action types match
```typescript
// Make sure your action matches the enum
const validAction: AuditAction = "payment_completed"; // ✅
const invalidAction = "payment_complete"; // ❌ Will fail
```

## 📚 Files Reference

| Purpose | File Location |
|---------|--------------|
| Strapi Schema | `skillzncert/src/api/audit-log/content-types/audit-log/schema.json` |
| Types | `lib/types/audit.types.ts` |
| Service | `lib/services/audit.service.ts` |
| Actions | `actions/audit/audit.actions.ts` |
| Usage Example | See `OverviewSection.tsx` for UI integration |

## 🎯 Best Practices

1. **Use Descriptive Messages**: Make descriptions human-readable
2. **Include Context**: Add relevant metadata
3. **Appropriate Severity**: Match severity to event importance
4. **Don't Over-Log**: Log meaningful events, not every operation
5. **Test Integration**: Verify logs appear in dashboard

## 💡 Common Use Cases

```typescript
// User registration
await logAuditAction({
  action: "user_registered",
  entityType: "user",
  description: `${userName} registered successfully`
});

// Configuration change
await logAuditAction({
  action: "update",
  entityType: "system",
  description: "System configuration updated",
  metadata: { setting: "theme", value: "dark" }
});

// Critical error
await logAuditAction({
  action: "error",
  entityType: "system",
  description: "Payment gateway connection failed",
  severity: "critical"
});
```

---

For detailed documentation, see [AUDIT_LOG_SYSTEM.md](./AUDIT_LOG_SYSTEM.md)
