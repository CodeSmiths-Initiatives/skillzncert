"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
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

		const nameRegex = /^[A-Za-z\s]+$/;
		const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,15}$/;
		// UserName
		if (!formData.userName) errors.userName = "User name is required";
		else if (!nameRegex.test(formData.userName))
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
					<h3 className="text-xl font-semibold py-1">Welcome</h3>
				</div>

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
							<span className="text-red-500 text-sm">{errors.userName}</span>
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
							<span className="text-red-500 text-sm">{errors.email}</span>
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
							<span className="text-red-500 text-sm">{errors.password}</span>
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
								{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</div>
						{errors.confirmPassword && (
							<span className="text-red-500 text-sm">
								{errors.confirmPassword}
							</span>
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
							I have read and agree to the{" "}
							<a href="#" className="text-[#51A8B1]">
								Terms of Service
							</a>{" "}
							for using CE-EMS
						</p>
						{errors.agree && (
							<span className="text-red-500 text-sm">{errors.agree}</span>
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
		</div>
	);
}
