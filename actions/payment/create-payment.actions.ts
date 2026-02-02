"use server";

import { cookies } from "next/headers";
import { createPayment } from "@/lib/services/payment.service";
import type { CreatePaymentInput } from "@/lib/services/payment.service";
import { logPaymentCompleted } from "@/actions/audit/audit.actions";
import { PAYMENT_PLANS } from "@/lib/payment-plans";
import { getAuthUser } from "@/lib/auth/get-auth-user";

export async function createPaymentAction(paymentData: CreatePaymentInput) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    // Validate required fields
    if (!paymentData.userDocumentId) {
      return { success: false, message: "User document ID is required" };
    }

    if (!paymentData.enrollmentDocumentId) {
      return { success: false, message: "Enrollment document ID is required" };
    }

    if (!paymentData.paymentMode) {
      return { success: false, message: "Payment mode is required" };
    }

    if (!paymentData.month) {
      return { success: false, message: "Month is required" };
    }

    if (!paymentData.year || paymentData.year < 2000) {
      return { success: false, message: "Valid year is required" };
    }

    if (!paymentData.amount || paymentData.amount <= 0) {
      return { success: false, message: "Valid amount is required" };
    }

    if (!paymentData.emailAddress) {
      return { success: false, message: "Email address is required" };
    }

    if (!paymentData.paymentDate) {
      return { success: false, message: "Payment date is required" };
    }

    // Validate reference if provided
    if (paymentData.reference && paymentData.reference.trim().length === 0) {
      return { success: false, message: "Payment reference cannot be empty" };
    }

    const result = await createPayment(paymentData, token);

    // Log audit trail for payment completion
    const { user } = await getAuthUser();
    const userName = user?.username || paymentData.emailAddress || "Unknown User";
    const planName = paymentData.planId && PAYMENT_PLANS[paymentData.planId]
      ? PAYMENT_PLANS[paymentData.planId].name
      : "Payment";

    await logPaymentCompleted(
      userName,
      paymentData.amount,
      planName,
      result.documentId || result.id?.toString() || "",
      {
        paymentMode: paymentData.paymentMode,
        month: paymentData.month,
        year: paymentData.year,
        planId: paymentData.planId,
        enrollmentId: paymentData.enrollmentDocumentId,
      }
    );

    return {
      success: true,
      message: "Payment created successfully",
      data: result,
    };
  } catch (error) {
    console.error("Create payment error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create payment",
    };
  }
}
