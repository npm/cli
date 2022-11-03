const semver = require('semver')
const log = require('proc-log')
const pacote = require('pacote')
const { run, git, npm, pkg: cli, spawn } = require('./util.js')

const resetdeps = () => npm('run', 'resetdeps')

const op = () => spawn('op', 'item', 'get', 'npm', '--otp', { out: true, ok: true })

const missingVersion = ({ name, version }) => {
  const mani = await pacote.manifest(`${name}@${version}`, { preferOnline: true })
    .catch(() => null)
  return !mani
}

const getLatest = async (s) => {
  const pack = await pacote.packument(s, { preferOnline: true })
  return pack['dist-tags'].latest
}

const TAG = {
  cli: ({ version }) => `next-${semver.major(version)}`,
  workspace: async ({ name, version }) => {
    const { prerelease, major } = semver.parse(version)
    if (prerelease.length) {
      return 'prerelease'
    }
    if (major === await getLatest(name).then(v => semver.major(v))) {
      return 'latest'
    }
    return 'backport'
  },
}

const needsPublish = async ({ private, name, version }, { force, getTag }) => {
  if (private) {
    return
  }

  if (force || await missingVersion({ name, version })) {
    return getTag({ name, version })
  }
}

const getPublishes = async (opts) => {
  const publish = []

  for (const { name, pkg } of await cli.mapWorkspaces()) {
    publish.push({
      workspace: name,
      tag: await needsPublish(pkg, { ...opts, getTag: TAG.workspace }),
    })
  }

  publish.push({
    tag: await needsPublish(cli, { ...opts, getTag: TAG.cli }),
  })

  return publish.filter(p => p.tag)
}

const main = async (opts) => {
  const packOnly = opts.pack || opts.packDestination
  const publishes = await getPublishes({ force: packOnly })

  if (!publishes.length) {
    throw new Error(
      'Nothing to publish, exiting. ' +
      'All packages to publish should have their version bumped before running this script.'
    )
  }

  log.info('publish', '\n' + publishes.map(JSON.stringify).join('\n'))

  await git('clean', '-fd')
  await resetdeps()
  await npm('ls', '--omit=dev', { quiet: true })
  await npm('rm', '--global', '--force', 'npm')
  await npm('link', '--force', '--ignore-scripts')

  if (opts.test) {
    await npm('run', 'lint-all', '--ignore-scripts')
    await npm('run', 'postlint', '--ignore-scripts')
    await npm('run', 'test-all', '--ignore-scripts')
  }

  await npm('prune', '--omit=dev', '--no-save', '--no-audit', '--no-fund')
  await npm('install', '-w', 'docs', '--ignore-scripts', '--no-audit', '--no-fund')
  await git.dirty()

  for (const p of publishes) {
    const workspace = p.workspace && `--workspace=${p.workspace}`
    if (packOnly) {
      await npm(
        'pack',
        workspace,
        opts.packDestination && `--pack-destination=${opts.packDestination}`
      )
    } else {
      await npm(
        'publish',
        workspace,
        `--tag=${p.tag}`,
        opts.dryRun && '--dry-run',
        opts.otp && `--otp=${opts.otp === 'op' ? await op() : opts.otp}`
      )
    }
  }
}

run(main).catch(resetdeps)
