import { useState, useCallback, useMemo, useTransition, useEffect } from "react";
import type { DaySchedule, DayOfWeek } from "@/lib/types/schedule.types";
import { validateDaySchedule, areSchedulesEqual } from "@/lib/utils/schedule.utils";
import { saveScheduleAction, getScheduleAction } from "@/actions/schedule/schedule.actions";

/**
 * Options for useWeeklySchedule hook
 */
export interface UseWeeklyScheduleOptions {
  initialSchedule: DaySchedule[];
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
}

/**
 * Custom hook for managing weekly schedule
 * Follows single responsibility principle and separation of concerns
 * 
 * @param options - Configuration options
 * @returns Weekly schedule state and handlers
 */
export function useWeeklySchedule({
  initialSchedule,
  onSuccess,
  onError,
}: UseWeeklyScheduleOptions) {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  
  const [schedule, setSchedule] = useState<DaySchedule[]>(initialSchedule);
  const [errors, setErrors] = useState<Record<DayOfWeek, string>>({
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: "",
  });

  /**
   * Load schedule from server on mount
   */
  useEffect(() => {
    const loadSchedule = async () => {
      setIsLoading(true);
      try {
        const result = await getScheduleAction();
        if (result.success && result.data) {
          setSchedule(result.data.schedule);
        }
      } catch (error) {
        console.error("Failed to load schedule:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSchedule();
  }, []);

  /**
   * Check if schedule has changed from initial
   */
  const hasChanges = useMemo(() => {
    return !areSchedulesEqual(schedule, initialSchedule);
  }, [schedule, initialSchedule]);

  /**
   * Validate entire schedule
   */
  const validateSchedule = useCallback((): boolean => {
    const newErrors: Record<DayOfWeek, string> = {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    };

    let hasErrors = false;

    schedule.forEach((daySchedule) => {
      const error = validateDaySchedule(daySchedule);
      if (error) {
        newErrors[daySchedule.day] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  }, [schedule]);

  /**
   * Update a single day's schedule
   */
  const updateDay = useCallback((updatedDay: DaySchedule) => {
    setSchedule((prev) =>
      prev.map((day) => (day.day === updatedDay.day ? updatedDay : day))
    );

    // Clear error for this day
    setErrors((prev) => ({
      ...prev,
      [updatedDay.day]: "",
    }));
  }, []);

  /**
   * Toggle holiday status for a day
   */
  const toggleHoliday = useCallback((dayOfWeek: DayOfWeek) => {
    setSchedule((prev) =>
      prev.map((day) => {
        if (day.day === dayOfWeek) {
          const newIsHoliday = !day.isHoliday;
          
          return {
            ...day,
            isHoliday: newIsHoliday,
            // If changing to holiday, set times to null
            // If changing from holiday to working day, initialize with default times
            startTime: newIsHoliday 
              ? null 
              : day.startTime || { hour: 9, minute: 0, period: "AM" },
            endTime: newIsHoliday 
              ? null 
              : day.endTime || { hour: 5, minute: 0, period: "PM" },
          };
        }
        return day;
      })
    );
  }, []);

  /**
   * Save schedule
   */
  const handleSave = useCallback(async () => {
    if (!validateSchedule()) {
      onError?.("Please fix validation errors before saving.");
      return;
    }

    if (!hasChanges) {
      onError?.("No changes to save.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await saveScheduleAction(schedule);

        if (result.success) {
          onSuccess?.(result.message || "Schedule saved successfully!");
        } else {
          onError?.(result.message || "Failed to save schedule.");
        }
      } catch (error) {
        onError?.(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred."
        );
      }
    });
  }, [schedule, validateSchedule, hasChanges, onSuccess, onError]);

  /**
   * Reset schedule to initial values
   */
  const resetSchedule = useCallback(() => {
    setSchedule(initialSchedule);
    setErrors({
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    });
  }, [initialSchedule]);

  /**
   * Check if schedule has any errors
   */
  const hasErrors = useMemo(() => {
    return Object.values(errors).some((error) => error !== "");
  }, [errors]);

  /**
   * Can submit if no errors and has changes
   */
  const canSubmit = useMemo(() => {
    return !hasErrors && hasChanges && !isPending && !isLoading;
  }, [hasErrors, hasChanges, isPending, isLoading]);

  return {
    schedule,
    errors,
    isPending,
    isLoading,
    hasChanges,
    hasErrors,
    canSubmit,
    updateDay,
    toggleHoliday,
    handleSave,
    resetSchedule,
  };
}
