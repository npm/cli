const fs = require('graceful-fs')
const path = require('path')
const existsSync = fs.existsSync || path.existsSync

const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const t = require('tap')

const common = require('../common-tap.js')

const pkg = common.pkg

const EXEC_OPTS = { cwd: pkg }

const json = {
  name: 'install-cli-development',
  description: 'fixture',
  version: '0.0.0',
  dependencies: {
    'cross-dependency': `file:${pkg}/cross-dependency`,
    'prod-dependency': `file:${pkg}/prod-dependency`
  },
  devDependencies: {
    'dev-dependency': `file:${pkg}/dev-dependency`
  }
}

const crossDependency = {
  name: 'cross-dependency',
  description: 'fixture',
  version: '0.0.0'
}

const prodDependency = {
  name: 'prod-dependency',
  description: 'fixture',
  version: '0.0.0'
}

const devDependency = {
  name: 'dev-dependency',
  description: 'fixture',
  version: '0.0.0',
  dependencies: {
    'cross-dependency': `file:${pkg}/cross-dependency`
  }
}

t.test('setup', t => {
  mkdirp.sync(path.join(pkg, 'cross-dependency'))
  fs.writeFileSync(
    path.join(pkg, 'cross-dependency', 'package.json'),
    JSON.stringify(crossDependency, null, 2)
  )

  mkdirp.sync(path.join(pkg, 'prod-dependency'))
  fs.writeFileSync(
    path.join(pkg, 'prod-dependency', 'package.json'),
    JSON.stringify(prodDependency, null, 2)
  )

  mkdirp.sync(path.join(pkg, 'dev-dependency'))
  fs.writeFileSync(
    path.join(pkg, 'dev-dependency', 'package.json'),
    JSON.stringify(devDependency, null, 2)
  )

  mkdirp.sync(path.join(pkg, 'node_modules'))
  fs.writeFileSync(
    path.join(pkg, 'package.json'),
    JSON.stringify(json, null, 2)
  )

  t.end()
})

t.test('\'npm install --only=development\' should only install devDependencies and their transitive dependencies', t => {
  common.npm(['install', '--only=development'], EXEC_OPTS, (err, code) => {
    t.ifError(err, 'install development successful')
    t.equal(code, 0, 'npm install did not raise error code')
    t.ok(
      JSON.parse(fs.readFileSync(
        path.resolve(pkg, 'node_modules/dev-dependency/package.json'), 'utf8')
      ),
      'devDependency was installed'
    )
    t.ok(
      JSON.parse(fs.readFileSync(
        path.resolve(pkg, 'node_modules/cross-dependency/package.json'), 'utf8')
      ),
      'crossDependency was installed'
    )
    t.notOk(
      existsSync(path.resolve(pkg, 'node_modules/prod-dependency/package.json')),
      'prodDependency was NOT installed'
    )
    rimraf(path.join(pkg, 'node_modules'), t.end)
  })
})

t.test('\'npm install --only=development\' should only install devDependencies and their transitive dependencies regardless of npm.config.get(\'production\')', t => {
  common.npm(['install', '--only=development', '--production'], EXEC_OPTS, (err, code) => {
    t.ifError(err, 'install development successful')
    t.equal(code, 0, 'npm install did not raise error code')
    t.ok(
      JSON.parse(fs.readFileSync(
        path.resolve(pkg, 'node_modules/dev-dependency/package.json'), 'utf8')
      ),
      'devDependency was installed'
    )
    t.ok(
      JSON.parse(fs.readFileSync(
        path.resolve(pkg, 'node_modules/cross-dependency/package.json'), 'utf8')
      ),
      'crossDependency was installed'
    )
    t.notOk(
      existsSync(path.resolve(pkg, 'node_modules/prod-dependency/package.json')),
      'prodDependency was NOT installed'
    )
    rimraf(path.join(pkg, 'node_modules'), t.end)
  })
})
