"use server";

import { cookies } from "next/headers";
import { fetchPaymentsByEnrollment, fetchAllPayments } from "@/lib/services/payment.service";

export async function getPaymentsByEnrollment(enrollmentDocumentId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized", data: [] };
    }

    if (!enrollmentDocumentId) {
      return { success: false, message: "Enrollment document ID is required", data: [] };
    }

    const data = await fetchPaymentsByEnrollment(enrollmentDocumentId, token);

    return { success: true, data };
  } catch (error) {
    console.error("Get payments error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch payments",
      data: [],
    };
  }
}

export async function getAllPayments() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized", data: [] };
    }

    const data = await fetchAllPayments(token);

    return { success: true, data };
  } catch (error) {
    console.error("Get all payments error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch payments",
      data: [],
    };
  }
}
