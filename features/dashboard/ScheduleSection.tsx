/**
 * ScheduleSection Component - Standalone Weekly Class Schedule Page
 * 
 * Dedicated page for managing weekly class timings
 * Separated from settings for better UX and simpler actions/services
 */

"use client";

import { memo } from "react";
import { Calendar } from "lucide-react";
import { useToast } from "@/components/toast/ToastContext";
import { useWeeklySchedule } from "@/lib/hooks/useWeeklySchedule";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DEFAULT_WEEKLY_SCHEDULE } from "@/lib/types/schedule.types";
import type { DaySchedule, DayOfWeek, TimeSlot } from "@/lib/types/schedule.types";
import { DAY_LABELS } from "@/lib/types/schedule.types";
import type { ChangeEvent } from "react";

/**
 * Header component
 */
const ScheduleHeader = memo(function ScheduleHeader() {
  return (
    <header className="bg-blue-500 text-white rounded-xl p-4 md:p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
          <Calendar className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">Class Schedule</h1>
      </div>
      <p className="text-white/90 text-sm md:text-base">
        Manage your weekly class timings and availability
      </p>
    </header>
  );
});

/**
 * Time input component
 */
const TimeInput = memo(function TimeInput({
  value,
  onChange,
  disabled,
  label,
}: {
  value: TimeSlot | null;
  onChange: (time: TimeSlot) => void;
  disabled?: boolean;
  label: string;
}) {
  const handleHourChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const hour = parseInt(e.target.value, 10);
    onChange({ ...value!, hour });
  };

  const handleMinuteChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const minute = parseInt(e.target.value, 10);
    onChange({ ...value!, minute });
  };

  const handlePeriodChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const period = e.target.value as "AM" | "PM";
    onChange({ ...value!, period });
  };

  if (!value) return null;

  return (
    <div className="flex items-center gap-1">
      <label className="sr-only">{label} hour</label>
      <select
        value={value.hour}
        onChange={handleHourChange}
        disabled={disabled}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        aria-label={`${label} hour`}
      >
        {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>
      <span className="text-gray-500 font-semibold">:</span>
      <label className="sr-only">{label} minute</label>
      <select
        value={value.minute}
        onChange={handleMinuteChange}
        disabled={disabled}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        aria-label={`${label} minute`}
      >
        {["00", "15", "30", "45"].map((m) => (
          <option key={m} value={parseInt(m, 10)}>
            {m}
          </option>
        ))}
      </select>
      <label className="sr-only">{label} period</label>
      <select
        value={value.period}
        onChange={handlePeriodChange}
        disabled={disabled}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        aria-label={`${label} AM or PM`}
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
});

/**
 * Day schedule row component
 */
const DayScheduleRow = memo(function DayScheduleRow({
  daySchedule,
  error,
  onUpdate,
  onHolidayToggle,
  disabled = false,
}: {
  daySchedule: DaySchedule;
  error: string;
  onUpdate: (day: DaySchedule) => void;
  onHolidayToggle: () => void;
  disabled?: boolean;
}) {
  const handleStartTimeChange = (time: TimeSlot) => {
    onUpdate({ ...daySchedule, startTime: time });
  };

  const handleEndTimeChange = (time: TimeSlot) => {
    onUpdate({ ...daySchedule, endTime: time });
  };

  return (
    <div className="border-b border-gray-100 last:border-b-0 py-5 hover:bg-gray-50 transition-colors rounded-lg px-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Day name */}
        <div className="flex items-center gap-3 min-w-[140px]">
          <div className={`w-2 h-2 rounded-full ${daySchedule.isHoliday ? 'bg-red-400' : 'bg-green-400'}`} 
               aria-hidden="true" />
          <span className="font-semibold text-gray-900 text-lg">
            {DAY_LABELS[daySchedule.day]}
          </span>
        </div>

        {/* Holiday toggle - for all days */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={daySchedule.isHoliday}
              onChange={onHolidayToggle}
              disabled={disabled}
              className="w-5 h-5 text-purple-500 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              aria-label={`Mark ${DAY_LABELS[daySchedule.day]} as holiday`}
            />
            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
              Mark as Holiday
            </span>
          </label>
        </div>

        {/* Time inputs */}
        {!daySchedule.isHoliday && (
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium min-w-[50px]">Start:</span>
              <TimeInput
                value={daySchedule.startTime}
                onChange={handleStartTimeChange}
                disabled={disabled}
                label={`${DAY_LABELS[daySchedule.day]} start time`}
              />
            </div>
            <span className="text-gray-400 text-xl">→</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium min-w-[50px]">End:</span>
              <TimeInput
                value={daySchedule.endTime}
                onChange={handleEndTimeChange}
                disabled={disabled}
                label={`${DAY_LABELS[daySchedule.day]} end time`}
              />
            </div>
          </div>
        )}

        {/* Holiday display */}
        {daySchedule.isHoliday && (
          <div className="text-sm text-red-500 italic font-medium lg:ml-auto">
            🏖️ Holiday - No classes
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-red-500 text-sm mt-3 ml-5 flex items-center gap-2" role="alert">
          <span className="text-lg">⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
});

/**
 * Main Schedule Section Component
 */
function ScheduleSectionComponent() {
  const { showToast } = useToast();

  const weeklySchedule = useWeeklySchedule({
    initialSchedule: DEFAULT_WEEKLY_SCHEDULE,
    onSuccess: (message) => {
      showToast({
        type: "success",
        title: "Schedule Updated",
        description: message,
      });
    },
    onError: (message) => {
      showToast({
        type: "error",
        title: "Error",
        description: message,
      });
    },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <ScheduleHeader />

      {/* Schedule Card */}
      <Card className="p-6 md:p-8 bg-white shadow-lg border-gray-200">
        {weeklySchedule.isLoading ? (
          <div className="py-12 text-center text-gray-500">
            <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-purple-500 mx-auto mb-4"></div>
            <p className="text-lg">Loading your schedule...</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Weekly Schedule
              </h2>
              <p className="text-gray-600">
                Configure your class timings for each day. You can set times for any day or mark days as holidays.
              </p>
            </div>

            <div className="space-y-1 mb-8">
              {weeklySchedule.schedule.map((daySchedule) => (
                <DayScheduleRow
                  key={daySchedule.day}
                  daySchedule={daySchedule}
                  error={weeklySchedule.errors[daySchedule.day]}
                  onUpdate={weeklySchedule.updateDay}
                  onHolidayToggle={() => weeklySchedule.toggleHoliday(daySchedule.day)}
                  disabled={weeklySchedule.isPending}
                />
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                onClick={weeklySchedule.handleSave}
                disabled={!weeklySchedule.canSubmit}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                suppressHydrationWarning
              >
                {weeklySchedule.isPending ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <span className="mr-2">💾</span>
                    Save Schedule
                  </>
                )}
              </Button>
              <Button
                type="button"
                onClick={weeklySchedule.resetSchedule}
                disabled={weeklySchedule.isPending}
                variant="outline"
                className="border-gray-300 hover:bg-gray-50 font-semibold transition-all"
                suppressHydrationWarning
              >
                <span className="mr-2">↺</span>
                Reset to Default
              </Button>
            </div>

            {/* Info note */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">💡 Tip:</span> Set class timings for any day of the week. 
                Mark days as holidays when classes are not scheduled.
              </p>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

/**
 * Memoized export
 */
export const ScheduleSection = memo(ScheduleSectionComponent);
