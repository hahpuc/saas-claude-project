# Testing Rules

## General
- Every new feature MUST include tests
- Minimum coverage target: 80% (statements, branches, functions, lines)
- Tests MUST be deterministic (no flaky tests allowed)
- Use descriptive test names: `should {expected behavior} when {condition}`
- Group tests with `describe` blocks matching the class/function name

## Backend Testing (Jest)
- **Unit tests** for all services (mock repository/dependencies)
- **Controller tests** using `@nestjs/testing` TestingModule
- **Integration tests** for critical API flows using Supertest
- **E2E tests** in `test/` directory for full API workflows
- Use factories for test data (no hardcoded test objects)
- Mock external services (email, payment, etc.)
- Test error cases and edge cases, not just happy paths

## Frontend Testing (Vitest + Testing Library)
- Test user behavior, not implementation details
- Use `screen.getByRole()` and `screen.getByText()` over `getByTestId()`
- Test loading, error, and empty states
- Test form validation
- Mock API calls with MSW (Mock Service Worker)
- Avoid testing CSS or styling details

## Test File Naming
- Backend: `{name}.spec.ts` (co-located with source)
- Backend E2E: `test/{name}.e2e-spec.ts`
- Frontend: `{name}.test.tsx` (co-located with source)

## What NOT to Test
- Framework internals (NestJS decorators, React rendering)
- Third-party library behavior
- Static types (TypeScript handles this)
- Trivial getters/setters
