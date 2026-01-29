"use server";

/**
 * Payment Dues Server Actions
 * Secure server-side operations for payment installments
 * 
 * @description These actions provide authenticated access to payment due
 * operations, ensuring proper authorization and data validation.
 */

import { cookies } from "next/headers";
import {
  createPaymentDue,
  createPaymentDuesBatch,
  fetchPaymentDuesByUser,
  fetchPaymentDuesByEnrollment,
  updatePaymentDue,
  markPaymentDueAsPaid,
  deletePaymentDue,
  fetchPendingPaymentDues,
} from "@/lib/services/payment-due.service";
import type { 
  CreatePaymentDueInput, 
  PaymentDueData 
} from "@/lib/services/payment-due.service";

/**
 * Creates a single payment due record
 */
export async function createPaymentDueAction(
  paymentDueData: CreatePaymentDueInput
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    // Validate required fields
    if (!paymentDueData.userDocumentId) {
      return { success: false, message: "User document ID is required" };
    }

    if (!paymentDueData.enrollmentDocumentId) {
      return { success: false, message: "Enrollment document ID is required" };
    }

    if (!paymentDueData.planId) {
      return { success: false, message: "Plan ID is required" };
    }

    if (!paymentDueData.dueAmount || paymentDueData.dueAmount <= 0) {
      return { success: false, message: "Valid due amount is required" };
    }

    if (!paymentDueData.dueDate) {
      return { success: false, message: "Due date is required" };
    }

    const result = await createPaymentDue(paymentDueData, token);

    return {
      success: true,
      message: "Payment due created successfully",
      data: result,
    };
  } catch (error) {
    console.error("Create payment due error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create payment due",
    };
  }
}

/**
 * Creates multiple payment dues in batch (for installment plans)
 */
export async function createPaymentDuesBatchAction(
  paymentDues: CreatePaymentDueInput[]
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    if (!paymentDues || paymentDues.length === 0) {
      return { success: false, message: "No payment dues provided" };
    }

    // Validate each payment due
    for (let i = 0; i < paymentDues.length; i++) {
      const due = paymentDues[i];
      
      if (!due.userDocumentId || !due.enrollmentDocumentId || !due.planId) {
        return {
          success: false,
          message: `Payment due ${i + 1} is missing required fields`,
        };
      }

      if (!due.dueAmount || due.dueAmount <= 0) {
        return {
          success: false,
          message: `Payment due ${i + 1} has invalid amount`,
        };
      }
    }

    const results = await createPaymentDuesBatch(paymentDues, token);

    return {
      success: true,
      message: `Successfully created ${results.length} payment dues`,
      data: results,
    };
  } catch (error) {
    console.error("Create payment dues batch error:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create payment dues",
    };
  }
}

/**
 * Fetches all payment dues for a user
 */
export async function getUserPaymentDues(userId: number | string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized", data: [] };
    }

    const paymentDues = await fetchPaymentDuesByUser(userId, token);

    return {
      success: true,
      message: "Payment dues fetched successfully",
      data: paymentDues,
    };
  } catch (error) {
    console.error("Get user payment dues error:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch payment dues",
      data: [],
    };
  }
}

/**
 * Fetches pending payment dues for a user
 */
export async function getPendingPaymentDues(userId: number | string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized", data: [] };
    }

    const paymentDues = await fetchPendingPaymentDues(userId, token);

    return {
      success: true,
      message: "Pending payment dues fetched successfully",
      data: paymentDues,
    };
  } catch (error) {
    console.error("Get pending payment dues error:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch pending payment dues",
      data: [],
    };
  }
}

/**
 * Fetches payment dues for an enrollment
 */
export async function getEnrollmentPaymentDues(enrollmentDocumentId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized", data: [] };
    }

    const paymentDues = await fetchPaymentDuesByEnrollment(
      enrollmentDocumentId,
      token
    );

    return {
      success: true,
      message: "Enrollment payment dues fetched successfully",
      data: paymentDues,
    };
  } catch (error) {
    console.error("Get enrollment payment dues error:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch enrollment payment dues",
      data: [],
    };
  }
}

/**
 * Updates a payment due record
 */
export async function updatePaymentDueAction(
  documentId: string,
  paymentDueData: Partial<CreatePaymentDueInput>
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    if (!documentId) {
      return { success: false, message: "Document ID is required" };
    }

    const result = await updatePaymentDue(documentId, paymentDueData, token);

    return {
      success: true,
      message: "Payment due updated successfully",
      data: result,
    };
  } catch (error) {
    console.error("Update payment due error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update payment due",
    };
  }
}

/**
 * Marks a payment due as paid
 */
export async function markPaymentDueAsPaidAction(
  documentId: string,
  paymentInfo: {
    paidAmount: number;
    paidDate: string;
    paymentReference: string;
    paymentDocumentId: string;
  }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    if (!documentId) {
      return { success: false, message: "Document ID is required" };
    }

    if (
      !paymentInfo.paidAmount ||
      !paymentInfo.paidDate ||
      !paymentInfo.paymentReference
    ) {
      return { success: false, message: "Payment information is incomplete" };
    }

    const result = await markPaymentDueAsPaid(documentId, paymentInfo, token);

    return {
      success: true,
      message: "Payment due marked as paid successfully",
      data: result,
    };
  } catch (error) {
    console.error("Mark payment due as paid error:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to mark payment due as paid",
    };
  }
}

/**
 * Deletes a payment due record
 */
export async function deletePaymentDueAction(documentId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    if (!documentId) {
      return { success: false, message: "Document ID is required" };
    }

    await deletePaymentDue(documentId, token);

    return {
      success: true,
      message: "Payment due deleted successfully",
    };
  } catch (error) {
    console.error("Delete payment due error:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete payment due",
    };
  }
}
