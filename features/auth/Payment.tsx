"use client";

import { useState } from "react";
import Link from "next/link";
import { GoDotFill } from "react-icons/go";
import { motion } from "framer-motion";
import { usePaystackPayment } from "react-paystack";
import { PAYMENT_PLANS } from "@/lib/payment-plans";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast/ToastContext";

type Plan = {
  id: string;
  name: string;
  amount: number;
  currency: string;
  description: string;
  features: string[];
  discount?: number;
  price?: string;
  bg?: string;
};

type Props = {
  userEmail: string;
};

export default function PaymentPage({ userEmail }: Props) {
  const [selectedPlan, setSelectedPlan] = useState<Plan>(PAYMENT_PLANS.gold);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Generate payment reference in format: TRAN20251901FF551
  const generatePaymentReference = () => {
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");

    // Generate 5 random alphanumeric characters
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomChars = "";
    for (let i = 0; i < 5; i++) {
      randomChars += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return `TRAN${year}${day}${month}${randomChars}`;
  };

  // Paystack configuration
  const config = {
    reference: generatePaymentReference(),
    email: userEmail,
    amount: selectedPlan.amount, // Amount in kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    currency: "NGN",
    subaccount : "ACCT_xtlrfkipcz3pp2p",
    channels: ["card"],
  };

  // Paystack payment hook
  const initializePayment = usePaystackPayment(config);

  const handlePayment = () => {
    setIsLoading(true);
    console.log("🔄 Initializing Paystack payment for plan:", selectedPlan.id);

    initializePayment({
      onSuccess: (reference) => {
        // showToast({
        //   type: "success",
        //   title: "Payment Successful",
        //   description: "Your payment has been processed successfully.",
        // });
        console.log("✅ Payment successful:", reference);
        setIsLoading(false);
        // Redirect to success page with reference and plan details
        const params = new URLSearchParams({
          reference: reference.reference,
          planId: selectedPlan.id,
          planName: selectedPlan.name,
          amount: selectedPlan.amount.toString(),
          currency: selectedPlan.currency,
          planDiscount: selectedPlan.discount?.toString() || "0",
        });
        router.replace(`/payment/verify?${params.toString()}`);
      },
      onClose: () => {
        console.log("❌ Payment cancelled by user");
        setIsLoading(false);
        // Redirect to success page with failed status
        router.push(`/payment/verify?status=failed`);
      },
    });
  };

  const formatAmount = (amountInKobo: number) => {
    return `₦${(amountInKobo / 100).toLocaleString()}`;
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-[#0b3c42] via-[#1b6b73] to-[#51A8B1] px-4 sm:px-6">
      {/* Ambient background blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[420px] h-[420px] bg-white/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -right-40 w-[420px] h-[420px] bg-white/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 max-w-7xl mx-auto py-16 flex flex-col gap-14"
      >
        {/* Header */}
        <div className="text-center text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Choose Your Plan
          </h1>
          <p className="text-white/80 mt-3 max-w-xl mx-auto text-sm sm:text-base">
            Secure checkout with Paystack · Cancel anytime · No hidden fees
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Object.values(PAYMENT_PLANS).map((plan) => {
            const isActive = selectedPlan.id === plan.id;

            return (
              <motion.div
                key={plan.id}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 200 }}
                onClick={() => setSelectedPlan(plan)}
                className={`relative rounded-3xl p-6 cursor-pointer transition
                  ${
                    isActive
                      ? "bg-white ring-4 ring-[#51A8B1]/40 shadow-2xl"
                      : plan.bg ? `${plan.bg} hover:opacity-90 shadow-lg` : "bg-[#f4fbfd]/90 hover:bg-white shadow-lg"
                  }
                `}
              >
                <h2 className="text-lg font-semibold text-gray-900">
                  {plan.name}
                </h2>

                <p className="text-sm text-gray-600 mt-1 mb-4">
                  {plan.description}
                </p>

                <div className="py-4">
                  <span className="text-3xl font-bold text-[#0b3c42]">
                    {formatAmount(plan.amount)}
                  </span>
                </div>

                <ul className="space-y-2 text-sm text-gray-600">
                  {plan.features.map((feature: string) => (
                    <li key={feature} className="flex items-center gap-2">
                      <GoDotFill className="text-[#51A8B1]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Error Message */}
        {/* Removed - react-paystack handles errors internally */}

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="
            max-w-3xl mx-auto w-full
            bg-gradient-to-br from-white/95 to-[#f4fbfd]
            backdrop-blur
            rounded-3xl
            shadow-2xl
            border border-white/60
            px-6 sm:px-8 py-7
          "
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Selected Plan
              </p>
              <p className="text-lg font-semibold text-gray-900 mt-1">
                {selectedPlan.name}
                <span className="ml-2 text-[#51A8B1] font-bold">
                  {formatAmount(selectedPlan.amount)}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Secure checkout with Paystack
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6" />

          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <Link
              href="/dashboard"
              className="text-gray-500 hover:text-gray-700 px-6 py-3 rounded-xl transition text-center"
            >
              Cancel
            </Link>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={handlePayment}
              disabled={isLoading}
              className="
                inline-flex items-center justify-center
                bg-[#51A8B1] hover:bg-teal-600 disabled:bg-gray-400
                text-white
                px-10 py-3
                rounded-xl
                font-semibold
                shadow-lg shadow-[#51A8B1]/30
                transition
                focus-visible:ring-4 focus-visible:ring-[#51A8B1]/40
                disabled:cursor-not-allowed
              "
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Opening Payment...
                </div>
              ) : (
                "Pay with Card"
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
