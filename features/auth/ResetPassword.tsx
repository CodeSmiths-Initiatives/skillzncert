"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPassword() {
	const router = useRouter();

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const handleReset = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		console.log("New Password:", password);
		console.log("Confirm Password:", confirmPassword);

		router.push("/login");
	};

	return (
		<div className="w-full max-w-3xl mx-auto my-20">
			<div className="rounded-md shadow-md p-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-[#51A8B1]">Logo</h1>
					<h2 className="text-xl font-bold text-center">Reset Password</h2>
				</div>

				<form onSubmit={handleReset} className="space-y-4 mt-6">
					<div className="flex flex-col space-y-2">
						<label>New Password</label>
						<Input
							type="password"
							placeholder="Enter new password"
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>

					<div className="flex flex-col space-y-2">
						<label>Confirm Password</label>
						<Input
							type="password"
							placeholder="Confirm password"
							onChange={(e) => setConfirmPassword(e.target.value)}
						/>
					</div>

					<Button type="submit" className="login-button w-full">
						Reset Password
					</Button>
				</form>
			</div>
		</div>
	);
}
