
const { join } = require('path')
const { CWD, run, pkg, fs, git, npm } = require('./util.js')

const checkout = () => git('checkout', 'node_modules/')

const main = async ({ packageLock }) => {
  await fs.rimraf(join(CWD, 'node_modules'))
  await Promise.all((await pkg.mapWorkspaces()).map(({ path }) => fs.rimraf(join(path, 'node_modules'))))

  await checkout()
  await npm('i', '--ignore-scripts', '--no-audit', '--no-fund', packageLock && '--package-lock')
  await npm('rebuild', '--ignore-scripts')
  await npm('run', 'dependencies', '--ignore-scripts')
}

run(main).catch(checkout)
