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

export default function Solution() {
	return (
		<section className="w-full bg-gray-50 px-10 md:px-20 md:py-16 py-5 ">
			<div className="grid md:grid-cols-2 grid-cols-1 items-center">
				<div>
					<h1 className="text-3xl md:text-4xl font-semibold mb-6">
						OUR SOLUTION
					</h1>
					<p className="text-base font-medium leading-7 text-gray-700 mb-4">
						Skillz’n’cert, a Sec-Concepts Networks project, through its Cisco
						Networking Academy status, partners with private institutions to
						help bridge the Networking and Cybersecurity skills and
						certification gap.
					</p>
					<p className="text-base font-medium leading-7 text-gray-700 mb-4">
						We provide students with hands-on training in essential core skills,
						along with access to discounted certification exams vouchers upon
						completing the Cisco Certified Network Associate (CCNA) and
						Cybersecurity Operations (CyberOps Associate) programs - all within
						a 12-month learning track.
					</p>
					<p className="text-base font-medium leading-7 text-gray-700 mb-4">
						This 12 Months skill-sets training attract more than 50 Networking &
						Cybersecurity JOB-ROLES. All registered students get monthly 5GB
						data on all the major network provider (MTN, GLO, Airtel, and
						9Mobile), for ease of class attendance.
					</p>
					<p className="text-base font-medium leading-7 text-gray-700 mb-4">
						These two certifications are divided into four modules:
					</p>
					<ul className="list-disc list-inside text-base font-medium leading-5 text-gray-700 mb-4 space-y-4">
						<li> Introductions to Networks (ITN)</li>
						<li> Switch, Routing and Wireless Essentials (SRWE)</li>
						<li> Enterprise Networks and Security Automation (ENSA)</li>
						<li> CyberOps Associate</li>
					</ul>
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
								src="/images/aboutUs.svg"
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
								src="/images/aboutUs1.svg"
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
								src="/images/aboutUs.svg"
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
								src="/images/aboutUs1.svg"
								alt="Learning environment"
								fill
								className="object-cover rounded-3xl"
							/>
						</motion.div>
					</div>
				</div>
				<div className="pt-5">
					<Button className="bg-[#51A8B1] text-white hover:bg-teal-600 hover:text-white border py-5 px-5">
						<a href="/register" className="text-base font-semibold">
							Register Now
						</a>
					</Button>
				</div>
			</div>
		</section>
	);
}
