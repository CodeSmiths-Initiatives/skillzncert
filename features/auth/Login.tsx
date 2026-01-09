"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const [loginSuccess, setLoginSuccess] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		console.log("Login values:", formData);

		const hasAppliedBefore = formData.email.includes("applied");

		setLoginSuccess(true);

		setTimeout(() => {
			if (hasAppliedBefore) {
				router.push("/dashboard");
			} else {
				router.push("/onboarding");
			}
		}, 1500);
	};

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

				{loginSuccess && (
					<div className="bg-green-100 text-green-700 p-3 rounded my-4 text-center">
						Login Successful
					</div>
				)}
				<form onSubmit={handleLogin}>
					<div className="flex flex-col space-y-2">
						<label>Email Address</label>
						<Input
							type="email"
							name="email"
							placeholder="Enter your Email"
							onChange={handleChange}
						/>
					</div>

					<div className="flex flex-col space-y-2">
						<label>Password</label>
						<Input
							type="password"
							name="password"
							placeholder="Enter your password"
							onChange={handleChange}
						/>
					</div>

					<p className="text-base font-medium">
						<Link href="/forgetPassword">Forgot password?</Link>
					</p>

					<Button className="login-button w-full">Login</Button>
				</form>

				<div className="text-center my-5">OR</div>

				<Button className="w-full bg-gray-200 text-black font-semibold border hover:bg-white py-3">
					<FcGoogle size={24} />
					<span className="ml-2">Continue with Google</span>
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
