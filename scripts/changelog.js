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
const log = execSync(`git log --reverse --pretty='format:%h %H%d %s (%aN)%n%b%n---%n' ${branch}...`)
  .toString()
  .split(/\n/)

main()

function shortname (url) {
  const matched =
    url.match(/https:\/\/github\.com\/([^/]+\/[^/]+)\/(?:pull|issues)\/(\d+)/) ||
    url.match(/https:\/\/(npm\.community)\/t\/(?:[^/]+\/)(\d+)/)
  if (!matched) {
    return false
  }
  const repo = matched[1]
  const id = matched[2]
  if (repo !== 'npm/cli') {
    return `${repo}#${id}`
  } else {
    return `#${id}`
  }
}

function printCommit (c) {
  console.log(`* [\`${c.shortid}\`](https://github.com/npm/cli/commit/${c.fullid})`)
  if (c.fixes.length) {
    for (const fix of c.fixes) {
      const label = shortname(fix)
      if (label) {
        console.log(`  [${label}](${fix})`)
      }
    }
  } else if (c.prurl) {
    const label = shortname(c.prurl)
    if (label) {
      console.log(`  [${label}](${c.prurl})`)
    } else {
      console.log(`  [#](${c.prurl})`)
    }
  }
  const msg = c.message
    .replace(/^\s+/gm, '')
    .replace(/^[-a-z]+: /, '')
    .replace(/^/gm, '  ')
    .replace(/^ {2}Reviewed-by: @.*/gm, '')
    .replace(/\n$/, '')
    // backtickify package@version
    .replace(/^(\s*@?[^@\s]+@\d+[.]\d+[.]\d+)\b(\s*\S)/g, '$1:$2')
    .replace(/((?:\b|@)[^@\s]+@\d+[.]\d+[.]\d+)\b/g, '`$1`')
    // linkify commitids
    .replace(/\b([a-f0-9]{7,8})\b/g, '[`$1`](https://github.com/npm/cli/commit/$1)')
  console.log(msg)
  // don't assign credit for dep updates
  if (!/^ {2}`[^`]+@\d+\.\d+\.\d+[^`]*`:?$/m.test(msg)) {
    if (c.credit) {
      c.credit.forEach(function (credit) {
        console.log(`  ([@${credit}](https://github.com/${credit}))`)
      })
    } else {
      console.log(`  ([@${c.author}](https://github.com/${c.author}))`)
    }
  }
}

function main () {
  let commit
  log.forEach(function (line) {
    line = line.replace(/\r/g, '')
    let m
    /* eslint no-cond-assign:0 */
    if (/^---$/.test(line)) {
      printCommit(commit)
    } else if (
      (m = line.match(/^([a-f0-9]{7,10}) ([a-f0-9]+) (?:[(]([^)]+)[)] )?(.*?) [(](.*?)[)]/))
    ) {
      commit = {
        shortid: m[1],
        fullid: m[2],
        branch: m[3],
        message: m[4],
        author: m[5],
        prurl: null,
        fixes: [],
        credit: null,
      }
    } else if ((m = line.match(/^PR-URL: (.*)/))) {
      commit.prurl = m[1]
    } else if ((m = line.match(/^Credit: @(.*)/))) {
      if (!commit.credit) {
        commit.credit = []
      }
      commit.credit.push(m[1])
    } else if ((m = line.match(/^(?:Fix(?:es)|Closes?): #?([0-9]+)/))) {
      commit.fixes.push(`https://github.com/npm/cli/issues/${m[1]}`)
    } else if ((m = line.match(/^(?:Fix(?:es)|Closes?): ([^#]+)#([0-9]*)/))) {
      commit.fixes.push(`https://github.com/${m[1]}/issues/${m[2]}`)
    } else if ((m = line.match(/^(?:Fix(?:es)|Closes?): (https?:\/\/.*)/))) {
      commit.fixes.push(m[1])
    } else if ((m = line.match(/^Reviewed-By: @(.*)/))) {
      commit.reviewed = m[1]
    } else if (/\S/.test(line)) {
      commit.message += `\n${line}`
    }
  })
}
