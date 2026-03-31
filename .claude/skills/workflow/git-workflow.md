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
  git commit -m "feat(api): add user entity and migration"
  git commit -m "feat(api): implement users service with CRUD operations"
  git commit -m "feat(api): add users controller with swagger docs"
  git commit -m "test(api): add unit tests for users service"
  ```

## Pull Request Workflow

### Create PR via GitHub CLI (if available)
```bash
gh pr create \
  --base develop \
  --title "feat(scope): description" \
  --body "## Changes
- What was added/changed

## Testing
- How to test these changes

## Checklist
- [ ] Code follows project conventions
- [ ] Tests added/updated
- [ ] Swagger docs updated
- [ ] No TypeScript errors"
```

### PR Template
If `gh` CLI is not available, provide PR details for manual creation:

```markdown
## Summary
Brief description of what this PR does.

## Changes
- Bullet list of key changes

## Type
- [ ] Feature
- [ ] Bug Fix
- [ ] Refactor
- [ ] Documentation

## Testing
Steps to test the changes.

## Screenshots (if UI changes)

## Checklist
- [ ] Code follows project conventions (CLAUDE.md)
- [ ] All rules followed (.claude/rules/)
- [ ] TypeScript strict — no `any` types
- [ ] Tests added or updated
- [ ] Swagger/API docs updated (if API changes)
- [ ] No console.log (use logger instead)
- [ ] Responsive design verified (if UI changes)
```

## After Each Task Completion

Always follow this sequence after finishing any task:
1. Run linting: `npm run lint` (fix any issues)
2. Run tests: `npm test` (ensure nothing is broken)
3. Build check: `npm run build` (ensure it compiles)
4. Stage changes: `git add -A`
5. Commit with conventional format
6. Push to feature branch
7. Create PR (or provide PR details)
