"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BiSolidImageAdd } from "react-icons/bi";

type FormErrors = {
	firstName?: string;
	lastName?: string;
	phoneNumber?: string;
	email?: string;
	contactAddress?: string;
	country?: string;
	state?: string;
	preferredLanguage?: string;
	currentEducation?: string;
	previousCertificate?: string;
	universityAttending?: string;
};

export default function Onboarding() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		phoneNumber: "",
		email: "",
		contactAddress: "",
		country: "",
		state: "",
		preferredLanguage: "",
		currentEducation: "",
		previousCertificate: "",
		universityAttending: "",
		agree: false,
	});

	const [errors, setErrors] = useState<FormErrors>({});
	const [hasNetAcad, setHasNetAcad] = useState<boolean | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const validate = (): boolean => {
		const errors: FormErrors = {};

		const nameRegex = /^[A-Za-z\s]+$/;
		const phoneRegex = /^[0-9]{10}$/;
		const addressRegex = /^[A-Za-z0-9\s,.'#\-\/]{5,150}$/;
		const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

		// First Name
		if (!formData.firstName) errors.firstName = "First name is required";
		else if (!nameRegex.test(formData.firstName))
			errors.firstName = "Only letters are allowed";

		// Last Name
		if (!formData.lastName) {
			errors.lastName = "Last name is required";
		} else if (!nameRegex.test(formData.lastName)) {
			errors.lastName = "Last name should contain only letters and spaces.";
		}

		//Phone Number
		if (!formData.phoneNumber) {
			errors.phoneNumber = "Phone number is required.";
		} else if (!phoneRegex.test(formData.phoneNumber)) {
			errors.phoneNumber = "Phone number must be 10 digits.";
		}

		//Contact Address
		if (!formData.contactAddress) {
			errors.contactAddress = "Contact address is required.";
		} else if (!addressRegex.test(formData.contactAddress)) {
			errors.contactAddress = "Address is invalid.";
		} else if (formData.contactAddress.length > 100) {
			errors.contactAddress = "Address must not exceed 100 characters.";
		}

		//State
		if (!formData.state) {
			errors.state = "State is required.";
		}

		//Country
		if (!formData.country) {
			errors.country = "Country is required.";
		}

		// Email validation
		if (!formData.email) {
			errors.email = "Email is required";
		} else if (!emailRegex.test(formData.email)) {
			errors.email = "Email address is invalid.";
		}

		//Preferred Language
		if (!formData.preferredLanguage) {
			errors.preferredLanguage = "Preferred language is required.";
		} else if (!nameRegex.test(formData.preferredLanguage)) {
			errors.preferredLanguage =
				"Preferred language should contain only letters and spaces.";
		}

		//Current Educational level
		if (!formData.currentEducation) {
			errors.currentEducation = "Current educational level is required.";
		} else if (!nameRegex.test(formData.currentEducation)) {
			errors.currentEducation =
				"Current educational level should contain only letters and spaces.";
		}
		//Previous Certificate
		if (!formData.previousCertificate) {
			errors.previousCertificate = "Previous Certificate is required.";
		} else if (!nameRegex.test(formData.previousCertificate)) {
			errors.previousCertificate =
				"previousCertificate should contain only letters and spaces.";
		}
		//University Attending
		if (!formData.universityAttending) {
			errors.universityAttending = "University Attending is required.";
		} else if (!nameRegex.test(formData.universityAttending)) {
			errors.universityAttending =
				"University Attending should contain only letters and spaces.";
		}

		setErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!validate()) {
			return;
		}

		console.log("Onboarding values:", formData);
		router.push("/payment");
	};
	return (
		<div className="w-full max-w-3xl mx-auto my-20">
			<div className="rounded-md shadow-md p-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold text-[#51A8B1]">Logo</h1>
					<h3 className="text-xl font-semibold py-1">Welcome Back!</h3>
				</div>
				<div className="my-3">
					<h3 className="text-3xl font-semibold">Enrollment form</h3>
				</div>
				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-2 gap-10">
						<div className="flex flex-col space-y-2">
							<label>First Name</label>
							<Input
								type="text"
								name="firstName"
								value={formData.firstName}
								className="input-field"
								placeholder="Enter your First Name"
								onChange={handleChange}
								maxLength={15}
							/>
							{errors.firstName && (
								<span className="error-message">{errors.firstName}</span>
							)}
						</div>
						<div className="flex flex-col space-y-2">
							<label>Last Name</label>
							<Input
								type="text"
								name="lastName"
								value={formData.lastName}
								className="input-field"
								placeholder="Last Name"
								onChange={handleChange}
								maxLength={15}
							/>
							{errors.lastName && (
								<span className="error-message">{errors.lastName}</span>
							)}
						</div>
					</div>
					<div className="grid grid-cols-2 gap-10">
						<div className="flex flex-col space-y-2 ">
							<label>Phone Number</label>
							<Input
								type="text"
								name="phoneNumber"
								value={formData.phoneNumber}
								placeholder="phone number"
								className="input-field"
								onChange={handleChange}
								maxLength={10}
							/>
							{errors.phoneNumber && (
								<span className="error-message">{errors.phoneNumber}</span>
							)}
						</div>
						<div className="flex flex-col space-y-2 ">
							<label>Contact Address</label>
							<Input
								type="text"
								name="contactAddress"
								value={formData.contactAddress}
								placeholder="Address"
								className="input-field"
								onChange={handleChange}
								maxLength={100}
							/>
							{errors.contactAddress && (
								<span className="error-message">{errors.contactAddress}</span>
							)}
						</div>
					</div>
					<div className="grid grid-cols-2 gap-10">
						<div className="flex flex-col space-y-2 ">
							<label>State</label>
							<select
								name="state"
								className="input-field"
								value={formData.state}
								onChange={handleSelectChange}
							>
								<option value="">Select state</option>
								<option value="Lagos">Lagos</option>
								<option value="Abuja">Abuja</option>
								<option value="Oyo">Oyo</option>
							</select>
							{errors.state && (
								<span className="error-message">{errors.state}</span>
							)}
						</div>
						<div className="flex flex-col space-y-2 ">
							<label>Country</label>
							<select
								name="country"
								className="input-field"
								value={formData.country}
								onChange={handleSelectChange}
							>
								<option value="">Select country</option>
								<option value="Nigeria">Nigeria</option>
								<option value="Ghana">Ghana</option>
							</select>
							{errors.country && (
								<span className="error-message">{errors.country}</span>
							)}
						</div>
					</div>
					<div className="grid grid-cols-2 gap-10">
						<div className="flex flex-col space-y-2">
							<label>Preferred Language</label>
							<Input
								type="text"
								name="preferredLanguage"
								value={formData.preferredLanguage}
								className="input-field"
								placeholder="Preferred language"
								onChange={handleChange}
								maxLength={15}
							/>
							{errors.preferredLanguage && (
								<span className="error-message">
									{errors.preferredLanguage}
								</span>
							)}
						</div>
						<div className="flex flex-col space-y-2 ">
							<label>Current Educational level</label>
							<Input
								type="text"
								name="currentEducation"
								value={formData.currentEducation}
								placeholder="Current educational level"
								className="input-field"
								onChange={handleChange}
								maxLength={15}
							/>
							{errors.currentEducation && (
								<span className="error-message">{errors.currentEducation}</span>
							)}
						</div>
					</div>
					<div className="grid grid-cols-2 gap-10">
						<div className="flex flex-col space-y-2 ">
							<label>Previous Certification</label>
							<Input
								type="text"
								name="previousCertificate"
								placeholder="Previous certification"
								className="input-field"
								onChange={handleChange}
								maxLength={15}
							/>
							{errors.previousCertificate && (
								<span className="error-message">
									{errors.previousCertificate}
								</span>
							)}
						</div>

						<div className="flex flex-col space-y-2 ">
							<label>University Attending</label>
							<Input
								type="text"
								name="universityAttending"
								value={formData.universityAttending}
								placeholder="Institution"
								className="input-field"
								onChange={handleChange}
								maxLength={30}
							/>
							{errors.universityAttending && (
								<span className="error-message">
									{errors.universityAttending}
								</span>
							)}
						</div>
					</div>

					<div className="gap-10">
						<div className="flex flex-col space-y-2">
							<label>Do you have a NetAcad account?</label>

							<div className="flex items-center space-x-5">
								<label className="flex items-center space-x-2 cursor-pointer">
									<input
										type="radio"
										name="netacad"
										onChange={() => setHasNetAcad(true)}
									/>
									<span>Yes</span>
								</label>

								<label className="flex items-center space-x-2 cursor-pointer">
									<input
										type="radio"
										name="netacad"
										onChange={() => setHasNetAcad(false)}
									/>
									<span>No</span>
								</label>
							</div>

							{hasNetAcad && (
								<input
									type="text"
									placeholder="Enter your NetAcad email"
									className="input-field"
									name="email"
									value={formData.email}
									onChange={handleChange}
									maxLength={30}
									autoComplete="email"
								/>
							)}
							{errors.email && (
								<span className="error-message">{errors.email}</span>
							)}
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
								className="mx-auto w-3/4 md:w-fit mb-10"
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
								className="mx-auto w-3/4 md:w-fit mb-10"
							/>
							<p className="text-gray-600 text-sm">
								Image Size: Less than 50kb
							</p>
							<p className="text-gray-500 text-xs">
								Image type: JPEG,GIF OR PNG only
							</p>
						</div>
					</div>

					<Button className="mt-4 bg-[#51A8B1] text-white text-base font-semibold hover:border-2 hover:border-[#51A8B1] hover:bg-teal-600 hover:text-white py-2 rounded-md">
						Next
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
