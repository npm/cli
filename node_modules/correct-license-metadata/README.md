interpret old-style npm licenses arrays and other aberrations

```javascript
var correct = require('correct-license-metadata')
var assert = require('assert')

assert.strictEqual(
  correct({
    license: '(MIT OR GPL-2.0-only)' // valid metadata
  }),
  '(MIT OR GPL-2.0-only)'
)

assert.strictEqual(
  correct({
    licenses: [ // old-style licenses array
      {
        type: 'MIT',
        url: 'http://opensource.org/licenses/MIT'
      }
    ]
  }),
  'MIT'
)

assert.strictEqual(
  correct({
    license: {
      type: 'MIT',
      url: 'https://github.com/isaacs/rimraf/raw/master/LICENSE'
    }
  }),
  'MIT'
)

assert.strictEqual(
  correct({
    licenses: [
      {
        type: 'Apache License 2.0', // invalid SPDX ID
        url: 'https://github.com/Microsoft/tslib/blob/master/LICENSE.txt'
      }
    ]
  }),
  'Apache-2.0'
)

assert.strictEqual(
  correct({
    license: [ // old-style license array
      {
        type: 'MIT',
        url: 'http://opensource.org/licenses/MIT'
      }
    ]
  }),
  'MIT'
)

assert.strictEqual(
  correct({
    license: "MIT/X11"
  }),
  'MIT'
)

assert.strictEqual(
  correct({
    licenses: ['MIT'] // invalid
  }),
  'MIT'
)

assert.strictEqual(
  correct({
    licenses: ['MIT'], // invalid
    license: 'GPL-3.0' // valid, conflicting
  }),
  false
)

assert.throws(
  function () {
    correct('not an object')
  },
  /argument must be an object/
)
```
