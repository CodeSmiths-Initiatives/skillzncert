"use client";

import { useState, useTransition } from "react";
import { EnrollmentData } from "@/lib/services/enrollment.service";
import { updateEnrollmentAction } from "@/actions/enrollment/update-enrollment.actions";
import { useToast } from "@/components/toast/ToastContext";
import { Button } from "@/components/ui/button";
import { validateName, validatePhoneNumber } from "@/lib/utils";
import {
  ProfileSection,
  ProfileField,
  TwoColumnGrid,
  ProfileImageUpload,
} from "@/components/profile/ProfileComponents";
import {
  FiUser,
  FiMapPin,
  FiBook,
  FiImage,
  FiEdit2,
  FiX,
  FiSave,
  FiCheckCircle,
} from "react-icons/fi";

interface ProfileViewProps {
  enrollment: EnrollmentData;
  onUpdate: () => void;
}

const STATES = [
  { value: "Abia", label: "Abia" },
  { value: "Adamawa", label: "Adamawa" },
  { value: "Akwa Ibom", label: "Akwa Ibom" },
  { value: "Anambra", label: "Anambra" },
  { value: "Bauchi", label: "Bauchi" },
  { value: "Bayelsa", label: "Bayelsa" },
  { value: "Benue", label: "Benue" },
  { value: "Borno", label: "Borno" },
  { value: "Cross River", label: "Cross River" },
  { value: "Delta", label: "Delta" },
  { value: "Ebonyi", label: "Ebonyi" },
  { value: "Edo", label: "Edo" },
  { value: "Ekiti", label: "Ekiti" },
  { value: "Enugu", label: "Enugu" },
  { value: "FCT", label: "Federal Capital Territory" },
  { value: "Gombe", label: "Gombe" },
  { value: "Imo", label: "Imo" },
  { value: "Jigawa", label: "Jigawa" },
  { value: "Kaduna", label: "Kaduna" },
  { value: "Kano", label: "Kano" },
  { value: "Katsina", label: "Katsina" },
  { value: "Kebbi", label: "Kebbi" },
  { value: "Kogi", label: "Kogi" },
  { value: "Kwara", label: "Kwara" },
  { value: "Lagos", label: "Lagos" },
  { value: "Nasarawa", label: "Nasarawa" },
  { value: "Niger", label: "Niger" },
  { value: "Ogun", label: "Ogun" },
  { value: "Ondo", label: "Ondo" },
  { value: "Osun", label: "Osun" },
  { value: "Oyo", label: "Oyo" },
  { value: "Plateau", label: "Plateau" },
  { value: "Rivers", label: "Rivers" },
  { value: "Sokoto", label: "Sokoto" },
  { value: "Taraba", label: "Taraba" },
  { value: "Yobe", label: "Yobe" },
  { value: "Zamfara", label: "Zamfara" },
];

const COUNTRIES = [ 
  { value: "Nigeria", label: "Nigeria" }
];

const NETWORKS = [
  { value: "Mtn", label: "Mtn" },
  { value: "Glo", label: "Glo" },
  { value: "Airtel", label: "Airtel" },
  { value: "mobile9", label: "9mobile" },
];

export function ProfileView({ enrollment, onUpdate }: ProfileViewProps) {
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(false);

  const [passport, setPassport] = useState<File | null>(null);
  const [schoolId, setSchoolId] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    firstName: enrollment.firstName,
    lastName: enrollment.lastName,
    phoneNumber: enrollment.phoneNumber,
    address: enrollment.address,
    state: enrollment.state,
    country: enrollment.country,
    preferredLanguage: enrollment.preferredLanguage,
    yearOfStudy: enrollment.yearOfStudy,
    previousCertification: enrollment.previousCertification,
    universityAttending: enrollment.universityAttending,
    hasNetacadAccount: enrollment.hasNetacadAccount,
    netacadId: enrollment.netacadId || "",
    preferredNetwork: enrollment.preferredNetwork,
    numberForData: enrollment.numberForData,
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));

    // Real-time validation
    if (name === "firstName") {
      setErrors((prev) => ({ ...prev, firstName: validateName(value, "First name") }));
    } else if (name === "lastName") {
      setErrors((prev) => ({ ...prev, lastName: validateName(value, "Last name") }));
    } else if (name === "phoneNumber") {
      setErrors((prev) => ({ ...prev, phoneNumber: validatePhoneNumber(value) }));
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: enrollment.firstName,
      lastName: enrollment.lastName,
      phoneNumber: enrollment.phoneNumber,
      address: enrollment.address,
      state: enrollment.state,
      country: enrollment.country,
      preferredLanguage: enrollment.preferredLanguage,
      yearOfStudy: enrollment.yearOfStudy,
      previousCertification: enrollment.previousCertification,
      universityAttending: enrollment.universityAttending,
      hasNetacadAccount: enrollment.hasNetacadAccount,
      netacadId: enrollment.netacadId || "",
      preferredNetwork: enrollment.preferredNetwork,
      numberForData: enrollment.numberForData,
    });
    setErrors({
      firstName: "",
      lastName: "",
      phoneNumber: "",
    });
    setPassport(null);
    setSchoolId(null);
    setIsEditing(false);
  };

  const validateForm = (): boolean => {
    const firstNameError = validateName(formData.firstName, "First name");
    const lastNameError = validateName(formData.lastName, "Last name");
    const phoneError = validatePhoneNumber(formData.phoneNumber);

    setErrors({
      firstName: firstNameError,
      lastName: lastNameError,
      phoneNumber: phoneError,
    });

    // Check validation errors
    if (firstNameError || lastNameError || phoneError) {
      showToast({
        type: "error",
        title: "Validation failed",
        description: "Please fix the errors in the form before saving.",
      });
      return false;
    }

    return true;
  };

  const handleSave = () => {
    // Validate form
    if (!validateForm()) {
      return;
    }

    // Validate file sizes (1MB max)
    const maxSize = 1 * 1024 * 1024; // 1MB in bytes
    
    if (passport && passport.size > maxSize) {
      showToast({
        type: "error",
        title: "File too large",
        description: "Passport image must be less than 1MB.",
      });
      return;
    }

    if (schoolId && schoolId.size > maxSize) {
      showToast({
        type: "error",
        title: "File too large",
        description: "School ID image must be less than 1MB.",
      });
      return;
    }

    startTransition(async () => {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        data.append(`data[${key}]`, String(value));
      });

      if (passport) data.append("files.passport", passport);
      if (schoolId) data.append("files.schoolIdCard", schoolId);

      const result = await updateEnrollmentAction(enrollment.documentId, data);

      if (result.success) {
        showToast({
          type: "success",
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
        setIsEditing(false);
        onUpdate();
      } else {
        showToast({
          type: "error",
          title: "Update Failed",
          description: result.message || "Failed to update profile.",
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header with Edit Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-blue-500 text-white rounded-xl p-4 md:p-6 shadow-lg">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">My Profile</h1>
          <p className="text-white/90 text-sm md:text-base">
            View and manage your enrollment information
          </p>
        </div>
        <div className="flex gap-2 md:gap-3 flex-shrink-0">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-white text-blue-500 hover:bg-gray-100 font-semibold text-sm md:text-base px-3 md:px-4 py-2 whitespace-nowrap"
              suppressHydrationWarning
            >
              <FiEdit2 className="md:mr-2" size={16} /> 
              <span className="hidden sm:inline">Edit Profile</span>
              <span className="sm:hidden">Edit</span>
            </Button>
          ) : (
            <>
              <Button
                onClick={handleCancel}
                disabled={isPending}
                className="bg-white/20 hover:bg-white/30 text-white font-semibold text-sm md:text-base px-3 md:px-4 py-2 whitespace-nowrap"
                suppressHydrationWarning
              >
                <FiX className="md:mr-2" size={16} /> 
                <span className="hidden sm:inline">Cancel</span>
              </Button>
              <Button
                onClick={handleSave}
                disabled={isPending}
                className="bg-white text-[#51A8B1] hover:bg-gray-100 font-semibold text-sm md:text-base px-3 md:px-4 py-2 whitespace-nowrap"
                suppressHydrationWarning
              >
                <FiSave className="md:mr-2" size={16} />{" "}
                <span className="hidden sm:inline">{isPending ? "Saving..." : "Save Changes"}</span>
                <span className="sm:hidden">{isPending ? "..." : "Save"}</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Payment Status Badge */}
      {enrollment.isPaymentDone && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <FiCheckCircle className="text-green-600 text-2xl" />
          <div>
            <p className="text-green-900 font-semibold">Payment Completed</p>
            <p className="text-green-700 text-sm">
              Your enrollment is fully active
            </p>
          </div>
        </div>
      )}

      {/* Personal Information */}
      <ProfileSection title="Personal Information" icon={<FiUser size={24} />}>
        <TwoColumnGrid>
          <ProfileField
            label="First Name"
            value={formData.firstName}
            isEditing={isEditing}
            name="firstName"
            onChange={handleChange}
            error={isEditing ? errors.firstName : undefined}
          />
          <ProfileField
            label="Last Name"
            value={formData.lastName}
            isEditing={isEditing}
            name="lastName"
            onChange={handleChange}
            error={isEditing ? errors.lastName : undefined}
          />
          <ProfileField
            label="Phone Number"
            value={formData.phoneNumber}
            isEditing={isEditing}
            name="phoneNumber"
            onChange={handleChange}
            type="tel"
            error={isEditing ? errors.phoneNumber : undefined}
          />
          <ProfileField
            label="Number for FREE DATA"
            value={formData.numberForData}
            isEditing={isEditing}
            name="numberForData"
            onChange={handleChange}
            type="tel"
          />
          <ProfileField
            label="Preferred Language"
            value={formData.preferredLanguage}
            isEditing={isEditing}
            name="preferredLanguage"
            onChange={handleChange}
          />
        </TwoColumnGrid>
      </ProfileSection>

      {/* Address Information */}
      <ProfileSection title="Address Information" icon={<FiMapPin size={24} />}>
        <div className="space-y-6">
          <ProfileField
            label="Address"
            value={formData.address}
            isEditing={isEditing}
            name="address"
            onChange={handleChange}
          />
          <TwoColumnGrid>
            <ProfileField
              label="State"
              value={formData.state}
              isEditing={isEditing}
              name="state"
              onChange={handleChange}
              options={STATES}
            />
            <ProfileField
              label="Country"
              value={formData.country}
              isEditing={isEditing}
              name="country"
              onChange={handleChange}
              options={COUNTRIES}
            />
          </TwoColumnGrid>
        </div>
      </ProfileSection>

      {/* Academic Information */}
      <ProfileSection
        title="Academic Information"
        icon={<FiBook size={24} />}
      >
        <TwoColumnGrid>
          <ProfileField
            label="Year of Study"
            value={formData.yearOfStudy}
            isEditing={isEditing}
            name="yearOfStudy"
            onChange={handleChange}
            type="number"
          />
          <ProfileField
            label="University Attending"
            value={formData.universityAttending}
            isEditing={isEditing}
            name="universityAttending"
            onChange={handleChange}
          />
          <ProfileField
            label="Previous Certification"
            value={formData.previousCertification}
            isEditing={isEditing}
            name="previousCertification"
            onChange={handleChange}
          />
          <ProfileField
            label="Preferred Network"
            value={formData.preferredNetwork}
            isEditing={isEditing}
            name="preferredNetwork"
            onChange={handleChange}
            options={NETWORKS}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500">
              NetAcad Account
            </label>
            {isEditing ? (
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="hasNetacadAccount"
                  checked={formData.hasNetacadAccount}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#51A8B1] rounded focus:ring-2 focus:ring-[#51A8B1]"
                />
                <span className="text-base text-gray-900">
                  I have a NetAcad account
                </span>
              </label>
            ) : (
              <p className="text-base text-gray-900 font-medium">
                {formData.hasNetacadAccount ? "Yes" : "No"}
              </p>
            )}
          </div>
          {formData.hasNetacadAccount && (
            <ProfileField
              label="NetAcad ID/Email"
              value={formData.netacadId}
              isEditing={isEditing}
              name="netacadId"
              onChange={handleChange}
            />
          )}
        </TwoColumnGrid>
      </ProfileSection>

      {/* Documents */}
      <ProfileSection title="Documents" icon={<FiImage size={24} />}>
        <TwoColumnGrid>
          <ProfileImageUpload
            label="Passport Photo"
            currentImage={enrollment.passport}
            onSelect={setPassport}
            isEditing={isEditing}
          />
          <ProfileImageUpload
            label="School ID Card"
            currentImage={enrollment.schoolIdCard}
            onSelect={setSchoolId}
            isEditing={isEditing}
          />
        </TwoColumnGrid>
      </ProfileSection>

      {/* Metadata */}
      <div className="bg-gray-50 rounded-xl p-6 text-sm text-gray-600">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="font-medium">Enrollment Created:</span>{" "}
            {new Date(enrollment.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <div>
            <span className="font-medium">Last Updated:</span>{" "}
            {new Date(enrollment.updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
