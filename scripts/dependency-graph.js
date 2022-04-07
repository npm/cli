'use strict'

// Generates our dependency graph documents in DEPENDENCIES.md.

const Arborist = require('@npmcli/arborist')
const fs = require('fs')

// To re-create npm-cli-repos.txt run:
/* eslint-disable-next-line max-len */
// gh api "/graphql" -F query='query { search (query: "org:npm topic:npm-cli", type: REPOSITORY, first:100) { nodes { ... on Repository { name } } } }' --jq '.data.search.nodes[].name'|sort
const repos = fs.readFileSync('./scripts/npm-cli-repos.txt', 'utf8').trim().split('\n')

// these have a different package name than the repo name, and are ours.
const aliases = {
  semver: 'node-semver',
  abbrev: 'abbrev-js',
}

// These are entries in npm-cli-repos.txt that correlate to namespaced repos.
// If we see a bare package with just this name, it's NOT ours
const namespaced = [
  'arborist',
  'ci-detect',
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
  const arborist = new Arborist({
    prefix: process.cwd(),
    path: process.cwd(),
  })
  const tree = await arborist.loadVirtual({ path: process.cwd(), name: 'npm' })
  tree.name = 'npm'

  const {
    heirarchy: heirarchyOurs,
    annotations: annotationsOurs,
  } = walk(tree, true)

  const {
    annotations: annotationsAll,
  } = walk(tree, false)

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
    '## npm dependency heirarchy',
    '',
    'These are the groups of dependencies in npm that depend on each other.',
    'Each group depends on packages lower down the chain, nothing depends on',
    'packages higher up the chain.',
    '',
    ` - ${heirarchyOurs.reverse().join('\n - ')}`,
  ]
  fs.writeFileSync('DEPENDENCIES.md', out.join('\n'))
  console.log('wrote to DEPENDENCIES.md')
}

const walk = function (tree, onlyOurs) {
  const annotations = [] // mermaid dependency annotations
  const dependedBy = {}
  iterate(tree, dependedBy, annotations, onlyOurs)
  const allDeps = new Set(Object.keys(dependedBy))
  const foundDeps = new Set()
  const heirarchy = []
  while (allDeps.size) {
    const level = []
    for (const dep of allDeps) {
      if (!dependedBy[dep].size) {
        level.push(dep)
        foundDeps.add(dep)
      }
    }
    for (const dep of allDeps) {
      for (const found of foundDeps) {
        allDeps.delete(found)
        dependedBy[dep].delete(found)
      }
    }
    if (!level.length) {
      throw new Error('Would do an infinite loop here, need to debug')
    }
    heirarchy.push(level.join(', '))
  }

  return { heirarchy, annotations }
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

main().then(() => {
  process.exit(0)
}).catch(err => {
  console.error(err)
  process.exit(1)
})
