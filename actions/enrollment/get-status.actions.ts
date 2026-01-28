"use server";

import { getAuthUser } from "@/lib/auth/get-auth-user";
import { getEnrollmentStatus } from "@/lib/services/enrollment.service";

export async function getEnrollmentStatusAction() {
  try {
    const { user, token } = await getAuthUser();

    if (!user || !token) {
      return {
        exists: false,
        isPaymentDone: false,
        documentId: null,
      };
    }

    return await getEnrollmentStatus(user.id, token);
  } catch (error) {
    console.error("Enrollment status action error:", error);
    return {
      exists: false,
      isPaymentDone: false,
      documentId: null,
    };
  }
}
