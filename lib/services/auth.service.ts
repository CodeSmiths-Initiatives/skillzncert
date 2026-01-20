type LoginPayload = {
  email: string;
  password: string;
};

export async function loginWithEmail(
  payload: LoginPayload
) {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/auth/local`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: payload.email,
        password: payload.password,
      }),
      cache: "no-store",
    }
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(
      json?.error?.message || "Invalid email or password"
    );
  }

  return json; // { jwt, user }
}

export async function requestPasswordReset(email: string) {
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
   * ⚠️ SECURITY NOTE
   * Strapi always returns 200 to prevent user enumeration
   */

  if (!res.ok) {
    const json = await res.json();
    throw new Error(
      json?.error?.message || "Unable to send reset email"
    );
  }

  return true;
}

export async function resetPassword(payload: {
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
        code: payload.code.trim(),
        password: payload.password,
        passwordConfirmation: payload.passwordConfirmation,
      }),
      cache: "no-store",
    }
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(
      json?.error?.message || "Reset password failed"
    );
  }

  return true;
}

export async function signupUser(payload: {
  username: string;
  email: string;
  password: string;
}) {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/auth/local/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: payload.username.toLowerCase(),
        email: payload.email,
        password: payload.password,
      }),
      cache: "no-store",
    }
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(
      json?.error?.message || "Signup failed"
    );
  }

  return json;
}

