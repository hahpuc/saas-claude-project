Create a new API endpoint within an existing module.

Arguments:
- $MODULE_NAME — The existing module name
- $ENDPOINT_NAME — The endpoint name (e.g., "export", "bulk-delete", "statistics")
- $HTTP_METHOD — The HTTP method (GET, POST, PUT, PATCH, DELETE)

Steps:
1. Add the new endpoint method to `packages/api/src/modules/$MODULE_NAME/$MODULE_NAME.controller.ts`
2. Add the corresponding service method to `$MODULE_NAME.service.ts`
3. Create any required DTOs in the `dto/` directory
4. Add Swagger decorators (@ApiOperation, @ApiResponse, @ApiParam)
5. Add appropriate guards and decorators (auth, roles if needed)
6. Add unit tests for the new endpoint
7. Follow REST naming conventions and response envelope pattern

Ensure the endpoint follows the existing patterns in the module.
