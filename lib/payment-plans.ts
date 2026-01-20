
// Payment Plans Configuration
export const PAYMENT_PLANS: Record<string, any> = {
  basic: {
    id: 'basic',
    name: 'Basic Plan',
    amount: 500000, // ₦5,000 in kobo
    currency: 'NGN',
    description: 'Perfect for individuals starting their learning journey',
    features: [
      'Access to basic courses',
      'Community support',
      'Certificate of completion',
      'Mobile app access'
    ]
  },
  pro: {
    id: 'pro',
    name: 'Pro Plan',
    amount: 1500000, // ₦15,000 in kobo
    currency: 'NGN',
    description: 'Ideal for professionals looking to advance their skills',
    features: [
      'All Basic features',
      'Advanced courses',
      'Priority support',
      'Downloadable resources',
      'Live webinars',
      '1-on-1 mentoring sessions'
    ]
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise Plan',
    amount: 5000000, // ₦50,000 in kobo
    currency: 'NGN',
    description: 'Complete solution for organizations and teams',
    features: [
      'All Pro features',
      'Custom training programs',
      'Dedicated account manager',
      'API access',
      'White-label solution',
      'Advanced analytics',
      'Bulk licensing'
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