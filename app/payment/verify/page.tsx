import { getEnrollmentStatusAction } from "@/actions/enrollment/get-status.actions";
import PaymentVerify from "@/features/auth/PaymentVerify";
import { Suspense } from "react";

export default async function page() {
  const enrollment = await getEnrollmentStatusAction();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentVerify enrollmentDocumentId={enrollment.documentId} />
    </Suspense>
  );
}
