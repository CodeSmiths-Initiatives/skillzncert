import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import {
	FaCcDiscover,
	FaCcMastercard,
	FaCcPaypal,
	FaCcVisa,
} from "react-icons/fa";

export default function PaymentMethod() {
	return (
		<div className="max-w-7xl mx-auto my-10">
			<div className="border rounded-md bg-white p-7">
				<h3 className="text-xl font-semibold text-gray-500 pb-5">
					Payment Method
				</h3>
				<div className="border rounded-sm">
					<div className="bg-gray-100 text-gray-900 px-2 py-1">
						<div className="flex items-center justify-between border-b border-gray-300 pb-4">
							<p className="text-base font-semibold">Paypal</p>
							<p className="text-blue-700">
								<FaCcPaypal size={25} />
							</p>
						</div>
						<div className="flex items-center justify-between py-3">
							<p className="text-base font-semibold">Credit card</p>
							<div className="flex items-center space-x-2">
								<p className="text-blue-800">
									<FaCcVisa size={20} />
								</p>
								<p className="text-amber-500">
									<FaCcMastercard size={20} />
								</p>
								<p className="text-red-400">
									<FaCcDiscover size={20} />
								</p>
							</div>
						</div>
					</div>
					<div className="grid grid-cols-2 py-5 px-3 gap-7">
						<div className="text-gray-400">
							<h3 className="text-3xl font-medium pb-4">summary</h3>
							<div className="text-sm text-gray-800 font-bold py-3">
								<p>Payment Plan:</p>
								<p>Amount:</p>
							</div>
							<p>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
								eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
								enim ad minim veniam, quis nostrud exercitation ullamco laboris
								nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
								in reprehenderit in voluptate velit esse cillum dolore eu fugiat
								nulla pariatur. Excepteur sint occaecat cupidatat non proident,
								sunt in culpa qui officia deserunt mollit anim id est laborum.
							</p>
						</div>
						<div className="">
							<form action="#">
								<div className="flex flex-col space-y-2">
									<label className="text-sm font-bold text-gray-400">
										CARD NUMBER
									</label>
									<Input
										className="input-feild"
										placeholder="Valid card name"
									></Input>
								</div>
								<div className="grid grid-cols-2 gap-5 py-3">
									<div className="flex flex-col space-y-2">
										<label className="text-sm font-bold text-gray-400">
											EXPIRY DATE
										</label>
										<Input className="input-feild" placeholder="MM/YY" />
									</div>
									<div className="flex flex-col space-y-2">
										<label className="text-sm font-bold text-gray-400">
											CVV
										</label>

										<Input className="input-feild" placeholder="CVV" />
									</div>
								</div>
								<div className="flex flex-col space-y-2">
									<label className="text-sm font-bold text-gray-400">
										NAME OF CARD
									</label>
									<Input
										className="input-feild"
										placeholder="NAME AND SURNAME"
									/>
								</div>
								<Button className="mt-4 bg-[#51A8B1] text-white text-base font-semibold hover:border-2 hover:border-[#51A8B1] hover:bg-white hover:text-[#51A8B1] py-2 rounded-md">
									Make Payment
								</Button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
