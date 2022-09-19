module.exports = {
  rootRepo: {
    add: {
      '.github/ISSUE_TEMPLATE/config.yml': false,
      '.github/ISSUE_TEMPLATE/bug.yml': false,
      '.github/workflows/ci.yml': 'ci.yml',
      '.github/workflows/ci-release.yml': 'ci-release.yml',
    },
  },
  workspaceRepo: {
    add: {
      '.github/workflows/release.yml': false,
      '.github/workflows/ci-release.yml': false,
    },
  },
  lockfile: true,
  npm: '.',
  defaultBranch: 'latest',
  distPaths: [
    'index.js',
    'docs/content/**/*.md',
    'docs/output/**/*.html',
    'man',
  ],
  allowPaths: [
    '/node_modules/',
    '/index.js',
    '/Makefile',
    '/make.bat',
    '/DEPENDENCIES.md',
    '/CONTRIBUTING.md',
    '/configure',
    '/changelogs/',
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
