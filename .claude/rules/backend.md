# NestJS Backend Rules

## Module Structure
Every NestJS module MUST follow this structure:
```
modules/{name}/
├── {name}.module.ts
├── {name}.controller.ts
├── {name}.service.ts
├── {name}.entity.ts
├── {name}.controller.spec.ts
├── {name}.service.spec.ts
└── dto/
    ├── create-{name}.dto.ts
    ├── update-{name}.dto.ts
    └── query-{name}.dto.ts
```

## Controller Rules
- Controllers handle HTTP concerns ONLY (request/response)
- NO business logic in controllers
- Always use DTOs for input validation
- Always add Swagger decorators
- Use standardized response envelope via interceptor
- Use `@ApiTags()`, `@ApiBearerAuth()` on every controller class
- Group related endpoints in the same controller

## Service Rules
- Services contain ALL business logic
- Use repository pattern with TypeORM
- Always handle errors with custom exceptions
- Use transactions for multi-step operations
- Log important operations with the Logger service

## Entity Rules
- Always include: `id` (UUID), `createdAt`, `updatedAt`
- Use `@CreateDateColumn()` and `@UpdateDateColumn()`
- Soft delete with `@DeleteDateColumn()` for important entities
- Define relations explicitly with eager/lazy loading strategy
- Add `@Index()` on frequently queried columns

## DTO Rules
- Use `class-validator` decorators on ALL fields
- Use `class-transformer` for type conversion
- CreateDTO: all required fields
- UpdateDTO: extend CreateDTO with `PartialType()`
- QueryDTO: extend common PaginationDto
- Add `@ApiProperty()` with examples on every field

## Error Handling
- Use NestJS built-in exceptions (NotFoundException, BadRequestException, etc.)
- Create custom exceptions for domain-specific errors in `common/exceptions/`
- Never expose internal error details to clients
- Always log errors with stack traces internally

## Auth & Authorization
- Use `@UseGuards(JwtAuthGuard)` on protected endpoints
- Use `@Roles()` decorator with `RolesGuard` for RBAC
- Public endpoints must have `@Public()` decorator
- Never trust client-side data for authorization decisions
