#!/bin/bash
# Initialize git repository and make initial commit
set -e

cd /srv/www/saas-project

# Init git
git init
git checkout -b main

# Create develop branch structure
git add -A
git commit -m "feat: initial project setup with Phase 1 foundation

- NestJS 11 Backend API with auth, users, dashboard modules
- React 19 Admin with Vite, TailwindCSS 4, shadcn/ui
- Shared package with types, enums, utils
- Claude Code configuration (commands, rules, skills, planning, docs)
- Docker Compose for PostgreSQL and Redis
- Full JWT auth with refresh token rotation
- User management with CRUD, RBAC
- Admin dashboard with login, users management, profile pages"

# Create develop branch
git checkout -b develop

echo "✅ Git initialized with main and develop branches"
echo "   Current branch: develop"
echo ""
echo "   To connect to a remote:"
echo "   git remote add origin <your-repo-url>"
echo "   git push -u origin main"
echo "   git push -u origin develop"
