"use client";

import { useEffect, useState } from "react";

export default function Counter() {
	const [timeLeft, setTimeLeft] = useState(0);
	useEffect(() => {
		const now = new Date();
		const currentYear = now.getFullYear();

		let targetDate = new Date(currentYear, 2, 1);

		if (now > targetDate) {
			targetDate = new Date(currentYear + 1, 2, 1);
		}

		const updateCountdown = () => {
			const diff = Math.max(0, targetDate.getTime() - Date.now());
			setTimeLeft(diff);
		};

		updateCountdown();
		const interval = setInterval(updateCountdown, 1000);

		return () => clearInterval(interval);
	}, []);
	const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
	const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
	const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
	const seconds = Math.floor((timeLeft / 1000) % 60);

	return (
		<div className="flex gap-10 border shadow-md p-5 rounded-lg justify-center max-w-md md:max-w-2xl mx-auto my-20">
			<TimeCard label="Days" value={days} />
			<TimeCard label="Hours" value={hours} />
			<TimeCard label="Minutes" value={minutes} />
			<TimeCard label="Seconds" value={seconds} />
		</div>
	);
}

type TimeCardProps = {
	label: string;
	value: number;
};

function TimeCard({ label, value }: TimeCardProps) {
	return (
		<div className="flex flex-col items-center rounded-lg border bg-[#51A8B1] px-6 py-4 shadow-sm min-w-[40px] md:min-w-[90px]">
			<span className="text-xl md:text-2xl font-bold">
				{String(value).padStart(2, "0")}
			</span>
			<span className="text-sm text-gray-500">{label}</span>
		</div>
	);
}
