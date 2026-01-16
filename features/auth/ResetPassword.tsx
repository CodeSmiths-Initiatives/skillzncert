"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
	const router = useRouter();

	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");

	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showConfirmPassword, setShowConfirmPassword] =
		useState<boolean>(false);

	const [errors, setErrors] = useState<{
		password?: string;
		confirmPassword?: string;
	}>({});

	/* =======================
	   VALIDATION
	======================= */
	const validate = (): boolean => {
		const newErrors: {
			password?: string;
			confirmPassword?: string;
		} = {};

		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,15}$/;

		if (!password) {
			newErrors.password = "Password is required";
		} else if (!passwordRegex.test(password)) {
			newErrors.password =
				"Password must contain uppercase, lowercase, number and be 8–15 characters long";
		}

		if (!confirmPassword) {
			newErrors.confirmPassword = "Confirm password is required";
		} else if (password !== confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	/* =======================
	   SUBMIT
	======================= */
	const handleReset = (e: FormEvent<HTMLFormElement>): void => {
		e.preventDefault();

		if (!validate()) return;

		console.log("New Password:", password);

		router.push("/login");
	};

	/* =======================
	   JSX
	======================= */
	return (
		<div className="w-full max-w-3xl mx-auto my-20">
			<div className="rounded-md shadow-md p-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-[#51A8B1]">Logo</h1>
					<h2 className="text-xl font-bold">Reset Password</h2>
				</div>

				<form onSubmit={handleReset} className="space-y-4 mt-6">
					{/* New Password */}
					<div className="flex flex-col space-y-2">
						<label>New Password</label>
						<div className="relative">
							<Input
								type={showPassword ? "text" : "password"}
								placeholder="Enter new password"
								maxLength={15}
								value={password}
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									setPassword(e.target.value)
								}
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
							>
								{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</div>
						{errors.password && (
							<p className="error-message">{errors.password}</p>
						)}
					</div>

					{/* Confirm Password */}
					<div className="flex flex-col space-y-2">
						<label>Confirm Password</label>
						<div className="relative">
							<Input
								type={showConfirmPassword ? "text" : "password"}
								placeholder="Confirm password"
								maxLength={15}
								value={confirmPassword}
								onChange={(e: ChangeEvent<HTMLInputElement>) =>
									setConfirmPassword(e.target.value)
								}
							/>
							<button
								type="button"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
							>
								{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</div>
						{errors.confirmPassword && (
							<p className="error-message">{errors.confirmPassword}</p>
						)}
					</div>

					<Button type="submit" className="login-button w-full">
						Reset Password
					</Button>
				</form>
			</div>
		</div>
	);
}
