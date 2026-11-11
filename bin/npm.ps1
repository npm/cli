#!/usr/bin/env pwsh

Set-StrictMode -Version 'Latest'

$NODE_EXE="$PSScriptRoot/node.exe"
if (-not (Test-Path $NODE_EXE)) {
  $NODE_EXE="$PSScriptRoot/node"
}
if (-not (Test-Path $NODE_EXE)) {
  $NODE_EXE="node"
}

# npm-shim.js picks this npm or the one in the global prefix, in the same node process.
$NPM_SHIM_JS="$PSScriptRoot/node_modules/npm/bin/npm-shim.js"

if ($MyInvocation.ExpectingInput) { # takes pipeline input
  $input | & $NODE_EXE $NPM_SHIM_JS npm $args
} elseif (-not $MyInvocation.Line) { # used "-File" argument
  & $NODE_EXE $NPM_SHIM_JS npm $args
} else { # used "-Command" argument
  if (($MyInvocation | Get-Member -Name 'Statement') -and $MyInvocation.Statement) {
    $NPM_ORIGINAL_COMMAND = $MyInvocation.Statement
  } else {
    $NPM_ORIGINAL_COMMAND = (
      [Management.Automation.InvocationInfo].GetProperty('ScriptPosition', [Reflection.BindingFlags] 'Instance, NonPublic')
    ).GetValue($MyInvocation).Text
  }

  $NODE_EXE = $NODE_EXE.Replace("``", "````")
  $NPM_SHIM_JS = $NPM_SHIM_JS.Replace("``", "````")

  $NPM_COMMAND_ARRAY = [Management.Automation.Language.Parser]::ParseInput($NPM_ORIGINAL_COMMAND, [ref] $null, [ref] $null).
    EndBlock.Statements.PipelineElements.CommandElements.Extent.Text
  $NPM_ARGS = ($NPM_COMMAND_ARRAY | Select-Object -Skip 1) -join ' '

  Invoke-Expression "& `"$NODE_EXE`" `"$NPM_SHIM_JS`" npm $NPM_ARGS"
}

exit $LASTEXITCODE
