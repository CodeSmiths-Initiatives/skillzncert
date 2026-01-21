"use server";

import { getAuthUser } from "@/lib/auth/get-auth-user";
import { getEnrollmentData } from "@/lib/services/enrollment.service";

export async function getEnrollmentAction() {
  const { user, token } = await getAuthUser();

  if (!user || !token) {
    return {
      success: false,
      message: "Unauthorized",
      data: null,
    };
  }

  try {
    const data = await getEnrollmentData(user.id, token);

    if (!data) {
      return {
        success: false,
        message: "No enrollment found",
        data: null,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to fetch enrollment",
      data: null,
    };
  }
}
