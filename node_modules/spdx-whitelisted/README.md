This package was forked from version 5.0.0 of [spdx-satisfies](https://www.npmjs.com/package/spdx-satisfies).

```javascript
var assert = require('assert')
var whitelisted = require('spdx-whitelisted')
```

This package exports a single function of two arguments:

1.  an Object representing an SPDX expression

2.  an Array of Objects, each in the form of a leaf in an SPDX expression data structure

```javascript
assert(
  whitelisted(
    {license: 'MIT'},
    [{license: 'MIT'}]
  )
)
```

The schema for SPDX expression data structures is the same returned by [spdx-expression-parse](https://www.npmjs.com/package/spdx-expression-parse).

```javascript
var parse = require('spdx-expression-parse')

assert(whitelisted(
  parse('MIT'),
  [parse('ISC'), parse('MIT')]
))

assert(whitelisted(
  {license: 'Zlib'},
  [
    {license: 'ISC'},
    {license: 'MIT'},
    {license: 'Zlib'}
  ]
))

assert(!whitelisted(
  {license: 'GPL-3.0'},
  [
    {license: 'ISC'},
    {license: 'MIT'}
  ]
))


assert(whitelisted(
  {license: 'GPL-2.0'},
  [{license: 'GPL-2.0', plus: true}]
))

assert(whitelisted(
  {license: 'GPL-3.0'},
  [{license: 'GPL-2.0', plus: true}]
))

assert(whitelisted(
  {license: 'GPL-1.0', plus: true},
  [{license: 'GPL-2.0', plus: true}]
))

assert(!whitelisted(
  {license: 'GPL-1.0'},
  [{license: 'GPL-2.0', plus: true}]
))

assert(whitelisted(
  {license: 'GPL-2.0-only'},
  [{license: 'GPL-2.0-only'}]
))

assert(whitelisted(
  {license: 'GPL-3.0-only'},
  [{license: 'GPL-2.0', plus: true}]
))

assert(!whitelisted(
  {license: 'GPL-2.0'},
  [
    {
      license: 'GPL-2.0',
      plus: true,
      exception: 'Bison-exception-2.2'
    }
  ]
))

assert(whitelisted(
  {
    license: 'GPL-3.0',
    exception: 'Bison-exception-2.2'
  },
  [
    {
      license: 'GPL-2.0',
      plus: true,
      exception: 'Bison-exception-2.2'
    }
  ]
))

assert(whitelisted(
  // (MIT OR GPL-2.0)
  {
    left: {license: 'MIT'},
    conjunction: 'or',
    right: {license: 'GPL-2.0'}
  },
  [
    {license: 'ISC'},
    {license: 'MIT'}
  ]
))

assert(whitelisted(
  // ((MIT OR Apache-2.0) AND (ISC OR GPL-2.0))
  {
    left: {
      left: {license: 'MIT'},
      conjunction: 'or',
      right: {license: 'Apache-2.0'}
    },
    conjunction: 'and',
    right: {
      left: {license: 'ISC'},
      conjunction: 'or',
      right: {license: 'GPL-2.0'}
    }
  },
  [
    {license: 'Apache-2.0'},
    {license: 'ISC'}
  ]
))

assert(whitelisted(
  // (MIT AND GPL-2.0)
  {
    left: {license: 'MIT'},
    conjunction: 'and',
    right: {license: 'GPL-2.0'}
  },
  [
    {license: 'MIT'},
    {license: 'GPL-2.0'}
  ]
))

assert(!whitelisted(
  // (MIT AND GPL-2.0)
  {
    left: {license: 'MIT'},
    conjunction: 'and',
    right: {license: 'GPL-2.0'}
  },
  [
    {license: 'ISC'},
    {license: 'GPL-2.0'}
  ]
))

assert(!whitelisted(
  // (MIT AND (GPL-2.0 OR ISC))
  {
    left: {license: 'MIT'},
    conjunction: 'and',
    right: {
      left: {license: 'GPL-2.0'},
      conjunction: 'or',
      right: {license: 'ISC'}
    }
  },
  [{license: 'MIT'}]
))

assert(!whitelisted(
  // (MIT OR Apache-2.0) AND (ISC OR GPL-2.0)
  {
    left: {
      left: {license: 'MIT'},
      conjunction: 'or',
      right: {license: 'Apache-2.0'}
    },
    conjunction: 'and',
    right: {
      left: {license: 'ISC'},
      conjunction: 'or',
      right: {license: 'GPL-2.0'}
    }
  },
  [{license: 'MIT'}]
))
```

The exported function does a few naive type checks on arguments.  Do not rely on it for rigorous validation.

```javascript
assert.throws(function () {
  whitelisted('MIT', [parse('MIT')])
}, /first argument/)

assert.throws(function () {
  whitelisted({invalid: 'AST'}, [parse('MIT')])
}, /first argument/)

assert.throws(function () {
  whitelisted(parse('MIT'), parse('MIT'))
}, /second argument/)

assert.throws(function () {
  whitelisted(parse('MIT'), parse('MIT'))
}, /second argument/)

assert.throws(function () {
  whitelisted(parse('MIT'), [{invalid: 'leaf'}])
}, /second argument/)
```
