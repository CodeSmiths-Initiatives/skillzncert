"use server";

import { cookies } from "next/headers";
import { fetchEnrollmentByUser } from "@/lib/services/enrollment.service";

export async function getEnrollmentStatusAction(userId: number) {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return { exists: false, isPaymentDone: false };
  }

  return fetchEnrollmentByUser(userId, token);
}
