// features/dashboard/AdminDashboard.tsx
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardContent } from "./DashboardContent";

const adminSidebarItems = [
  { label: "Overview", href: "/dashboard", iconName: "LayoutDashboard" },
  { label: "Enrollees", href: "/dashboard/enrollees", iconName: "Users" },
  // { label: "Analytics", href: "/dashboard/analytics", iconName: "BarChart3" },
  // { label: "Content", href: "/dashboard/content", iconName: "FileText" },
  // { label: "Security", href: "/dashboard/security", iconName: "Shield" },
  { label: "Settings", href: "/dashboard/settings", iconName: "Settings" },
];

export default function AdminDashboard({ user }: { user: any }) {
  return (
    <DashboardLayout sidebarItems={adminSidebarItems} user={user}>
      <DashboardContent isAdmin={true} />
    </DashboardLayout>
  );
}