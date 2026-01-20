"use client";

import dynamic from 'next/dynamic';
import React from "react";

const Payment = dynamic(() => import("@/features/auth/Payment"), {
  ssr: false,
});

export default function page() {
	return (
		<div>
			<Payment />
		</div>
	);
}
