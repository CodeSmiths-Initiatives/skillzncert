import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React from "react";

export default function ForgetPassword() {
	return (
		<div className="w-full max-w-3xl mx-auto my-20">
			<div className="rounded-md shadow-md p-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-[#51A8B1]">Logo</h1>
				</div>
				<form action="#">
					<div className="flex flex-col space-y-2">
						<label> Email Address</label>
						<Input
							type="email"
							className="input-field"
							placeholder="Enter your Email"
						/>
					</div>
					<Button className="login-button">
						<Link href="#">Send reset email</Link>
					</Button>
				</form>

				<div className="text-center pt-3">
					<p>
						Remember your password?
						<Link href="/login" className="text-teal-500">
							Login
						</Link>
					</p>
				</div>
				<div className=" text-teal-500 flex items-center justify-center space-x-3 mt-6 ">
					<p className="border-r pr-3">Terms of use</p>
					<p>privacy policy</p>
				</div>
			</div>
		</div>
	);
}
