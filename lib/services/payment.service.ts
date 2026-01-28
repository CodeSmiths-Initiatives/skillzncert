export interface PaymentData {
  id: number;
  documentId: string;
  userDocumentId: string;
  enrollmentDocumentId: string;
  paymentMode: string;
  month: string;
  year: number;
  amount: number;
  emailAddress: string;
  paymentDate: string;
  reference?: string;
  planId?: string;
  planName?: string;
  planAmount?: number;
  planDiscount?: number;
  createdAt: string;
  updatedAt: string;
  enrollment?: {
    id: number;
    documentId: string;
    firstName: string;
    lastName: string;
  };
}

export interface CreatePaymentInput {
  userDocumentId: string;
  enrollmentDocumentId: string;
  paymentMode: string;
  month: string;
  year: number;
  amount: number;
  emailAddress: string;
  paymentDate: string;
  reference?: string;
  planId?: string;
  planName?: string;
  planAmount?: number;
  planDiscount?: number;
}

export async function createPayment(
  paymentData: CreatePaymentInput,
  token: string
): Promise<{ id: number; documentId: string }> {
  const res = await fetch(`${process.env.STRAPI_URL}/api/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data: paymentData }),
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Strapi API Error:", res.status, errorText);
    throw new Error(`Failed to create payment: ${res.status}`);
  }

  const json = await res.json();
  
  return {
    id: json.data.id,
    documentId: json.data.documentId,
  };
}

export async function fetchPaymentsByEnrollment(
  enrollmentDocumentId: string,
  token: string
): Promise<PaymentData[]> {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/payments?filters[enrollmentDocumentId][$eq]=${enrollmentDocumentId}&populate=*&sort=createdAt:desc`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Strapi API Error:", res.status, errorText);
    throw new Error(`Failed to fetch payments: ${res.status}`);
  }

  const json = await res.json();
  const payments = json?.data || [];

  return payments.map((payment: any) => ({
    id: payment.id,
    documentId: payment.documentId,
    userDocumentId: payment.userDocumentId || "",
    enrollmentDocumentId: payment.enrollmentDocumentId || "",
    paymentMode: payment.paymentMode || "",
    month: payment.month || "",
    year: payment.year || 0,
    amount: payment.amount || 0,
    emailAddress: payment.emailAddress || "",
    paymentDate: payment.paymentDate || "",
    reference: payment.reference || "",
    planId: payment.planId || "",
    planName: payment.planName || "",
    planAmount: payment.planAmount || 0,
    planDiscount: payment.planDiscount || 0,
    createdAt: payment.createdAt,
    updatedAt: payment.updatedAt,
    enrollment: payment.enrollment ? {
      id: payment.enrollment.id,
      documentId: payment.enrollment.documentId,
      firstName: payment.enrollment.firstName,
      lastName: payment.enrollment.lastName,
    } : undefined,
  }));
}

export async function fetchAllPayments(token: string): Promise<PaymentData[]> {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/payments?populate=*&sort=createdAt:desc`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Strapi API Error:", res.status, errorText);
    throw new Error(`Failed to fetch payments: ${res.status}`);
  }

  const json = await res.json();
  const payments = json?.data || [];

  return payments.map((payment: any) => ({
    id: payment.id,
    documentId: payment.documentId,
    userDocumentId: payment.userDocumentId || "",
    enrollmentDocumentId: payment.enrollmentDocumentId || "",
    paymentMode: payment.paymentMode || "",
    month: payment.month || "",
    year: payment.year || 0,
    amount: payment.amount || 0,
    emailAddress: payment.emailAddress || "",
    paymentDate: payment.paymentDate || "",
    reference: payment.reference || "",
    planId: payment.planId || "",
    planName: payment.planName || "",
    planAmount: payment.planAmount || 0,
    planDiscount: payment.planDiscount || 0,
    createdAt: payment.createdAt,
    updatedAt: payment.updatedAt,
    enrollment: payment.enrollment ? {
      id: payment.enrollment.id,
      documentId: payment.enrollment.documentId,
      firstName: payment.enrollment.firstName,
      lastName: payment.enrollment.lastName,
    } : undefined,
  }));
}

export async function fetchPaymentsByUser(
  userId: number,
  token: string
): Promise<PaymentData[]> {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/payments?filters[userDocumentId][$eq]=${userId}&populate=*&sort=createdAt:desc`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Strapi API Error:", res.status, errorText);
    throw new Error(`Failed to fetch user payments: ${res.status}`);
  }

  const json = await res.json();
  const payments = json?.data || [];

  return payments.map((payment: any) => ({
    id: payment.id,
    documentId: payment.documentId,
    userDocumentId: payment.userDocumentId || "",
    enrollmentDocumentId: payment.enrollmentDocumentId || "",
    paymentMode: payment.paymentMode || "",
    month: payment.month || "",
    year: payment.year || 0,
    amount: payment.amount || 0,
    emailAddress: payment.emailAddress || "",
    paymentDate: payment.paymentDate || "",
    reference: payment.reference || "",
    planId: payment.planId || "",
    planName: payment.planName || "",
    planAmount: payment.planAmount || 0,
    planDiscount: payment.planDiscount || 0,
    createdAt: payment.createdAt,
    updatedAt: payment.updatedAt,
    enrollment: payment.enrollment ? {
      id: payment.enrollment.id,
      documentId: payment.enrollment.documentId,
      firstName: payment.enrollment.firstName,
      lastName: payment.enrollment.lastName,
    } : undefined,
  }));
}

export async function updatePayment(
  documentId: string,
  paymentData: Partial<CreatePaymentInput>,
  token: string
): Promise<{ id: number; documentId: string }> {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/payments/${documentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data: paymentData }),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Strapi API Error:", res.status, errorText);
    throw new Error(`Failed to update payment: ${res.status}`);
  }

  const json = await res.json();
  
  return {
    id: json.data.id,
    documentId: json.data.documentId,
  };
}

export async function deletePayment(
  documentId: string,
  token: string
): Promise<void> {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/payments/${documentId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Strapi API Error:", res.status, errorText);
    throw new Error(`Failed to delete payment: ${res.status}`);
  }
}
