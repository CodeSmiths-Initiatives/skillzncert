import Image from "next/image";
import Link from "next/link";
import React from "react";
import { CiMail } from "react-icons/ci";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaHouseChimney, FaWhatsapp, FaXTwitter } from "react-icons/fa6";
import { IoCall } from "react-icons/io5";

export default function Footer() {
	return (
		<footer className="bg-gray-50 text-white py-6">
			<div className="max-w-full mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-5 mx-10 my-10 gap-10 text-[#9CA3AF]">
					<div>
						<div className="flex flex-col space-y-5">
							<Image
								src="static/images/sec logo.svg"
								alt="Logo"
								width={70}
								height={10}
							/>
							<Link href={"/"}>
								<Image
									src="static/images/skillsncert.svg"
									alt="Logo"
									width={220}
									height={70}
								/>
							</Link>
						</div>
					</div>

					<div>
						<ul className="flex flex-col space-y-2 text-sm font-medium text-gray-700">
							<li className="text-black text-xl font-semibold">
								<a href="#" />
								Company
							</li>
							<li>
								<Link href="#About">ABOUT</Link>
							</li>
							<li>
								<Link href="#Courses">COURSES</Link>
							</li>
						</ul>
					</div>
					<div>
						<ul className="flex flex-col space-y-3 text-sm font-medium text-gray-700">
							<li className="text-black text-xl font-semibold">
								<Link href="#">Contact Us</Link>
							</li>
							<li className="flex items-center gap-x-1">
								<FaWhatsapp className="text-teal-600" size={20} /> 08039134906
							</li>
							<li className="flex items-center gap-x-1">
								<IoCall className="text-teal-600" size={20} /> 08039134906
							</li>
						</ul>
					</div>
					<div>
						<ul className="flex flex-col space-y-3 text-sm font-medium text-gray-700">
							<li className="text-black text-xl font-semibold">
								<Link href="#">Address</Link>
							</li>

							<li className="flex items-center gap-x-1">
								<CiMail className="text-teal-600" size={20} />
								aliyuthayo@trainwithsec.com
							</li>
							<li className="flex items-center gap-x-1">
								<FaHouseChimney className="text-teal-600" size={20} />
								Room 27, Kwara State Library, Ilorin
							</li>
						</ul>
					</div>
					<div>
						<ul className="flex flex-col space-y-3 text-sm font-medium text-gray-700">
							<li className="text-black text-xl font-semibold">
								<Link href="#">Follow Us</Link>
							</li>

							<li className="flex items-center gap-x-1">
								<FaFacebook className="text-teal-600" size={20} /> Sec-concepts
								Network
							</li>
							<li className="flex items-center gap-x-1">
								<FaXTwitter className="text-teal-600" size={20} /> @aliyuthayo
							</li>
							<li className="flex items-center gap-x-1">
								<FaInstagram className="text-teal-600" size={20} />{" "}
								secconceptsnetwork
							</li>
						</ul>
					</div>
				</div>
			</div>
		</footer>
	);
}
