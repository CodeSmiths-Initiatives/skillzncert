"use server";

import { cookies } from "next/headers";
import { fetchAllEnrollments } from "@/lib/services/enrollment.service";

export async function getAllEnrollments() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, message: "Unauthorized", data: [] };
    }

    const data = await fetchAllEnrollments(token);

    return { success: true, data };
  } catch (error) {
    console.error("Get all enrollments error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch enrollments",
      data: [],
    };
  }
}
