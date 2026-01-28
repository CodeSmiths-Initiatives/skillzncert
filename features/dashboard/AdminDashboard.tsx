// features/dashboard/AdminDashboard.tsx
"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardContent } from "./DashboardContent";

const adminSidebarItems = [
  { label: "Overview", route: "overview", iconName: "LayoutDashboard" },
  { label: "Enrollees", route: "enrollees", iconName: "Users" },
  // { label: "Payments", route: "payments", iconName: "CreditCard" },
  { label: "Schedule", route: "schedule", iconName: "Calendar" },
  { label: "Settings", route: "settings", iconName: "Settings" },
];

export default function AdminDashboard({ user }: { user: any }) {
  const [activeRoute, setActiveRoute] = useState("overview");

  return (
    <DashboardLayout
      sidebarItems={adminSidebarItems}
      activeRoute={activeRoute}
      onNavigate={setActiveRoute}
      user={user}
    >
      <DashboardContent 
        activeRoute={activeRoute} 
        isAdmin={true} 
        userId={user.id}
        username={user.username}
        email={user.email}
      />
    </DashboardLayout>
  );
}