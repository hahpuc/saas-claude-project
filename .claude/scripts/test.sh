#!/bin/bash
# Run test suite with coverage
set -e

SCOPE=${1:-all}

echo "🧪 Running tests (scope: $SCOPE)..."

PROJECT_DIR="/srv/www/saas-project"
cd "$PROJECT_DIR"

case $SCOPE in
  api)
    echo "Testing API..."
    cd packages/api && npm test -- --coverage
    ;;
  admin)
    echo "Testing Admin..."
    cd packages/admin && npx vitest run --coverage
    ;;
  all)
    echo "Testing API..."
    cd packages/api && npm test -- --coverage
    cd "$PROJECT_DIR"
    echo ""
    echo "Testing Admin..."
    cd packages/admin && npx vitest run --coverage
    ;;
  *)
    echo "Testing specific file: $SCOPE"
    npx jest "$SCOPE" --coverage || npx vitest run "$SCOPE" --coverage
    ;;
esac

echo ""
echo "✅ Tests complete!"
