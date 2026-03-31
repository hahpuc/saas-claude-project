#!/bin/bash
# Auto-commit script for Claude Code

# Ensure arguments are provided
FEATURE_NAME="$1"
TYPE="$2"
SCOPE="$3"

if [ -z "$FEATURE_NAME" ] || [ -z "$TYPE" ] || [ -z "$SCOPE" ]; then
  echo "Usage: $0 <feature-name> <type> <scope>"
  exit 1
fi

# Auto-commit changes
git add -A
git commit -m "$TYPE($SCOPE): Auto-commit for feature $FEATURE_NAME"

# Auto-push and create a PR (if gh CLI is available)
if command -v gh &>/dev/null; then
  git push origin $TYPE/$FEATURE_NAME
  gh pr create --base develop --title "$TYPE($SCOPE): $FEATURE_NAME" \
    --body "Auto-generated PR for $FEATURE_NAME. Please review."
else
  echo "⚠️  gh CLI not found. Only pushed the changes."
fi