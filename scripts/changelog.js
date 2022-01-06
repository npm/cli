'use strict'

/*
Usage:

node scripts/changelog.js [comittish]

Generates changelog entries in our format as best as its able based on
commits starting at comittish, or if that's not passed, latest.

Ordinarily this is run via the gen-changelog shell script, which appends
the result to the changelog.

*/
const execSync = require('child_process').execSync
const branch = process.argv[2] || 'origin/latest'
const log = execSync(`git log --reverse --pretty='format:%h' ${branch}...`)
  .toString()
  .split(/\n/)

function printCommit (c) {
  console.log(`* [\`${c.hash}\`](${c.url})`)
  for (const pr of c.prs) {
    console.log(`  [#${pr.number}](${pr.url})`)
    // remove the (#111) relating to this pull request from the commit message,
    // since we manually add the link outside of the commit message
    const msgRe = new RegExp(`\\s*\\(#${pr.number}\\)`, 'g')
    c.message = c.message.replace(msgRe, '')
  }
  // no need to indent this output, it's already got 2 spaces
  console.log(c.message)
  // no credit for deps commits, leading spaces are important here
  if (!c.message.startsWith('  deps')) {
    for (const user of c.credit) {
      console.log(`  ([${user.name}](${user.url}))`)
    }
  }
}

const main = async () => {
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

  for (const [hash, data] of Object.entries(body.data.repository)) {
    const commit = {
      hash: hash.slice(1), // remove leading _
      url: data.url,
      message: data.message.replace(/(\r?\n)+/gm, '\n') // swap multiple new lines with one
        .replace(/^/gm, '  ') // add two spaces to the start of each line
        .replace(/([^\s]+@\d+\.\d+\.\d+.*)/g, '`$1`'), // wrap package@version in backticks
      prs: data.associatedPullRequests.nodes.filter((pull) => pull.merged),
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

    printCommit(commit)
  }
}

main()
