// The arborist manages three trees:
// - actual
// - virtual
// - ideal
//
// The actual tree is what's present on disk in the node_modules tree
// and elsewhere that links may extend.
//
// The virtual tree is loaded from metadata (package.json and lock files).
//
// The ideal tree is what we WANT that actual tree to become.  This starts
// with the virtual tree, and then applies the options requesting
// add/remove/update actions.
//
// To reify a tree, we calculate a diff between the ideal and actual trees,
// and then turn the actual tree into the ideal tree by taking the actions
// required.  At the end of the reification process, the actualTree is
// updated to reflect the changes.
//
// Each tree has an Inventory at the root.  Shrinkwrap is tracked by Arborist
// instance.  It always refers to the actual tree, but is updated (and written
// to disk) on reification.

// reify extends buildideal, which extends actual and virtual, so that's
// the only one to pull in.  This class is just here to grab the options
// and path, and call out to the others.
const Reify = require('./reify.js')
const {resolve} = require('path')
class Arborist extends Reify(require('events')) {
  constructor (options = {}) {
    super(options)
    this.options = {
      nodeVersion: process.version,
      ...options,
      path: options.path || '.',
    }
    this.path = resolve(this.options.path)
  }
}

module.exports = Arborist
