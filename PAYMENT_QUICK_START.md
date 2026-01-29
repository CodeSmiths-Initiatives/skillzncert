# Payment System - Quick Start Guide

## Summary

✅ **Scalable, enterprise-grade payment architecture implemented**

### What Was Built

1. **Centralized Payment Service** (`lib/services/paystack.service.ts`)
   - Pure utility functions
   - Type-safe configuration builders
   - Framework-agnostic

2. **React Payment Hook** (`lib/hooks/usePaystackPayment.ts`)
   - Manages payment lifecycle
   - Loading and error states
   - Reusable across components

3. **Inline Payment Flow** (Updated `PaymentsSection.tsx`)
   - No page redirects
   - Real-time updates
   - Progress tracking
   - 10-day payment window

## How It Works

### For Users:

1. View upcoming installments in Dashboard → Payments
2. Click "Make Payment" button (appears 10 days before due date)
3. Paystack popup opens with correct amount
4. Complete payment
5. Dashboard auto-refreshes with updated status

### For Developers:

```typescript
// 1. Import the hook
import { usePaystackPayment } from '@/lib/hooks/usePaystackPayment';
import { createDuePaymentConfig } from '@/lib/services/paystack.service';

// 2. Use the hook in your component
const { initiatePayment, isLoading, error } = usePaystackPayment();

// 3. Create payment config
const config = createDuePaymentConfig(
  userEmail,
  amountInKobo,
  dueId,
  planId,
  planName,
  installmentNumber,
  totalInstallments
);

// 4. Initiate payment
await initiatePayment({
  config,
  onSuccess: (reference) => {
    // Handle success
    console.log('Payment successful:', reference);
  },
  onClose: () => {
    // Handle cancellation
    console.log('Payment cancelled');
  }
});
```

## Setup Instructions

### 1. Environment Variables

Add to `.env.local`:
```bash
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_PAYSTACK_SUBACCOUNT=ACCT_xtlrfkipcz3pp2p
```

### 2. Strapi Configuration

Ensure payment-due collection has permissions set for Authenticated role:
- ✅ create
- ✅ find  
- ✅ findOne
- ✅ update

### 3. Test Payment Flow

1. **Create a test user** with Silver or Bronze plan
2. **Make first payment** (creates payment dues automatically)
3. **Wait for dues to appear** in Dashboard → Payments
4. **Test payment window logic**:
   - More than 10 days: Button locked
   - Within 10 days: Button active
5. **Complete payment** via Paystack test card
6. **Verify**:
   - Due status updated to "paid"
   - Payment record created
   - Dashboard refreshed

### Paystack Test Card

```
Card Number:    4084 0840 8408 4081
Expiry:         Any future date
CVV:            Any 3 digits
PIN:            0000
OTP:            123456
```

## Key Features

### ✅ Type Safety
- Full TypeScript support
- Strict typing for all configs
- No `any` types in production code

### ✅ Error Handling
```typescript
const { error, clearError } = usePaystackPayment();

if (error) {
  console.error('Payment error:', error);
  clearError();
}
```

### ✅ Loading States
```typescript
const { isLoading } = usePaystackPayment();

<Button disabled={isLoading}>
  {isLoading ? 'Processing...' : 'Make Payment'}
</Button>
```

### ✅ Reusable Configuration
```typescript
// Plan payment
const planConfig = createPlanPaymentConfig(email, amount, planId, planName);

// Due payment  
const dueConfig = createDuePaymentConfig(email, amount, dueId, ...);

// Both use same initiatePayment() function
```

### ✅ Comprehensive Metadata
Every payment includes:
- Payment type (plan/due/custom)
- Plan information
- Installment details
- User and enrollment IDs
- Custom fields for Paystack dashboard

### ✅ Real-time Updates
- Automatic dashboard refresh after payment
- Optimistic UI updates
- Toast notifications

## Architecture Benefits

### Performance
- ⚡ Dynamic imports (code splitting)
- ⚡ Lazy loading of Paystack
- ⚡ Parallel data fetching

### Scalability
- 🚀 Easy to add new payment types
- 🚀 Multi-gateway support ready
- 🚀 Environment-based config

### Maintainability
- 📦 Single responsibility principle
- 📦 Separation of concerns
- 📦 Comprehensive documentation
- 📦 Easy to test (pure functions)

### Security
- 🔒 No sensitive data in URLs
- 🔒 Server-side verification
- 🔒 Environment variables for keys
- 🔒 Type-safe metadata

## Common Use Cases

### 1. New Plan Purchase
```typescript
const config = createPlanPaymentConfig(
  email,
  amount,
  'silver',
  'Silver Plan'
);
```

### 2. Installment Payment
```typescript
const config = createDuePaymentConfig(
  email,
  amount,
  dueId,
  'bronze',
  'Bronze Plan',
  2, // second installment
  4  // out of 4 total
);
```

### 3. Custom Payment
```typescript
const config = {
  reference: generatePaymentReference(),
  email,
  amount,
  currency: 'NGN',
  metadata: {
    type: 'custom',
    description: 'Add-on service'
  }
};
```

## Troubleshooting

### Issue: Payment button not appearing
**Solution**: Check payment window logic (10 days before due date)

### Issue: Paystack popup blocked
**Solution**: Disable ad blockers, check browser console

### Issue: Payment successful but DB not updated  
**Solution**: Check Strapi permissions, verify API token

### Issue: "Paystack configuration is invalid"
**Solution**: Verify environment variables are set correctly

## Next Steps

### Immediate:
1. ✅ Set up environment variables
2. ✅ Configure Strapi permissions
3. ✅ Test with Paystack test card

### Future Enhancements:
- Recurring subscription payments
- Multiple payment gateway support
- Payment analytics dashboard
- Partial payment support
- Payment reminders via email

## Documentation

- Full Architecture: `PAYMENT_ARCHITECTURE.md`
- API Reference: JSDoc in service files
- Example Usage: This file

## Support

For issues or questions:
1. Check browser console for errors
2. Review architecture documentation
3. Check Strapi API logs
4. Verify Paystack dashboard

---

**Last Updated**: January 29, 2026  
**Status**: ✅ Production Ready  
**Version**: 2.0.0
