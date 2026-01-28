import { PAYMENT_PLANS } from "@/lib/payment-plans";

export interface PlanValidation {
  isValid: boolean;
  plan: (typeof PAYMENT_PLANS)[keyof typeof PAYMENT_PLANS] | null;
  error?: string;
}

export interface PlanValidationError {
  success: false;
  error: string;
}

export interface PlanValidationSuccess {
  success: true;
  planId: string;
  planName: string;
  amount: number;
  discount: number;
}

/**
 * Validates if a plan ID exists and is active
 */
export function validatePlanId(planId: string | undefined): PlanValidation {
  if (!planId || typeof planId !== "string") {
    return {
      isValid: false,
      plan: null,
      error: "Plan ID is required and must be a string",
    };
  }

  const plan = PAYMENT_PLANS[planId as keyof typeof PAYMENT_PLANS];

  if (!plan) {
    return {
      isValid: false,
      plan: null,
      error: `Invalid plan ID: ${planId}. Valid plans are: ${Object.keys(PAYMENT_PLANS).join(", ")}`,
    };
  }

  return {
    isValid: true,
    plan,
  };
}

/**
 * Validates plan data before payment processing
 */
export function validatePlanForPayment(
  planId: string | undefined,
  amount: number | undefined,
): PlanValidationSuccess | PlanValidationError {
  // Validate plan ID
  const planValidation = validatePlanId(planId);
  if (!planValidation.isValid) {
    return {
      success: false,
      error: planValidation.error || "Invalid plan",
    };
  }

  const plan = planValidation.plan!;

  // Validate amount matches plan
  if (!amount || amount <= 0) {
    return {
      success: false,
      error: "Invalid payment amount",
    };
  }

  // Amount should be in kobo, so we convert plan amount for comparison
  const expectedAmountInKobo = plan.amount;
  const providedAmountInKobo = typeof amount === "string" ? parseInt(amount) : amount;

  if (providedAmountInKobo !== expectedAmountInKobo) {
    return {
      success: false,
      error: `Amount mismatch. Expected ${expectedAmountInKobo} kobo (₦${expectedAmountInKobo / 100}), got ${providedAmountInKobo} kobo`,
    };
  }

  return {
    success: true,
    planId: plan.id,
    planName: plan.name,
    amount: plan.amount,
    discount: plan.discount || 0,
  };
}

/**
 * Validates plan data in enrollment
 */
export function validatePlanInEnrollment(
  planId: string | undefined,
): PlanValidationSuccess | PlanValidationError {
  const validation = validatePlanId(planId);

  if (!validation.isValid) {
    return {
      success: false,
      error: validation.error || "Invalid plan selection",
    };
  }

  const plan = validation.plan!;

  return {
    success: true,
    planId: plan.id,
    planName: plan.name,
    amount: plan.amount,
    discount: plan.discount || 0,
  };
}

/**
 * Get all available plans
 */
export function getAvailablePlans() {
  return Object.values(PAYMENT_PLANS).map((plan) => ({
    id: plan.id,
    name: plan.name,
    amount: plan.amount,
    discount: plan.discount,
    features: plan.features,
  }));
}

/**
 * Get plan details by ID
 */
export function getPlanDetails(planId: string) {
  const validation = validatePlanId(planId);

  if (!validation.isValid) {
    return null;
  }

  const plan = validation.plan!;
  return {
    id: plan.id,
    name: plan.name,
    amount: plan.amount,
    price: plan.price,
    discount: plan.discount,
    description: plan.description,
    features: plan.features,
    currency: plan.currency,
  };
}
