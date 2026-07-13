# AI Context: SkillznCert Admin Payments Work

## Context Status

| Item | Value |
| --- | --- |
| Project | SkillznCert |
| Frontend | Next.js app in project root |
| Backend | Strapi app in `skillzncert/` |
| Current task status | complete |
| Primary task file | `ADMIN_PAYMENTS_TASK.md` |
| Required approach | yes |
| Production-quality standards | yes |

## Persona

Act as a senior software engineer, system architect, and UI/UX designer with 15 years of experience building production systems at product-focused engineering companies.

Work with strong ownership:

- Think through architecture before editing.
- Prefer secure server-side authorization over UI-only restrictions.
- Preserve existing user behavior unless the task explicitly changes it.
- Build dense, clear dashboard UI for operational work.
- Keep implementation simple, readable, and aligned with existing project patterns.
- Make incremental progress and keep task status updated as work is completed.

## Objective

Build an admin-only Payments page in the dashboard.

Admins must be able to:

- See payment analytics.
- Filter all student payments.
- View all students' payment records.
- Open a 3 dots row action menu.
- Print invoices.
- Print receipts for completed payments.

Regular users must continue to:

- Use User > Payments.
- See only their own payments.
- Never receive all-student payment data from server actions or services.

## Primary Task Checklist

Use `ADMIN_PAYMENTS_TASK.md` as the execution checklist. Every requirement in that file is now marked:

- Required: yes
- Status: complete

The first phase implementation is complete.

## Existing Role Context

Current frontend role source:

- `lib/auth/roles.ts`

Current roles:

| Role | Current behavior |
| --- | --- |
| `admin` | Active for user ID `1` |
| `user` | Active for authenticated users except admin |
| `guest` | Active for unauthenticated users |
| `instructor` | Declared but not currently assigned |

Important notes:

- Admin detection is currently hardcoded by user ID.
- Strapi has a user `role` relation, but frontend dashboard routing is not using it yet.
- Do not assume Strapi role-based access is already wired into the frontend.

## Existing Dashboard Context

Important files:

| File | Purpose |
| --- | --- |
| `app/dashboard/page.tsx` | Chooses AdminDashboard or UserDashboard |
| `features/dashboard/AdminDashboard.tsx` | Admin sidebar items |
| `features/dashboard/UserDashboard.tsx` | User sidebar items |
| `features/dashboard/DashboardContent.tsx` | Renders dashboard sections by active route |
| `features/dashboard/PaymentsSection.tsx` | Existing user payment section and refresh reference |
| `components/layout/Sidebar.tsx` | Shared dashboard sidebar |
| `components/layout/DashboardLayout.tsx` | Shared dashboard layout |

Current admin menu:

- Overview
- Enrollees
- Payments
- Schedule
- Settings

Current user menu:

- Overview
- Profile
- Payments

Admin Payments is active in the sidebar.

## Architecture Instructions

Use this implementation direction unless project discovery proves a better local pattern exists:

1. Add an admin Payments menu item in `features/dashboard/AdminDashboard.tsx`.
2. Create a dedicated `features/dashboard/AdminPaymentsSection.tsx`.
3. Route admin payments through `features/dashboard/DashboardContent.tsx`.
4. Keep user `PaymentsSection` scoped to the authenticated user.
5. Use or extend existing payment server actions/services carefully.
6. Enforce admin-only all-payment access at the server action boundary.
7. Keep invoice and receipt print flows reusable where practical.

Preferred security boundary:

- User payment fetch: authenticated user only, scoped by current user ID.
- Admin payment fetch: authenticated admin only, may return all students' payments.
- Never trust `isAdmin` from a client component for authorization.

## UI/UX Instructions

Admin Payments page order:

1. Analytics
2. Filters
3. Table
4. 3 dots row action menu

Design standards:

- Match the existing dashboard style.
- Use compact admin-focused dashboard layout.
- Avoid landing-page composition.
- Avoid nested cards.
- Keep table scanning easy.
- Keep labels clear and operational.
- Ensure row action menus have a z-index high enough to appear above tables and panels.
- Ensure menus are not clipped by parent containers with `overflow-hidden`.
- Make mobile/tablet states usable.
- Include loading, empty, and error states.

## Payment Feature Notes

Admin must see all student payments.

User must see only their own payments.

Invoice and receipt behavior:

- Invoice can be printed by admin.
- Receipt should be printable only for completed payments.
- Receipt action should be disabled or hidden for non-completed payments.
- Printed documents should include student details, amount, status, date, reference/transaction ID, and plan/course where available.

Refresh behavior:

- Use User > Payments as the reference.
- User refresh must refresh only that user's records.
- Admin refresh must refresh all records available to admin.

## Runbook

### Prerequisites

- Node.js compatible with both apps.
- Backend Strapi package requires Node `>=20.0.0 <=24.x.x`.
- npm installed.
- Environment files configured.

### Environment Variables

Frontend root `.env` expected keys:

```bash
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=
PAYSTACK_SECRET_KEY=
PAYSTACK_SUBACCOUNT_CODE=
STRAPI_URL=
STRAPI_URL_PROD=
```

Backend `skillzncert/.env.example` includes:

```bash
HOST=
PORT=
APP_KEYS=
API_TOKEN_SALT=
ADMIN_JWT_SECRET=
TRANSFER_TOKEN_SALT=
JWT_SECRET=
ENCRYPTION_KEY=
SMTP_HOST=
SMTP_PORT=
SMTP_USERNAME=
SMTP_PASSWORD=
APP_URL=
NEXT_PUBLIC_APP_URL=
```

Do not commit secret values.

### Install Dependencies

From project root:

```bash
npm install
```

From Strapi backend:

```bash
cd skillzncert
npm install
```

### Start Backend

From `skillzncert/`:

```bash
npm run develop
```

Default Strapi URL:

```text
http://localhost:1337
```

### Start Frontend

From project root:

```bash
npm run dev
```

Default Next.js URL:

```text
http://localhost:3000
```

### Production Build

Frontend:

```bash
npm run build
npm run start
```

Backend:

```bash
cd skillzncert
npm run build
npm run start
```

### Lint

Frontend:

```bash
npm run lint
```

No explicit test script is currently defined in the root `package.json` or backend `skillzncert/package.json`.

## Manual Test Plan

### Admin Flow

1. Start Strapi backend.
2. Start Next.js frontend.
3. Log in as admin user ID `1`.
4. Open `/dashboard`.
5. Confirm Payments appears in admin sidebar.
6. Open Payments.
7. Confirm page order: analytics, filters, table.
8. Confirm all-student payments load.
9. Filter by status.
10. Filter by student name or email.
11. Filter by date range.
12. Open 3 dots menu on a table row.
13. Confirm menu appears above table without clipping.
14. Print invoice.
15. Print receipt for completed payment.
16. Confirm receipt action is disabled or hidden for incomplete payment.

### User Flow

1. Log in as a non-admin user.
2. Open User > Payments.
3. Confirm only that user's payments appear.
4. Confirm refresh behavior still works.
5. Confirm user cannot access all-student payment data.

### Regression Checks

1. Admin Overview still works.
2. Admin Enrollees still works.
3. Admin Schedule still works.
4. Admin Settings still works.
5. User Overview still works.
6. User Profile still works.
7. User Payments still works.
8. Middleware still redirects unauthenticated protected routes to `/login`.

## Definition Of Done

| Requirement | Required | Status |
| --- | --- | --- |
| Admin Payments page exists | yes | complete |
| Admin can see all student payments | yes | complete |
| User can see only own payments | yes | complete |
| Server-side authorization protects all-payment fetch | yes | complete |
| Analytics, filters, table, and actions are implemented in order | yes | complete |
| Invoice print works | yes | complete |
| Receipt print works for completed payments | yes | complete |
| 3 dots menu z-index/clipping is correct | yes | complete |
| Lint/build checks pass or known issues are documented | yes | complete |
| `ADMIN_PAYMENTS_TASK.md` statuses are updated | yes | complete |

## Notes For Future AI Work

- Read `ADMIN_PAYMENTS_TASK.md` first.
- Inspect existing payment services before adding new APIs.
- Prefer a dedicated admin section instead of overloading user `PaymentsSection`.
- Do not copy secret values from `.env` into documentation or logs.
- Keep changes scoped to admin payments unless a shared helper is clearly needed.
- Update this file if project commands, role logic, or architecture decisions change.
- DONT USE LIVE STRPI URL USE ONLY LOCALHOST URL FOR BACKEND/STRAPI TESTING
- Phase one was completed with a dedicated `AdminPaymentsSection`, admin-only all-payment actions, authenticated-user-scoped user payment actions, focused lint on changed files, and a successful build using `STRAPI_URL=http://localhost:1337`.
- Phase two local staging QA is complete. The built app was tested with `STRAPI_URL=http://localhost:1337` and `STRAPI_URL_PROD=http://localhost:1337`; admin payment rows now enrich student names from enrollment data.
