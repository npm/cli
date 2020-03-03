'use strict'

const npm = require('./npm.js')
const fetch = require('npm-registry-fetch')
const log = require('npmlog')
const output = require('./utils/output.js')
const whoami = require('./whoami.js')

stars.usage = 'npm stars [<user>]'

const getUser = user => user ? Promise.resolve(user)
  : whoami([], true, () => {})

module.exports = stars
function stars ([user], cb) {
  const opts = npm.flatOptions
  return Promise.resolve().then(() => {
    return getUser(user).then(usr => {
      return fetch.json('/-/_view/starredByUser', {
        ...opts,
        // Note: key has to be JSON, for CouchDB legacy reasons, hence quoted
        query: {key: `"${usr}"`}
      })
    }).then(data => data.rows).then(stars => {
      if (stars.length === 0) {
        log.warn('stars', 'user has not starred any packages.')
      } else {
        stars.forEach(s => output(s.value))
      }
    })
  }).catch(err => {
    if (err.code === 'ENEEDAUTH') {
      throw Object.assign(new Error("'npm stars' on your own user account requires auth"), {
        code: 'ENEEDAUTH'
      })
    } else {
      throw err
    }
  }).then(() => cb(), cb)
}
