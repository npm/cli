'use strict'

const nock = require('nock')

module.exports = tnock
function tnock (t, host) {
  const server = nock(host)
  nock.disableNetConnect()
  t.teardown(function () {
    nock.enableNetConnect()
    server.done()
  })
  return server
}
