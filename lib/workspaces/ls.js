const npm = require('../npm.js')

const cmd = (args) =>
  new Promise((res, reject) => {
    npm.commands.ls(args, err => {
      if (err)
        reject(err)

      res()
    })
  })

const runCmd = async (workspaces, args) => {
  await cmd([...workspaces.keys(), ...args])
}

module.exports = runCmd
