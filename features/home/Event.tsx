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
					FREE LINUX ADMINISTRATION TRAINING
				</h1>
			</div>
			<div className="grid md:grid-cols-2 gap-12 items-start max-w-7xl mx-auto">
				<div>
					<div className="lg:hidden mb-10">
						<motion.div
							custom={0.15}
							variants={imageVariant}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true }}
							className="relative w-full aspect-square max-w-sm mx-auto"
						>
							<Image
								src="/static/images/Event.png"
								alt="Event illustration"
								fill
								className="object-contain rounded-3xl"
							/>
						</motion.div>
					</div>

					<div className="hidden lg:flex justify-center items-start mb-10">
						<motion.div
							custom={0.2}
							variants={imageVariant}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true }}
							className="relative w-full max-w-md aspect-square"
						>
							<Image
								src="/static/images/Linux.jpeg"
								alt="Linux Administration Training"
								fill
								className="object-contain rounded-3xl shadow-lg"
							/>
						</motion.div>
					</div>
				</div>

				<div>
					<p className="text-base font-medium leading-7 text-gray-700 mb-4">
						Master. Manage. Secure. Ready to build practical, career-ready Linux
						skills? Join Skillz’n’Cert for a FREE Online Instructor-Led
						Practical Class designed to help you confidently install, configure,
						manage, troubleshoot, and secure Linux systems in modern IT
						environments. What You Will Learn
					</p>

					<p className="text-base font-bold leading-2 text-gray-700 mb-4">
						What You Will Learn
					</p>

					<ul className="list-disc list-inside space-y-2 text-base font-medium leading-7 text-gray-700 max-w-xl mb-8">
						<li>Linux Installation & Initial Configuration</li>
						<li>⁠User & Group Management</li>
						<li>⁠File Systems & Permissions</li>
						<li>⁠Service & Process Management</li>
						<li>⁠Network Configuration & Firewall</li>
						<li>⁠Backup, Recovery & System Monitoring</li>
						<li>⁠Security Hardening & Best Practices</li>
					</ul>

					<p className="text-base font-bold leading-2 text-gray-700 mb-4">
						Who Should Attend?
					</p>
					<p className="text-base font-medium leading-7 text-gray-700 mb-4">
						This training is ideal for aspiring Linux Administrators,
						System/Network Administrators, IT Support Professionals, Developers,
						DevOps Engineers, Students, and Tech Enthusiasts looking to
						strengthen their practical Linux skills.
					</p>

					<p className="text-base font-bold leading-2 text-gray-700 mb-4">
						Why join?
					</p>

					<ul className="list-disc list-inside space-y-2 text-base font-medium leading-7 text-gray-700 max-w-xl mb-8">
						<li>Hands-on practical labs</li>
						<li>Industry-relevant skills</li>
						<li> Instructor-led online learning</li>
						<li>Career development opportunities</li>
						<li> Certificate of completion</li>
					</ul>

					<Button className="bg-[#51A8B1] text-white border px-6 py-5 text-base font-semibold hover:bg-teal-600 hover:text-white">
						<a
							href="https://forms.gle/jZXHPdUgi76bYa8b6"
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
