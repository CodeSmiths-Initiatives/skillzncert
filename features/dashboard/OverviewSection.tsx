"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  Users,
  DollarSign,
  BookOpen,
  CheckCircle,
  Clock,
  Calendar,
  AlertTriangle,
  Award,
} from "lucide-react";
import { getScheduleAction } from "@/actions/schedule/schedule.actions";
import { getDashboardMetricsAction } from "@/actions/dashboard/get-metrics.actions";
import { getUserPayments } from "@/actions/payment/get-user-payments.actions";
import { StatCard } from "@/components/dashboard/stat-card";
import type { DayOfWeek, DaySchedule } from "@/lib/types/schedule.types";
import { DAY_LABELS } from "@/lib/types/schedule.types";
import { formatTimeSlot } from "@/lib/utils/schedule.utils";
import type { DashboardTopMetrics } from "@/lib/services/dashboard.service";
import { buildAdminStats, type StatValue } from "@/lib/types/stats.config";
import { PAYMENT_PLANS } from "@/lib/payment-plans";
import type { PaymentData } from "@/lib/services/payment.service";

/**
 * OverviewSection Component
 * Displays dashboard metrics for both admin and regular users
 * 
 * Architecture:
 * - Separated admin/user stat building logic
 * - Proper error classification and handling
 * - Role-based data display
 * - Loading and error states per data type
 */
export function OverviewSection({ 
  isAdmin,
  userDocumentId,
  userId,
}: { 
  isAdmin: boolean;
  userDocumentId?: string;
  userId?: number;
}) {
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(true);
  const [metrics, setMetrics] = useState<DashboardTopMetrics | null>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const [userStats, setUserStats] = useState<StatValue[]>([]);
  const [isLoadingUserStats, setIsLoadingUserStats] = useState(!isAdmin);
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const [currentDay, setCurrentDay] = useState<DayOfWeek | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  // Set current day after mounting to avoid hydration mismatch
  useEffect(() => {
    const today = new Date();
    setCurrentDate(today);
    setCurrentDay(today.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as DayOfWeek);
  }, []);

  // Fetch dashboard metrics for admin
  // Only admins should fetch metrics (prevents 403 errors)
  useEffect(() => {
    if (!isAdmin) {
      // Non-admin: skip metrics fetch, use static user stats
      setMetrics(null);
      setIsLoadingMetrics(false);
      return;
    }

    const loadMetrics = async () => {
      try {
        setIsLoadingMetrics(true);
        setMetricsError(null);
        const result = await getDashboardMetricsAction();
        
        if (result.success) {
          setMetrics(result.data);
        } else {
          // Handle different error types
          if (result.status === 403) {
            setMetricsError("You don't have permission to view metrics");
          } else if (result.status === 401) {
            setMetricsError("Your session has expired. Please log in again.");
          } else {
            setMetricsError(result.error || "Failed to load metrics");
          }
        }
      } catch (error) {
        console.error("Error loading metrics:", error);
        setMetricsError("Error loading metrics");
      } finally {
        setIsLoadingMetrics(false);
      }
    };

    loadMetrics();
  }, [isAdmin]);

  // Fetch the weekly schedule
  useEffect(() => {
    const loadSchedule = async () => {
      try {
        const result = await getScheduleAction();
        if (result.success && result.data?.schedule) {
          setSchedule(result.data.schedule);
        }
      } catch (error) {
        console.error("Failed to load schedule:", error);
      } finally {
        setIsLoadingSchedule(false);
      }
    };

    loadSchedule();
  }, []);

  // Fetch user stats for non-admin users
  useEffect(() => {
    if (isAdmin || !userId) {
      setIsLoadingUserStats(false);
      return;
    }

    const loadUserStats = async () => {
      try {
        setIsLoadingUserStats(true);
        
        // Fetch user payments to get latest plan
        const paymentsResult = await getUserPayments(userId);
        
        let activePlanDisplay = "No Active Plan";
        
        if (paymentsResult.success && paymentsResult.data.length > 0) {
          // Find latest payment with a plan
          const latestPlanPayment = paymentsResult.data.find(
            (payment: PaymentData) => payment.planId && payment.planId !== "none"
          );
          
          if (latestPlanPayment && latestPlanPayment.planId) {
            // Get plan config to show duration
            const planConfig = PAYMENT_PLANS[latestPlanPayment.planId];
            if (planConfig) {
              activePlanDisplay = `${latestPlanPayment.planName} (${planConfig.duration})`;
            } else {
              activePlanDisplay = latestPlanPayment.planName || "Unknown Plan";
            }
          }
        }
        
        // Build user stats with plan info
        setUserStats([
          {
            title: "Attendance",
            value: "0%",
            icon: BookOpen,
            change: null,
            trend: "stable" as const,
          },
          {
            title: "Completed",
            value: "0",
            icon: CheckCircle,
            change: null,
            trend: "stable" as const,
          },
          {
            title: "On Leave",
            value: "0",
            icon: Clock,
            change: null,
            trend: "stable" as const,
          },
          {
            title: "Active Plan",
            value: activePlanDisplay,
            icon: Award,
            change: null,
            trend: "stable" as const,
          },
        ]);
      } catch (error) {
        console.error("Error loading user stats:", error);
        // Fallback to default stats
        setUserStats([
          {
            title: "Attendance",
            value: "0%",
            icon: BookOpen,
            change: null,
            trend: "stable" as const,
          },
          {
            title: "Completed",
            value: "0",
            icon: CheckCircle,
            change: null,
            trend: "stable" as const,
          },
          {
            title: "On Leave",
            value: "0",
            icon: Clock,
            change: null,
            trend: "stable" as const,
          },
          {
            title: "Active Plan",
            value: "No Active Plan",
            icon: Award,
            change: null,
            trend: "stable" as const,
          },
        ]);
      } finally {
        setIsLoadingUserStats(false);
      }
    };

    loadUserStats();
  }, [isAdmin, userId]);

  /**
   * Build stats array based on user role
   * Using reusable functions from stats config
   * Makes adding new metrics simple and type-safe
   * Note: buildAdminStats() handles null/undefined metrics gracefully
   */
  const buildStats = (): StatValue[] => {
    if (isAdmin) {
      return buildAdminStats(metrics!);
    }

    if (!isAdmin) {
      return userStats;
    }

    // Loading state: empty array
    return [];
  };

  const stats = buildStats();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={typeof stat.change === "number" ? stat.change : 0}
            trend={stat.trend}
            isLoading={isAdmin ? isLoadingMetrics : isLoadingUserStats}
            error={isAdmin && metricsError ? metricsError : undefined}
          />
        ))}
      </div>

      {/* Error State for Metrics (Admin Only) */}
      {/* {isAdmin && metricsError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 text-sm">Metrics Error</h3>
            <p className="text-sm text-red-700 mt-1">{metricsError}</p>
          </div>
        </div>
      )} */}

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-[6fr_4fr] gap-4 sm:gap-6 max-h-[calc(100vh-280px)]">       

        {/* Progress Overview - 70% width */}
        <Card className="bg-gradient-to-br from-blue-50 to-sky-50 border-0 hover:shadow-xl hover:shadow-blue-200/50 transition-all duration-300 group border-t-4 border-t-blue-500 flex flex-col">
          <CardHeader className="border-b border-blue-100/50 flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-slate-800 group-hover:text-slate-900 flex items-center">
                <div className="p-1.5 bg-blue-100 rounded-md mr-2 group-hover:bg-blue-200 transition-colors">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                Weekly Schedule
              </CardTitle>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('weekly')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    viewMode === 'weekly'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setViewMode('monthly')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    viewMode === 'monthly'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  Month
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 overflow-y-auto max-h-[calc(100vh-400px)] scrollbar-blue">
            {isLoadingSchedule ? (
              <div className="py-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                <p className="text-sm text-slate-500">Loading schedule...</p>
              </div>
            ) : schedule.length === 0 ? (
              <div className="py-8 text-center">
                <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No schedule available yet.</p>
                <p className="text-xs text-slate-400 mt-1">
                  Admin can set up the schedule in Settings.
                </p>
              </div>
            ) : viewMode === 'weekly' ? (
              <>
                {/* Weekly View - Class Days */}
                {schedule.filter((day) => !day.isHoliday).length > 0 && (
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-blue-100 rounded-md">
                        <Clock className="h-3 w-3 text-blue-600" />
                      </div>
                      <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                        Class Schedule
                      </h4>
                    </div>
                    {schedule
                      .filter((day) => !day.isHoliday)
                      .map((daySchedule) => {
                        const isToday = daySchedule.day === currentDay;
                        return (
                          <div
                            key={daySchedule.day}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                              isToday
                                ? 'bg-gradient-to-r from-blue-200 via-sky-200 to-cyan-200 border-blue-400 shadow-lg ring-2 ring-blue-300 ring-offset-2'
                                : 'bg-white-100 border-blue-200 hover:border-blue-300 hover:shadow-md'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              {isToday ? (
                                <div className="relative">
                                  <div className="w-3 h-3 bg-blue-600 rounded-full shadow-md"></div>
                                  <div className="absolute inset-0 w-3 h-3 bg-blue-600 rounded-full animate-ping"></div>
                                </div>
                              ) : (
                                <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
                              )}
                              <div>
                                <span className={`${isToday ? 'font-bold text-blue-900' : 'font-semibold text-slate-700'}`}>
                                  {DAY_LABELS[daySchedule.day]}
                                </span>
                                {isToday && (
                                  <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-blue-500 to-sky-500 text-white text-xs font-bold rounded-full">
                                    Today
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`text-sm ${isToday ? 'font-bold text-blue-800' : 'font-semibold text-blue-700'}`}>
                                {daySchedule.startTime && daySchedule.endTime
                                  ? `${formatTimeSlot(daySchedule.startTime)} - ${formatTimeSlot(daySchedule.endTime)}`
                                  : "Not set"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}

                {/* Holidays Section */}
                {schedule.filter((day) => day.isHoliday).length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-rose-100 rounded-md">
                        <Clock className="h-3 w-3 text-rose-600" />
                      </div>
                      <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                        Holidays
                      </h4>
                    </div>
                    {schedule
                      .filter((day) => day.isHoliday)
                      .map((daySchedule) => {
                        const isToday = daySchedule.day === currentDay;
                        return (
                          <div
                            key={daySchedule.day}
                            className={`group relative overflow-hidden p-3 rounded-lg border-2 transition-all duration-200 ${
                              isToday
                                ? 'bg-gradient-to-r from-rose-100 via-pink-100 to-orange-100 border-rose-400 shadow-xl ring-2 ring-rose-300 ring-offset-2'
                                : 'bg-gradient-to-r from-rose-50 via-pink-50 to-orange-50 border-rose-200 hover:border-rose-300 hover:shadow-lg hover:scale-[1.02]'
                            }`}
                          >
                            <div className="relative flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  {isToday ? (
                                    <>
                                      <div className="w-3 h-3 bg-gradient-to-r from-rose-600 to-pink-600 rounded-full shadow-md"></div>
                                      <div className="absolute inset-0 w-3 h-3 bg-gradient-to-r from-rose-600 to-pink-600 rounded-full animate-ping"></div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="w-3 h-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full animate-pulse shadow-md"></div>
                                      <div className="absolute inset-0 w-3 h-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full animate-ping opacity-30"></div>
                                    </>
                                  )}
                                </div>
                                <div>
                                  <span className={`${isToday ? 'font-bold text-rose-900' : 'font-semibold text-slate-700'}`}>
                                    {DAY_LABELS[daySchedule.day]}
                                  </span>
                                  {isToday && (
                                    <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs font-bold rounded-full">
                                      Today
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span className={`px-2 py-1 bg-gradient-to-r from-rose-100 to-pink-100 rounded-full text-xs ${
                                isToday ? 'font-bold text-rose-800' : 'font-bold text-rose-700'
                              }`}>
                                Holiday
                              </span>
                            </div>
                            <div className="absolute -bottom-1 -right-1 text-3xl opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                              🌴
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </>
            ) : (
              // Monthly Calendar View
              <div className="space-y-1">
                <div className="text-center mb-1">
                  <h3 className="text-sm font-bold text-blue-900" suppressHydrationWarning>
                    {currentDate?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                </div>
                
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1.5">
                  {/* Day Headers */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-xs font-bold text-blue-700 py-1">
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar Days */}
                  {(() => {
                    if (!currentDate) return null;
                    
                    const today = currentDate;
                    const year = today.getFullYear();
                    const month = today.getMonth();
                    const firstDay = new Date(year, month, 1).getDay();
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    const days = [];
                    
                    // Empty cells before first day
                    for (let i = 0; i < firstDay; i++) {
                      days.push(
                        <div key={`empty-${i}`} className="aspect-square p-1 rounded bg-slate-50/50"></div>
                      );
                    }
                    
                    // Days of the month
                    for (let day = 1; day <= daysInMonth; day++) {
                      const date = new Date(year, month, day);
                      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as DayOfWeek;
                      const daySchedule = schedule.find(s => s.day === dayName);
                      const isToday = day === today.getDate();
                      const isHoliday = daySchedule?.isHoliday;
                      const hasClass = daySchedule && !daySchedule.isHoliday;
                      
                      days.push(
                        <div
                          key={day}
                          className={`group/day relative aspect-square p-1 rounded border transition-all duration-200 flex flex-col items-center justify-center cursor-pointer ${
                            isToday
                              ? 'bg-gradient-to-br from-blue-200 via-sky-200 to-cyan-200 border-blue-400 shadow-md ring-1 ring-blue-300 hover:ring-blue-400'
                              : isHoliday
                              ? 'bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200 hover:border-rose-300 hover:shadow-sm'
                              : hasClass
                              ? 'bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200 hover:border-blue-300 hover:shadow-sm'
                              : 'bg-slate-50/50 border-slate-200'
                          }`}
                        >
                          <span className={`text-xl ${isToday ? 'font-bold text-blue-900' : 'font-medium text-slate-700'}`}>
                            {day}
                          </span>
                          {hasClass && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-0.5"></div>
                          )}
                          {isHoliday && (
                            <div className="text-[15px] mt-0.5">🌴</div>
                          )}
                          
                          {/* Hover Tooltip */}
                          {(hasClass || isHoliday) && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 opacity-0 group-hover/day:opacity-100 pointer-events-none transition-opacity duration-200 z-10">
                              <div className={`px-2.5 py-1.5 rounded-lg shadow-lg border whitespace-nowrap ${
                                isHoliday 
                                  ? 'bg-gradient-to-br from-rose-100 to-pink-100 border-rose-300'
                                  : 'bg-gradient-to-br from-blue-100 to-sky-100 border-blue-300'
                              }`}>
                                <div className="text-xs font-bold mb-1 text-slate-800">
                                  {DAY_LABELS[dayName]}
                                </div>
                                {isHoliday ? (
                                  <div className="text-xs font-semibold text-rose-700">
                                    Holiday 🌴
                                  </div>
                                ) : (
                                  <div className="text-xs font-semibold text-blue-700">
                                    {daySchedule.startTime && daySchedule.endTime
                                      ? `${formatTimeSlot(daySchedule.startTime)} - ${formatTimeSlot(daySchedule.endTime)}`
                                      : "Time not set"}
                                  </div>
                                )}
                              </div>
                              {/* Arrow */}
                              <div className={`absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
                                isHoliday ? 'border-t-rose-300' : 'border-t-blue-300'
                              }`}></div>
                            </div>
                          )}
                        </div>
                      );
                    }
                    
                    return days;
                  })()}
                </div>
                
                {/* Legend */}
                <div className="flex flex-wrap gap-2 justify-center pt-1 border-t border-blue-100">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-200 rounded"></div>
                    <span className="text-[10px] text-slate-600">Class</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 rounded"></div>
                    <span className="text-[10px] text-slate-600">Holiday</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gradient-to-br from-blue-200 to-sky-200 border-2 border-blue-400 rounded"></div>
                    <span className="text-[10px] text-slate-600">Today</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity - 30% width */}
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-0 hover:shadow-xl hover:shadow-emerald-200/50 transition-all duration-300 group border-t-4 border-t-emerald-500 flex flex-col">
          <CardHeader className="border-b border-emerald-100/50 flex-shrink-0">
            <CardTitle className="text-slate-800 group-hover:text-slate-900 flex items-center">
              <div className="p-1.5 bg-emerald-100 rounded-md mr-2 group-hover:bg-emerald-200 transition-colors">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              </div>
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 overflow-y-auto max-h-[calc(100vh-400px)] scrollbar-emerald">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800">
                  Enrollment started for <span className="font-bold">Networking & Cybersecurity certification</span>
                </p>
                <p className="text-xs text-slate-500">1 hours ago</p>
              </div>
              <Badge
                variant="default"
                className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              >
                Completed
              </Badge>
            </div>            
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
