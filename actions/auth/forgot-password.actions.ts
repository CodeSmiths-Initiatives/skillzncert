"use server";

import { requestPasswordReset } from "@/lib/services/auth.service";

export async function forgotPasswordAction(email: string) {
  if (!email) {
    return {
      success: false,
      message: "Email is required",
    };
  }

  try {
    await requestPasswordReset(email);

    // Always return success to prevent enumeration
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
}
