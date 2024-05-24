const { mkdirSync } = require('node:fs')
const localeCompare = require('@isaacs/string-locale-compare')('en')
const { unlinkSync, symlinkSync, readFileSync, writeFileSync } = require('node:fs')
const { relative, resolve, dirname } = require('node:path')
const mkdirp = (p) => mkdirSync(p, { recursive: true })

const fixtures = __dirname

const roots = [
  'bundle',
  'deepmixedloop',
  'deeproot/root',
  'devloop',
  'linkedroot',
  'links-all-over',
  'mixedloop',
  'mixedmidway',
  'noname',
  'optionalloop',
  'optofdev',
  'other',
  'root',
  // This test flakes out on Apple Silicon
  // https://github.com/npm/cli/pull/7411
  process.platform === 'darwin' && process.arch === 'arm64'
    ? null
    : 'selflink',
  'symlinked-node-modules/example',
  'workspace',
  'workspace2',
  'workspace3',
  'workspaces-simple',
  'install-types',
  'pnpm',
  'external-dep/root',
  'external-link/root',
  'yarn-lock-mkdirp-file-dep',
  'link-dep-cycle',
  'link-dep-nested',
  'link-dep-nested/root',
  'external-link-cached-dummy-dep/root',
].filter(Boolean)

const symlinks = {
  'selflink/node_modules/@scope/z/node_modules/glob':
    '../../../foo/node_modules/glob',
  'selflink/node_modules/foo/node_modules/selflink':
    '../../..',
  'other/node_modules/glob':
    '../../root/node_modules/@scope/x/node_modules/glob',
  linkedroot: 'root',
  'deep/root': '../root',
  deeproot: 'deep',
  'badlink/node_modules/foo': 'foo',
  'badlink/node_modules/bar': 'baz',
  'testing-peer-deps-link': 'testing-peer-deps',

  'workspace/node_modules/a': '../packages/a',
  'workspace/node_modules/b': '../packages/b',
  'workspace/node_modules/c': '../packages/c',
  'workspace/packages/a/node_modules/b': '../../../packages/b',
  'workspace/packages/a/node_modules/c': '../../../packages/c',
  'workspace/packages/b/node_modules/a': '../../../packages/a',
  'workspace/packages/b/node_modules/c': '../../../packages/c',
  'workspace/packages/c/node_modules/a': '../../../packages/a',
  'workspace/packages/c/node_modules/b': '../../../packages/b',

  'workspace2/node_modules/c/node_modules/d': '../../b/node_modules/d',
  'workspace2/node_modules/c/node_modules/x': '../../../x',

  'workspace3/node_modules/app': '../app',
  'workspace3/node_modules/a': '../packages/a',
  'workspace3/node_modules/b': '../packages/b',
  'workspace3/node_modules/c': '../packages/c',
  'workspaces-simple/node_modules/a': '../a',
  'workspaces-simple/node_modules/b': '../b',

  'links-all-over/node_modules/link-outside-nest':
    '../real',
  'links-all-over/node_modules/link-deep':
    'nest/node_modules/a/node_modules/b/node_modules/c/node_modules/d/node_modules/deep',
  'links-all-over/node_modules/link-link': 'link-deep',
  'links-all-over/node_modules/nest/node_modules/link-in-nest':
    '../../../real',

  'symlinked-node-modules/example/node_modules':
    '../linked-node-modules/',
  'symlinked-node-modules/linked-node-modules/bar': '../bar',

  'install-types/node_modules/symlink': '../abbrev-link-target',

  'pnpm/node_modules/.pnpm/registry.npmjs.org/@scope/x/1.0.0/node_modules/a':
    '../../../../a/1.0.0/node_modules/a',
  'pnpm/node_modules/.pnpm/registry.npmjs.org/@scope/x/1.0.0/node_modules/b':
    '../../../../b/1.0.0/node_modules/b',
  'pnpm/node_modules/.pnpm/registry.npmjs.org/@scope/x/1.0.0/node_modules/c':
    '../../../../c/1.0.0/node_modules/c',
  'pnpm/node_modules/.pnpm/registry.npmjs.org/a/1.0.0/node_modules/b':
    '../../../b/1.0.0/node_modules/b',
  'pnpm/node_modules/.pnpm/registry.npmjs.org/a/1.0.0/node_modules/c':
    '../../../c/1.0.0/node_modules/c',
  'pnpm/node_modules/.pnpm/registry.npmjs.org/b/1.0.0/node_modules/c':
    '../../../c/1.0.0/node_modules/c',
  'pnpm/node_modules/.pnpm/registry.npmjs.org/c/1.0.0/node_modules/@scope/x':
    '../../../../@scope/x/1.0.0/node_modules/@scope/x',
  'pnpm/node_modules/@scope/x':
    '../.pnpm/registry.npmjs.org/@scope/x/1.0.0/node_modules/@scope/x',
  'pnpm/node_modules/a': '.pnpm/registry.npmjs.org/a/1.0.0/node_modules/a',

  'global-style/lib-link': './lib',

  'external-link/root/node_modules/o': '../../m/node_modules/n/o',
  'external-link/root/node_modules/o2': '../../m/node_modules/n/o2',
  'external-link/root/node_modules/j': '../../i/j',
  'external-link/root/node_modules/x/node_modules/b': '../../../../a/node_modules/b',

  'link-dep-cycle/node_modules/a': '../a',
  'link-dep-cycle/node_modules/b': '../b',
  'link-dep-cycle/a/node_modules/b': '../../b',
  'link-dep-cycle/b/node_modules/a': '../../a',

  'link-dep-nested/node_modules/once': '../once',
  'link-dep-nested/node_modules/foo': '../once',
  'link-dep-nested/root/node_modules/bork': '../..',

  'external-link-cached-dummy-dep/root/node_modules/z': '../../a/t/u/v/w/x/y/z',
  'external-link-cached-dummy-dep/root/node_modules/x': '../../a/node_modules/b/node_modules/x',
  'cli-750/node_modules/app': '../app',
  'cli-750/node_modules/lib': '../lib',
  'link-dep/node_modules/linked-dep': '../target',
  'link-dev-dep/node_modules/linked-dev-dep': '../target',
  'link-meta-deps/node_modules/@isaacs/testing-link-dep/node_modules/linked-dep':
    '../target',
  'prune-dev-bins/node_modules/.bin/yes': '../yes/yes.js',
  'old-package-lock-with-bins/node_modules/.bin/ruy':
    '../ruy/bin/index.js',

  'workspaces-add-new-dep/node_modules/pkg-a': '../a',
  'workspaces-add-new-dep/node_modules/a': '../a',

  'workspaces-non-simplistic/node_modules/pkg-a': '../a',

  'testing-bundledeps-link': './testing-bundledeps-2',
}

const cleanup = () => Object.keys(symlinks).forEach(s => {
  try {
    unlinkSync(resolve(__dirname, s))
  } catch {
    // ok if cleanup fails
  }
})

const setup = () => {
  const links = []
  let didSomething = false
  Object.keys(symlinks).forEach(s => {
    const p = resolve(__dirname, s)
    mkdirp(dirname(p))
    const rel = relative(resolve(__dirname), p)
    links.push('/' + rel.replace(/\\/g, '/'))

    try {
      symlinkSync(symlinks[s], p, 'junction')
      didSomething = true
    } catch {
      // it's fine for this to throw, since it typically means
      // that the links already exist, and that's fine.
    }
  })
  if (didSomething) {
    const start = '### BEGIN IGNORED SYMLINKS ###'
    const end = '### END IGNORED SYMLINKS ###'
    const gifile = resolve(__dirname, './.gitignore')
    const gitignore = readFileSync(gifile, 'utf8')
      .replace(new RegExp(`${start}[\\s\\S]*${end}`), [
        start,
        '### this list is generated automatically, do not edit directly',
        '### update it by running `node test/fixtures/index.js`',
        ...links.sort(localeCompare),
        end,
      ].join('\n'))
    writeFileSync(gifile, gitignore)
  }
}

const doCleanup = process.argv[2] === 'cleanup' && require.main === module ||
  process.env.ARBORIST_FIXTURE_CLEANUP === '1'

if (doCleanup) {
  cleanup()
} else {
  setup()
}

module.exports = {
  roots,
  symlinks,
  fixtures,
}
