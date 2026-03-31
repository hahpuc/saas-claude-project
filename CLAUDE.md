# SaaS Project — Claude Code Configuration

## Project Overview

A modern SaaS application with:
- **Backend API** — NestJS (latest) with modular architecture, TypeORM, PostgreSQL, Redis, JWT auth, RBAC, Swagger docs
- **Admin Website** — React (latest) with Vite, TailwindCSS, React Router, TanStack Query, Zustand, shadcn/ui

## Monorepo Structure

```
saas-project/
├── packages/
│   ├── api/          # NestJS Backend API
│   ├── admin/        # React Admin Dashboard
│   └── shared/       # Shared types, utils, constants
├── .claude/          # Claude Code project config
├── docker/           # Docker configurations
├── scripts/          # Build & deploy scripts
└── docs/             # Project documentation
```

## Tech Stack

### Backend (packages/api)
- **Runtime:** Node.js 24+
- **Framework:** NestJS 11 (latest)
- **ORM:** TypeORM with PostgreSQL
- **Cache:** Redis (ioredis)
- **Auth:** Passport + JWT + Refresh Tokens
- **Validation:** class-validator + class-transformer
- **Docs:** Swagger/OpenAPI via @nestjs/swagger
- **Testing:** Jest + Supertest
- **Logging:** Winston + Morgan

### Admin Frontend (packages/admin)
- **Framework:** React 19 (latest)
- **Build:** Vite 6+
- **Styling:** TailwindCSS 4 + shadcn/ui
- **Routing:** React Router 7
- **State:** Zustand
- **Data Fetching:** TanStack Query v5
- **Forms:** React Hook Form + Zod
- **Tables:** TanStack Table v8
- **Icons:** Lucide React
- **Testing:** Vitest + Testing Library

### Shared (packages/shared)
- TypeScript types & interfaces
- API response/request DTOs
- Constants & enums
- Utility functions

## Conventions

### Code Style
- Use TypeScript strict mode everywhere
- Use ESM imports (no CommonJS)
- Prefer `const` over `let`, never use `var`
- Use async/await, never raw Promises with .then()
- Use named exports, avoid default exports
- Maximum file length: 300 lines (split if longer)

### Naming
- Files: kebab-case (e.g., `user-profile.service.ts`)
- Classes: PascalCase (e.g., `UserProfileService`)
- Functions/Variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Interfaces: PascalCase with `I` prefix only for external contracts
- Types: PascalCase
- Enums: PascalCase with PascalCase members
- Database tables: snake_case
- API endpoints: kebab-case, plural nouns

### Git & Workflow (MANDATORY)
- Branch format: `feat/`, `fix/`, `refactor/`, `docs/`, `chore/`
- Commit format: `type(scope): description` (conventional commits)
- Always create feature branches, never commit to main directly
- **After EVERY completed feature/task, you MUST:**
  1. Review & clean code → see `.claude/skills/workflow/code-review.md`
  2. Commit with conventional format → see `.claude/skills/workflow/git-workflow.md`
  3. Push and create PR → see `.claude/skills/workflow/git-workflow.md`
  4. Or use the `/shared/finish-feature` command to do all 3 steps at once

### API Design
- RESTful endpoints with versioning (`/api/v1/`)
- Standard response envelope: `{ success, data, message, meta }`
- Pagination: `?page=1&limit=20&sort=createdAt&order=desc`
- Error format: `{ success: false, error: { code, message, details } }`
- Use HTTP status codes correctly

### Testing
- Unit tests for all services and utilities
- Integration tests for API endpoints
- Minimum 80% coverage target
- Test files co-located: `*.spec.ts`
