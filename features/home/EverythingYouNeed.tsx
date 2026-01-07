import React from "react";
import { FiAward } from "react-icons/fi";
import { GoPersonAdd } from "react-icons/go";
import { MdOutlinePayment } from "react-icons/md";

export default function EverythingYouNeed() {
	return (
		<div className="max-w-7xl md:mx-auto my-10 p-6 ">
			<div className="text-center">
				<h3 className="text-4xl font-semibold py-3">Everything You need</h3>
				<p className="text-base font-medium text-gray-500">
					A complete suite of tools to manage the entire educational lifecycle
				</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-10 my-10 ">
				<div className=" rounded-md shadow-md p-6 bg-gray-50 hover:animate-pulse">
					<div className="bg-blue-200 text-blue-700 p-2 w-fit rounded-md">
						<p>
							<GoPersonAdd size={30} />
						</p>
					</div>
					<h3 className="text-lg font-semibold pt-5">Smart Registration</h3>
					<p className="text-sm font-light text-gray-400 pt-3">
						Streamlined student onboarding with automated workflows and document
						verification.
					</p>
				</div>
				<div className=" rounded-md shadow-md p-6 bg-gray-50 hover:animate-pulse">
					<div className="bg-orange-100 text-orange-700 p-2 w-fit rounded-md">
						<p>
							<MdOutlinePayment size={30} />
						</p>
					</div>
					<h3 className="text-lg font-semibold pt-5">Payment Processing</h3>
					<p className="text-sm font-light text-gray-400 pt-3">
						Secure payment gateway integration with multiple payment method and
						installments plans.
					</p>
				</div>
				<div className="rounded-md shadow-md p-6 bg-gray-50 hover:animate-pulse">
					<div className="bg-purple-100 text-purple-500 p-2 w-fit rounded-md">
						<p>
							<FiAward size={30} />
						</p>
					</div>
					<h3 className="text-lg font-semibold pt-5">Certification</h3>
					<p className="text-sm font-light text-gray-400 pt-3">
						Automated certificate generation and digital credential management
						upon completion.
					</p>
				</div>
			</div>
		</div>
	);
}
