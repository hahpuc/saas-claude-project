# React Admin Frontend Rules

## Feature Structure
Every feature MUST follow this structure:
```
features/{name}/
├── index.tsx                    # Barrel export
├── pages/
│   ├── {name}-list.page.tsx     # List page
│   ├── {name}-detail.page.tsx   # Detail/edit page
│   └── {name}-create.page.tsx   # Create page
├── components/
│   ├── {name}-table.tsx         # Table with columns
│   ├── {name}-form.tsx          # Form component
│   └── {name}-filters.tsx       # Filters/search
├── hooks/
│   └── use-{name}.ts            # TanStack Query hooks
├── api/
│   └── {name}.api.ts            # API client functions
├── types/
│   └── {name}.types.ts          # TypeScript types
└── schemas/
    └── {name}.schema.ts         # Zod schemas
```

## Component Rules
- One component per file
- Use function components with TypeScript (never class components)
- Props interface defined above the component
- Use `React.forwardRef` for UI primitives
- Use `cn()` utility for conditional classNames
- No inline styles — TailwindCSS only
- Extract components when JSX exceeds 100 lines
- Memoize expensive computations with `useMemo`
- Memoize callbacks passed to children with `useCallback`

## State Management
- **Server state:** TanStack Query (never store API data in Zustand)
- **UI state:** Zustand stores in `stores/` directory
- **Form state:** React Hook Form
- **URL state:** React Router searchParams
- Never duplicate state between different sources

## API Layer
- All API calls go through the `api/` directory using axios instance
- Use the shared axios instance from `lib/axios.ts` (with interceptors)
- Type ALL request/response data
- Handle errors in the API layer, throw custom errors for the UI

## Hook Rules
- Custom hooks in `hooks/` directory
- TanStack Query hooks follow naming: `use{Entity}List`, `use{Entity}Detail`, `use{Entity}Create`, `use{Entity}Update`, `use{Entity}Delete`
- Always set appropriate `staleTime`, `gcTime`
- Use `useMutation` with `onSuccess` to invalidate related queries
- Show toast notifications on mutation success/error

## Form Rules
- Use React Hook Form with Zod resolver
- Define Zod schema in `schemas/` directory
- Reuse schemas between create and update forms where possible
- Show field-level errors
- Disable submit button during submission
- Reset form after successful submission

## Routing
- Lazy load all page components
- Route structure: `/{feature}`, `/{feature}/new`, `/{feature}/:id`
- Use layout routes for shared layouts
- Protected routes wrapped with `AuthGuard` component

## Styling
- Use TailwindCSS exclusively
- Use shadcn/ui components as the base design system
- Support dark mode with `dark:` prefix
- Use responsive classes for mobile compatibility
- Color tokens via CSS variables (not hardcoded colors)

## Error Handling
- Error boundaries for each feature
- Fallback UI for loading/error/empty states
- Toast notifications for user actions (success, error)
- Network error handling with retry logic (TanStack Query)
