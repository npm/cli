const Tracker = require('../lib/tracker.js')(class {})
const t = require('tap')

t.test('with progress', t => {
  const tr = new Tracker({ progress: true })
  t.doesNotThrow(() => {
    tr.addTracker('testTracker')
  })
  t.doesNotThrow(() => {
    tr.finishTracker('testTracker')
  })

  t.throws(() => {
    tr.addTracker()
  }, Error, `Tracker can't be null or undefined`)

  t.end()
})

t.test('adds tracker', t => {
  t.doesNotThrow(() => {
    const tr = new Tracker()
    tr.addTracker('testTracker')
  })
  t.doesNotThrow(() => {
    const tr = new Tracker()
    tr.addTracker('testTracker')
    tr.addTracker('testTracker', 'subTracker')
  })
  t.doesNotThrow(() => {
    const tr = new Tracker()
    tr.addTracker('testTracker')
    tr.addTracker('testTracker', 'subTracker')
    tr.addTracker('testTracker', 'subTracker')
  })
  t.doesNotThrow(() => {
    const tr = new Tracker()
    tr.addTracker('testTracker')
    tr.addTracker('testTracker', 'subTracker.name', 'subTracker.key')
  })

  const tr = new Tracker()
  t.throws(() => {
    tr.addTracker()
  }, Error, `Tracker can't be null or undefined`)
  t.throws(() => {
    tr.addTracker(null)
  }, Error, `Tracker can't be null or undefined`)
  t.throws(() => {
    tr.addTracker(undefined)
  }, Error, `Tracker can't be null or undefined`)

  t.throws(() => {
    tr.addTracker('testTracker')
    tr.addTracker('testTracker')
  }, Error, 'Tracker "testTracker" already exists')

  t.throws(() => {
    tr.addTracker('nonExistentTracker', 'tracker')
  },
  Error, 'Parent tracker "nonExistentTracker" does not exist')

  t.end()
})

t.test('finishes tracker', t => {
  t.doesNotThrow(() => {
    const tr = new Tracker()
    tr.addTracker('testTracker')
    tr.finishTracker('testTracker')
  })
  t.doesNotThrow(() => {
    const tr = new Tracker()
    tr.addTracker('testTracker')
    tr.addTracker('testTracker', 'subTracker')
    tr.finishTracker('testTracker', 'subTracker')
    tr.finishTracker('testTracker')
  })
  t.doesNotThrow(() => {
    const tr = new Tracker()
    tr.addTracker('testTracker')
    tr.addTracker('testTracker', 'subTracker.name', 'subTracker.key')
    tr.finishTracker('testTracker', 'subTracker.name', 'subTracker.key')
    tr.finishTracker('testTracker')
  })

  t.doesNotThrow(() => {
    const tr = new Tracker()
    tr.addTracker('firstTracker')
    tr.addTracker('secondTracker')
    tr.finishTracker('firstTracker')
    tr.finishTracker('secondTracker')
  })

  const tr = new Tracker()
  t.throws(() => {
    tr.finishTracker()
  }, Error, `Tracker can't be null or undefined`)
  t.throws(() => {
    tr.finish(null)
  }, Error, `Tracker can't be null or undefined`)
  t.throws(() => {
    tr.finish(undefined)
  }, Error, `Tracker can't be null or undefined`)

  t.doesNotThrow(() => {
    const tr = new Tracker()
    tr.addTracker('testTracker')
    tr.addTracker('testTracker', 'testChild')
    tr.finishTracker('testTracker')
  })

  t.throws(() => {
    const tr = new Tracker()
    tr.finishTracker('testTracker')
  }, Error, 'Tracker "testTracker" does not exist')

  t.doesNotThrow(() => {
    const tr = new Tracker()
    tr.addTracker('testTracker')
    tr.finishTracker('testTracker', 'nonExistentSubTracker')
  })

  t.end()
})
