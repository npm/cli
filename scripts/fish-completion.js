/* eslint-disable no-console */
const fs = require('node:fs/promises')
const { resolve } = require('node:path')

const { commands, aliases } = require('../lib/utils/cmd-list.js')
const { definitions } = require('@npmcli/config/lib/definitions')

async function main () {
  const file = resolve(__dirname, '..', 'lib', 'utils', 'completion.fish')
  console.log(await fs.readFile(file, 'utf-8'))
  const cmds = {}
  for (const cmd of commands) {
    cmds[cmd] = { aliases: [cmd] }
    const cmdClass = require(`../lib/commands/${cmd}.js`)
    cmds[cmd].description = cmdClass.description
    cmds[cmd].params = cmdClass.params
  }
  for (const alias in aliases) {
    cmds[aliases[alias]].aliases.push(alias)
  }
  for (const cmd in cmds) {
    console.log(`# ${cmd}`)
    const { aliases: cmdAliases, description, params = [] } = cmds[cmd]
    // If npm completion could return all commands in a fish friendly manner
    // like we do w/ run-script these wouldn't be needed.
    /* eslint-disable-next-line max-len */
    console.log(`complete -x -c npm -n __fish_npm_needs_command -a '${cmdAliases.join(' ')}' -d '${description}'`)
    const shorts = params.map(p => {
      // Our multi-character short params (e.g. -ws) are not very standard and
      // don't work with things that assume short params are only ever single
      // characters.
      if (definitions[p].short?.length === 1) {
        return `-s ${definitions[p].short}`
      }
    }).filter(p => p).join(' ')
    // The config descriptions are not appropriate for -d here. We may want to
    // consider having a more terse description for these.
    // We can also have a mechanism to auto-generate the long form of options
    // that have predefined values.
    // params completion
    /* eslint-disable-next-line max-len */
    console.log(`complete -x -c npm -n '__fish_seen_subcommand_from ${cmdAliases.join(' ')}' ${params.map(p => `-l ${p}`).join(' ')} ${shorts}`)
    // builtin npm completion
    /* eslint-disable-next-line max-len */
    console.log(`complete -x -c npm -n '__fish_seen_subcommand_from ${cmdAliases.join(' ')}' -a '(__fish_complete_npm)'`)
  }
}

main().then(() => {
  return process.exit()
}).catch(err => {
  console.error(err)
  process.exit(1)
})
