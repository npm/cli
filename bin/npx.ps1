#!/usr/bin/env pwsh

$RET=0

$NODE_EXE="$PSScriptRoot/node.exe"
if (-not (Test-Path $NODE_EXE)) {
  $NODE_EXE="$PSScriptRoot/node"
}
if (-not (Test-Path $NODE_EXE)) {
  $NODE_EXE="node"
}

$NPM_PREFIX_JS="$PSScriptRoot/node_modules/npm/bin/npm-prefix.js"
$NPM_PREFIX=(& $NODE_EXE $NPM_PREFIX_JS)
$NPX_CLI_JS="$NPM_PREFIX/node_modules/npm/bin/npx-cli.js"

# Support pipeline input
if ($MyInvocation.ExpectingInput) {
  $input | & $NODE_EXE $NPX_CLI_JS $args
} else {
  & $NODE_EXE $NPX_CLI_JS $args
}

$RET=$LASTEXITCODE
exit $RET
