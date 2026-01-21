"use client";

import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import Image from "next/image";

const imageVariant: Variants = {
	hidden: { opacity: 0, y: 40 },
	visible: (delay = 0) => ({
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.7,
			ease: "easeOut",
			delay,
		},
	}),
};

export default function AboutUs() {
	return (
		<section className="w-full bg-gray-50 px-10 md:px-20 py-5 md:py-16">
			<div className="grid md:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
				<div>
					<h1 className="text-3xl md:text-4xl font-semibold mb-6">
						ARE YOU READY TO BECOME AN EXPERT?
					</h1>

					<p className="text-base font-medium leading-7 text-gray-700 mb-4">
						Skillz’n’Cert, a Sec-Concepts Networks project, through its Cisco
						Networking Academy status, partners with private and public
						institutions to help bridge the Networking and Cybersecurity skills
						and certification gap for Undergraduate Students.
					</p>

					<p className="text-base font-medium leading-7 text-gray-700 mb-4">
						Founded in 2020, we have rapidly grown to become a trusted name in
						the industry. Our commitment to excellence and customer satisfaction
						drives everything we do. There’s no doubt about the vast potential
						of the Networking and Cybersecurity field.
					</p>

					<p className="text-base font-medium leading-7 text-gray-700 mb-6">
						Industry professionals have long shaped the evolution of this field,
						prompting constant innovation and the introduction of new
						technologies. Staying relevant requires aligning your training with
						globally recognized vendor certifications.
					</p>

					<Button className="bg-[#51A8B1] text-white border px-6 py-5 text-base font-semibold hover:bg-teal-600 hover:text-white">
						<a href="/register">Register Now</a>
					</Button>
				</div>

				<div className="relative w-full">
					<div className="md:hidden flex flex-col gap-6">
						<motion.div
							custom={0}
							variants={imageVariant}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true }}
							className="relative w-full h-65"
						>
							<Image
								src="static/images/aboutUs.svg"
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
								src="static/images/aboutUs1.svg"
								alt="Learning environment"
								fill
								className="object-cover rounded-3xl"
							/>
						</motion.div>
					</div>

					<div className="hidden md:block relative h-135">
						<motion.div
							custom={0}
							variants={imageVariant}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true }}
							className="absolute top-0 right-30 w-70 h-110"
						>
							<Image
								src="static/images/aboutUs.svg"
								alt="Cybersecurity training"
								fill
								className="object-cover rounded-3xl"
							/>
						</motion.div>

						<motion.div
							custom={0.2}
							variants={imageVariant}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true }}
							className="absolute top-20 right-0 w-70 h-110"
						>
							<Image
								src="static/images/aboutUs1.svg"
								alt="Learning environment"
								fill
								className="object-cover rounded-3xl"
							/>
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	);
}
