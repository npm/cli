const { join } = require('path')
const { CWD, run, pkg, fs, git } = require('./util.js')

const main = async () => {
  await git.dirty()
  await Promise.all(pkg.files.map((p) => fs.rimraf(join(CWD, p))))
}

run(main)
