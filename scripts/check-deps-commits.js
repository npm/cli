// Ensures that any production dependency change in a first-party manifest
// (root package.json, workspaces/*, mock-registry, etc.) is accompanied by a
// dedicated `deps:` commit that names the specific dependency. This prevents
// production dependency bumps from being buried inside unrelated `fix:`/`feat:`
// commits, which hides the change from the release/changelog tooling.
//
// This intentionally uses only Node builtins + git so it can run in CI without
// a full dependency install (no resetdeps required).

const { execFileSync } = require('node:child_process')

// Only production dependencies are enforced. devDependencies and other fields
// change frequently for tooling reasons and do not require a `deps:` commit.
const DEP_TYPES = ['dependencies']

// A commit is a "deps" commit if its subject uses the conventional
// `deps:` / `deps(scope):` / `deps!:` type prefix.
const DEPS_SUBJECT = /^deps(\([^)]*\))?!?:/

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' })

const arg = (name, fallback) => {
  const idx = process.argv.indexOf(name)
  if (idx !== -1 && process.argv[idx + 1]) {
    return process.argv[idx + 1]
  }
  const inline = process.argv.find((a) => a.startsWith(`${name}=`))
  return inline ? inline.slice(name.length + 1) : fallback
}

// Read and parse a package.json at a given git ref. Returns null if the file
// did not exist at that ref (e.g. a newly added manifest).
const readJSONAtRef = (ref, file) => {
  try {
    return JSON.parse(git('show', `${ref}:${file}`))
  } catch {
    return null
  }
}

const workspacePatternsAtRef = (ref) => {
  const manifest = readJSONAtRef(ref, 'package.json')
  return Array.isArray(manifest?.workspaces) ? manifest.workspaces : []
}

// The repository's workspace patterns contain literal path segments and `*`
// segments. Match the declared package roots without including nested fixtures.
const matchesWorkspace = (directory, pattern) => {
  const directoryParts = directory.split('/')
  const patternParts = pattern.replace(/\/$/, '').split('/')
  return directoryParts.length === patternParts.length &&
    patternParts.every((part, index) =>
      part === '*' || part === directoryParts[index])
}

const isFirstPartyManifest = (file, workspacePatterns) => {
  if (file === 'package.json') {
    return true
  }
  if (!file.endsWith('/package.json')) {
    return false
  }
  const directory = file.slice(0, -'/package.json'.length)
  return workspacePatterns.some((pattern) =>
    matchesWorkspace(directory, pattern))
}

// Does a commit subject mention this dependency by name? Historical formats:
//   deps: undici@6.27.0
//   deps(arborist): validate-npm-package-name ^8.0.0
//   deps!: bump sigstore from 2.x to 3.0.0
//   deps: remove read-package-json-fast
// The name appears as a standalone token, optionally followed by `@version`.
const mentionsDep = (subject, dep) => {
  const tokens = subject
    .split(/\s+/)
    .map((t) => t.replace(/^[`'"([,]+/, '').replace(/[`'").,;:]+$/, ''))
  return tokens.some((t) => t === dep || t.startsWith(`${dep}@`))
}

const dependencyChanges = (from, to) => {
  const workspacePatterns = [
    ...new Set([
      ...workspacePatternsAtRef(from),
      ...workspacePatternsAtRef(to),
    ]),
  ]
  const changedFiles = git('diff', '--name-only', from, to, '--', '*package.json')
    .split('\n')
    .map((f) => f.trim())
    .filter(Boolean)
    .filter((file) => isFirstPartyManifest(file, workspacePatterns))

  const changes = new Map()
  for (const file of changedFiles) {
    const before = readJSONAtRef(from, file) || {}
    const after = readJSONAtRef(to, file) || {}
    for (const type of DEP_TYPES) {
      const b = before[type] || {}
      const a = after[type] || {}
      for (const dep of new Set([...Object.keys(b), ...Object.keys(a)])) {
        if (b[dep] !== a[dep]) {
          changes.set(`${file}\0${dep}`, {
            dep,
            file,
            from: b[dep],
            to: a[dep],
          })
        }
      }
    }
  }
  return changes
}

const main = () => {
  const from = arg('--from')
  const to = arg('--to', 'HEAD')

  if (!from) {
    throw new Error('Usage: node scripts/check-deps-commits.js --from <base> [--to <head>]')
  }

  const mergeBase = git('merge-base', from, to).trim()
  const changedDeps = dependencyChanges(mergeBase, to)

  if (!changedDeps.size) {
    process.stdout.write('OK: no production dependency changes detected.\n')
    return
  }

  // The merge-base range excludes commits inherited from the base branch.
  // Inspect every commit so dependency commits from a merged topic branch and
  // changes introduced while resolving a merge are both validated.
  const commits = git(
    'log',
    '--reverse',
    '--topo-order',
    '--format=%H%x1f%P%x1f%s%x1e',
    `${mergeBase}..${to}`
  )
    .split('\x1e')
    .map((c) => c.trim())
    .filter(Boolean)
    .map((c) => {
      const [hash, parents, subject] = c.split('\x1f')
      return { hash, parents: parents.split(' ').filter(Boolean), subject }
    })

  const initialState = new Map(
    [...changedDeps].map(([key]) => [
      key,
      { covered: false, invalidCommits: [] },
    ])
  )
  const stateByCommit = new Map([[mergeBase, initialState]])
  for (const { hash, parents, subject } of commits) {
    const state = new Map(stateByCommit.get(parents[0]))

    if (parents.length > 1) {
      for (const [key, { dep, file }] of changedDeps) {
        const version = readJSONAtRef(hash, file)?.dependencies?.[dep]
        const inheritedFrom = parents.find((parent) =>
          readJSONAtRef(parent, file)?.dependencies?.[dep] === version)
        if (inheritedFrom) {
          state.set(key, stateByCommit.get(inheritedFrom).get(key))
        } else {
          const previous = state.get(key)
          state.set(key, {
            covered: previous.covered,
            invalidCommits: [
              ...previous.invalidCommits,
              { hash, subject },
            ],
          })
        }
      }
      stateByCommit.set(hash, state)
      continue
    }

    for (const [key, { dep }] of dependencyChanges(parents[0], hash)) {
      if (!changedDeps.has(key)) {
        continue
      }
      if (
        DEPS_SUBJECT.test(subject) &&
        mentionsDep(subject, dep)
      ) {
        state.set(key, { covered: true, invalidCommits: [] })
      } else {
        const previous = state.get(key)
        state.set(key, {
          covered: previous.covered,
          invalidCommits: [
            ...previous.invalidCommits,
            { hash, subject },
          ],
        })
      }
    }
    stateByCommit.set(hash, state)
  }

  const toHash = git('rev-parse', `${to}^{commit}`).trim()
  const finalState = stateByCommit.get(toHash)
  const uncovered = [...changedDeps].filter(
    ([key]) => {
      const state = finalState.get(key)
      return !state.covered || state.invalidCommits.length
    }
  )

  if (!uncovered.length) {
    process.stdout.write(
      `OK: all ${changedDeps.size} production dependency change(s) have a matching deps: commit.\n`
    )
    return
  }

  // Derive the conventional-commit scope from the manifest location, e.g.
  // `workspaces/arborist/package.json` -> `arborist`. The root manifest
  // (`package.json`) has no scope.
  const scopeOf = (file) => {
    if (!file.includes('/')) {
      return null
    }
    return file.slice(0, file.lastIndexOf('/')).split('/').pop()
  }

  // One suggestion per (dependency, manifest) so each change is isolated into a
  // scoped `deps(<workspace>):` commit that names the exact dependency+version.
  const suggestions = uncovered.map(([, { dep, file, to: version }]) => {
    const scope = scopeOf(file)
    const type = scope ? `deps(${scope})` : 'deps'
    return version ? `  ${type}: ${dep}@${version}` : `  ${type}: remove ${dep}`
  })

  const lines = [
    'Production dependency changes must each have a dedicated `deps:` commit that names the dependency.',
    '',
    'The following production dependency changes are not isolated in a matching deps: commit:',
    ...uncovered.map(([key, { dep, file }]) => {
      const invalidCommitEntries = finalState.get(key)?.invalidCommits
      const details = invalidCommitEntries
        ? `; also changed by ${invalidCommitEntries
          .map(({ hash, subject }) => `${hash.slice(0, 7)} "${subject}"`)
          .join(', ')}`
        : ''
      return `  - ${dep} (changed in: ${file}${details})`
    }),
    '',
    'Add a separate commit for each, e.g.:',
    ...suggestions,
  ]
  process.stderr.write(`${lines.join('\n')}\n`)
  process.exit(1)
}

main()
