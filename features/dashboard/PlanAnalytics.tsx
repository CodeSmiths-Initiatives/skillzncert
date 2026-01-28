"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";
import { PAYMENT_PLANS } from "@/lib/payment-plans";
import type { PaymentData } from "@/lib/services/payment.service";
import type { EnrolleeData } from "@/lib/services/enrollment.service";

interface PlanAnalyticsProps {
  payments: PaymentData[];
  enrollees: EnrolleeData[];
  isLoading?: boolean;
}

export function PlanAnalytics({ payments, enrollees, isLoading = false }: PlanAnalyticsProps) {
  const [planStats, setPlanStats] = useState<{
    [key: string]: {
      name: string;
      enrolledCount: number;
      paidCount: number;
      totalRevenue: number;
      avgAmount: number;
    };
  }>({});

  const hasCalculated = useRef(false);

  useEffect(() => {
    if (hasCalculated.current) return;
    hasCalculated.current = true;

    const stats: typeof planStats = {};

    // Initialize all plans
    Object.values(PAYMENT_PLANS).forEach((plan) => {
      stats[plan.id] = {
        name: plan.name,
        enrolledCount: 0,
        paidCount: 0,
        totalRevenue: 0,
        avgAmount: 0,
      };
    });

    // Calculate enrollees by plan
    enrollees.forEach((enrollee) => {
      if (enrollee.planName) {
        const planId = Object.keys(PAYMENT_PLANS).find(
          (key) => PAYMENT_PLANS[key].name === enrollee.planName
        );
        if (planId && stats[planId]) {
          stats[planId].enrolledCount++;
          if (enrollee.isPaymentDone) {
            stats[planId].paidCount++;
          }
        }
      }
    });

    // Calculate revenue by plan
    payments.forEach((payment) => {
      if (payment.planId && stats[payment.planId]) {
        stats[payment.planId].totalRevenue += payment.amount;
      }
    });

    // Calculate average amount
    Object.keys(stats).forEach((planId) => {
      if (stats[planId].paidCount > 0) {
        stats[planId].avgAmount = stats[planId].totalRevenue / stats[planId].paidCount;
      }
    });

    setPlanStats(stats);
  }, [payments, enrollees]);

  const formatAmount = (amount: number) => {
    return `₦${amount.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
  };

  const totalRevenue = Object.values(planStats).reduce((sum, plan) => sum + plan.totalRevenue, 0);
  const totalEnrolled = Object.values(planStats).reduce((sum, plan) => sum + plan.enrolledCount, 0);
  const totalPaid = Object.values(planStats).reduce((sum, plan) => sum + plan.paidCount, 0);

  const plans = Object.entries(planStats).map(([id, stats]) => ({
    id,
    ...stats,
  }));

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-slate-50 to-blue-50 border-0 hover:shadow-xl transition-all duration-300 group border-t-4 border-t-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <div className="p-1.5 bg-blue-100 rounded-md group-hover:bg-blue-200 transition-colors">
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </div>
            Plan Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-0 hover:shadow-lg transition-all group border-t-4 border-t-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-purple-600 font-semibold uppercase">Total Revenue</p>
              <p className="text-2xl font-bold text-purple-900 mt-1">{formatAmount(totalRevenue)}</p>
            </div>
            <div className="p-3 bg-purple-200 rounded-lg group-hover:bg-purple-300 transition-colors">
              <DollarSign className="h-6 w-6 text-purple-700" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-0 hover:shadow-lg transition-all group border-t-4 border-t-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-600 font-semibold uppercase">Total Enrolled</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">{totalEnrolled}</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-lg group-hover:bg-blue-300 transition-colors">
              <Users className="h-6 w-6 text-blue-700" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-0 hover:shadow-lg transition-all group border-t-4 border-t-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-600 font-semibold uppercase">Paid Students</p>
              <p className="text-2xl font-bold text-green-900 mt-1">{totalPaid}</p>
              <p className="text-xs text-green-600 mt-1">
                {totalEnrolled > 0 ? ((totalPaid / totalEnrolled) * 100).toFixed(1) : 0}% Conversion
              </p>
            </div>
            <div className="p-3 bg-green-200 rounded-lg group-hover:bg-green-300 transition-colors">
              <TrendingUp className="h-6 w-6 text-green-700" />
            </div>
          </div>
        </Card>
      </div>

      {/* Plans Detailed Stats */}
      <Card className="bg-white shadow-sm border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue by Plan</h3>
        <div className="space-y-4">
          {plans.map((plan) => (
            <div key={plan.id} className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:border-blue-300 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                    <p className="text-sm text-gray-600">
                      {plan.enrolledCount} enrolled · {plan.paidCount} paid
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{formatAmount(plan.totalRevenue)}</p>
                  <p className="text-xs text-gray-500">Total Revenue</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-full transition-all duration-300"
                  style={{
                    width: `${totalRevenue > 0 ? (plan.totalRevenue / totalRevenue) * 100 : 0}%`,
                  }}
                />
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Enrolled</p>
                  <p className="text-lg font-bold text-blue-600">{plan.enrolledCount}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Paid</p>
                  <p className="text-lg font-bold text-green-600">{plan.paidCount}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {plan.enrolledCount > 0
                      ? ((plan.paidCount / plan.enrolledCount) * 100).toFixed(0)
                      : 0}
                    %
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">Avg Amount</p>
                  <p className="text-sm font-bold text-purple-600">
                    {formatAmount(plan.avgAmount)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
