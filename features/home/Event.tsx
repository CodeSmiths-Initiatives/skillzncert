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

export default function Event() {
	return (
		<section className="w-full bg-gray-50 px-10 md:px-20 py-5 md:py-16">
			<div className="mb-10">
				<h1 className="text-2xl md:text-4xl font-semibold mb-6 text-center">
					EVENT
				</h1>
			</div>
			<div className="grid md:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
				<div>
					<div className="lg:hidden flex flex-col-reverse gap-6 mb-10">
						<motion.div
							custom={0.15}
							variants={imageVariant}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true }}
							className="relative w-full h-65"
						>
							<Image
								src="/static/images/Event.png"
								alt="Event illustration"
								fill
								className="object-cover rounded-3xl"
							/>
						</motion.div>
					</div>

					<div className="hidden lg:block relative w-full h-130 mb-10">
						<motion.div
							custom={0.2}
							variants={imageVariant}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true }}
							className="absolute top-5 left-10 w-110 h-110"
						>
							<Image
								src="/static/images/Event.png"
								alt="Event illustration"
								fill
								className="object-cover rounded-3xl"
							/>
						</motion.div>
					</div>
				</div>

				<div>
					<p className="text-base font-medium leading-7 text-gray-700 mb-4">
						AI-Powered Cybersecurity Career Path is more than an event—it's the
						gateway to one of the world's fastest-growing and most rewarding
						industries. Over three engaging days, participants will explore how
						Artificial Intelligence is transforming cybersecurity while gaining
						practical networking and cybersecurity foundation skills from
						experienced instructors. Whether you're a student, recent graduate,
						job seeker, or career changer, this program is designed to help you
						discover the opportunities available in today's digital economy and
						take your first confident step toward a successful technology
						career.
					</p>

					<p className="text-base font-medium leading-7 text-gray-700 mb-4">
						Through the Skillz'n'Cert Project, attendees will enjoy hands-on
						learning, career guidance, live demonstrations, networking
						opportunities, and insights into globally recognized certifications
						such as Cisco, Microsoft, CompTIA, and ISC2. With complimentary
						tea/coffee breaks, lunch, and interactive sessions each day,
						participants will leave inspired, informed, and equipped with a
						clear roadmap for building a future in AI-powered cybersecurity.
						Join us from 30th July – 1st August, 2026, and begin your journey
						toward becoming a globally competitive cybersecurity professional.
					</p>

					<Button className="bg-[#51A8B1] text-white border px-6 py-5 text-base font-semibold hover:bg-teal-600 hover:text-white">
						<a
							href="https://forms.gle/Yd1Wrg1JSKuHbwGG7"
							target="_blank"
							rel="noopener noreferrer"
						>
							Register Now
						</a>
					</Button>
				</div>
			</div>
		</section>
	);
}
