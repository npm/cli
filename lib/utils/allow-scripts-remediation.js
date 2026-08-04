// Builds the `npm config set allow-scripts` command suggested to global
// users, who have no project package.json for `npm approve-scripts` to
// write to. `--location=user` keeps the setting in the user .npmrc instead
// of trying (and, for global installs, failing) to write it to the local
// project config.
const configSetAllowScripts = (names) =>
  `npm config set allow-scripts=${names.join(',')} --location=user`

// Builds the one-off `npm <cmd> -g ... --allow-scripts=<names>` command
// suggested to global users. The specs the user asked for have to be
// repeated: `npm install -g --allow-scripts=foo` with no specs installs the
// current directory, which global users usually are not sitting in, so the
// suggestion would fail with ENOENT reading package.json.
const globalAllowScripts = (npm, names) => {
  const command = npm.command || 'install'
  const specs = npm.argv?.length ? ` ${npm.argv.join(' ')}` : ''
  return `npm ${command} -g${specs} --allow-scripts=${names.join(',')}`
}

module.exports = { configSetAllowScripts, globalAllowScripts }
