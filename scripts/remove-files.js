const { join } = require('path')
const { CWD, run, pkg, fs, git } = require('./util.js')

const main = async () => {
  await git.dirty()
  for (const p of pkg.files) {
    await fs.rimraf(join(CWD, p))
  }
}

run(main)
