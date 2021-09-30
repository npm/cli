var compare = require('spdx-compare')
var ranges = require('spdx-ranges')

module.exports = function (first, second) {
  if (!Array.isArray(second)) throw new Error('second argument must be an Array')
  if (second.some(function (element) {
    return !element.hasOwnProperty('license')
  })) throw new Error('second argument must contain license expression AST leaves')
  if (
    !first.hasOwnProperty('license') &&
    !first.hasOwnProperty('conjunction')
  ) throw new Error('first argument must be a license expression AST')
  var terms = normalizeGPLIdentifiers(first)
  var whitelist = second.map(function (element) {
    return normalizeGPLIdentifiers(element)
  })
  return recurse(terms, whitelist)
}

var rangesAreCompatible = function (first, second) {
  return (
    first.license === second.license ||
    ranges.some(function (range) {
      return (
        licenseInRange(first.license, range) &&
        licenseInRange(second.license, range)
      )
    })
  )
}

function licenseInRange (license, range) {
  return (
    range.indexOf(license) !== -1 ||
    range.some(function (element) {
      return (
        Array.isArray(element) &&
        element.indexOf(license) !== -1
      )
    })
  )
}

var identifierInRange = function (identifier, range) {
  return (
    identifier.license === range.license ||
    compare.gt(identifier.license, range.license) ||
    compare.eq(identifier.license, range.license)
  )
}

var licensesAreCompatible = function (first, second) {
  if (first.exception !== second.exception) {
    return false
  } else if (second.hasOwnProperty('license')) {
    if (second.hasOwnProperty('plus')) {
      if (first.hasOwnProperty('plus')) {
        // first+, second+
        return rangesAreCompatible(first, second)
      } else {
        // first, second+
        return identifierInRange(first, second)
      }
    } else {
      if (first.hasOwnProperty('plus')) {
        // first+, second
        return identifierInRange(second, first)
      } else {
        // first, second
        return first.license === second.license
      }
    }
  }
}

function normalizeGPLIdentifiers (argument) {
  var license = argument.license
  if (license) {
    if (endsWith(license, '-or-later')) {
      argument.license = license.replace('-or-later', '')
      argument.plus = true
    } else if (endsWith(license, '-only')) {
      argument.license = license.replace('-or-later', '')
      delete argument.plus
    }
  } else if (argument.left && argument.right) {
    argument.left = normalizeGPLIdentifiers(argument.left)
    argument.right = normalizeGPLIdentifiers(argument.right)
  }
  return argument
}

function endsWith (string, substring) {
  return string.indexOf(substring) === string.length - 1
}

function recurse (terms, whitelist) {
  var conjunction = terms.conjunction
  if (!conjunction) {
    return whitelist.some(function (whitelisted) {
      return licensesAreCompatible(terms, whitelisted)
    })
  } else if (conjunction === 'or') {
    return recurse(terms.left, whitelist) || recurse(terms.right, whitelist)
  } else if (conjunction === 'and') {
    return recurse(terms.left, whitelist) && recurse(terms.right, whitelist)
  } else {
    throw new Error('invalid terms')
  }
}
