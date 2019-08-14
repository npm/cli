/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/basic.js TAP env shebang > cmd 1`] = `
@ECHO off\\r
SETLOCAL\\r
CALL find_dp0\\r
\\r
IF EXIST "%dp0%\\node.exe" (\\r
  SET "_prog=%dp0%\\node.exe"\\r
) ELSE (\\r
  SET "_prog=node"\\r
  SET PATHEXT=%PATHEXT:;.JS;=;%\\r
)\\r
\\r
"%_prog%"  "%dp0%\\from.env" %*\\r
ENDLOCAL\\r
EXIT /b\\r
find_dp0:\\r
SET dp0=%~dp0\\r
EXIT /b\\r

`

exports[`test/basic.js TAP env shebang > ps1 1`] = `
#!/usr/bin/env pwsh
$basedir=Split-Path $MyInvocation.MyCommand.Definition -Parent

$exe=""
if ($PSVersionTable.PSVersion -lt "6.0" -or $IsWindows) {
  # Fix case when both the Windows and Linux builds of Node
  # are installed in the same directory
  $exe=".exe"
}
$ret=0
if (Test-Path "$basedir/node$exe") {
  & "$basedir/node$exe"  "$basedir/from.env" $args
  $ret=$LASTEXITCODE
} else {
  & "node$exe"  "$basedir/from.env" $args
  $ret=$LASTEXITCODE
}
exit $ret

`

exports[`test/basic.js TAP env shebang > shell 1`] = `
#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\\\,/,g')")

case \`uname\` in
    *CYGWIN*|*MINGW*|*MSYS*) basedir=\`cygpath -w "$basedir"\`;;
esac

if [ -x "$basedir/node" ]; then
  "$basedir/node"  "$basedir/from.env" "$@"
  ret=$?
else 
  node  "$basedir/from.env" "$@"
  ret=$?
fi
exit $ret

`

exports[`test/basic.js TAP env shebang with args > cmd 1`] = `
@ECHO off\\r
SETLOCAL\\r
CALL find_dp0\\r
\\r
IF EXIST "%dp0%\\node.exe" (\\r
  SET "_prog=%dp0%\\node.exe"\\r
) ELSE (\\r
  SET "_prog=node"\\r
  SET PATHEXT=%PATHEXT:;.JS;=;%\\r
)\\r
\\r
"%_prog%" --expose_gc "%dp0%\\from.env.args" %*\\r
ENDLOCAL\\r
EXIT /b\\r
find_dp0:\\r
SET dp0=%~dp0\\r
EXIT /b\\r

`

exports[`test/basic.js TAP env shebang with args > ps1 1`] = `
#!/usr/bin/env pwsh
$basedir=Split-Path $MyInvocation.MyCommand.Definition -Parent

$exe=""
if ($PSVersionTable.PSVersion -lt "6.0" -or $IsWindows) {
  # Fix case when both the Windows and Linux builds of Node
  # are installed in the same directory
  $exe=".exe"
}
$ret=0
if (Test-Path "$basedir/node$exe") {
  & "$basedir/node$exe" --expose_gc "$basedir/from.env.args" $args
  $ret=$LASTEXITCODE
} else {
  & "node$exe" --expose_gc "$basedir/from.env.args" $args
  $ret=$LASTEXITCODE
}
exit $ret

`

exports[`test/basic.js TAP env shebang with args > shell 1`] = `
#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\\\,/,g')")

case \`uname\` in
    *CYGWIN*|*MINGW*|*MSYS*) basedir=\`cygpath -w "$basedir"\`;;
esac

if [ -x "$basedir/node" ]; then
  "$basedir/node" --expose_gc "$basedir/from.env.args" "$@"
  ret=$?
else 
  node --expose_gc "$basedir/from.env.args" "$@"
  ret=$?
fi
exit $ret

`

exports[`test/basic.js TAP env shebang with variables > cmd 1`] = `
@ECHO off\\r
SETLOCAL\\r
CALL find_dp0\\r
@SET NODE_PATH=./lib:%NODE_PATH%\\r
\\r
IF EXIST "%dp0%\\node.exe" (\\r
  SET "_prog=%dp0%\\node.exe"\\r
) ELSE (\\r
  SET "_prog=node"\\r
  SET PATHEXT=%PATHEXT:;.JS;=;%\\r
)\\r
\\r
"%_prog%"  "%dp0%\\from.env.variables" %*\\r
ENDLOCAL\\r
EXIT /b\\r
find_dp0:\\r
SET dp0=%~dp0\\r
EXIT /b\\r

`

exports[`test/basic.js TAP env shebang with variables > ps1 1`] = `
#!/usr/bin/env pwsh
$basedir=Split-Path $MyInvocation.MyCommand.Definition -Parent

$exe=""
if ($PSVersionTable.PSVersion -lt "6.0" -or $IsWindows) {
  # Fix case when both the Windows and Linux builds of Node
  # are installed in the same directory
  $exe=".exe"
}
$ret=0
if (Test-Path "$basedir/node$exe") {
  & "$basedir/node$exe"  "$basedir/from.env.variables" $args
  $ret=$LASTEXITCODE
} else {
  & "node$exe"  "$basedir/from.env.variables" $args
  $ret=$LASTEXITCODE
}
exit $ret

`

exports[`test/basic.js TAP env shebang with variables > shell 1`] = `
#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\\\,/,g')")

case \`uname\` in
    *CYGWIN*|*MINGW*|*MSYS*) basedir=\`cygpath -w "$basedir"\`;;
esac

if [ -x "$basedir/node" ]; then
  NODE_PATH=./lib:$NODE_PATH "$basedir/node"  "$basedir/from.env.variables" "$@"
  ret=$?
else 
  NODE_PATH=./lib:$NODE_PATH node  "$basedir/from.env.variables" "$@"
  ret=$?
fi
exit $ret

`

exports[`test/basic.js TAP explicit shebang > cmd 1`] = `
@ECHO off\\r
SETLOCAL\\r
CALL find_dp0\\r
\\r
IF EXIST "%dp0%\\/usr/bin/sh.exe" (\\r
  SET "_prog=%dp0%\\/usr/bin/sh.exe"\\r
) ELSE (\\r
  SET "_prog=/usr/bin/sh"\\r
  SET PATHEXT=%PATHEXT:;.JS;=;%\\r
)\\r
\\r
"%_prog%"  "%dp0%\\from.sh" %*\\r
ENDLOCAL\\r
EXIT /b\\r
find_dp0:\\r
SET dp0=%~dp0\\r
EXIT /b\\r

`

exports[`test/basic.js TAP explicit shebang > ps1 1`] = `
#!/usr/bin/env pwsh
$basedir=Split-Path $MyInvocation.MyCommand.Definition -Parent

$exe=""
if ($PSVersionTable.PSVersion -lt "6.0" -or $IsWindows) {
  # Fix case when both the Windows and Linux builds of Node
  # are installed in the same directory
  $exe=".exe"
}
$ret=0
if (Test-Path "$basedir//usr/bin/sh$exe") {
  & "$basedir//usr/bin/sh$exe"  "$basedir/from.sh" $args
  $ret=$LASTEXITCODE
} else {
  & "/usr/bin/sh$exe"  "$basedir/from.sh" $args
  $ret=$LASTEXITCODE
}
exit $ret

`

exports[`test/basic.js TAP explicit shebang > shell 1`] = `
#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\\\,/,g')")

case \`uname\` in
    *CYGWIN*|*MINGW*|*MSYS*) basedir=\`cygpath -w "$basedir"\`;;
esac

if [ -x "$basedir//usr/bin/sh" ]; then
  "$basedir//usr/bin/sh"  "$basedir/from.sh" "$@"
  ret=$?
else 
  /usr/bin/sh  "$basedir/from.sh" "$@"
  ret=$?
fi
exit $ret

`

exports[`test/basic.js TAP explicit shebang with args > cmd 1`] = `
@ECHO off\\r
SETLOCAL\\r
CALL find_dp0\\r
\\r
IF EXIST "%dp0%\\/usr/bin/sh.exe" (\\r
  SET "_prog=%dp0%\\/usr/bin/sh.exe"\\r
) ELSE (\\r
  SET "_prog=/usr/bin/sh"\\r
  SET PATHEXT=%PATHEXT:;.JS;=;%\\r
)\\r
\\r
"%_prog%" -x "%dp0%\\from.sh.args" %*\\r
ENDLOCAL\\r
EXIT /b\\r
find_dp0:\\r
SET dp0=%~dp0\\r
EXIT /b\\r

`

exports[`test/basic.js TAP explicit shebang with args > ps1 1`] = `
#!/usr/bin/env pwsh
$basedir=Split-Path $MyInvocation.MyCommand.Definition -Parent

$exe=""
if ($PSVersionTable.PSVersion -lt "6.0" -or $IsWindows) {
  # Fix case when both the Windows and Linux builds of Node
  # are installed in the same directory
  $exe=".exe"
}
$ret=0
if (Test-Path "$basedir//usr/bin/sh$exe") {
  & "$basedir//usr/bin/sh$exe" -x "$basedir/from.sh.args" $args
  $ret=$LASTEXITCODE
} else {
  & "/usr/bin/sh$exe" -x "$basedir/from.sh.args" $args
  $ret=$LASTEXITCODE
}
exit $ret

`

exports[`test/basic.js TAP explicit shebang with args > shell 1`] = `
#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\\\,/,g')")

case \`uname\` in
    *CYGWIN*|*MINGW*|*MSYS*) basedir=\`cygpath -w "$basedir"\`;;
esac

if [ -x "$basedir//usr/bin/sh" ]; then
  "$basedir//usr/bin/sh" -x "$basedir/from.sh.args" "$@"
  ret=$?
else 
  /usr/bin/sh -x "$basedir/from.sh.args" "$@"
  ret=$?
fi
exit $ret

`

exports[`test/basic.js TAP if exists (it does exist) > cmd 1`] = `
@ECHO off\\r
SETLOCAL\\r
CALL find_dp0\\r
"%dp0%\\from.exe"   %*\\r
ENDLOCAL\\r
EXIT /b\\r
find_dp0:\\r
SET dp0=%~dp0\\r
EXIT /b\\r

`

exports[`test/basic.js TAP if exists (it does exist) > ps1 1`] = `
#!/usr/bin/env pwsh
$basedir=Split-Path $MyInvocation.MyCommand.Definition -Parent

$exe=""
if ($PSVersionTable.PSVersion -lt "6.0" -or $IsWindows) {
  # Fix case when both the Windows and Linux builds of Node
  # are installed in the same directory
  $exe=".exe"
}
& "$basedir/from.exe"   $args
exit $LASTEXITCODE

`

exports[`test/basic.js TAP if exists (it does exist) > shell 1`] = `
#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\\\,/,g')")

case \`uname\` in
    *CYGWIN*|*MINGW*|*MSYS*) basedir=\`cygpath -w "$basedir"\`;;
esac

"$basedir/from.exe"   "$@"
exit $?

`

exports[`test/basic.js TAP just proceed if reading fails > cmd 1`] = `
@ECHO off\\r
SETLOCAL\\r
CALL find_dp0\\r
"%dp0%\\"   %*\\r
ENDLOCAL\\r
EXIT /b\\r
find_dp0:\\r
SET dp0=%~dp0\\r
EXIT /b\\r

`

exports[`test/basic.js TAP just proceed if reading fails > ps1 1`] = `
#!/usr/bin/env pwsh
$basedir=Split-Path $MyInvocation.MyCommand.Definition -Parent

$exe=""
if ($PSVersionTable.PSVersion -lt "6.0" -or $IsWindows) {
  # Fix case when both the Windows and Linux builds of Node
  # are installed in the same directory
  $exe=".exe"
}
& "$basedir/"   $args
exit $LASTEXITCODE

`

exports[`test/basic.js TAP just proceed if reading fails > shell 1`] = `
#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\\\,/,g')")

case \`uname\` in
    *CYGWIN*|*MINGW*|*MSYS*) basedir=\`cygpath -w "$basedir"\`;;
esac

"$basedir/"   "$@"
exit $?

`

exports[`test/basic.js TAP no shebang > cmd 1`] = `
@ECHO off\\r
SETLOCAL\\r
CALL find_dp0\\r
"%dp0%\\from.exe"   %*\\r
ENDLOCAL\\r
EXIT /b\\r
find_dp0:\\r
SET dp0=%~dp0\\r
EXIT /b\\r

`

exports[`test/basic.js TAP no shebang > ps1 1`] = `
#!/usr/bin/env pwsh
$basedir=Split-Path $MyInvocation.MyCommand.Definition -Parent

$exe=""
if ($PSVersionTable.PSVersion -lt "6.0" -or $IsWindows) {
  # Fix case when both the Windows and Linux builds of Node
  # are installed in the same directory
  $exe=".exe"
}
& "$basedir/from.exe"   $args
exit $LASTEXITCODE

`

exports[`test/basic.js TAP no shebang > shell 1`] = `
#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\\\,/,g')")

case \`uname\` in
    *CYGWIN*|*MINGW*|*MSYS*) basedir=\`cygpath -w "$basedir"\`;;
esac

"$basedir/from.exe"   "$@"
exit $?

`
