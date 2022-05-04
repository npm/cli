#!/usr/bin/env node

const { basename, relative } = require('path')
const cp = require('child_process')

const usage = () => `
  node ${relative(process.cwd(), __filename)} [flags]

  Copies the release process checklist to a GitHub issue, optionally updating the
  version and date of the instructions.
  
  Flags: [--create] [--update[=<issue-num>]] [--date=<YYYY-MM-DD>] [--version=X.Y.Z]

  [--create] (default: true)
  By default this will create a new issue in the repo.

  [--update[=<issue-num>]]
  Update a specific issue number, or if set without a value it will update the most
  recent issue created with the default tag.

  [--tag=<tag>] (default: "release-manager")
  Issues will be created and looked up with this tag.

  [--version=X.Y.Z]
  This script can be run before the next version number is known and then rerun
  with this flag to update the checklist with the correct version number.
  
  [--date=<YYYY-MM-DD>] (default: ${date()})
  Set the date of the release in the release process checklist.
`

const spawnSync = (cmd, args, options) => {
  const res = cp.spawnSync(cmd, args, { ...options, encoding: 'utf-8' })
  if (res.status !== 0) {
    throw new Error(res.stderr)
  }
  return res.stdout.trim()
}

const get = url =>
  new Promise((resolve, reject) => {
    require('https')
      .get(url, resp => {
        let d = ''
        resp.on('data', c => (d += c))
        resp.on('end', () => resolve(d))
      })
      .on('error', reject)
  })

const date = () => {
  const d = new Date()
  const pad = s => s.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const replaceAll = (str, rep) =>
  Object.entries(rep).reduce(
    (a, [k, v]) => a.replace(new RegExp(k, 'g'), v),
    str
  )

const ghIssue = args => {
  const label = ['-l', args.label]
  const assignee = ['-a', args.assignee]
  const title = ['-t', args.title]
  const json = ['--json', 'body,title,number']
  const body = ['--body-file', '-']

  const issue = (cmd, a, options) =>
    spawnSync('gh', ['issue', cmd, '-R', args.repo, ...a.flat()], options)

  const listIssues = () => {
    const issues = JSON.parse(issue('list', [label, json]))
    const ids = issues.map(i => '#' + i.number)
    const msg = `Found existing label:${args.label} issues: ${ids.join(', ')}.`
    return { issues, msg }
  }

  switch (args.command) {
    case 'list': {
      // get the first matching issue
      const { issues, msg } = listIssues()
      if (issues.length > 1) {
        throw new Error(`${msg} Rerun with --update=<id> to target a specific issue.`)
      }
      return issues[0]
    }
    case 'view':
      // get an issue by id
      return JSON.parse(issue('view', [args.number, json]))
    case 'create': {
      const { issues, msg } = listIssues()
      if (issues.length) {
        throw new Error(`${msg} Close before creating a new one.`)
      }
      // create an issue
      return issue('create', [assignee, label, title, body], { input: args.body })
    }
    case 'edit':
      // edit title and body of an issue
      return issue('edit', [args.number, title, body], { input: args.body })
    default:
      throw new Error(`Unknown command: ${JSON.stringify(args.command)}`)
  }
}

const getSection = (content, args) => {
  const [, heading, section] = args.section.match(/^(#+)\s(.*)/)

  // remove the title since we are making a new one
  const [title, ...lines] = content
    .split(`${heading} `)
    .find(s => s.split('\n')[0].match(new RegExp(section, 'i')))
    .trim()
    .split('\n')

  // first task is to run this script, so thats done
  const body = lines.join('\n').replace('- [ ] **0', '- [x] **0')
  const created = `${basename(args.release)}${heading}${title}`

  return {
    title: `Release Manager: v${args.version} (${args.date})`,
    body: [
      `**Target Version**: v${args.version}`,
      `**Target Date**: ${args.date}`,
      // github markdown: 2x backticks + space will escape backticks within title
      `**Created From:** [\`\` ${created} \`\`](${args.release})`,
      body,
    ]
      .join('\n')
      .trim(),
  }
}

const main = async args => {
  const replace = s => replaceAll(s, args.replacements)

  const { body, title, number } = args.create
    // get a section of the release process wiki doc
    ? getSection(await get(args.release), args)
    // get the contents of an existing gh issue by id
    // or it will default to the most recent one by label
    // this is so it will preserve state of checked todo items
    : await ghIssue({
      ...args,
      command: typeof args.update === 'string' ? 'view' : 'list',
      number: args.update,
    })

  return ghIssue({
    ...args,
    command: number ? 'edit' : 'create',
    number,
    body: replace(body),
    title: replace(title),
  })
}

const parseArgs = raw => {
  const result = {
    create: false,
    update: null,
    repo: 'npm/cli',
    label: 'release: manager',
    assignee: '@me',
    date: date(),
    version: 'X.Y.Z',
    // look for that heading level with a match for the portion after
    section: '### .*cli.*',
    release:
      'https://raw.githubusercontent.com/wiki/npm/cli/Release-Process-(v8).md',
  }

  const replacements = {}

  const clean = {
    // this script will not work correctly with the tag style
    // of the version (prefixed with a v) so strip it out
    version: v => v.replace(/^v/g, ''),
  }

  const shorts = {
    R: 'repo',
    l: 'label',
    a: 'assignee',
    d: 'date',
    v: 'version',
    c: 'create',
    u: 'update',
  }

  const camel = k => k.replace(/-([a-z])/g, a => a[1].toUpperCase())

  // parse argv into array of [k,v] pairs
  // works with --x=1 --x 1 --x -x
  const argv = raw
    .join(' ') // join to a string
    .split(/(?:^|\s+)-/g) // split on starting dashses
    .map(x => x.trim().replace(/\s+/g, ' ')) // collapse spaces
    .filter(Boolean) // remove empties
    .map(x => x.split(/[=\s]/)) // split on equal or space
    .map(([k, v]) => [
      // we split on the initial dash previously so now
      // 1 dash means 2 and 0 means 1
      ...(k.startsWith('-') ? ['--', k.slice(1)] : ['-', k]),
      v ?? true, // default to true for no value
    ])
    .map(([dash, key, value]) => ({ dash, key: camel(key), value }))

  for (const { dash, key, value } of argv) {
    const k = dash.length < 2 ? shorts[key] : key
    if (Object.hasOwn(result, k)) {
      result[k] = clean[k] ? clean[k](value) : value
    } else {
      // any unknown arg is a replacement value
      replacements[k] = value
    }
  }

  if (!result.create && !result.update) {
    // set default to create if no command is specified
    result.create = true
  } else if (result.create && result.update) {
    throw new Error('Cannot set both create and update')
  }

  if (result.help) {
    console.error(usage())
    return process.exit(0)
  }

  return {
    ...result,
    replacements: {
      '(\\d+\\.\\d+\\.\\d+|X\\.Y\\.Z)': result.version,
      '(\\d{4}-\\d{2}-\\d{2}|YYYY-MM-DD)': result.date,
      ...replacements,
    },
  }
}

main(parseArgs(process.argv.slice(2)))
  .then(d => console.log(d))
  .catch(err => {
    console.error(err)
    process.exitCode = 1
  })
