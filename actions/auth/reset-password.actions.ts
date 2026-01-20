"use server";

import { resetPassword } from "@/lib/services/auth.service";

export async function resetPasswordAction(data: {
  code: string;
  password: string;
  passwordConfirmation: string;
}) {
  if (
    !data.code ||
    !data.password ||
    !data.passwordConfirmation
  ) {
    return {
      success: false,
      message: "All fields are required",
    };
  }

  if (data.password !== data.passwordConfirmation) {
    return {
      success: false,
      message: "Passwords do not match",
    };
  }

  try {
    await resetPassword(data);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Reset password failed",
    };
  }
}
