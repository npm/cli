const Arborist = require('@npmcli/arborist')
const os = require('os')
const { readFileSync } = require('fs')
const { join } = require('path')
const log = require('proc-log')
const { run, CWD, pkg, fs, EOL } = require('./util.js')

// Generates our dependency graph documents in DEPENDENCIES.md.

// To re-create npm-cli-repos.txt run:
// npx -p @npmcli/stafftools gh repos --json | json -a name | sort > scripts/npm-cli-repos.txt
const repos = readFileSync(join(CWD, 'scripts', 'npm-cli-repos.txt'), 'utf-8').trim().split(os.EOL)

// these have a different package name than the repo name, and are ours.
const aliases = {
  semver: 'node-semver',
  abbrev: 'abbrev-js',
}

// These are entries in npm-cli-repos.txt that correlate to namespaced repos.
// If we see a bare package with just this name, it's NOT ours
const namespaced = [
  'arborist',
  'config',
  'disparity-colors',
  'eslint-config',
  'exec',
  'fs',
  'git',
  'installed-package-contents',
  'lint',
  'map-workspaces',
  'metavuln-calculator',
  'move-file',
  'name-from-folder',
  'node-gyp',
  'package-json',
  'promise-spawn',
  'run-script',
  'template-oss',
]

function isOurs (name) {
  if (name.startsWith('libnpm')) {
    return true
  }
  if (name.startsWith('@npmcli')) {
    return true
  }
  if (aliases[name]) {
    return true
  }
  // this will prevent e.g. `fs` from being mistaken as ours
  if (namespaced.includes(name)) {
    return false
  }
  if (repos.includes(name)) {
    return true
  }
  return false
}

function escapeName (name) {
  if (name.startsWith('@')) {
    return `${stripName(name)}["${name}"]`
  }
  return name
}

function stripName (name) {
  if (name.startsWith('@')) {
    const parts = name.slice(1).split('/')
    return `${parts[0]}-${parts[1]}`
  }
  return name
}

const main = async function () {
  // add all of the cli's public workspaces as package names
  for (const { name, pkg: ws } of await pkg.mapWorkspaces()) {
    if (!ws.private) {
      repos.push(name)
    }
  }

  const arborist = new Arborist({ prefix: CWD, path: CWD })
  const tree = await arborist.loadVirtual({ path: CWD, name: 'npm' })
  tree.name = 'npm'

  const [annotationsOurs, hierarchyOurs] = walk(tree, true)
  const [annotationsAll] = walk(tree, false)

  const out = [
    '# npm dependencies',
    '',
    '## `github.com/npm/` only',
    '```mermaid',
    'graph LR;',
    ...annotationsOurs.sort(),
    '```',
    '',
    '## all dependencies',
    '```mermaid',
    'graph LR;',
    ...annotationsAll.sort(),
    '```',
    '',
    '## npm dependency hierarchy',
    '',
    'These are the groups of dependencies in npm that depend on each other.',
    'Each group depends on packages lower down the chain, nothing depends on',
    'packages higher up the chain.',
    '',
    ` - ${hierarchyOurs.reverse().join(`${EOL} - `)}`,
  ]

  return fs.writeFile(join(CWD, 'DEPENDENCIES.md'), out.join(EOL))
}

const walk = function (tree, onlyOurs) {
  const annotations = [] // mermaid dependency annotations
  const dependedBy = {}

  iterate(tree, dependedBy, annotations, onlyOurs)

  const allDeps = new Set(Object.keys(dependedBy))
  const foundDeps = new Set()
  const hierarchy = []

  if (onlyOurs) {
    while (allDeps.size) {
      log.silly('SIZE', allDeps.size)
      const level = []

      for (const dep of allDeps) {
        log.silly(dep, '::', [...dependedBy[dep]].join(', '))
        log.silly('-'.repeat(80))

        if (!dependedBy[dep].size) {
          level.push(dep)
          foundDeps.add(dep)
        }
      }

      log.silly('LEVEL', level.length)
      log.silly('FOUND', foundDeps.size)

      for (const dep of allDeps) {
        for (const found of foundDeps) {
          allDeps.delete(found)
          dependedBy[dep].delete(found)
        }
      }

      log.silly('SIZE', allDeps.size)

      if (!level.length) {
        const remaining = `Remaining deps: ${[...allDeps.keys()]}`
        throw new Error(`Would do an infinite loop here, need to debug. ${remaining}`)
      }

      hierarchy.push(level.join(', '))
      log.silly('HIERARCHY', hierarchy.length)
      log.silly('='.repeat(80))
    }
  }

  return [annotations, hierarchy]
}

const iterate = function (node, dependedBy, annotations, onlyOurs) {
  if (!dependedBy[node.packageName]) {
    dependedBy[node.packageName] = new Set()
  }
  for (const [name, edge] of node.edgesOut) {
    if (
      (!onlyOurs || isOurs(name)) && !node.dev
    ) {
      if (!dependedBy[node.packageName].has(edge.name)) {
        dependedBy[node.packageName].add(edge.name)
        annotations.push(`  ${stripName(node.packageName)}-->${escapeName(edge.name)};`)
        if (edge.to) {
          iterate(edge.to.target, dependedBy, annotations, onlyOurs)
        }
      }
    }
  }
}

run(main)
