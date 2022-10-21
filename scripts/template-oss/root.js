module.exports = {
  rootRepo: {
    add: {
      '.github/workflows/ci.yml': 'ci.yml',
      '.github/workflows/ci-release.yml': 'ci-release.yml',
      '.github/workflows/create-node-pr.yml': 'create-node-pr.yml',
      '.github/ISSUE_TEMPLATE/bug.yml': false,
      '.github/ISSUE_TEMPLATE/config.yml': false,
      '.github/dependabot.yml': false,
      '.github/workflows/post-dependabot.yml': false,
    },
  },
  workspaceRepo: {
    add: {
      '.github/workflows/release.yml': false,
      '.github/workflows/ci-release.yml': false,
      '.github/dependabot.yml': false,
      '.github/workflows/post-dependabot.yml': false,
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
