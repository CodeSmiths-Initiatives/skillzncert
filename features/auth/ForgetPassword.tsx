"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgetPassword() {
	const router = useRouter();
	const [email, setEmail] = useState("");

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		console.log("Reset email:", email);

		// Move to OTP page
		router.push("/forgetPassword/otp");
	};

	return (
		<div className="w-full max-w-3xl mx-auto my-20">
			<div className="rounded-md shadow-md p-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-[#51A8B1]">Logo</h1>
					<h2 className="text-xl font-semibold mt-2">Forgot Password</h2>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4 mt-6">
					<div className="flex flex-col space-y-2">
						<label>Email Address</label>
						<Input
							type="email"
							placeholder="Enter your email"
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>

					<Button type="submit" className="login-button w-full">
						Send OTP
					</Button>
				</form>

				<div className="text-center pt-3">
					<p>
						Remember your password?{" "}
						<Link href="/login" className="text-teal-500">
							Login
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
