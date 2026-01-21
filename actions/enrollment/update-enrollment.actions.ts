"use server";

import { getAuthUser } from "@/lib/auth/get-auth-user";
import { updateEnrollmentData } from "@/lib/services/enrollment.service";
import { revalidatePath } from "next/cache";

export async function updateEnrollmentAction(
  documentId: string,
  formData: FormData
) {
  const { user, token } = await getAuthUser();

  if (!user || !token) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  try {
    const result = await updateEnrollmentData(documentId, formData, token);

    if (result.success) {
      revalidatePath("/dashboard/profile");
    }

    return result;
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Update failed",
    };
  }
}
