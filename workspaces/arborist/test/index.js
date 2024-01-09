// not much to this test, just verify exports
const t = require('tap')
const Arborist = require('../lib/index.js')
const { Node } = Arborist

t.equal(Arborist, require('../lib/arborist'), 'default esm import')
t.equal(Node, require('../lib/node.js'), 'node is exported')
t.equal(Arborist.Link, require('../lib/link.js'), 'link is exported')
t.equal(Arborist.Edge, require('../lib/edge.js'), 'edge is exported')
t.equal(Arborist.Shrinkwrap, require('../lib/shrinkwrap.js'), 'shrinkwrap is exported')
