"use client";

import { AuthLayout } from "@/components/layout/AuthLayout";
import { FormField } from "@/components/form/FormField";
import { useToast } from "@/components/toast/ToastContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { forgotPasswordAction } from "@/actions/auth/forgot-password.actions";

export default function ForgotPassword() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [touched, setTouched] = useState(false);

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setError("Email address is required");
      return false;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }

    setError(undefined);
    return true;
  };

  /* ---------------- SUBMIT ---------------- */
  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      showToast({
        type: "error",
        title: "Invalid email",
        description: "Please enter a valid registered email address.",
      });
      return;
    }

    startTransition(async () => {
      const result = await forgotPasswordAction(email);

      if (!result.success) {
        showToast({
          type: "error",
          title: "Request failed",
          description: result.message,
        });
        return;
      }

      showToast({
        type: "success",
        title: "Check your email",
        description: "If an account exists, a reset link has been sent.",
      });

      // Optional redirect
      router.push("/forgetPassword/otp");
    });
  };

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
        <h1 className="text-2xl font-bold text-black">Forgot Password</h1>
        <p className="text-sm text-gray-600">
          Enter your registered email to receive an OTP
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={submit} className="space-y-4">
        <FormField label="Email Address" error={touched ? error : undefined}>
          <Input
            type="email"
            placeholder="mail@website.com"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
          />
        </FormField>

        <Button disabled={isPending} className="w-full">
          {isPending ? "Sending OTP..." : "Send OTP"}
        </Button>
      </form>

      {/* FOOTER */}
      <p className="text-center text-sm mt-4">
        Remember your password?{" "}
        <Link href="/login" className="text-teal-500 font-medium">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}
