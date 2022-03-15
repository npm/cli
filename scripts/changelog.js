'use strict'

const execSync = require('child_process').execSync

/*
Usage:

node scripts/changelog.js [comittish]

Generates changelog entries in our format as best as its able based on
commits starting at comittish, or if that's not passed, latest.

Ordinarily this is run via the gen-changelog shell script, which appends
the result to the changelog.

*/

const parseArgs = (argv) => {
  const result = {
    releaseNotes: false,
    branch: 'origin/latest',
  }

  for (const arg of argv) {
    if (arg === '--release-notes') {
      result.releaseNotes = true
      continue
    }

    result.branch = arg
  }

  return result
}

const main = async () => {
  const { branch, releaseNotes } = parseArgs(process.argv.slice(2))

  const log = execSync(`git log --reverse --pretty='format:%h' ${branch}...`)
    .toString()
    .split(/\n/)

  const query = `
    fragment commitCredit on GitObject {
      ... on Commit {
        message
        url
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
        ${log.map((sha) => `_${sha}: object (expression: "${sha}") {
          ...commitCredit
        }`).join('\n')}
      }
    }
  `

  const response = execSync(`gh api graphql -f query='${query}'`).toString()
  const body = JSON.parse(response)

  const output = {
    Features: [],
    'Bug Fixes': [],
    Documentation: [],
    Dependencies: [],
  }

  for (const [hash, data] of Object.entries(body.data.repository)) {
    if (!data) {
      console.error('no data for hash', hash)
      continue
    }

    const message = data.message.replace(/^\s+/gm, '') // remove leading spaces
      .replace(/(\r?\n)+/gm, '\n') // replace multiple newlines with one
      .replace(/([^\s]+@\d+\.\d+\.\d+.*)/gm, '`$1`') // wrap package@version in backticks

    const lines = message.split('\n')
    // the title is the first line of the commit, 'let' because we change it later
    let title = lines.shift()
    // the body is the rest of the commit with some normalization
    const body = lines.join('\n') // re-join our normalized commit into a string
      .split(/\n?\*/gm) // split on lines starting with a literal *
      .filter((line) => line.trim().length > 0) // remove blank lines
      .map((line) => {
        const clean = line.replace(/\n/gm, ' ') // replace new lines for this bullet with spaces
        return clean.startsWith('*') ? clean : `* ${clean}` // make sure the line starts with *
      })
      .join('\n') // re-join with new lines

    const type = title.startsWith('feat') ? 'Features'
      : title.startsWith('fix') ? 'Bug Fixes'
      : title.startsWith('docs') ? 'Documentation'
      : title.startsWith('deps') ? 'Dependencies'
      : null

    const prs = data.associatedPullRequests.nodes.filter((pull) => pull.merged)
    for (const pr of prs) {
      title = title.replace(new RegExp(`\\s*\\(#${pr.number}\\)`, 'g'), '')
    }

    const commit = {
      hash: hash.slice(1), // remove leading _
      url: data.url,
      title,
      type,
      body,
      prs,
      credit: data.authors.nodes.map((author) => {
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
    }

    if (commit.type) {
      output[commit.type].push(commit)
    }
  }

  for (const key of Object.keys(output)) {
    if (output[key].length > 0) {
      const groupHeading = `### ${key}`
      console.group(groupHeading)
      console.log() // blank line after heading

      for (const commit of output[key]) {
        let groupCommit = `* [\`${commit.hash}\`](${commit.url})`
        for (const pr of commit.prs) {
          groupCommit += ` [#${pr.number}](${pr.url})`
        }
        groupCommit += ` ${commit.title}`
        if (key !== 'Dependencies') {
          for (const user of commit.credit) {
            if (releaseNotes) {
              groupCommit += ` (${user.name})`
            } else {
              groupCommit += ` ([${user.name}](${user.url}))`
            }
          }
        }
        console.group(groupCommit)
        if (commit.body && commit.body.length) {
          console.log(commit.body)
        }
        console.groupEnd(groupCommit)
      }

      console.log() // blank line at end of group
      console.groupEnd(groupHeading)
    }
  }
}

main()
