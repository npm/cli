#!/usr/bin/env bash

set -e

reset () {
  rm -rf node_modules package-lock.json
  echo '{}' > package.json
}

if [ -n "$1" ]; then
  versions=("$1")
else
  versions=(1 2 3 4)
fi

for v in "${versions[@]}"; do
  reset
  pkg="@isaacs/peer-dep-conflict-infinite-loop-a@$v"
  node ../../../bin reify --add="$pkg" --timers=false
done
