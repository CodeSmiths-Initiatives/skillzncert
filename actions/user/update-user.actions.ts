"use server";

import { getAuthUser } from "@/lib/auth/get-auth-user";
import { updateUserProfile } from "@/lib/services/user.service";
import { validateEmail, validateUsername } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updateUserAction(data: {
  username: string;
  email: string;
}) {
  // Get authenticated user
  const { user, token } = await getAuthUser();

  if (!user || !token) {
    return {
      success: false,
      message: "Unauthorized. Please log in again.",
    };
  }

  // Validate username
  const usernameError = validateUsername(data.username);
  if (usernameError) {
    return {
      success: false,
      message: usernameError,
    };
  }

  // Validate email
  const emailError = validateEmail(data.email);
  if (emailError) {
    return {
      success: false,
      message: emailError,
    };
  }

  try {
    // Update user profile
    const updatedUser = await updateUserProfile(
      user.id,
      {
        username: data.username,
        email: data.email,
      },
      token
    );

    // Update the auth_user cookie with new data
    const cookieStore = cookies();
    (await cookieStore).set({
      name: "auth_user",
      value: JSON.stringify({
        documentId: updatedUser.documentId,
        username: updatedUser.username,
        id: updatedUser.id,
        email: updatedUser.email,
      }),
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    // Revalidate the dashboard to show updated data
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    };
  } catch (error) {
    console.error("Update user error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}
