import Link from "next/link";
import { GoDotFill } from "react-icons/go";

export default function Payment() {
	return (
		<div className="max-w-7xl mx-auto my-10">
			<div className="text-center space-y-4">
				<h1 className="text-5xl font-semibold">Choose Your plan</h1>
				<p>
					Select the perfect plan for your needs. Upgrade or cancel at any time.
				</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
				<div className="border border-gray-300 rounded-lg p-6">
					<h2 className="text-xl font-semibold">Monthly</h2>
					<p className="text-gray-400">Flexible, cancel anytime</p>
					<div className="space-y-2">
						<h3 className="text-2xl font-semibold py-5">
							$9.99
							<span className="text-sm font-medium text-gray-400">/month</span>
						</h3>
						<p className="flex items-center gap-x-2 text-sm font-medium text-gray-400">
							<GoDotFill className="text-[#51A8B1]" />
							Access to all features
						</p>
						<p className="flex items-center gap-x-2 text-sm font-medium text-gray-400">
							<GoDotFill className="text-[#51A8B1]" />
							Basic support
						</p>
						<p className="flex items-center gap-x-2 text-sm font-medium text-gray-400">
							<GoDotFill className="text-[#51A8B1]" />1 Team member
						</p>
					</div>
				</div>
				<div className="border border-gray-300 rounded-lg p-6">
					<div>
						<h2 className="text-xl font-semibold">Quarterly</h2>
						<p className="text-gray-400">Most popular choice</p>
					</div>
					<div className="space-y-2">
						<h3 className="text-2xl font-semibold py-5">
							$79
							<span className="text-sm font-medium text-gray-400">/3month</span>
						</h3>
						<p className="flex items-center gap-x-2 text-sm font-medium text-gray-400">
							<GoDotFill className="text-[#51A8B1]" />
							Access to all features
						</p>
						<p className="flex items-center gap-x-2 text-sm font-medium text-gray-400">
							<GoDotFill className="text-[#51A8B1]" />
							Priority support
						</p>
						<p className="flex items-center gap-x-2 text-sm font-medium text-gray-400">
							<GoDotFill className="text-[#51A8B1]" />3 Team members
						</p>
						<p className="flex items-center gap-x-2 text-sm font-medium text-gray-400">
							<GoDotFill className="text-[#51A8B1]" />
							Advanced analytics
						</p>
					</div>
				</div>
				<div className="border border-gray-300 rounded-lg p-6">
					<h2 className="text-xl font-semibold">Annualy</h2>
					<p className="text-gray-400">Best value for serious pros</p>
					<div className="space-y-2">
						<h3 className="text-2xl font-semibold py-5">
							$299
							<span className="text-sm font-medium text-gray-400">/year</span>
						</h3>
						<p className="flex items-center gap-x-2 text-sm font-medium text-gray-400">
							<GoDotFill className="text-[#51A8B1]" />
							Access to all features
						</p>
						<p className="flex items-center gap-x-2 text-sm font-medium text-gray-400">
							<GoDotFill className="text-[#51A8B1]" />
							24/7 Dedicated support
						</p>
						<p className="flex items-center gap-x-2 text-sm font-medium text-gray-400">
							<GoDotFill className="text-[#51A8B1]" />
							Unlimited team members
						</p>
						<p className="flex items-center gap-x-2 text-sm font-medium text-gray-400">
							<GoDotFill className="text-[#51A8B1]" />
							Custom integrations
						</p>
						<p className="flex items-center gap-x-2 text-sm font-medium text-gray-400">
							<GoDotFill className="text-[#51A8B1]" />
							API Access
						</p>
					</div>
				</div>
			</div>

			<div className="mt-10 border border-gray-300 rounded-lg p-6 max-w-7xl mx-auto">
				<h2 className="text-xl font-semibold border-b border-gray-300 pb-5">
					Order Summary
				</h2>
				<p className="mt-4 text-xl font-semibold text-gray-400 border-b border-gray-300 pb-5">
					Total
				</p>
				<p className="mt-4 text-gray-400">
					* For United States, Nigeria, Frances and Germany applicable sales tax
					will be applied
				</p>

				<div className="mt-4 flex justify-center border rounded-md w-fit">
					<Link
						href={"./paymentMethod"}
						className="bg-[#51A8B1] text-white px-6 py-3 text-base font-medium rounded-l-md"
					>
						Checkout
					</Link>
					<Link
						href={"./payment"}
						className="bg-white text-gray-400 text-base font-medium px-5 py-3 rounded-r-md "
					>
						Cancel
					</Link>
				</div>
			</div>
		</div>
	);
}
