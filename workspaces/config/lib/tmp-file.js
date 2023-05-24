const ini = require('ini')
const fs = require('fs/promises')
const localeCompare = require('@isaacs/string-locale-compare')('en')
const { defaults } = require('./definitions')

const defaultDataString = Object.entries(defaults).reduce((str, [key, val]) => {
  const obj = { [key]: val }
  return str + '\n' + ini.stringify(obj)
    .replace(/\r\n/g, '\n')
    .replace(/\n$/m, '')
    .replace(/^/g, '; ')
    .replace(/\n/g, '\n; ')
    .split('\n')
}, '')

module.exports = async ({ where, file }) => {
  const data = await fs.readFile(file, 'utf8')
    .then((r) => r.replace(/\r\n/g, '\n'))
    .catch(() => '')

  return [
    `;;;;`,
    `; npm ${where}config file: ${file}`,
    `; this is a simple ini-formatted file`,
    `; lines that start with semi-colons are comments`,
    `; run \`npm help 7 config\` for documentation of the various options`,
    `;`,
    `; Configs like \`@scope:registry\` map a scope to a given registry url.`,
    `;`,
    `; Configs like \`//<hostname>/:_authToken\` are auth that is restricted`,
    `; to the registry host specified.`,
    '',
    data.split('\n').sort(localeCompare).join('\n').trim(),
    '',
    `;;;;`,
    `; all available options shown below with default values`,
    `;;;;`,
    '',
    defaultDataString.trim(),
  ].join('\n')
}
