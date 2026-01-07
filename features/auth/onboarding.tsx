import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React from "react";
import { BiSolidImageAdd } from "react-icons/bi";

export default function onboarding() {
	return (
		<div className="w-full max-w-3xl mx-auto my-20">
			<div className="rounded-md shadow-md p-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-[#51A8B1]">Logo</h1>
					<h3 className="text-xl font-semibold py-1">Welcome!</h3>
				</div>
				<form action="#">
					<div className="grid grid-cols-2 gap-10">
						<div className="flex flex-col space-y-2">
							<label>First Name</label>
							<Input
								type="text"
								className="input-field"
								placeholder="First Name"
							/>
						</div>
						<div className="flex flex-col space-y-2">
							<label>Last Name</label>
							<Input
								type="text"
								className="input-field"
								placeholder="Last Name"
							/>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-10">
						<div className="flex flex-col space-y-2 ">
							<label>Phone Number</label>
							<Input
								type="text"
								placeholder="phone number"
								className="input-field"
							/>
						</div>
						<div className="flex flex-col space-y-2 ">
							<label>Contact Address</label>
							<Input
								type="text"
								placeholder="Address"
								className="input-field"
							/>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-10">
						<div className="flex flex-col space-y-2 ">
							<label>State</label>
							<Input type="text" placeholder="state" className="input-field" />
						</div>
						<div className="flex flex-col space-y-2 ">
							<label>Country</label>
							<Input
								type="text"
								placeholder="Country"
								className="input-field"
							/>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-10">
						<div className="flex flex-col space-y-2">
							<label>Preferred Language</label>
							<Input
								type="text"
								className="input-field"
								placeholder="Preferred language"
							/>
						</div>
						<div className="flex flex-col space-y-2 ">
							<label>Current Educational level</label>
							<Input
								type="text"
								placeholder="Current educational level"
								className="input-field"
							/>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-10">
						<div className="flex flex-col space-y-2 ">
							<label>Previous Certification</label>
							<Input
								type="text"
								placeholder="Previous certification"
								className="input-field"
							/>
						</div>
						<div className="flex flex-col space-y-2 ">
							<label>University Attending</label>
							<Input
								type="text"
								placeholder="Institution"
								className="input-field"
							/>
						</div>
					</div>

					<div className="gap-10">
						<div className="flex flex-col space-y-2">
							<label> Do you have a NetAcad account? if yes,</label>
							<div className="flex items-center space-x-5">
								<p className="flex items-center space-x-2">
									<Checkbox /> Yes
								</p>
								<p className="flex items-center space-x-2">
									<Checkbox />
									No
								</p>
							</div>
							<Input
								type="text"
								placeholder="provide your Email address"
								className="input-field"
							/>
						</div>
					</div>
					<div className="flex flex-col space-y-2 mt-5">
						<label className="label">
							Passport:<span className="text-red-400">*</span>
						</label>
						<div className="h-80 border rounded-sm text-center p-10 space-y-1">
							<div className="flex justify-center text-[#51A8B1] opacity-55 text-7xl pb-3">
								<BiSolidImageAdd />
							</div>
							<Input
								type="file"
								multiple
								accept="image/png,image/jpeg,image/gif"
								className="mx-auto w-fit mb-10"
							/>
							<p className="text-gray-600 text-sm">
								Image Size: Less than 50kb
							</p>
							<p className="text-gray-500 text-xs">
								Image type: JPEG,GIF OR PNG only
							</p>
						</div>
					</div>

					<div className="flex flex-col space-y-2 mt-5">
						<label className="label">
							School ID-Card:<span className="text-red-400">*</span>
						</label>
						<div className="h-80 border rounded-sm text-center p-10 space-y-1">
							<div className="flex justify-center text-[#51A8B1] opacity-55 text-7xl pb-3">
								<BiSolidImageAdd />
							</div>
							<Input
								type="file"
								multiple
								accept="image/png,image/jpeg,image/gif"
								className="mx-auto w-fit mb-10"
							/>
							<p className="text-gray-600 text-sm">
								Image Size: Less than 50kb
							</p>
							<p className="text-gray-500 text-xs">
								Image type: JPEG,GIF OR PNG only
							</p>
						</div>
					</div>

					<Button className="mt-4 bg-[#51A8B1] text-white text-base font-semibold hover:border-2 hover:border-[#51A8B1] hover:bg-white hover:text-[#51A8B1] py-2 rounded-md">
						<Link href={"/payment"}>Next</Link>
					</Button>
				</form>

				<div className=" text-teal-500 flex items-center justify-center space-x-3 mt-7 ">
					<p className="border-r pr-3">Terms of use</p>
					<p>privacy policy</p>
				</div>
			</div>
		</div>
	);
}
