'use strict'

const os = require('os')
const path = require('path')
const pacote = require('pacote')
const table = require('text-table')
const color = require('ansicolors')
const styles = require('ansistyles')
const npa = require('npm-package-arg')
const pickManifest = require('npm-pick-manifest')

const Arborist = require('@npmcli/arborist')

const npm = require('./npm.js')
const output = require('./utils/output.js')
const ansiTrim = require('./utils/ansi-trim.js')

cmd.usage = 'npm outdated [[<@scope>/]<pkg> ...]'
cmd.completion = require('./utils/completion/installed-deep.js')

module.exports = cmd
function cmd (args, cb) {
  outdated(args, cb)
    .then(() => cb())
    .catch(cb)
}

async function outdated (args) {
  const opts = npm.flatOptions
  const global = path.resolve(npm.globalDir, '..')
  const where = opts.global
    ? global
    : npm.prefix

  const arb = new Arborist({
    ...opts,
    path: where
  })

  const tree = await arb.loadActual()
  const list = await outdated_(tree, args, opts)

  // sorts list alphabetically
  const outdated = list.sort((a, b) => a.name.localeCompare(b.name))

  // return if no outdated packages
  if (outdated.length === 0 && !opts.json) {
    return
  }

  // display results
  if (opts.json) {
    output(makeJSON(outdated, opts))
  } else if (opts.parseable) {
    output(makeParseable(outdated, opts))
  } else {
    const outList = outdated.map(x => makePretty(x, opts))
    const outHead = ['Package',
      'Current',
      'Wanted',
      'Latest',
      'Location'
    ]

    if (opts.long) outHead.push('Package Type', 'Homepage')
    const outTable = [outHead].concat(outList)

    if (opts.color) {
      outTable[0] = outTable[0].map(heading => styles.underline(heading))
    }

    const tableOpts = {
      align: ['l', 'r', 'r', 'r', 'l'],
      stringLength: s => ansiTrim(s).length
    }
    output(table(outTable, tableOpts))
  }

  process.exitCode = outdated.length ? 1 : 0
}

async function outdated_ (tree, deps, opts) {
  const list = []

  async function getOutdatedInfo (name, node) {
    const spec = npa(name)
    const {
      path,
      location,
      package: {
        version: current
      }
    } = node || { package: {} }

    const edge = tree.edgesOut.get(name) || {}
    const type = edge.optional ? 'optionalDependencies'
      : edge.peer ? 'peerDependencies'
      : edge.dev ? 'devDependencies'
      : 'dependencies'

    // deps different from prod not currently
    // on disk are not included in the output
    if (edge.error === 'MISSING' && type !== 'dependencies') return
    
    try {
      const packument = await getPackument(spec)
      const expected = edge.spec
      const wanted = pickManifest(packument, expected, npm.flatOptions)
      const latest = pickManifest(packument, '*', npm.flatOptions)

      if (
        !current ||
        current !== wanted.version ||
        wanted.version !== latest.version
      ) {
        list.push({
          name,
          path,
          type,
          current,
          homepage: packument.homepage,
          wanted: wanted.version,
          latest: latest.version,
          location
        })
      }
    } catch (err) {
      // silently catch and ignore ETARGET, E403 &
      // E404 errors, deps are just skipped
      if (!(
        err.code === 'ETARGET' ||
        err.code === 'E403' ||
        err.code === 'E404')
      ) {
        throw (err)
      }
    }

  }
  
  const p = []
  if (deps.length !== 0) {
    // specific deps
    for (let i = 0; i < deps.length; i++) {
      const set = tree.inventory.query('name', deps[i])
      for (const node of set) {
        p.push(getOutdatedInfo(deps[i], node))
      }
    }
  } else if (opts.all) {
    // all deps in tree
    for (const [name, node] of tree.inventory) {
      p.push(getOutdatedInfo(node.name, node))
    }
  }
  else {
    // top-level deps
    for (const [name, edge] of tree.edgesOut) {
      const { to } = edge
      p.push(getOutdatedInfo(name, to))
    }
  }

  await Promise.all(p)
  return list
}

// packument fetching memoizing
const packuments = new Map()
async function getPackument (spec) {
  if (packuments.has(spec)) {
    return packuments.get(spec)
  }
  const packument = await pacote.packument(spec, {
    fullMetadata: npm.flatOptions.long,
    preferOnline: true
  })
  packuments.set(spec, packument)
  return packument
}

// formatting functions
function makePretty (dep, opts) {
  const {
    current = 'MISSING',
    location = '-',
    homepage = '',
    name,
    wanted,
    latest,
    type
  } = dep

  const columns = [name, current, wanted, latest, location]

  if (opts.long) {
    columns[5] = type
    columns[6] = homepage
  }

  if (opts.color) {
    columns[0] = color[current === wanted ? 'yellow' : 'red'](columns[0]) // current
    columns[2] = color.green(columns[2]) // wanted
    columns[3] = color.magenta(columns[3]) // latest
  }

  return columns
}

// --parseable creates output like this:
// <fullpath>:<name@wanted>:<name@installed>:<name@latest>
function makeParseable (list, opts) {
  return list.map(dep => {
    const { name, current, wanted, latest, path, type, homepage } = dep
    const out = [
      path,
      name + '@' + wanted,
      current ? (name + '@' + current) : 'MISSING',
      name + '@' + latest
    ]
    if (opts.long) out.push(type, homepage)

    return out.join(':')
  }).join(os.EOL)
}

function makeJSON (list, opts) {
  const out = {}
  list.forEach(dep => {
    const { name, current, wanted, latest, path, type, homepage } = dep
    out[name] = {
      current,
      wanted,
      latest,
      location: path
    }
    if (opts.long) {
      out[name].type = type
      out[name].homepage = homepage
    }
  })
  return JSON.stringify(out, null, 2)
}
