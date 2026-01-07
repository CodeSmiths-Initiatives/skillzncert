"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
	const router = useRouter();

	useEffect(() => {
		const today = new Date();
		const isDDay = today.getMonth() === 2 && today.getDate() === 1;

		if (!isDDay) {
			router.replace("/counter");
		}
	}, [router]);

	return (
		<div className="w-full max-w-3xl mx-auto my-20">
			<div className="rounded-md shadow-md p-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-[#51A8B1]">Logo</h1>
					<h3 className="text-xl font-semibold py-1">Welcome back!</h3>
				</div>

				<form>
					<div className="flex flex-col space-y-2">
						<label>Email Address</label>
						<Input type="email" placeholder="Enter your Email" />
					</div>

					<div className="flex flex-col space-y-2">
						<label>Password</label>
						<Input type="password" placeholder="Enter your password" />
					</div>

					<p className="text-base font-medium">
						<Link href="/forgetPassword">Forgot password?</Link>
					</p>

					<Button className="login-button w-full">
						<Link href="/onboarding">Login</Link>
					</Button>
				</form>

				<div className="text-center my-5">OR</div>

				<Button className="w-full bg-gray-200 text-black font-semibold border hover:bg-white py-3">
					<FcGoogle size={24} />
					Continue with Google
				</Button>

				<div className="text-center pt-3">
					<p>
						Are you new?{" "}
						<Link href="/register" className="text-teal-500">
							Create an account
						</Link>
					</p>
				</div>

				<div className="text-teal-500 flex justify-center gap-4 mt-6">
					<p className="border-r pr-3">Terms of use</p>
					<p>Privacy policy</p>
				</div>
			</div>
		</div>
	);
}
