/* This file is automatically added by @npmcli/template-oss. Do not edit. */

'use strict'

const { readdirSync: readdir } = require('fs')

const localConfigs = readdir(__dirname)
  .filter((file) => file.startsWith('.eslintrc.local.'))
  .map((file) => `./${file}`)

module.exports = {
  root: true,
  ignorePatterns: [
    'docs/**',
    'smoke-tests/**',
    'mock-globals/**',
    'mock-registry/**',
    'workspaces/**',
  ],
  extends: [
    '@npmcli',
    ...localConfigs,
  ],
}
