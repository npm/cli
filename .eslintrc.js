/* This file is automatically added by @npmcli/template-oss. Do not edit. */

'use strict'

const { readdirSync: readdir } = require('fs')

const localConfigs = readdir(__dirname)
  .filter((file) => file.startsWith('.eslintrc.local.'))
  .map((file) => `./${file}`)

module.exports = {
  root: true,
  ignorePatterns: [
    'docs',
    'smoke-tests',
    'workspaces/arborist',
    'workspaces/libnpmaccess',
    'workspaces/libnpmdiff',
    'workspaces/libnpmexec',
    'workspaces/libnpmfund',
    'workspaces/libnpmhook',
    'workspaces/libnpmorg',
    'workspaces/libnpmpack',
    'workspaces/libnpmpublish',
    'workspaces/libnpmsearch',
    'workspaces/libnpmteam',
    'workspaces/libnpmversion',
  ],
  extends: [
    '@npmcli',
    ...localConfigs,
  ],
}
