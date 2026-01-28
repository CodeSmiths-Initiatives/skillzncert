"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/toast/ToastContext";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { BiSolidImageAdd } from "react-icons/bi";
import { submitEnrollmentAction } from "@/actions/enrollment/create-enrollment.actions";
import { motion } from "framer-motion";
import { 
	FaShieldAlt, 
	FaUserCheck, 
	FaRocket, 
	FaCertificate,
	FaGraduationCap,
	FaCheckCircle 
} from "react-icons/fa";

export default function Onboarding() {
	const router = useRouter();
	const { showToast } = useToast();
	const [isPending, startTransition] = useTransition();

	const [passport, setPassport] = useState<File | null>(null);
	const [schoolId, setSchoolId] = useState<File | null>(null);
	const [hasNetAcad, setHasNetAcad] = useState<boolean | null>(null);

	const [form, setForm] = useState({
		firstName: "",
		lastName: "",
		phoneNumber: "",
		address: "",
		state: "",
		country: "",
		preferredLanguage: "",
		yearOfStudy: "",
		previousCertification: "",
		universityAttending: "",
		hasNetacadAccount: false,
		netacadId: "",
		preferredNetwork: "",
		numberForData: "",
	});

	const [errors, setErrors] = useState({
		firstName: "",
		lastName: "",
		phoneNumber: "",
		numberForData: "",
		yearOfStudy: "",
		state: "",
		country: "",
	});

	// Validation functions
	const validateName = (name: string, fieldName: string): string => {
		if (!name.trim()) {
			return `${fieldName} is required`;
		}
		if (name.includes(" ")) {
			return `${fieldName} cannot contain spaces`;
		}
		if (/\d/.test(name)) {
			return `${fieldName} cannot contain numbers`;
		}
		if (!/^[a-zA-Z]+$/.test(name)) {
			return `${fieldName} can only contain letters`;
		}
		return "";
	};

	const validatePhoneNumber = (phone: string): string => {
		if (!phone.trim()) {
			return "Phone number is required";
		}
		// Remove any non-digit characters for validation
		const digitsOnly = phone.replace(/\D/g, "");
		if (digitsOnly.length !== 10) {
			return "Phone number must be exactly 10 digits";
		}
		if (!/^\d+$/.test(digitsOnly)) {
			return "Phone number can only contain digits";
		}
		return "";
	};

	const validateYearOfStudy = (year: string): string => {
		if (!year.trim()) {
			return "";
		}
		const digitsOnly = year.replace(/\D/g, "");
		if (digitsOnly.length !== 4) {
			return "Year must be exactly 4 digits";
		}
		const yearNum = parseInt(digitsOnly);
		if (yearNum < 1900 || yearNum > 2100) {
			return "Please enter a valid year";
		}
		return "";
	};

	const validateSelect = (value: string, fieldName: string): string => {
		if (!value || value === "") {
			return `${fieldName} is required`;
		}
		return "";
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value } = e.target;
		setForm((p) => ({ ...p, [name]: value }));

		// Real-time validation
		if (name === "firstName") {
			setErrors((prev) => ({
				...prev,
				firstName: validateName(value, "First name"),
			}));
		} else if (name === "lastName") {
			setErrors((prev) => ({
				...prev,
				lastName: validateName(value, "Last name"),
			}));
		} else if (name === "phoneNumber") {
			setErrors((prev) => ({
				...prev,
				phoneNumber: validatePhoneNumber(value),
			}));
		} else if (name === "numberForData") {
			setErrors((prev) => ({
				...prev,
				numberForData: validatePhoneNumber(value),
			}));
		} else if (name === "yearOfStudy") {
			setErrors((prev) => ({
				...prev,
				yearOfStudy: validateYearOfStudy(value),
			}));
		} else if (name === "state") {
			setErrors((prev) => ({
				...prev,
				state: validateSelect(value, "State"),
			}));
		} else if (name === "country") {
			setErrors((prev) => ({
				...prev,
				country: validateSelect(value, "Country"),
			}));
		}
	};

	const validateForm = (): boolean => {
		const firstNameError = validateName(form.firstName, "First name");
		const lastNameError = validateName(form.lastName, "Last name");
		const phoneError = validatePhoneNumber(form.phoneNumber);
		const numberForDataError = validatePhoneNumber(form.numberForData);
		const yearError = validateYearOfStudy(form.yearOfStudy);
		const stateError = validateSelect(form.state, "State");
		const countryError = validateSelect(form.country, "Country");

		setErrors({
			firstName: firstNameError,
			lastName: lastNameError,
			phoneNumber: phoneError,
			numberForData: numberForDataError,
			yearOfStudy: yearError,
			state: stateError,
			country: countryError,
		});

		// Check required fields
		if (
			!form.firstName ||
			!form.lastName ||
			!form.phoneNumber ||
			!form.address ||
			!form.state ||
			!form.country ||
			!form.preferredNetwork ||
			!form.numberForData
		) {
			showToast({
				type: "error",
				title: "Required fields missing",
				description: "Please fill in all required fields marked with *",
			});
			return false;
		}

		// Check validation errors
		if (firstNameError || lastNameError || phoneError || numberForDataError || yearError || stateError || countryError) {
			showToast({
				type: "error",
				title: "Validation failed",
				description: "Please fix the errors in the form before submitting.",
			});
			return false;
		}

		return true;
	};

	const submit = (e: React.FormEvent) => {
		e.preventDefault();

		// Validate form
		if (!validateForm()) {
			return;
		}

		if (!passport || !schoolId) {
			showToast({
				type: "error",
				title: "Documents required",
				description: "Please upload passport and school ID.",
			});
			return;
		}

		// Validate file sizes (1MB max)
		const maxSize = 1 * 1024 * 1024; // 1MB in bytes
		if (passport.size > maxSize) {
			showToast({
				type: "error",
				title: "File too large",
				description: "Passport image must be less than 1MB.",
			});
			return;
		}

		if (schoolId.size > maxSize) {
			showToast({
				type: "error",
				title: "File too large",
				description: "School ID image must be less than 1MB.",
			});
			return;
		}

		startTransition(async () => {
			// Create FormData fresh inside the async function to avoid React serialization issues
			const data = new FormData();

			// Append form data fields
			Object.entries(form).forEach(([k, v]) =>
				data.append(`data[${k}]`, String(v))
			);

			// Append file uploads (must match Strapi media field names exactly)
			data.append("files.passport", passport);
			data.append("files.schoolIdCard", schoolId);

			const res = await submitEnrollmentAction(data);

			if (!res.success) {
				showToast({
					type: "error",
					title: "Submission failed",
					description: res.message,
				});
				return;
			}

			showToast({
				type: "success",
				title: "Enrollment submitted",
				description: "Your enrollment has been successfully saved.",
			});

			router.replace("/payment");
		});
	};

	return (
		<div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#f5fbfc]">
			{/* LEFT BRAND PANEL - MODERN & ANIMATED */}
			<div className="hidden lg:flex flex-col justify-center px-12 bg-gradient-to-br from-[#0a4d54] via-[#51A8B1] to-[#3b8f97] text-white relative overflow-hidden">
				{/* Animated Background Elements */}
				<motion.div
					className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.3, 0.5, 0.3],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>
				<motion.div
					className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl"
					animate={{
						scale: [1.2, 1, 1.2],
						opacity: [0.2, 0.4, 0.2],
					}}
					transition={{
						duration: 10,
						repeat: Infinity,
						ease: "easeInOut",
					}}
				/>

				{/* Content Container */}
				<div className="relative z-10 space-y-8">
					{/* Header Section */}
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<div className="flex items-center gap-3 mb-4">
							<motion.div
								className="p-3 bg-white/10 backdrop-blur-md rounded-2xl"
								whileHover={{ scale: 1.05, rotate: 5 }}
								transition={{ type: "spring", stiffness: 300 }}
							>
								<FaGraduationCap className="text-3xl" />
							</motion.div>
							<div>
								<h1 className="text-4xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
									Enrollment Portal
								</h1>
								<p className="text-sm text-white/70 font-medium">SkillznCert Academy</p>
							</div>
						</div>
						<p className="text-lg text-white/90 max-w-md leading-relaxed">
							Begin your journey to become a certified network & cybersecurity professional
						</p>
					</motion.div>

					{/* Stats Cards */}
					<motion.div
						className="grid grid-cols-2 gap-4"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.2, duration: 0.5 }}
					>
						<StatCard
							icon={<FaCertificate />}
							value="100+"
							label="Certifications"
							delay={0.3}
						/>
						<StatCard
							icon={<FaUserCheck />}
							value="500+"
							label="Students"
							delay={0.4}
						/>
					</motion.div>

					{/* Features List */}
					<motion.div
						className="space-y-4"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.5, duration: 0.6 }}
					>
						<FeatureItem
							icon={<FaShieldAlt />}
							title="Secure & Confidential"
							description="Your data is encrypted and protected"
							delay={0.6}
						/>
						<FeatureItem
							icon={<FaUserCheck />}
							title="Expert Review"
							description="Carefully reviewed by our team"
							delay={0.7}
						/>
						<FeatureItem
							icon={<FaRocket />}
							title="Quick Process"
							description="Simple one-time submission"
							delay={0.8}
						/>
					</motion.div>

					{/* Trust Badge */}
					<motion.div
						className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.9, duration: 0.5 }}
						whileHover={{ scale: 1.02 }}
					>
						<div className="flex items-start gap-3">
							<div className="p-2 bg-green-500/20 rounded-lg">
								<FaCheckCircle className="text-green-400 text-xl" />
							</div>
							<div>
								<h4 className="font-semibold text-white mb-1">Trusted by Students Worldwide</h4>
								<p className="text-sm text-white/70">
									Join thousands of students who have successfully enrolled and achieved their certification goals.
								</p>
							</div>
						</div>
					</motion.div>
				</div>

				{/* Decorative Bottom Element */}
				<motion.div
					className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"
					initial={{ scaleX: 0 }}
					animate={{ scaleX: 1 }}
					transition={{ delay: 1, duration: 1 }}
				/>
			</div>

			{/* RIGHT FORM PANEL */}
			<div className="flex items-center justify-center px-6 py-8">
				<div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
					<h2 className="text-2xl font-bold text-gray-900 mb-1">
						Personal & Academic Details
					</h2>
					<p className="text-sm text-gray-500 mb-6">
						Fields marked * are required
					</p>

					<form onSubmit={submit} className="space-y-5">
						<TwoCol>
							<div>
								<Input
									name="firstName"
									placeholder="First Name *"
									value={form.firstName}
									onChange={handleChange}
									className={
										errors.firstName ? "border-red-500 focus:ring-red-500" : ""
									}
								/>
								{errors.firstName && (
									<p className="text-red-500 text-xs mt-1">
										{errors.firstName}
									</p>
								)}
							</div>
							<div>
								<Input
									name="lastName"
									placeholder="Last Name *"
									value={form.lastName}
									onChange={handleChange}
									className={
										errors.lastName ? "border-red-500 focus:ring-red-500" : ""
									}
								/>
								{errors.lastName && (
									<p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
								)}
							</div>
						</TwoCol>

						<TwoCol>
							<div>
								<Input
									name="phoneNumber"
									placeholder="Whatsapp Number *"
									value={form.phoneNumber}
									onChange={handleChange}
									maxLength={10}
									className={
										errors.phoneNumber
											? "border-red-500 focus:ring-red-500"
											: ""
									}
								/>
								{errors.phoneNumber && (
									<p className="text-red-500 text-xs mt-1">
										{errors.phoneNumber}
									</p>
								)}
							</div>
							<Input
								name="address"
								placeholder="Address *"
								value={form.address}
								onChange={handleChange}
							/>
						</TwoCol>

						<TwoCol>
						<select
							name="state"
							className={`input-field ${
								errors.state ? "border-red-500 focus:ring-red-500" : ""
							}`}
							value={form.state}
							onChange={handleChange}
						>
							<option value="">Select State *</option>
							<option value="Delhi">Delhi</option>
							<option value="Lagos">Lagos</option>
						</select>
						<select
							name="country"
							className={`input-field ${
								errors.country ? "border-red-500 focus:ring-red-500" : ""
							}`}
							value={form.country}
							onChange={handleChange}
						>
							<option value="">Select Country *</option>
							<option value="India">India</option>
							<option value="Nigeria">Nigeria</option>
						</select>
					</TwoCol>

					<TwoCol>
						<Input
								name="preferredLanguage"
								placeholder="Preferred Language"
								value={form.preferredLanguage}
								onChange={handleChange}
							/>
						<div>
							<Input
								type="number"
								name="yearOfStudy"
								placeholder="Year of Study (e.g., 2024)"
								value={form.yearOfStudy}
								onChange={handleChange}
								min="1900"
								max="2100"
								className={
									errors.yearOfStudy ? "border-red-500 focus:ring-red-500" : ""
								}
							/>
							{errors.yearOfStudy && (
								<p className="text-red-500 text-xs mt-1">{errors.yearOfStudy}</p>
							)}
						</div>
					</TwoCol>

					<TwoCol>
						<Input
							name="previousCertification"
							placeholder="Previous Certification"
							value={form.previousCertification}
							onChange={handleChange}
						/>
						<Input
							name="universityAttending"
								placeholder="University"
								value={form.universityAttending}
								onChange={handleChange}
							/>
						</TwoCol>

						<TwoCol>
							<select
								name="preferredNetwork"
								className="input-field"
								value={form.preferredNetwork}
								onChange={handleChange}
							>
								<option value="">Select Network *</option>
								<option value="Mtn">Mtn</option>
								<option value="Glo">Glo</option>
								<option value="Airtel">Airtel</option>
								<option value="mobile9">9mobile</option>
							</select>
						<div>
							<Input
								name="numberForData"
								placeholder="Number for FREE DATA *"
								value={form.numberForData}
								onChange={handleChange}
								maxLength={10}
								className={
									errors.numberForData
										? "border-red-500 focus:ring-red-500"
										: ""
								}
							/>
							{errors.numberForData && (
								<p className="text-red-500 text-xs mt-1">
									{errors.numberForData}
								</p>
							)}
						</div>
					</TwoCol>
						<div className="space-y-3">
							<div className="flex flex-col space-y-2">
								<label className="font-medium text-sm">
									Do you have a NetAcad account?
								</label>
								<div className="flex items-center space-x-5">
									<label className="flex items-center space-x-2 cursor-pointer">
										<input
											type="radio"
											name="netacad"
											checked={form.hasNetacadAccount === true}
											onChange={() => {
												setHasNetAcad(true);
												setForm((f) => ({ ...f, hasNetacadAccount: true, netacadId: "" }));
											}}
										/>
										<span>Yes</span>
									</label>
									<label className="flex items-center space-x-2 cursor-pointer">
										<input
											type="radio"
											name="netacad"
											checked={form.hasNetacadAccount === false}
											onChange={() => {
												setHasNetAcad(false);
												setForm((f) => ({ ...f, hasNetacadAccount: false, netacadId: "" }));
											}}
										/>
										<span>No</span>
									</label>
								</div>
								{form.hasNetacadAccount && (
									<Input
										name="netacadId"
										placeholder="Enter your NetAcad email or ID"
										className="mt-2"
										value={form.netacadId || ""}
										onChange={handleChange}
									/>
								)}
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
							<FileUpload label="Passport *" onSelect={setPassport} />
							<FileUpload label="School ID Card *" onSelect={setSchoolId} />
						</div>

						<Button
							disabled={isPending}
							className="w-full bg-[#51A8B1] py-5 text-base font-semibold hover:bg-teal-600"
						>
							{isPending ? "Submitting..." : "Continue to Payment"}
						</Button>
					</form>
				</div>
			</div>
		</div>
	);
}

/* ---------- UI HELPERS ---------- */

function TwoCol({ children }: { children: React.ReactNode }) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-5">{children}</div>
	);
}

function FileUpload({
	label,
	onSelect,
}: {
	label: string;
	onSelect: (file: File) => void;
}) {
	return (
		<div>
			<label className="text-sm font-medium">{label}</label>
			<div className="border-2 border-dashed rounded-xl p-5 text-center mt-2 hover:border-[#51A8B1] transition">
				<BiSolidImageAdd className="text-4xl text-gray-300 mx-auto mb-2" />
				<Input
					type="file"
					accept="image/png,image/jpeg"
					onChange={(e) => {
						if (e.target.files?.[0]) onSelect(e.target.files[0]);
					}}
				/>
				<p className="text-xs text-gray-500 mt-2">JPG/PNG • Max 1MB</p>
			</div>
		</div>
	);
}

/* ---------- BRAND PANEL COMPONENTS ---------- */

interface StatCardProps {
	icon: React.ReactNode;
	value: string;
	label: string;
	delay: number;
}

function StatCard({ icon, value, label, delay }: StatCardProps) {
	return (
		<motion.div
			className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all duration-300"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay, duration: 0.5 }}
			whileHover={{ scale: 1.05, y: -5 }}
		>
			<div className="flex items-center gap-3">
				<div className="text-2xl text-white/80">{icon}</div>
				<div>
					<motion.div
						className="text-2xl font-bold text-white"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: delay + 0.2 }}
					>
						{value}
					</motion.div>
					<div className="text-xs text-white/70 font-medium">{label}</div>
				</div>
			</div>
		</motion.div>
	);
}

interface FeatureItemProps {
	icon: React.ReactNode;
	title: string;
	description: string;
	delay: number;
}

function FeatureItem({ icon, title, description, delay }: FeatureItemProps) {
	return (
		<motion.div
			className="flex items-start gap-4 group"
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ delay, duration: 0.5 }}
		>
			<motion.div
				className="p-3 bg-white/10 backdrop-blur-sm rounded-xl group-hover:bg-white/20 transition-all duration-300"
				whileHover={{ scale: 1.1, rotate: 5 }}
				transition={{ type: "spring", stiffness: 300 }}
			>
				<div className="text-xl text-white">{icon}</div>
			</motion.div>
			<div className="flex-1">
				<h3 className="font-semibold text-white mb-1 group-hover:translate-x-1 transition-transform duration-300">
					{title}
				</h3>
				<p className="text-sm text-white/70">{description}</p>
			</div>
		</motion.div>
	);
}
