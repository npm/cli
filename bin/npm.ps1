#!/usr/bin/env pwsh

$NODE_EXE="$PSScriptRoot/node.exe"
if (-not (Test-Path $NODE_EXE)) {
  $NODE_EXE="$PSScriptRoot/node"
}
if (-not (Test-Path $NODE_EXE)) {
  $NODE_EXE="node"
}

$NPM_PREFIX_JS="$PSScriptRoot/node_modules/npm/bin/npm-prefix.js"
$NPM_CLI_JS="$PSScriptRoot/node_modules/npm/bin/npm-cli.js"
$NPM_PREFIX=(& $NODE_EXE $NPM_PREFIX_JS)

if ($LASTEXITCODE -ne 0) {
  Write-Host "Could not determine Node.js install directory"
  exit 1
}

$NPM_PREFIX_NPM_CLI_JS="$NPM_PREFIX/node_modules/npm/bin/npm-cli.js"
if (Test-Path $NPM_PREFIX_NPM_CLI_JS) {
  $NPM_CLI_JS=$NPM_PREFIX_NPM_CLI_JS
}

$NPM_ARGS = $MyInvocation.Line.Substring($MyInvocation.InvocationName.Length).Trim()
$INVOKE_NPM = "$($NODE_EXE -Replace ' ', '` ') $($NPM_CLI_JS -Replace ' ', '` ') $NPM_ARGS".Trim()

# Support pipeline input
if ($MyInvocation.ExpectingInput) {
  $input | Invoke-Expression $INVOKE_NPM
} else {
  Invoke-Expression $INVOKE_NPM
}

exit $LASTEXITCODE
