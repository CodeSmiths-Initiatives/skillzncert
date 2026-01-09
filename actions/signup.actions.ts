"use server";

export async function signupAction(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  agree: boolean;
}) {
  if (!data.agree) {
    throw new Error("You must agree to the terms");
  }

  const res = await fetch(
    `${process.env.STRAPI_URL}/api/auth/local/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: data.email, // required by Strapi
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        agree: data.agree,
      }),
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error?.message || "Signup failed");
  }

  return res.json(); // { jwt, user }
}
