"use server";

import { cookies } from "next/headers";

export async function submitEnrollmentAction(formData: FormData) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value;

  if (!token) {
    return { success: false, message: "Unauthorized" };
  }

  const res = await fetch(`${process.env.STRAPI_URL}/api/enrollments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData, // multipart/form-data
  });

  const json = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: json?.error?.message || "Enrollment failed",
      details: json?.error?.details,
    };
  }

  return { success: true };
}
