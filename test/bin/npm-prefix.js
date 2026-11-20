const t = require('tap')
const { spawnSync } = require('node:child_process')
const { resolve, join } = require('node:path')

const prefixScript = resolve(__dirname, '../../bin/npm-prefix.js')

t.test('shim prefix discovery ignores project-controlled configuration', async t => {
  for (const { projectConfig, source = 'default' } of [
    { projectConfig: 'prefix=./selected-cli' },
    { projectConfig: 'pre${UNSET_VAR?}fix=./selected-cli' },
    { projectConfig: 'userconfig=./other.npmrc' },
    { projectConfig: 'globalconfig=./other.npmrc' },
    { projectConfig: 'userconfig=./other.npmrc', source: 'user' },
    { projectConfig: 'globalconfig=./other.npmrc', source: 'global' },
    { projectConfig: 'userconfig=./other.npmrc', source: 'env' },
  ]) {
    await t.test(`${source} prefix with ${projectConfig}`, t => {
      const path = t.testdir()
      const defaultPrefix = join(path, 'default-prefix')
      const trustedPrefix = source === 'default' ? defaultPrefix : join(path, 'trusted-prefix')
      t.testdir({
        project: {
          node_modules: {},
          '.npmrc': projectConfig,
          'other.npmrc': 'prefix=./selected-cli',
        },
        home: {
          '.npmrc': source === 'user' ? `prefix=${trustedPrefix}` : '',
        },
        'default-prefix': {
          etc: {
            npmrc: source === 'global' ? `prefix=${trustedPrefix}` : '',
          },
        },
      })
      const result = spawnSync(process.execPath, [prefixScript], {
        cwd: join(path, 'project'),
        env: {
          HOME: join(path, 'home'),
          USERPROFILE: join(path, 'home'),
          PREFIX: defaultPrefix,
          ...(source === 'env' ? { npm_config_prefix: trustedPrefix } : {}),
        },
        encoding: 'utf8',
      })
      t.equal(result.status, 0, 'prefix discovery succeeds')
      t.equal(result.stderr, '', 'project configuration is not loaded')
      t.equal(result.stdout.trim(), trustedPrefix, 'only trusted configuration selects the CLI')
      t.end()
    })
  }
})

t.test('shim prefix discovery reports configuration errors', t => {
  const path = t.testdir({
    'config.npmrc': '',
  })
  const configFile = join(path, 'config.npmrc')
  const result = spawnSync(process.execPath, [prefixScript], {
    cwd: path,
    env: {
      HOME: path,
      PREFIX: path,
      npm_config_userconfig: configFile,
      npm_config_globalconfig: configFile,
    },
    encoding: 'utf8',
  })
  t.equal(result.status, 1, 'configuration failure exits unsuccessfully')
  t.equal(result.stdout, '', 'does not emit a success-shaped prefix')
  t.match(result.stderr, /double-loading config/, 'reports the configuration error')
  t.end()
})
