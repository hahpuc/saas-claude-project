#!/bin/bash
# Setup development environment
set -e

echo "🚀 Setting up SaaS Project development environment..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_DIR="/srv/www/saas-project"
cd "$PROJECT_DIR"

# Install root dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

# Setup API
echo -e "${BLUE}🔧 Setting up API...${NC}"
cd packages/api
if [ ! -f .env ]; then
  cp .env.example .env
  echo "  Created .env from .env.example"
fi

# Setup Admin
echo -e "${BLUE}🎨 Setting up Admin...${NC}"
cd ../admin
if [ ! -f .env ]; then
  cp .env.example .env
  echo "  Created .env from .env.example"
fi

# Back to root
cd "$PROJECT_DIR"

# Run migrations (if database is available)
if command -v pg_isready &> /dev/null && pg_isready -q 2>/dev/null; then
  echo -e "${BLUE}🗄️ Running database migrations...${NC}"
  cd packages/api && npm run migration:run
  cd "$PROJECT_DIR"
else
  echo "  ⚠️  PostgreSQL not detected. Skipping migrations."
  echo "  Run 'cd packages/api && npm run migration:run' when DB is ready."
fi

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "  Start development:"
echo "    npm run dev"
echo ""
echo "  Or individually:"
echo "    cd packages/api && npm run start:dev    # API → http://localhost:3000"
echo "    cd packages/admin && npm run dev        # Admin → http://localhost:5173"
