const { join } = require('node:path')
const { symlink } = require('node:fs/promises')
const { CWD, run, pkg, fs, git, npm } = require('./util.js')

const cleanup = async () => {
  await git('checkout', 'node_modules/')
  for (const { name, path } of await pkg.mapWorkspaces({ public: true })) {
    // add symlinks similar to how arborist does for our production
    // workspaces, so they are in place before the initial install.
    await symlink(path, join(CWD, 'node_modules', name), 'junction')
  }
}

const main = async ({ packageLock }) => {
  await git('status') // run ANY @npmcli/git command to instantiate its lazy loading
  await fs.rimraf(join(CWD, 'node_modules'))
  for (const { path } of await pkg.mapWorkspaces()) {
    await fs.rimraf(join(path, 'node_modules'))
  }

  await cleanup()
  await npm('i', '--ignore-scripts', '--no-audit', '--no-fund', packageLock && '--package-lock')
  await npm('rebuild', '--ignore-scripts')
  await npm('run', 'dependencies', '--ignore-scripts')
}

run(main).catch(cleanup)
