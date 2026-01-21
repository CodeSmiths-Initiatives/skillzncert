"use client";

import { ProfileView } from "@/features/dashboard/ProfileView";
import { EnrollmentData } from "@/lib/services/enrollment.service";
import { useRouter } from "next/navigation";

interface ProfileViewWrapperProps {
  enrollment: EnrollmentData;
}

export function ProfileViewWrapper({ enrollment }: ProfileViewWrapperProps) {
  const router = useRouter();

  const handleUpdate = () => {
    router.refresh();
  };

  return <ProfileView enrollment={enrollment} onUpdate={handleUpdate} />;
}
