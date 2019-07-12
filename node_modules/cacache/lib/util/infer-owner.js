'use strict'

// This is only called by lib/util/fix-owner.js
//
// Get the uid/gid from the cache folder itself, not from
// settings being passed in.  Too flaky otherwise, because the
// opts baton has to be passed properrly through half a dozen
// different modules.
//
// This module keeps a Map of cache=>{uid,gid}.  If not in the map,
// then stat the folder, then the parent, ..., until it finds a folder
// that exists, and use that folder's uid and gid as the owner.
//
// If we don't have getuid/getgid, then this never gets called.

const BB = require('bluebird')
const fs = require('fs')
const lstat = BB.promisify(fs.lstat)
const lstatSync = fs.lstatSync
const { dirname } = require('path')
const inflight = require('promise-inflight')

const cacheToOwner = new Map()

const inferOwner = cache => {
  if (cacheToOwner.has(cache)) {
    // already inferred it
    return BB.resolve(cacheToOwner.get(cache))
  }

  const statThen = st => {
    const { uid, gid } = st
    cacheToOwner.set(cache, { uid, gid })
    return { uid, gid }
  }
  // check the parent if the cache itself fails
  // likely it does not exist yet.
  const parent = dirname(cache)
  const parentTrap = parent === cache ? null : er => {
    return inferOwner(parent).then((owner) => {
      cacheToOwner.set(cache, owner)
      return owner
    })
  }
  return lstat(cache).then(statThen, parentTrap)
}

const inferOwnerSync = cache => {
  if (cacheToOwner.has(cache)) {
    // already inferred it
    return cacheToOwner.get(cache)
  }

  // the parent we'll check if it doesn't exist yet
  const parent = dirname(cache)
  // avoid obscuring call site by re-throwing
  // "catch" the error by returning from a finally,
  // only if we're not at the root, and the parent call works.
  let threw = true
  try {
    const st = lstatSync(cache)
    threw = false
    const { uid, gid } = st
    cacheToOwner.set(cache, { uid, gid })
    return { uid, gid }
  } finally {
    if (threw && parent !== cache) {
      const owner = inferOwnerSync(parent)
      cacheToOwner.set(cache, owner)
      return owner // eslint-disable-line no-unsafe-finally
    }
  }
}

module.exports = cache => inflight(
  'inferOwner: detecting ownership of ' + cache,
  () => inferOwner(cache)
)

module.exports.sync = inferOwnerSync
