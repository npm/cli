'use strict'

const nock = require('nock')

module.exports = tnock
function tnock (t, host) {
  nock.disableNetConnect()
  const server = nock(host)
  t.teardown(function () {
    nock.enableNetConnect()
    server.done()
  })
  return server
}
