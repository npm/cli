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
    $Path = $Path -replace '^\s*"\s*(.*?)\s*"\s*$', "$1"
    $Path = $Path -replace "^\s*'\s*(.*?)\s*'\s*$", "$1"
    return """$Path"""
}

$firstPartOfString = $MyInvocation.Line.Substring($MyInvocation.OffsetInLine - 1, $MyInvocation.Line.length - $MyInvocation.OffsetInLine + 1)

$splitStringArray = $firstPartOfString -split "``;"
for ($i = 0; $i -lt $splitStringArray.Length; $i++) {
	$splitString = $splitStringArray[$i]
        if ($splitString.IndexOf(";") -ne -1) {
		$splitStringArray[$i] = $splitString.Substring(0, $splitString.IndexOf(";"))
	}
}
$NPX_OG_COMMAND = $splitStringArray[0..$i] -join "``;"

$NPX_ARGS = $NPX_OG_COMMAND.Substring($MyInvocation.InvocationName.Length).Trim()
$INVOKE_NPX = "& $(Normalize $NODE_EXE) $(Normalize $NPX_CLI_JS) $NPX_ARGS"
                                           
# Support pipeline input
if ($MyInvocation.ExpectingInput) {
  $input | Invoke-Expression $INVOKE_NPX
} else {
  Invoke-Expression $INVOKE_NPX
}

exit $LASTEXITCODE
