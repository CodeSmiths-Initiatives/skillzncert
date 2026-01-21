// features/dashboard/DashboardContent.tsx
"use client";

import { EnrolleesSection } from "./EnrolleesSection";
import { OverviewSection } from "./OverviewSection";
import { PaymentsSection } from "./PaymentsSection";
import { ProfileSection } from "./ProfileSection";
import { SettingsSection } from "./SettingsSection";

interface DashboardContentProps {
  activeRoute: string;
  isAdmin: boolean;
}

export function DashboardContent({ activeRoute, isAdmin }: DashboardContentProps) {
  // Route to the appropriate section
  const renderContent = () => {
    switch (activeRoute) {
      case "overview":
        return <OverviewSection isAdmin={isAdmin} />;
      
      case "profile":
        return <ProfileSection />;
      
      case "payments":
        return <PaymentsSection />;
      
      case "enrollees":
        return <EnrolleesSection />;
      
      case "settings":
        return <SettingsSection />;
      
      default:
        return <OverviewSection isAdmin={isAdmin} />;
    }
  };

  return <div className="animate-fadeIn">{renderContent()}</div>;
}
