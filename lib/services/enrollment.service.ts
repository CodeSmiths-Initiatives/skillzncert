export type EnrollmentStatus = {
  exists: boolean;
  isPaymentDone: boolean;
  documentId?: string;
};

export async function fetchEnrollmentByUser(
  userId: number,
  token: string
): Promise<EnrollmentStatus> {
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
    documentId: enrollment.documentId,
  };
}

export async function submitEnrollment(formData: FormData, token: string) { 

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

export async function updateEnrollmentPayment(
  documentId: string,
  isPaymentDone: boolean,
  token: string
) {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/enrollments/${documentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          isPaymentDone,
        },
      }),
      cache: "no-store",
    }
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(
      json?.error?.message || "Failed to update payment status"
    );
  }

  return json;
}

