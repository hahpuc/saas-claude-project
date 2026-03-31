# System Architecture

## Overview

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Admin UI   │────▶│  NestJS API  │────▶│  PostgreSQL  │
│   (React)    │     │  (REST API)  │     │  (Database)  │
└─────────────┘     └──────┬───────┘     └──────────────┘
                           │
                           ├────▶ Redis (Cache/Sessions)
                           │
                           └────▶ S3/Local (File Storage)
```

## Package Architecture

### packages/api (NestJS Backend)
```
src/
├── main.ts                     # Bootstrap
├── app.module.ts               # Root module
├── config/                     # Configuration
│   ├── app.config.ts
│   ├── database.config.ts
│   ├── auth.config.ts
│   └── redis.config.ts
├── common/                     # Shared code
│   ├── decorators/
│   ├── guards/
│   ├── interceptors/
│   ├── pipes/
│   ├── filters/
│   ├── dto/
│   ├── interfaces/
│   └── exceptions/
├── database/                   # Database
│   ├── migrations/
│   ├── seeds/
│   └── data-source.ts
└── modules/                    # Feature modules
    ├── auth/
    ├── users/
    ├── organizations/
    ├── plans/
    ├── audit-logs/
    ├── notifications/
    ├── settings/
    ├── uploads/
    └── dashboard/
```

### packages/admin (React Frontend)
```
src/
├── main.tsx                    # Entry point
├── App.tsx                     # Root component
├── routes/                     # Route definitions
│   └── index.tsx
├── layouts/                    # Layout components
│   ├── admin.layout.tsx
│   ├── auth.layout.tsx
│   └── components/
├── features/                   # Feature modules
│   ├── auth/
│   ├── dashboard/
│   ├── users/
│   ├── organizations/
│   ├── plans/
│   ├── audit-logs/
│   ├── settings/
│   └── profile/
├── components/                 # Shared components
│   ├── ui/                     # shadcn/ui components
│   └── common/                 # App-specific shared
├── hooks/                      # Global hooks
├── stores/                     # Zustand stores
├── lib/                        # Utilities
│   ├── axios.ts
│   ├── utils.ts
│   └── constants.ts
├── types/                      # Global types
└── styles/                     # Global styles
    └── globals.css
```

### packages/shared
```
src/
├── index.ts                    # Barrel export
├── types/                      # Shared types
│   ├── api.types.ts            # API response types
│   ├── user.types.ts
│   └── ...
├── enums/                      # Shared enums
│   ├── role.enum.ts
│   ├── status.enum.ts
│   └── ...
├── constants/                  # Shared constants
│   └── index.ts
└── utils/                      # Shared utilities
    ├── date.utils.ts
    ├── string.utils.ts
    └── validation.utils.ts
```

## Communication Patterns

### API → Database
- TypeORM Repository Pattern
- All queries through repositories (no raw SQL except migrations)
- Connection pooling via TypeORM

### Admin → API
- RESTful HTTP with axios
- JWT Bearer token in Authorization header
- Refresh token in httpOnly cookie
- Standard request/response envelope

### Caching Strategy
- Redis for session data and frequently accessed data
- Cache invalidation on write operations
- TTL-based expiry
- Cache-aside pattern

## Security Layers
1. **Network:** CORS, Helmet, Rate Limiting
2. **Authentication:** JWT with Passport
3. **Authorization:** RBAC with Guards
4. **Validation:** class-validator + Zod
5. **Data:** TypeORM parameterized queries
6. **Audit:** Logging all admin actions
