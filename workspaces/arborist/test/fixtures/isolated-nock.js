const nock = require('nock')
const tar = require('tar-stream')
const Stream = require('node:stream')
const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')

/* Utility to extract a buffer out of a stream */
class StreamToBuffer extends Stream.Writable {
  constructor (opts) {
    super(opts)
    this._bufferArray = []
  }

  _write (chunk, encoding, callback) {
    this._bufferArray.push(chunk)
    callback()
  }

  _final (callback) {
    this.buffer = Buffer.concat(this._bufferArray)
    callback()
  }
}

/**
 * packPackageToStream
 * Uses 'tar-stream' to create the tar stream without touching the file system.
 */
function packPackageToStream (manifest, reg) {
  const {
    name,
    version,
  } = manifest
  const { shrinkwrap, bundledDeps, ...rest } = manifest

  const pack = tar.pack()
  const manifestString = JSON.stringify({
    ...rest,
  })
  const index = `console.log('Hello from ${name}@${version}!')`
  const unscopedName = name.replace(/^@[^/]*\//, '')
  pack.entry({ name: unscopedName, type: 'directory' })
  pack.entry({ name: `${unscopedName}/package.json` }, manifestString)
  pack.entry({ name: `${unscopedName}/index.js` }, index)
  pack.entry({ name: `${unscopedName}/bin.js` }, '#!/usr/bin/env node\nconsole.log("bin")')
  if (shrinkwrap) {
    pack.entry({ name: `${unscopedName}/npm-shrinkwrap.json` }, shrinkwrap.replace(/##REG##/g, reg))
  }
  if (bundledDeps) {
    pack.entry({ name: `${unscopedName}/node_modules`, type: 'directory' })
    bundledDeps.forEach(d => {
      pack.entry({ name: `${unscopedName}/node_modules/${d.name}`, type: 'directory' })
      pack.entry({ name: `${unscopedName}/node_modules/${d.name}/package.json` }, JSON.stringify(d))
      pack.entry({ name: `${unscopedName}/node_modules/${d.name}/index.js` }, `console.log('Hello from ${d.name}@${d.version}!')`
      )
    })
  }

  pack.finalize()
  return pack
}

/**
 * Pack a package for publish.
 * Returns a buffer containing a tarball of the package.
 */
async function packPackage (manifest, reg) {
  const packStream = packPackageToStream(manifest, reg)

  const tarBuffer = packStream.pipe(new StreamToBuffer())

  return new Promise((resolve, reject) => {
    tarBuffer.on('close', () => {
      resolve(tarBuffer.buffer)
    })
    tarBuffer.on('error', reject)
  })
}

/**
 * Publish the given package to the given registry.
 */
async function publishPackage (registry, manifest, packuments) {
  const {
    name,
    version,
  } = manifest
  const { shrinkwrap, bundledDeps, ...rest } = manifest

  if (packuments.has(name)) {
    packuments.get(name).versions[version] = {
      bin: './bin.js',
      ...rest,
      dist: {
        tarball: `${registry}/${name.replace(/\//g, '-')}/${version}.tar`,
      },
    }
  } else {
    packuments.set(name, {
      name,
      'dist-tags': {
        latest: version,
      },
      versions: {
        [version]: {
          ...rest,
          bin: './bin.js',
          dist: {
            tarball: `${registry}/${name.replace(/\//g, '-')}/${version}.tar`,
          },
        },
      },
    })
  }

  const tarball = await packPackage(manifest, registry)

  nock(registry)
    .persist()
    .get(`/${name.replace(/\//g, '-')}/${version}.tar`)
    .reply(200, tarball)
}

/**
 * Given an object decribing a dependency graph, this funcion will materialize
 * this dependency graph on disk and in a registry.
 *
 * The input has the following shape:
 * {
 *   registry: [ package1, package2,... ],
 *   root: { name: <name>, version: <version>, dependencies: <dependencies> }
 * }
 * package# represent a registry package and is of the following shape:
 * { name: <name>, version: <version>, dependencies?: <dependencies> }
 *
 * The return value is of the form { dir, registry } where:
 * - dir is the location on disk of the root package
 * - registry is the url of the registry which has the necessary packages
 *
 * Only simple graphs are currenly supported, the following features will come in further iterations:
 * - lockfile
 * - shinkwrap
 * - bundled dependencies
 *
 * The API of this function is not stable and is likely to evolve as we add more features.
 */
async function getRepo (graph) {
  // Generate a new random registry every time to prevent interference between tests
  const registry = `https://${Math.random().toString(36).substring(2)}.test`

  const packuments = new Map()
  // Publish all the registery packages
  await Promise.all(graph.registry.map(o =>
    publishPackage(registry, o, packuments)))

  packuments.forEach((packument, name) => {
    nock(registry)
      .persist()
      .get(`/${name.replace(/\//g, '%2f')}`)
      .reply(200, packument)
  })

  // Generate the root of the graph on disk
  const root = graph.root
  const workspaces = graph.workspaces || []
  const repo = {
    'package.json': JSON.stringify({
      workspaces: workspaces.length !== 0 ? ['packages/*'] : undefined,
      ...root,
    }),
    packages: {},
  }
  workspaces.forEach(wp => {
    repo.packages[wp.name] = {
      'package.json': JSON.stringify(wp),
      'bin.js': '#!/usr/bin/env node\nconsole.log("bin")',
      'index.js': `console.log('Hello from workspace ${wp.name}')`,
    }
  })
  const dir = testdir(repo)
  return { dir, registry }
}

function testdir (structure) {
  const dir = fs.mkdtempSync(`${fs.realpathSync(os.tmpdir())}/test-`)
  createDir(dir, structure)
  return dir
}

function createDir (dir, structure) {
  Object.entries(structure).forEach(([key, value]) => {
    if (typeof value === 'object') {
      const newDir = path.join(dir, key)
      fs.mkdirSync(newDir)
      createDir(newDir, value)
    } else {
      fs.writeFileSync(path.join(dir, key), value)
    }
  })
}

exports.getRepo = getRepo
