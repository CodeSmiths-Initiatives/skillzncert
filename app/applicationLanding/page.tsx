import ApplicationLanding from "@/features/auth/ApplicationLanding";
import { getEnrollmentStatusAction } from "@/actions/enrollment/get-status.actions";
import { getAuthUser } from "@/lib/auth/get-auth-user";

export default async function Page() {
 const { user } = await getAuthUser();

  const enrollmentStatus = await getEnrollmentStatusAction();

  return (
    <ApplicationLanding
      userName={user?.username ?? "User"}
      enrollmentStatus={enrollmentStatus}
    />
  );
}
