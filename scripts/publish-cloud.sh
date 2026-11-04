#!/usr/bin/env bash
# Review build for the shared cloud previews. Renames the caption track to .vtt.txt (the artifact host
# serves .txt, not .vtt) and rewrites the reference in the bundle, as the Command Center artifact does.
set -euo pipefail
cd "$(dirname "$0")/.."
npx vite build --config vite.cloud.config.ts >/dev/null
for f in dist-cloud/assets/*.vtt; do
  mv "$f" "$f.txt"
  name=$(basename "$f")
  sed -i "s#${name}#${name}.txt#g" dist-cloud/assets/*.js
done
echo "dist-cloud ready"
