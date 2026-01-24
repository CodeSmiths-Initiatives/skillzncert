/**
 * Weekly Schedule Types
 * Type-safe definitions for class schedule management
 */

export type DayOfWeek = 
  | "monday" 
  | "tuesday" 
  | "wednesday" 
  | "thursday" 
  | "friday" 
  | "saturday" 
  | "sunday";

export type TimePeriod = "AM" | "PM";

export interface TimeSlot {
  hour: number; // 1-12
  minute: number; // 0-59
  period: TimePeriod;
}

export interface DaySchedule {
  day: DayOfWeek;
  isHoliday: boolean;
  startTime: TimeSlot | null;
  endTime: TimeSlot | null;
}

export interface WeeklySchedule {
  id?: number;
  documentId?: string;
  schedule: DaySchedule[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Default schedule - all working days 9 AM to 5 PM
 */
export const DEFAULT_WEEKLY_SCHEDULE: DaySchedule[] = [
  {
    day: "monday",
    isHoliday: false,
    startTime: { hour: 9, minute: 0, period: "AM" },
    endTime: { hour: 5, minute: 0, period: "PM" },
  },
  {
    day: "tuesday",
    isHoliday: false,
    startTime: { hour: 9, minute: 0, period: "AM" },
    endTime: { hour: 5, minute: 0, period: "PM" },
  },
  {
    day: "wednesday",
    isHoliday: false,
    startTime: { hour: 9, minute: 0, period: "AM" },
    endTime: { hour: 5, minute: 0, period: "PM" },
  },
  {
    day: "thursday",
    isHoliday: false,
    startTime: { hour: 9, minute: 0, period: "AM" },
    endTime: { hour: 5, minute: 0, period: "PM" },
  },
  {
    day: "friday",
    isHoliday: false,
    startTime: { hour: 9, minute: 0, period: "AM" },
    endTime: { hour: 5, minute: 0, period: "PM" },
  },
  {
    day: "saturday",
    isHoliday: false,
    startTime: { hour: 9, minute: 0, period: "AM" },
    endTime: { hour: 5, minute: 0, period: "PM" },
  },
  {
    day: "sunday",
    isHoliday: false,
    startTime: { hour: 9, minute: 0, period: "AM" },
    endTime: { hour: 5, minute: 0, period: "PM" },
  },
];

/**
 * Day name display mapping
 */
export const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};
