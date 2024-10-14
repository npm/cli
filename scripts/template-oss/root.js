const releasePleaseConfig = {
  'release-please-config.json': {
    file: 'release-please-config-json.hbs',
    overwrite: false,
    filter: (p) => p.config.isPublic,
    parser: (p) => p.JsonMergeNoComment,
  },
}

module.exports = {
  rootModule: {
    add: {
      'CONTRIBUTING.md': false,
      'package.json': { file: 'package-json.hbs', overwrite: false },
    },
  },
  rootRepo: {
    add: {
      '.github/ISSUE_TEMPLATE/bug.yml': false,
      '.github/ISSUE_TEMPLATE/config.yml': false,
      '.github/dependabot.yml': false,
      '.github/settings.yml': false,
      '.github/workflows/post-dependabot.yml': false,
      '.github/workflows/ci-release.yml': 'ci-release-yml.hbs',
      '.github/workflows/ci.yml': 'ci-yml.hbs',
      '.github/workflows/create-node-pr.yml': 'create-node-pr-yml.hbs',
      '.github/workflows/node-integration.yml': 'node-integration-yml.hbs',
      ...releasePleaseConfig,
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
      ...releasePleaseConfig,
    },
  },
  workspaceModule: {
    add: {
      'package.json': { file: 'package-json.hbs', overwrite: false },
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
  allowDistPaths: false,
  allowPaths: [
    '/bin/',
    '/lib/',
    '/node_modules/',
    '/index.js',
    '/DEPENDENCIES.md',
    '/DEPENDENCIES.json',
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
