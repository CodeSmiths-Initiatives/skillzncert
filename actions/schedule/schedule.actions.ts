"use server";

import { getAuthUser } from "@/lib/auth/get-auth-user";
import {
  getWeeklySchedule,
  createWeeklySchedule,
  updateWeeklySchedule,
} from "@/lib/services/schedule.service";
import type { DaySchedule } from "@/lib/types/schedule.types";
import { revalidatePath } from "next/cache";

/**
 * Get global weekly schedule (same for all users)
 */
export async function getScheduleAction() {
  const { user, token } = await getAuthUser();

  if (!user || !token) {
    return {
      success: false,
      message: "Unauthorized. Please log in again.",
      data: null,
    };
  }

  try {
    const schedule = await getWeeklySchedule(token);
    
    return {
      success: true,
      data: schedule,
    };
  } catch (error) {
    console.error("Get schedule error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to get schedule",
      data: null,
    };
  }
}

/**
 * Save or update global weekly schedule (applies to all users)
 */
export async function saveScheduleAction(schedule: DaySchedule[]) {
  const { user, token } = await getAuthUser();

  if (!user || !token) {
    return {
      success: false,
      message: "Unauthorized. Please log in again.",
    };
  }

  try {
    // Check if global schedule already exists
    const existingSchedule = await getWeeklySchedule(token);
    
    let result;
    if (existingSchedule) {
      // Update existing schedule
      result = await updateWeeklySchedule(
        existingSchedule.documentId!,
        schedule,
        token
      );
    } else {
      // Create new schedule
      result = await createWeeklySchedule(schedule, token);
    }

    // Revalidate settings page
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Schedule updated successfully",
      data: result,
    };
  } catch (error) {
    console.error("Save schedule error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to save schedule",
    };
  }
}
