const { delimiter, extname, resolve } = require('node:path')
const { walkUp } = require('walk-up-path')
const { fileExists } = require('./file-exists.js')

const unsafeForCmd = name =>
  /["%!]/.test(name) || [...name].some(c => c.charCodeAt(0) < 32)

// When cmd.exe runs a batch file by a quoted bare name that it found on PATH,
// %~dp0 inside the batch file resolves against the current directory instead
// of the batch file's own folder. Shims that read %~dp0 directly (such as the
// ones pnpm writes) then point at the wrong files. Resolving the name the way
// cmd.exe would and running it by absolute path avoids that, while keeping
// the executable name quoted.
const findCmdExecutable = async (name, { binPaths = [], runPath, env }) => {
  // cmd.exe only searches PATH for bare names
  if (/[\\/:]/.test(name)) {
    return name
  }

  const cwd = resolve(runPath)
  // the same order @npmcli/run-script builds PATH in, preceded by the current
  // directory, which cmd.exe searches first unless told not to
  const dirs = [
    ...(env.NoDefaultCurrentDirectoryInExePath === undefined ? [cwd] : []),
    ...binPaths,
    ...[...walkUp(cwd)].map(dir => resolve(dir, 'node_modules', '.bin')),
    ...(env.PATH || '').split(delimiter),
  ].filter(Boolean)

  const exts = (env.PATHEXT || '.COM;.EXE;.BAT;.CMD').split(';').filter(Boolean)
  const ext = extname(name).toLowerCase()
  const candidates = exts.some(e => e.toLowerCase() === ext)
    ? [name]
    : exts.map(e => `${name}${e}`)

  for (const dir of dirs) {
    for (const candidate of candidates) {
      const file = resolve(cwd, dir, candidate)
      if (await fileExists(file)) {
        // fall back to the bare name rather than refusing to run a path that
        // cannot be quoted safely
        return unsafeForCmd(file) ? name : file
      }
    }
  }

  return name
}

module.exports = {
  findCmdExecutable,
  unsafeForCmd,
}
