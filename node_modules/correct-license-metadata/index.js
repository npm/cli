var spdxExpressionValidate = require('spdx-expression-validate')

module.exports = function (metadata) {
  if (typeof metadata !== 'object') throw new Error('argument must be an object')

  var singular = metadata.license
  var plural = metadata.licenses

  var conclusionFromSingular = singular && conclusionFrom(singular)
  var conclusionFromPlural = plural && conclusionFrom(plural)

  // If `package.json` has both `license` and `licenses`.
  if (singular && plural) {
    if (conclusionFromSingular === conclusionFromPlural) {
      return conclusionFromSingular
    }
    return false
  }

  if (conclusionFromSingular) return conclusionFromSingular
  if (conclusionFromPlural) return conclusionFromPlural

  return false
}

function conclusionFrom (argument) {
  var unambiguous, firstElement, fromObject

  if (typeof argument === 'string') {
    if (isValidExpression(argument)) return argument
    unambiguous = getUnambiguousCorrection(argument)
    if (unambiguous) return unambiguous
  }

  if (isOneElementArray(argument)) {
    firstElement = argument[0]
    if (isValidExpression(firstElement)) return firstElement
    if (typeof firstElement === 'object') {
      fromObject = conclusionFromObject(firstElement)
      if (fromObject) return fromObject
    }
  }

  if (typeof argument === 'object') {
    fromObject = conclusionFromObject(argument)
    if (fromObject) return fromObject
  }

  return false
}

function conclusionFromObject (object) {
  var type = object.type
  if (isValidExpression(type)) return type
  var license = object.license
  if (isValidExpression(license)) return license
  var unambiguous = getUnambiguousCorrection(type)
  if (unambiguous) return unambiguous
  return false
}

function getUnambiguousCorrection (argument) {
  if (argument === 'Apache, Version 2.0') return 'Apache-2.0'
  if (argument === 'Apache License, Version 2.0') return 'Apache-2.0'
  if (argument === 'Apache License 2.0') return 'Apache-2.0'
  if (argument === 'Apache 2.0') return 'Apache-2.0'
  if (argument === 'Apache 2') return 'Apache-2.0'
  if (argument === 'Apache2') return 'Apache-2.0'
  if (argument === 'Apache v2') return 'Apache-2.0'
  if (argument === 'MIT/X11') return 'MIT'
  if (argument === 'LGPL 3') return 'LGPL-3.0'
  if (argument === 'The MIT License') return 'MIT'
  if (argument === 'MIT License') return 'MIT'
  if (argument === 'MIT +no-false-attribs') return 'MITNFA'
  if (argument === 'BSD-3') return 'BSD-3-Clause'
  if (argument === 'BSD 3-Clause') return 'BSD-3-Clause'
  if (argument === 'MPL 2.0') return 'MPL-2.0'
  return false
}

function isValidExpression (argument) {
  return typeof argument === 'string' && spdxExpressionValidate(argument)
}

function isOneElementArray (argument) {
  return Array.isArray(argument) && argument.length === 1
}
