module.exports = {
  rootModule: {
    add: {
      'CONTRIBUTING.md': false,
      'package.json': { file: 'pkg.json', overwrite: false },
    },
  },
  rootRepo: {
    add: {
      '.github/ISSUE_TEMPLATE/bug.yml': false,
      '.github/ISSUE_TEMPLATE/config.yml': false,
      '.github/dependabot.yml': false,
      '.github/settings.yml': false,
      '.github/workflows/ci-release.yml': 'ci-release.yml',
      '.github/workflows/ci.yml': 'ci.yml',
      '.github/workflows/create-node-pr.yml': 'create-node-pr.yml',
      '.github/workflows/node-integration.yml': 'node-integration.yml',
      '.github/workflows/post-dependabot.yml': false,
    },
  },
  workspaceRepo: {
    add: {
      '.github/dependabot.yml': false,
      '.github/settings.yml': false,
      '.github/workflows/ci-release.yml': false,
      '.github/workflows/post-dependabot.yml': false,
      '.github/workflows/release.yml': false,
      '.github/workflows/pull-request.yml': false,
    },
  },
  workspaceModule: {
    add: {
      'package.json': { file: 'pkg.json', overwrite: false },
    },
  },
  lockfile: true,
  npm: '.',
  defaultBranch: 'latest',
  distPaths: [
    'index.js',
    'docs/content/',
    'docs/output/',
    'man/',
  ],
  allowPaths: [
    '/node_modules/',
    '/index.js',
    '/DEPENDENCIES.md',
    '/CONTRIBUTING.md',
    '/configure',
    '/AUTHORS',
    '/.mailmap',
    '/.licensee.json',
    '/.gitattributes',
  ],
  ignorePaths: [
    '/node_modules/.bin/',
    '/node_modules/.cache/',
  ],
  ...require('./branch-specific-config.js'),
}
