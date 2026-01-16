"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent, ChangeEvent } from "react";

export default function ForgetPassword() {
	const router = useRouter();

	const [email, setEmail] = useState<string>("");
	const [error, setError] = useState<string>("");

	/* =======================
	   HANDLERS
	======================= */
	const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
		setEmail(e.target.value);
		setError(""); // clear error while typing
	};

	const validateEmail = (): boolean => {
		if (!email) {
			setError("Email address is required");
			return false;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setError("Please enter a valid email address");
			return false;
		}

		return true;
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
		e.preventDefault();

		if (!validateEmail()) return;

		console.log("Reset email:", email);

		// Move to OTP page
		router.push("/forgetPassword/otp");
	};

	/* =======================
	   JSX
	======================= */
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
							maxLength={30}
							value={email}
							onChange={handleChange}
						/>
						{error && <p className="error-message">{error}</p>}
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
