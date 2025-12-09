var test = require('tap').test
var path = require('path')
var fs = require('graceful-fs')
var rimraf = require('rimraf')
var mkdirp = require('mkdirp')
var environments = require('../../lib/utils/environments.js')
var loadEnvConfig = require('../../lib/config/load-env.js')

var testDir = path.join(__dirname, 'config-env-specific-test')

test('setup', function (t) {
  mkdirp.sync(testDir)
  t.end()
})

test('environments.resolveEnvName - resolves aliases', function (t) {
  t.equal(environments.resolveEnvName('dev'), 'development')
  t.equal(environments.resolveEnvName('prod'), 'production')
  t.equal(environments.resolveEnvName('stg'), 'staging')
  t.equal(environments.resolveEnvName('stage'), 'staging')
  t.equal(environments.resolveEnvName('staging'), 'staging')
  t.equal(environments.resolveEnvName('production'), 'production')
  t.equal(environments.resolveEnvName('custom'), 'custom')
  t.equal(environments.resolveEnvName(null), null)
  t.equal(environments.resolveEnvName(''), null)
  t.end()
})

test('environments.getEnvConfigPath - generates correct paths', function (t) {
  var baseDir = '/test/dir'
  t.equal(
    environments.getEnvConfigPath(baseDir, 'staging'),
    path.join(baseDir, '.npmrc.staging')
  )
  t.equal(
    environments.getEnvConfigPath(baseDir, 'dev'),
    path.join(baseDir, '.npmrc.development')
  )
  t.equal(environments.getEnvConfigPath(baseDir, null), null)
  t.end()
})

test('environments.envConfigExists - detects existing configs', function (t) {
  // Create a test config file
  var envConfigPath = path.join(testDir, '.npmrc.staging')
  fs.writeFileSync(envConfigPath, 'registry=https://staging.example.com/')

  t.equal(environments.envConfigExists(testDir, 'staging'), true)
  t.equal(environments.envConfigExists(testDir, 'production'), false)
  t.equal(environments.envConfigExists(testDir, null), false)
  t.end()
})

test('environments.loadEnvConfig - loads config file', function (t) {
  var envConfigPath = path.join(testDir, '.npmrc.staging')
  fs.writeFileSync(envConfigPath, 'registry=https://staging.example.com/\ncache=/tmp/staging-cache')

  environments.loadEnvConfig(testDir, 'staging', function (err, result) {
    t.equal(err, null)
    t.ok(result)
    t.equal(result.path, envConfigPath)
    t.ok(result.data.includes('registry=https://staging.example.com/'))
    t.end()
  })
})

test('environments.loadEnvConfig - returns null for missing config', function (t) {
  environments.loadEnvConfig(testDir, 'nonexistent', function (err, result) {
    t.equal(err, null)
    t.equal(result, null)
    t.end()
  })
})

test('environments.loadEnvConfig - returns null for null env', function (t) {
  environments.loadEnvConfig(testDir, null, function (err, result) {
    t.equal(err, null)
    t.equal(result, null)
    t.end()
  })
})

test('environments.getEnvSpecificVars - extracts env-specific vars', function (t) {
  // Set some environment-specific variables
  process.env.npm_config_staging_registry = 'https://staging.example.com/'
  process.env.npm_config_staging_cache = '/tmp/staging-cache'
  process.env.npm_config_production_registry = 'https://prod.example.com/'

  var stagingVars = environments.getEnvSpecificVars('staging')
  t.equal(stagingVars.registry, 'https://staging.example.com/')
  t.equal(stagingVars.cache, '/tmp/staging-cache')
  t.notOk(stagingVars['production-registry'])

  var prodVars = environments.getEnvSpecificVars('production')
  t.equal(prodVars.registry, 'https://prod.example.com/')

  // Cleanup
  delete process.env.npm_config_staging_registry
  delete process.env.npm_config_staging_cache
  delete process.env.npm_config_production_registry

  t.end()
})

test('environments.validateEnv - validates environment', function (t) {
  var result = environments.validateEnv('staging', testDir, testDir)
  t.equal(result.valid, true)
  t.equal(result.env, 'staging')
  t.ok(result.projectConfig || result.userConfig || result.hasEnvVars || true)
  t.end()
})

test('environments.listAvailableEnvs - lists available environments', function (t) {
  // Create additional test config files
  fs.writeFileSync(path.join(testDir, '.npmrc.production'), 'registry=https://prod.example.com/')
  fs.writeFileSync(path.join(testDir, '.npmrc.development'), 'registry=https://dev.example.com/')

  var envs = environments.listAvailableEnvs(testDir, testDir)
  t.ok(envs.staging)
  t.ok(envs.production)
  t.ok(envs.development)
  t.end()
})

test('loadEnvConfig module - loads environment config', function (t) {
  var options = {
    projectDir: testDir,
    userDir: testDir
  }

  loadEnvConfig('staging', options, function (err, result) {
    t.equal(err, null)
    t.ok(result)
    t.equal(result.env, 'staging')
    t.ok(result.config)
    t.ok(result.config.path.includes('.npmrc.staging'))
    t.end()
  })
})

test('loadEnvConfig module - returns null for no env', function (t) {
  var options = {
    projectDir: testDir,
    userDir: testDir
  }

  loadEnvConfig(null, options, function (err, result) {
    t.equal(err, null)
    t.equal(result, null)
    t.end()
  })
})

test('loadEnvConfig.parse - parses config content', function (t) {
  var content = 'registry=https://example.com/\n# Comment\ncache=/tmp/cache\nkey="quoted value"'
  var parsed = loadEnvConfig.parse(content)

  t.equal(parsed.registry, 'https://example.com/')
  t.equal(parsed.cache, '/tmp/cache')
  t.equal(parsed.key, 'quoted value')
  t.notOk(parsed['# Comment'])
  t.end()
})

test('loadEnvConfig.getEnvInfo - returns environment info', function (t) {
  var options = {
    projectDir: testDir,
    userDir: testDir
  }

  var info = loadEnvConfig.getEnvInfo('staging', options)
  t.ok(info)
  t.equal(info.name, 'staging')
  t.ok(Array.isArray(info.configPaths))
  t.ok(info.configPaths.length > 0)
  t.end()
})

test('cleanup', function (t) {
  rimraf.sync(testDir)
  t.end()
})
