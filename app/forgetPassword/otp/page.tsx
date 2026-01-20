import VerifyOtp from "@/features/auth/Otp";
import React, { Suspense } from "react";

export default function page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<VerifyOtp />
		</Suspense>
	);
}
