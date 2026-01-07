import { Button } from "@/components/ui/button";
import React from "react";
import { BiRightArrow } from "react-icons/bi";
import { GoDotFill } from "react-icons/go";
import { IoIosArrowRoundForward } from "react-icons/io";

export default function Hero() {
	return (
		<div
			className="relative bg-cover bg-center h-[600px]"
			style={{ backgroundImage: 'url("./Images/hero-img4.png")' }}
		>
			<div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>

			<div className="relative max-w-7xl flex flex-col items-center justify-center space-y-6 md:mx-auto text-center text-white px-4 py-10">
				<div className="bg-gray-800 rounded-full py-2 px-3 text-white w-fit h-12 text-center mb-10">
					<p className="flex items-center space-x-1">
						<GoDotFill /> Complete Education Management Platform
					</p>
				</div>

				<h1 className="text-5xl md:text-6xl font-semibold text-white md:px-96 py-3">
					Transform Your <span className="text-[#1F2937]">Student Journey</span>
				</h1>

				<p className="text-lg md:text-xl font-semibold text-white md:px-80">
					Streamline every step from registration to certification. CE-EMS
					handles enrollment, payments, course delivery, and progress tracking —
					all in one powerful platform.
				</p>

				<div className="flex items-center space-x-4 mt-5">
					<Button className="bg-[#51A8B1] text-white hover:bg-inherit border py-5 px-3">
						Get Started Free
						<IoIosArrowRoundForward />
					</Button>
					<Button className="bg-inherit border hover:bg-[#51A8B1] py-5 px-3">
						<BiRightArrow />
						Watch Demo
					</Button>
				</div>

				<div className="hidden md:flex items-center space-x-10 font-medium mt-5">
					<p className="flex items-center space-x-2">
						<GoDotFill />
						Trusted by 500+ institutions
					</p>
					<p className="flex items-center space-x-2">
						<GoDotFill />
						100k+ students managed
					</p>
					<p className="flex items-center space-x-2">
						<GoDotFill />
						99.9% uptime
					</p>
				</div>
			</div>
		</div>
	);
}
