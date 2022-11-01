const semver = require('semver')
const log = require('proc-log')
const pacote = require('pacote')
const { run, git, npm, pkg, spawn } = require('./util.js')

const resetdeps = () => npm('run', 'resetdeps')

const op = () => spawn('op', 'item', 'get', 'npm', '--otp', { out: true, ok: true })

const TAGS = {
  // cli is always published to next-MAJOR
  root: (v) => ({ tag: `next-${semver.major(v)}` }),
  // workspaces are always published to latest, except prereleases
  workspace: () => ({ tag: 'latest', preTag: 'prerelease' }),
}

const needsPublish = async ({ pkg: { private, name, version }, force, tags: getTags }) => {
  if (private) {
    return
  }

  const tags = getTags(version)
  const tag = semver.parse(version).prerelease.length && tags.preTag
    ? tags.preTag
    : tags.tag

  if (force) {
    return tag
  }

  const mani = await pacote.manifest(`${name}@${tag}`, { preferOnline: true })
  if (version !== mani.version) {
    return tag
  }
}

const getPublishes = async ({ force }) => {
  const publish = []

  for (const { name, pkg: ws } of await pkg.mapWorkspaces()) {
    publish.push({
      workspace: name,
      tag: await needsPublish({
        force,
        pkg: ws,
        tags: TAGS.workspace,
      }),
    })
  }

  publish.push({
    tag: await needsPublish({
      force,
      pkg,
      tags: TAGS.root,
    }),
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
