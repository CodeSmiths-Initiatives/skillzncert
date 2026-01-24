"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/toast/ToastContext";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { BiSolidImageAdd } from "react-icons/bi";
import { submitEnrollmentAction } from "@/actions/enrollment/create-enrollment.actions";

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
		}
	};

	const validateForm = (): boolean => {
		const firstNameError = validateName(form.firstName, "First name");
		const lastNameError = validateName(form.lastName, "Last name");
		const phoneError = validatePhoneNumber(form.phoneNumber);
		const numberForDataError = validatePhoneNumber(form.numberForData);
		const yearError = validateYearOfStudy(form.yearOfStudy);

		setErrors({
			firstName: firstNameError,
			lastName: lastNameError,
			phoneNumber: phoneError,
			numberForData: numberForDataError,
			yearOfStudy: yearError,
		});

		// Check required fields
		if (
			!form.firstName ||
			!form.lastName ||
			!form.phoneNumber ||
			!form.address ||
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
		if (firstNameError || lastNameError || phoneError || numberForDataError || yearError) {
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
			{/* LEFT BRAND PANEL */}
			<div className="hidden lg:flex flex-col justify-center px-12 bg-gradient-to-br from-[#51A8B1] to-[#3b8f97] text-white">
				<h1 className="text-3xl font-bold mb-3">Enrollment Application</h1>
				<p className="text-base text-white/90 max-w-md">
					Complete your enrollment to begin your certification journey.
				</p>

				<div className="mt-8 space-y-3 text-sm text-white/80">
					<p>✔ Secure & confidential</p>
					<p>✔ Reviewed by our team</p>
					<p>✔ One-time submission</p>
				</div>
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
								className="input-field"
								value={form.state}
								onChange={handleChange}
							>
								<option value="">Select State</option>
								<option value="Delhi">Delhi</option>
								<option value="Lagos">Lagos</option>
							</select>
							<select
								name="country"
								className="input-field"
								value={form.country}
								onChange={handleChange}
							>
								<option value="">Select Country </option>
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
