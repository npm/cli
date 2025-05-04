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

$NPX_PositionMessage = $MyInvocation.PositionMessage -split "`r?`n"
$firstIndex = $NPX_PositionMessage[2].IndexOf("~")
$lastIndex = $NPX_PositionMessage[2].LastIndexOf("~")
$NPX_OG_COMMAND = $NPX_PositionMessage[1].Substring($firstIndex, $lastIndex - $firstIndex + 1)

$NPX_ARGS = $NPX_OG_COMMAND.Substring($MyInvocation.InvocationName.Length).Trim()
$INVOKE_NPX = "& $(Normalize $NODE_EXE) $(Normalize $NPX_CLI_JS) $NPX_ARGS"
                                           
# Support pipeline input
if ($MyInvocation.ExpectingInput) {
  $input | Invoke-Expression $INVOKE_NPX
} else {
  Invoke-Expression $INVOKE_NPX
}

exit $LASTEXITCODE
