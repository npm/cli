/**
 * Library: Has Promise Callback
 * Makes sure that an Expression node is part of a promise
 * with callback functions (like then() or catch())
 */

'use strict'

function hasPromiseCallback(node) {
  // istanbul ignore if -- only being called within `CallExpression`
  if (node.type !== 'CallExpression') return
  if (node.callee.type !== 'MemberExpression') return
  const propertyName = node.callee.property.name
  return propertyName === 'then' || propertyName === 'catch'
}

module.exports = hasPromiseCallback
