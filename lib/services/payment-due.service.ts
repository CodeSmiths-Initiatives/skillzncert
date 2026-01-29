/**
 * Payment Due Service
 * Enterprise-grade service layer for managing payment installments
 * 
 * @description This service handles CRUD operations for payment dues,
 * providing a clean abstraction over Strapi API calls with proper
 * error handling, type safety, and performance optimization.
 * 
 * @author Senior Engineering Team
 * @version 1.0.0
 */

export interface PaymentDueData {
  id: number;
  documentId: string;
  userDocumentId: string;
  enrollmentDocumentId: string;
  parentPaymentDocumentId?: string;
  planId: string;
  planName: string;
  installmentNumber: number;
  totalInstallments: number;
  dueAmount: number;
  dueDate: string;
  status: "pending" | "paid" | "overdue" | "cancelled";
  paidAmount: number;
  paidDate?: string;
  paymentReference?: string;
  paymentDocumentId?: string;
  emailAddress: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  enrollment?: {
    id: number;
    documentId: string;
    firstName: string;
    lastName: string;
  };
}

export interface CreatePaymentDueInput {
  userDocumentId: string;
  enrollmentDocumentId: string;
  parentPaymentDocumentId?: string;
  planId: string;
  planName: string;
  installmentNumber: number;
  totalInstallments: number;
  dueAmount: number;
  dueDate: string;
  status?: "pending" | "paid" | "overdue" | "cancelled";
  paidAmount?: number;
  paidDate?: string;
  paymentReference?: string;
  paymentDocumentId?: string;
  emailAddress: string;
  notes?: string;
}

/**
 * Creates a single payment due record
 * @param paymentDueData - Payment due information
 * @param token - Authorization token
 * @returns Created payment due identifiers
 */
export async function createPaymentDue(
  paymentDueData: CreatePaymentDueInput,
  token: string
): Promise<{ id: number; documentId: string }> {
  const res = await fetch(`${process.env.STRAPI_URL}/api/payment-dues`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data: paymentDueData }),
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Strapi API Error (createPaymentDue):", res.status, errorText);
    throw new Error(`Failed to create payment due: ${res.status}`);
  }

  const json = await res.json();

  return {
    id: json.data.id,
    documentId: json.data.documentId,
  };
}

/**
 * Creates multiple payment due records in batch (optimized)
 * @param paymentDues - Array of payment due data
 * @param token - Authorization token
 * @returns Array of created payment due identifiers
 */
export async function createPaymentDuesBatch(
  paymentDues: CreatePaymentDueInput[],
  token: string
): Promise<Array<{ id: number; documentId: string }>> {
  // Use Promise.all for parallel processing (better performance)
  const results = await Promise.allSettled(
    paymentDues.map((due) => createPaymentDue(due, token))
  );

  // Extract successful results and log failures
  const successfulResults: Array<{ id: number; documentId: string }> = [];
  
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      successfulResults.push(result.value);
    } else {
      console.error(
        `Failed to create payment due ${index + 1}:`,
        result.reason
      );
    }
  });

  return successfulResults;
}

/**
 * Fetches payment dues for a specific user
 * @param userId - User document ID
 * @param token - Authorization token
 * @returns Array of payment due records
 */
export async function fetchPaymentDuesByUser(
  userId: number | string,
  token: string
): Promise<PaymentDueData[]> {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/payment-dues?filters[userDocumentId][$eq]=${userId}&populate=*&sort[0]=dueDate:asc&sort[1]=installmentNumber:asc`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.warn("Strapi API Error (fetchPaymentDuesByUser):", res.status, errorText);
    
    if (res.status === 403 || res.status === 404) {
      console.warn("Access denied or not found - returning empty list");
      return [];
    }
    return [];
  }

  const json = await res.json();
  const paymentDues = json?.data || [];

  return paymentDues.map((due: any) => ({
    id: due.id,
    documentId: due.documentId,
    userDocumentId: due.userDocumentId || "",
    enrollmentDocumentId: due.enrollmentDocumentId || "",
    parentPaymentDocumentId: due.parentPaymentDocumentId || "",
    planId: due.planId || "",
    planName: due.planName || "",
    installmentNumber: due.installmentNumber || 0,
    totalInstallments: due.totalInstallments || 0,
    dueAmount: due.dueAmount || 0,
    dueDate: due.dueDate || "",
    status: due.status || "pending",
    paidAmount: due.paidAmount || 0,
    paidDate: due.paidDate || "",
    paymentReference: due.paymentReference || "",
    paymentDocumentId: due.paymentDocumentId || "",
    emailAddress: due.emailAddress || "",
    notes: due.notes || "",
    createdAt: due.createdAt,
    updatedAt: due.updatedAt,
    enrollment: due.enrollment
      ? {
          id: due.enrollment.id,
          documentId: due.enrollment.documentId,
          firstName: due.enrollment.firstName,
          lastName: due.enrollment.lastName,
        }
      : undefined,
  }));
}

/**
 * Fetches payment dues for a specific enrollment
 * @param enrollmentDocumentId - Enrollment document ID
 * @param token - Authorization token
 * @returns Array of payment due records
 */
export async function fetchPaymentDuesByEnrollment(
  enrollmentDocumentId: string,
  token: string
): Promise<PaymentDueData[]> {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/payment-dues?filters[enrollmentDocumentId][$eq]=${enrollmentDocumentId}&populate=*&sort[0]=dueDate:asc&sort[1]=installmentNumber:asc`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.warn("Strapi API Error (fetchPaymentDuesByEnrollment):", res.status, errorText);
    
    if (res.status === 403 || res.status === 404) {
      return [];
    }
    return [];
  }

  const json = await res.json();
  const paymentDues = json?.data || [];

  return paymentDues.map((due: any) => ({
    id: due.id,
    documentId: due.documentId,
    userDocumentId: due.userDocumentId || "",
    enrollmentDocumentId: due.enrollmentDocumentId || "",
    parentPaymentDocumentId: due.parentPaymentDocumentId || "",
    planId: due.planId || "",
    planName: due.planName || "",
    installmentNumber: due.installmentNumber || 0,
    totalInstallments: due.totalInstallments || 0,
    dueAmount: due.dueAmount || 0,
    dueDate: due.dueDate || "",
    status: due.status || "pending",
    paidAmount: due.paidAmount || 0,
    paidDate: due.paidDate || "",
    paymentReference: due.paymentReference || "",
    paymentDocumentId: due.paymentDocumentId || "",
    emailAddress: due.emailAddress || "",
    notes: due.notes || "",
    createdAt: due.createdAt,
    updatedAt: due.updatedAt,
    enrollment: due.enrollment
      ? {
          id: due.enrollment.id,
          documentId: due.enrollment.documentId,
          firstName: due.enrollment.firstName,
          lastName: due.enrollment.lastName,
        }
      : undefined,
  }));
}

/**
 * Updates an existing payment due record
 * @param documentId - Payment due document ID
 * @param paymentDueData - Updated payment due data
 * @param token - Authorization token
 * @returns Updated payment due identifiers
 */
export async function updatePaymentDue(
  documentId: string,
  paymentDueData: Partial<CreatePaymentDueInput>,
  token: string
): Promise<{ id: number; documentId: string }> {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/payment-dues/${documentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data: paymentDueData }),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Strapi API Error (updatePaymentDue):", res.status, errorText);
    throw new Error(`Failed to update payment due: ${res.status}`);
  }

  const json = await res.json();

  return {
    id: json.data.id,
    documentId: json.data.documentId,
  };
}

/**
 * Marks a payment due as paid
 * @param documentId - Payment due document ID
 * @param paymentInfo - Payment completion information
 * @param token - Authorization token
 * @returns Updated payment due identifiers
 */
export async function markPaymentDueAsPaid(
  documentId: string,
  paymentInfo: {
    paidAmount: number;
    paidDate: string;
    paymentReference: string;
    paymentDocumentId: string;
  },
  token: string
): Promise<{ id: number; documentId: string }> {
  return updatePaymentDue(
    documentId,
    {
      status: "paid",
      ...paymentInfo,
    },
    token
  );
}

/**
 * Deletes a payment due record
 * @param documentId - Payment due document ID
 * @param token - Authorization token
 */
export async function deletePaymentDue(
  documentId: string,
  token: string
): Promise<void> {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/payment-dues/${documentId}`,
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
    console.error("Strapi API Error (deletePaymentDue):", res.status, errorText);
    throw new Error(`Failed to delete payment due: ${res.status}`);
  }
}

/**
 * Fetches pending payment dues for a user (status = pending or overdue)
 * Useful for dashboard views
 * @param userId - User document ID
 * @param token - Authorization token
 * @returns Array of pending payment due records
 */
export async function fetchPendingPaymentDues(
  userId: number | string,
  token: string
): Promise<PaymentDueData[]> {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/payment-dues?filters[userDocumentId][$eq]=${userId}&filters[$or][0][status][$eq]=pending&filters[$or][1][status][$eq]=overdue&populate=*&sort=dueDate:asc`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.warn("Strapi API Error (fetchPendingPaymentDues):", res.status, errorText);
    return [];
  }

  const json = await res.json();
  const paymentDues = json?.data || [];

  return paymentDues.map((due: any) => ({
    id: due.id,
    documentId: due.documentId,
    userDocumentId: due.userDocumentId || "",
    enrollmentDocumentId: due.enrollmentDocumentId || "",
    parentPaymentDocumentId: due.parentPaymentDocumentId || "",
    planId: due.planId || "",
    planName: due.planName || "",
    installmentNumber: due.installmentNumber || 0,
    totalInstallments: due.totalInstallments || 0,
    dueAmount: due.dueAmount || 0,
    dueDate: due.dueDate || "",
    status: due.status || "pending",
    paidAmount: due.paidAmount || 0,
    paidDate: due.paidDate || "",
    paymentReference: due.paymentReference || "",
    paymentDocumentId: due.paymentDocumentId || "",
    emailAddress: due.emailAddress || "",
    notes: due.notes || "",
    createdAt: due.createdAt,
    updatedAt: due.updatedAt,
    enrollment: due.enrollment
      ? {
          id: due.enrollment.id,
          documentId: due.enrollment.documentId,
          firstName: due.enrollment.firstName,
          lastName: due.enrollment.lastName,
        }
      : undefined,
  }));
}
