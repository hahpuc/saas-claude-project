# Security Rules — All Packages

## Authentication
- JWT tokens MUST have expiration (access: 15min, refresh: 7 days)
- Refresh tokens stored in httpOnly cookies, NOT localStorage
- Access tokens in memory only (React state), NOT persisted
- Always verify token signature and expiration
- Implement token rotation on refresh

## Input Validation
- Validate ALL user inputs on the server side (never trust client validation alone)
- Use class-validator in NestJS with whitelist + forbidNonWhitelisted
- Use Zod in React for client-side validation
- Sanitize HTML inputs to prevent XSS
- Validate file uploads: type, size, content

## API Security
- Enable CORS with specific origins (never `*` in production)
- Rate limit all endpoints (use @nestjs/throttler)
- Helmet middleware for security headers
- CSRF protection for cookie-based auth
- Request size limits

## Data Protection
- Never log sensitive data (passwords, tokens, PII)
- Hash passwords with bcrypt (minimum 12 rounds)
- Encrypt sensitive data at rest
- Use parameterized queries (TypeORM handles this, but verify raw queries)
- Mask sensitive fields in API responses

## Environment
- NEVER hardcode secrets, API keys, or credentials
- Use environment variables via ConfigService
- Different configs for development, staging, production
- .env files in .gitignore (only .env.example tracked)

## Dependencies
- Keep dependencies updated (check for security advisories)
- Use exact versions in package.json (no ^ or ~)
- Audit dependencies regularly: `npm audit`
- Minimize dependency count — prefer built-in Node.js APIs
