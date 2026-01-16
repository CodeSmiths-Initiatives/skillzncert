"use client";

import React from "react";
import { motion } from "framer-motion";

const containerVariants = {
	hidden: {},
	show: {
		transition: {
			staggerChildren: 0.15,
		},
	},
};

const cardVariants = {
	hidden: { opacity: 0, y: 40 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.6,
			ease: "easeOut" as const,
		},
	},
};

export default function PaymentPlan() {
	return (
		<section className="w-full bg-gray-50 md:py-16 py-5 px-10 md:px-20">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-3xl md:text-4xl font-semibold text-center mb-6">
					PAYMENT PLAN
				</h1>

				<p className="text-base md:text-xl font-medium text-gray-700 text-center max-w-3xl mx-auto mb-16 leading-7">
					The training fee for the CCNA and CyberOps programs is ₦1,000,000.00.
					Skillz’n’Cert students are required to make payment based on the plan
					selected below.
				</p>

				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="show"
					viewport={{ once: true, amount: 0.3 }}
					className="grid grid-cols-1 md:grid-cols-3 gap-8"
				>
					{[
						{
							bg: "bg-[#efbf00]",
							price: "₦500,000.00",
							content: (
								<>
									<p>50% on Discount Training Fee.</p>
									<p>
										Starter Package (T-shirt, Bluetooth Headphones, Pen and
										Jotter)
									</p>
									<p>15 validity on the 58% discount exam voucher.</p>
									<p>1 year after training support.</p>
									<p>Exit package</p>
								</>
							),
						},
						{
							bg: "bg-gray-300",
							price: "₦550,000.00",
							content: (
								<>
									<p>45% on Discount Training Fee.</p>
									<p>15 validity on the 58% discount exam voucher.</p>
									<p>1 year after training support.</p>
									<p>Exit package</p>
								</>
							),
						},
						{
							bg: "bg-[#cc8845]",
							price: "₦600,000.00",
							content: (
								<>
									<p>40% on Discount Training Fee.</p>
									<p>15 validity on the 58% discount exam voucher.</p>
									<p>1 year after training support.</p>
									<p>Exit package</p>
								</>
							),
						},
					].map((card, index) => (
						<motion.div
							key={index}
							variants={cardVariants}
							tabIndex={0}
							whileHover={{ y: -6 }}
							whileFocus={{ y: -6 }}
							className={`${card.bg} rounded-3xl px-6 py-8 flex flex-col 
							transition-shadow duration-300
							hover:shadow-xl focus-visible:shadow-xl
							focus-visible:outline-none focus-visible:ring-4
							focus-visible:ring-black/20`}
						>
							<div className="text-center mb-6">
								<h2 className="text-3xl font-semibold text-white mb-2">
									Gold Plan
								</h2>
								<p className="text-xl font-bold text-black">{card.price}</p>
							</div>

							<div className="text-sm font-medium text-black leading-6 space-y-3 flex-1">
								{card.content}
							</div>

							<p className="text-center text-sm font-semibold mt-10">
								T&amp;C Applies
							</p>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	);
}
