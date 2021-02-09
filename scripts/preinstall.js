#!/usr/bin/env node

/*
 * Preinstall check
 *
 * We don't want to allow npm to install on systems that we know it won't work
 * on, so we run some preinstall checks to make it bail early and save end
 * users the hassle of recovering from a broken npm install
 */


const checks = require('npm-install-checks')
const pkg = require('../package.json')

try {
  checks.checkEngine(pkg, pkg.version, process.version)
} catch (e) {
  if (e.code !== 'EBADENGINE') {
    throw e
  }
  console.log(`Error: ${e.message}`)
  console.log('Please see "Requirements" on https://www.npmjs.com/package/npm for more information about what versions of node are supported')
  console.log('')
  process.exitCode = 1
}
