Run the full test suite and provide a comprehensive report.

Arguments: $SCOPE — "all", "api", "admin", or a specific test file path

Steps:
1. Based on $SCOPE, run the appropriate test command:
   - all: Run tests in both packages/api and packages/admin
   - api: `cd packages/api && npm test -- --coverage`
   - admin: `cd packages/admin && npx vitest run --coverage`
   - specific file: Run tests for that file only
2. Analyze the results and provide:
   - Total tests: passed / failed / skipped
   - Coverage summary (statements, branches, functions, lines)
   - List of any failing tests with error details
   - Suggestions for improving coverage if below 80%
3. If tests fail, analyze the failures and suggest fixes
4. Check for any test files without assertions (empty tests)
