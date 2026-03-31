# Code Review & Clean Skill

## When to Use
Run after completing a feature and BEFORE committing. This skill ensures code quality, cleanliness, and consistency with project standards.

## Review Checklist

### 1. TypeScript Strictness
```bash
# Check for 'any' usage
grep -rn ": any" packages/api/src/ packages/admin/src/ --include="*.ts" --include="*.tsx" | grep -v node_modules | grep -v ".spec."

# Check for unused imports (TypeScript compiler catches these in strict mode)
cd packages/api && npx tsc --noEmit
cd packages/admin && npx tsc --noEmit
```

**Fix all:**
- Replace `any` with proper types
- Remove unused imports
- Remove unused variables
- Ensure no `@ts-ignore` or `@ts-expect-error` without justification

### 2. Code Cleanliness

**Remove all debug artifacts:**
```bash
# Find console.log statements (should use Logger in API)
grep -rn "console\.\(log\|debug\|info\|warn\|error\)" packages/api/src/ --include="*.ts" | grep -v node_modules

# Find TODO/FIXME that should be addressed
grep -rn "TODO\|FIXME\|HACK\|XXX" packages/*/src/ --include="*.ts" --include="*.tsx"

# Find commented-out code blocks (more than 2 consecutive commented lines)
grep -rn "^[[:space:]]*//" packages/*/src/ --include="*.ts" --include="*.tsx"
```

**Clean up:**
- Replace `console.log` with NestJS Logger in API code
- Address or remove TODOs before committing
- Remove commented-out code (use git history instead)
- Remove empty files or placeholder files
- Remove unused dependencies from package.json

### 3. Code Structure
Check for violations:

| Rule | Check |
|------|-------|
| File length ≤ 300 lines | `wc -l` on all source files |
| Function length ≤ 50 lines | Manual review |
| No business logic in controllers | Controllers should only call services |
| No direct DB access outside services | Only services use repositories |
| DTOs on all endpoints | Every controller method has DTO parameters |
| Swagger on all endpoints | `@ApiOperation`, `@ApiResponse` on every method |

```bash
# Find files exceeding 300 lines
find packages/*/src -name "*.ts" -o -name "*.tsx" | xargs wc -l | sort -rn | head -20
```

### 4. Security Review

```bash
# Check for hardcoded secrets
grep -rn "password\|secret\|api.key\|token" packages/*/src/ --include="*.ts" --include="*.tsx" | grep -v ".spec." | grep -v "dto" | grep -v "interface" | grep -v "type "

# Check for SQL injection risks (raw queries without parameters)
grep -rn "query(" packages/api/src/ --include="*.ts" | grep -v "createQueryBuilder"
```

**Verify:**
- No hardcoded credentials or secrets
- All user inputs validated with class-validator/Zod
- Auth guards on all protected endpoints
- Parameterized queries only

### 5. Import Organization

Order imports in every file:
```typescript
// 1. Node/built-in modules
import { join } from 'path';

// 2. External packages
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// 3. Internal modules (absolute paths)
import { PaginationDto } from '@/common/dto/pagination.dto';

// 4. Relative imports
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
```

### 6. Naming Consistency

Verify all naming follows CLAUDE.md conventions:
- Files: `kebab-case.ts`
- Classes: `PascalCase`
- Functions/Variables: `camelCase`
- Constants: `UPPER_SNAKE_CASE`
- Database tables: `snake_case`
- API endpoints: `kebab-case`, plural nouns

### 7. Frontend Specific (React)

```bash
# Find inline styles (should use TailwindCSS)
grep -rn "style={{" packages/admin/src/ --include="*.tsx"

# Find class components (should use function components)
grep -rn "extends React.Component\|extends Component" packages/admin/src/ --include="*.tsx"

# Check for missing key props in lists
grep -rn "\.map(" packages/admin/src/ --include="*.tsx"
```

## Auto-Clean Script

Run this sequence to auto-fix common issues:
```bash
# Format code
npm run format

# Fix lint issues
npm run lint -- --fix

# Sort imports (if configured)
npx eslint --fix --rule 'import/order: error' packages/*/src/**/*.ts
```

## Review Output Format

After review, provide a summary:
```
## Code Review Summary

### Issues Found: X
| # | Severity | File | Issue | Fix |
|---|----------|------|-------|-----|
| 1 | High | users.service.ts | console.log on line 45 | Replace with Logger |
| 2 | Medium | user-form.tsx | Missing loading state | Add Skeleton |

### Clean ✅
- [ ] No `any` types
- [ ] No console.log
- [ ] No commented-out code
- [ ] All files under 300 lines
- [ ] Imports organized
- [ ] Naming conventions followed
- [ ] Security checks passed
```
