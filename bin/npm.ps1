#!/usr/bin/env pwsh
$basedir=Split-Path $MyInvocation.MyCommand.Definition -Parent

$exe=""
if ($PSVersionTable.PSVersion -lt "6.0" -or $IsWindows) {
  # Fix case when both the Windows and Linux builds of Node
  # are installed in the same directory
  $exe=".exe"
}
$ret=0

$nodebin = $(Get-Command "node$exe" -ErrorAction SilentlyContinue -ErrorVariable F).Source
if ($nodebin -eq $null) {
  Write-Host "node$exe not found."
  exit 1
}
$nodedir = $(New-Object -ComObject Scripting.FileSystemObject).GetFile("$nodebin").ParentFolder.Path

# Support pipeline input
if ($MyInvocation.ExpectingInput) {
  $input | & "node$exe" "$nodedir/node_modules/npm/bin/npm-cli.js" $args
} else {
  & "node$exe" "$nodedir/node_modules/npm/bin/npm-cli.js" $args
}
$ret=$LASTEXITCODE
exit $ret
