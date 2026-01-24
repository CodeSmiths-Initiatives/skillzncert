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
}

export function DashboardContent({ activeRoute, isAdmin, userId, username, email }: DashboardContentProps) {
  // Route to the appropriate section
  const renderContent = () => {
    switch (activeRoute) {
      case "overview":
        return <OverviewSection isAdmin={isAdmin} />;
      
      case "profile":
        return <ProfileSection />;
      
      case "payments":
        return <PaymentsSection userId={userId} />;
      
      case "enrollees":
        return <EnrolleesSection />;
      
      case "schedule":
        return <ScheduleSection />;
      
      case "settings":
        return <SettingsSection initialUsername={username} initialEmail={email} />;
      
      default:
        return <OverviewSection isAdmin={isAdmin} />;
    }
  };

  return <div className="animate-fadeIn">{renderContent()}</div>;
}
