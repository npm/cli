'use strict'

const { resolve } = require('path')
const Arborist = require('@npmcli/arborist')
const BaseCommand = require('../base-command.js')
const QuerySelectorAllResponse = require('../utils/query-selector-all-response.js')

// retrieves a normalized inventory
const convertInventoryItemsToResponses = inventory => {
  const responses = []
  const responsesSeen = new Set()
  for (const node of inventory) {
    if (!responsesSeen.has(node.target.realpath)) {
      const item = new QuerySelectorAllResponse(node)
      responses.push(item)
      responsesSeen.add(item.path)
    }
  }
  return responses
}

class Query extends BaseCommand {
  static description = 'Retrieve a filtered list of packages'
  static name = 'query'
  static usage = [
    '<value>',
  ]

  static ignoreImplicitWorkspace = false

  static params = [
    'global',
    'workspace',
    'workspaces',
    'include-workspace-root',
  ]

  async exec (args, workspaces) {
    const globalTop = resolve(this.npm.globalDir, '..')
    const where = this.npm.config.get('global') ? globalTop : this.npm.prefix
    const opts = {
      ...this.npm.flatOptions,
      path: where,
    }
    const arb = new Arborist(opts)
    const tree = await arb.loadActual(opts)
    const items = await tree.querySelectorAll(args[0])
    const res =
      JSON.stringify(convertInventoryItemsToResponses(items), null, 2)

    return this.npm.output(res)
  }

  async execWorkspaces (args, filters) {
    await this.setWorkspaces(filters)
    const result = new Set()
    const opts = {
      ...this.npm.flatOptions,
      path: this.npm.prefix,
    }
    const arb = new Arborist(opts)
    const tree = await arb.loadActual(opts)
    for (const [, workspacePath] of this.workspaces.entries()) {
      this.prefix = workspacePath
      const [workspace] = await tree.querySelectorAll(`.workspace:path(${workspacePath})`)
      const res = await workspace.querySelectorAll(args[0])
      const converted = convertInventoryItemsToResponses(res)
      for (const item of converted) {
        result.add(item)
      }
    }
    // when running in workspaces names, make sure to key by workspace
    // name the results of each value retrieved in each ws
    this.npm.output(JSON.stringify([...result], null, 2))
  }
}

module.exports = Query
