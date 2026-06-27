"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	ONLINE_PAYMENT_PLANS,
	SIWES_PAYMENT_PLANS,
	POST_SECONDARY_PAYMENT_PLANS,
} from "@/lib/payment-plans";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const containerVariants = {
	hidden: {},
	show: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
	hidden: { opacity: 0, y: 40 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: "easeOut" as const },
	},
};

const TABS = [
	{ label: "Online Class Payment Plan", plans: ONLINE_PAYMENT_PLANS },
	{ label: "IT & SIWES Payment Plan", plans: SIWES_PAYMENT_PLANS },
	{
		label: "Post Secondary",
		plans: POST_SECONDARY_PAYMENT_PLANS,
	},
];

export default function PaymentPlan() {
	const [activeTab, setActiveTab] = useState(0);
	const activePlans = Object.values(TABS[activeTab].plans);

	return (
		<section className="w-full bg-gradient-to-b from-blue-50 to-gray-100 md:py-16 py-8 px-6 md:px-20">
			<div className="max-w-5xl mx-auto">
				{/* Tabs */}
				<div className="flex gap-2 mb-10 flex-wrap justify-center">
					{TABS.map((tab, i) => (
						<button
							key={tab.label}
							onClick={() => setActiveTab(i)}
							className={`px-5 py-2 rounded-md text-sm font-medium border transition-colors duration-200
                ${
									activeTab === i
										? "bg-[#51A8B1] text-white border-teal-500"
										: "bg-white text-gray-700 border-gray-300 hover:border-[#51A8B1]"
								}`}
						>
							{tab.label}
						</button>
					))}
				</div>

				{/* Title */}
				<h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
					Our Professional Certification Plans
				</h2>

				{/* Cards */}
				<AnimatePresence mode="wait">
					<motion.div
						key={activeTab}
						variants={containerVariants}
						initial="hidden"
						animate="show"
						className="grid grid-cols-1 md:grid-cols-3 gap-6"
					>
						{activePlans.map((plan) => (
							<motion.div
								key={plan.id}
								variants={cardVariants}
								whileHover={{ y: -6 }}
								className="rounded-2xl overflow-hidden shadow-md flex flex-col"
							>
								{/* Header */}
								<div
									className={`${plan.headerBg} px-6 py-5`}
									style={{
										backgroundImage:
											"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E\")",
										backgroundBlendMode: "overlay",
									}}
								>
									<h3 className="text-xl font-bold text-white text-center tracking-wide">
										{plan.name}
									</h3>
								</div>

								{/* Body */}
								<div
									className={`${plan.cardBg} px-6 py-6 flex flex-col flex-1 gap-4`}
								>
									<p className="text-lg font-bold text-amber-600 text-center">
										{plan.price}
									</p>

									<ul className="flex-1 space-y-2">
										{plan.features.map((feature) => (
											<li
												key={feature}
												className="flex items-start gap-2 text-sm text-gray-800"
											>
												<span className="mt-0.5 text-gray-500 shrink-0">✦</span>
												{feature}
											</li>
										))}
									</ul>

									<div className="flex justify-center mt-2">
										<Button
											asChild
											className="bg-[#3a2e1e] hover:bg-[#2a1e0e] text-white text-sm px-8 rounded-md"
										>
											<Link href="/register">Register Now</Link>
										</Button>
									</div>
								</div>
							</motion.div>
						))}
					</motion.div>
				</AnimatePresence>
			</div>
		</section>
	);
}
