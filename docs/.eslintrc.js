/* This file is automatically added by @npmcli/template-oss. Do not edit. */

const { readdirSync: readdir } = require('fs')

const localConfigs = readdir(__dirname)
  .filter((file) => file.startsWith('.eslintrc.local.'))
  .map((file) => `./${file}`)

module.exports = {
  root: true,
  extends: [
    '@npmcli',
    ...localConfigs,
  ],
}
