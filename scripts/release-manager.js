#!/usr/bin/env node

const { Octokit } = require('@octokit/rest')
const semver = require('semver')

const log = (...logs) => console.error('LOG', ...logs)

const getReleaseProcess = async () => {
  // XXX: the release steps need to always be the last thing in the doc for this to work
  const RELEASE_PROCESS_SECTION = '### Release the CLI and workspaces'
  const RELEASE_PROCESS_WIKI = 'https://raw.githubusercontent.com/wiki/npm/cli/Release-Process.md'
  const RELEASE_LIST_ITEM = /^\d+\.\s/gm

  log(`Fetching release process from:`, RELEASE_PROCESS_WIKI)

  const releaseProcess = await new Promise((resolve, reject) => {
    require('https')
      .get(RELEASE_PROCESS_WIKI, resp => {
        let d = ''
        resp.on('data', c => (d += c))
        resp.on('end', () => resolve(d))
      })
      .on('error', reject)
  })

  const section = releaseProcess.split(RELEASE_PROCESS_SECTION)[1]

  if (!section) {
    throw new Error('Could not find release process section:', RELEASE_PROCESS_SECTION)
  }

  return section.split({
    [Symbol.split] (str) {
      const [, ...matches] = str.split(RELEASE_LIST_ITEM)
      log(`Found ${matches.length} release items`)
      return matches.map((m, i) => `- [ ] <STEP_INDEX>. ${m}`.trim())
    },
  })
}

const getPrReleases = async (pr) => {
  const RELEASE_SEPARATOR = /<details><summary>.*<\/summary>/g
  const MONO_VERSIONS = /<details><summary>(?:(.*?):\s)?(.*?)<\/summary>/
  const ROOT_VERSION = /\n##\s\[(.*?)\]/

  const getReleaseInfo = ({ name, version: rawVersion }) => {
    const version = semver.parse(rawVersion)
    const prerelease = !!version.prerelease.length
    const tag = `${name ? `${name}-` : ''}v${rawVersion}`
    return {
      name,
      tag,
      prerelease,
      version: rawVersion,
      major: version.major,
      url: `https://github.com/${pr.base.repo.full_name}/releases/tag/${tag}`,
      flags: name ? `-w ${name} ${prerelease ? `--tag prerelease` : ''}`.trim() : '',
    }
  }

  const releases = pr.body.match(RELEASE_SEPARATOR)

  if (!releases) {
    log('Found no monorepo, checking for single root version')
    const [, version] = pr.body.match(ROOT_VERSION) || []

    if (!version) {
      throw new Error('Could not find version with:', ROOT_VERSION)
    }

    log('Found version', version)
    return [getReleaseInfo({ version })]
  }

  log(`Found ${releases.length} releases`)

  return releases.reduce((acc, r) => {
    const [, name, version] = r.match(MONO_VERSIONS)
    const release = getReleaseInfo({ name, version })

    if (!name) {
      log('Found root', release.tag)
      acc[0] = release
    } else {
      log('Found workspace', release.tag)
      acc[1].push(release)
    }

    return acc
  }, [null, []])
}

const appendToComment = async ({ github, commentId, title, body }) => {
  if (!commentId) {
    log(`No comment id, skipping append to comment`)
    return
  }

  const { data: comment } = await github.rest.issues.getComment({
    ...github.repo,
    comment_id: commentId,
  })

  const hasAppended = comment.body.includes(title)

  log('Found comment with id:', commentId)
  log(hasAppended ? 'Comment has aready been appended, replacing' : 'Appending to comment')

  const prefix = hasAppended
    ? comment.body.split(title)[0]
    : comment.body

  return github.rest.issues.updateComment({
    ...github.repo,
    comment_id: commentId,
    body: [prefix, title, body].join('\n\n'),
  })
}

const main = async (env) => {
  // These env vars are set by the release.yml workflow from template-oss
  const {
    CI,
    GITHUB_TOKEN,
    GITHUB_REPOSITORY,
    RELEASE_PR_NUMBER,
    RELEASE_COMMENT_ID, // comment is optional for testing
  } = env

  if (!CI || !GITHUB_TOKEN || !GITHUB_REPOSITORY || !RELEASE_PR_NUMBER) {
    throw new Error('This script is designed to run in CI. If you want to test it, set the ' +
      `following env vars: \`CI, GITHUB_TOKEN, GITHUB_REPOSITORY, RELEASE_PR_NUMBER\``)
  }

  const github = new Octokit({ auth: GITHUB_TOKEN })
  github.repo = { owner: GITHUB_REPOSITORY.split('/')[0], repo: GITHUB_REPOSITORY.split('/')[1] }

  const { data: pr } = await github.rest.pulls.get({
    ...github.repo,
    pull_number: RELEASE_PR_NUMBER,
  })

  const [release, workspaces = []] = await getPrReleases(pr)

  const RELEASE_OMIT_PRERELEASE = '> NOT FOR PRERELEASE'
  const RELEASE_OMIT_WORKSPACES = 'Publish workspaces'
  const releaseItems = (await getReleaseProcess())
    .filter((item) => {
      if (release.prerelease && item.includes(RELEASE_OMIT_PRERELEASE)) {
        return false
      }

      if (!workspaces.length && item.includes(RELEASE_OMIT_WORKSPACES)) {
        return false
      }

      return true
    })
    .map((item, index) => item.replace('<STEP_INDEX>', index + 1))

  log(
    `Filtered ${releaseItems.length} release process items:\n`,
    releaseItems.map(r => r.split('\n')[0]).join('\n')
  )

  const releaseTitle = `### Release Checklist for ${release.tag}`
  const releaseChecklist = releaseItems
    .join('\n\n')
    .replace(/<PR-NUMBER>/g, RELEASE_PR_NUMBER)
    .replace(/<RELEASE-BRANCH>/g, pr.head.ref)
    .replace(/<BASE-BRANCH>/g, pr.base.ref)
    .replace(/<MAJOR>/g, release.major)
    .replace(/<X\.Y\.Z>/g, release.version)
    .replace(/<GITHUB-RELEASE-LINK>/g, release.url)
    .replace(/(\s+node \. publish )-w <WS-PKG-N>/g, workspaces.map(w => `$1${w.flags}`).join(''))
    .trim()

  await appendToComment({
    github,
    commentId: RELEASE_COMMENT_ID,
    title: releaseTitle,
    body: releaseChecklist,
  })
}

main(process.env)
  // This is part of the release CI and is for posting a release manager
  // comment to the issue but we dont want it to ever fail the workflow so
  // just log but dont set the error code
  .catch(err => console.error(err))
