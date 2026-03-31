Create a new TypeORM database migration.

Arguments: $MIGRATION_NAME — Description of the migration (e.g., "add-user-avatar-column", "create-orders-table")

Steps:
1. Analyze the current entities in `packages/api/src/modules/*/` to understand schema changes
2. Generate migration file at `packages/api/src/database/migrations/`
3. Name format: `{timestamp}-$MIGRATION_NAME.ts`
4. Include both `up()` and `down()` methods
5. Use TypeORM's QueryRunner for the migration
6. Test by running: `cd packages/api && npm run migration:run`

Migration best practices:
- Always include a rollback in `down()`
- Add indexes for frequently queried columns
- Use transactions for multi-step migrations
- Never drop columns in production without a multi-step migration plan
