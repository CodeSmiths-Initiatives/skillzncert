"use server";

import { cookies } from "next/headers";

import {
  fetchPaginatedEnrollments,
  type EnrolleeData,
  type EnrollmentDashboardCounts,
  type EnrollmentPagination,
  type FetchEnrollmentsParams,
} from "@/lib/services/enrollment.service";

type GetAllEnrollmentsResult =
  | {
      success: true;
      data: EnrolleeData[];
      pagination: EnrollmentPagination;
      counts: EnrollmentDashboardCounts;
    }
  | {
      success: false;
      message: string;
      data: EnrolleeData[];
      pagination: EnrollmentPagination;
      counts: EnrollmentDashboardCounts;
    };

const emptyPagination: EnrollmentPagination = {
  page: 1,
  pageSize: 10,
  pageCount: 0,
  total: 0,
};

const emptyCounts: EnrollmentDashboardCounts = {
  total: 0,
  completed: 0,
  inProgress: 0,
  activeBatches: 0,
};

export async function getAllEnrollments(
  params: FetchEnrollmentsParams = {},
): Promise<GetAllEnrollmentsResult> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Unauthorized",
        data: [],
        pagination: emptyPagination,
        counts: emptyCounts,
      };
    }

    const result = await fetchPaginatedEnrollments(token, params);

    return {
      success: true,
      data: result.data,
      pagination: result.pagination,
      counts: result.counts,
    };
  } catch (error) {
    console.error("Get enrollments error:", error);

    return {
      success: false,
      message: "Failed to fetch enrollments",
      data: [],
      pagination: emptyPagination,
      counts: emptyCounts,
    };
  }
}
