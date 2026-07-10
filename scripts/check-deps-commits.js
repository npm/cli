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

// A first-party manifest is any package.json that is NOT inside a node_modules
// directory. Bundled dependency manifests under node_modules churn as a
// side-effect of lockfile/bundle regeneration and must be ignored.
const isFirstPartyManifest = (file) =>
  (file === 'package.json' || file.endsWith('/package.json')) &&
  !file.startsWith('node_modules/') &&
  !file.includes('/node_modules/')

// Does a commit message mention this dependency by name? Historical formats:
//   deps: undici@6.27.0
//   deps(arborist): validate-npm-package-name ^8.0.0
//   deps!: bump sigstore from 2.x to 3.0.0
//   deps: remove read-package-json-fast
// The name appears as a standalone token, optionally followed by `@version`.
const mentionsDep = (message, dep) => {
  const tokens = message
    .split(/\s+/)
    .map((t) => t.replace(/^[`'"([,]+/, '').replace(/[`'").,;:]+$/, ''))
  return tokens.some((t) => t === dep || t.startsWith(`${dep}@`))
}

const main = () => {
  const from = arg('--from')
  const to = arg('--to', 'HEAD')

  if (!from) {
    throw new Error('Usage: node scripts/check-deps-commits.js --from <base> [--to <head>]')
  }

  // Net set of first-party package.json files changed by the PR.
  const changedFiles = git('diff', '--name-only', `${from}...${to}`, '--', '*package.json')
    .split('\n')
    .map((f) => f.trim())
    .filter(Boolean)
    .filter(isFirstPartyManifest)

  // Collect every production dependency whose presence or version range changed.
  const changedDeps = new Map()
  for (const file of changedFiles) {
    const before = readJSONAtRef(from, file) || {}
    const after = readJSONAtRef(to, file) || {}
    for (const type of DEP_TYPES) {
      const b = before[type] || {}
      const a = after[type] || {}
      for (const name of new Set([...Object.keys(b), ...Object.keys(a)])) {
        if (b[name] !== a[name]) {
          if (!changedDeps.has(name)) {
            changedDeps.set(name, { files: new Set(), from: b[name], to: a[name] })
          }
          const entry = changedDeps.get(name)
          entry.files.add(file)
          entry.to = a[name] ?? entry.to
        }
      }
    }
  }

  if (!changedDeps.size) {
    process.stdout.write('OK: no production dependency changes detected.\n')
    return
  }

  // Gather the `deps:` commits in the range. Records are separated by an ASCII
  // record separator and fields by an ASCII unit separator so multi-line commit
  // bodies are handled safely.
  const commits = git('log', '--format=%H%x1f%B%x1e', `${from}..${to}`)
    .split('\x1e')
    .map((c) => c.trim())
    .filter(Boolean)
    .map((c) => {
      const sep = c.indexOf('\x1f')
      return { hash: c.slice(0, sep), message: c.slice(sep + 1) }
    })
  const depsCommits = commits.filter((c) => DEPS_SUBJECT.test(c.message.split('\n')[0].trim()))

  const uncovered = []
  for (const [dep, { files, to: version }] of changedDeps) {
    if (!depsCommits.some((c) => mentionsDep(c.message, dep))) {
      // `version` is undefined when the dependency was removed.
      uncovered.push({ dep, files: [...files], version })
    }
  }

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
  const suggestions = uncovered.flatMap(({ dep, files, version }) =>
    files.map((file) => {
      const scope = scopeOf(file)
      const type = scope ? `deps(${scope})` : 'deps'
      return version ? `  ${type}: ${dep}@${version}` : `  ${type}: remove ${dep}`
    })
  )

  const lines = [
    'Production dependency changes must each have a dedicated `deps:` commit that names the dependency.',
    '',
    'The following production dependency changes are missing a matching deps: commit:',
    ...uncovered.map(({ dep, files }) => `  - ${dep} (changed in: ${files.join(', ')})`),
    '',
    'Add a separate commit for each, e.g.:',
    ...suggestions,
  ]
  process.stderr.write(`${lines.join('\n')}\n`)
  process.exit(1)
}

main()
