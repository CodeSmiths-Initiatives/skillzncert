import Image from "next/image";
import React from "react";

export default function WhyChooseCe() {
	return (
		<div className="max-w-full mx-10 md:mx-32 my-10">
			<div className="text-center">
				<h1 className="text-4xl font-semibold">Why Choose CE-EMS</h1>
				<p className="pt-3 text-gray-400">
					Built for modern educational institutions that demand excellence
				</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-20 mt-10">
				<div>
					<Image
						src="./Images/Save Time.svg"
						alt="Save time"
						width={60}
						height={200}
					/>
					<h4 className="text-xl font-semibold py-3">Save Time</h4>
					<p className="text-sm font-medium text-gray-400">
						Automate repetitive tasks and reduce administrative overhead by up
						to 70%.
					</p>
					<div className="bg-blue-100 w-fit my-5 py-2 px-5 rounded-full">
						<p className="text-base font-medium text-blue-800">
							70% faster processing
						</p>
					</div>
				</div>
				<div>
					<Image
						src="./Images/Stay complain.svg"
						alt="Stay complaint"
						width={60}
						height={200}
					/>
					<h4 className="text-xl font-semibold py-3">Stay Compliant</h4>
					<p className="text-sm font-medium text-gray-400">
						Built-in compliance tools ensure you meet all educational standards
						and regulations.
					</p>
					<div className="bg-blue-100 w-fit my-5 py-2 px-5 rounded-full">
						<p className="text-base font-medium text-blue-800">
							100% audit-ready
						</p>
					</div>
				</div>
				<div>
					<Image
						src="./Images/Scale easily.svg"
						alt="scale easily"
						width={60}
						height={200}
					/>
					<h4 className="text-xl font-semibold py-3">Scale easily</h4>
					<p className="text-sm font-medium text-gray-400">
						Grow from 100 to 100,000 students without changing your
						infrastructure.
					</p>
					<div className="bg-blue-100 w-fit my-5 py-2 px-5 rounded-full">
						<p className="text-base font-medium text-blue-800">
							Unlimited scalability
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
