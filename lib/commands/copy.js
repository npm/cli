const Arborist = require('@npmcli/arborist')
const { join, relative, dirname } = require('path')
const packlist = require('npm-packlist')
const fs = require('@npmcli/fs')

const BaseCommand = require('../base-command.js')

class Copy extends BaseCommand {
  static description = 'Copy package to new location'

  static name = 'copy'

  static params = [
    'omit',
    'workspace',
    'workspaces',
    'include-workspace-root',
  ]

  static ignoreImplicitWorkspace = false

  static usage = ['<destination>']

  async exec (args) {
    await this.copyTo(args, true, new Set([]))
  }

  // called when --workspace or --workspaces is passed.
  async execWorkspaces (args, filters) {
    await this.setWorkspaces(filters)

    await this.copyTo(
      args,
      this.includeWorkspaceRoot,
      new Set(this.workspacePaths))
  }

  async copyTo (args, includeWorkspaceRoot, workspaces) {
    if (args.length !== 1) {
      throw this.usageError('Missing required destination argument')
    }
    const opts = {
      ...this.npm.flatOptions,
      path: this.npm.localPrefix,
      log: this.npm.log,
    }
    const destination = args[0]
    const omit = new Set(this.npm.flatOptions.omit)

    const tree = await new Arborist(opts).loadActual()

    // map of node to location in destination.
    const destinations = new Map()

    // calculate the root set of packages.
    if (includeWorkspaceRoot) {
      const to = join(destination, tree.location)
      destinations.set(tree, to)
    }
    for (const edge of tree.edgesOut.values()) {
      if (edge.workspace && workspaces.has(edge.to.realpath)) {
        const to = join(destination, edge.to.location)
        destinations.set(edge.to, to)
      }
    }

    // copy the root set of packages and their dependencies.
    for (const [node, dest] of destinations) {
      if (node.isLink && node.target) {
        const targetPath = destinations.get(node.target)
        if (targetPath == null) {
          // This is the first time the link target was seen, it will be the
          // only copy in dest, other links to the same target will link to
          // this copy.
          destinations.set(node.target, dest)
        } else {
          // The link target is already in the destination
          await relativeSymlink(targetPath, dest)
        }
      } else {
        if (node.isWorkspace || node.isRoot) {
          // workspace and root packages have not been published so they may
          // have files that should be excluded.
          await copyPacklist(node.target.realpath, dest)
        } else {
          // copy the modules files but not dependencies.
          const nm = join(node.realpath, 'node_modules')
          await fs.cp(node.realpath, dest, {
            recursive: true,
            errorOnExist: false,
            filter: src => src !== nm,
          })
        }

        // add dependency edges to the queue.
        for (const edge of node.edgesOut.values()) {
          if (!omit.has(edge.type) && edge.to != null) {
            destinations.set(
              edge.to,
              join(
                destinations.get(edge.to.parent) || destination,
                relative(edge.to.parent.location, edge.to.location)))
          }
        }
      }
    }
  }
}
module.exports = Copy

async function copyPacklist (from, to) {
  for (const file of await packlist({ path: from })) {
    // packlist will include bundled node_modules. ignore it because we're
    // already handling copying dependencies.
    if (file.startsWith('node_modules/')) {
      continue
    }

    // using recursive copy because packlist doesn't list directories.
    // TODO what is npm's preferred recursive copy?
    await fs.cp(
      join(from, file),
      join(to, file),
      { recursive: true, errorOnExist: false })
  }
}

async function relativeSymlink (target, path) {
  await fs.mkdir(dirname(path), { recursive: true })
  await fs.symlink(
    './' + relative(dirname(path), target),
    path // link to create
  )
}
