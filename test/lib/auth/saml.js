const { test } = require('tap')

test('saml login', (t) => {
  t.plan(3)
  const samlOpts = {
    creds: {},
    registry: 'https://diff-registry.npmjs.org/',
    scope: 'myscope',
  }

  const saml = t.mock('../../../lib/auth/saml.js', {
    '../../../lib/auth/sso.js': (opts) => {
      t.equal(opts, samlOpts, 'should forward opts')
    },
    '../../../lib/npm.js': {
      config: {
        set: (key, value) => {
          t.equal(key, 'sso-type', 'should define sso-type')
          t.equal(value, 'saml', 'should set sso-type to saml')
        },
      },
    },
  })

  saml(samlOpts)

  t.end()
})
