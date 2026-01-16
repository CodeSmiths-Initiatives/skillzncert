"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const [loginSuccess, setLoginSuccess] = useState(false);
	const [showPassword, setShowPassword] = useState<boolean>(false);

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
				router.push("/applicationLanding");
			}
		}, 1500);
	};

	// useEffect(() => {
	// 	const today = new Date();
	// 	const isDDay = today.getMonth() === 2 && today.getDate() === 1;

	// 	if (!isDDay) {
	// 		router.replace("/counter");
	// 	}
	// }, [router]);

	return (
		<div className="w-full max-w-3xl mx-auto my-20">
			<div className="grid md:grid-cols-2 grid-cols-1 w-full max-w-full rounded-md shadow-md">
				<div className="p-6">
					<div className="text-center">
						<Image
							src="/images/logo 1.svg"
							alt="Logo"
							width={50}
							height={10}
							className="mx-auto"
						/>
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
								value={formData.email}
								className="input-field"
								placeholder="Enter your Email"
								onChange={handleChange}
								maxLength={30}
								autoComplete="email"
							/>
						</div>

						<div className="flex flex-col space-y-2 ">
							<label>Password</label>
							<div className="relative">
								<Input
									type={showPassword ? "text" : "password"}
									name="password"
									value={formData.password}
									placeholder="Enter your password"
									className="input-field"
									onChange={handleChange}
									maxLength={15}
									autoComplete="current-password"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/3  -translate-y-1/2 text-gray-500"
								>
									{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
								</button>
							</div>
						</div>

						<p className="text-base font-medium">
							<Link href="/forgetPassword">Forgot password?</Link>
						</p>

						<Button className="login-button w-full">Login</Button>
					</form>

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
				<div className="relative h-full rounded-r-md  overflow-hidden">
					<Image
						src="/images/form.svg"
						alt="Register"
						fill
						className="object-cover"
						priority
					/>
				</div>
			</div>
		</div>
	);
}
