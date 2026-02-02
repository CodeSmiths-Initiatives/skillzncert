"use server";

import { getAuthUser } from "@/lib/auth/get-auth-user";
import {
  getBatchSchedule,
  getAllBatchSchedules,
  createBatchSchedule,
  updateBatchSchedule,
} from "@/lib/services/schedule.service";
import type { DaySchedule, BatchType } from "@/lib/types/schedule.types";
import { revalidatePath } from "next/cache";
import { logScheduleChange } from "@/actions/audit/audit.actions";
import { BATCH_LABELS } from "@/lib/types/schedule.types";

/**
 * Get all batch schedules (morning, noon, evening)
 */
export async function getAllSchedulesAction() {
  const { user, token } = await getAuthUser();

  if (!user || !token) {
    return {
      success: false,
      message: "Unauthorized. Please log in again.",
      data: null,
    };
  }

  try {
    const schedules = await getAllBatchSchedules(token);
    
    // Convert Map to Object for serialization
    const schedulesObj: Record<string, any> = {};
    schedules.forEach((schedule, batchName) => {
      schedulesObj[batchName] = schedule;
    });

    return {
      success: true,
      data: schedulesObj,
    };
  } catch (error) {
    console.error("Get all schedules error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to get schedules",
      data: null,
    };
  }
}

/**
 * Get schedule for a specific batch
 */
export async function getBatchScheduleAction(batchName: BatchType) {
  const { user, token } = await getAuthUser();

  if (!user || !token) {
    return {
      success: false,
      message: "Unauthorized. Please log in again.",
      data: null,
    };
  }

  try {
    const schedule = await getBatchSchedule(batchName, token);
    
    return {
      success: true,
      data: schedule,
    };
  } catch (error) {
    console.error(`Get ${batchName} schedule error:`, error);
    return {
      success: false,
      message: error instanceof Error ? error.message : `Failed to get ${batchName} schedule`,
      data: null,
    };
  }
}

/**
 * Save or update batch schedule
 */
export async function saveBatchScheduleAction(
  batchName: BatchType,
  schedule: DaySchedule[]
) {
  const { user, token } = await getAuthUser();

  if (!user || !token) {
    return {
      success: false,
      message: "Unauthorized. Please log in again.",
    };
  }

  try {
    // Check if batch schedule already exists
    const existingSchedule = await getBatchSchedule(batchName, token);
    
    let result;
    const isUpdate = !!existingSchedule;
    
    if (existingSchedule) {
      // Update existing schedule
      result = await updateBatchSchedule(
        existingSchedule.documentId!,
        batchName,
        schedule,
        token
      );
    } else {
      // Create new schedule
      result = await createBatchSchedule(batchName, schedule, token);
    }

    // Log audit trail
    await logScheduleChange(
      isUpdate ? "schedule_updated" : "schedule_created",
      BATCH_LABELS[batchName],
      {
        scheduleData: schedule,
        batchId: result.documentId,
      }
    );

    // Revalidate settings page
    revalidatePath("/dashboard");

    return {
      success: true,
      message: `${batchName.charAt(0).toUpperCase() + batchName.slice(1)} batch schedule ${isUpdate ? 'updated' : 'created'} successfully`,
      data: result,
    };
  } catch (error) {
    console.error(`Save ${batchName} schedule error:`, error);
    return {
      success: false,
      message: error instanceof Error ? error.message : `Failed to save ${batchName} schedule`,
    };
  }
}
