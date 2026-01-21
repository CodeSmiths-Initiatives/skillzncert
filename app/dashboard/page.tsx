import AdminDashboard from "@/features/dashboard/AdminDashboard";
import UserDashboard from "@/features/dashboard/UserDashboard";
import { getAuthUser } from "@/lib/auth/get-auth-user";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { user } = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  // User ID = 1 is admin, all others are regular users
  const isAdmin = user.id === 1;

  return isAdmin ? <AdminDashboard user={user} /> : <UserDashboard user={user} />;
}