"use client";

import { useState, useEffect } from "react";
import { getEnrollmentAction } from "@/actions/enrollment/get-enrollment.actions";
import { ProfileView } from "./ProfileView";
import { EnrollmentData } from "@/lib/services/enrollment.service";
import { Loader2 } from "lucide-react";

export function ProfileSection() {
  const [enrollment, setEnrollment] = useState<EnrollmentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadEnrollment();
  }, []);

  const loadEnrollment = async () => {
    setLoading(true);
    const result = await getEnrollmentAction();
    
    if (result.success && result.data) {
      setEnrollment(result.data);
      setError(null);
    } else {
      setError(result.message || "Failed to load profile");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#51A8B1] mx-auto mb-4" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error || !enrollment) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center bg-red-50 p-8 rounded-xl border border-red-200">
          <p className="text-red-600 font-semibold mb-2">Unable to load profile</p>
          <p className="text-red-500 text-sm">{error || "No enrollment found"}</p>
          <p className="text-gray-600 text-sm mt-4">
            Please complete your onboarding first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <ProfileView enrollment={enrollment} onUpdate={loadEnrollment} />
    </div>
  );
}
