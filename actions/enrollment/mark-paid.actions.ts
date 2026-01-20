"use server";

import { cookies } from "next/headers";
import { updateEnrollmentPayment } from "@/lib/services/enrollment.service";

export async function markEnrollmentPaidAction(data: {
  documentId: string;
  isPaymentDone: boolean;
}) {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return { success: false, message: "Unauthorized" };
  }

  if (!data.documentId) {
    return {
      success: false,
      message: "Enrollment documentId is required",
    };
  }

  try {
    await updateEnrollmentPayment(
      data.documentId,
      data.isPaymentDone,
      token
    );

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Payment update failed",
    };
  }
}
