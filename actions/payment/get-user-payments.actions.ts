"use server";

import { fetchPaymentsByUser } from "@/lib/services/payment.service";
import { getAuthUser } from "@/lib/auth/get-auth-user";

export async function getUserPayments(userId?: number) {
  try {
    const { user, token } = await getAuthUser();

    if (!token || !user) {
      return { success: false, message: "Unauthorized", data: [] };
    }

    const scopedUserId = user.id;

    if (!scopedUserId) {
      return { success: false, message: "User ID is required", data: [] };
    }

    if (userId && userId !== scopedUserId) {
      console.warn("Blocked cross-user payment fetch attempt", {
        requestedUserId: userId,
        authenticatedUserId: scopedUserId,
      });
    }

    const data = await fetchPaymentsByUser(scopedUserId, token);

    return { success: true, data };
  } catch (error) {
    console.error("Get user payments error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch payments",
      data: [],
    };
  }
}
