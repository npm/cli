const t = require('tap')
const { cleanArgv } = require('../../../lib/utils/clean-argv.js')

t.test('redacts protected config values', t => {
  t.strictSame(cleanArgv([
    '--password=secret',
    '--otp',
    '123456',
    '--//registry.npmjs.org/:_authToken',
    'plain-secret',
    '--registry',
    'https://user:pass@registry.npmjs.org',
  ]), [
    '--password=***',
    '--otp',
    '***',
    '--//registry.npmjs.org/:_authToken',
    '***',
    '--registry',
    'https://user:***@registry.npmjs.org',
  ])
  t.end()
})

t.test('redacts protected config values with equals', t => {
  t.strictSame(cleanArgv([
    '--otp=123456',
    '--_authToken=plain-secret',
    '--//registry.npmjs.org/:_password=hunter2',
  ]), [
    '--otp=***',
    '--_authToken=***',
    '--//registry.npmjs.org/:_password=***',
  ])
  t.end()
})

t.test('leaves non-protected config values intact', t => {
  t.strictSame(cleanArgv([
    '--registry',
    'https://registry.npmjs.org',
    '--auth-type',
    'legacy',
    '--scope=@npmcli',
  ]), [
    '--registry',
    'https://registry.npmjs.org',
    '--auth-type',
    'legacy',
    '--scope=@npmcli',
  ])
  t.end()
})
