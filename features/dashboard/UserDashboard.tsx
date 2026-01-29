// features/dashboard/UserDashboard.tsx
"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardContent } from "./DashboardContent";

const userSidebarItems = [
  { label: "Overview", route: "overview", iconName: "LayoutDashboard" },
  { label: "Profile", route: "profile", iconName: "User" },
  { label: "Payments", route: "payments", iconName: "CreditCard" }
];

export default function UserDashboard({ user }: { user: any }) {
  const [activeRoute, setActiveRoute] = useState("overview");

  return (
    <DashboardLayout
      sidebarItems={userSidebarItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      user={user}
    >
      <DashboardContent 
        activeRoute={activeRoute} 
        isAdmin={false} 
        userId={user.id}
        username={user.username}
        email={user.email}
        userDocumentId={user.documentId || user.id.toString()}
      />
    </DashboardLayout>
  );
}