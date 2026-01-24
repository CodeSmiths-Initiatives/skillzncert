"use client";

import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface ProfileSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ProfileSection({
  title,
  icon,
  children,
  className = "",
}: ProfileSectionProps) {
  return (
    <Card className={`p-6 bg-white shadow-sm border-gray-100 ${className}`}>
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        {icon && <div className="text-[#51A8B1]">{icon}</div>}
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>
      {children}
    </Card>
  );
}

interface ProfileFieldProps {
  label: string;
  value: string | boolean;
  isEditing?: boolean;
  name?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  type?: string;
  options?: { value: string; label: string }[];
  error?: string;
}

export function ProfileField({
  label,
  value,
  isEditing = false,
  name,
  onChange,
  type = "text",
  options,
  error,
}: ProfileFieldProps) {
  if (isEditing) {
    if (options) {
      return (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          <select
            name={name}
            value={String(value)}
            onChange={onChange}
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-[#51A8B1] focus:border-transparent"
            }`}
          >
            <option value="">Select {label}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <input
          type={type}
          name={name}
          value={String(value)}
          onChange={onChange}
          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-200 focus:ring-[#51A8B1] focus:border-transparent"
          }`}
          placeholder={label}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-500">{label}</label>
      <p className="text-base text-gray-900 font-medium">
        {typeof value === "boolean"
          ? value
            ? "Yes"
            : "No"
          : value || "Not provided"}
      </p>
    </div>
  );
}

interface ProfileImageUploadProps {
  label: string;
  currentImage?: { url: string; name: string };
  onSelect: (file: File) => void;
  isEditing: boolean;
}

export function ProfileImageUpload({
  label,
  currentImage,
  onSelect,
  isEditing,
}: ProfileImageUploadProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">{label}</label>

      {currentImage && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <img
            src={currentImage.url}
            alt={label}
            className="w-16 h-16 object-cover rounded-lg border-2 border-[#51A8B1]"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {currentImage.name}
            </p>
            <p className="text-xs text-gray-500">Current image</p>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 hover:border-[#51A8B1] transition-colors">
          <input
            type="file"
            accept="image/png,image/jpeg"
            onChange={(e) => {
              if (e.target.files?.[0]) onSelect(e.target.files[0]);
            }}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#51A8B1] file:text-white hover:file:bg-[#3b8f97] file:cursor-pointer"
          />
          <p className="text-xs text-gray-500 mt-2">
            Upload new image (JPG/PNG, max 1MB)
          </p>
        </div>
      )}
    </div>
  );
}

interface TwoColumnGridProps {
  children: ReactNode;
}

export function TwoColumnGrid({ children }: TwoColumnGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
  );
}
