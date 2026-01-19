"use client";

import { useState } from "react";
import Link from "next/link";
import { GoDotFill } from "react-icons/go";
import { motion } from "framer-motion";

type Plan = {
  id: string;
  title: string;
  price: string;
  duration: string;
  features: string[];
  popular?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "monthly",
    title: "Monthly",
    price: "$9.99",
    duration: "/month",
    features: ["All features", "Basic support", "1 team member"],
  },
  {
    id: "quarterly",
    title: "Quarterly",
    price: "$79",
    duration: "/3 months",
    popular: true,
    features: [
      "All features",
      "Priority support",
      "3 team members",
      "Advanced analytics",
    ],
  },
  {
    id: "yearly",
    title: "Yearly",
    price: "$299",
    duration: "/year",
    features: ["All features", "24/7 support", "Unlimited team", "API access"],
  },
];

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState(PLANS[1]);

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
            Secure checkout · Cancel anytime · No hidden fees
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PLANS.map((plan) => {
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
                      : "bg-[#f4fbfd]/90 hover:bg-white shadow-lg"
                  }
                `}
              >
                {plan.popular && (
                  <span className="absolute top-4 right-4 bg-[#51A8B1] text-white text-xs px-3 py-1 rounded-full">
                    Popular
                  </span>
                )}

                <h2 className="text-lg font-semibold text-gray-900">
                  {plan.title}
                </h2>

                <div className="py-4">
                  <span className="text-3xl font-bold text-[#0b3c42]">
                    {plan.price}
                  </span>
                  <span className="text-gray-400 text-sm">{plan.duration}</span>
                </div>

                <ul className="space-y-2 text-sm text-gray-600">
                  {plan.features.map((feature) => (
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
                {selectedPlan.title}
                <span className="ml-2 text-[#51A8B1] font-bold">
                  {selectedPlan.price}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Secure checkout
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6" />

          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <Link
              href="/payment"
              className="text-gray-500 hover:text-gray-700 px-6 py-3 rounded-xl transition text-center"
            >
              Cancel
            </Link>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/transactionSummary"
                className="
                  inline-flex items-center justify-center
                  bg-[#51A8B1] hover:bg-teal-600
                  text-white
                  px-10 py-3
                  rounded-xl
                  font-semibold
                  shadow-lg shadow-[#51A8B1]/30
                  transition
                  focus-visible:ring-4 focus-visible:ring-[#51A8B1]/40
                "
              >
                Continue to Payment
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
