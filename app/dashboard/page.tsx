// app/dashboard/page.tsx
import AdminDashboard from "@/features/dashboard/AdminDashboard";
import UserDashboard from "@/features/dashboard/UserDashboard";
import { cookies } from "next/headers";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token")?.value;
  const userCookie = cookieStore.get("auth_user")?.value;

  // if (!authToken || !userCookie) {
  //   redirect("/login");
  // }

  let user = {id: 21, username: "Nitesh"}; // Default to admin for testing
  // try {
  //   //user = JSON.parse(decodeURIComponent(userCookie));
  // } catch {
  //   redirect("/login");
  // }

  // For better security, fetch full user with role from Strapi
  // const fullUser = await fetchUserWithRole(user.id, authToken);
  // const isAdmin = fullUser.role?.name === 'admin' || user.id === 1;

  // Fallback to ID check as per your requirement
  const isAdmin = user.id === 1;

  return isAdmin ? <AdminDashboard user={user} /> : <UserDashboard user={user} />;
}