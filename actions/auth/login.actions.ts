"use server";

import { cookies } from "next/headers";
import { loginWithEmail } from "@/lib/services/auth.service";

export async function loginAction(data: {
  email: string;
  password: string;
}) {
  if (!data.email || !data.password) {
    return {
      success: false,
      message: "Email and password are required",
    };
  }

  try {
    const { jwt, user } = await loginWithEmail(data);

    const cookieStore = cookies();

    // 🔐 JWT cookie
    (await
          // 🔐 JWT cookie
          cookieStore).set({
      name: "auth_token",
      value: jwt,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      // secure: process.env.NODE_ENV === "production",
    });

    // 🔐 User metadata cookie
    (await
          // 🔐 User metadata cookie
          cookieStore).set({
      name: "auth_user",
      value: JSON.stringify({
        documentId: user.documentId,
        username: user.username,
        id: user.id,
        email: user.email,
      }),
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      // secure: process.env.NODE_ENV === "production",
    });

    return { success: true, user };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Login failed",
    };
  }
}
