var path = require('path')
var minimist = require('minimist')
var getAbi = require('node-abi').getAbi
var detectLibc = require('detect-libc')
var napi = require('napi-build-utils')

var env = process.env
var libc = env.LIBC || (detectLibc.isNonGlibcLinux && detectLibc.family) || ''

// Get the configuration
module.exports = function (pkg) {
  var pkgConf = pkg.config || {}
  var buildFromSource = env.npm_config_build_from_source

  var rc = require('rc')('prebuild-install', {
    target: pkgConf.target || env.npm_config_target || process.versions.node,
    runtime: pkgConf.runtime || env.npm_config_runtime || 'node',
    arch: pkgConf.arch || env.npm_config_arch || process.arch,
    libc: libc,
    platform: env.npm_config_platform || process.platform,
    debug: env.npm_config_debug === 'true',
    force: false,
    verbose: env.npm_config_verbose === 'true',
    buildFromSource: buildFromSource === pkg.name || buildFromSource === 'true',
    path: '.',
    proxy: env.npm_config_proxy || env['http_proxy'] || env['HTTP_PROXY'],
    'https-proxy': env.npm_config_https_proxy || env['https_proxy'] || env['HTTPS_PROXY'],
    'local-address': env.npm_config_local_address,
    'local-prebuilds': 'prebuilds',
    'tag-prefix': 'v',
    download: env.npm_config_download
  }, minimist(process.argv, {
    alias: {
      target: 't',
      runtime: 'r',
      help: 'h',
      arch: 'a',
      path: 'p',
      version: 'v',
      download: 'd',
      buildFromSource: 'build-from-source',
      token: 'T'
    }
  }))

  rc.path = path.resolve(rc.path === true ? '.' : rc.path || '.')

  if (napi.isNapiRuntime(rc.runtime) && rc.target === process.versions.node) {
    rc.target = napi.getBestNapiBuildVersion()
  }

  rc.abi = napi.isNapiRuntime(rc.runtime) ? rc.target : getAbi(rc.target, rc.runtime)

  return rc
}

// Print the configuration values when executed standalone for testing purposses
if (!module.parent) {
  console.log(JSON.stringify(module.exports({}), null, 2))
}
