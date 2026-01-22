"use server";

import { cookies } from "next/headers";
import { fetchPaymentsByUser } from "@/lib/services/payment.service";

export async function getUserPayments(userId: number) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized", data: [] };
    }

    if (!userId) {
      return { success: false, message: "User ID is required", data: [] };
    }

    const data = await fetchPaymentsByUser(userId, token);

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
