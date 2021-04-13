import tap from './tap.js'

export const {
  Test, Spawn, Stdin,
  spawn, sub,
  todo, skip, only, test,
  stdinOnly, stdin,
  bailout,
  comment,
  timeout,
  main,
  process,
  processSubtest,
  addAssert,
  pragma,
  plan, end,
  beforeEach,
  afterEach,
  teardown,
  autoend,
  pass, fail, ok, notOk,
  emits,
  error, equal, not, same, notSame, strictSame, strictNotSame,
  testdir, fixture,
  matchSnapshot,
  hasStrict, match, notMatch, type,
  expectUncaughtException, throwsArgs, throws, doesNotThrow,
  rejects, resolves, resolveMatch, resolveMatchSnapshot
} = tap

export default tap
