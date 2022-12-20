// XXX: this also cleans quoted " in json snapshots
// ideally this could be avoided but its easier to just
// run this command inside cleanSnapshot
const normalizePath = (str) => str
  .replace(/\r\n/g, '\n') // normalize line endings (for ini)
  .replace(/[A-z]:\\/g, '\\') // turn windows roots to posix ones
  .replace(/\\+/g, '/') // replace \ with /

const cwdToRegex = () => new RegExp(normalizePath(process.cwd()), 'g')

// create a cwd replacer in the module scope, since some tests
// overwrite process.cwd()
const CWD = cwdToRegex()

const cleanCwd = (path) => normalizePath(path)
  .replace(CWD, '{CWD}')
  .replace(cwdToRegex(), '{CWD}')

const cleanDate = (str) =>
  str.replace(/\d{4}-\d{2}-\d{2}T\d{2}[_:]\d{2}[_:]\d{2}[_:.]\d{3}Z/g, '{DATE}')

module.exports = {
  normalizePath,
  cleanCwd,
  cleanDate,
}
