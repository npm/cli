/* eslint no-shadow:2 */
'use strict'

const { execSync } = require('child_process')
const semver = require('semver')
const fs = require('fs')
const config = require('@npmcli/template-oss')
const { resolve, relative } = require('path')

const exec = (...args) => execSync(...args).toString().trim()
const today = () => {
  const d = new Date()
  const pad = s => s.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const usage = () => `
  node ${relative(process.cwd(), __filename)} [--read|-r] [--write|-w] [tag]

  Generates changelog entries in our format starting from the most recent tag.
  By default this script will print the release notes to stdout.

  [tag] (defaults to most recent tag)
  A tag to generate release notes for. Helpful for testing this script against
  old releases. Leave this empty to look for the most recent tag.

  [--write|-w] (default: false)
  When set it will update the changelog with the new release.
  If a release with the same version already exists it will replace it, otherwise
  it will prepend it to the file directly after the top level changelog title.

  [--read|-r] (default: false)
  When set it will read the release notes for the [tag] from the CHANGELOG.md,
  instead of fetching it. This is useful after release notes have been manually
  edited and need to be pasted somewhere else.
`

// this script assumes that the tags it looks for all start with this prefix
const TAG_PREFIX = 'v'

// a naive implementation of console.log/group for indenting console
// output but keeping it in a buffer to be output to a file or console
const logger = (init) => {
  let indent = 0
  const step = 2
  const buffer = [init]
  return {
    toString () {
      return buffer.join('\n').trim()
    },
    group (s) {
      this.log(s)
      indent += step
    },
    groupEnd () {
      indent -= step
    },
    log (s) {
      if (!s) {
        buffer.push('')
      } else {
        buffer.push(s.split('\n').map((l) => ' '.repeat(indent) + l).join('\n'))
      }
    },
  }
}

// some helpers for generating common parts
// of our markdown release notes
const RELEASE = {
  sep: '\n\n',
  heading: '## ',
  // versions in titles must be prefixed with a v
  versionRe: semver.src[11].replace(TAG_PREFIX + '?', TAG_PREFIX),
  get h1 () {
    return '# Changelog' + this.sep
  },
  version (s) {
    return s.startsWith(TAG_PREFIX) ? s : TAG_PREFIX + s
  },
  date (d) {
    return `(${d})`
  },
  title (v, d) {
    return `${this.heading}${this.version(v)} ${this.date(d)}`
  },
}

// a map of all our changelog types that go into the release notes to be
// looked up by commit type and return the section title
const CHANGELOG = new Map(
  config.changelogTypes.filter(c => !c.hidden).map((c) => [c.type, c.section]))

const assertArgs = (args) => {
  if (args.help) {
    console.log(usage())
    return process.exit(0)
  }

  if (args.force) {
    // just to make manual testing easier
    return args
  }

  // we dont need to be up to date to read from our local changelog
  if (!args.read) {
    exec(`git fetch ${args.remote}`)
    const remoteBranch = `${args.remote}/${args.branch}`
    const current = exec(`git rev-parse --abbrev-ref HEAD`)

    if (current !== args.branch) {
      throw new Error(`Must be on branch "${args.branch}", rerun with --force to override`)
    }

    const localLog = exec(`git log ${remoteBranch}..HEAD`).length > 0
    const remoteLog = exec(`git log HEAD..${remoteBranch}`).length > 0

    if (current !== args.branch || localLog || remoteLog) {
      throw new Error(`Must be in sync with "${remoteBranch}"`)
    }
  }

  return args
}

const parseArgs = (argv) => {
  const result = {
    tag: null,
    file: resolve(__dirname, '..', 'CHANGELOG.md'),
    branch: 'latest',
    remote: 'origin',
    type: 'md', // or 'gh'
    format: 'short', // or 'long'
    write: false,
    read: false,
    help: false,
    force: false,
  }

  for (const arg of argv) {
    if (arg.startsWith('--')) {
      // dash to camel case. no value means boolean true
      const [key, value = true] = arg.slice(2).split('=')
      result[key.replace(/-([a-z])/g, (a) => a[1].toUpperCase())] = value
    } else if (arg.startsWith('-')) {
      // shorthands for read and write
      const short = arg.slice(1)
      const key = short === 'w' ? 'write' : short === 'r' ? 'read' : null
      result[key] = true
    } else {
      // anything else without a -- or - is the tag
      // force tag to start with a "v"
      result.tag = arg.startsWith(TAG_PREFIX) ? arg : TAG_PREFIX + arg
    }
  }

  // previous tag to requested tag OR most recent tag and everything after
  // only matches tags prefixed with "v" since only the cli is prefixed with v
  const getTag = (t = '') => exec(['git', 'describe', '--tags', '--abbrev=0',
    `--match="${TAG_PREFIX}*" ${t}`].join(' '))

  return assertArgs({
    ...result,
    // if a tag is passed in get the previous tag to make a range between the two
    // this is mostly for testing to generate release notes from old releases
    startTag: result.tag ? getTag(`${result.tag}~1`) : getTag(),
    endTag: result.tag || '',
  })
}

// find an entire section of a release from the changelog from a version
const findRelease = (args, version) => {
  const changelog = fs.readFileSync(args.file, 'utf-8')
  const escRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  const titleSrc = (v) => [
    '^',
    RELEASE.heading,
    v ? escRegExp(v) : RELEASE.versionRe,
    ' ',
    escRegExp(RELEASE.date(today())).replace(/\d/g, '\\d'),
    '$',
  ].join('')

  const releaseSrc = [
    '(',
    titleSrc(version && RELEASE.version(version)),
    '[\\s\\S]*?',
    RELEASE.sep,
    ')',
    titleSrc(),
  ].join('')

  const [, release = ''] = changelog.match(new RegExp(releaseSrc, 'm')) || []
  return {
    release: release.trim(),
    changelog,
  }
}

const generateRelease = async (args) => {
  const range = `${args.startTag}...${args.endTag}`

  const log = exec(`git log --reverse --pretty='format:%h' ${range}`)
    .split('\n')
    .filter(Boolean)
    // prefix with underscore so its always a valid identifier
    .map((sha) => `_${sha}: object (expression: "${sha}") { ...commitCredit }`)

  if (!log.length) {
    throw new Error(`No commits found for "${range}"`)
  }

  const query = `
    fragment commitCredit on GitObject {
      ... on Commit {
        message
        url
        abbreviatedOid
        authors (first:10) {
          nodes {
            user {
              login
              url
            }
            email
            name
          }
        }
        associatedPullRequests (first:10) {
          nodes {
            number
            url
            merged
          }
        }
      }
    }

    query {
      repository (owner:"npm", name:"cli") {
        ${log}
      }
    }
  `

  const res = JSON.parse(exec(`gh api graphql -f query='${query}'`))

  // collect commits by valid changelog type
  const commits = [...CHANGELOG.values()].reduce((acc, c) => {
    acc[c] = []
    return acc
  }, {})

  const allCommits = Object.values(res.data.repository)

  for (const commit of allCommits) {
    // get changelog type of commit or bail if there is not a valid one
    const [, type] = /(^\w+)[\s(:]?/.exec(commit.message) || []
    const changelogType = CHANGELOG.get(type)
    if (!changelogType) {
      continue
    }

    const message = commit.message
      .trim() // remove leading/trailing spaces
      .replace(/(\r?\n)+/gm, '\n') // replace multiple newlines with one
      .replace(/([^\s]+@\d+\.\d+\.\d+.*)/gm, '`$1`') // wrap package@version in backticks

    // the title is the first line of the commit, 'let' because we change it later
    let [title, ...body] = message.split('\n')

    const prs = commit.associatedPullRequests.nodes.filter((pull) => pull.merged)

    // external squashed PRs dont get the associated pr node set
    // so we try to grab it from the end of the commit title
    // since thats where it goes by default
    const [, titleNumber] = title.match(/\s+\(#(\d+)\)$/) || []
    console.log(prs, titleNumber)
    if (titleNumber && !prs.find((pr) => pr.number === +titleNumber)) {
      console.log('no title')
      try {
        // it could also reference an issue so we do one extra check
        // to make sure it is really a pr that has been merged
        const realPr = JSON.parse(exec(`gh pr view ${titleNumber} --json url,number,state`, {
          stdio: 'pipe',
        }))
        if (realPr.state === 'MERGED') {
          prs.push(realPr)
        }
      } catch {
        // maybe an issue or something else went wrong
        // not super important so keep going
      }
    }

    for (const pr of prs) {
      title = title.replace(new RegExp(`\\s*\\(#${pr.number}\\)`, 'g'), '')
    }

    body = body
      .map((line) => line.trim()) // remove artificial line breaks
      .filter(Boolean) // remove blank lines
      .join('\n') // rejoin on new lines
      .split(/^[*-]/gm) // split on lines starting with bullets
      .map((line) => line.trim()) // remove spaces around bullets
      .filter((line) => !title.includes(line)) // rm lines that exist in the title
      // replace new lines for this bullet with spaces and re-bullet it
      .map((line) => `* ${line.trim().replace(/\n/gm, ' ')}`)
      .join('\n') // re-join with new lines

    commits[changelogType].push({
      hash: commit.abbreviatedOid,
      url: commit.url,
      title,
      type: changelogType,
      body,
      prs,
      credit: commit.authors.nodes.map((author) => {
        if (author.user && author.user.login) {
          return {
            name: `@${author.user.login}`,
            url: author.user.url,
          }
        }
        // if the commit used an email that's not associated with a github account
        // then the user field will be empty, so we fall back to using the committer's
        // name and email as specified by git
        return {
          name: author.name,
          url: `mailto:${author.email}`,
        }
      }),
    })
  }

  if (!Object.values(commits).flat().length) {
    const messages = allCommits.map((c) => c.message.trim().split('\n')[0])
    throw new Error(`No changelog commits found for "${range}":\n${messages.join('\n')}`)
  }

  // this doesnt work with majors but we dont do those very often
  const semverBump = commits.Features.length ? 'minor' : 'patch'
  const version = TAG_PREFIX + semver.parse(args.startTag).inc(semverBump).version
  const date = args.endTag ? exec(`git log -1 --date=short --format=%ad ${args.endTag}`) : today()

  const output = logger(RELEASE.title(version, date) + '\n')

  for (const key of Object.keys(commits)) {
    if (commits[key].length > 0) {
      output.group(`### ${key}\n`)

      for (const commit of commits[key]) {
        let groupCommit = `* [\`${commit.hash}\`](${commit.url})`
        for (const pr of commit.prs) {
          groupCommit += ` [#${pr.number}](${pr.url})`
        }
        groupCommit += ` ${commit.title}`
        if (key !== 'Dependencies') {
          for (const user of commit.credit) {
            if (args.type === 'gh') {
              groupCommit += ` (${user.name})`
            } else {
              groupCommit += ` ([${user.name}](${user.url}))`
            }
          }
        }

        output.group(groupCommit)
        // only optionally add full commit bodies to changelog
        if (commit.body && commit.body.length && args.format === 'long') {
          output.log(commit.body)
        }
        output.groupEnd()
      }

      output.log()
      output.groupEnd()
    }
  }

  return {
    date,
    version,
    release: output.toString(),
  }
}

const main = async (argv) => {
  const args = parseArgs(argv)

  if (args.read) {
    // this reads the release notes for that version
    let { release } = findRelease(args, args.tag)
    if (args.type === 'gh') {
      // changelog was written in markdown so convert user links to gh release style
      // XXX: this needs to be changed if the `generateRelease` format changes
      release = release.replace(/\(\[(@[a-z\d-]+)\]\(https:\/\/github.com\/[a-z\d-]+\)\)/gi, '($1)')
    }
    return console.log(release)
  }

  // otherwise fetch the requested release from github
  const { release, version, date } = await generateRelease(args)

  if (args.write) {
    // only try and run release manager issue update on write since that signals
    // the first time we know the version of the release
    try {
      exec(
        `node scripts/release-manager.js --update --version=${version.slice(1)} --date=${date}`, {
          stdio: 'pipe',
        })
    } catch (e) {
      console.error(`Updating release manager issue failed: ${e.stderr}`)
    }

    const { release: existing, changelog } = findRelease(args, version)
    fs.writeFileSync(
      args.file,
      existing
        // replace existing release with the newly generated one
        ? changelog.replace(existing, release)
        // otherwise prepend a new release at the start of the changelog
        : changelog.replace(RELEASE.h1, RELEASE.h1 + release + RELEASE.sep),
      'utf-8'
    )
    return console.log(
      `Release notes for ${version} written to "./${relative(process.cwd(), args.file)}".`
    )
  }

  console.log(release)
}

main(process.argv.slice(2))
