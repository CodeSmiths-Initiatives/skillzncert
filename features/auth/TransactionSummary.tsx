import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function TransactionSummary() {
	return (
		<div className="w-full max-w-3xl mx-auto my-20">
			<div className="shadow-md py-5 px-10">
				<div className="py-4">
					<h3 className="text-3xl font-semibold">Order Summary</h3>
				</div>
				<div>
					<p>Full name</p>
					<p>Application</p>
					<p>Academic session</p>
					<p>Payment type</p>
					<p>Application Form</p>
					<p>Bank Charges</p>
					<p>Total</p>
				</div>
				<Button className="mt-4 bg-[#51A8B1] text-white text-base font-semibold hover:border-2 hover:border-[#51A8B1] hover:bg-white hover:text-[#51A8B1] py-2 rounded-md">
					<Link href={"./paymentMethod"}>Proceed</Link>
				</Button>
			</div>
		</div>
	);
}
