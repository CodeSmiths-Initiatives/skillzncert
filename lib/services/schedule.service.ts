import type { DaySchedule, WeeklySchedule } from "../types/schedule.types";

/**
 * Weekly Schedule Service
 * Handles all API calls for schedule management
 */

/**
 * Get global weekly schedule (shared by all users)
 * @param token - Auth token
 * @returns Weekly schedule or null if not found
 */
export async function getWeeklySchedule(
  token: string
): Promise<WeeklySchedule | null> {
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
    throw new Error("Failed to fetch weekly schedule");
  }

  const json = await res.json();
  const schedule = json?.data?.[0];

  if (!schedule) {
    return null;
  }

  return {
    id: schedule.id,
    documentId: schedule.documentId,
    schedule: JSON.parse(schedule.scheduleData), // Parse JSON from Strapi
    createdAt: schedule.createdAt,
    updatedAt: schedule.updatedAt,
  };
}

/**
 * Create global weekly schedule (shared by all users)
 * @param schedule - Schedule data
 * @param token - Auth token
 * @returns Created schedule
 */
export async function createWeeklySchedule(
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
          scheduleData: JSON.stringify(schedule),
        },
      }),
      cache: "no-store",
    }
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(
      json?.error?.message || "Failed to create weekly schedule"
    );
  }

  return {
    id: json.data.id,
    documentId: json.data.documentId,
    schedule: JSON.parse(json.data.scheduleData),
    createdAt: json.data.createdAt,
    updatedAt: json.data.updatedAt,
  };
}

/**
 * Update weekly schedule
 * @param documentId - Schedule document ID
 * @param schedule - Updated schedule data
 * @param token - Auth token
 * @returns Updated schedule
 */
export async function updateWeeklySchedule(
  documentId: string,
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
          scheduleData: JSON.stringify(schedule),
        },
      }),
      cache: "no-store",
    }
  );

  const json = await res.json();

  if (!res.ok) {
    throw new Error(
      json?.error?.message || "Failed to update weekly schedule"
    );
  }

  return {
    id: json.data.id,
    documentId: json.data.documentId,
    schedule: JSON.parse(json.data.scheduleData),
    createdAt: json.data.createdAt,
    updatedAt: json.data.updatedAt,
  };
}
