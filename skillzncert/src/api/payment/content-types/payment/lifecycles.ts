const ADMIN_PAYMENT_NOTIFICATION_EMAILS = [
  "nitesh.sukalikar49@gmail.com",
  "aliyuthayo@gmail.com",
];

type PaymentRecord = {
  id?: number;
  documentId?: string;
  userDocumentId?: string;
  enrollmentDocumentId?: string;
  paymentMode?: string;
  month?: string;
  year?: number;
  amount?: number | string;
  emailAddress?: string;
  paymentDate?: string;
  reference?: string;
  planId?: string;
  planName?: string;
  planAmount?: number | string;
  planDiscount?: number;
  expiryDate?: string;
  nextPaymentDate?: string;
  createdAt?: string;
};

type EnrollmentRecord = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  universityAttending?: string;
  batchName?: string;
  user?: {
    username?: string;
    email?: string;
  };
};

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatCurrency(value: unknown) {
  const amount = Number(value || 0);

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value?: string) {
  if (!value) return "N/A";

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getFullName(enrollment?: EnrollmentRecord | null, fallback?: string) {
  const fullName = [enrollment?.firstName, enrollment?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || enrollment?.user?.username || fallback || "Student";
}

async function findEnrollment(payment: PaymentRecord) {
  if (!payment.enrollmentDocumentId) return null;

  try {
    return await strapi.documents("api::enrollment.enrollment").findOne({
      documentId: payment.enrollmentDocumentId,
      populate: ["user"],
    });
  } catch (error) {
    strapi.log.warn(
      `[PaymentNotification] Unable to fetch enrollment ${payment.enrollmentDocumentId}: ${error}`,
    );
    return null;
  }
}

function buildPaymentNotificationEmail(
  payment: PaymentRecord,
  enrollment?: EnrollmentRecord | null,
) {
  const studentName = getFullName(enrollment, payment.emailAddress);
  const planName = payment.planName || payment.planId || "Selected plan";
  const amount = formatCurrency(payment.amount);
  const paidAt = formatDate(payment.paymentDate || payment.createdAt);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Payment Completed</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#111827;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">
          <tr>
            <td style="background:#0f766e;padding:28px 32px;">
              <p style="margin:0 0 8px;color:#ccfbf1;font-size:13px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">SkillznCert Payment Alert</p>
              <h1 style="margin:0;color:#ffffff;font-size:26px;line-height:1.25;">Payment completed successfully</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:30px 32px;">
              <p style="margin:0 0 22px;color:#374151;font-size:15px;line-height:1.65;">
                A student has completed a payment. The payment record has been created successfully in SkillznCert.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
                ${detailRow("Student name", studentName)}
                ${detailRow("Student email", payment.emailAddress || enrollment?.user?.email || "N/A")}
                ${detailRow("Phone number", enrollment?.phoneNumber || "N/A")}
                ${detailRow("Institution", enrollment?.universityAttending || "N/A")}
                ${detailRow("Plan", planName)}
                ${detailRow("Amount paid", amount)}
                ${detailRow("Payment mode", payment.paymentMode || "Online")}
                ${detailRow("Payment date", paidAt)}
                ${detailRow("Reference", payment.reference || "N/A")}
                ${detailRow("Batch", enrollment?.batchName || "Pending")}
                ${detailRow("Payment record", payment.documentId || payment.id || "N/A")}
              </table>

              <p style="margin:24px 0 0;color:#6b7280;font-size:13px;line-height:1.5;">
                This is an automated admin notification. Please verify the transaction in Paystack/admin dashboard if reconciliation is required.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:18px 32px;text-align:center;">
              <p style="margin:0;color:#6b7280;font-size:12px;">SkillznCert Admin Notifications</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

function detailRow(label: string, value: unknown) {
  return `
    <tr>
      <td style="width:38%;padding:13px 16px;background:#f9fafb;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;font-weight:700;">${escapeHtml(label)}</td>
      <td style="padding:13px 16px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:14px;">${escapeHtml(value || "N/A")}</td>
    </tr>
  `;
}

export default {
  async afterCreate(event) {
    const payment = event.result as PaymentRecord;

    try {
      const enrollment = await findEnrollment(payment);
      const studentName = getFullName(enrollment, payment.emailAddress);
      const planName = payment.planName || payment.planId || "Selected plan";

      await strapi.plugins["email"].services.email.send({
        to: ADMIN_PAYMENT_NOTIFICATION_EMAILS,
        from: process.env.SMTP_FROM || process.env.SMTP_USERNAME,
        subject: `Payment completed: ${studentName} - ${planName}`,
        html: buildPaymentNotificationEmail(payment, enrollment),
      });

      strapi.log.info(
        `[PaymentNotification] Admin payment email sent to ${ADMIN_PAYMENT_NOTIFICATION_EMAILS.join(", ")}`,
      );
    } catch (error) {
      strapi.log.error(`[PaymentNotification] Failed to send email: ${error}`);
    }
  },
};
