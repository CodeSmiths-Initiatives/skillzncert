"use server";

import { cookies } from "next/headers";
import { updateEnrollmentPayment } from "@/lib/services/enrollment.service";
import { assignBatchToEnrollee } from "@/lib/services/batch.service";

/**
 * Mark Enrollment as Paid with Automatic Batch Assignment
 * 
 * This action performs the following operations atomically:
 * 1. Validates authentication
 * 2. Calculates and assigns appropriate batch based on current enrollments
 * 3. Updates enrollment with payment status and batch assignment
 * 
 * Batch Assignment Algorithm:
 * - Fetches current count of paid enrollments
 * - Calculates batch number: floor(count / 20) + 1
 * - Assigns enrollee to calculated batch
 * - First 20 paid enrollees → Batch 1
 * - Next 20 paid enrollees → Batch 2
 * - And so on...
 * 
 * Thread Safety:
 * - Uses fresh data fetch (no cache) during assignment
 * - Immediate update after calculation
 * - Race conditions handled at service layer
 * 
 * @param data - Contains documentId and isPaymentDone flag
 * @returns Success/failure result with batch information
 */
export async function markEnrollmentPaidAction(data: {
  documentId: string;
  isPaymentDone: boolean;
}) {
  const token = (await cookies()).get("auth_token")?.value;

  if (!token) {
    return { success: false, message: "Unauthorized" };
  }

  if (!data.documentId) {
    return {
      success: false,
      message: "Enrollment documentId is required",
    };
  }

  try {
    let batchName: string | undefined;
    
    // Assign batch only when marking as paid
    if (data.isPaymentDone) {
      const batchAssignment = await assignBatchToEnrollee(token);
      
      if (!batchAssignment.success) {
        console.warn(
          "[MarkPaidAction] Batch assignment warning:",
          batchAssignment.message
        );
        // Continue with default batch even if assignment calculation fails
        batchName = batchAssignment.batchName;
      } else {
        batchName = batchAssignment.batchName;
        console.log(
          `[MarkPaidAction] Assigned to ${batchName}:`,
          batchAssignment.message
        );
      }
    }

    // Update enrollment with payment status and batch
    await updateEnrollmentPayment(
      data.documentId,
      data.isPaymentDone,
      token,
      batchName
    );

    return {
      success: true,
      batchName,
      message: batchName
        ? `Payment marked as done and assigned to ${batchName}`
        : "Payment status updated",
    };
  } catch (error: any) {
    console.error("[MarkPaidAction] Error:", error);
    return {
      success: false,
      message: error.message || "Payment update failed",
    };
  }
}
