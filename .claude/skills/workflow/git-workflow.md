# Git Workflow Skill

## When to Use

Use after completing any feature, bugfix, refactor, or task. This skill ensures:

- Code is committed with proper conventional commit messages
- Each feature gets its own branch
- Pull requests are created for review

## Branch Strategy

```
main (production-ready)
├── develop (integration branch)
│   ├── feat/user-management
│   ├── feat/dashboard
│   ├── fix/login-redirect
│   └── refactor/auth-service
```

### Branch Naming

- `feat/<short-description>` — New features
- `fix/<short-description>` — Bug fixes
- `refactor/<short-description>` — Code refactoring
- `docs/<short-description>` — Documentation only
- `chore/<short-description>` — Maintenance tasks

## Commit Workflow

After completing a feature or logical unit of work:

### 1. Create feature branch (if not already on one)

```bash
git checkout develop
git pull origin develop
git checkout -b feat/<feature-name>
```

### 2. Stage and review changes

```bash
git status
git diff --stat
```

### 3. Commit with conventional commit format

```
type(scope): concise description

[optional body — explain WHY, not WHAT]

[optional footer — breaking changes, issue refs]
```

**Types:** feat, fix, refactor, docs, chore, test, style, perf, ci, build
**Scopes:** api, admin, shared, auth, users, dashboard, config, db

**Examples:**

```bash
git commit -m "feat(api): implement user CRUD with pagination and filtering"
git commit -m "feat(admin): add users management page with data table"
git commit -m "fix(auth): handle expired refresh token gracefully"
git commit -m "refactor(api): extract pagination logic to shared utility"
git commit -m "docs(api): add swagger decorators to all user endpoints"
```

### 4. Push and create PR

```bash
git push origin feat/<feature-name>
```

### Commit Granularity Rules

- **One commit per logical change** — don't mix unrelated changes
- **Commit compilable code** — every commit should build without errors
- **Small, focused commits** — easier to review and revert
- If a feature has multiple logical parts, commit each part separately:
  ```bash
  bash .claude/scripts/auto-commit.sh <feature-name> <type> <scope>
  ```
- Ensure `gh` CLI is installed for automatic PR creation
