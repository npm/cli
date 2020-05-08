'use strict'

const { test } = require('tap')
const requireInject = require('require-inject')

const getReifyOutput = tester =>
  requireInject(
    '../../lib/utils/reify-output.js',
    {
      '../../lib/npm.js': ({
        started: Date.now(),
        flatOptions: {
          fund: true
        }
      }),
      '../../lib/utils/output.js': tester
    }
  )

test('missing info', (t) => {
  t.plan(1)
  const reifyOutput = getReifyOutput(
    out => t.doesNotHave(
      out,
      'looking for funding',
      'should not print fund message if missing info'
    )
  )

  reifyOutput({
    actualTree: {
      children: []
    },
    diff: {
      children: []
    }
  })
})

test('single package', (t) => {
  t.plan(1)
  const reifyOutput = getReifyOutput(
    out => {
      if (out.endsWith('looking for funding')) {
        t.match(
          out,
          '1 package is looking for funding',
          'should print single package message'
        )
      }
    }
  )

  reifyOutput({
    actualTree: {
      name: 'foo',
      package: {
        name: 'foo',
        version: '1.0.0'
      },
      edgesOut: new Map([
        ['bar', {
          to: {
            name: 'bar',
            package: {
              name: 'bar',
              version: '1.0.0',
              funding: { type: 'foo', url: 'http://example.com' }
            }
          }
        }]
      ])
    },
    diff: {
      children: []
    }
  })
})

test('print appropriate message for many packages', (t) => {
  t.plan(1)
  const reifyOutput = getReifyOutput(
    out => {
      if (out.endsWith('looking for funding')) {
        t.match(
          out,
          '3 packages are looking for funding',
          'should print single package message'
        )
      }
    }
  )

  reifyOutput({
    actualTree: {
      name: 'foo',
      package: {
        name: 'foo',
        version: '1.0.0'
      },
      edgesOut: new Map([
        ['bar', {
          to: {
            name: 'bar',
            package: {
              name: 'bar',
              version: '1.0.0',
              funding: { type: 'foo', url: 'http://example.com' }
            }
          }
        }],
        ['lorem', {
          to: {
            name: 'lorem',
            package: {
              name: 'lorem',
              version: '1.0.0',
              funding: { type: 'foo', url: 'http://example.com' }
            }
          }
        }],
        ['ipsum', {
          to: {
            name: 'ipsum',
            package: {
              name: 'ipsum',
              version: '1.0.0',
              funding: { type: 'foo', url: 'http://example.com' }
            }
          }
        }]
      ])
    },
    diff: {
      children: []
    }
  })
})
