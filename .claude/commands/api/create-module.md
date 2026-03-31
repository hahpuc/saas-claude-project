Create a new NestJS module with full CRUD operations.

Arguments: $MODULE_NAME - The name of the module (e.g., "users", "products")

Steps:
1. Create the module directory at `packages/api/src/modules/$MODULE_NAME/`
2. Generate these files:
   - `$MODULE_NAME.module.ts` — NestJS module with imports/exports
   - `$MODULE_NAME.controller.ts` — REST controller with CRUD endpoints (GET list, GET by id, POST, PATCH, DELETE)
   - `$MODULE_NAME.service.ts` — Service with business logic using TypeORM repository
   - `$MODULE_NAME.entity.ts` — TypeORM entity with id, createdAt, updatedAt
   - `dto/create-$MODULE_NAME.dto.ts` — Create DTO with class-validator decorators
   - `dto/update-$MODULE_NAME.dto.ts` — Update DTO using PartialType
   - `dto/query-$MODULE_NAME.dto.ts` — Query/filter DTO with pagination
   - `$MODULE_NAME.controller.spec.ts` — Unit tests for controller
   - `$MODULE_NAME.service.spec.ts` — Unit tests for service
3. Add Swagger decorators to all endpoints
4. Use standard response envelope pattern
5. Add the module to AppModule imports
6. Register entity in TypeORM config

Follow the project conventions in CLAUDE.md strictly.
