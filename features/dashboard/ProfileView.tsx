"use client";

import { useState, useTransition } from "react";
import { EnrollmentData } from "@/lib/services/enrollment.service";
import { updateEnrollmentAction } from "@/actions/enrollment/update-enrollment.actions";
import { useToast } from "@/components/toast/ToastContext";
import { Button } from "@/components/ui/button";
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
  { value: "Delhi", label: "Delhi" },
  { value: "Lagos", label: "Lagos" },
  { value: "Maharashtra", label: "Maharashtra" },
  { value: "Karnataka", label: "Karnataka" },
];

const COUNTRIES = [
  { value: "India", label: "India" },
  { value: "Nigeria", label: "Nigeria" },
  { value: "USA", label: "USA" },
  { value: "UK", label: "UK" },
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
    currentEducationLevel: enrollment.currentEducationLevel,
    previousCertification: enrollment.previousCertification,
    universityAttending: enrollment.universityAttending,
    hasNetacadAccount: enrollment.hasNetacadAccount,
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
      currentEducationLevel: enrollment.currentEducationLevel,
      previousCertification: enrollment.previousCertification,
      universityAttending: enrollment.universityAttending,
      hasNetacadAccount: enrollment.hasNetacadAccount,
    });
    setPassport(null);
    setSchoolId(null);
    setIsEditing(false);
  };

  const handleSave = () => {
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
      <div className="flex items-center justify-between bg-blue-500 text-white rounded-xl p-6 shadow-lg">
        <div>
          <h1 className="text-3xl font-bold mb-1">My Profile</h1>
          <p className="text-white/90">
            View and manage your enrollment information
          </p>
        </div>
        <div className="flex gap-3">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-white text-blue-500 hover:bg-gray-100 font-semibold"
            >
              <FiEdit2 className="mr-2" /> Edit Profile
            </Button>
          ) : (
            <>
              <Button
                onClick={handleCancel}
                disabled={isPending}
                className="bg-white/20 hover:bg-white/30 text-white font-semibold"
              >
                <FiX className="mr-2" /> Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isPending}
                className="bg-white text-[#51A8B1] hover:bg-gray-100 font-semibold"
              >
                <FiSave className="mr-2" />{" "}
                {isPending ? "Saving..." : "Save Changes"}
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
          />
          <ProfileField
            label="Last Name"
            value={formData.lastName}
            isEditing={isEditing}
            name="lastName"
            onChange={handleChange}
          />
          <ProfileField
            label="Phone Number"
            value={formData.phoneNumber}
            isEditing={isEditing}
            name="phoneNumber"
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
            label="Current Education Level"
            value={formData.currentEducationLevel}
            isEditing={isEditing}
            name="currentEducationLevel"
            onChange={handleChange}
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
