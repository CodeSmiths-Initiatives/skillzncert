import type { DaySchedule, WeeklySchedule, BatchType } from "../types/schedule.types";

/**
 * Weekly Schedule Service
 * Handles all API calls for batch-based schedule management
 */

/**
 * Get all batch schedules
 * @param token - Auth token
 * @returns Map of batch schedules
 */
export async function getAllBatchSchedules(
  token: string
): Promise<Map<BatchType, WeeklySchedule>> {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/weekly-schedules`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch weekly schedules");
  }

  const json = await res.json();
  const schedules = json?.data || [];

  const scheduleMap = new Map<BatchType, WeeklySchedule>();

  schedules.forEach((schedule: any) => {
    scheduleMap.set(schedule.batchName as BatchType, {
      id: schedule.id,
      documentId: schedule.documentId,
      batchName: schedule.batchName as BatchType,
      schedule: JSON.parse(schedule.scheduleData),
      createdAt: schedule.createdAt,
      updatedAt: schedule.updatedAt,
    });
  });

  return scheduleMap;
}

/**
 * Get schedule for a specific batch
 * @param batchName - Batch type (morning/noon/evening)
 * @param token - Auth token
 * @returns Weekly schedule or null if not found
 */
export async function getBatchSchedule(
  batchName: BatchType,
  token: string
): Promise<WeeklySchedule | null> {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/weekly-schedules?filters[batchName][$eq]=${batchName}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch ${batchName} batch schedule`);
  }

  const json = await res.json();
  const schedule = json?.data?.[0];

  if (!schedule) {
    return null;
  }

  return {
    id: schedule.id,
    documentId: schedule.documentId,
    batchName: schedule.batchName as BatchType,
    schedule: JSON.parse(schedule.scheduleData),
    createdAt: schedule.createdAt,
    updatedAt: schedule.updatedAt,
  };
}

/**
 * Create batch schedule
 * @param batchName - Batch type (morning/noon/evening)
 * @param schedule - Schedule data
 * @param token - Auth token
 * @returns Created schedule
 */
export async function createBatchSchedule(
  batchName: BatchType,
  schedule: DaySchedule[],
  token: string
): Promise<WeeklySchedule> {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/weekly-schedules`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          batchName,
          scheduleData: JSON.stringify(schedule),
        },
      }),
      cache: "no-store",
    }
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(
      json?.error?.message || `Failed to create ${batchName} batch schedule`
    );
  }

  return {
    id: json.data.id,
    documentId: json.data.documentId,
    batchName: json.data.batchName as BatchType,
    schedule: JSON.parse(json.data.scheduleData),
    createdAt: json.data.createdAt,
    updatedAt: json.data.updatedAt,
  };
}

/**
 * Update batch schedule
 * @param documentId - Schedule document ID
 * @param batchName - Batch type (morning/noon/evening)
 * @param schedule - Updated schedule data
 * @param token - Auth token
 * @returns Updated schedule
 */
export async function updateBatchSchedule(
  documentId: string,
  batchName: BatchType,
  schedule: DaySchedule[],
  token: string
): Promise<WeeklySchedule> {
  const res = await fetch(
    `${process.env.STRAPI_URL}/api/weekly-schedules/${documentId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          batchName,
          scheduleData: JSON.stringify(schedule),
        },
      }),
      cache: "no-store",
    }
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(
      json?.error?.message || `Failed to update ${batchName} batch schedule`
    );
  }

  return {
    id: json.data.id,
    documentId: json.data.documentId,
    batchName: json.data.batchName as BatchType,
    schedule: JSON.parse(json.data.scheduleData),
    createdAt: json.data.createdAt,
    updatedAt: json.data.updatedAt,
  };
}
