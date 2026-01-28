export type EnrollmentStatus = {
  exists: boolean;
  isPaymentDone: boolean;
  documentId?: string;
};

export interface EnrollmentData {
  id: number;
  documentId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  state: string;
  country: string;
  preferredLanguage: string;
  yearOfStudy: string;
  previousCertification: string;
  universityAttending: string;
  hasNetacadAccount: boolean;
  netacadId?: string;
  preferredNetwork: string;
  numberForData: string;
  passport?: {
    url: string;
    name: string;
  };
  schoolIdCard?: {
    url: string;
    name: string;
  };
  isPaymentDone: boolean;
  batchName?: string;
  selectedPlan?: string;
  planName?: string;
  planAmount?: number;
  planDiscount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface EnrolleeData {
  id: number;
  documentId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  isPaymentDone: boolean;
  batchName?: string;
  selectedPlan?: string;
  planName?: string;
  planAmount?: number;
  planDiscount?: number;
  createdAt: string;
  updatedAt: string;
  state: string;
  country: string;
  yearOfStudy: string;
  passport?: {
    url: string;
    name: string;
  };
  schoolIdCard?: {
    url: string;
    name: string;
  };
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

interface EnrollmentCreateData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  state: string;
  country: string;
  preferredLanguage: string;
  yearOfStudy: string;
  previousCertification: string;
  universityAttending: string;
  hasNetacadAccount: boolean;
  netacadId: string;
  preferredNetwork: string;
  numberForData: string;
  passport: number;
  schoolIdCard: number;
}

export async function fetchEnrollmentByUser(
  userId: number,
  token: string,
): Promise<EnrollmentStatus> {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/enrollments?filters[user][id][$eq]=${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
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

  try {
    // Step 1: Upload passport file to get its ID
    const passportFile = formData.get("files.passport") as File;
    const schoolIdFile = formData.get("files.schoolIdCard") as File;

    if (!passportFile || !schoolIdFile) {
      return { success: false, message: "Missing required files" };
    }

    // Upload passport
    const passportFormData = new FormData();
    passportFormData.append("files", passportFile, passportFile.name);

    const passportRes = await fetch(`${process.env.STRAPI_URL}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: passportFormData,
    });

    if (!passportRes.ok) {
      return { success: false, message: "Failed to upload passport" };
    }

    const passportUploaded = await passportRes.json();
    const passportId = passportUploaded[0]?.id;

    // Upload school ID card
    const schoolIdFormData = new FormData();
    schoolIdFormData.append("files", schoolIdFile, schoolIdFile.name);

    const schoolIdRes = await fetch(`${process.env.STRAPI_URL}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: schoolIdFormData,
    });

    if (!schoolIdRes.ok) {
      return { success: false, message: "Failed to upload school ID card" };
    }

    const schoolIdUploaded = await schoolIdRes.json();
    const schoolIdCardId = schoolIdUploaded[0]?.id;

    // Step 2: Create enrollment entry with file IDs
    const enrollmentData: EnrollmentCreateData = {
      firstName: formData.get("data[firstName]") as string,
      lastName: formData.get("data[lastName]") as string,
      phoneNumber: formData.get("data[phoneNumber]") as string,
      address: formData.get("data[address]") as string,
      state: formData.get("data[state]") as string,
      country: formData.get("data[country]") as string,
      preferredLanguage: formData.get("data[preferredLanguage]") as string,
      yearOfStudy: formData.get("data[yearOfStudy]") as string,
      previousCertification: formData.get(
        "data[previousCertification]",
      ) as string,
      universityAttending: formData.get("data[universityAttending]") as string,
      hasNetacadAccount: formData.get("data[hasNetacadAccount]") === "true",
      netacadId: formData.get("data[netacadId]") as string,
      preferredNetwork: formData.get("data[preferredNetwork]") as string,
      numberForData: formData.get("data[numberForData]") as string,
      passport: passportId,
      schoolIdCard: schoolIdCardId,
    };

    // Submit enrollment
    const res = await fetch(`${process.env.STRAPI_URL}/api/enrollments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ data: enrollmentData }),
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
  } catch (error) {
    console.error("Enrollment submission error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Enrollment failed",
    };
  }
}

export async function updateEnrollmentPayment(
  documentId: string,
  isPaymentDone: boolean,
  token: string,
  batchName?: string,
) {
  const updateData: any = {
    isPaymentDone,
  };

  // Add batch name if provided
  if (batchName) {
    updateData.batchName = batchName;
  }

  const res = await fetch(
    `${process.env.STRAPI_URL}/api/enrollments/${documentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: updateData,
      }),
      cache: "no-store",
    },
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.error?.message || "Failed to update payment status");
  }

  return json;
}

export async function getEnrollmentStatus(userId: number, token: string) {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/enrollments?filters[user][id][$eq]=${userId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch enrollment");
  }

  const json = await res.json();
  const enrollment = json?.data?.[0];

  if (!enrollment) {
    return {
      exists: false,
      isPaymentDone: false,
      documentId: null,
    };
  }

  return {
    exists: true,
    isPaymentDone: enrollment.isPaymentDone,
    documentId: enrollment.documentId,
  };
}

export async function getEnrollmentData(
  userId: number,
  token: string,
): Promise<EnrollmentData | null> {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/enrollments?filters[user][id][$eq]=${userId}&populate=*`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch enrollment data");
  }

  const json = await res.json();
  const enrollment = json?.data?.[0];

  if (!enrollment) {
    return null;
  }

  return {
    id: enrollment.id,
    documentId: enrollment.documentId,
    firstName: enrollment.firstName || "",
    lastName: enrollment.lastName || "",
    phoneNumber: enrollment.phoneNumber || "",
    address: enrollment.address || "",
    state: enrollment.state || "",
    country: enrollment.country || "",
    preferredLanguage: enrollment.preferredLanguage || "",
    yearOfStudy: enrollment.yearOfStudy || "",
    previousCertification: enrollment.previousCertification || "",
    universityAttending: enrollment.universityAttending || "",
    hasNetacadAccount: enrollment.hasNetacadAccount || false,
    netacadId: enrollment.netacadId || "",
    preferredNetwork: enrollment.preferredNetwork || "",
    numberForData: enrollment.numberForData || "",
    passport: enrollment.passport
      ? {
          url: `${process.env.STRAPI_URL}${enrollment.passport.url}`,
          name: enrollment.passport.name,
        }
      : undefined,
    schoolIdCard: enrollment.schoolIdCard
      ? {
          url: `${process.env.STRAPI_URL}${enrollment.schoolIdCard.url}`,
          name: enrollment.schoolIdCard.name,
        }
      : undefined,
    isPaymentDone: enrollment.isPaymentDone || false,
    batchName: enrollment.batchName || undefined,
    selectedPlan: enrollment.selectedPlan || undefined,
    planName: enrollment.planName || undefined,
    planAmount: enrollment.planAmount || undefined,
    planDiscount: enrollment.planDiscount || undefined,
    createdAt: enrollment.createdAt,
    updatedAt: enrollment.updatedAt,
  };
}

export async function updateEnrollmentData(
  documentId: string,
  formData: FormData,
  token: string,
) {
  try {
    const updateData: any = {};

    // Extract text fields from FormData
    const textFields = [
      "firstName",
      "lastName",
      "phoneNumber",
      "address",
      "state",
      "country",
      "preferredLanguage",
      "yearOfStudy",
      "previousCertification",
      "universityAttending",
      "netacadId",
      "preferredNetwork",
      "numberForData",
    ];

    textFields.forEach((field) => {
      const value = formData.get(`data[${field}]`);
      if (value !== null) {
        updateData[field] = value as string;
      }
    });

    // Handle hasNetacadAccount
    const hasNetacadAccount = formData.get("data[hasNetacadAccount]");
    if (hasNetacadAccount !== null) {
      updateData.hasNetacadAccount = hasNetacadAccount === "true";
    }

    // Step 1: Upload new files if provided
    const passportFile = formData.get("files.passport") as File | null;
    const schoolIdFile = formData.get("files.schoolIdCard") as File | null;

    console.log("Passport file:", passportFile, "Size:", passportFile?.size);
    console.log("School ID file:", schoolIdFile, "Size:", schoolIdFile?.size);

    // Upload passport if new file provided
    if (passportFile && passportFile instanceof File && passportFile.size > 0) {
      console.log("Uploading passport...");
      const passportFormData = new FormData();
      passportFormData.append("files", passportFile, passportFile.name);

      const passportRes = await fetch(`${process.env.STRAPI_URL}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: passportFormData,
      });

      console.log("Passport upload response:", passportRes.status);

      if (passportRes.ok) {
        const passportUploaded = await passportRes.json();
        updateData.passport = passportUploaded[0]?.id;
        console.log("Passport uploaded, ID:", updateData.passport);
      }
    }

    // Upload school ID card if new file provided
    if (schoolIdFile && schoolIdFile instanceof File && schoolIdFile.size > 0) {
      console.log("Uploading school ID...");
      const schoolIdFormData = new FormData();
      schoolIdFormData.append("files", schoolIdFile, schoolIdFile.name);

      const schoolIdRes = await fetch(`${process.env.STRAPI_URL}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: schoolIdFormData,
      });

      console.log("School ID upload response:", schoolIdRes.status);

      if (schoolIdRes.ok) {
        const schoolIdUploaded = await schoolIdRes.json();
        updateData.schoolIdCard = schoolIdUploaded[0]?.id;
        console.log("School ID uploaded, ID:", updateData.schoolIdCard);
      }
    }

    // Step 2: Update enrollment with file IDs
    const res = await fetch(
      `${process.env.STRAPI_URL}/api/enrollments/${documentId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: updateData }),
        cache: "no-store",
      },
    );

    const json = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: json?.error?.message || "Update failed",
        details: json?.error?.details,
      };
    }

    return { success: true, data: json.data };
  } catch (error) {
    console.error("Enrollment update error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Update failed",
    };
  }
}

export async function fetchAllEnrollments(
  token: string,
): Promise<EnrolleeData[]> {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/enrollments?populate=*&sort=createdAt:desc`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Strapi API Error:", res.status, errorText);
    throw new Error(`Failed to fetch enrollments: ${res.status} ${errorText}`);
  }

  const json = await res.json();
  const enrollments = json?.data || [];

  return enrollments.map((enrollment: any) => ({
    id: enrollment.id,
    documentId: enrollment.documentId,
    firstName: enrollment.firstName || "",
    lastName: enrollment.lastName || "",
    phoneNumber: enrollment.phoneNumber || "",
    email: enrollment.user?.email || "",
    isPaymentDone: enrollment.isPaymentDone || false,
    batchName: enrollment.batchName || undefined,
    selectedPlan: enrollment.selectedPlan || undefined,
    planName: enrollment.planName || undefined,
    planAmount: enrollment.planAmount || undefined,
    planDiscount: enrollment.planDiscount || undefined,
    createdAt: enrollment.createdAt,
    updatedAt: enrollment.updatedAt,
    state: enrollment.state || "",
    country: enrollment.country || "",
    yearOfStudy: enrollment.yearOfStudy || "",
    passport: enrollment.passport
      ? {
          url: `${process.env.STRAPI_URL}${enrollment.passport.url}`,
          name: enrollment.passport.name,
        }
      : undefined,
    schoolIdCard: enrollment.schoolIdCard
      ? {
          url: `${process.env.STRAPI_URL}${enrollment.schoolIdCard.url}`,
          name: enrollment.schoolIdCard.name,
        }
      : undefined,
    user: enrollment.user
      ? {
          id: enrollment.user.id,
          username: enrollment.user.username,
          email: enrollment.user.email,
        }
      : undefined,
  }));
}
