// run an npm command
const spawn = require('./spawn.js')

module.exports = (npmBin, npmCommand, cwd, ermsg) => {
  const isJS = npmBin.endsWith('.js')
  const cmd = isJS ? process.execPath : npmBin
  const args = (isJS ? [npmBin] : []).concat(npmCommand)
  return spawn(cmd, args, { cwd }, ermsg)
}
