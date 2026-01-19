import { cookies } from "next/headers";

export type EnrollmentStatus = {
  exists: boolean;
  isPaymentDone: boolean;
};

export async function getEnrollmentStatus(
  userId: number
): Promise<EnrollmentStatus> {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token")?.value;

  // 🔐 If unauthenticated, treat as no enrollment
  if (!token) {
    return { exists: false, isPaymentDone: false };
  }

  const res = await fetch(
    `${process.env.STRAPI_URL}/api/enrollments?filters[user][id][$eq]=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch enrollment");
  }

  const json = await res.json();
  const enrollment = json?.data?.[0];

  if (!enrollment) {
    return { exists: false, isPaymentDone: false };
  }

  return {
    exists: true,
    isPaymentDone: enrollment.isPaymentDone,
  };
}
