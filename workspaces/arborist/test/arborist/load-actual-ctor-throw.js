const rpj = require('read-package-json-fast')
const t = require('tap')
const rpjMock = Object.assign((...args) => rpj(...args), {
  ...rpj,
  normalize: () => {
    throw new Error('boom')
  },
})
const Arborist = t.mock('../../lib/arborist', {
  'read-package-json-fast': rpjMock,
})

const { resolve } = require('node:path')
const { fixtures } = require('../fixtures/index.js')

t.test('blow up and catch error if Node ctor blows up', t => {
  // mock rpj so that we can blow up on the 'normalize' method called
  // in the Node constructor, because it's (by design) extremely hard
  // to make the ctor throw.
  const path = resolve(fixtures, 'root')
  return t.rejects(new Arborist({ path }).loadActual(), { message: 'boom' })
})
