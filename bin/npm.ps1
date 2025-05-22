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

if ($MyInvocation.ExpectingInput) { # takes pipeline input
  $input | & $NODE_EXE $NPM_CLI_JS $args
} elseif (-not $MyInvocation.Line) { # used "-File" argument
  & $NODE_EXE $NPM_CLI_JS $args
} else { # used "-Command" argument
  if ($MyInvocation.Statement) {
    $NPM_OG_COMMAND = $MyInvocation.Statement
  } else {
    $NPM_OG_COMMAND = (
      [System.Management.Automation.InvocationInfo].GetProperty('ScriptPosition', [System.Reflection.BindingFlags] 'Instance, NonPublic')
    ).GetValue($MyInvocation).Text
  }

  $NODE_EXE = $NODE_EXE.Replace("``", "````")
  $NPM_CLI_JS = $NPM_CLI_JS.Replace("``", "````")

  $ast = [System.Management.Automation.Language.Parser]::ParseInput($NPM_OG_COMMAND, [ref]$null, [ref]$null)
  $redirections = $ast.FindAll({$args[0] -is [System.Management.Automation.Language.FileRedirectionAst]}, $true) | Sort-Object { $_.Extent.StartOffset }
  $numberOfRedirects = @($redirections).Length

  if ($numberOfRedirects -gt 0) {
    $NPM_NO_REDIRECTS_COMMAND = ""
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

      $NPM_NO_REDIRECTS_COMMAND += $changed
      $prevEndOffset = $endOffset
      $i++
    }

    $NPM_NO_REDIRECTS_COMMAND = $NPM_NO_REDIRECTS_COMMAND.Trim()
    if ($NPM_NO_REDIRECTS_COMMAND.EndsWith("``")) {
      $NPM_NO_REDIRECTS_COMMAND = $NPM_NO_REDIRECTS_COMMAND.Substring(0, $NPM_NO_REDIRECTS_COMMAND.Length - 1) + ";"
    }

    $NPM_ARGS = $NPM_NO_REDIRECTS_COMMAND.Substring($MyInvocation.InvocationName.Length).Trim()
  } else {
    $NPM_ARGS = $NPM_OG_COMMAND.Substring($MyInvocation.InvocationName.Length).Trim()
  }

  Invoke-Expression "& `"$NODE_EXE`" `"$NPM_CLI_JS`" $NPM_ARGS"
}

exit $LASTEXITCODE
