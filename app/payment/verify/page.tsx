import { getEnrollmentStatusAction } from "@/actions/enrollment/get-status.actions";
import { getAuthUser } from "@/lib/auth/get-auth-user";
import PaymentVerify from "@/features/auth/PaymentVerify";
import { Suspense } from "react";
import { redirect } from "next/navigation";

export default async function page() {
  const enrollment = await getEnrollmentStatusAction();
  const { user } = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentVerify 
        enrollmentDocumentId={enrollment.documentId}
        userId={user.id}
        userEmail={user.email}
      />
    </Suspense>
  );
}
