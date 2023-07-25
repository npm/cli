const { join, basename } = require('path')
const fsp = require('fs/promises')
const hgi = require('hosted-git-info')
const semver = require('semver')
const pacote = require('pacote')
const log = require('proc-log')
const tar = require('tar')
const { cp, withTempDir } = require('@npmcli/fs')
const { CWD, run, spawn, git, fs, gh } = require('./util.js')

const NODE_FORK = 'npm/node'
// this script expects node to already be cloned to a directory at the cli root named "node"
const NODE_DIR = join(CWD, 'node')
const gitNode = spawn.create('git', { cwd: NODE_DIR })

const createNodeTarball = async ({ mani, registryOnly, localTest, tag, dir: extractDir }) => {
  const tarball = join(extractDir, 'npm-node.tgz')
  await pacote.tarball.file(mani._from, tarball, { resolved: mani._resolved })

  if (registryOnly) {
    // a future goal is to only need files from the published tarball for
    // inclusion in node. in that case, we'd be able to remove everything after
    // this line since we have already fetched the tarball
    return tarball
  }

  // extract tarball to current dir and delete original tarball
  await tar.x({ strip: 1, file: tarball, cwd: extractDir })
  await fs.rimraf(tarball)

  // checkout the tag since we need to get files from source.
  if (!localTest) {
    try {
      await git('checkout', tag)
    } catch (err) {
      log.error('Use the `--local-test` flag to avoid checking out the tag')
      throw err
    }
  }
  // currently there is an empty .npmrc file in the deps/npm dir in the node repo
  // i do not know why and it might not be used but in order to minimize any
  // unnecessary churn, let's create that file to match the old process
  await fsp.writeFile(join(extractDir, '.npmrc'), '', 'utf-8')

  // copy our test dirs so that tests can be run
  for (const path of ['tap-snapshots/', 'test/']) {
    await cp(join(CWD, path), join(extractDir, path), { recursive: true })
  }

  // recreate the tarball as closely as possible to how we would before publishing
  // to the registry. the only difference here is the extra files we put in the dir
  await tar.c({
    ...pacote.DirFetcher.tarCreateOptions(mani),
    cwd: extractDir,
    file: tarball,
  }, ['.'])

  return tarball
}

const getPrBody = async ({ releases, closePrs }) => {
  const useSummary = releases.length > 1
  const releasePath = (v) => `/npm/cli/releases/tag/v${v}`

  // XXX: add links to relevant CI and CITGM runs once we no longer include our tests
  let prBody = ''

  if (useSummary) {
    const summary = releases.map(r => {
      return `[\`npm@${r.version}\`](https://github.com${releasePath(r.version)})`
    })
    prBody += `This PR contains changes from: ${summary.join(' ')}\n\n`
  }

  if (closePrs.length) {
    prBody += `This PR replaces: ${closePrs.map(pr => pr.url).join(' ')}\n\n`
  }

  if (prBody) {
    prBody += '---\n\n'
  }

  for (const { version, body } of releases) {
    prBody += useSummary
      ? `<details><summary>${version}</summary>\n<p>\n\n${body}\n\n</p>\n</details>`
      : body
    prBody += '\n'
  }

  // These comes from the releases so those link to the raw comparison between tags.
  // Since we are putting this in a PR we can change those links back to the releases.
  prBody = prBody.replace(/\/npm\/cli\/compare\/v[\w.-]+\.\.\.v([\w.-]+)/g, releasePath('$1'))

  const { remark } = await import('remark')
  const { default: remarkGfm } = await import('remark-gfm')
  const { default: remarkGithub } = await import('remark-github')

  return remark()
    .use(remarkGfm)
    .use(remarkGithub, {
      repository: 'npm/cli',
      // dont link mentions, but anything else make the link an explicit referance to npm/cli
      buildUrl: (values, buildUrl) => values.type === 'mention' ? false : buildUrl(values),
    })
    .process(prBody)
    .then(v => String(v))
}

const tokenRemoteUrl = ({ host, token }) => {
  // this is a remote url that uses a github token as the username
  // in order to authenticate with github
  const headRemoteUrl = new URL(host.https())
  headRemoteUrl.username = token
  // we have to manually change the protocol. the whatwg url spec
  // does not allow changing a special protocol to another one
  // but the protocol has to be `https:` without the `git+`
  return headRemoteUrl.toString().replace('git+https:', 'https:')
}

const main = async (spec, branch = 'main', opts) => withTempDir(CWD, async (tmpDir) => {
  const { GITHUB_TOKEN } = process.env
  const { dryRun, registryOnly, localTest } = opts

  if (!spec) {
    throw new Error('`spec` is required as the first argument')
  }

  if (!branch) {
    throw new Error('`branch` is required as the second argument')
  }

  if (!GITHUB_TOKEN) {
    throw new Error(`process.env.GITHUB_TOKEN is required`)
  }

  await fsp.access(NODE_DIR, fsp.constants.F_OK).catch(() => {
    throw new Error(`node repo must be checked out to \`${NODE_DIR}\` to continue`)
  })

  await gh.json('repo', 'view', NODE_FORK, 'url').catch(() => {
    throw new Error(`node repo must be forked to ${NODE_FORK}`)
  })

  await git.dirty().catch((er) => {
    if (localTest) {
      return log.info('Skipping git dirty check due to `--local-test` flag')
    }
    throw er
  })

  const mani = await pacote.manifest(`npm@${spec}`, { preferOnline: true })
  const packument = await pacote.packument('npm', { preferOnline: true })
  const npmVersions = Object.keys(packument.versions).sort(semver.rcompare)

  const npmVersion = semver.parse(mani.version)
  const npmHost = hgi.fromUrl(NODE_FORK)
  const npmTag = `v${npmVersion}`
  const npmBranch = `npm-${npmTag}`
  const npmRemoteUrl = tokenRemoteUrl({ host: npmHost, token: GITHUB_TOKEN })
  const npmMessage = (v = npmVersion) => `deps: upgrade npm to ${v}`

  const tarball = await createNodeTarball({
    mani,
    tag: npmTag,
    dir: tmpDir,
    registryOnly,
    localTest,
  })
  log.info('tarball path', tarball)

  const nodeRemote = 'origin'
  const nodeBranch = /^\d+$/.test(branch) ? `v${branch}.x-staging` : branch
  const nodeHost = hgi.fromUrl(await gitNode('remote', 'get-url', nodeRemote, { out: true }))
  const nodePrArgs = ['pr', '-R', nodeHost.path()]

  await gitNode('fetch', nodeRemote)
  await gitNode('checkout', nodeBranch)
  await gitNode('reset', '--hard', `${nodeRemote}/${nodeBranch}`)

  const nodeNpmPath = join('deps', 'npm')
  const nodeNpmDir = join(NODE_DIR, nodeNpmPath)
  const nodeNpmVersion = require(join(nodeNpmDir, 'package.json')).version

  // this is the range of all versions included in this update based
  // on the current version of npm in node currently. we use this
  // to build a list of all release notes and to close any existing PRs
  const newNpmVersions = npmVersions.slice(
    npmVersions.indexOf(npmVersion.toString()),
    npmVersions.indexOf(nodeNpmVersion)
  )
    .reverse()
    .map((v) => semver.parse(v))
    .filter((version) => version.major === npmVersion.major)

  // get a list of all versions changelogs to add to the body of the PR
  // do this before we checkout our branch and make any changes
  const npmReleases = await Promise.all(newNpmVersions.map(async (v) => {
    // dont include prereleases unless we are updating to a prerlease since we
    // manually put all prerelease notes into the first stable major version
    if (v.prerelease.length && !npmVersion.prerelease.length) {
      return null
    }
    return {
      version: v,
      body: await gh.json('release', 'view', `v${v}`, 'body', { quiet: true }).then(r => r.trim()),
    }
  })).then(r => r.filter(Boolean))

  log.info('npm versions', newNpmVersions.map(v => v.toString()))
  log.info('npm releases', npmReleases.map(u => u.version.toString()))

  await gitNode('branch', '-D', npmBranch, { ok: true })
  await gitNode('checkout', '-b', npmBranch)
  await fs.clean(nodeNpmDir)
  await tar.x({ strip: 1, file: tarball, cwd: nodeNpmDir })
  await fs.rimraf(join(nodeNpmDir, basename(tarball)))

  await gitNode('add', '-A', nodeNpmPath)
  await gitNode('commit', '-m', npmMessage())
  await gitNode('rebase', '--whitespace', 'fix', nodeBranch)

  await gitNode('remote', 'rm', npmHost.user, { ok: true })
  await gitNode('remote', 'add', npmHost.user, npmRemoteUrl)
  if (!dryRun) {
    await gitNode('push', npmHost.user, npmBranch, '--force')
  }

  const npmPrs = await gh.json(
    ...nodePrArgs, 'list',
    '-S', `in:title "${npmMessage('')}"`,
    'number,title,url'
  )

  log.info('Found other npm PRs', npmPrs)

  let existingPr = null
  const closePrs = []

  for (const pr of npmPrs) {
    const prVersion = pr.title.replace(npmMessage(''), '').trim()
    log.silly('checking existing PR', prVersion, pr)

    if (!existingPr && prVersion === npmVersion.toString()) {
      existingPr = pr
    } else if (newNpmVersions.some(v => v.toString() === prVersion)) {
      closePrs.push(pr)
    }
  }

  log.info('Found existing PR', existingPr)
  log.info('Found PRs to close', closePrs)

  const prBody = await getPrBody({ releases: npmReleases, closePrs })

  const prArgs = [
    nodePrArgs,
    (existingPr ? ['edit', existingPr.number] : ['create', '-H', `${npmHost.user}:${npmBranch}`]),
    '-B', nodeBranch,
    '-t', npmMessage(),
  ].flat()

  if (dryRun) {
    log.info(`gh ${prArgs.join(' ')}`)
    return prBody
  }

  const newOrUpdatedPr = await gh(prArgs, '-F', '-', { input: prBody, out: true })
  const closeMessage = `Closing in favor of ${newOrUpdatedPr}`

  for (const closePr of closePrs) {
    log.info('Attempting to close PR', closePr.url)
    try {
      await gh(nodePrArgs, 'close', closePr.number, '-c', closeMessage)
    } catch (err) {
      log.error('Could not close PR', err)
    }
  }

  return newOrUpdatedPr
})

run(({ argv, ...opts }) => main(argv.remain[0], argv.remain[1], opts), {
  redact: process.env.GITHUB_TOKEN,
})
