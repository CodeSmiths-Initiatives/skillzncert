"use client";

import { useState, useEffect, useRef } from "react";
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
		video: "/static/images/skillsAd.mp4",
	},
	{
		id: 2,
		title: "Globally Recognized after-Training Certificates!",
		description:
			"Industry professionals have long shaped the evolution of this field, prompting constant innovation and the introduction of new technologies to supersede outdated ones.",
		image: "/static/images/Certificate.jpg",
	},
	{
		id: 3,
		title: "Enjoy FREE DATA While accessing your class",
		description:
			"All registered students get monthly 5GB data on all the major network provider (MTN, GLO, Airtel, and 9Mobile), for ease of class attendance.",
		image: "/static/images/Free data.jpeg",
	},
	{
		id: 4,
		title: "Attract more than 50 Networking & Cybersecurity JOB-ROLES.",
		description:
			"This 12 Months skills-ses training attract more than 50 Networking & Cybersecurity JOB_ROLES.",
		image: "/static/images/skills.jpg",
	},
];

const SLIDE_DURATION = 5000; // 5 seconds per slide

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
	const [progress, setProgress] = useState(0);
	const [isVideoPlaying, setIsVideoPlaying] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		// Don't auto-advance if video is playing
		if (isVideoPlaying) {
			setProgress(0);
			return;
		}

		// Reset progress when slide changes
		setProgress(0);

		// Animate progress bar
		const progressInterval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 100) return 100;
				return prev + (100 / SLIDE_DURATION) * 50; // Update every 50ms
			});
		}, 50);

		// Auto-advance to next slide
		const slideTimer = setTimeout(() => {
			setCurrent((prev) => (prev + 1) % slides.length);
		}, SLIDE_DURATION);

		return () => {
			clearInterval(progressInterval);
			clearTimeout(slideTimer);
		};
	}, [current, isVideoPlaying]);

	const handleVideoPlay = () => {
		setIsVideoPlaying(true);
	};

	const handleVideoPause = () => {
		setIsVideoPlaying(false);
	};

	const handleVideoEnded = () => {
		setIsVideoPlaying(false);
		// Optionally auto-advance to next slide when video ends
		setCurrent((prev) => (prev + 1) % slides.length);
	};

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
									suppressHydrationWarning
									className="mt-6 inline-flex items-center justify-center rounded-lg bg-[#58AEB3] px-8 py-4 text-sm font-semibold text-white transition
									hover:-translate-y-px hover:shadow-lg
									focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#58AEB3]/40"
								>
									Learn More
								</button>
							</motion.div>
						</AnimatePresence>
					</div>

					<div className="relative h-70 w-full overflow-hidden rounded-2xl md:h-100">
						<AnimatePresence mode="wait">
							<motion.div
								key={slides[current].image}
								initial={{ opacity: 0, scale: 0.96 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.98 }}
								transition={{ duration: 0.5, ease: "easeOut" }}
								className="absolute inset-0"
							>
								{slides[current].video ? (
									<video
										ref={videoRef}
										src={slides[current].video}
										controls
										onPlay={handleVideoPlay}
										onPause={handleVideoPause}
										onEnded={handleVideoEnded}
										className="object-cover h-full w-full rounded-lg"
										style={{
											objectFit: "contain",
											width: "100%",
											height: "100%",
										}}
									/>
								) : (
									<Image
										src={slides[current].image!}
										alt="slide image"
										fill
										className="object-cover"
										priority
									/>
								)}
							</motion.div>
						</AnimatePresence>
					</div>
				</div>

				<div className="mt-16 flex flex-col items-center gap-6">
					<div className="relative h-2 w-64 rounded-full bg-gray-300 overflow-hidden">
						<motion.div
							className="absolute left-0 top-0 h-full rounded-full bg-[#58AEB3]"
							style={{ width: `${progress}%` }}
							transition={{ duration: 0.05, ease: "linear" }}
						/>
					</div>
				</div>
			</motion.div>
		</section>
	);
}
