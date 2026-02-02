# Audit Log System Documentation

## Overview
Enterprise-grade audit trail system for tracking all user actions and system events across the platform. Designed with scalability, performance, and reusability in mind.

## Architecture

### 1. Database Layer (Strapi)
**Location**: `skillzncert/src/api/audit-log/`

- **Schema**: `content-types/audit-log/schema.json`
- **Collection**: `audit_logs`
- **Features**:
  - Flexible action types (create, update, delete, payment_completed, enrollment_created, etc.)
  - Entity type categorization (schedule, payment, enrollment, user, etc.)
  - User tracking (userId, userName, userEmail)
  - JSON metadata for flexible data storage
  - Severity levels (info, warning, error, critical)
  - Optional IP address tracking
  - Automatic timestamps

### 2. Type System
**Location**: `lib/types/audit.types.ts`

**Key Types**:
- `AuditAction` - Extensible enum for actions
- `AuditEntityType` - Resource categories
- `AuditSeverity` - Event severity levels
- `AuditLog` - Core audit entry interface
- `CreateAuditLogPayload` - Request payload
- `RecentActivity` - UI-optimized display format

**Helper Functions**:
- `generateAuditDescription` - Human-readable descriptions
- `actionIconMap` - UI icons for actions
- `severityBadgeMap` - Badge variant mapping

### 3. Service Layer
**Location**: `lib/services/audit.service.ts`

**Functions**:
- `createAuditLog()` - Create audit entries
- `getAuditLogs()` - Query with flexible filters
- `getRecentActivity()` - Dashboard-optimized queries
- `getEntityAuditTrail()` - Entity history
- `getUserActivityHistory()` - User-specific logs

**Features**:
- Pagination support
- Advanced filtering (action, entity, user, date range)
- Sorting capabilities
- Type-safe API
- Performance optimized

### 4. Action Layer
**Location**: `actions/audit/audit.actions.ts`

**Server Actions**:
- `logAuditAction()` - Primary logging function
- `getAuditLogsAction()` - Query audit logs
- `getRecentActivityAction()` - Dashboard activity

**Helper Actions** (Pre-configured):
- `logScheduleChange()` - Schedule auditing
- `logPaymentCompleted()` - Payment auditing
- `logEnrollmentCreated()` - Enrollment auditing

**Features**:
- Auto-fills user information
- Authentication checks
- Graceful error handling (doesn't fail main operations)

## Integration Points

### 1. Schedule Management
**File**: `actions/schedule/schedule.actions.ts`

```typescript
await logScheduleChange(
  isUpdate ? "schedule_updated" : "schedule_created",
  BATCH_LABELS[batchName],
  { scheduleData: schedule, batchId: result.documentId }
);
```

**Logs**:
- Schedule creation for each batch (morning/noon/evening)
- Schedule updates with batch details

### 2. Payment Processing
**File**: `actions/payment/create-payment.actions.ts`

```typescript
await logPaymentCompleted(
  userName,
  amount,
  planName,
  paymentId,
  { paymentMode, month, year, planId, enrollmentId }
);
```

**Logs**:
- Payment completions with amount and plan details
- User information and payment metadata

### 3. Enrollment
**File**: `actions/enrollment/create-enrollment.actions.ts`

```typescript
await logEnrollmentCreated(
  userName,
  enrollmentId,
  courseName,
  { firstName, lastName, country, yearOfStudy }
);
```

**Logs**:
- New enrollments with user details
- Student information metadata

### 4. Dashboard Display
**File**: `features/dashboard/OverviewSection.tsx`

**Features**:
- Real-time activity feed
- Time-ago formatting
- Badge indicators
- Loading states
- Empty states

## Usage Examples

### Creating Custom Audit Logs

```typescript
import { logAuditAction } from "@/actions/audit/audit.actions";

// Simple log
await logAuditAction({
  action: "update",
  entityType: "user",
  entityId: userId,
  description: "User profile updated",
  severity: "info"
});

// With metadata
await logAuditAction({
  action: "create",
  entityType: "batch",
  description: "Created new batch",
  metadata: {
    batchName: "Advanced Training",
    capacity: 30,
    startDate: "2026-03-01"
  },
  severity: "info"
});
```

### Querying Audit Logs

```typescript
import { getAuditLogsAction } from "@/actions/audit/audit.actions";

// Get payment logs
const result = await getAuditLogsAction({
  action: "payment_completed",
  page: 1,
  pageSize: 20,
  sortBy: "createdAt",
  sortOrder: "desc"
});

// Filter by entity
const scheduleHistory = await getAuditLogsAction({
  entityType: "schedule",
  startDate: "2026-01-01",
  endDate: "2026-12-31"
});

// User activity
const userLogs = await getAuditLogsAction({
  userId: 123,
  pageSize: 50
});
```

### Dashboard Integration

```typescript
import { getRecentActivityAction } from "@/actions/audit/audit.actions";

const activities = await getRecentActivityAction(10);
// Returns formatted activity array ready for UI display
```

## Extending the System

### Adding New Action Types

1. **Update Strapi Schema**:
   ```json
   // skillzncert/src/api/audit-log/content-types/audit-log/schema.json
   "action": {
     "enum": [
       "existing_actions",
       "new_custom_action"
     ]
   }
   ```

2. **Update TypeScript Types**:
   ```typescript
   // lib/types/audit.types.ts
   export type AuditAction = 
     | "existing_actions"
     | "new_custom_action";
   ```

3. **Add Icon Mapping**:
   ```typescript
   export const actionIconMap: Record<AuditAction, string> = {
     // ...existing
     new_custom_action: "🆕",
   };
   ```

4. **Create Helper Action** (Optional):
   ```typescript
   // actions/audit/audit.actions.ts
   export async function logCustomAction(...) {
     return logAuditAction({
       action: "new_custom_action",
       // ...
     });
   }
   ```

### Adding New Entity Types

1. Update Strapi schema enum
2. Update TypeScript `AuditEntityType`
3. Use in audit logging calls

## Performance Considerations

### Optimization Strategies
1. **Async Logging**: Audit logs don't block main operations
2. **Pagination**: All queries support pagination
3. **Indexing**: Strapi automatically indexes common fields
4. **Caching**: Use `cache: "no-store"` for real-time data
5. **Error Handling**: Logging failures don't affect main operations

### Best Practices
- Use pre-configured helper functions when possible
- Include relevant metadata for better traceability
- Set appropriate severity levels
- Batch related operations
- Query with filters to reduce data transfer

## Security

### Authentication
- All actions require valid authentication token
- Auto-fills user information from session
- Unauthorized requests are rejected

### Data Privacy
- Sensitive data should not be logged in plain text
- Use metadata for structured data
- IP addresses are optional
- User emails are stored but can be omitted

## Monitoring

### Key Metrics to Track
- Total audit logs per day
- Actions by type distribution
- User activity patterns
- Error/critical severity events
- System performance (log creation time)

### Maintenance
- Regular archive old logs (implementation pending)
- Monitor database size
- Review and update action types periodically
- Clean up test data

## Future Enhancements

### Planned Features
1. Log retention policies and automatic archiving
2. Advanced analytics dashboard
3. Real-time notifications for critical events
4. Export functionality (CSV, PDF)
5. Detailed filtering UI
6. Log comparison and diff views
7. Compliance reporting
8. Audit log signing/verification

### Integration Opportunities
- User profile changes
- Settings modifications
- Batch management
- Report generation
- Email notifications
- File uploads/downloads
- API access logs

## Troubleshooting

### Common Issues

**Audit logs not appearing**:
- Check authentication token
- Verify Strapi schema is properly deployed
- Check console for errors
- Ensure action types match enum values

**Performance issues**:
- Use pagination
- Add date range filters
- Optimize metadata size
- Consider caching for dashboards

**Missing user information**:
- Ensure user is authenticated
- Check session validity
- Verify user object structure

## API Reference

### Service Functions

#### createAuditLog(payload, token)
Creates an audit log entry.

**Parameters**:
- `payload`: CreateAuditLogPayload
- `token`: string

**Returns**: Promise<AuditLog>

#### getAuditLogs(query, token)
Queries audit logs with filters.

**Parameters**:
- `query`: AuditLogQuery
- `token`: string

**Returns**: Promise<AuditLogResponse>

#### getRecentActivity(limit, token)
Gets recent activity for dashboard.

**Parameters**:
- `limit`: number (default: 10)
- `token`: string

**Returns**: Promise<RecentActivity[]>

### Action Functions

All server actions return a consistent response:
```typescript
{
  success: boolean;
  message?: string;
  data?: any;
}
```

## Conclusion

This audit log system provides a robust, scalable foundation for tracking all system activities. It's designed to be easily extended, performs well under load, and follows enterprise best practices for security and compliance.
