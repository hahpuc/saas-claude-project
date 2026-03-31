#!/bin/bash
# Build all packages for production
set -e

echo "🏗️ Building SaaS Project for production..."

PROJECT_DIR="/srv/www/saas-project"
cd "$PROJECT_DIR"

# Build shared first (dependency)
echo "📦 Building shared package..."
cd packages/shared
npm run build
cd "$PROJECT_DIR"

# Build API
echo "🔧 Building API..."
cd packages/api
npm run build
cd "$PROJECT_DIR"

# Build Admin
echo "🎨 Building Admin..."
cd packages/admin
npm run build
cd "$PROJECT_DIR"

echo ""
echo "✅ Build complete!"
echo "  API build: packages/api/dist/"
echo "  Admin build: packages/admin/dist/"
