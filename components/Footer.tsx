import React from "react";

export default function Footer() {
	return (
		<footer className="bg-[#1F2937] text-white py-6">
			<div className="max-w-full mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-4 mx-10 my-10 gap-10 text-[#9CA3AF]">
					<div>
						<div className="flex items-center space-x-3 mb-5 text-white">
							<h1 className="rounded-md bg-[#51A8B1] p-2 text-base font-bold">
								CE
							</h1>
							<h3 className="text-lg font-semibold">CE-EMS</h3>
						</div>
						<p className="text-sm font-medium pr-20">
							Complete education management solution for modern institutions
						</p>
					</div>
					<div>
						<ul className="flex flex-col space-y-2 text-sm font-medium">
							<li className="text-white text-base font-medium">
								<a href="#" />
								Products
							</li>
							<li>
								<a href="#" />
								Intergration
							</li>
							<li>
								<a href="#" />
								Pricing
							</li>
							<li>
								<a href="#" />
								Security
							</li>
						</ul>
					</div>
					<div>
						<ul className="flex flex-col space-y-2 text-sm font-medium">
							<li className="text-white text-base font-medium">
								<a href="#" />
								Company
							</li>
							<li>
								<a href="#" />
								About
							</li>
							<li>
								<a href="#" />
								Blog
							</li>
							<li>
								<a href="#" />
								Career
							</li>
							<li>
								<a href="#" />
								Contact
							</li>
						</ul>
					</div>
					<div>
						<ul className="flex flex-col space-y-2 text-sm font-medium">
							<li className="text-white text-base font-medium">
								<a href="#" />
								Legal
							</li>
							<li>
								<a href="#" />
								privacy
							</li>
							<li>
								<a href="#" />
								Terms
							</li>
							<li>
								<a href="#" />
								Cookies Policy
							</li>
						</ul>
					</div>
				</div>
				<p className="text-center text-sm font-medium text-gray-400 border-t border-gray-700 mt-10 py-7">
					&copy; 2024 CE-EMS. All rights reserved.
				</p>
			</div>
		</footer>
	);
}
