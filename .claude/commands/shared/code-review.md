Review the codebase for quality issues, security vulnerabilities, and best practice violations.

Arguments: $SCOPE — "all", "api", "admin", or a specific directory/file path

Steps:
1. Analyze the code in the specified scope for:
   
   **Security:**
   - SQL injection vulnerabilities
   - XSS vulnerabilities
   - Missing input validation
   - Exposed secrets or hardcoded credentials
   - Missing authentication/authorization checks
   - CORS misconfiguration
   - Missing rate limiting
   
   **Code Quality:**
   - TypeScript `any` usage (should be avoided)
   - Missing error handling (try/catch, error boundaries)
   - Unused imports and dead code
   - Functions exceeding 50 lines
   - Files exceeding 300 lines
   - Missing TypeScript types
   - Console.log statements (should use logger)
   
   **Performance:**
   - N+1 query patterns
   - Missing database indexes
   - Large payload responses without pagination
   - Missing caching opportunities
   - Unnecessary re-renders in React components
   
   **Architecture:**
   - Circular dependencies
   - Business logic in controllers (should be in services)
   - Direct database access outside repositories
   - Missing DTOs for request/response
   
2. Provide findings in a structured report with severity levels (Critical, High, Medium, Low)
3. Suggest specific fixes for each issue
