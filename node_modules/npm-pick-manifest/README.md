# npm-pick-manifest [![npm version](https://img.shields.io/npm/v/npm-pick-manifest.svg)](https://npm.im/npm-pick-manifest) [![license](https://img.shields.io/npm/l/npm-pick-manifest.svg)](https://npm.im/npm-pick-manifest) [![Travis](https://img.shields.io/travis/npm/npm-pick-manifest.svg)](https://travis-ci.org/npm/npm-pick-manifest) [![Coverage Status](https://coveralls.io/repos/github/npm/npm-pick-manifest/badge.svg?branch=latest)](https://coveralls.io/github/npm/npm-pick-manifest?branch=latest)

[`npm-pick-manifest`](https://github.com/npm/npm-pick-manifest) is a standalone
implementation of [npm](https://npmjs.com)'s semver range resolution algorithm.

## Install

`$ npm install --save npm-pick-manifest`

## Table of Contents

* [Example](#example)
* [Features](#features)
* [API](#api)
  * [`pickManifest()`](#pick-manifest)

### Example

```javascript
const pickManifest = require('npm-pick-manifest')

fetch('https://registry.npmjs.org/npm-pick-manifest').then(res => {
  return res.json()
}).then(packument => {
  return pickManifest(packument, '^1.0.0')
}) // get same manifest as npm would get if you `npm i npm-pick-manifest@^1.0.0`
```

### Features

* Uses npm's exact [semver resolution algorithm](http://npm.im/semver).
* Supports ranges, tags, and versions.
* Prefers non-deprecated versions to deprecated versions.
* Prefers versions whose `engines` requirements are satisfied over those
  that will raise a warning or error at install time.

### API

#### <a name="pick-manifest"></a> `> pickManifest(packument, selector, [opts]) -> manifest`

Returns the manifest that best matches `selector`, or throws an error.

Packuments are anything returned by metadata URLs from the npm registry. That
is, they're objects with the following shape (only fields used by
`npm-pick-manifest` included):

```javascript
{
  name: 'some-package',
  'dist-tags': {
    foo: '1.0.1'
  },
  versions: {
    '1.0.0': { version: '1.0.0' },
    '1.0.1': { version: '1.0.1' },
    '1.0.2': { version: '1.0.2' },
    '2.0.0': { version: '2.0.0' }
  }
}
```

The algorithm will follow npm's algorithm for semver resolution, and only
`tag`, `range`, and `version` selectors are supported.

The function will throw `ETARGET` if there was no matching manifest, and
`ENOVERSIONS` if the packument object has no valid versions in `versions`.
If the only matching manifest is included in a `policyRestrictions` section
of the packument, then an `E403` is raised.

#### <a name="pick-manifest-options"></a> Options

All options are optional.

* `includeStaged` - Boolean, default `false`.  Include manifests in the
  `stagedVersions.versions` set, to support installing [staged
  packages](https://github.com/npm/rfcs/pull/92) when appropriate.  Note
  that staged packages are always treated as lower priority than actual
  publishes, even when `includeStaged` is set.
* `defaultTag` - String, default `'latest'`.  The default `dist-tag` to
  install when no specifier is provided.  Note that the version indicated
  by this specifier will be given top priority if it matches a supplied
  semver range.
* `before` - String, Date, or Number, default `null`. This is passed to
  `new Date()`, so anything that works there will be valid.  Do not
  consider _any_ manifests that were published after the date indicated.
  Note that this is only relevant when the packument includes a `time`
  field listing the publish date of all the packages.
* `nodeVersion` - String, default `process.version`.  The Node.js version
  to use when checking manifests for `engines` requirement satisfaction.
* `npmVersion` - String, default `null`.  The npm version to use when
  checking manifest for `engines` requirement satisfaction.  (If `null`,
  then this particular check is skipped.)

### Algorithm

1. Create list of all versions in `versions`,
   `policyRestrictions.versions`, and (if `includeStaged` is set)
   `stagedVersions.versions`.
2. If a `dist-tag` is requested,
    1. If the manifest is not after the specified `before` date, then
       select that from the set.
    2. If the manifest is after the specified `before` date, then re-start
       the selection looking for the highest SemVer range that is equal to
       or less than the `dist-tag` target.
3. If a specific version is requested,
    1. If the manifest is not after the specified `before` date, then
       select the specified manifest.
    2. If the manifest is after the specified `before` date, then raise
       `ETARGET` error.  (NB: this is a breaking change from v5, where a
       specified version would override the `before` setting.)
4. (At this point we know a range is requested.)
5. If the `defaultTag` refers to a `dist-tag` that satisfies the range (or
   if the range is `'*'` or `''`), and the manifest is published before the
   `before` setting, then select that manifest.
6. If nothing is yet selected, sort by the following heuristics in order,
   and select the top item:
    1. Prioritize versions that are not in `policyRestrictions` over those
       that are.
    2. Prioritize published versions over staged versions.
    3. Prioritize versions that are not deprecated, and which have a
       satisfied engines requirement, over those that are either deprecated
       or have an engines mismatch.
    4. Prioritize versions that have a satisfied engines requirement over
       those that do not.
    5. Prioritize versions that are not are not deprecated (but have a
       mismatched engines requirement) over those that are deprecated.
    6. Prioritize higher SemVer precedence over lower SemVer precedence.
7. If no manifest was selected, raise an `ETARGET` error.
8. If the selected item is in the `policyRestrictions.versions` list, raise
   an `E403` error.
9. Return the selected manifest.
