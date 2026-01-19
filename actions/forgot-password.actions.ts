"use server";

export async function forgotPasswordAction(email: string) {
  // Basic guard (never trust client fully)
  if (!email) {
    return {
      success: false,
      message: "Email is required",
    };
  }

  try {
    const res = await fetch(
      `${process.env.STRAPI_URL}/api/auth/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        cache: "no-store",
      }
    );

    /**
     * ⚠️ SECURITY NOTE (IMPORTANT)
     * Strapi intentionally returns 200 even if email does not exist
     * to prevent user enumeration attacks.
     */

    if (!res.ok) {
      const json = await res.json();

      return {
        success: false,
        message:
          json?.error?.message ||
          "Unable to send reset email",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Forgot password error:", error);

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
