"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { GoDotFill } from "react-icons/go";
import { motion } from "framer-motion";
import { PAYMENT_PLANS, type PaymentPlanConfig } from "@/lib/payment-plans";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast/ToastContext";

type Plan = PaymentPlanConfig;

type Props = {
	userEmail: string;
};

export default function PaymentPage({ userEmail }: Props) {
	const [selectedPlan, setSelectedPlan] = useState<Plan>(PAYMENT_PLANS.gold);
	const [isLoading, setIsLoading] = useState(false);
	const [initializePayment, setInitializePayment] = useState<any>(null);
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

	// Get the actual amount to charge (first installment for multi-payment plans)
	const getPaymentAmount = () => {
		return selectedPlan.installments.firstPayment;
	};

	// Paystack configuration
	const config = {
		reference: generatePaymentReference(),
		email: userEmail,
		amount: getPaymentAmount() + 200000, // Amount in kobo (first installment) + ₦2000 fee
		publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
		currency: "NGN",
		subaccount: "ACCT_xtlrfkipcz3pp2p",
		channels: ["card"],
	};

	// Dynamically load Paystack hook on client side only
	useEffect(() => {
		if (typeof window !== "undefined") {
			import("react-paystack").then((module) => {
				const paymentHook = module.usePaystackPayment(config);
				setInitializePayment(() => paymentHook);
			});
		}
	}, [getPaymentAmount(), userEmail]);

	const handlePayment = () => {
		if (!initializePayment) return;
		
		setIsLoading(true);
		console.log("🔄 Initializing Paystack payment for plan:", selectedPlan.id);

		initializePayment({
			onSuccess: (reference: any) => {
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
					amount: (getPaymentAmount() + 200000).toString(), // Pass first installment amount + ₦2000 fee
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
				className="relative z-10 max-w-7xl mx-auto py-10 flex flex-col gap-14"
			>
				{/* Header */}
				<div className="text-center text-white">
					<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
						Choose Your Plan
					</h1>
					<p className="text-white/80 mt-1 max-w-xl mx-auto text-sm sm:text-base">
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
											: plan.bg
												? `${plan.bg} hover:opacity-90 shadow-lg`
												: "bg-[#f4fbfd]/90 hover:bg-white shadow-lg"
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
										{formatAmount(plan.installments.firstPayment)}
									</span>
									{plan.installments.count > 1 && (
										<div className="mt-2">
											<span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
												Installment 1 of {plan.installments.count}
											</span>
											<p className="text-xs text-gray-500 mt-2">
												Total: {formatAmount(plan.amount)}
											</p>
										</div>
									)}
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
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
						<div>
							<p className="text-xs text-gray-500 uppercase tracking-wide">
								Selected Plan
							</p>
							<p className="text-lg font-semibold text-gray-900 mt-1">
								{selectedPlan.name}
								<span className="ml-2 text-[#51A8B1] font-bold">
									{formatAmount(getPaymentAmount())}
								</span>
							</p>
							{selectedPlan.installments.count > 1 && (
								<motion.div
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: 0.1, duration: 0.3 }}
									className="mt-2 inline-block"
								>
									<span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
										Installment 1 of {selectedPlan.installments.count}
									</span>
									<p className="text-xs text-gray-500 mt-1">
										Next: {formatAmount(selectedPlan.installments.subsequentPayment)} every {selectedPlan.installments.intervalMonths} months · Total: {formatAmount(selectedPlan.amount)}
									</p>
								</motion.div>
							)}
							{selectedPlan.duration && (
								<motion.p 
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: 0.15, duration: 0.3 }}
									className="text-sm text-gray-700 mt-2 font-bold"
								>
									Duration: <span className="text-[#51A8B1]">{selectedPlan.duration}</span>
								</motion.p>
							)}
							<motion.p 
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.2, duration: 0.3 }}
								className="text-sm text-gray-700 mt-1 font-bold"
							>
								Bank Charges: <span className="text-orange-600">{	} × % of Paystack</span>
							</motion.p>
							<motion.p 
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.3, duration: 0.3 }}
								className="text-sm text-gray-700 mt-1 font-bold"
							>
								{selectedPlan.installments.count > 1 ? 'First Payment' : 'Total'}: <span className="text-[#0b3c42] text-base"> {formatAmount(getPaymentAmount())} + {formatAmount(200000)} </span>
							</motion.p>
						</div>
						<div className="flex items-center gap-2 text-sm text-gray-500">
							<span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
							Secure checkout with Paystack
						</div>
					</div>

					<div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4" />

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
							disabled={isLoading || !initializePayment}
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
							) : !initializePayment ? (
								<div className="flex items-center gap-2">
									<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
									Loading...
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
