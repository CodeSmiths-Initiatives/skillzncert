"use server";

import { fetchPaymentsByEnrollment, fetchAllPayments } from "@/lib/services/payment.service";
import { getAuthUser } from "@/lib/auth/get-auth-user";
import { isAdmin } from "@/lib/auth/roles";

export async function getPaymentsByEnrollment(enrollmentDocumentId: string) {
  try {
    const { user, token } = await getAuthUser();

    if (!token) {
      return { success: false, message: "Unauthorized", data: [] };
    }

    if (!isAdmin(user)) {
      return { success: false, message: "Forbidden", data: [] };
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
    const { user, token } = await getAuthUser();

    if (!token) {
      return { success: false, message: "Unauthorized", data: [] };
    }

    if (!isAdmin(user)) {
      return { success: false, message: "Forbidden", data: [] };
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
