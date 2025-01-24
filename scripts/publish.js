const semver = require('semver')
const { log } = require('proc-log')
const pacote = require('pacote')
const { read } = require('read')
const Table = require('cli-table3')
const { run, git, npm, pkg: cli, spawn } = require('./util.js')

const resetdeps = () => npm('run', 'resetdeps')

const op = () => spawn('op', 'item', 'get', 'npm', '--otp', { out: true, ok: true })

const getWorkspaceTag = async ({ name, version }) => {
  const { prerelease, major } = semver.parse(version)
  if (prerelease.length) {
    return 'prerelease'
  }

  const pack = await pacote.packument(name, { preferOnline: true }).catch(() => null)

  if (!pack) {
    // This might never happen but if we were to create a new workspace that has never
    // been published before it should be set to latest right away.
    return 'latest'
  }

  if (major >= semver.major(pack['dist-tags'].latest)) {
    // if the major version we are publishing is greater than the major version
    // of the latest dist-tag, then this should be latest too
    return 'latest'
  }

  // Anything else is a backport
  return 'backport'
}

const versionNotExists = async ({ name, version }) => {
  const spec = `${name}@${version}`
  let exists
  try {
    await pacote.manifest(spec, { preferOnline: true })
    exists = true // if it exists, no publish needed
  } catch {
    exists = false // otherwise its needs publishing
  }
  log.info(`${spec} exists=${exists}`)
  return !exists
}

const getPublishes = async ({ force }) => {
  const publishPackages = []

  for (const { pkg } of await cli.mapWorkspaces({ public: true })) {
    if (force || await versionNotExists(pkg)) {
      publishPackages.push({
        workspace: true,
        name: pkg.name,
        version: pkg.version,
        tag: await getWorkspaceTag(pkg),
      })
    }
  }

  if (force || await versionNotExists(cli)) {
    publishPackages.push({
      name: cli.name,
      version: cli.version,
      tag: `next-${semver.major(cli.version)}`,
    })
  }

  return publishPackages
}

const main = async (opts) => {
  const { test, otp, dryRun, smokePublish, packDestination } = opts

  const hasPackDest = !!packDestination
  const publishes = await getPublishes({ force: smokePublish })

  if (!publishes.length) {
    throw new Error(
      'Nothing to publish, exiting.\n' +
      'All packages to publish should have their version bumped before running this script.'
    )
  }

  const table = new Table({ head: ['name', 'version', 'tag'] })
  for (const publish of publishes) {
    table.push([publish.name, publish.version, publish.tag])
  }

  const preformOperations = hasPackDest ? ['publish', 'pack'] : ['publish']

  const confirmMessage = [
    `Ready to ${preformOperations.join(',')} the following packages:`,
    table.toString(),
    smokePublish ? null : 'Ok to proceed? ',
  ].filter(Boolean).join('\n')

  if (smokePublish) {
    log.info(confirmMessage)
  } else {
    const confirm = await read({ prompt: confirmMessage, default: 'y' })
    if (confirm.trim().toLowerCase().charAt(0) !== 'y') {
      throw new Error('Aborted')
    }
  }

  await git('clean', '-fd')
  await resetdeps()
  await npm('ls', '--omit=dev', { quiet: true })
  await npm('rm', '--global', '--force', 'npm')
  await npm('link', '--force', '--ignore-scripts')

  if (test) {
    await npm('run', 'lint-all', '--ignore-scripts')
    await npm('run', 'postlint', '--ignore-scripts')
    await npm('run', 'test-all', '--ignore-scripts')
  }

  await npm('prune', '--omit=dev', '--no-save', '--no-audit', '--no-fund')
  await npm('install', '-w', 'docs', '--ignore-scripts', '--no-audit', '--no-fund')

  if (smokePublish) {
    log.info(`Skipping git dirty check due to local smoke publish test being run`)
  } else {
    await git.dirty()
  }

  let count = -1
  for (const publish of publishes) {
    log.info(`Publishing ${publish.name}@${publish.version} to ${publish.tag} ${count++}/${publishes.length}`)
    const workspace = publish.workspace && `--workspace=${publish.name}`
    const publishPkg = (...args) => npm('publish', workspace, `--tag=${publish.tag}`, ...args)

    if (hasPackDest) {
      await npm(
        'pack',
        workspace,
        packDestination && `--pack-destination=${packDestination}`
      )
    }

    if (smokePublish) {
      // when we have a smoke test run we'd want to bump the version or else npm will throw an error even with dry-run
      await npm('version', 'prerelease', workspace, '--preid=smoke', '--ignore-scripts', '--no-git-tag-version')
      await publishPkg('--dry-run', '--ignore-scripts')
    } else {
      await publishPkg(
        dryRun && '--dry-run',
        otp && `--otp=${otp === 'op' ? await op() : otp}`
      )
    }
  }
}

run(main).catch(resetdeps)
