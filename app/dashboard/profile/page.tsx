import { redirect } from "next/navigation";

export default function ProfilePage() {
  // Redirect to main dashboard - profile is accessed via sidebar navigation
  redirect("/dashboard");
}
