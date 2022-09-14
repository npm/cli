const { dirname } = require('path')
const mapWorkspaces = require('@npmcli/map-workspaces')
const readJson = require('./read-json.js')

// returns false if cwd is within a workspace
module.exports = async (gitDir, path, cwd = process.cwd()) => {
  // doesn't matter
  if (gitDir == null) {
    return true
  }
  // always safe to commit from git root
  if (cwd === gitDir) {
    return true
  }
  // if your path's package.json contains workspaces, you are in a top level package, not a workspace
  var rpj = await readJson(`${path}/package.json`)
  if (rpj.workspaces) {
    return true
  }
  // loop up, looking for a package.json with workspaces
  while (cwd !== gitDir && cwd !== dirname(cwd)) {
    cwd = dirname(cwd)
    try {
      rpj = await readJson(`${cwd}/package.json`)
    } catch(er) { continue }
    const workspaceMap = await mapWorkspaces({cwd, pkg: rpj})
    const mapValues = [...workspaceMap.values()]
    if (mapValues.includes(path)) {
        return false
    }
  }
  return true
}
