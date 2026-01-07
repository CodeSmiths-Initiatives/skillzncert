import React from "react";
import { FiAward } from "react-icons/fi";
import { GoPersonAdd } from "react-icons/go";
import { MdOutlinePayment } from "react-icons/md";

export default function CompleteStudent() {
	return (
		<div className="max-w-full px-10 md:px-32 py-10 bg-gray-50">
			<div className="text-center">
				<h3 className="text-4xl font-semibold py-3">
					The Complete Student Journey
				</h3>
				<p className="text-base font-medium text-gray-500">
					Follow students from their first interaction to certificate complete
				</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-10 my-10">
				<div className="flex flex-col justify-center items-center">
					<div className="bg-blue-700 text-white p-7 w-fit rounded-full hover:animate-bounce">
						<p>
							<GoPersonAdd size={50} />
						</p>
					</div>
					<h3 className="text-lg font-semibold pt-5">Registration</h3>
				</div>
				<div className="flex flex-col justify-center items-center">
					<div className="bg-orange-600 text-white p-7 w-fit rounded-full hover:animate-bounce">
						<p>
							<MdOutlinePayment size={50} />
						</p>
					</div>
					<h3 className="text-lg font-semibold pt-5">Payment</h3>
				</div>
				<div className="flex flex-col justify-center items-center">
					<div className="bg-purple-700 text-white p-7 w-fit rounded-full hover:animate-bounce">
						<p>
							<FiAward size={50} />
						</p>
					</div>
					<h3 className="text-lg font-semibold pt-5">Certification</h3>
				</div>
			</div>
			<div className="md:px-64">
				<p className="text-center text-base font-medium text-gray-500 pt-5">
					Every step is automated, tracked, and optimized to ensure a smooth
					experience for both students and administrators.
				</p>
			</div>
		</div>
	);
}
