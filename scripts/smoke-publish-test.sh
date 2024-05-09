 #!/usr/bin/env bash

set -eo pipefail

IS_LOCAL="false"
IS_CI="true"

if [ -z "$CI" ]; then
  echo "Running locally will overwrite your globally installed npm."
  GITHUB_SHA=$(git rev-parse HEAD)
  RUNNER_TEMP=$(mktemp -d)
  IS_LOCAL="true"
  IS_CI="false"
fi

if [ -z "$GITHUB_SHA" ]; then
  echo "Error: GITHUB_SHA is required"
  exit 1
fi

if [ -z "$RUNNER_TEMP" ]; then
  echo "Error: RUNNER_TEMP is required"
  exit 1
fi

ORIGINAL_GLOBAL_NPM_VERSION=$(npm --version)
if [ ${#ORIGINAL_GLOBAL_NPM_VERSION} -gt 40 ]; then
  echo "Error: Global npm version already contains a git SHA ${ORIGINAL_GLOBAL_NPM_VERSION}"
  exit 1
fi

ORIGINAL_LOCAL_NPM_VERSION=$(node . --version)
if [ ${#ORIGINAL_LOCAL_NPM_VERSION} -gt 40 ]; then
  echo "Error: Local npm version already contains a git SHA ${ORIGINAL_LOCAL_NPM_VERSION}"
  exit 1
fi
NPM_VERSION="$ORIGINAL_LOCAL_NPM_VERSION-$GITHUB_SHA.0"

# Only cleanup locally
if [ "$IS_LOCAL" == "true" ]; then
  function cleanup {
    npm pkg set version=$ORIGINAL_LOCAL_NPM_VERSION
    node scripts/resetdeps.js
    if [ "$(git rev-parse HEAD)" != "$GITHUB_SHA" ]; then
      echo "==================================="
      echo "==================================="
      echo "HEAD is on a different commit."
      echo "==================================="
      echo "==================================="
    fi
    if [ "$(npm --version)" == "$NPM_VERSION" ]; then
      echo "==================================="
      echo "==================================="
      echo "Global npm version has changed to $NPM_VERSION"
      echo "Run the following to change it back"
      echo "npm install npm@$ORIGINAL_GLOBAL_NPM_VERSION -g"
      echo "==================================="
      echo "==================================="
    fi
  }
  trap cleanup EXIT
fi

# Version the local source of npm with the current git sha and
# and pack and install it globally the same way we would if we
# were publishing it to the registry. The only difference is in the
# publish.js script which will only pack and not publish
node . version $NPM_VERSION --ignore-scripts --git-tag-version="$IS_CI"
node scripts/publish.js --pack-destination=$RUNNER_TEMP --smoke-publish=true --is-local="$IS_LOCAL"
NPM_TARBALL="$RUNNER_TEMP/npm-$NPM_VERSION.tgz"
node . install --global $NPM_TARBALL

# Only run the tests if we are sure we have the right version
# otherwise the tests being run are pointless
NPM_GLOBAL_VERSION="$(npm --version)"
if [ "$NPM_GLOBAL_VERSION" != "$NPM_VERSION" ]; then
  echo "global npm is not the correct version for smoke-publish"
  echo "found: $NPM_GLOBAL_VERSION, expected: $NPM_VERSION"
  exit 1
fi

# Install dev deps only for smoke tests so they can be run
node . install -w smoke-tests --ignore-scripts --no-audit --no-fund
# Run smoke tests with env vars so it uses the globally installed tarball we
# just packed/installed. The tacked on args at the end are only used for
# debugging locally when we want to pass args to the smoke-tests to limit the
# files being run or grep a test, etc. Also now set CI=true so we get more
# debug output in our tap tests
CI="true" SMOKE_PUBLISH_TARBALL="$NPM_TARBALL" npm test \
  -w smoke-tests \
  --ignore-scripts \
  -- "$@"
