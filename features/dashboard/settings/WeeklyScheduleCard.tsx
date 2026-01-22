/**
 * WeeklyScheduleCard Component
 * 
 * Reusable weekly schedule management component
 * Follows accessibility and performance best practices
 */

import { memo, type ChangeEvent } from "react";
import { Calendar, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { DaySchedule, DayOfWeek, TimeSlot } from "@/lib/types/schedule.types";
import { DAY_LABELS } from "@/lib/types/schedule.types";
import { formatTimeSlot } from "@/lib/utils/schedule.utils";

interface WeeklyScheduleCardProps {
  schedule: DaySchedule[];
  errors: Record<DayOfWeek, string>;
  isPending: boolean;
  isLoading: boolean;
  canSubmit: boolean;
  onDayUpdate: (day: DaySchedule) => void;
  onHolidayToggle: (day: DayOfWeek) => void;
  onSave: () => void;
  onReset: () => void;
}

interface DayScheduleRowProps {
  daySchedule: DaySchedule;
  error: string;
  onUpdate: (day: DaySchedule) => void;
  onHolidayToggle: () => void;
  disabled?: boolean;
}

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
        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={`${label} hour`}
      >
        {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>
      <span className="text-gray-500">:</span>
      <label className="sr-only">{label} minute</label>
      <select
        value={value.minute}
        onChange={handleMinuteChange}
        disabled={disabled}
        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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
}: DayScheduleRowProps) {
  const handleStartTimeChange = (time: TimeSlot) => {
    onUpdate({ ...daySchedule, startTime: time });
  };

  const handleEndTimeChange = (time: TimeSlot) => {
    onUpdate({ ...daySchedule, endTime: time });
  };

  return (
    <div className="border-b border-gray-100 last:border-b-0 py-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Day name */}
        <div className="flex items-center gap-3 min-w-[120px]">
          <Clock className="h-4 w-4 text-gray-400" aria-hidden="true" />
          <span className="font-medium text-gray-900">
            {DAY_LABELS[daySchedule.day]}
          </span>
        </div>

        {/* Holiday toggle */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={daySchedule.isHoliday}
              onChange={onHolidayToggle}
              disabled={disabled}
              className="w-4 h-4 text-blue-500 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Mark ${DAY_LABELS[daySchedule.day]} as holiday`}
            />
            <span className="text-sm text-gray-600">Holiday</span>
          </label>
        </div>

        {/* Time inputs */}
        {!daySchedule.isHoliday && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 min-w-[40px]">From:</span>
              <TimeInput
                value={daySchedule.startTime}
                onChange={handleStartTimeChange}
                disabled={disabled}
                label={`${DAY_LABELS[daySchedule.day]} start time`}
              />
            </div>
            <span className="text-gray-400">→</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 min-w-[40px]">To:</span>
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
          <div className="text-sm text-gray-500 italic md:ml-auto">
            Marked as holiday
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-red-500 text-sm mt-2" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

/**
 * Main weekly schedule card
 */
export const WeeklyScheduleCard = memo(function WeeklyScheduleCard({
  schedule,
  errors,
  isPending,
  isLoading,
  canSubmit,
  onDayUpdate,
  onHolidayToggle,
  onSave,
  onReset,
}: WeeklyScheduleCardProps) {
  return (
    <Card className="p-6 bg-white shadow-sm border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-100 rounded-lg">
          <Calendar className="h-6 w-6 text-purple-600" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Weekly Class Schedule
          </h2>
          <p className="text-sm text-gray-600">
            Set class timings for each day of the week
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="py-8 text-center text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          Loading schedule...
        </div>
      ) : (
        <>
          <div className="space-y-2 mb-6">
            {schedule.map((daySchedule) => (
              <DayScheduleRow
                key={daySchedule.day}
                daySchedule={daySchedule}
                error={errors[daySchedule.day]}
                onUpdate={onDayUpdate}
                onHolidayToggle={() => onHolidayToggle(daySchedule.day)}
                disabled={isPending}
              />
            ))}
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              onClick={onSave}
              disabled={!canSubmit}
              className="bg-blue-500 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              suppressHydrationWarning
            >
              {isPending ? "Saving..." : "Save Schedule"}
            </Button>
            <Button
              type="button"
              onClick={onReset}
              disabled={isPending}
              variant="outline"
              className="border-gray-300"
              suppressHydrationWarning
            >
              Reset
            </Button>
          </div>
        </>
      )}
    </Card>
  );
});
