"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";

export default function Register() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
		agree: false,
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

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
						<label>First Name</label>
						<Input
							type="text"
							name="firstName"
							className="input-field"
							placeholder="Enter your First Name"
							onChange={handleChange}
						/>
					</div>
					<div className="flex flex-col space-y-2">
						<label>Last Name</label>
						<Input
							type="text"
							name="lastName"
							className="input-field"
							placeholder="Enter your Last Name"
							onChange={handleChange}
						/>
					</div>
					<div className="flex flex-col space-y-2">
						<label>Email</label>
						<Input
							type="text"
							name="Email"
							className="input-field"
							placeholder="Enter your Email"
							onChange={handleChange}
						/>
					</div>
					<div className="flex flex-col space-y-2 ">
						<label>Password</label>
						<Input
							type="password"
							name="password"
							placeholder="Enter your password"
							className="input-field"
							onChange={handleChange}
						/>
					</div>
					<div className="flex flex-col space-y-2 ">
						<label>Confirm Password</label>
						<Input
							type="password"
							name="confirmPassword"
							placeholder="Confirm your password"
							className="input-field"
							onChange={handleChange}
						/>
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
					</div>

					<Button className="login-button">Sign up</Button>
				</form>
				<div className="text-center my-5">
					<p>OR</p>
				</div>

				<Button className="w-full bg-gray-200 text-black text-base font-semibold border hover:bg-white py-3">
					<FcGoogle size={24} />
					<span className="ml-2">Continue with Google</span>
				</Button>

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
