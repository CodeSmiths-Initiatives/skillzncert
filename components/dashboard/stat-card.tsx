"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: number;
  trend?: "up" | "down" | "stable";
  suffix?: string;
  isLoading?: boolean;
  error?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  change = 0,
  trend = "stable",
  suffix = "",
  isLoading = false,
  error = "",
}: StatCardProps) {
  // Determine colors based on trend
  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600 bg-green-100";
      case "down":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4" />;
      case "down":
        return <TrendingDown className="h-4 w-4" />;
      default:
        return <Minus className="h-4 w-4" />;
    }
  };

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50 hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-700">
            {title}
          </CardTitle>
          <div className="p-2 bg-red-100 rounded-lg">
            <Icon className="h-4 w-4 text-red-600" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-red-600 font-medium">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "hover:shadow-xl hover:shadow-blue-200/50 transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 group border-t-4 border-t-blue-500",
        isLoading && "opacity-75 pointer-events-none"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600 group-hover:text-slate-700">
          {title}
        </CardTitle>
        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
          <Icon className="h-4 w-4 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900 mb-1">
          {isLoading ? (
            <div className="h-8 w-24 bg-slate-200 rounded animate-pulse" />
          ) : (
            <>
              {value}
              {suffix && <span className="text-lg text-slate-600 ml-1">{suffix}</span>}
            </>
          )}
        </div>

        {/* Change indicator */}
        {!isLoading && change !== 0 && (
          <div className="flex items-center gap-1">
            <div className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold", getTrendColor())}>
              {getTrendIcon()}
              <span>
                {change > 0 ? "+" : ""}
                {change.toFixed(1)}%
              </span>
            </div>
            <span className="text-xs text-slate-500">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
