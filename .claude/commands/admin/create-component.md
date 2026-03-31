Create a new reusable UI component for the admin dashboard.

Arguments:
- $COMPONENT_NAME — PascalCase component name (e.g., "DataCard", "StatusBadge", "ConfirmDialog")
- $COMPONENT_TYPE — Type: "ui" (primitive) or "composite" (complex/feature-specific)

Steps:
1. Create component at:
   - UI primitive: `packages/admin/src/components/ui/$COMPONENT_NAME.tsx`
   - Composite: `packages/admin/src/components/$COMPONENT_NAME/$COMPONENT_NAME.tsx`
2. Generate files:
   - Main component file with TypeScript props interface
   - `$COMPONENT_NAME.stories.tsx` (if Storybook is configured)
   - Export from components barrel file
3. Requirements:
   - Use React.forwardRef for UI primitives
   - Support className prop with cn() utility (tailwind-merge + clsx)
   - Use CVA (class-variance-authority) for variants
   - Include JSDoc comments on the props interface
   - Support dark mode with Tailwind dark: classes
   - Make accessible (ARIA attributes, keyboard navigation)
4. Follow shadcn/ui patterns and conventions
