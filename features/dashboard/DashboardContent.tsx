// features/dashboard/DashboardContent.tsx
"use client";

import { EnrolleesSection } from "./EnrolleesSection";
import { OverviewSection } from "./OverviewSection";
import { PaymentsSection } from "./PaymentsSection";
import { ProfileSection } from "./ProfileSection";
import { ScheduleSection } from "./ScheduleSection";
import { SettingsSection } from "./SettingsSection";

interface DashboardContentProps {
  activeRoute: string;
  isAdmin: boolean;
  userId: number;
  username?: string;
  email?: string;
  userDocumentId?: string;
}

export function DashboardContent({ activeRoute, isAdmin, userId, username, email, userDocumentId }: DashboardContentProps) {
  // Route to the appropriate section
  const renderContent = () => {
    switch (activeRoute) {
      case "overview":
        return <OverviewSection isAdmin={isAdmin} userDocumentId={userDocumentId} userId={userId} />;
      
      case "profile":
        return <ProfileSection />;
      
      case "payments":
        return <PaymentsSection userId={userId} userEmail={email || ""} />;
      
      case "enrollees":
        return <EnrolleesSection />;
      
      case "schedule":
        return <ScheduleSection />;
      
      case "settings":
        return <SettingsSection initialUsername={username} initialEmail={email} />;
      
      default:
        return <OverviewSection isAdmin={isAdmin} userDocumentId={userDocumentId} userId={userId} />;
    }
  };

  return <div className="animate-fadeIn">{renderContent()}</div>;
}
