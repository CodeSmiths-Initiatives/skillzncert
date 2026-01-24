/**
 * Settings Module Exports
 * 
 * Centralized export point for all settings-related components
 * Follows barrel export pattern for clean imports
 */

export { SettingsSection } from "../SettingsSection";
export type { SettingsSectionProps, NotificationPreferences } from "../SettingsSection";

export { AccountSettingsCard } from "./AccountSettingsCard";
export { NotificationSettingsCard } from "./NotificationSettingsCard";
export { SystemSettingsCard } from "./SystemSettingsCard";
export { WeeklyScheduleCard } from "./WeeklyScheduleCard";

// Hooks
export { useAccountSettings } from "@/lib/hooks/useAccountSettings";
export { useDebounce } from "@/lib/hooks/useDebounce";
export { useWeeklySchedule } from "@/lib/hooks/useWeeklySchedule";

// Types
export type {
  AccountFormData,
  AccountFormErrors,
  UseAccountSettingsOptions,
} from "@/lib/hooks/useAccountSettings";

export type {
  DaySchedule,
  WeeklySchedule,
  TimeSlot,
  DayOfWeek,
  TimePeriod,
} from "@/lib/types/schedule.types";
