import { getAuthUser } from "@/lib/auth/get-auth-user";
import Payment from "@/features/auth/Payment";
import { Suspense } from "react";
import { redirect } from "next/navigation";

export default async function page() {
  const { user } = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Payment userEmail={user.email} />
    </Suspense>
  );
}
