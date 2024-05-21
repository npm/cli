const ArboristCmd = require('./arborist-cmd.js')

// This is the base for all commands whose execWorkspaces just gets
// a list of workspace names and passes it on to new Arborist() to
// be able to run a filtered Arborist.reify() at some point.
class ArboristWsCmd extends ArboristCmd {
  static params = [
    'workspace',
    'workspaces',
    'include-workspace-root',
    ...super.params,
  ]

  async execWorkspaces (args) {
    await this.setWorkspaces()
    return this.exec(args)
  }
}

module.exports = ArboristWsCmd
