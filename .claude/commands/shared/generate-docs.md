Generate or update API documentation.

Steps:
1. Scan all controllers in `packages/api/src/modules/`
2. For each endpoint, verify Swagger decorators are present:
   - @ApiTags on controller
   - @ApiOperation with summary and description
   - @ApiResponse for success and error cases
   - @ApiParam, @ApiQuery, @ApiBody where needed
   - @ApiBearerAuth for protected endpoints
3. Generate/update the API documentation at `docs/api/`:
   - `endpoints.md` — Full endpoint reference
   - `authentication.md` — Auth flow documentation
   - `error-codes.md` — Error code reference
   - `examples.md` — Request/response examples
4. Verify Swagger UI is accessible at `/api/docs`
5. Export OpenAPI spec to `docs/api/openapi.json`
