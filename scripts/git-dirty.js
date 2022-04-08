#!/usr/bin/env node
const { spawnSync } = require('child_process')
const changes = spawnSync('git', ['status', '--porcelain', '-uall'])
const stdout = changes.stdout.toString('utf8')
const stderr = changes.stderr.toString('utf8')
const { status, signal } = changes
console.log(stdout)
console.error(stderr)
if (status || signal) {
  console.error({ status, signal })
  process.exitCode = status || 1
}
if (stdout.trim() !== '') {
  throw new Error('git dirty')
} else {
  console.log('git clean')
}
