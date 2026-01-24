"use server";

import { cookies } from "next/headers";
import { createPayment } from "@/lib/services/payment.service";
import type { CreatePaymentInput } from "@/lib/services/payment.service";

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
