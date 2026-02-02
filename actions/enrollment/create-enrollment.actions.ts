"use server";

import { submitEnrollment } from "@/lib/services/enrollment.service";
import { cookies } from "next/headers";
import { logEnrollmentCreated } from "@/actions/audit/audit.actions";
import { getAuthUser } from "@/lib/auth/get-auth-user";

export async function submitEnrollmentAction(formData: FormData) {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value;

  if (!token) {
    return { success: false, message: "Unauthorized" };
  }

  console.log(formData);
  
  const result = await submitEnrollment(formData, token);

  // Log audit trail for enrollment creation
  if (result.success) {
    const { user } = await getAuthUser();
    const firstName = formData.get("data[firstName]") as string;
    const lastName = formData.get("data[lastName]") as string;
    const userName = user?.username || `${firstName} ${lastName}`;

    await logEnrollmentCreated(
      userName,
      "", // We don't have enrollmentId from the result, pass empty string
      undefined, // No course name in current implementation
      {
        firstName,
        lastName,
        phoneNumber: formData.get("data[phoneNumber]") as string,
        country: formData.get("data[country]") as string,
        yearOfStudy: formData.get("data[yearOfStudy]") as string,
      }
    );
  }

  return result;
}
