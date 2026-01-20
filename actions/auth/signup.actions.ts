"use server";

import { signupUser } from "@/lib/services/auth.service";

export async function signupAction(data: {
  username: string;
  email: string;
  password: string;
  agree: boolean;
}) {
  if (!data.agree) {
    return {
      success: false,
      message: "You must accept the terms and conditions",
    };
  }

  if (!data.username || !data.email || !data.password) {
    return {
      success: false,
      message: "All fields are required",
    };
  }

  try {
    await signupUser({
      username: data.username,
      email: data.email,
      password: data.password,
    });

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Signup failed",
    };
  }
}
