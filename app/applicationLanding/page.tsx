import { cookies } from "next/headers";
import ApplicationLanding from "@/features/auth/ApplicationLanding";
import { getEnrollmentStatusAction } from "@/actions/enrollment/get-status.actions";

export default async function Page() {
  const cookieStore = cookies();
  const userCookie = (await cookieStore).get("auth_user")?.value;

  let username = "User";
  let userId = 3; // fallback (should not be used in prod)

  if (userCookie) {
    try {
      const parsed = JSON.parse(decodeURIComponent(userCookie));
      username = parsed.username || "User";
      userId = parsed.userId || 3;
    } catch {
      // silently fail, fallback values used
    }
  }

  const enrollmentStatus = await getEnrollmentStatusAction(userId);

  return (
    <ApplicationLanding
      userName={username}
      enrollmentStatus={enrollmentStatus}
    />
  );
}
