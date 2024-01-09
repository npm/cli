const { resolve } = require('path')
const { readdirSync, lstatSync } = require('fs')

process.env.ARBORIST_FIXTURE_CLEANUP = '1'
require('./index.js')

// now make sure it actually did clean up everything
const readdir = (path, opt) => {
  const ents = readdirSync(path, opt)
  if (typeof ents[0] === 'string') {
    return ents.map(ent => {
      return Object.assign(lstatSync(path + '/' + ent), { name: ent })
    })
  }
  return ents
}

const walk = dir => {
  for (const entry of readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      walk(resolve(dir, entry.name))
    } else if (entry.isSymbolicLink()) {
      throw Object.assign(new Error('symlink left in fixtures dir'), {
        path: resolve(dir, entry.name),
      })
    }
  }
}

walk(__dirname)
