"use server";

import { submitEnrollment } from "@/lib/services/enrollment.service";
import { cookies } from "next/headers";

export async function submitEnrollmentAction(formData: FormData) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value;

  if (!token) {
    return { success: false, message: "Unauthorized" };
  }

  return submitEnrollment(formData, token);
}
