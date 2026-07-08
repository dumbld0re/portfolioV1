#!/usr/bin/env bash
# One-command publish for content/posts/: stage, commit, push.
# Usage: pnpm publish-post ["optional custom commit message"]
set -euo pipefail

cd "$(dirname "$0")/.."

git add content/posts

if git diff --cached --quiet -- content/posts; then
  echo "No changes in content/posts/ to publish."
  exit 0
fi

if [ "$#" -gt 0 ]; then
  message="$1"
else
  latest_file=$(git diff --cached --name-only -- content/posts | head -n 1)
  title=$(grep -m1 '^title:' "$latest_file" 2>/dev/null | sed -E 's/^title:[[:space:]]*"?([^"]*)"?/\1/')
  message="post: ${title:-update content/posts}"
fi

git commit -m "$message"
git push origin main

echo "Published — Vercel will redeploy shortly."
