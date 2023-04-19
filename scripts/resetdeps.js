
const { join } = require('path')
const { CWD, run, pkg, fs, git, npm } = require('./util.js')
const ciInfo = require('ci-info')

const checkout = () => git('checkout', 'node_modules/')

const main = async ({ packageLock }) => {
  await fs.rimraf(join(CWD, 'node_modules'))
  for (const { path } of await pkg.mapWorkspaces()) {
    await fs.rimraf(join(path, 'node_modules'))
  }

  await checkout()
  await npm('i', '--ignore-scripts', '--no-audit', '--no-fund', packageLock && '--package-lock')
  await npm('rebuild', '--ignore-scripts')
  if (!ciInfo.isCI) {
    await npm('run', 'dependencies', '--ignore-scripts')
  }
}

run(main).catch(checkout)
