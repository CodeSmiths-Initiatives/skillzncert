"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BRAND_PRIMARY = "#51A8B1";
const BRAND_LIGHT = "#EAF6F8";

const faqs = [
	{
		question: "What is Skillz’n’Cert?",
		answer:
			"Skillz’n’Cert is a project by Sec-Concepts Networks under the Cisco Networking Academy, designed to equip undergraduate students with hands-on Networking and Cybersecurity skills, plus industry-recognized certifications.",
	},
	{
		question: "Who can participate?",
		answer:
			"The program is open to undergraduate students in any Nigerian university or polytechnic, especially those studying IT-related courses.",
	},
	{
		question: "How do I register?",
		answer:
			"You can register through our official website at www.skillzncert.com or by contacting our coordinators directly on 08039134906.",
	},
	{
		question: "Is there a fee?",
		answer:
			"Yes. Program costs vary depending on the selected track (Networking, Cybersecurity, etc.). We offer student-friendly pricing and possible sponsorship opportunities.",
	},
	{
		question: "What will I gain?",
		answer:
			"Participants gain hands-on training in Cisco Networking and Cybersecurity, access to Cisco NetAcad resources, certification exam preparation, and internship and mentorship opportunities.",
	},
	{
		question: "How long is the program?",
		answer: "The Skillz’n’Cert program runs for a duration of 12 months.",
	},
	{
		question: "Will I receive a certificate?",
		answer:
			"Yes. Students who complete the training will earn Cisco Networking Academy certificates and can sit for global certification exams with a 58% discounted exam voucher for CCNA and CyberOps Associate.",
	},
	{
		question: "Is the training online or in-person?",
		answer:
			"The training is conducted as an online, instructor-led practical class.",
	},
	{
		question: "Who do I contact for more information?",
		answer:
			"You can reach us via Phone or WhatsApp at +234 803 913 4906, follow us on Instagram @secconceptsnetworks, or visit www.skillzncert.com.",
	},
	{
		question: "Do I need prior experience?",
		answer:
			"No prior experience is required. Beginners are welcome, though basic computer literacy is helpful.",
	},
];

export default function FAQSection() {
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	const toggleFAQ = (index: number) => {
		setOpenIndex(openIndex === index ? null : index);
	};

	return (
		<section className="w-full max-w-4xl mx-auto px-4 py-20">
			<h2
				className="text-3xl md:text-4xl font-bold text-center mb-12"
				style={{ color: BRAND_PRIMARY }}
			>
				Frequently Asked Questions
			</h2>

			<div className="space-y-5">
				{faqs.map((faq, index) => (
					<motion.div
						key={index}
						layout
						initial={{ borderRadius: 16 }}
						className="border rounded-2xl overflow-hidden shadow-sm"
						style={{ borderColor: BRAND_PRIMARY }}
					>
						<button
							onClick={() => toggleFAQ(index)}
							className="w-full flex items-center justify-between p-5 text-left transition-colors"
							style={{
								backgroundColor: openIndex === index ? BRAND_LIGHT : "#ffffff",
							}}
						>
							<span className="font-medium text-gray-800">{faq.question}</span>
							<motion.span
								animate={{ rotate: openIndex === index ? 180 : 0 }}
								transition={{ duration: 0.3 }}
							>
								<ChevronDown
									className="h-5 w-5"
									style={{ color: BRAND_PRIMARY }}
								/>
							</motion.span>
						</button>

						<AnimatePresence initial={false}>
							{openIndex === index && (
								<motion.div
									key="content"
									initial={{ height: 0, opacity: 0 }}
									animate={{ height: "auto", opacity: 1 }}
									exit={{ height: 0, opacity: 0 }}
									transition={{ duration: 0.35, ease: "easeInOut" }}
									className="px-5 pb-5 text-gray-700 leading-relaxed"
								>
									{faq.answer}
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				))}
			</div>
		</section>
	);
}
