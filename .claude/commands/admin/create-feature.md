Create a new admin page/feature with full CRUD interface.

Arguments: $FEATURE_NAME — The feature name (e.g., "users", "products", "orders")

Steps:
1. Create the feature directory at `packages/admin/src/features/$FEATURE_NAME/`
2. Generate these files:
   - `index.tsx` — Feature barrel export
   - `pages/$FEATURE_NAME-list.page.tsx` — List page with TanStack Table, search, filters, pagination
   - `pages/$FEATURE_NAME-detail.page.tsx` — Detail/edit page with form
   - `pages/$FEATURE_NAME-create.page.tsx` — Create page with form
   - `components/$FEATURE_NAME-table.tsx` — Table component with columns definition
   - `components/$FEATURE_NAME-form.tsx` — Form component with React Hook Form + Zod validation
   - `components/$FEATURE_NAME-filters.tsx` — Filter/search sidebar component
   - `hooks/use-$FEATURE_NAME.ts` — TanStack Query hooks (list, detail, create, update, delete)
   - `api/$FEATURE_NAME.api.ts` — API client functions using axios
   - `types/$FEATURE_NAME.types.ts` — TypeScript types for the feature
   - `schemas/$FEATURE_NAME.schema.ts` — Zod validation schemas
3. Add routes to the router configuration
4. Add sidebar navigation entry
5. Use shadcn/ui components (Table, Dialog, Form, Input, Button, etc.)
6. Include loading states, error handling, and toast notifications
7. Make the list page responsive with proper mobile layout

Follow React and project conventions from CLAUDE.md.
