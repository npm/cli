'use strict'

const npm = require('./npm.js')
const output = require('./utils/output.js')
const path = require('path')
const readPackageTree = require('read-package-tree')
const semver = require('semver')
const validSupportURL = require('./utils/valid-support-url')

module.exports = support

const usage = require('./utils/usage')
support.usage = usage(
  'support',
  '\nnpm support [--json]'
)

support.completion = function (opts, cb) {
  const argv = opts.conf.argv.remain
  switch (argv[2]) {
    case 'support':
      return cb(null, [])
    default:
      return cb(new Error(argv[2] + ' not recognized'))
  }
}

// Compare lib/ls.js.
function support (args, silent, cb) {
  if (typeof cb !== 'function') {
    cb = silent
    silent = false
  }
  const dir = path.resolve(npm.dir, '..')
  readPackageTree(dir, function (err, tree) {
    if (err) {
      process.exitCode = 1
      return cb(err)
    }
    const data = findPackages(tree)
    if (silent) return cb(null, data)
    var out
    if (npm.config.get('json')) {
      out = JSON.stringify(data, null, 2)
    } else {
      out = data.map(displayPackage).join('\n\n')
    }
    output(out)
    cb(err, data)
  })
}

function findPackages (root) {
  const set = new Set()
  iterate(root)
  return Array.from(set).sort(function (a, b) {
    const comparison = a.name
      .toLowerCase()
      .localeCompare(b.name.toLowerCase())
    return comparison === 0
      ? semver.compare(a.version, b.version)
      : comparison
  })

  function iterate (node) {
    node.children.forEach(recurse)
  }

  function recurse (node) {
    const metadata = node.package
    const support = metadata.support
    if (support && validSupportURL(support)) {
      set.add({
        name: metadata.name,
        version: metadata.version,
        path: node.path,
        homepage: metadata.homepage,
        repository: metadata.repository,
        support: metadata.support
      })
    }
    if (node.children) iterate(node)
  }
}

function displayPackage (entry) {
  return entry.name + '@' + entry.version + ': ' + entry.support
}
