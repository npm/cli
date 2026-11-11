:: Created by npm, please don't edit manually.
@ECHO OFF

SETLOCAL

SET "NODE_EXE=%~dp0\node.exe"
IF NOT EXIST "%NODE_EXE%" (
  SET "NODE_EXE=node"
)

"%NODE_EXE%" "%~dp0\node_modules\npm\bin\npm-shim.js" npm %*
