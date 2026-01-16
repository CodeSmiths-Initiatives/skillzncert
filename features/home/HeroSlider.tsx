"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { motion, AnimatePresence, Variants } from "framer-motion";

const slides = [
	{
		id: 1,
		title:
			"Technical training is often more than a development goal – it is a business requirement.",
		description:
			"We recognize that your learning journey is unique. Access a world-class, career-driven Networking & Cybersecurity certification training within a year.",
		image: "/images/slide1img.svg",
	},
	{
		id: 2,
		title: "Globally Recognized after-Training Certificates!",
		description:
			"Industry professionals have long shaped the evolution of this field, prompting constant innovation and the introduction of new technologies to supersede outdated ones.",
		image: "/images/slide2img.svg",
	},
	{
		id: 3,
		title: "Enjoy FREE DATA While accessing your class",
		description:
			"All registered students get monthly 5GB data on all the major network provider (MTN, GLO, Airtel, and 9Mobile), for ease of class attendance.",
		image: "/images/slide3img.svg",
	},
	{
		id: 4,
		title: "Attract more than 50 Networking & Cybersecurity JOB-ROLES.",
		description:
			"This 12 Months skills-ses training attract more than 50 Networking & Cybersecurity JOB_ROLES.",
		image: "/images/slide4img.svg",
	},
];

const containerVariants: Variants = {
	hidden: { opacity: 0, y: 40 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: "easeOut" },
	},
};

const slideVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: -20 },
};

export default function HeroSlider() {
	const [current, setCurrent] = useState(0);

	const progress = ((current + 1) / slides.length) * 100;

	return (
		<section className="relative w-full overflow-hidden bg-[#F4FAFD]">
			<motion.div
				variants={containerVariants}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true }}
				className="mx-auto max-w-7xl px-6 py-20"
			>
				<div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
					<div className="space-y-6">
						<AnimatePresence mode="wait">
							<motion.div
								key={slides[current].id}
								variants={slideVariants}
								initial="hidden"
								animate="visible"
								exit="exit"
								transition={{ duration: 0.4, ease: "easeOut" }}
							>
								<h1 className="max-w-xl text-3xl font-bold leading-tight text-black md:text-4xl">
									{slides[current].title}
								</h1>

								<p className="mt-4 max-w-xl text-base leading-relaxed text-gray-700">
									{slides[current].description}
								</p>

								<button
									className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#58AEB3] px-8 py-4 text-sm font-semibold text-white transition
									hover:-translate-y-px hover:shadow-lg
									focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#58AEB3]/40"
								>
									Learn More
								</button>
							</motion.div>
						</AnimatePresence>
					</div>

					<div className="relative h-70 w-full overflow-hidden rounded-2xl md:h-90">
						<AnimatePresence mode="wait">
							<motion.div
								key={slides[current].image}
								initial={{ opacity: 0, scale: 0.96 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.98 }}
								transition={{ duration: 0.5, ease: "easeOut" }}
								className="absolute inset-0"
							>
								<Image
									src={slides[current].image}
									alt=""
									fill
									className="object-cover"
									priority
								/>
							</motion.div>
						</AnimatePresence>
					</div>
				</div>

				<div className="mt-16 flex flex-col items-center gap-6">
					<div className="flex gap-3">
						{slides.map((_, index) => (
							<button
								key={index}
								onClick={() => setCurrent(index)}
								className={clsx(
									"h-3 w-3 rounded-full transition",
									current === index
										? "bg-[#58AEB3]"
										: "bg-gray-300 hover:bg-gray-400"
								)}
								aria-label={`Go to slide ${index + 1}`}
							/>
						))}
					</div>

					<div className="relative h-2 w-64 rounded-full bg-gray-300">
						<motion.div
							className="absolute left-0 top-0 h-full rounded-full bg-[#58AEB3]"
							animate={{ width: `${progress}%` }}
							transition={{ duration: 0.5, ease: "easeOut" }}
						/>
					</div>
				</div>
			</motion.div>
		</section>
	);
}
