import { Button } from "@/components/ui/button";
import React from "react";
import { GoDotFill } from "react-icons/go";
import { IoIosArrowRoundForward } from "react-icons/io";

export default function ReadyToTransform() {
	return (
		<div className="bg-gradient-to-r from-blue-800 to-green-500 max-w-full mx-auto">
			<div className="px-10 md:px-32 py-10 text-white text-center">
				<h1 className="text-4xl font-semibold pb-5 md:px-82">
					Ready To Transform Your Institution?
				</h1>
				<p className="text-base font-medium md:px-80 py-3">
					Join hundreds of educational institutions already using CE-EMS to
					streamline their operations and improve student outcomes.
				</p>

				<div className="flex items-center justify-center space-x-4 mt-5">
					<Button className="bg-white text-blue-600 hover:bg-inherit hover:text-white border py-5 px-3">
						Schedule a Demo
					</Button>
					<Button className="bg-inherit text-white border hover:text-blue-600 hover:bg-white py-5 px-3">
						View Pricing
						<IoIosArrowRoundForward />
					</Button>
				</div>
				<div className="flex items-center justify-center space-x-10  font-medium mt-10">
					<p className="flex items-center space-x-2">
						<GoDotFill />
						No credit card required
					</p>
					<p className="flex items-center space-x-2">
						<GoDotFill />
						Free 30-day trial
					</p>
					<p className="flex items-center space-x-2">
						<GoDotFill />
						Setup in minutes
					</p>
				</div>
			</div>
		</div>
	);
}
