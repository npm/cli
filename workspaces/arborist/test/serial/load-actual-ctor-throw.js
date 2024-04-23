const rpj = require('read-package-json-fast')
const t = require('tap')
const { resolve } = require('path')
const { fixtures, setup } = require('../fixtures/index.js')

setup(t)

const rpjMock = Object.assign((...args) => rpj(...args), {
  ...rpj,
  normalize: (...args) => {
    throw new Error('boom')
  },
})

const Arborist = t.mock('../../lib/arborist', {
  'read-package-json-fast': rpjMock,
})

t.test('blow up and catch error if Node ctor blows up', t => {
  // mock rpj so that we can blow up on the 'normalize' method called
  // in the Node constructor, because it's (by design) extremely hard
  // to make the ctor throw.
  const path = resolve(fixtures, 'root')
  return t.rejects(new Arborist({ path }).loadActual(), { message: 'boom' })
})
