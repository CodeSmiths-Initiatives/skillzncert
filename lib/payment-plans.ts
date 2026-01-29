
// Payment Plans Configuration with Installment Support
export interface PaymentPlanConfig {
  id: string;
  name: string;
  amount: number; // Total amount in kobo
  currency: string;
  price: string;
  bg: string;
  discount: number;
  duration: string;
  durationMonths: number; // Duration in months for calculations
  description: string;
  features: string[];
  installments: {
    count: number; // Total number of installments
    firstPayment: number; // First payment amount in kobo
    subsequentPayment: number; // Subsequent payment amount in kobo
    intervalMonths: number; // Months between payments
  };
}

export const PAYMENT_PLANS: Record<string, PaymentPlanConfig> = {
  gold: {
    id: 'gold',
    name: 'Gold Plan',
    amount: 50000000, // ₦500,000 in kobo (one-time payment)
    currency: 'NGN',
    price: '₦500,000.00',
    bg: 'bg-[#efbf00]',
    discount: 50,
    duration: '1 year',
    durationMonths: 12,
    description: 'Premium training package with maximum discounts',
    features: [
      '50% on Discount Training Fee.',
      'Starter Package',
      '15 validity on the 58% discount exam voucher.',
      '1 year after training support.',
      'Exit package'
    ],
    installments: {
      count: 1, // Single payment, no installments
      firstPayment: 50000000,
      subsequentPayment: 0,
      intervalMonths: 0
    }
  },
  silver: {
    id: 'silver',
    name: 'Silver Plan',
    amount: 55000000, // ₦550,000 in kobo (bi-annual: 2 payments)
    currency: 'NGN',
    price: '₦550,000.00',
    bg: 'bg-gray-300',
    discount: 45,
    duration: '6 months',
    durationMonths: 6,
    description: 'Enhanced training package with substantial discounts',
    features: [
      '45% on Discount Training Fee.',
      '15 validity on the 58% discount exam voucher.',
      '1 year after training support.',
      'Exit package'
    ],
    installments: {
      count: 2, // Two installments
      firstPayment: 27500000, // ₦275,000 in kobo
      subsequentPayment: 27500000, // ₦275,000 in kobo
      intervalMonths: 6 // Pay every 6 months
    }
  },
  bronze: {
    id: 'bronze',
    name: 'Bronze Plan',
    amount: 60000000, // ₦600,000 in kobo (quarterly: 4 payments)
    currency: 'NGN',
    price: '₦600,000.00',
    bg: 'bg-[#cc8845]',
    discount: 40,
    duration: '3 months',
    durationMonths: 3,
    description: 'Comprehensive training package with competitive discounts',
    features: [
      '40% on Discount Training Fee.',
      '15 validity on the 58% discount exam voucher.',
      '1 year after training support.',
      'Exit package'
    ],
    installments: {
      count: 4, // Four quarterly installments
      firstPayment: 15000000, // ₦150,000 in kobo
      subsequentPayment: 15000000, // ₦150,000 in kobo
      intervalMonths: 3 // Pay every 3 months
    }
  }
};

// Utility function to get plan by ID
export function getStaticPlanById(planId: string): PaymentPlanConfig | null {
  return PAYMENT_PLANS[planId] || null;
}

// Utility function to get all plans
export function getStaticAllPlans(): PaymentPlanConfig[] {
  return Object.values(PAYMENT_PLANS);
}

// Utility function to calculate plan expiry date
export function calculatePlanExpiryDate(planId: string, startDate: Date = new Date()): Date {
  const expiryDate = new Date(startDate);
  const plan = PAYMENT_PLANS[planId.toLowerCase()];
  
  if (!plan) {
    // Default to 1 year if unknown plan
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    return expiryDate;
  }
  
  // Use durationMonths for accurate calculation
  expiryDate.setMonth(expiryDate.getMonth() + plan.durationMonths);
  
  return expiryDate;
}

// Utility function to calculate next payment due date based on installment number
export function calculateNextPaymentDate(
  planId: string, 
  startDate: Date = new Date(), 
  installmentNumber: number = 2
): Date {
  const nextDate = new Date(startDate);
  const plan = PAYMENT_PLANS[planId.toLowerCase()]; 
  
  if (!plan || plan.installments.count === 1) {
    // No next payment for single-payment plans
    return nextDate;
  }
  
  // Calculate next payment date based on interval
  const monthsToAdd = plan.installments.intervalMonths * (installmentNumber - 1);
  nextDate.setMonth(nextDate.getMonth() + monthsToAdd);
  
  return nextDate;
}