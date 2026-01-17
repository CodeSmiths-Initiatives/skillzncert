"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";

export default function VerifyOtp() {
	const router = useRouter();

	const [otp, setOtp] = useState<string>("");
	const [error, setError] = useState<string>("");

	const [timeLeft, setTimeLeft] = useState<number>(60);
	const [canResend, setCanResend] = useState<boolean>(false);

	useEffect(() => {
		if (timeLeft === 0) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setCanResend(true);
			return;
		}

		const timer = setInterval(() => {
			setTimeLeft((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(timer);
	}, [timeLeft]);

	const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
		const value = e.target.value.replace(/\D/g, "");
		setOtp(value);
		setError("");
	};

	const validateOtp = (): boolean => {
		if (!otp) {
			setError("OTP is required");
			return false;
		}
		if (otp.length !== 6) {
			setError("OTP must be exactly 6 digits");
			return false;
		}
		return true;
	};

	const handleVerify = (e: FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		if (!validateOtp()) return;

		console.log("Entered OTP:", otp);
		router.push("/forgetPassword/resetPassword");
	};

	const handleResendOtp = (): void => {
		console.log("OTP resent");

		setTimeLeft(60);
		setCanResend(false);
		setOtp("");
		setError("");
	};

	return (
		<div className="w-full max-w-3xl mx-auto my-20">
			<div className="rounded-md shadow-md p-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-[#51A8B1]">Logo</h1>
					<h2 className="text-xl font-bold">Verify OTP</h2>
				</div>

				<form onSubmit={handleVerify} className="space-y-4 mt-6">
					<div className="flex flex-col space-y-2">
						<label>OTP</label>
						<Input
							type="text"
							placeholder="Enter OTP"
							maxLength={6}
							value={otp}
							onChange={handleChange}
						/>
						{error && <p className="error-message">{error}</p>}
					</div>

					<Button type="submit" className="login-button w-full">
						Verify OTP
					</Button>
				</form>

				{/* Resend Section */}
				<div className="text-center mt-4">
					{canResend ? (
						<button
							onClick={handleResendOtp}
							className="text-teal-500 font-semibold"
						>
							Resend OTP
						</button>
					) : (
						<p className="text-gray-500 text-sm">Resend OTP in {timeLeft}s</p>
					)}
				</div>
			</div>
		</div>
	);
}
