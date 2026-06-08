# Paystack Integration & Backend Collection Checklist

## 🔵 PAYSTACK SETUP REQUIRED

### 1. **Environment Variables** (`.env.local`)

```env
# Paystack Public Key (visible to frontend)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxxxx

# Paystack Secret Key (backend only - secure)
PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxxxx

# Paystack Subaccount Code (optional - for splitting payments)
PAYSTACK_SUBACCOUNT_CODE=ACCT_xxxxxxxx
```

### 2. **Paystack Flow (Frontend - Already Implemented ✅)**

```
Payment.tsx (Paystack Modal Opens)
    ↓
User enters card details → Paystack processes
    ↓
    ├─ onSuccess: PaymentVerify.tsx (with reference)
    └─ onClose: Redirect with failed status
```

### 3. **What's Configured in Payment.tsx** ✅

- ✅ Plan selection (Online & SIWES tabs)
- ✅ Paystack modal initialization
- ✅ First installment amount calculation
- ✅ Reference generation
- ✅ Config with publicKey and subaccount
- ✅ Redirect to `/payment/verify` with query params

---

## 🟢 BACKEND COLLECTION & VERIFICATION REQUIRED

### 1. **Verification API Endpoint (CRITICAL - MISSING ⚠️)**

You need to create a **server action** or **API route** to verify payment with Paystack:

```typescript
// File: actions/payment/verify-payment.actions.ts
// Purpose: Verify payment reference with Paystack servers

"use server";

import { axiosInstance } from "@/lib/api/axios";

export async function verifyPaymentAction(reference: string) {
  try {
    // Call Paystack API to verify payment
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok || !data.status) {
      return {
        success: false,
        message: "Payment verification failed",
        status: response.status,
      };
    }

    // Payment verified - extract details
    const transaction = data.data;

    return {
      success: true,
      message: "Payment verified successfully",
      data: {
        reference: transaction.reference,
        amount: transaction.amount, // in kobo
        email: transaction.customer.email,
        status: transaction.status, // 'success'
        paid_at: transaction.paid_at,
        customer_code: transaction.customer.customer_code,
      },
    };
  } catch (error) {
    console.error("Payment verification error:", error);
    return {
      success: false,
      message: "Payment verification failed",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
```

### 2. **Update PaymentVerify.tsx** (Verification Before Recording)

Before creating payment records, verify with Paystack:

```typescript
// In PaymentVerify.tsx - before creating payment record

// ADD THIS: Verify with Paystack first
if (reference && !status) {
  const verificationResult = await verifyPaymentAction(reference);

  if (!verificationResult.success) {
    dispatch({
      type: "PROCESS_FAILED",
      payload: "Payment verification failed",
    });
    return;
  }
}

// THEN: Create payment record (only after verification)
const paymentResult = await createPaymentAction({
  // ... existing code
});
```

### 3. **Database Records Created** ✅ (Already Implemented)

When payment is successful, the system creates:

**a) Enrollment Record (marked as paid)**

```
✅ markEnrollmentPaidAction()
   - Sets enrollment.isPaymentDone = true
   - Sets enrollment.paidDate = now
   - Updates enrollment.batchName
```

**b) Payment Record**

```
✅ createPaymentAction()
   - userDocumentId: user ID
   - enrollmentDocumentId: enrollment ID
   - reference: Paystack reference
   - amount: payment amount
   - planId, planName, planDiscount
   - expiryDate: plan expiry
   - nextPaymentDate: for installments
```

**c) Payment Dues (for installment plans)**

```
✅ createPaymentDuesBatchAction()
   - Silver plan: Creates 1 more payment due (2nd installment)
   - Bronze plan: Creates 3 more payment dues (installments 2-4)
   - Each due has its own dueDate and amount
```

---

## 📋 INSTALLATION SUPPORT (Extra Feature)

The system handles installment plans:

### Silver Plan (2 installments)

```
First Payment: ₦275,000 (paid now via Paystack)
     ↓
Second Payment: ₦275,000 (due in 6 months - stored as payment due)
```

### Bronze Plan (4 installments)

```
First Payment: ₦150,000 (paid now via Paystack)
     ↓
Remaining 3: ₦150,000 each (due every 3 months - stored as payment dues)
```

---

## ✅ WHAT'S ALREADY WORKING

| Component               | Status | Details                                    |
| ----------------------- | ------ | ------------------------------------------ |
| Plan Selection (Tabs)   | ✅     | Online & SIWES plans work                  |
| Paystack Modal          | ✅     | Public key configured, payment modal opens |
| Reference Generation    | ✅     | Format: TRAN{YEAR}{DAY}{MONTH}{RANDOM}     |
| Enrollment Mark Paid    | ✅     | Records payment completion                 |
| Payment Record Creation | ✅     | Stores payment details in DB               |
| Installment Dues        | ✅     | Creates future payment records             |
| Plan Expiry Calculation | ✅     | Based on plan duration                     |
| UI/UX                   | ✅     | Beautiful interface with animations        |

---

## ❌ WHAT'S MISSING

| Component                    | Status | Impact | Action Required                     |
| ---------------------------- | ------ | ------ | ----------------------------------- |
| Paystack Verification        | ⚠️     | HIGH   | Create `verify-payment.actions.ts`  |
| Secret Key Usage             | ⚠️     | HIGH   | Add verification API call           |
| Duplicate Payment Prevention | ⚠️     | MEDIUM | Check if reference already exists   |
| Payment Status Webhook       | ❌     | LOW    | Setup Paystack webhook for security |

---

## 🚀 IMPLEMENTATION PRIORITY

### IMMEDIATE (Do First)

1. ✅ Add env vars (PAYSTACK_PUBLIC_KEY, PAYSTACK_SECRET_KEY)
2. ⚠️ Create `verify-payment.actions.ts`
3. ⚠️ Update PaymentVerify.tsx to call verification

### MEDIUM (Do Next)

4. Add duplicate payment check (query existing payments by reference)
5. Add webhook handler for Paystack confirmations

### OPTIONAL (Enhancement)

6. Setup Paystack reconciliation cron job
7. Add payment retry logic for failed installments

---

## 📝 SUMMARY FOR BACKEND COLLECTION

**Current Flow:**

```
User selects plan → Paystack payment → Reference generated
    → Redirect to verify page → Record payment + mark enrollment paid
    → Create installment dues → Redirect to dashboard
```

**What's Missing:**

- Verification that payment actually succeeded on Paystack servers
- Check that reference is real and payment amount matches

**What you need to add:**

1. `verify-payment.actions.ts` - Call Paystack API to confirm
2. Update PaymentVerify.tsx - Call verification before recording

Everything else is ready! 🎉
