"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { FormField } from "@/components/form/FormField";
import { PasswordInput } from "@/components/form/PasswordInput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/toast/ToastContext";
import Image from "next/image";
import { resetPasswordAction } from "@/actions/auth/reset-password.actions";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();

  // Code from URL OR manual input
  const urlCode = searchParams.get("code") || "";

  const [form, setForm] = useState({
    code: urlCode,
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    const e: Record<string, string> = {};
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_]).{8,15}$/;

    if (!form.code) e.code = "Reset code is required";

    if (!passwordRegex.test(form.password))
      e.password =
        "Password must contain uppercase, lowercase, number & special character";

    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ---------------- SUBMIT ---------------- */
  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      showToast({
        type: "error",
        title: "Invalid input",
        description: "Please fix the highlighted fields.",
      });
      return;
    }

    startTransition(async () => {
      const result = await resetPasswordAction({
        code: form.code.trim(),
        password: form.password,
        passwordConfirmation: form.confirmPassword,
      });

      if (!result.success) {
        showToast({
          type: "error",
          title: "Reset failed",
          description: result.message,
        });
        return;
      }

      showToast({
        type: "success",
        title: "Password updated",
        description: "You can now log in with your new password.",
      });

      router.push("/login");
    });
  };

  const bind = (name: string) => ({
    value: (form as any)[name],
    onChange: (e: any) =>
      setForm({ ...form, [name]: e.target.value }),
    onBlur: () =>
      setTouched({ ...touched, [name]: true }),
  });

  return (
    <AuthLayout imageSrc="/static/images/auth_image.png">
      {/* HEADER */}
      <div className="text-center mb-6">
        <Image
          src="/static/images/logo1.svg"
          alt="Logo"
          width={50}
          height={20}
          className="mx-auto mb-2"
          unoptimized
        />
        <h1 className="text-2xl font-bold text-black">
          Reset Password
        </h1>
        <p className="text-sm text-gray-600">
          Enter the code and choose a new password
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={submit} className="space-y-4">
        <FormField
          label="Reset Code"
          error={touched.code ? errors.code : undefined}
        >
          <Input
            placeholder="Paste the code from email"
            {...bind("code")}
          />
        </FormField>

        <FormField
          label="New Password"
          error={touched.password ? errors.password : undefined}
        >
          <PasswordInput
            placeholder="New password"
            {...bind("password")}
          />
        </FormField>

        <FormField
          label="Confirm Password"
          error={
            touched.confirmPassword
              ? errors.confirmPassword
              : undefined
          }
        >
          <PasswordInput
            placeholder="Confirm new password"
            {...bind("confirmPassword")}
          />
        </FormField>

        <Button disabled={isPending} className="w-full">
          {isPending ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
    </AuthLayout>
  );
}
