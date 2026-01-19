"use server";

import { id } from "date-fns/locale";
import { cookies } from "next/headers";

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

  const res = await fetch(
    `${process.env.STRAPI_URL}/api/auth/local`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: data.email,
        password: data.password,
      }),
      cache: "no-store",
    }
  );

  const json = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message:
        json?.error?.message ||
        "Invalid email or password",
    };
  }

  const { jwt, user } = json;

  // 🔐 STORE JWT SECURELY
  (await
        // 🔐 STORE JWT SECURELY
        cookies()).set({
    name: "auth_token",
    value: jwt,
    httpOnly: true,
    //secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

   (await cookies()).set({
    name: "auth_user",
    value: JSON.stringify({
      documentId: user.documentId,
      username: user.username,
      id: user.id
    }),
    httpOnly: true,
    //secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return {
    success: true,
    user,
  };
}
