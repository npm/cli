'use strict'

const pacote = require('pacote')
const fs = require('fs')
const resolve = require('path').resolve
const url = require('url')

const mkdirp = require('mkdirp')
const test = require('tap').test

const npm = require('../../lib/npm.js')
const common = require('../common-tap.js')

const cache = common.cache
const pkg = resolve(common.pkg, 'package')
const repo = resolve(common.pkg, 'repo')
mkdirp.sync(pkg)

let git
const cloneURL = 'git+file://' + resolve(pkg, 'child.git')

const pjChild = JSON.stringify({
  name: 'child',
  version: '1.0.3'
}, null, 2) + '\n'

test('setup', { bail: true }, function (t) {
  mkdirp.sync(repo)
  fs.writeFileSync(resolve(repo, 'package.json'), pjChild)
  npm.load({
    cache,
    registry: common.registry,
    loglevel: 'silent'
  }, function () {
    git = require('../../lib/utils/git.js')

    common.makeGitRepo({
      path: repo,
      commands: [git.chainableExec(
        ['clone', '--bare', repo, 'child.git'],
        { cwd: pkg, env: process.env }
      )]
    }, er => {
      t.ifError(er)
      t.end()
    })
  })
})

test('cache from repo', async t => {
  process.chdir(pkg)
  const manifest = await pacote.manifest(cloneURL, npm.flatOptions)
  t.equal(
    url.parse(manifest._resolved).protocol,
    'git+file:',
    'npm didn\'t go crazy adding git+git+git+git'
  )
})

test('save install', function (t) {
  process.chdir(pkg)
  fs.writeFileSync('package.json', JSON.stringify({
    name: 'parent',
    version: '5.4.3'
  }, null, 2) + '\n')
  const prev = npm.config.get('save')
  npm.config.set('save', true)
  npm.commands.install('.', [cloneURL], function (er) {
    npm.config.set('save', prev)
    t.ifError(er, 'npm installed via git')
    const pj = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
    const dep = pj.dependencies.child
    t.equal(
      url.parse(dep).protocol,
      'git+file:',
      'npm didn\'t strip the git+ from git+file://'
    )

    t.end()
  })
})
