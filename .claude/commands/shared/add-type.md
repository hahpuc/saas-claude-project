Add a new shared type/interface to the shared package and sync across all packages.

Arguments:
- $TYPE_NAME — PascalCase type name (e.g., "User", "PaginatedResponse", "ApiError")
- $CATEGORY — "entities", "dto", "enums", "utils"

Steps:
1. Create/update the type file at `packages/shared/src/$CATEGORY/$TYPE_NAME.ts`
2. Export from the shared barrel: `packages/shared/src/index.ts`
3. Verify imports work in both `packages/api` and `packages/admin`
4. If it's an entity type, ensure it matches the TypeORM entity in the API
5. If it's a DTO, ensure validation decorators match between shared and API
6. Update any existing code that should use this shared type instead of local duplicates
