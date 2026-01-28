import AdminDashboard from "@/features/dashboard/AdminDashboard";
import UserDashboard from "@/features/dashboard/UserDashboard";
import { getAuthUser } from "@/lib/auth/get-auth-user";
import { isAdmin } from "@/lib/auth/roles";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { user } = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  // Use centralized role checking utility
  // This is now the single source of truth for role determination
  const userIsAdmin = isAdmin(user);

  return userIsAdmin ? <AdminDashboard user={user} /> : <UserDashboard user={user} />;
}