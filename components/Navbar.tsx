"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
	const [open, setOpen] = useState(false);

	return (
		<nav className="fixed top-0 left-0 w-full border-b bg-gray-50 z-50">
			<div className="flex items-center justify-between max-w-full mx-auto p-4">
				<div className="flex items-center space-x-2">
					<Image src="static/images/logo 1.svg" alt="Logo" width={50} height={10} />
					<h3 className="text-xl font-semibold">CE-EMS</h3>
				</div>

				<div className="hidden md:flex items-center space-x-10">
					<ul className="flex space-x-5 text-gray-500 font-medium">
						<li>
							<Link href="/">PROGRAMMES</Link>
						</li>
						<li>
							<Link href="#">COURSES</Link>
						</li>
						<li>
							<Link href="#">ABOUT</Link>
						</li>
					</ul>

					<Link						
						href="/login"
						className="bg-[#51A8B1] hover:bg-teal-600 text-white text-base font-semibold px-4 py-2 rounded-md"
					>
						Login
					</Link>
				</div>

				<button
					className="md:hidden text-2xl"
					onClick={() => setOpen(!open)}
					aria-label="Toggle menu"
				>
					{open ? <FiX /> : <FiMenu />}
				</button>
			</div>

			{open && (
				<div className="md:hidden border-t px-4 pb-4">
					<ul className="flex flex-col text-center space-y-3 text-gray-600 font-medium">
						<li>
							<Link href="/" onClick={() => setOpen(false)}>
								Home
							</Link>
						</li>
						<li>
							<Link href="#" onClick={() => setOpen(false)}>
								About
							</Link>
						</li>
						<li>
							<Link href="#" onClick={() => setOpen(false)}>
								Contact
							</Link>
						</li>
						<li>
							<Link
								href="/login"
								className="inline-block bg-[#51A8B1] text-white text-base font-semibold px-4 py-2 rounded-md"
								onClick={() => setOpen(false)}
							>
								Login
							</Link>
						</li>
					</ul>
				</div>
			)}
		</nav>
	);
}
