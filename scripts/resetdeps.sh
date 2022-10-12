#!/bin/bash
set -e
set -x
rm -rf node_modules
rm -rf docs/node_modules
rm -rf smoke-tests/node_modules
rm -rf "workspaces/*/node_modules"
git checkout node_modules
node . i --ignore-scripts --no-audit --no-fund "$@"
node . rebuild --ignore-scripts
node . run dependencies --ignore-scripts
# check for cmark-gfm bindings
cmarkbinding=$(find `node . ls cmark-gfm --parseable \
| head -n 1` -name binding.node)
if [[ ! $cmarkbinding ]]; then
  node . rebuild cmark-gfm
fi
