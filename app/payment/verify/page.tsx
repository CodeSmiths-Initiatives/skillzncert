import PaymentVerify from "@/features/auth/PaymentVerify";
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentVerify />
    </Suspense>
  );
}
