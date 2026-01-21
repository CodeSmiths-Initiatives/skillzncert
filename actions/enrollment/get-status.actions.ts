"use server";

import { getAuthUser } from "@/lib/auth/get-auth-user";
import { getEnrollmentStatus } from "@/lib/services/enrollment.service";

export async function getEnrollmentStatusAction() {
  const { user, token } = await getAuthUser();

  if (!user || !token) {
    return {
      exists: false,
      isPaymentDone: false,
      documentId: null,
    };
  }

  return getEnrollmentStatus(user.id, token);
}
