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

/**
 * Batch types for different class timings
 */
export type BatchType = "morning" | "noon" | "evening";

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
  batchName: BatchType;
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

/**
 * Batch type labels
 */
export const BATCH_LABELS: Record<BatchType, string> = {
  morning: "Morning Batch",
  noon: "Noon Batch",
  evening: "Evening Batch",
};

/**
 * Default schedules for each batch type
 */
export const DEFAULT_BATCH_SCHEDULES: Record<BatchType, DaySchedule[]> = {
  morning: [
    {
      day: "monday",
      isHoliday: false,
      startTime: { hour: 6, minute: 0, period: "AM" },
      endTime: { hour: 9, minute: 0, period: "AM" },
    },
    {
      day: "tuesday",
      isHoliday: false,
      startTime: { hour: 6, minute: 0, period: "AM" },
      endTime: { hour: 9, minute: 0, period: "AM" },
    },
    {
      day: "wednesday",
      isHoliday: false,
      startTime: { hour: 6, minute: 0, period: "AM" },
      endTime: { hour: 9, minute: 0, period: "AM" },
    },
    {
      day: "thursday",
      isHoliday: false,
      startTime: { hour: 6, minute: 0, period: "AM" },
      endTime: { hour: 9, minute: 0, period: "AM" },
    },
    {
      day: "friday",
      isHoliday: false,
      startTime: { hour: 6, minute: 0, period: "AM" },
      endTime: { hour: 9, minute: 0, period: "AM" },
    },
    {
      day: "saturday",
      isHoliday: false,
      startTime: { hour: 6, minute: 0, period: "AM" },
      endTime: { hour: 9, minute: 0, period: "AM" },
    },
    {
      day: "sunday",
      isHoliday: true,
      startTime: null,
      endTime: null,
    },
  ],
  noon: [
    {
      day: "monday",
      isHoliday: false,
      startTime: { hour: 12, minute: 0, period: "PM" },
      endTime: { hour: 3, minute: 0, period: "PM" },
    },
    {
      day: "tuesday",
      isHoliday: false,
      startTime: { hour: 12, minute: 0, period: "PM" },
      endTime: { hour: 3, minute: 0, period: "PM" },
    },
    {
      day: "wednesday",
      isHoliday: false,
      startTime: { hour: 12, minute: 0, period: "PM" },
      endTime: { hour: 3, minute: 0, period: "PM" },
    },
    {
      day: "thursday",
      isHoliday: false,
      startTime: { hour: 12, minute: 0, period: "PM" },
      endTime: { hour: 3, minute: 0, period: "PM" },
    },
    {
      day: "friday",
      isHoliday: false,
      startTime: { hour: 12, minute: 0, period: "PM" },
      endTime: { hour: 3, minute: 0, period: "PM" },
    },
    {
      day: "saturday",
      isHoliday: false,
      startTime: { hour: 12, minute: 0, period: "PM" },
      endTime: { hour: 3, minute: 0, period: "PM" },
    },
    {
      day: "sunday",
      isHoliday: true,
      startTime: null,
      endTime: null,
    },
  ],
  evening: [
    {
      day: "monday",
      isHoliday: false,
      startTime: { hour: 6, minute: 0, period: "PM" },
      endTime: { hour: 9, minute: 0, period: "PM" },
    },
    {
      day: "tuesday",
      isHoliday: false,
      startTime: { hour: 6, minute: 0, period: "PM" },
      endTime: { hour: 9, minute: 0, period: "PM" },
    },
    {
      day: "wednesday",
      isHoliday: false,
      startTime: { hour: 6, minute: 0, period: "PM" },
      endTime: { hour: 9, minute: 0, period: "PM" },
    },
    {
      day: "thursday",
      isHoliday: false,
      startTime: { hour: 6, minute: 0, period: "PM" },
      endTime: { hour: 9, minute: 0, period: "PM" },
    },
    {
      day: "friday",
      isHoliday: false,
      startTime: { hour: 6, minute: 0, period: "PM" },
      endTime: { hour: 9, minute: 0, period: "PM" },
    },
    {
      day: "saturday",
      isHoliday: false,
      startTime: { hour: 6, minute: 0, period: "PM" },
      endTime: { hour: 9, minute: 0, period: "PM" },
    },
    {
      day: "sunday",
      isHoliday: true,
      startTime: null,
      endTime: null,
    },
  ],
};
