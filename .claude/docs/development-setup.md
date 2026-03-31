# Development Setup Guide

## Prerequisites
- Node.js 24+ (LTS)
- npm 11+
- PostgreSQL 16+
- Redis 7+
- Docker & Docker Compose (optional, for local services)

## Quick Start

### 1. Clone and Install
```bash
cd /srv/www/saas-project
npm install
```

### 2. Start Infrastructure (Docker)
```bash
docker compose up -d postgres redis
```

### 3. Configure Environment
```bash
# API
cp packages/api/.env.example packages/api/.env
# Edit .env with your database credentials

# Admin
cp packages/admin/.env.example packages/admin/.env
```

### 4. Run Migrations
```bash
cd packages/api
npm run migration:run
npm run seed
```

### 5. Start Development
```bash
# From project root — start all packages
npm run dev

# Or individually:
cd packages/api && npm run start:dev     # API on http://localhost:3000
cd packages/admin && npm run dev         # Admin on http://localhost:5173
```

### 6. Access
- **API:** http://localhost:3000
- **Swagger:** http://localhost:3000/api/docs
- **Admin:** http://localhost:5173

## Environment Variables

### API (.env)
```env
# App
NODE_ENV=development
PORT=3000
API_PREFIX=api
API_VERSION=v1

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=saas_project

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_ACCESS_SECRET=your-access-secret-change-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_SECRET=your-refresh-secret-change-in-production
JWT_REFRESH_EXPIRY=7d

# File Upload
UPLOAD_DRIVER=local
UPLOAD_LOCAL_PATH=./uploads
# UPLOAD_S3_BUCKET=
# UPLOAD_S3_REGION=

# Email
MAIL_DRIVER=smtp
MAIL_HOST=localhost
MAIL_PORT=1025
MAIL_FROM=noreply@saasproject.com
```

### Admin (.env)
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=SaaS Admin
```

## npm Scripts (root)
```json
{
  "dev": "npm run dev --workspaces",
  "build": "npm run build --workspaces",
  "test": "npm run test --workspaces",
  "lint": "npm run lint --workspaces",
  "format": "prettier --write \"packages/**/*.{ts,tsx}\""
}
```
