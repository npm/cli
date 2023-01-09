const abbrev = require('abbrev')
const localeCompare = require('@isaacs/string-locale-compare')('en')

// plumbing should not have any aliases
const aliases = {

  // aliases
  author: 'owner',
  home: 'docs',
  issues: 'bugs',
  info: 'view',
  show: 'view',
  find: 'search',
  add: 'install',
  unlink: 'uninstall',
  remove: 'uninstall',
  rm: 'uninstall',
  r: 'uninstall',

  // short names for common things
  un: 'uninstall',
  rb: 'rebuild',
  list: 'ls',
  ln: 'link',
  create: 'init',
  i: 'install',
  it: 'install-test',
  cit: 'install-ci-test',
  up: 'update',
  c: 'config',
  s: 'search',
  se: 'search',
  tst: 'test',
  t: 'test',
  ddp: 'dedupe',
  v: 'view',
  run: 'run-script',
  'clean-install': 'ci',
  'clean-install-test': 'cit',
  x: 'exec',
  why: 'explain',
  la: 'll',
  verison: 'version',
  ic: 'ci',

  // typos
  innit: 'init',
  // manually abbrev so that install-test doesn't make insta stop working
  in: 'install',
  ins: 'install',
  inst: 'install',
  insta: 'install',
  instal: 'install',
  isnt: 'install',
  isnta: 'install',
  isntal: 'install',
  isntall: 'install',
  'install-clean': 'ci',
  'isntall-clean': 'ci',
  hlep: 'help',
  'dist-tags': 'dist-tag',
  upgrade: 'update',
  udpate: 'update',
  rum: 'run-script',
  sit: 'cit',
  urn: 'run-script',
  ogr: 'org',
  'add-user': 'adduser',
}

// these are filenames in lib/commands
const commands = [
  'access',
  'adduser',
  'audit',
  'bugs',
  'cache',
  'ci',
  'completion',
  'config',
  'dedupe',
  'deprecate',
  'diff',
  'dist-tag',
  'docs',
  'doctor',
  'edit',
  'exec',
  'explain',
  'explore',
  'find-dupes',
  'fund',
  'get',
  'help',
  'hook',
  'init',
  'install',
  'install-ci-test',
  'install-test',
  'link',
  'll',
  'login', // This is an alias for `adduser` but it can be confusing
  'logout',
  'ls',
  'org',
  'outdated',
  'owner',
  'pack',
  'ping',
  'pkg',
  'prefix',
  'profile',
  'prune',
  'publish',
  'query',
  'rebuild',
  'repo',
  'restart',
  'root',
  'run-script',
  'search',
  'set',
  'shrinkwrap',
  'star',
  'stars',
  'start',
  'stop',
  'team',
  'test',
  'token',
  'uninstall',
  'unpublish',
  'unstar',
  'update',
  'version',
  'view',
  'whoami',
].sort(localeCompare)

const plumbing = ['help-search']
const allCommands = [...commands, ...plumbing].sort(localeCompare)
const abbrevs = abbrev(commands.concat(Object.keys(aliases)))

const deref = (c) => {
  if (!c) {
    return
  }
  if (c.match(/[A-Z]/)) {
    c = c.replace(/([A-Z])/g, m => '-' + m.toLowerCase())
  }
  if (plumbing.includes(c)) {
    return c
  }
  // first deref the abbrev, if there is one
  // then resolve any aliases
  // so `npm install-cl` will resolve to `install-clean` then to `ci`
  let a = abbrevs[c]
  while (aliases[a]) {
    a = aliases[a]
  }
  return a
}

module.exports = {
  deref,
  abbrevs,
  aliases,
  commands,
  plumbing,
  allCommands,
}
