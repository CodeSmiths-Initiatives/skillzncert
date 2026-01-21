"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import React from "react";

const imageVariant: Variants = {
	hidden: { opacity: 0, x: -40 },
	visible: (delay = 0) => ({
		opacity: 1,
		x: 0,
		transition: {
			duration: 0.7,
			ease: "easeOut",
			delay,
		},
	}),
};

export default function ProblemStatement() {
	return (
		<section className="w-full bg-gray-50 px-10 md:px-20 py-5 md:py-16">
			<div className="grid md:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
				<div>
					<h1 className="text-3xl md:text-4xl font-semibold mb-6">
						Problem Statement
					</h1>

					<div className="md:hidden flex flex-col-reverse gap-6 mb-10">
						<motion.div
							custom={0}
							variants={imageVariant}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true }}
							className="relative w-full h-65"
						>
							<Image
								src="static/images/aboutUs1.svg"
								alt="Cybersecurity training"
								fill
								className="object-cover rounded-3xl"
								priority
							/>
						</motion.div>

						<motion.div
							custom={0.15}
							variants={imageVariant}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true }}
							className="relative w-full h-65"
						>
							<Image
								src="static/images/aboutUs.svg"
								alt="Learning environment"
								fill
								className="object-cover rounded-3xl"
							/>
						</motion.div>
					</div>

					<div className="hidden md:block relative w-full h-130 mb-10">
						<motion.div
							custom={0}
							variants={imageVariant}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true }}
							className="absolute top-0 left-0 w-70 h-110"
						>
							<Image
								src="static/images/aboutUs1.svg"
								alt="Industry challenge"
								fill
								className="object-cover rounded-3xl"
								priority
							/>
						</motion.div>

						<motion.div
							custom={0.2}
							variants={imageVariant}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true }}
							className="absolute top-20 left-30 w-70 h-110"
						>
							<Image
								src="static/images/aboutUs.svg"
								alt="Skills gap illustration"
								fill
								className="object-cover rounded-3xl"
							/>
						</motion.div>
					</div>
				</div>

				<div>
					<p className="text-base font-medium leading-7 text-gray-700 mb-6 max-w-xl">
						There is a significant skills gap in this industry because
						technology evolves quickly, threats advance rapidly, and the supply
						of qualified talent cannot keep up. Unfortunately, many training
						institutions fail to properly address these challenges—not only due
						to limited technical expertise, but also because the field contains
						numerous domains and specialization paths.
					</p>

					<ul className="list-disc list-inside space-y-2 text-base font-medium leading-7 text-gray-700 max-w-xl mb-8">
						<li>Shortage of Skilled Professionals</li>
						<li>Rapid Technology Evolution vs. Slow Skill Development</li>
						<li>Limited Practical, Real-World Training</li>
						<li>Certification Gap</li>
						<li>Rising Cybersecurity Threats</li>
						<li>
							Lack of Specialized Talent Skills Mismatch With Industry Needs
						</li>
						<li>High Demand From Digital Transformation</li>
						<li>Awareness Gap Among New Entrants</li>
						<li>High cost of data for online instructor-led classes</li>
					</ul>

					<Button className="bg-[#51A8B1] text-white border px-6 py-5 text-base font-semibold hover:bg-teal-600 hover:text-white">
						<a href="/register">Register Now</a>
					</Button>
				</div>
			</div>
		</section>
	);
}
