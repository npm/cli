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

if ($MyInvocation.OffsetInLine -gt 0) {
  $firstPartOfCommand = $MyInvocation.Line.Substring($MyInvocation.OffsetInLine - 1, $MyInvocation.Line.length - $MyInvocation.OffsetInLine + 1)

  if (!$firstPartOfCommand.Contains("``")) {
    $NPM_OG_COMMAND = ($firstPartOfCommand -split ";")[0]
    $NPM_ARGS = $NPM_OG_COMMAND.Substring($MyInvocation.InvocationName.Length).Trim()
  
    # Support pipeline input
    if ($MyInvocation.ExpectingInput) {
      $input | Invoke-Expression "& $NODE_EXE $NPM_CLI_JS $NPM_ARGS"
    } else {
      Invoke-Expression "& $NODE_EXE $NPM_CLI_JS $NPM_ARGS"
    }
  
    exit $LASTEXITCODE
  }
}

# Support pipeline input
if ($MyInvocation.ExpectingInput) {
  $input | & $NODE_EXE $NPM_CLI_JS $args
} else {
  & $NODE_EXE $NPM_CLI_JS $args
}

exit $LASTEXITCODE
