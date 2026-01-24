"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Steps } from "@/components/ui/step";

/* ---------- Types ---------- */

type EnrollmentStatus = {
  exists: boolean;
  isPaymentDone: boolean;
};

type Props = {
  userName: string;
  enrollmentStatus: EnrollmentStatus;
};

/* ---------- Component ---------- */

export default function ApplicationLanding({
  userName,
  enrollmentStatus,
}: Props) {
  const router = useRouter();

  /* ------------------------------------------------
   * 🔑 DERIVED BUSINESS FLAGS (single source of truth)
   * ------------------------------------------------ */
  const hasEnrollment = enrollmentStatus.exists;
  const paymentDone = enrollmentStatus.isPaymentDone;

  const showOnboarding = !hasEnrollment;
  const showPayment = hasEnrollment && !paymentDone;
  const showDashboard = hasEnrollment && paymentDone;

  /* ------------------------------------------------
   * 🪜 STEP STATUS MAPPING (future-proof)
   * ------------------------------------------------ */
  const stepStatus = {
    step1: hasEnrollment ? "done" : "pending",
    step2: hasEnrollment ? "done" : "pending",
    step3: hasEnrollment ? "done" : "pending",
    step4: showPayment
      ? "pending"
      : showDashboard
      ? "done"
      : "pending",
  } as const;

  /* ------------------------------------------------
   * 🎯 CTA CONFIG (no conditional JSX later)
   * ------------------------------------------------ */
  const cta = {
    label: showPayment
      ? "Proceed to Payment"
      : showDashboard
      ? "Go to Dashboard"
      : "Start Application",
    path: showPayment
      ? "/payment"
      : showDashboard
      ? "/dashboard"
      : "/onboarding",
  };

  /* ------------------------------------------------
   * 🖼️ UI
   * ------------------------------------------------ */
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#0b3c42] via-[#1b6b73] to-[#51A8B1]">
      {/* Decorative blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-10 md:p-14"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <Image
              src="/static/images/logo1.svg"
              alt="Logo"
              width={70}
              height={24}
              className="mx-auto mb-4"
              priority
              unoptimized
            />

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Welcome, <span className="text-[#51A8B1]">{userName}</span>
            </h1>

            <p className="mt-3 text-gray-600 max-w-xl mx-auto">
              Review your application progress and continue where you left off.
            </p>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Left */}
            <div className="space-y-4 text-sm text-gray-700">
              <p className="flex items-center gap-2">
                <span className="text-[#51A8B1] font-bold">✔</span>
                Secure and confidential application
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#51A8B1] font-bold">✔</span>
                Reviewed by certified professionals
              </p>
              <p className="flex items-center gap-2">
                <span className="text-[#51A8B1] font-bold">✔</span>
                Limited seats available
              </p>

              <div className="mt-6 rounded-xl bg-[#f0fbfc] p-4 text-gray-700">
                ⏱ Estimated completion time: <strong>5–7 minutes</strong>
              </div>
            </div>

            {/* Right: Steps */}
            <div className="rounded-2xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Application Steps
              </h3>

              <ul className="space-y-3 text-sm">
                <Steps
                  label="Personal Information"
                  step="Step 1"
                  status={stepStatus.step1}
                />
                <Steps
                  label="Education Details"
                  step="Step 2"
                  status={stepStatus.step2}
                />
                <Steps
                  label="Document Upload"
                  step="Step 3"
                  status={stepStatus.step3}
                />
                <Steps
                  label="Payment & Review"
                  step="Final"
                  status={stepStatus.step4}
                />
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 text-center">
            <Button
              onClick={() => router.replace(cta.path)}
              className="bg-[#51A8B1] text-white px-12 py-6 text-base font-semibold hover:bg-teal-600 transition"
            >
              {cta.label}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
