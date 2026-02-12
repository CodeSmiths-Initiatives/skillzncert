/**
 * enrollment controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::enrollment.enrollment",
  ({ strapi }) => ({
    async create(ctx) {
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized("Login required");
      }

      // 🔒 Prevent duplicate enrollment per user
      const existing = await strapi.entityService.findMany(
        "api::enrollment.enrollment",
        {
          filters: { user: user.id },
        },
      );

      if (existing.length > 0) {
        return ctx.badRequest("Enrollment already exists for this user");
      }

      // 🔐 Attach user securely
      ctx.request.body.data.user = user.id;

      // Create enrollment
      const response = await super.create(ctx);

      // 📧 Send enrollment confirmation email
      try {
        const enrollmentData = ctx.request.body.data;
        const emailBody = getEnrollmentConfirmationEmail(
          enrollmentData.firstName,
          enrollmentData.lastName,
          user.email,
        );

        await strapi.plugins["email"].services.email.send({
          to: user.email,
          from: process.env.SMTP_USERNAME || "noreply@skillzncert.com",
          subject: "✅ Enrollment Submitted Successfully - SkillznCert",
          html: emailBody,
        });

        console.log("✅ Enrollment confirmation email sent to:", user.email);
      } catch (emailError) {
        console.error("❌ Error sending enrollment email:", emailError);
        // Don't fail the enrollment if email fails
      }

      return response;
    },
  }),
);

function getEnrollmentConfirmationEmail(
  firstName: string,
  lastName: string,
  email: string,
) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enrollment Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
          
          <!-- Modern Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 60px 40px; text-align: center;">
              <h1 style="margin: 0 0 10px 0; color: #10b981; font-size: 32px; font-weight: 600; letter-spacing: -0.5px;">
                ✓ Enrollment Confirmed
              </h1>
              <p style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 400;">
                Welcome to SkillznCert
              </p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 50px 40px;">
              <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 22px; font-weight: 600;">
                Hello ${firstName} ${lastName},
              </h2>
              
              <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.7;">
                Thank you for submitting your enrollment application to SkillznCert! We've successfully received your information.
              </p>

              <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.7;">
                Please proceed with the payment to complete your enrollment and enjoy our services.
              </p>

              <!-- Status Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td style="padding: 30px; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border-radius: 12px; border: 1px solid #86efac;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 50px; vertical-align: top;">
                          <div style="width: 42px; height: 42px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                            <span style="color: #ffffff; font-size: 24px;">✓</span>
                          </div>
                        </td>
                        <td style="padding-left: 15px;">
                          <p style="margin: 0 0 8px 0; color: #1f2937; font-size: 18px; font-weight: 600;">
                            Application Status: Confirmed
                          </p>
                          <p style="margin: 0; color: #059669; font-size: 14px; line-height: 1.6; font-weight: 500;">
                            Your enrollment has been successfully submitted. Please complete the payment to activate your account.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Next Steps -->
              <p style="margin: 30px 0 20px 0; color: #1f2937; font-size: 18px; font-weight: 600;">
                What's Next?
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="padding: 20px; background-color: #f3f4f6; border-radius: 8px; border-left: 4px solid #3b82f6;">
                    <p style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
                      1️⃣ Application Review
                    </p>
                    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                      Our team will review your submitted documents and information within 1-2 business days.
                    </p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="padding: 20px; background-color: #f3f4f6; border-radius: 8px; border-left: 4px solid #8b5cf6;">
                    <p style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
                      2️⃣ Payment Instructions
                    </p>
                    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                      Once approved, you'll receive payment details to complete your enrollment.
                    </p>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="padding: 20px; background-color: #f3f4f6; border-radius: 8px; border-left: 4px solid #f59e0b;">
                    <p style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
                      3️⃣ Start Learning
                    </p>
                    <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                      After payment confirmation, you'll get access to your course materials and batch schedule.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 30px 0 10px 0; color: #4b5563; font-size: 14px; line-height: 1.6;">
                If you have any questions, feel free to contact our support team. We're here to help!
              </p>

              <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.6;">
                Best regards,<br/>
                The SkillznCert Team 🚀
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 30px 40px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; text-align: center;">
                <strong>SkillznCert</strong> - Your Path to Professional Excellence
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center; line-height: 1.5;">
                This email was sent to ${email} regarding your enrollment application.<br/>
                © ${new Date().getFullYear()} SkillznCert. All rights reserved.
              </p>
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
