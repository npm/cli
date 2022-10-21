
const { join } = require('path')
const { CWD, run, pkg, fs, spawn, git, npm } = require('./util.js')

const checkout = () => git('checkout', 'node_modules/')

const main = async ({ packageLock }) => {
  await fs.rimraf(join(CWD, 'node_modules'))
  for (const { path } of await pkg.mapWorkspaces()) {
    await fs.rimraf(join(path, 'node_modules'))
  }

  await checkout()
  await npm('i', '--ignore-scripts', '--no-audit', '--no-fund', packageLock && '--package-lock')
  await npm('rebuild', '--ignore-scripts')
  await npm('run', 'dependencies', '--ignore-scripts')
  if (process.env.CI) {
    // this script can take awhile to rebuild the cmark-gfm bindings
    // so we only run it in CI. locally this is handled by pretest and
    // prebuild scripts, which don't run in CI due to --ignore-scripts
    await spawn('node', join('scripts', 'rebuild.js'), 'cmark-gfm')
  }
}

run(main).catch(checkout)
