import { cookies } from "next/headers";

export type AuthUser = {
  id: number;
  documentId: string;
  username: string;
  email: string;
};

export async function getAuthUser(): Promise<{
    user: AuthUser | null;
    token: string | null;
}> {
  const cookieStore = cookies();

  const token = (await cookieStore).get("auth_token")?.value ?? null;
  const userCookie = (await cookieStore).get("auth_user")?.value;

  if (!token || !userCookie) {
    return { user: null, token: null };
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(userCookie));
    return {
      token,
      user: {
        id: parsed.id,
        documentId: parsed.documentId,
        username: parsed.username,
        email: parsed.email || "",
      },
    };
  } catch {
    return { user: null, token: null };
  }
}
