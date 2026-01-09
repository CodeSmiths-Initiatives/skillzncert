"use server";

export async function createTestAction() {
  const res = await fetch(`${process.env.STRAPI_URL}/api/tests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        title: "Clean test",
        description: "No draft publish",
        password: "Mail_123",
      },
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to create test");
  }

  return res.json();
}
