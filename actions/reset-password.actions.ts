"use server";

export async function resetPasswordAction(data: {
  code: string;
  password: string;
  passwordConfirmation: string;
}) {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/auth/reset-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: data.code.trim(),
        password: data.password,
        passwordConfirmation: data.passwordConfirmation,
      }),
      cache: "no-store",
    }
  );

  const json = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message:
        json?.error?.message ||
        "Reset password failed",
    };
  }

  return { success: true };
}
