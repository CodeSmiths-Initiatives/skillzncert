/**
 * Payment Installment Calculator Utility
 * Enterprise-grade utility for calculating payment installments
 * 
 * @description This utility provides comprehensive functions for calculating
 * payment installments, generating payment schedules, and managing payment
 * due dates for multi-installment plans.
 * 
 * @features
 * - Automatic installment calculation based on plan type
 * - Payment schedule generation
 * - Due date calculation with configurable intervals
 * - Support for Gold (1 payment), Silver (2 payments), Bronze (4 payments)
 * - Type-safe with full TypeScript support
 * - Performance optimized for batch operations
 * 
 * @author Senior Engineering Team
 * @version 1.0.0
 */

import { PAYMENT_PLANS, type PaymentPlanConfig } from "@/lib/payment-plans";
import type { CreatePaymentDueInput } from "@/lib/services/payment-due.service";

export interface InstallmentSchedule {
  installmentNumber: number;
  amount: number;
  dueDate: Date;
  description: string;
}

export interface PaymentSchedule {
  planId: string;
  planName: string;
  totalAmount: number;
  totalInstallments: number;
  firstPaymentAmount: number;
  subsequentPaymentAmount: number;
  intervalMonths: number;
  schedule: InstallmentSchedule[];
}

/**
 * Calculates the complete payment schedule for a plan
 * 
 * @param planId - The plan identifier (gold, silver, bronze)
 * @param startDate - The start date for the payment schedule (default: now)
 * @returns Complete payment schedule with all installments
 * 
 * @example
 * ```typescript
 * const schedule = calculatePaymentSchedule('silver');
 * // Returns schedule with 2 installments of ₦275,000 each
 * ```
 */
export function calculatePaymentSchedule(
  planId: string,
  startDate: Date = new Date()
): PaymentSchedule | null {
  const plan = PAYMENT_PLANS[planId.toLowerCase()];

  if (!plan) {
    console.error(`Unknown plan ID: ${planId}`);
    return null;
  }

  const schedule: InstallmentSchedule[] = [];

  // Generate installments based on plan configuration
  for (let i = 0; i < plan.installments.count; i++) {
    const installmentNumber = i + 1;
    const amount = i === 0
      ? plan.installments.firstPayment
      : plan.installments.subsequentPayment;

    // Calculate due date
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i * plan.installments.intervalMonths);

    const description =
      i === 0
        ? `Initial payment for ${plan.name}`
        : `Installment ${installmentNumber} of ${plan.installments.count}`;

    schedule.push({
      installmentNumber,
      amount,
      dueDate,
      description,
    });
  }

  return {
    planId: plan.id,
    planName: plan.name,
    totalAmount: plan.amount,
    totalInstallments: plan.installments.count,
    firstPaymentAmount: plan.installments.firstPayment,
    subsequentPaymentAmount: plan.installments.subsequentPayment,
    intervalMonths: plan.installments.intervalMonths,
    schedule,
  };
}

/**
 * Generates payment due records for creating in database
 * 
 * @param params - Configuration for generating payment dues
 * @returns Array of payment due input objects ready for database insertion
 * 
 * @example
 * ```typescript
 * const dues = generatePaymentDues({
 *   planId: 'bronze',
 *   userDocumentId: '123',
 *   enrollmentDocumentId: 'enr_456',
 *   parentPaymentDocumentId: 'pay_789',
 *   emailAddress: 'user@example.com',
 *   skipFirstInstallment: true // First installment already paid
 * });
 * // Returns 3 payment due objects for bronze plan (skipping first)
 * ```
 */
export function generatePaymentDues(params: {
  planId: string;
  userDocumentId: string;
  enrollmentDocumentId: string;
  parentPaymentDocumentId?: string;
  emailAddress: string;
  startDate?: Date;
  skipFirstInstallment?: boolean; // Set to true if first payment is already made
}): CreatePaymentDueInput[] {
  const {
    planId,
    userDocumentId,
    enrollmentDocumentId,
    parentPaymentDocumentId,
    emailAddress,
    startDate = new Date(),
    skipFirstInstallment = false,
  } = params;

  const schedule = calculatePaymentSchedule(planId, startDate);

  if (!schedule) {
    console.error(`Failed to generate payment schedule for plan: ${planId}`);
    return [];
  }

  // Filter out first installment if already paid
  const installmentsToCreate = skipFirstInstallment
    ? schedule.schedule.slice(1)
    : schedule.schedule;

  // Generate payment due records
  const paymentDues: CreatePaymentDueInput[] = installmentsToCreate.map(
    (installment) => ({
      userDocumentId,
      enrollmentDocumentId,
      parentPaymentDocumentId,
      planId: schedule.planId,
      planName: schedule.planName,
      installmentNumber: installment.installmentNumber,
      totalInstallments: schedule.totalInstallments,
      dueAmount: installment.amount,
      dueDate: installment.dueDate.toISOString(),
      status: "pending" as const,
      paidAmount: 0,
      emailAddress,
      notes: installment.description,
    })
  );

  return paymentDues;
}

/**
 * Calculates the next payment due date for a specific installment
 * 
 * @param planId - The plan identifier
 * @param startDate - The start date (first payment date)
 * @param installmentNumber - Which installment to calculate (2, 3, 4, etc.)
 * @returns The due date for the specified installment
 */
export function calculateInstallmentDueDate(
  planId: string,
  startDate: Date,
  installmentNumber: number
): Date | null {
  const plan = PAYMENT_PLANS[planId.toLowerCase()];

  if (!plan) {
    return null;
  }

  if (installmentNumber < 1 || installmentNumber > plan.installments.count) {
    console.warn(
      `Invalid installment number ${installmentNumber} for plan ${planId}`
    );
    return null;
  }

  const dueDate = new Date(startDate);
  const monthsToAdd = (installmentNumber - 1) * plan.installments.intervalMonths;
  dueDate.setMonth(dueDate.getMonth() + monthsToAdd);

  return dueDate;
}

/**
 * Gets the installment amount for a specific installment number
 * 
 * @param planId - The plan identifier
 * @param installmentNumber - Which installment (1, 2, 3, etc.)
 * @returns The amount for that installment in kobo
 */
export function getInstallmentAmount(
  planId: string,
  installmentNumber: number
): number {
  const plan = PAYMENT_PLANS[planId.toLowerCase()];

  if (!plan) {
    return 0;
  }

  if (installmentNumber < 1 || installmentNumber > plan.installments.count) {
    return 0;
  }

  // First installment might have different amount
  return installmentNumber === 1
    ? plan.installments.firstPayment
    : plan.installments.subsequentPayment;
}

/**
 * Checks if a plan requires installment payments
 * 
 * @param planId - The plan identifier
 * @returns True if plan has multiple installments
 */
export function hasInstallments(planId: string): boolean {
  const plan = PAYMENT_PLANS[planId.toLowerCase()];
  return plan ? plan.installments.count > 1 : false;
}

/**
 * Gets the number of remaining installments after a specific installment
 * 
 * @param planId - The plan identifier
 * @param completedInstallment - The installment number just completed
 * @returns Number of remaining installments
 */
export function getRemainingInstallments(
  planId: string,
  completedInstallment: number
): number {
  const plan = PAYMENT_PLANS[planId.toLowerCase()];

  if (!plan) {
    return 0;
  }

  return Math.max(0, plan.installments.count - completedInstallment);
}

/**
 * Formats installment information for display
 * 
 * @param planId - The plan identifier
 * @param installmentNumber - Current installment number
 * @returns Formatted string describing the installment
 */
export function formatInstallmentInfo(
  planId: string,
  installmentNumber: number
): string {
  const plan = PAYMENT_PLANS[planId.toLowerCase()];

  if (!plan) {
    return "Unknown plan";
  }

  if (plan.installments.count === 1) {
    return `Full payment (${plan.name})`;
  }

  return `Installment ${installmentNumber} of ${plan.installments.count} (${plan.name})`;
}

/**
 * Calculates total paid and remaining amount
 * 
 * @param planId - The plan identifier
 * @param completedInstallments - Number of installments completed
 * @returns Object with totalPaid and remaining amounts
 */
export function calculatePaymentProgress(
  planId: string,
  completedInstallments: number
): {
  totalPaid: number;
  remaining: number;
  percentagePaid: number;
} {
  const plan = PAYMENT_PLANS[planId.toLowerCase()];

  if (!plan) {
    return { totalPaid: 0, remaining: 0, percentagePaid: 0 };
  }

  let totalPaid = 0;

  // Calculate total paid amount
  for (let i = 1; i <= completedInstallments; i++) {
    totalPaid += getInstallmentAmount(planId, i);
  }

  const remaining = plan.amount - totalPaid;
  const percentagePaid = (totalPaid / plan.amount) * 100;

  return {
    totalPaid,
    remaining,
    percentagePaid: Math.round(percentagePaid * 100) / 100, // Round to 2 decimals
  };
}

/**
 * Validates if an installment payment amount is correct
 * 
 * @param planId - The plan identifier
 * @param installmentNumber - The installment being paid
 * @param amount - The amount being paid
 * @returns True if amount is valid for this installment
 */
export function validateInstallmentAmount(
  planId: string,
  installmentNumber: number,
  amount: number
): boolean {
  const expectedAmount = getInstallmentAmount(planId, installmentNumber);
  return amount === expectedAmount;
}
