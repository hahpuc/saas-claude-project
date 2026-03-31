Complete a feature and prepare it for review.

This command runs the full post-feature workflow:
1. Code Review & Clean
2. Git Commit
3. Create Pull Request

Arguments:
- $FEATURE_NAME — Short description of the feature completed (e.g., "user-management", "dashboard-stats")
- $SCOPE — The scope: "api", "admin", "shared", or "all"
- $TYPE — Commit type: "feat", "fix", "refactor", "docs", "chore", "test"

Steps:

### Phase 1: Code Review & Clean
1. Read `.claude/skills/workflow/code-review.md` and follow the full review checklist
2. Fix ALL issues found:
   - Remove `any` types → replace with proper types
   - Remove `console.log` → replace with Logger (API) or remove (Admin)
   - Remove commented-out code
   - Fix import ordering
   - Ensure naming conventions
   - Split files > 300 lines
3. Format code: `npm run format` (if available) or `npx prettier --write`
4. Fix lint: `npm run lint -- --fix` (if available)

### Phase 2: Build & Test Verification
1. Type check: `npx tsc --noEmit` in relevant package(s)
2. Run tests: `npm test` in relevant package(s)
3. Build check: `npm run build` in relevant package(s)
4. Fix any failures before proceeding

### Phase 3: Git Commit
1. If not on a feature branch, create one:
   ```bash
   git checkout -b $TYPE/$FEATURE_NAME
   ```
2. Stage all changes: `git add -A`
3. Review staged changes: `git diff --cached --stat`
4. If changes span multiple logical units, split into multiple commits
5. Commit with conventional format:
   ```bash
   git commit -m "$TYPE($SCOPE): $FEATURE_NAME description"
   ```

### Phase 4: Push & Create PR
1. Push branch: `git push origin $TYPE/$FEATURE_NAME`
2. Create PR using `gh pr create` if GitHub CLI is available:
   ```bash
   gh pr create --base develop --title "$TYPE($SCOPE): $FEATURE_NAME" --body "..."
   ```
3. If `gh` is not available, output the PR details for manual creation

### Phase 5: Report
Provide a summary of:
- Code review findings and fixes applied
- Test results
- Commit hash(es)
- PR link or PR details

IMPORTANT: Do NOT skip any phase. Every feature must go through the full workflow.
