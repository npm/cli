#!/usr/bin/env node

const spawn = require('@npmcli/promise-spawn')
const fs = require('@npmcli/fs')
const { resolve, join, relative } = require('path')
const localeCompare = require('@isaacs/string-locale-compare')('en')
const Diff = require('diff')
const chalk = require('chalk')
const EOL = '\n'

// Get a list of possibly duplicated names and emails from the authors list
// that can be fixed by adding them to .mailmap and then the update-authors
// script will dedupe them.
//
// This script will return a list of possibly duplicated names/emails by
// default. Run this script with `--write` to apply the changes to the
// .mailmap and AUTHORS files.
//
// This can be run periodically if duplicate names or emails have built up
// in the AUTHORS file.

// known list of names that are duplicated in authors
const ALLOW_NAMES = ['Steven']

// filter some names out explicitly for duplicate emails
// prefer earlier names over later ones
const PICK_NAME = (names) => {
  const f = names.filter((name) => !name.startsWith('--'))
  return f[0] || names[0]
}

// filter out some emails, prefer latest email
const PICK_EMAIL = (emails) => {
  const f = emails.filter((email) => !email.includes('.noreply.'))
  return f[f.length - 1] || emails[emails.length - 1]
}

const MAILMAP = {
  parseFile: (str) => str
    .trim()
    .split(EOL)
    .map(MAILMAP.parse),
  parse: (line) => {
    const [, name, email, email2] = line.match(/^(.*?)\s<(.*?)>(?:\s<(.*?)>)?$/)
    return { name, email, email2 }
  },
  stringify: ({ name, email, email2 }) =>
    `${name} ${[email, email2].filter(Boolean).map((e) => `<${e}>`).join(' ')}`,
  stringifyFile: (arr) => arr
    .sort((a, b) => localeCompare(a.name, b.name))
    .map(MAILMAP.stringify)
    .join(EOL) + EOL,
}

const AUTHOR = {
  parseFile: (str) => str
    .trim()
    .split(EOL)
    .filter((l) => !l.trim().startsWith('#'))
    .map(AUTHOR.parse),
  parse: (line) => {
    const [, name, email] = line.match(/^(.*?)\s<(.*?)>$/)
    return { name, email }
  },
  stringify: ({ name, email }) => `${name} <${email}>`,
}

const backupFile = async (path) => {
  const bak = `${path}.bak`
  if (!await fs.exists(bak)) {
    // only backup file the first run
    // so the original data can be restored
    await fs.copyFile(path, bak)
  }
  return {
    path,
    rollback: () => fs.copyFile(bak, path).then(() => fs.unlink(bak)),
    commit: () => fs.unlink(bak),
  }
}

const diffAuthors = (current, update) => {
  return Diff.diffArrays(current, update).reduce(
    (res, d) => {
      if (d.added) {
        res.added.push(...d.value.map(AUTHOR.parse))
      } else if (d.removed) {
        res.removed.push(...d.value.map(AUTHOR.parse))
      }
      return res
    },
    { added: [], removed: [] }
  )
}

const findDuplicateValues = (obj, f) => {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([k, v]) => v.length > 1 && f(k, v))
      .sort(([a], [b]) => localeCompare(a, b))
  )
}

const getDuplicateAuthors = (authors) => {
  const dupes = []
  const names = {}
  const emails = {}

  for (const { name, email } of authors) {
    if (names[name]) {
      names[name].push(email)
    } else {
      names[name] = [email]
    }

    if (emails[email]) {
      emails[email].unshift(name)
    } else {
      emails[email] = [name]
    }
  }

  const dupeNames = findDuplicateValues(names, (name) => !ALLOW_NAMES.includes(name))
  const dupeEmailsFromNames = Object.values(dupeNames).flat()
  const dupeEmails = findDuplicateValues(emails, (email) => !dupeEmailsFromNames.includes(email))

  for (const [name, emails] of Object.entries(dupeNames)) {
    const email = PICK_EMAIL(emails)
    dupes.push(...emails.filter((e) => e !== email).map((email2) => ({
      name,
      email,
      email2,
    })))
  }

  for (const [email, names] of Object.entries(dupeEmails)) {
    const name = PICK_NAME(names)
    dupes.push(...names.filter((n) => n !== name).map(() => ({
      name,
      email,
    })))
  }

  return dupes
}

const dedupeAuthors = async (dir) => {
  const authorsFile = join(dir, 'AUTHORS')
  const mailmapFile = join(dir, '.mailmap')

  const authors = AUTHOR.parseFile(await fs.readFile(authorsFile, 'utf-8'))
  const mailmaps = MAILMAP.parseFile(await fs.readFile(mailmapFile, 'utf-8'))

  const newMailmaps = getDuplicateAuthors(authors)
  const updateMailmap = MAILMAP.stringifyFile([...mailmaps, ...newMailmaps])

  // no mailmap changes mean nothing will be changed so abort
  if (MAILMAP.stringifyFile(mailmaps) === updateMailmap) {
    return {
      diff: null,
    }
  }

  const backupMailmap = await backupFile(mailmapFile)
  const backupAuthors = await backupFile(authorsFile)
  const backups = [backupMailmap, backupAuthors]

  // write both files
  await fs.writeFile(mailmapFile, updateMailmap, 'utf-8')
  await spawn(join('.', 'scripts', 'update-authors.sh'), [], { cwd: dir })

  const newAuthors = AUTHOR.parseFile(await fs.readFile(authorsFile, 'utf-8'))
  const diff = diffAuthors(
    authors.map(AUTHOR.stringify),
    newAuthors.map(AUTHOR.stringify)
  )

  const diffResult = diff.removed.map((r) => {
    const removed = AUTHOR.stringify(r)
    const updated = [...newAuthors, ...diff.added]
      .filter(a => a.name === r.name || a.email === r.email)
      .map(AUTHOR.stringify)
      .filter((u, i, l) => u !== removed && l.indexOf(u) === i)

    if (!updated.length) {
      return null
    }

    if (updated.length > 1) {
      throw new Error([
        `More than 1 existing author matches a removed one:`,
        `removed: ${removed}`,
        `existing: ${updated.join(',')}`,
      ].join('\n'))
    }

    return [removed, updated[0]]
  })
    .filter(Boolean)
    .sort(([a], [b]) => localeCompare(a, b))
    .map(([rm, add]) => {
      const diff = Diff.diffWordsWithSpace(rm, add, { ignoreCase: true }).map((p) => {
        if (!p.added && !p.removed) {
          return p.value
        }
        const color = p.added ? chalk.bgGreenBright : chalk.bgRedBright
        return color.black(p.value)
      }).join('')
      return [`- ${rm}`, `+ ${add}`, `  ${diff}`].join('\n')
    })
    .join(`\n\n`).trim()

  return {
    backups,
    diff: diffResult || null,
  }
}

const run = async (dir, write, results = []) => {
  const { backups } = results[0] || {}
  const rollback = () => Promise.all(backups.map((b) => b.rollback()))
  const commit = () => Promise.all(backups.map((b) => b.commit()))
  const updates = () => backups.map((b) => b.path).map((f) => relative(dir, f))

  if (results.length >= 5) {
    await rollback()
    throw new Error('too many times')
  }

  const res = await dedupeAuthors(dir)
  results.push(res)

  if (results.length === 1 && res.diff === null) {
    // no result on the first run means nothing needs
    // to be updated
    return 'All clean'
  } else if (res.diff) {
    // run again until we get a clean result
    return run(dir, write, results)
  }

  // this run resulted in no more updates needed
  const result = results
    .map((r) => r.diff)
    .filter(Boolean)

  if (write) {
    await commit()
    result.push(`Wrote updates to:\n${updates().map((f) => `  - ${f}`).join('\n')}`)
  } else {
    await rollback()
    result.push('Run with `--write` to write to files')
  }

  return result.join('\n\n')
}

const cwd = resolve(__dirname, '..')
run(cwd, process.argv.slice(2).includes('--write'))
  .then((s) => s && console.log(`\n${s}`))
  .catch((err) => {
    process.exitCode = 1
    console.error(err)
  })
