# SaaS Project

A modern SaaS application built with NestJS (Backend API) and React (Admin Dashboard).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend API | NestJS 11, TypeORM, PostgreSQL, Redis |
| Admin Frontend | React 19, Vite 6, TailwindCSS 4, shadcn/ui |
| Shared | TypeScript types, enums, utilities |
| Auth | JWT + Refresh Tokens, RBAC |
| Testing | Jest (API), Vitest (Admin) |

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp packages/api/.env.example packages/api/.env
cp packages/admin/.env.example packages/admin/.env

# Start development
npm run dev
```

## Project Structure

```
saas-project/
├── packages/
│   ├── api/          # NestJS Backend API (port 3000)
│   ├── admin/        # React Admin Dashboard (port 5173)
│   └── shared/       # Shared TypeScript types & utils
├── .claude/          # Claude Code configuration
│   ├── commands/     # Claude custom commands
│   ├── rules/        # Code rules & conventions
│   ├── skills/       # Development skills
│   ├── planning/     # Project planning docs
│   ├── scripts/      # Build & deploy scripts
│   └── docs/         # Architecture docs
└── docker/           # Docker configurations
```

## Claude Code Commands

| Command | Description |
|---------|-------------|
| `/api/create-module` | Create a new NestJS module with full CRUD |
| `/api/add-endpoint` | Add endpoint to existing module |
| `/api/create-migration` | Create database migration |
| `/admin/create-feature` | Create admin feature with pages & components |
| `/admin/create-component` | Create reusable UI component |
| `/shared/run-tests` | Run test suite with coverage |
| `/shared/code-review` | Code quality review |
| `/shared/generate-docs` | Generate API documentation |
| `/shared/add-type` | Add shared TypeScript type |
| `/shared/finish-feature` | **Complete workflow: review → commit → PR** |

## Workflow Skills

| Skill | Description |
|-------|-------------|
| `workflow/git-workflow.md` | Git branching, conventional commits, PR creation |
| `workflow/code-review.md` | Code review checklist, auto-clean, security audit |

## Documentation

- [System Architecture](.claude/docs/architecture/system-architecture.md)
- [Development Setup](.claude/docs/development-setup.md)
- [API Endpoints Plan](.claude/planning/api-endpoints.md)
- [Database Schema](.claude/planning/database-schema.md)
- [Project Roadmap](.claude/planning/roadmap.md)
