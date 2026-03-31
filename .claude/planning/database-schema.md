# Database Schema Plan

## Core Tables

### users
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, default uuid_generate_v4() |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| password_hash | VARCHAR(255) | NOT NULL |
| name | VARCHAR(100) | NOT NULL |
| avatar_url | VARCHAR(500) | NULLABLE |
| role | ENUM | NOT NULL, default 'user' |
| status | ENUM | NOT NULL, default 'active' |
| email_verified_at | TIMESTAMP | NULLABLE |
| last_login_at | TIMESTAMP | NULLABLE |
| created_at | TIMESTAMP | NOT NULL, default now() |
| updated_at | TIMESTAMP | NOT NULL, default now() |
| deleted_at | TIMESTAMP | NULLABLE (soft delete) |

### organizations (multi-tenancy)
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| name | VARCHAR(100) | NOT NULL |
| slug | VARCHAR(100) | UNIQUE, NOT NULL |
| logo_url | VARCHAR(500) | NULLABLE |
| plan_id | UUID | FK → plans.id |
| owner_id | UUID | FK → users.id |
| status | ENUM | NOT NULL, default 'active' |
| settings | JSONB | default '{}' |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |
| deleted_at | TIMESTAMP | NULLABLE |

### organization_members
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| organization_id | UUID | FK → organizations.id |
| user_id | UUID | FK → users.id |
| role | ENUM | NOT NULL (owner, admin, member) |
| invited_by | UUID | FK → users.id, NULLABLE |
| joined_at | TIMESTAMP | NOT NULL |

### plans
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| name | VARCHAR(100) | NOT NULL |
| slug | VARCHAR(50) | UNIQUE |
| description | TEXT | NULLABLE |
| price_monthly | DECIMAL(10,2) | NOT NULL |
| price_yearly | DECIMAL(10,2) | NOT NULL |
| features | JSONB | NOT NULL |
| limits | JSONB | NOT NULL |
| is_active | BOOLEAN | default true |
| sort_order | INT | default 0 |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

### audit_logs
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK → users.id, NULLABLE |
| organization_id | UUID | FK → organizations.id, NULLABLE |
| action | VARCHAR(100) | NOT NULL |
| entity_type | VARCHAR(100) | NOT NULL |
| entity_id | UUID | NOT NULL |
| old_values | JSONB | NULLABLE |
| new_values | JSONB | NULLABLE |
| ip_address | INET | NULLABLE |
| user_agent | TEXT | NULLABLE |
| created_at | TIMESTAMP | NOT NULL |

### refresh_tokens
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK → users.id |
| token_hash | VARCHAR(255) | UNIQUE, NOT NULL |
| expires_at | TIMESTAMP | NOT NULL |
| revoked_at | TIMESTAMP | NULLABLE |
| created_at | TIMESTAMP | NOT NULL |

### notifications
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK → users.id |
| type | VARCHAR(50) | NOT NULL |
| title | VARCHAR(255) | NOT NULL |
| content | TEXT | NULLABLE |
| data | JSONB | NULLABLE |
| read_at | TIMESTAMP | NULLABLE |
| created_at | TIMESTAMP | NOT NULL |

### system_settings
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK |
| key | VARCHAR(100) | UNIQUE, NOT NULL |
| value | JSONB | NOT NULL |
| description | TEXT | NULLABLE |
| updated_by | UUID | FK → users.id |
| updated_at | TIMESTAMP | NOT NULL |

## Indexes
- users: email (unique), role, status, deleted_at
- organizations: slug (unique), owner_id, plan_id, status
- organization_members: (organization_id, user_id) unique, user_id
- audit_logs: user_id, organization_id, entity_type + entity_id, created_at
- refresh_tokens: user_id, token_hash (unique), expires_at
- notifications: user_id, read_at, created_at

## Enums
- **UserRole:** super_admin, admin, manager, user
- **UserStatus:** active, inactive, suspended, pending
- **OrgStatus:** active, inactive, suspended
- **OrgMemberRole:** owner, admin, member
