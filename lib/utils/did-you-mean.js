const { distance } = require('fastest-levenshtein')
const readJson = require('read-package-json-fast')
const { commands } = require('./cmd-nplist.js')
const Npm = require('../npm')

// We would already be suggesting this in `npm x` so omit them here
const runScripts = ['stop', 'start', 'test', 'restart']

const didYouMean = async (path, scmd) => {
  const suggest = []

  const close = commands.filter(cmd => distance(scmd, cmd) < scmd.length * 0.4 && scmd !== cmd)
  for (const str of close) {
    const Command = Npm.derefCommand(str)
    suggest.push([str, Command.description])
  }

  // gracefully ignore not being in a folder w/ a package.json
  const { bin = {}, scripts = {} } = await readJson(`${path}/package.json`).catch(() => ({}))

  suggest.concat(Object.keys(scripts)
    .filter(cmd => distance(scmd, cmd) < scmd.length * 0.4 && !runScripts.includes(cmd))
    .map(str => [`run ${str}`, `run the "${str}" package script`]))

  suggest.concat(Object.keys(bin)
    .filter(cmd => distance(scmd, cmd) < scmd.length * 0.4)
    .map(str => [
      `exec ${str}`,
      `run the "${str}" command from either this or a remote npm package`]
    ))

  if (suggest.length === 0) {
    return ''
  }

  const best = suggest.slice(0, 3)
  const plural = best.length === 1 ? 'this' : 'one of these'
  const messages = best.map((b) => `npm ${b[0]} # ${b[1]}`)

  return `\n\nDid you mean ${plural}?\n${messages.join('\n')}`
}

module.exports = didYouMean
