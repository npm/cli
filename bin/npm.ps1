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

function Normalize {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory=$true, ValueFromPipeline=$true, Position=0)]
        [string]$Path
    )

    $Path = [System.IO.Path]::GetFullPath($Path)
    # remove trailing " or ' quotes (if any) and put back " quotes around the path
    $Path = $Path -replace '^\s*"\s*(.*?)\s*"\s*$', '$1'
    $Path = $Path -replace "^\s*'\s*(.*?)\s*'\s*$", "$1"
    return """$Path"""
}

$NPM_ARGS = $MyInvocation.Line.Substring($MyInvocation.InvocationName.Length).Trim()
$INVOKE_NPM = "& $(Normalize $NODE_EXE) $(Normalize $NPM_CLI_JS) $NPM_ARGS"
                                           
# Support pipeline input
if ($MyInvocation.ExpectingInput) {
  $input | Invoke-Expression $INVOKE_NPM
} else {
  Invoke-Expression $INVOKE_NPM
}

exit $LASTEXITCODE
