"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Fullscreen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type FormErrors = {
	userName?: string;
	email?: string;
	password?: string;
	confirmPassword?: string;
	agree?: string;
};

export default function Register() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		userName: "",
		email: "",
		password: "",
		confirmPassword: "",
		agree: false,
	});
	const [errors, setErrors] = useState<FormErrors>({});
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const validate = (): boolean => {
		const errors: FormErrors = {};

		const usernameRegex = /^[A-Za-z]{3,20}$/;
		const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,15}$/;
		// UserName
		if (!formData.userName) errors.userName = "User name is required";
		else if (!usernameRegex.test(formData.userName))
			errors.userName = "Only letters are allowed";

		// Email validation
		if (!formData.email) {
			errors.email = "Email is required";
		} else if (!emailRegex.test(formData.email)) {
			errors.email = "Email address is invalid.";
		}

		//password validation
		if (!formData.password) {
			errors.password = "Password is required";
		} else if (!passwordRegex.test(formData.password)) {
			errors.password =
				"Password must contain uppercase, lowercase, number and be 8–15 characters long";
		}
		if (formData.password !== formData.confirmPassword) {
			errors.confirmPassword = "Passwords do not match.";
		}
		if (!formData.agree) {
			errors.agree = "You must agree to the terms of service.";
		}

		setErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!validate()) {
			return;
		}

		console.log("Sign up data:", formData);

		router.push("/login");
	};

	// useEffect(() => {
	// 	const today = new Date();
	// 	const isDDay = today.getMonth() === 2 && today.getDate() === 1;

	// 	if (!isDDay) {
	// 		router.replace("/counter");
	// 	}
	// }, [router]);
	return (
		<div className="w-full max-w-3xl mx-auto my-10">
			<div className="grid md:grid-cols-2 grid-cols-1 w-full max-w-full rounded-md shadow-md">
				<div className="p-6">
					<div className="text-center pb-5">
						<Image
							src="/images/logo 1.svg"
							alt="Logo"
							width={50}
							height={10}
							className="mx-auto"
						/>
						<h1 className="text-3xl font-bold text-black">Welcome</h1>
						<h3 className="text-xs font-semibold text-gray-600 py-1">
							Empowering Students in Network & Cybersecurity
						</h3>
					</div>
					<div></div>
					<form onSubmit={handleSubmit}>
						<div className="flex flex-col space-y-2">
							<label>Username</label>
							<Input
								type="text"
								name="userName"
								value={formData.userName}
								className="input-field"
								placeholder="Enter your userName"
								onChange={handleChange}
								maxLength={10}
							/>
							{errors.userName && (
								<span className="error-message">{errors.userName}</span>
							)}
						</div>

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
							{errors.email && (
								<span className="error-message">{errors.email}</span>
							)}
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
									autoComplete="new-password"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/3  -translate-y-1/2 text-gray-500"
								>
									{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
								</button>
							</div>
							{errors.password && (
								<span className="error-message">{errors.password}</span>
							)}
						</div>
						<div className="flex flex-col space-y-2 ">
							<label>Confirm Password</label>
							<div className="relative">
								<Input
									type={showConfirmPassword ? "text" : "password"}
									name="confirmPassword"
									value={formData.confirmPassword}
									placeholder="Confirm your password"
									className="input-field"
									onChange={handleChange}
									maxLength={15}
									autoComplete="new-password"
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword((p) => !p)}
									className="absolute right-3 top-1/3 -translate-y-1/2 text-gray-500"
								>
									{showConfirmPassword ? (
										<EyeOff size={18} />
									) : (
										<Eye size={18} />
									)}
								</button>
							</div>
							{errors.confirmPassword && (
								<span className="error-message">{errors.confirmPassword}</span>
							)}
						</div>
						<div className="flex items-center space-x-2 my-4">
							<Checkbox
								onCheckedChange={(checked) =>
									setFormData((prev) => ({
										...prev,
										agree: Boolean(checked),
									}))
								}
							/>

							<p>
								I agree to the{" "}
								<a href="#" className="text-[#51A8B1]">
									Terms of Service
								</a>{" "}
								{/* for using CE-EMS */}
							</p>
							{errors.agree && (
								<span className="error-message">{errors.agree}</span>
							)}
						</div>

						<Button className="login-button">Sign up</Button>
					</form>

					<div className="text-center pt-3">
						<p>
							Already have an account?
							<Link href="/login" className="text-teal-500">
								Login Here
							</Link>
						</p>
					</div>
					<div className=" text-teal-500 flex items-center justify-center space-x-3 mt-6 ">
						<p className="border-r pr-3">Terms of use</p>
						<p>privacy policy</p>
					</div>
				</div>
				<div className="relative h-full rounded-r-md overflow-hidden">
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
