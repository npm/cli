#!/usr/bin/env pwsh

$updateTypeDataSplat = @{
  MemberType = 'ScriptProperty'
  TypeName   = 'System.Management.Automation.InvocationInfo'
  MemberName = '_NPX_FULL_COMMAND_'
}

if (-not $MyInvocation._NPX_FULL_COMMAND_) {
  Update-TypeData @updateTypeDataSplat -Value {
    if (-not $script:_NPX_ScriptPosition_) {
      # cache the PropertyInfo
      $script:_NPX_ScriptPosition_ = [System.Management.Automation.InvocationInfo].
        GetProperty('ScriptPosition', [System.Reflection.BindingFlags] 'Instance, NonPublic')
    }

    $script:_NPX_ScriptPosition_.GetValue($this).Text
  }
}

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

if ($MyInvocation.OffsetInLine -gt 0) {
  $NPX_ARGS = $MyInvocation._NPX_FULL_COMMAND_.Substring($MyInvocation.InvocationName.Length).Trim()

  # Support pipeline input
  if ($MyInvocation.ExpectingInput) {
    $input | Invoke-Expression "& `"$NODE_EXE`" `"$NPX_CLI_JS`" $NPX_ARGS"
  } else {
    Invoke-Expression "& `"$NODE_EXE`" `"$NPX_CLI_JS`" $NPX_ARGS"
  }

  exit $LASTEXITCODE
}

# Support pipeline input
if ($MyInvocation.ExpectingInput) {
  $input | & $NODE_EXE $NPX_CLI_JS $args
} else {
  & $NODE_EXE $NPX_CLI_JS $args
}

exit $LASTEXITCODE
