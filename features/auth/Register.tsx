"use client";

import { signupAction } from "@/actions/auth/signup.actions";
import { FormField } from "@/components/form/FormField";
import { PasswordInput } from "@/components/form/PasswordInput";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { useToast } from "@/components/toast/ToastContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function Register() {
	const router = useRouter();
	const { showToast } = useToast();	

	const [isPending, startTransition] = useTransition();

	const [form, setForm] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
		agree: false,
	});

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [touched, setTouched] = useState<Record<string, boolean>>({});

	const validate = () => {
		const e: Record<string, string> = {};
		const usernameRegex = /^(?!_)(?!.*__)[A-Za-z0-9_]{3,15}(?<!_)$/;
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const passwordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_]).{8,15}$/;

		if (!usernameRegex.test(form.username))
			e.username = "3–15 chars, letters/numbers/_ only";

		if (!emailRegex.test(form.email)) e.email = "Enter a valid email address";

		if (!passwordRegex.test(form.password))
			e.password = "Upper, lower, number & special char required";

		if (form.password !== form.confirmPassword)
			e.confirmPassword = "Passwords do not match";

		if (!form.agree) e.agree = "You must accept the terms";

		setErrors(e);
		return Object.keys(e).length === 0;
	};

	const submit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!validate()) {
			showToast({
				type: "error",
				title: "Invalid form",
				description: "Please fix the highlighted fields.",
			});
			return;
		}

		startTransition(async () => {
			const result = await signupAction({
				username: form.username,
				email: form.email,
				password: form.password,
				agree: form.agree,
			});

			if (!result.success) {
				showToast({
					type: "error",
					title: "Signup failed",
					description: result.message,
				});
				return;
			}

			showToast({
				type: "success",
				title: "Account created",
				description: "You can now log in.",
			});

			router.push("/login");
		});
	};

	const bind = (name: string) => ({
		value: (form as any)[name],
		onChange: (e: any) => setForm({ ...form, [name]: e.target?.value ?? e }),
		onBlur: () => setTouched({ ...touched, [name]: true }),
	});

	return (
		<AuthLayout imageSrc="/static/images/auth_image.png">
			<div className="text-center mb-6">
				<Image
					src="/static/images/logo1.svg"
					alt="Logo"
					width={50}
					height={20}
					className="mx-auto mb-2"
					unoptimized
				/>
				<h1 className="text-3xl font-bold text-black">Welcome</h1>
				<p className="text-xs font-semibold text-gray-600">
					Empowering Students in Network & Cybersecurity
				</p>
			</div>

			<form onSubmit={submit} className="space-y-4">
				<FormField
					label="Username"
					error={touched.username ? errors.username : undefined}
				>
					<Input {...bind("username")} />
				</FormField>

				<FormField
					label="Email"
					error={touched.email ? errors.email : undefined}
				>
					<Input type="email" {...bind("email")} />
				</FormField>

				<FormField
					label="Password"
					error={touched.password ? errors.password : undefined}
				>
					<PasswordInput
						{...bind("password")}
						placeholder="Enter your password"
					/>
				</FormField>

				<FormField
					label="Confirm Password"
					error={touched.confirmPassword ? errors.confirmPassword : undefined}
				>
					<PasswordInput
						{...bind("confirmPassword")}
						placeholder="Confirm your password"
					/>
				</FormField>

				<div className="flex items-center gap-2">
					<Checkbox
						checked={form.agree}
						onCheckedChange={(v) => setForm({ ...form, agree: !!v })}
					/>
					<span className="text-sm">
						I agree to the{" "}
						<a href="#" className="text-teal-500 font-medium">
							Terms of Service
						</a>
					</span>
				</div>

				{errors.agree && (
					<p className="text-xs text-red-600">⚠ {errors.agree}</p>
				)}

				<Button disabled={isPending} className="w-full">
					{isPending ? "Creating account..." : "Sign up"}
				</Button>
			</form>

			<p className="text-center text-sm mt-4">
				Already have an account?{" "}
				<Link href="/login" className="text-teal-500 font-medium">
					Login here
				</Link>
			</p>
		</AuthLayout>
	);
}
