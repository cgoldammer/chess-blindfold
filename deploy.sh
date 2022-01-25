#!/bin/bash
set -e

# Note: If you're not the creator of this library
# you likely shouldn't use or run this, because
# you'll need the right server configured.

echo "Starting deploy"

# Building the library
npm run prettier
npm run eslint
npm run test
npm run build

SERVEDIR=serve_content/chess-blindfold



ssh dev "mv ${SERVEDIR} ${SERVEDIR}_backup"
ssh dev "mkdir ${SERVEDIR}"
rsync -r serve_content/prod dev:$SERVEDIR
rsync -r serve_content/shared dev:$SERVEDIR
rsync serve_content/index_prod.html dev:$SERVEDIR/index.html

echo "Completed deploy"
