/**
 * Paystack Payment Service
 * Centralized payment gateway integration with Paystack
 * 
 * Features:
 * - Type-safe payment initialization
 * - Reusable across different payment types (plans, dues, custom)
 * - Environment-based configuration
 * - Comprehensive error handling
 * - Transaction reference generation
 * - Payment verification support
 */

export interface PaystackConfig {
  reference: string;
  email: string;
  amount: number; // Amount in kobo
  currency?: string;
  subaccount?: string;
  channels?: string[];
  metadata?: Record<string, any>;
}

export interface PaymentMetadata {
  type: 'plan' | 'due' | 'custom';
  planId?: string;
  planName?: string;
  dueId?: string;
  enrollmentId?: string;
  userId?: string;
  installmentNumber?: number;
  totalInstallments?: number;
  [key: string]: any;
}

export interface PaymentCallbacks {
  onSuccess: (reference: any) => void;
  onClose: () => void;
}

/**
 * Generate a unique payment reference
 * Format: TRAN{YEAR}{DAY}{MONTH}{5_RANDOM_CHARS}
 */
export function generatePaymentReference(): string {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");

  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomChars = "";
  for (let i = 0; i < 5; i++) {
    randomChars += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return `TRAN${year}${day}${month}${randomChars}`;
}

/**
 * Create Paystack configuration for plan payment
 */
export function createPlanPaymentConfig(
  email: string,
  amount: number,
  planId: string,
  planName: string,
  enrollmentId?: string,
  userId?: string
): PaystackConfig {
  return {
    reference: generatePaymentReference(),
    email,
    amount,
    currency: "NGN",
    subaccount: process.env.NEXT_PUBLIC_PAYSTACK_SUBACCOUNT || "ACCT_xtlrfkipcz3pp2p",
    channels: ["card"],
    metadata: {
      type: 'plan',
      planId,
      planName,
      enrollmentId,
      userId,
      custom_fields: [
        {
          display_name: "Plan Type",
          variable_name: "plan_type",
          value: planName
        }
      ]
    }
  };
}

/**
 * Create Paystack configuration for installment due payment
 */
export function createDuePaymentConfig(
  email: string,
  amount: number,
  dueId: string,
  planId: string,
  planName: string,
  installmentNumber: number,
  totalInstallments: number,
  enrollmentId?: string,
  userId?: string
): PaystackConfig {
  return {
    reference: generatePaymentReference(),
    email,
    amount,
    currency: "NGN",
    subaccount: process.env.NEXT_PUBLIC_PAYSTACK_SUBACCOUNT || "ACCT_xtlrfkipcz3pp2p",
    channels: ["card"],
    metadata: {
      type: 'due',
      dueId,
      planId,
      planName,
      installmentNumber,
      totalInstallments,
      enrollmentId,
      userId,
      custom_fields: [
        {
          display_name: "Payment Type",
          variable_name: "payment_type",
          value: `Installment ${installmentNumber} of ${totalInstallments}`
        },
        {
          display_name: "Plan",
          variable_name: "plan",
          value: planName
        }
      ]
    }
  };
}

/**
 * Validate Paystack public key
 */
export function validatePaystackConfig(): boolean {
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
  
  if (!publicKey) {
    console.error("❌ Paystack public key not configured");
    return false;
  }

  if (!publicKey.startsWith("pk_")) {
    console.error("❌ Invalid Paystack public key format");
    return false;
  }

  return true;
}

/**
 * Format amount from kobo to naira
 */
export function formatAmountFromKobo(amountInKobo: number): string {
  return `₦${(amountInKobo / 100).toLocaleString()}`;
}

/**
 * Convert naira to kobo
 */
export function convertToKobo(amountInNaira: number): number {
  return Math.round(amountInNaira * 100);
}

/**
 * Get Paystack transaction status color
 */
export function getTransactionStatusColor(status: string): string {
  const statusMap: Record<string, string> = {
    success: "green",
    failed: "red",
    abandoned: "orange",
    pending: "yellow"
  };
  
  return statusMap[status.toLowerCase()] || "gray";
}
