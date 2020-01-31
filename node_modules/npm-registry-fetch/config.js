'use strict'

const pkg = require('./package.json')
const figgyPudding = require('figgy-pudding')
const silentLog = require('./silentlog.js')
const ciDetect = require('@npmcli/ci-detect')

const AUTH_REGEX = /^(?:.*:)?(token|_authToken|username|_password|password|email|always-auth|_auth|otp)$/
const SCOPE_REGISTRY_REGEX = /@.*:registry$/gi
module.exports = figgyPudding({
  agent: {},
  algorithms: {},
  body: {},
  ca: {},
  cache: {},
  cert: {},
  'fetch-retries': {},
  'fetch-retry-factor': {},
  'fetch-retry-maxtimeout': {},
  'fetch-retry-mintimeout': {},
  'force-auth': {},
  forceAuth: 'force-auth',
  gzip: {},
  headers: {},
  'https-proxy': {},
  'ignore-body': {},
  ignoreBody: 'ignore-body',
  integrity: {},
  'is-from-ci': 'isFromCI',
  isFromCI: {
    default () {
      return ciDetect()
    }
  },
  key: {},
  'local-address': {},
  log: {
    default: silentLog
  },
  'map-json': 'mapJson',
  mapJSON: 'mapJson',
  mapJson: {},
  'max-sockets': 'maxsockets',
  maxsockets: {
    default: 12
  },
  memoize: {},
  method: {
    default: 'GET'
  },
  'no-proxy': {},
  noproxy: {},
  'npm-session': 'npmSession',
  npmSession: {},
  offline: {},
  otp: {},
  'prefer-offline': {},
  'prefer-online': {},
  projectScope: {},
  'project-scope': 'projectScope',
  proxy: {},
  query: {},
  refer: {},
  referer: 'refer',
  registry: {
    default: 'https://registry.npmjs.org/'
  },
  retry: {},
  scope: {},
  spec: {},
  'strict-ssl': {},
  timeout: {},
  'user-agent': {
    default: `${
      pkg.name
    }@${
      pkg.version
    }/node@${
      process.version
    }+${
      process.arch
    } (${
      process.platform
    })`
  }
}, {
  other (key) {
    return key.match(AUTH_REGEX) || key.match(SCOPE_REGISTRY_REGEX)
  }
})
