export interface UserData {
  id: number;
  documentId: string;
  username: string;
  email: string;
}

/**
 * Update user's username and email
 */
export async function updateUserProfile(
  userId: number,
  payload: { username: string; email: string },
  token: string
) {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/users/${userId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: payload.username.toLowerCase(),
        email: payload.email,
      }),
      cache: "no-store",
    }
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(
      json?.error?.message || "Failed to update user profile"
    );
  }

  return json;
}

/**
 * Get user data by ID
 */
export async function getUserData(
  userId: number,
  token: string
): Promise<UserData> {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/users/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch user data");
  }

  const json = await res.json();

  return {
    id: json.id,
    documentId: json.documentId,
    username: json.username,
    email: json.email,
  };
}
