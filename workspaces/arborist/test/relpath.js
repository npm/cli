const t = require('tap')

// verify that we get \ converted to / by forcing win32 path mode
const path = require('node:path')
const { win32 } = path
path.relative = win32.relative

const relpath = require('../lib/relpath.js')
t.equal(relpath('/a/b/c', '/a/b/c/d/e'), 'd/e')
t.equal(relpath('\\a\\b\\c', '\\a\\b\\c\\d\\e'), 'd/e', 'convert to /')

// Test case sensitivity fix for Windows
const originalPlatform = process.platform
Object.defineProperty(process, 'platform', {
  value: 'win32',
})

t.equal(
  relpath('C:\\project\\path', 'C:\\project\\path\\workspace'),
  'workspace',
  'uppercase C: drive'
)
t.equal(
  relpath('c:\\project\\path', 'c:\\project\\path\\workspace'),
  'workspace',
  'lowercase c: drive'
)
t.equal(
  relpath('C:\\project\\path', 'c:\\project\\path\\workspace'),
  'workspace',
  'mixed case drives'
)
t.equal(
  relpath('c:\\project\\path', 'C:\\project\\path\\workspace'),
  'workspace',
  'mixed case drives reverse'
)
// Restore original platform
Object.defineProperty(process, 'platform', {
  value: originalPlatform,
})

// Test non-Windows path to ensure 100% coverage
Object.defineProperty(process, 'platform', {
  value: 'linux',
})
t.equal(relpath('/a/b/c', '/a/b/c/d/e'), 'd/e', 'non-Windows path')

// Restore original platform again
Object.defineProperty(process, 'platform', {
  value: originalPlatform,
})
