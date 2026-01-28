
// Payment Plans Configuration
export const PAYMENT_PLANS: Record<string, any> = {
  gold: {
    id: 'gold',
    name: 'Gold Plan',
    amount: 50000000, // ₦500,000 in kobo
    currency: 'NGN',
    price: '₦500,000.00',
    bg: 'bg-[#efbf00]',
    discount: 50,
    description: 'Premium training package with maximum discounts',
    features: [
      '50% on Discount Training Fee.',
      'Starter Package',
      '15 validity on the 58% discount exam voucher.',
      '1 year after training support.',
      'Exit package'
    ]
  },
  silver: {
    id: 'silver',
    name: 'Silver Plan',
    amount: 55000000, // ₦550,000 in kobo
    currency: 'NGN',
    price: '₦550,000.00',
    bg: 'bg-gray-300',
    discount: 45,
    description: 'Enhanced training package with substantial discounts',
    features: [
      '45% on Discount Training Fee.',
      '15 validity on the 58% discount exam voucher.',
      '1 year after training support.',
      'Exit package'
    ]
  },
  bronze: {
    id: 'bronze',
    name: 'Bronze Plan',
    amount: 60000000, // ₦600,000 in kobo
    currency: 'NGN',
    price: '₦600,000.00',
    bg: 'bg-[#cc8845]',
    discount: 40,
    description: 'Comprehensive training package with competitive discounts',
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