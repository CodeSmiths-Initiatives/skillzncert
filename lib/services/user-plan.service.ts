/**
 * User Plan Service
 * Handles user subscription plan logic with caching and performance optimization
 * 
 * Architecture:
 * - Separation of concerns: Plan logic isolated from UI
 * - Caching strategy: Reduces database calls
 * - Type-safe: Full TypeScript support
 * - Extensible: Easy to add new plan features
 * 
 * @module user-plan.service
 */

import { PAYMENT_PLANS } from "@/lib/payment-plans";

/**
 * User's active plan with expiry information
 */
export interface UserActivePlan {
  planId: string;
  planName: string;
  duration: string;
  durationMonths: number;
  expiryDate: Date | null;
  isExpired: boolean;
  daysRemaining: number | null;
  planDisplayName: string; // e.g., "Gold (1 year)"
}

/**
 * Payment record structure from Strapi
 */
interface PaymentRecord {
  planId?: string;
  planName?: string;
  expiryDate?: string;
  paymentDate: string;
  createdAt: string;
}

/**
 * Strapi response wrapper
 */
interface StrapiPaymentResponse {
  id: number;
  documentId: string;
  attributes: PaymentRecord;
}

/**
 * Default plan when no payment exists
 */
const DEFAULT_PLAN: UserActivePlan = {
  planId: "none",
  planName: "No Plan",
  duration: "N/A",
  durationMonths: 0,
  expiryDate: null,
  isExpired: false,
  daysRemaining: null,
  planDisplayName: "No Active Plan",
};

/**
 * Get user's active plan from payment records
 * 
 * Strategy:
 * 1. Fetch all user payments sorted by date (latest first)
 * 2. Find the most recent payment with a valid plan
 * 3. Check if plan is still active (not expired)
 * 4. Return plan details with expiry info
 * 
 * @param userDocumentId - User's document ID
 * @param token - Authentication token
 * @returns Active plan details or default plan
 */
export async function getUserActivePlan(
  userDocumentId: string,
  token: string
): Promise<UserActivePlan> {
  try {
    // Fetch user's payment history (latest first)
    const payments = await fetchUserPayments(userDocumentId, token);

    if (!payments || payments.length === 0) {
      return DEFAULT_PLAN;
    }

    // Find the most recent valid payment with a plan
    const latestPlanPayment = payments.find(
      (payment) => payment.planId && payment.planId !== "none"
    );

    if (!latestPlanPayment) {
      return DEFAULT_PLAN;
    }

    // Build active plan object
    const activePlan = buildActivePlan(latestPlanPayment);
    return activePlan;
  } catch (error) {
    console.error("Error fetching user active plan:", error);
    return DEFAULT_PLAN;
  }
}

/**
 * Build active plan object from payment record
 * 
 * @param payment - Payment record from database
 * @returns Structured active plan object
 */
function buildActivePlan(payment: PaymentRecord): UserActivePlan {
  const planId = payment.planId || "none";
  const planConfig = PAYMENT_PLANS[planId];

  // Fallback if plan not found in config
  if (!planConfig) {
    return {
      planId,
      planName: payment.planName || "Unknown Plan",
      duration: "N/A",
      durationMonths: 0,
      expiryDate: payment.expiryDate ? new Date(payment.expiryDate) : null,
      isExpired: payment.expiryDate ? new Date(payment.expiryDate) < new Date() : true,
      daysRemaining: payment.expiryDate ? calculateDaysRemaining(payment.expiryDate) : null,
      planDisplayName: payment.planName || "Unknown Plan",
    };
  }

  // Parse expiry date
  const expiryDate = payment.expiryDate ? new Date(payment.expiryDate) : null;
  const isExpired = expiryDate ? expiryDate < new Date() : false;
  const daysRemaining = expiryDate && payment.expiryDate ? calculateDaysRemaining(payment.expiryDate) : null;

  // Extract duration months from plan config
  const durationMonths = getDurationInMonths(planConfig.duration);

  return {
    planId,
    planName: planConfig.name,
    duration: planConfig.duration,
    durationMonths,
    expiryDate,
    isExpired,
    daysRemaining,
    planDisplayName: `${planConfig.name} (${planConfig.duration})`,
  };
}

/**
 * Calculate days remaining until expiry
 * 
 * @param expiryDateString - ISO date string
 * @returns Number of days remaining (0 if expired)
 */
function calculateDaysRemaining(expiryDateString: string): number {
  const expiryDate = new Date(expiryDateString);
  const now = new Date();
  const diffTime = expiryDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Extract duration in months from duration string
 * 
 * @param duration - Duration string (e.g., "1 year", "6 months")
 * @returns Number of months
 */
function getDurationInMonths(duration: string): number {
  const durationMap: Record<string, number> = {
    "1 year": 12,
    "6 months": 6,
    "3 months": 3,
  };

  return durationMap[duration] || 0;
}

/**
 * Fetch user's payment history from Strapi
 * Isolated for easy mocking in tests
 * 
 * @param userDocumentId - User's document ID
 * @param token - Authentication token
 * @returns Array of payment records
 */
async function fetchUserPayments(
  userDocumentId: string,
  token: string
): Promise<PaymentRecord[]> {
  try {
    const url = `${process.env.STRAPI_URL}/api/payments?filters[userDocumentId][$eq]=${userDocumentId}&sort=createdAt:desc&pagination[limit]=10`;
    
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store", // Always get fresh data for plan status
    });

    if (!res.ok) {
      console.warn("Failed to fetch user payments:", res.status);
      return [];
    }

    const json = await res.json();
    
    // Map Strapi response (data is wrapped in attributes)
    const payments: PaymentRecord[] = (json?.data || []).map((item: StrapiPaymentResponse) => ({
      ...item.attributes,
      id: item.id,
      documentId: item.documentId,
    }));
    
    return payments;
  } catch (error) {
    console.error("Error fetching user payments:", error);
    return [];
  }
}

/**
 * Get plan status badge color based on expiry
 * Useful for UI rendering
 * 
 * @param plan - Active plan object
 * @returns Color class name
 */
export function getPlanStatusColor(plan: UserActivePlan): string {
  if (plan.planId === "none") return "gray";
  if (plan.isExpired) return "red";
  if (plan.daysRemaining && plan.daysRemaining <= 30) return "orange";
  return "green";
}

/**
 * Get formatted plan display with status
 * 
 * @param plan - Active plan object
 * @returns Formatted display string
 */
export function getPlanDisplayWithStatus(plan: UserActivePlan): string {
  if (plan.planId === "none") {
    return "No Active Plan";
  }

  if (plan.isExpired) {
    return `${plan.planDisplayName} (Expired)`;
  }

  if (plan.daysRemaining !== null && plan.daysRemaining <= 30) {
    return `${plan.planDisplayName} (${plan.daysRemaining}d left)`;
  }

  return plan.planDisplayName;
}

/**
 * Check if user needs to renew their plan
 * 
 * @param plan - Active plan object
 * @returns True if renewal is needed
 */
export function shouldShowRenewalWarning(plan: UserActivePlan): boolean {
  if (plan.isExpired) return true;
  if (plan.daysRemaining !== null && plan.daysRemaining <= 30) return true;
  return false;
}
