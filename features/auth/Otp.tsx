"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyOtp() {
	const router = useRouter();
	const [otp, setOtp] = useState("");

	const handleVerify = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		console.log("Entered OTP:", otp);

		router.push("/forgetPassword/resetPassword");
	};

	return (
		<div className="w-full max-w-3xl mx-auto my-20">
			<div className="rounded-md shadow-md p-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-[#51A8B1]">Logo</h1>
					<h2 className="text-xl font-bold text-center">Verify OTP</h2>
				</div>

				<form onSubmit={handleVerify} className="space-y-4 mt-6">
					<div className="flex flex-col space-y-2">
						<label>OTP</label>
						<Input
							type="text"
							placeholder="Enter OTP"
							onChange={(e) => setOtp(e.target.value)}
						/>
					</div>

					<Button type="submit" className="login-button w-full">
						Verify OTP
					</Button>
				</form>
			</div>
		</div>
	);
}
