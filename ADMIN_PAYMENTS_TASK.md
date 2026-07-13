# Admin Payments Page Task Plan

## Status

Overall status: complete

## Objective

Create an admin-only payments page inside the dashboard where admins can view all student payments, understand payment analytics, filter records, and print invoices or receipts. Regular users must continue to see only their own payments in User > Payments.

## Role Rules

| Requirement | Required | Status |
| --- | --- | --- |
| Admin can view all students' payments | yes | complete |
| User can view only their own payments | yes | complete |
| Guest cannot access payment dashboard pages | yes | complete |
| Admin payment access must be enforced server-side, not only by UI | yes | complete |
| User payment queries must be scoped to the authenticated user | yes | complete |

## Admin Side Menu

| Requirement | Required | Status |
| --- | --- | --- |
| Add Payments to admin sidebar | yes | complete |
| Keep existing admin menu items: Overview, Enrollees, Schedule, Settings | yes | complete |
| Route admin Payments to the payments dashboard content | yes | complete |
| User Payments menu remains unchanged | yes | complete |

## Admin Payments Page Layout

The admin payments page order must be:

1. Analytics
2. Filters
3. Payments table
4. Row actions menu

| Requirement | Required | Status |
| --- | --- | --- |
| Analytics appears first | yes | complete |
| Filters appear after analytics | yes | complete |
| Payments table appears after filters | yes | complete |
| Each table row has an actions button using a 3 dots menu | yes | complete |
| Actions menu has correct z-index and is not clipped by table/card overflow | yes | complete |
| Page is responsive on mobile, tablet, and desktop | yes | complete |
| Empty, loading, and error states are handled cleanly | yes | complete |

## Analytics Requirements

| Requirement | Required | Status |
| --- | --- | --- |
| Show total completed payments | yes | complete |
| Show total revenue from completed payments | yes | complete |
| Show pending payments count or amount | yes | complete |
| Show overdue payments count or amount when available | yes | complete |
| Analytics must be derived from admin-visible payment data | yes | complete |
| Analytics cards must use consistent dashboard design patterns | yes | complete |

## Filter Requirements

| Requirement | Required | Status |
| --- | --- | --- |
| Filter by payment status | yes | complete |
| Filter by student name or email | yes | complete |
| Filter by plan/course where data exists | yes | complete |
| Filter by date range | yes | complete |
| Reset filters action | yes | complete |
| Filters should not break pagination or table state | yes | complete |

## Table Requirements

| Requirement | Required | Status |
| --- | --- | --- |
| Show student name | yes | complete |
| Show student email | yes | complete |
| Show amount | yes | complete |
| Show payment status | yes | complete |
| Show payment reference or transaction ID | yes | complete |
| Show plan/course name where available | yes | complete |
| Show payment date | yes | complete |
| Show due date where available | yes | complete |
| Show row actions button | yes | complete |
| Support pagination or a safe page size limit | yes | complete |

## Row Actions

| Requirement | Required | Status |
| --- | --- | --- |
| Use 3 dots button for row actions | yes | complete |
| Show menu list on click | yes | complete |
| Menu has proper z-index above table and panels | yes | complete |
| Action: view payment details | yes | complete |
| Action: print invoice | yes | complete |
| Action: print receipt | yes | complete |
| Disable receipt printing when payment is not completed | yes | complete |
| Actions should be keyboard accessible | yes | complete |

## Print Requirements

| Requirement | Required | Status |
| --- | --- | --- |
| Admin can print invoice | yes | complete |
| Admin can print receipt for completed payment | yes | complete |
| Printed document includes student details | yes | complete |
| Printed document includes payment details | yes | complete |
| Printed document includes amount and status | yes | complete |
| Printed document includes reference/transaction ID | yes | complete |
| Printed document uses a clean print layout | yes | complete |
| Existing user payment print behavior must not regress | yes | complete |

## Refresh Requirement

| Requirement | Required | Status |
| --- | --- | --- |
| Use the existing user Payments implementation as reference for refresh behavior | yes | complete |
| After payment data changes, the visible payment list refreshes | yes | complete |
| User Payments continues to refresh only the authenticated user's data | yes | complete |
| Admin Payments refreshes all student payment data available to admin | yes | complete |

## Data And Security Standards

| Requirement | Required | Status |
| --- | --- | --- |
| Reuse existing payment services where possible | yes | complete |
| Add admin-specific service/action only when required | yes | complete |
| Do not expose all-payment APIs to regular users | yes | complete |
| Validate admin access in server action/service boundary | yes | complete |
| Avoid trusting client-provided role state | yes | complete |
| Keep payment amount formatting consistent | yes | complete |
| Keep transaction references visible for support/debugging | yes | complete |

## UI/UX Standards

| Requirement | Required | Status |
| --- | --- | --- |
| Match existing dashboard visual language | yes | complete |
| Use clear admin-focused labels | yes | complete |
| Keep dense operational layout, not landing-page style | yes | complete |
| Use icons for compact action buttons where appropriate | yes | complete |
| Avoid nested cards and unnecessary decorative UI | yes | complete |
| Ensure text does not overflow table cells or buttons | yes | complete |
| Ensure dropdown menus are visually polished and easy to scan | yes | complete |

## Suggested Implementation Files

| File | Purpose | Required | Status |
| --- | --- | --- | --- |
| `features/dashboard/AdminDashboard.tsx` | Add admin Payments side menu item | yes | complete |
| `features/dashboard/DashboardContent.tsx` | Route admin payments content | yes | complete |
| `features/dashboard/PaymentsSection.tsx` | Reuse or separate user payment flow carefully | yes | complete |
| `features/dashboard/AdminPaymentsSection.tsx` | Recommended admin-specific payment screen | yes | complete |
| `actions/payment/get-payments.actions.ts` | Admin all-payments server action review/update | yes | complete |
| `actions/payment/get-user-payments.actions.ts` | Confirm user-only scoping remains intact | yes | complete |
| `lib/services/payment.service.ts` | Confirm support for all/admin and user payment queries | yes | complete |

## Acceptance Criteria

| Requirement | Required | Status |
| --- | --- | --- |
| Admin sees Payments in sidebar | yes | complete |
| Admin Payments page loads analytics, filters, and table in correct order | yes | complete |
| Admin can see payments from multiple students | yes | complete |
| Admin can print invoice | yes | complete |
| Admin can print receipt for completed payment | yes | complete |
| User can only see their own payments | yes | complete |
| User cannot access all-student payment data through UI or server actions | yes | complete |
| 3 dots menu renders above table with correct z-index | yes | complete |
| No regression in User > Payments behavior | yes | complete |

## Testing Checklist

| Test | Required | Status |
| --- | --- | --- |
| Admin dashboard menu includes Payments | yes | complete |
| Admin can load all payment rows | yes | complete |
| Admin filters by status | yes | complete |
| Admin filters by student search | yes | complete |
| Admin filters by date range | yes | complete |
| Admin prints invoice | yes | complete |
| Admin prints receipt for completed payment | yes | complete |
| Receipt action disabled or hidden for incomplete payment | yes | complete |
| Regular user sees only own payments | yes | complete |
| Regular user cannot fetch all payments | yes | complete |
| Mobile layout is usable | yes | complete |
| Actions menu is not clipped and appears above surrounding UI | yes | complete |

## Notes

- The current admin menu has Payments commented out. This task should restore it with the correct admin-only experience.
- The current user Payments page should be treated as the refresh behavior reference.
- The best architecture is likely a dedicated `AdminPaymentsSection` so admin all-student behavior does not leak into the existing user payment screen.
- Server-side authorization is mandatory because hiding UI is not sufficient protection.

## Implementation Notes

- Phase one complete: admin sidebar routing, admin payments analytics, filters, paginated table, fixed-position row actions menu, invoice printing, and completed-payment receipt printing are implemented.
- Server actions now enforce admin-only access for all-payment and enrollment-payment fetches. User payment and due fetches are scoped to the authenticated user from server cookies.
- Verification passed: focused ESLint on changed files and `npm run build` with `STRAPI_URL=http://localhost:1337`.
- Full `npm run lint` still fails on pre-existing repository issues outside this task, including generated Strapi `dist` files, older explicit `any` usage, and unrelated React lint findings.
- The build logs an existing `/payment/verify` dynamic server usage warning during static generation, but the build exits successfully.

## Phase 2 Local Staging QA

Status: complete

- Verified local Strapi directly at `http://localhost:1337`: admin user ID `1`, 1 payment, and 3 payment dues are available in local staging data.
- Ran the built Next.js app locally with both `STRAPI_URL` and `STRAPI_URL_PROD` forced to `http://localhost:1337` so `.env.production` could not point the test at a non-local backend.
- Verified admin login, Payments sidebar navigation, analytics, filters, table rows, reset filters, row details modal, pending-row disabled receipt action, completed-row enabled receipt action, and mobile drawer navigation.
- Fixed admin payment rows to enrich student names from enrollment data, so records show `Alex Test` instead of falling back to email when enrollment data is available.
- Verification passed: focused ESLint on changed files and `npm run build` with local Strapi environment variables.
