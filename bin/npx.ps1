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

if ($MyInvocation.ExpectingInput) { # takes pipeline input
  $input | & $NODE_EXE $NPX_CLI_JS $args
} elseif (-not $MyInvocation.Line) { # used "-File" argument
  & $NODE_EXE $NPX_CLI_JS $args
} else { # used "-Command" argument
  if ($MyInvocation.Statement) {
    $NPX_OG_COMMAND = $MyInvocation.Statement
  } else {
    $NPX_OG_COMMAND = (
      [System.Management.Automation.InvocationInfo].GetProperty('ScriptPosition', [System.Reflection.BindingFlags] 'Instance, NonPublic')
    ).GetValue($MyInvocation).Text
  }

  $NODE_EXE = $NODE_EXE.Replace("``", "````")
  $NPX_CLI_JS = $NPX_CLI_JS.Replace("``", "````")

  $ast = [System.Management.Automation.Language.Parser]::ParseInput($NPX_OG_COMMAND, [ref]$null, [ref]$null)
  $redirections = $ast.FindAll({$args[0] -is [System.Management.Automation.Language.FileRedirectionAst]}, $true) | Sort-Object { $_.Extent.StartOffset }
  $numberOfRedirects = @($redirections).Length

  if ($numberOfRedirects -gt 0) {
    $NPX_NO_REDIRECTS_COMMAND = ""
    $prevEndOffset = 0
    $i = 0

    foreach ($redirection in $redirections) {
      $parentExtentText = $redirection.Parent.Extent.Text
      $startOffset = $redirection.Extent.StartOffset
      $endOffset = $redirection.Extent.EndOffset

      $changed = $parentExtentText.Substring($prevEndOffset, $startOffset - $prevEndOffset)
      if ($i -eq $numberOfRedirects-1) {
        $changed += $parentExtentText.Substring($endOffset, $parentExtentText.Length - $endOffset)
      }

      $NPX_NO_REDIRECTS_COMMAND += $changed
      $prevEndOffset = $endOffset
      $i++
    }

    $NPX_NO_REDIRECTS_COMMAND = $NPX_NO_REDIRECTS_COMMAND.Trim()
    if ($NPX_NO_REDIRECTS_COMMAND.EndsWith("``")) {
      $NPX_NO_REDIRECTS_COMMAND = $NPX_NO_REDIRECTS_COMMAND.Substring(0, $NPX_NO_REDIRECTS_COMMAND.Length - 1) + ";"
    }

    $NPX_ARGS = $NPX_NO_REDIRECTS_COMMAND.Substring($MyInvocation.InvocationName.Length).Trim()
  } else {
    $NPX_ARGS = $NPX_OG_COMMAND.Substring($MyInvocation.InvocationName.Length).Trim()
  }

  Invoke-Expression "& `"$NODE_EXE`" `"$NPX_CLI_JS`" $NPX_ARGS"
}

exit $LASTEXITCODE
