"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ApplicationLanding() {
	const router = useRouter();

	const userName = "Oluwabukola";

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
			<motion.div
				initial={{ opacity: 0, y: 40 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
				className="w-full max-w-md rounded-lg bg-white shadow-md p-8 text-center"
			>
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.2, duration: 0.4 }}
					className="mb-6"
				>
					<Image
						src="/images/logo 1.svg"
						alt="Logo"
						width={60}
						height={20}
						className="mx-auto"
					/>
				</motion.div>

				<motion.h1
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.4 }}
					className="text-2xl font-bold text-gray-900 mb-2"
				>
					Welcome, {userName}
				</motion.h1>

				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.45, duration: 0.4 }}
					className="text-sm text-gray-600 mb-8"
				>
					You are one step closer to starting your application
				</motion.p>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6, duration: 0.4 }}
				>
					<Button
						onClick={() => router.push("/onboarding")}
						className="w-full bg-[#51A8B1] text-white py-6 text-base font-semibold
						hover:bg-teal-600 transition
						focus-visible:ring-4 focus-visible:ring-[#51A8B1]/40"
					>
						Apply Now
					</Button>
				</motion.div>
			</motion.div>
		</div>
	);
}
