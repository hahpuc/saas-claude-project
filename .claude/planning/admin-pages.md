# Admin Pages Plan

## Authentication Pages
- [ ] `/login` — Login page with email/password form
- [ ] `/forgot-password` — Forgot password page
- [ ] `/reset-password` — Reset password page

## Dashboard
- [ ] `/dashboard` — Overview with stats cards, charts, recent activity

## User Management
- [ ] `/users` — Users list with search, filters, pagination
- [ ] `/users/new` — Create new user form
- [ ] `/users/:id` — User detail/edit page

## Organization Management
- [ ] `/organizations` — Organizations list
- [ ] `/organizations/new` — Create organization
- [ ] `/organizations/:id` — Organization detail with members tab

## Plans & Billing
- [ ] `/plans` — Plans list with pricing
- [ ] `/plans/new` — Create plan
- [ ] `/plans/:id` — Plan detail/edit

## Settings
- [ ] `/settings` — System settings page (tabbed)
  - General settings
  - Email configuration
  - Security settings
  - Feature flags

## Audit Logs
- [ ] `/audit-logs` — Searchable audit log table

## Notifications
- [ ] Notification bell in header with dropdown
- [ ] `/notifications` — Full notifications page

## Profile
- [ ] `/profile` — Current user profile edit
- [ ] `/profile/security` — Password change, 2FA settings

## UI Components Needed
- [ ] AdminLayout (sidebar + header + breadcrumb + content)
- [ ] DataTable (reusable with sorting, filtering, pagination)
- [ ] StatsCard (number + trend + icon)
- [ ] StatusBadge (colored badge for status fields)
- [ ] ConfirmDialog (for delete actions)
- [ ] FileUploader (drag & drop)
- [ ] SearchInput (debounced search)
- [ ] DateRangePicker (for filtering)
- [ ] EmptyState (when no data)
- [ ] LoadingSkeleton (table, card, form variants)
