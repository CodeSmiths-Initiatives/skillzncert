// features/dashboard/UserDashboard.tsx
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardContent } from "./DashboardContent";

const userSidebarItems = [
  { label: "Overview", href: "/dashboard", iconName: "LayoutDashboard" },
  { label: "Profile", href: "/dashboard/profile", iconName: "User" },
  // { label: "Courses", href: "/dashboard/courses", iconName: "BookOpen" },
  { label: "Payments", href: "/dashboard/payments", iconName: "CreditCard" },
  // { label: "Support", href: "/dashboard/support", iconName: "MessageSquare" },
];

export default function UserDashboard({ user }: { user: any }) {
  return (
    <DashboardLayout sidebarItems={userSidebarItems} user={user}>
      <DashboardContent isAdmin={false} />
    </DashboardLayout>
  );
}