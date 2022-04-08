#!/bin/bash
set -e
set -x
rm -rf node_modules
rm -rf docs/node_modules
rm -rf smoke-tests/node_modules
rm -rf "workspaces/*/node_modules"
git checkout node_modules
node . i --ignore-scripts --no-audit --no-fund
node . rebuild --ignore-scripts
node scripts/bundle-and-gitignore-deps.js
