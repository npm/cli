const t = require('tap')
const { isAbsolute, join, relative, sep } = require('node:path')
const fs = require('node:fs')
const { createRequire } = require('node:module')
const setup = require('./fixtures/setup.js')

// Walk an installed package tree and assert that every non-optional
// production dependency of every bundled package resolves from that
// package's own directory. This catches deps that were dropped from the
// hoisted bundle at pack time (e.g. a dev-only copy shadowing the real
// production version), which unit tests miss because they run against the
// source tree where a nested copy still resolves. See PR #9740 / #9722
// where `sigstore` went missing from the packed bundle.
const findMissingDeps = (npmRoot) => {
  const req = createRequire(join(npmRoot, 'package.json'))
  const bundleRoot = fs.realpathSync(npmRoot)
  const missing = []
  const seen = new Set()
  const stack = [npmRoot]

  while (stack.length) {
    const dir = stack.pop()
    if (seen.has(dir)) {
      continue
    }
    seen.add(dir)

    let pkg
    try {
      pkg = JSON.parse(fs.readFileSync(join(dir, 'package.json'), 'utf8'))
    } catch {
      continue
    }

    const optional = new Set(Object.keys(pkg.optionalDependencies || {}))
    for (const dep of Object.keys(pkg.dependencies || {})) {
      if (optional.has(dep)) {
        continue
      }
      try {
        const resolved = fs.realpathSync(req.resolve(dep, { paths: [dir] }))
        const fromBundle = relative(bundleRoot, resolved)
        if (
          isAbsolute(fromBundle) ||
          fromBundle === '..' ||
          fromBundle.startsWith(`..${sep}`)
        ) {
          missing.push(`${pkg.name || dir} -> ${dep}`)
        }
      } catch {
        missing.push(`${pkg.name || dir} -> ${dep}`)
      }
    }

    const nodeModules = join(dir, 'node_modules')
    let entries
    try {
      entries = fs.readdirSync(nodeModules, { withFileTypes: true })
    } catch {
      continue
    }
    for (const entry of entries) {
      if (entry.name === '.bin') {
        continue
      }
      const entryPath = join(nodeModules, entry.name)
      if (entry.name.startsWith('@')) {
        for (const scoped of fs.readdirSync(entryPath, { withFileTypes: true })) {
          stack.push(join(entryPath, scoped.name))
        }
      } else {
        stack.push(entryPath)
      }
    }
  }

  return missing.sort()
}

t.test('bundled production deps all resolve from the packed bundle', async t => {
  const {
    npm,
    npmLocalTarball,
    paths: { globalNodeModules },
  } = await setup(t, {
    testdir: {
      project: {
        'package.json': { name: 'npm', version: '999.999.999' },
      },
    },
  })

  const tarball = await npmLocalTarball()
  await npm('install', tarball, '--global', '--ignore-scripts')

  const npmRoot = join(globalNodeModules, 'npm')
  const missing = findMissingDeps(npmRoot)

  t.strictSame(
    missing,
    [],
    'every non-optional production dependency resolves in the packed bundle'
  )
})
