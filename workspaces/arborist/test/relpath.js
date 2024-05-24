const t = require('tap')

// verify that we get \ converted to / by forcing win32 path mode
const path = require('node:path')
const { win32 } = path
path.relative = win32.relative

const relpath = require('../lib/relpath.js')
t.equal(relpath('/a/b/c', '/a/b/c/d/e'), 'd/e')
t.equal(relpath('\\a\\b\\c', '\\a\\b\\c\\d\\e'), 'd/e', 'convert to /')
