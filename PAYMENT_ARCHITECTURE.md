# Payment System Architecture Documentation

## Overview
This document outlines the scalable, future-proof payment architecture implemented for the SkillzNCert platform.

## Architecture Principles

### 1. **Separation of Concerns**
- **Service Layer** (`lib/services/paystack.service.ts`): Pure functions for payment configuration and utilities
- **Hook Layer** (`lib/hooks/usePaystackPayment.ts`): React-specific payment logic and state management
- **Component Layer**: UI components that consume the hook and service

### 2. **Type Safety**
- Full TypeScript support with strict typing
- Explicit interfaces for all payment configurations
- Type-safe metadata handling

### 3. **Reusability**
- Centralized payment logic can be used across:
  - Initial plan purchases
  - Installment payments
  - Custom payment scenarios
- Single source of truth for Paystack configuration

### 4. **Scalability**
- Easy to add new payment types (subscriptions, add-ons, etc.)
- Supports multiple payment gateways (future-proof)
- Configurable through environment variables

## Architecture Components

### 1. Service Layer (`lib/services/paystack.service.ts`)

**Purpose**: Pure utility functions for payment configuration

**Key Functions**:
```typescript
generatePaymentReference()        // Unique transaction IDs
createPlanPaymentConfig()         // Config for new plan purchases
createDuePaymentConfig()          // Config for installment payments
validatePaystackConfig()          // Configuration validation
formatAmountFromKobo()            // Display formatting
convertToKobo()                   // Amount conversion
```

**Benefits**:
- ✅ No React dependencies (can be used in Node.js, testing, etc.)
- ✅ Pure functions (easy to test)
- ✅ Single responsibility
- ✅ Framework-agnostic

### 2. Hook Layer (`lib/hooks/usePaystackPayment.ts`)

**Purpose**: React hook for payment lifecycle management

**Features**:
```typescript
const { initiatePayment, isLoading, error, clearError } = usePaystackPayment();
```

**Responsibilities**:
- Dynamic Paystack module loading
- Loading state management
- Error handling
- Client-side validation
- Payment callbacks

**Benefits**:
- ✅ Encapsulates React-specific logic
- ✅ Reusable across components
- ✅ Consistent error handling
- ✅ Automatic cleanup

### 3. Payment Flow for Installments

```
User clicks "Make Payment"
         ↓
Component creates config using createDuePaymentConfig()
         ↓
Hook initiates Paystack popup
         ↓
User completes payment in Paystack
         ↓
onSuccess callback triggered
         ↓
Update payment due status (markPaymentDueAsPaidAction)
         ↓
Create payment record (createPaymentAction)
         ↓
Refresh dashboard data
         ↓
Show success toast
```

## Implementation Details

### Environment Variables
```bash
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxx    # Required
NEXT_PUBLIC_PAYSTACK_SUBACCOUNT=ACCT_xxxxx       # Optional
```

### Payment Types Supported

#### 1. **Plan Payments** (New Enrollments)
- First-time plan purchases
- Supports Gold (1 payment), Silver (2 installments), Bronze (4 installments)
- Automatic payment due creation for multi-installment plans

#### 2. **Installment Payments** (Due Payments)
- Payment of pending installment dues
- Inline payment (no page redirect)
- Real-time dashboard updates
- Progress tracking

### Data Flow

```
┌─────────────────────┐
│  PaymentsSection    │ (Component)
│  - Displays dues    │
│  - Handles clicks   │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│ usePaystackPayment  │ (Hook)
│  - Manages state    │
│  - Loads Paystack   │
└──────────┬──────────┘
           │
           ↓
┌─────────────────────┐
│ paystack.service    │ (Service)
│  - Config builders  │
│  - Utilities        │
└─────────────────────┘
```

## Key Features

### 1. **Inline Payments**
- No page redirects
- Modal-based payment flow
- Maintains context and state

### 2. **Real-time Updates**
- Instant dashboard refresh after payment
- Optimistic UI updates
- Loading states during processing

### 3. **Error Handling**
```typescript
- Configuration validation
- Network error handling
- Payment cancellation handling
- Fallback UI states
```

### 4. **Progress Tracking**
- Visual progress bars
- Installment counters
- Payment history

### 5. **Metadata Tracking**
Each payment includes comprehensive metadata:
```typescript
{
  type: 'due',
  dueId: string,
  planId: string,
  installmentNumber: number,
  totalInstallments: number,
  enrollmentId: string,
  userId: string
}
```

## Security Considerations

### 1. **No Sensitive Data in URLs**
- Payment amounts passed through secure Paystack config
- No financial data in query parameters

### 2. **Server-Side Verification**
- All payment records created server-side
- Due status updated via secure actions

### 3. **Environment-Based Configuration**
- API keys stored in environment variables
- No hardcoded credentials

## Testing

### Unit Tests
```typescript
// Service functions (pure, easy to test)
expect(convertToKobo(100)).toBe(10000);
expect(generatePaymentReference()).toMatch(/^TRAN\d{8}[A-Z0-9]{5}$/);
expect(formatAmountFromKobo(50000)).toBe("₦500");
```

### Integration Tests
```typescript
// Hook behavior
- Test payment initiation
- Test success callbacks
- Test error handling
- Test loading states
```

## Future Enhancements

### 1. **Multi-Gateway Support**
```typescript
interface PaymentGateway {
  initiate: (config: PaymentConfig) => Promise<void>;
  verify: (reference: string) => Promise<boolean>;
}

class PaystackGateway implements PaymentGateway { ... }
class FlutterwaveGateway implements PaymentGateway { ... }
```

### 2. **Subscription Payments**
- Recurring payment support
- Auto-renewal handling
- Subscription management

### 3. **Payment Plans**
- Flexible installment schedules
- Custom payment intervals
- Early payment bonuses

### 4. **Analytics**
```typescript
- Payment success rates
- Failed payment tracking
- Revenue dashboards
- Installment completion rates
```

## Performance Optimizations

### 1. **Code Splitting**
- Paystack module loaded dynamically
- Only loads when payment initiated
- Reduces initial bundle size

### 2. **Lazy Loading**
```typescript
await import('react-paystack') // Only when needed
```

### 3. **Optimistic Updates**
- UI updates before server confirmation
- Better perceived performance

### 4. **Parallel Data Fetching**
```typescript
Promise.all([getUserPayments(), getUserPaymentDues()])
```

## Best Practices

### 1. **Always Use the Service Layer**
```typescript
// ✅ Good
const config = createDuePaymentConfig(...args);

// ❌ Bad
const config = { amount: 15000, email: '...', ... };
```

### 2. **Centralized Error Handling**
```typescript
// Hook provides consistent error states
const { error, clearError } = usePaystackPayment();
```

### 3. **Loading States**
```typescript
// Always disable buttons during payment processing
disabled={processingDueId === due.documentId || isPaymentLoading}
```

### 4. **Comprehensive Logging**
```typescript
console.log('💳 Initiating payment:', {...});
console.log('✅ Payment successful:', {...});
console.error('❌ Payment error:', {...});
```

## Migration Guide

### From Old Approach:
```typescript
// Old: Router redirect
handlePayment = () => {
  router.push('/payment?dueId=xxx');
}
```

### To New Approach:
```typescript
// New: Inline payment with hook
const { initiatePayment } = usePaystackPayment();

const handlePayment = async (due) => {
  const config = createDuePaymentConfig(...);
  await initiatePayment({
    config,
    onSuccess: (ref) => { /* Update DB */ },
    onClose: () => { /* Handle cancel */ }
  });
}
```

## Troubleshooting

### Common Issues

1. **"Paystack configuration is invalid"**
   - Check `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` is set
   - Verify key starts with `pk_`

2. **Payment popup not appearing**
   - Check browser console for errors
   - Verify Paystack module loads successfully
   - Check ad blockers aren't blocking Paystack

3. **Payment successful but DB not updated**
   - Check server action logs
   - Verify Strapi API permissions
   - Check network requests in DevTools

## Support & Maintenance

### Code Owners
- Payment Service: Senior Backend Engineer
- Payment Hook: Senior Frontend Engineer
- UI Components: Frontend Team

### Documentation
- This file: Architecture overview
- Service JSDoc: Function-level documentation
- Hook comments: Usage examples

### Updates
- Version all payment configurations
- Maintain backward compatibility
- Test with Paystack sandbox before production

---

**Last Updated**: January 29, 2026
**Version**: 2.0.0
**Author**: Senior Software Engineering Team
