// print a banner telling the user to upgrade npm to latest but not in CI, and not if we're doing that already.

const ciInfo = require('ci-info')
const gt = require('semver/functions/gt')
const gte = require('semver/functions/gte')
const parse = require('semver/functions/parse')
const { writeFileSync } = require('node:fs')
const { stat } = require('node:fs/promises')
const { resolve } = require('node:path')

// update check frequency
const DAILY = 1000 * 60 * 60 * 24

// don't put it in the _cacache folder, just in npm's cache
const lastCheckedFile = npm => resolve(npm.flatOptions.cache, '../_update-notifier-last-checked')

// Actual check for updates. This is a separate function so that we only load this if we are doing the actual update
const updateCheck = async (npm, spec, version, current) => {
  const pacote = require('pacote')

  const mani = await pacote.manifest(`npm@${spec}`, {
    // always prefer latest, even if doing --tag=whatever on the cmd
    defaultTag: 'latest',
    ...npm.flatOptions,
    cache: false,
  }).catch(() => null)

  // if pacote failed, give up
  if (!mani) {
    return null
  }

  const latest = mani.version

  // if the current version is *greater* than latest, we're on a 'next' and should get the updates from that release train.
  // Note that this isn't another http request over the network, because the packument will be cached by pacote from previous request.
  if (gt(version, latest) && spec === '*') {
    return updateNotifier(npm, `^${version}`)
  }

  // if we already have something >= the desired spec, then we're done
  if (gte(version, latest)) {
    return null
  }

  const chalk = npm.logChalk

  // ok! notify the user about this update they should get.
  // The message is saved for printing at process exit so it will not get lost in any other messages being printed as part of the command.
  const update = parse(mani.version)
  const type = update.major !== current.major ? 'major'
    : update.minor !== current.minor ? 'minor'
    : update.patch !== current.patch ? 'patch'
    : 'prerelease'
  const typec = type === 'major' ? 'red'
    : type === 'minor' ? 'yellow'
    : 'cyan'
  const message = [
    '',
    `New ${chalk[typec](type)} version of npm available! ${chalk[typec](current)} -> ${chalk.blue(latest)}`,
    `Changelog: ${chalk.blue(`https://github.com/npm/cli/releases/tag/v${latest}`)}`,
    `To update run: ${chalk.underline(`npm install -g npm@${latest}`)}`,
    '',
  ].join('\n')

  return {
    message,
    onShown: () => writeFileSync(lastCheckedFile(npm), ''),
  }
}

const updateNotifier = async (npm, spec = '*') => {
  // Check daily for stable and prerelease versions.
  const { version } = npm
  const current = parse(version)

  // if we're on a beta train, always get the next beta
  if (current.prerelease.length) {
    spec = `^${version}`
  }

  const duration = DAILY
  const t = new Date(Date.now() - duration)
  // if we don't have a file, then definitely check it.
  const st = await stat(lastCheckedFile(npm)).catch(() => ({ mtime: t - 1 }))

  // if we've already checked within the specified duration, don't check again
  if (!(t > st.mtime)) {
    return null
  }

  return updateCheck(npm, spec, version, current)
}

module.exports = async npm => {
  if (
    // opted out
    !npm.config.get('update-notifier')
    // global npm update
    || (npm.flatOptions.global &&
      ['install', 'update'].includes(npm.command) &&
      npm.argv.some(arg => /^npm(@|$)/.test(arg)))
    // CI
    || ciInfo.isCI
  ) {
    return null
  }

  return updateNotifier(npm)
}
