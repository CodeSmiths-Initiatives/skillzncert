
// Payment Plans Configuration
export const PAYMENT_PLANS: Record<string, any> = {
  basic: {
    id: 'basic',
    name: 'Gold Plan',
    amount: 500000, // ₦500,000 in kobo
    currency: 'NGN',
    description: 'Perfect for individuals starting their learning journey',
    features: [
      '50% on Discount Training Fee.',
      'Starter Package',
      '15 validity on the 58% discount exam voucher.',
      '1 year after training support.',
      'Exit package'
    ]
  },
  pro: {
    id: 'pro',
    name: 'Silver Plan',
    amount: 550000, // ₦550,000 in kobo
    currency: 'NGN',
    description: 'Ideal for professionals looking to advance their skills',
    features: [
      '45% on Discount Training Fee.',
      '15 validity on the 58% discount exam voucher.',
      '1 year after training support.',
      'Exit package'
    ]
  },
  enterprise: {
    id: 'enterprise',
    name: 'Bronze Plan',
    amount: 600000, // ₦60,000 in kobo
    currency: 'NGN',
    description: 'Complete solution for organizations and teams',
    features: [
      '40% on Discount Training Fee.',
      '15 validity on the 58% discount exam voucher.',
      '1 year after training support.',
      'Exit package'
    ]
  }
};

// Utility function to get plan by ID
export function getStaticPlanById(planId: string): any | null {
  return PAYMENT_PLANS[planId] || null;
}

// Utility function to get all plans
export function getStaticAllPlans(): any[] {
  return Object.values(PAYMENT_PLANS);
}