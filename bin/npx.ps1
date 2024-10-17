#!/usr/bin/env pwsh

$NODE_EXE="$PSScriptRoot/node.exe"
if (-not (Test-Path $NODE_EXE)) {
  $NODE_EXE="$PSScriptRoot/node"
}
if (-not (Test-Path $NODE_EXE)) {
  $NODE_EXE="node"
}

$NPM_PREFIX_JS="$PSScriptRoot/node_modules/npm/bin/npm-prefix.js"
$NPX_CLI_JS="$PSScriptRoot/node_modules/npm/bin/npx-cli.js"
$NPM_PREFIX=(& $NODE_EXE $NPM_PREFIX_JS)

if ($LASTEXITCODE -ne 0) {
  Write-Host "Could not determine Node.js install directory"
  exit 1
}

$NPM_PREFIX_NPX_CLI_JS="$NPM_PREFIX/node_modules/npm/bin/npx-cli.js"
if (Test-Path $NPM_PREFIX_NPX_CLI_JS) {
  $NPX_CLI_JS=$NPM_PREFIX_NPX_CLI_JS
}

$NPX_ARGS = $MyInvocation.Line.Substring($MyInvocation.InvocationName.Length).Trim()
$INVOKE_NPX = "$($NODE_EXE -Replace ' ', '` ') $($NPX_CLI_JS -Replace ' ', '` ') $NPX_ARGS".Trim()

# Support pipeline input
if ($MyInvocation.ExpectingInput) {
  $input | Invoke-Expression $INVOKE_NPX
} else {
  Invoke-Expression $INVOKE_NPX
}

exit $LASTEXITCODE
