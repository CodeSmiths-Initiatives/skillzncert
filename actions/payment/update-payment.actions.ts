"use server";

import { cookies } from "next/headers";
import { updatePayment, deletePayment } from "@/lib/services/payment.service";
import type { CreatePaymentInput } from "@/lib/services/payment.service";

export async function updatePaymentAction(
  documentId: string,
  paymentData: Partial<CreatePaymentInput>
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    if (!documentId) {
      return { success: false, message: "Payment document ID is required" };
    }

    const result = await updatePayment(documentId, paymentData, token);

    return {
      success: true,
      message: "Payment updated successfully",
      data: result,
    };
  } catch (error) {
    console.error("Update payment error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update payment",
    };
  }
}

export async function deletePaymentAction(documentId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized" };
    }

    if (!documentId) {
      return { success: false, message: "Payment document ID is required" };
    }

    await deletePayment(documentId, token);

    return {
      success: true,
      message: "Payment deleted successfully",
    };
  } catch (error) {
    console.error("Delete payment error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete payment",
    };
  }
}
