"use client";

import { AuthLayout } from "@/components/layout/AuthLayout";
import { FormField } from "@/components/form/FormField";
import { PasswordInput } from "@/components/form/PasswordInput";
import { useToast } from "@/components/toast/ToastContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { loginAction } from "@/actions/auth/login.actions";

export default function Login() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    email: "nitesh@yopmail.com",
    password: "Nitesh@123",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    const e: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
      e.email = "Enter a valid email address";
    }

    if (!form.password) {
      e.password = "Password is required";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------------- SUBMIT ---------------- */
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
        
    if (!validate()) {
      showToast({
        type: "error",
        title: "Invalid credentials",
        description: "Please fix the highlighted fields.",
      });
      return;
    }

    startTransition(async () => {
      const result = await loginAction({
        email: form.email,
        password: form.password,
      });

      if (!result.success) {
        showToast({
          type: "error",
          title: "Login failed",
          description: result.message,
        });
        return;
      }

      showToast({
        type: "success",
        title: "Welcome back",
        description: "Redirecting to dashboard...",
      });

      /**
       * ✅ JWT is already stored securely in httpOnly cookie
       * ❌ Do NOT store token in state or localStorage
       */

	   //   router.push(hasAppliedBefore ? "/dashboard" : "/applicationLanding");
      router.push("/applicationLanding");
    });
  };

  /* ---------------- INPUT BINDER ---------------- */
  const bind = (name: keyof typeof form) => ({
    value: form[name],
    onChange: (e: any) => setForm({ ...form, [name]: e.target.value }),
    onBlur: () => setTouched({ ...touched, [name]: true }),
  });

  return (
    <AuthLayout imageSrc="/images/auth_image.png">
      {/* HEADER */}
      <div className="text-center mb-6">
        <Image
          src="/images/logo 1.svg"
          alt="Logo"
          width={50}
          height={20}
          className="mx-auto mb-2"
        />
        <h1 className="text-2xl font-bold text-black">Welcome back</h1>
        <p className="text-sm text-gray-600">
          See your growth and get consulting support
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={submit} className="space-y-4">
        <FormField
          label="Email Address"
          error={touched.email ? errors.email : undefined}
        >
          <Input
            type="email"
            placeholder="mail@website.com"
            autoComplete="email"
            {...bind("email")}
          />
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

        <div className="text-right">
          <Link
            href="/forgetPassword"
            className="text-sm font-medium text-teal-500"
          >
            Forgot password?
          </Link>
        </div>

        <Button disabled={isPending} className="w-full">
          {isPending ? "Logging in..." : "Login"}
        </Button>
      </form>

      {/* FOOTER */}
      <p className="text-center text-sm mt-4">
        New here?{" "}
        <Link href="/register" className="text-teal-500 font-medium">
          Create an account
        </Link>
      </p>

      <div className="text-teal-500 flex justify-center gap-4 mt-6 text-sm">
        <p className="border-r pr-3">Terms of use</p>
        <p>Privacy policy</p>
      </div>
    </AuthLayout>
  );
}
