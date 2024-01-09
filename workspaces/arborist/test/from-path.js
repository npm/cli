const t = require('tap')
const { normalizePath } = require('./fixtures/utils.js')
const fp = require('../lib/from-path.js')
const fromPath = (node, edge) => normalizePath(fp(node, edge))

t.equal(fromPath({
  realpath: '/some/path',
}), '/some/path', 'use path if no resolved spec')

t.equal(fromPath({
  realpath: '/some/path/to/directory',
  resolved: 'file:/dont/use/this',
}), '/some/path/to/directory', 'use target path if dir type')

t.equal(fromPath({
  realpath: '/some/path/to/install/target',
  resolved: 'file:/some/path/to/file.tgz',
}), '/some/path/to', 'use dirname of resolved if file type')

t.equal(fromPath({
  realpath: '/some/path/to/install/target',
  resolved: 'https://registry.com/package.tgz',
}), '/some/path/to/install/target', 'use dirname if not dir or file type')

t.equal(fromPath({
  root: {
    realpath: '/some/root',
  },
}, {
  name: 'foo',
  overrides: {
    name: 'foo',
    value: 'foo@2',
  },
}), '/some/root', 'uses root realpath for overridden edges')

t.equal(fromPath({
  sourceReference: {
    root: {
      realpath: '/some/root',
    },
  },
  realpath: '/some/red/herring',
}, {
  name: 'foo',
  overrides: {
    name: 'foo',
    value: 'foo@2',
  },
}), '/some/root', 'uses sourceReferences root realpath for overridden edges')
