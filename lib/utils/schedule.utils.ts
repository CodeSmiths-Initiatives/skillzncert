import type { DaySchedule, TimeSlot, TimePeriod } from "../types/schedule.types";

/**
 * Validate time slot
 * @param time - Time slot to validate
 * @returns Error message or empty string if valid
 */
export function validateTimeSlot(time: TimeSlot | null): string {
  if (!time) return "";
  
  if (time.hour < 1 || time.hour > 12) {
    return "Hour must be between 1 and 12";
  }
  
  if (time.minute < 0 || time.minute > 59) {
    return "Minute must be between 0 and 59";
  }
  
  return "";
}

/**
 * Validate day schedule
 * @param schedule - Day schedule to validate
 * @returns Error message or empty string if valid
 */
export function validateDaySchedule(schedule: DaySchedule): string {
  if (schedule.isHoliday) {
    return ""; // Holidays don't need time validation
  }
  
  if (!schedule.startTime || !schedule.endTime) {
    return "Start time and end time are required for working days";
  }
  
  const startError = validateTimeSlot(schedule.startTime);
  if (startError) return startError;
  
  const endError = validateTimeSlot(schedule.endTime);
  if (endError) return endError;
  
  // Convert to minutes for comparison
  const startMinutes = convertToMinutes(schedule.startTime);
  const endMinutes = convertToMinutes(schedule.endTime);
  
  if (endMinutes <= startMinutes) {
    return "End time must be after start time";
  }
  
  return "";
}

/**
 * Convert time slot to total minutes (for comparison)
 */
function convertToMinutes(time: TimeSlot): number {
  let hours = time.hour;
  if (time.period === "PM" && time.hour !== 12) {
    hours += 12;
  } else if (time.period === "AM" && time.hour === 12) {
    hours = 0;
  }
  return hours * 60 + time.minute;
}

/**
 * Format time slot for display
 * @param time - Time slot to format
 * @returns Formatted time string (e.g., "9:00 AM")
 */
export function formatTimeSlot(time: TimeSlot | null): string {
  if (!time) return "--:-- --";
  
  const hour = time.hour.toString();
  const minute = time.minute.toString().padStart(2, "0");
  
  return `${hour}:${minute} ${time.period}`;
}

/**
 * Parse time string to TimeSlot
 * @param timeString - Time string (e.g., "9:00 AM")
 * @returns TimeSlot object
 */
export function parseTimeString(timeString: string): TimeSlot | null {
  const regex = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
  const match = timeString.match(regex);
  
  if (!match) return null;
  
  const hour = parseInt(match[1], 10);
  const minute = parseInt(match[2], 10);
  const period = match[3].toUpperCase() as TimePeriod;
  
  if (hour < 1 || hour > 12 || minute < 0 || minute > 59) {
    return null;
  }
  
  return { hour, minute, period };
}

/**
 * Compare two schedules for equality
 * @param schedule1 - First schedule
 * @param schedule2 - Second schedule
 * @returns True if schedules are equal
 */
export function areSchedulesEqual(
  schedule1: DaySchedule[],
  schedule2: DaySchedule[]
): boolean {
  if (schedule1.length !== schedule2.length) return false;
  
  return schedule1.every((day1, index) => {
    const day2 = schedule2[index];
    
    if (day1.day !== day2.day || day1.isHoliday !== day2.isHoliday) {
      return false;
    }
    
    if (day1.isHoliday) return true; // Skip time comparison for holidays
    
    return (
      day1.startTime?.hour === day2.startTime?.hour &&
      day1.startTime?.minute === day2.startTime?.minute &&
      day1.startTime?.period === day2.startTime?.period &&
      day1.endTime?.hour === day2.endTime?.hour &&
      day1.endTime?.minute === day2.endTime?.minute &&
      day1.endTime?.period === day2.endTime?.period
    );
  });
}
