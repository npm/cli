const { resolve } = require('path')

const cmd = ({ npm, path, cmdName, args }) =>
  new Promise((res, reject) => {
    const wsPath = resolve(npm.flatOptions.prefix, path)
    npm.localPrefix = wsPath
    npm.config.set('prefix', wsPath)

    npm.commands[cmdName](args, err => {
      if (err)
        reject(err)

      res()
    })
  })

const runCmd = ({ npm, workspaces, cmdName, args }) =>
  Promise.all(
    [...workspaces.values()]
      .map(w => cmd({ npm, path: w, cmdName, args }))
  )

module.exports = runCmd
