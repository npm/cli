#!/usr/bin/env pwsh

Set-StrictMode -Version 'Latest'

$NODE_EXE="$PSScriptRoot/node.exe"
if (-not (Test-Path $NODE_EXE)) {
  $NODE_EXE="$PSScriptRoot/node"
}
if (-not (Test-Path $NODE_EXE)) {
  $NODE_EXE="node"
}

# npm-shim.js picks this npx or the one in the global prefix, in the same node process.
$NPX_SHIM_JS="$PSScriptRoot/node_modules/npm/bin/npm-shim.js"

if ($MyInvocation.ExpectingInput) { # takes pipeline input
  $input | & $NODE_EXE $NPX_SHIM_JS npx $args
} elseif (-not $MyInvocation.Line) { # used "-File" argument
  & $NODE_EXE $NPX_SHIM_JS npx $args
} else { # used "-Command" argument
  if (($MyInvocation | Get-Member -Name 'Statement') -and $MyInvocation.Statement) {
    $NPX_ORIGINAL_COMMAND = $MyInvocation.Statement
  } else {
    $NPX_ORIGINAL_COMMAND = (
      [Management.Automation.InvocationInfo].GetProperty('ScriptPosition', [Reflection.BindingFlags] 'Instance, NonPublic')
    ).GetValue($MyInvocation).Text
  }

  $NODE_EXE = $NODE_EXE.Replace("``", "````")
  $NPX_SHIM_JS = $NPX_SHIM_JS.Replace("``", "````")

  $NPX_COMMAND_ARRAY = [Management.Automation.Language.Parser]::ParseInput($NPX_ORIGINAL_COMMAND, [ref] $null, [ref] $null).
    EndBlock.Statements.PipelineElements.CommandElements.Extent.Text
  $NPX_ARGS = ($NPX_COMMAND_ARRAY | Select-Object -Skip 1) -join ' '

  Invoke-Expression "& `"$NODE_EXE`" `"$NPX_SHIM_JS`" npx $NPX_ARGS"
}

exit $LASTEXITCODE
