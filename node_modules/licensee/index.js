module.exports = licensee

var blueOakList = require('@blueoak/list')
var correctLicenseMetadata = require('correct-license-metadata')
var has = require('has')
var npmLicenseCorrections = require('npm-license-corrections')
var osi = require('spdx-osi')
var parse = require('spdx-expression-parse')
var parseJSON = require('json-parse-errback')
var readPackageTree = require('read-package-tree')
var runParallel = require('run-parallel')
var satisfies = require('semver').satisfies
var simpleConcat = require('simple-concat')
var spawn = require('child_process').spawn
var spdxWhitelisted = require('spdx-whitelisted')

function licensee (configuration, path, callback) {
  if (!validConfiguration(configuration)) {
    return callback(new Error('Invalid configuration'))
  }
  configuration.licenses = compileLicenseWhitelist(configuration)
  configuration.licensesParsed = (configuration.licenses || [])
    .reduce(function (whitelist, element) {
      try {
        var parsed = parse(element)
        if (has(parsed, 'conjunction')) {
          throw new Error('Cannot match against "' + JSON.stringify(element) + '".')
        }
        return whitelist.concat(parsed)
      } catch (e) {
        return whitelist
      }
    }, [])
  if (
    configuration.licenses.length === 0 &&
    (!configuration.packages || Object.keys(configuration.packages).length === 0)
  ) {
    callback(new Error('No licenses or packages whitelisted.'))
  } else {
    if (configuration.productionOnly) {
      // In order to ignore devDependencies, we need to read:
      //
      // 1. the dependencies-only dependency graph, from
      //    `npm ls --json --production`
      //
      // 2. the structure of `node_modules` and `package.json`
      //    files within it, with read-package-tree.
      //
      // `npm ls` calls read-package-tree internally, but does
      // lots of npm-specific post-processing to produce the
      // dependency tree.  Calling read-package-tree twice, at
      // the same time, is far from efficient.  But it works,
      // and doing so helps keep this package small.
      runParallel({
        dependencies: readDependencyList,
        packages: readFilesystemTree
      }, function (error, trees) {
        if (error) callback(error)
        else withTrees(trees.packages, trees.dependencies)
      })
    } else {
      // If we are analyzing _all_ installed dependencies,
      // and don't care whether they're devDependencies
      // or not, just read `node_modules`.  We don't need
      // the dependency graph.
      readFilesystemTree(function (error, packages) {
        if (error) callback(error)
        else {
          if (configuration.filterPackages) {
            packages = configuration.filterPackages(packages)
          }
          withTrees(packages, false)
        }
      })
    }
  }

  function withTrees (packages, dependencies) {
    callback(null, findIssues(
      configuration, packages, dependencies, []
    ))
  }

  function readDependencyList (done) {
    var executable = process.platform === 'win32' ? 'npm.cmd' : 'npm'
    var child = spawn(
      executable, ['ls', '--production', '--json'], { cwd: path }
    )
    var outputError
    var json
    simpleConcat(child.stdout, function (error, buffer) {
      if (error) outputError = error
      else json = buffer
    })
    child.once('error', function (error) {
      outputError = error
    })
    child.once('close', function (code) {
      if (outputError) {
        done(outputError)
      } else {
        if (code !== 0) console.error('Warning: npm exited with status ' + code)

        parseJSON(json, function (error, graph) {
          if (error) return done(error)
          if (!has(graph, 'dependencies')) {
            done(new Error('cannot interpret npm ls --json output'))
          } else {
            var flattened = {}
            flattenDependencyTree(graph.dependencies, flattened)
            done(null, flattened)
          }
        })
      }
    })
  }

  function readFilesystemTree (done) {
    readPackageTree(path, function (error, tree) {
      if (error) return done(error)
      done(null, tree.children)
    })
  }
}

var KEY_PREFIX = '.'

function flattenDependencyTree (graph, object) {
  Object.keys(graph).forEach(function (name) {
    var node = graph[name]
    var version = node.version
    var key = KEY_PREFIX + name
    if (
      has(object, key) &&
      object[key].indexOf(version) === -1
    ) {
      object[key].push(version)
    } else {
      object[key] = [version]
    }
    if (has(node, 'dependencies')) {
      flattenDependencyTree(node.dependencies, object)
    }
  })
}

function validConfiguration (configuration) {
  return (
    isObject(configuration) &&
    has(configuration, 'licenses') &&
    isObject(configuration.licenses) &&
    has(configuration, 'packages')
      ? (
        // Validate `packages` property.
        isObject(configuration.packages) &&
        Object.keys(configuration.packages)
          .every(function (key) {
            return isString(configuration.packages[key])
          })
      ) : true
  )
}

function isObject (argument) {
  return argument && typeof argument === 'object'
}

function isString (argument) {
  return typeof argument === 'string'
}

function findIssues (configuration, children, dependencies, results) {
  if (Array.isArray(children)) {
    children.forEach(function (child) {
      if (
        !configuration.productionOnly ||
        appearsIn(child, dependencies)
      ) {
        var result = resultForPackage(configuration, child)
        // Deduplicate.
        var existing = results.find(function (existing) {
          return (
            existing.name === result.name &&
            existing.version === result.version
          )
        })
        if (existing) {
          if (existing.duplicates) {
            existing.duplicates.push(result)
          } else {
            existing.duplicates = [result]
          }
        } else {
          results.push(result)
        }
        findIssues(configuration, child, dependencies, results)
      }
      if (child.children) {
        findIssues(configuration, child.children, dependencies, results)
      }
    })
    return results
  } else return results
}

function appearsIn (installed, dependencies) {
  var name = installed.package.name
  var key = KEY_PREFIX + name
  var version = installed.package.version
  return (
    has(dependencies, key) &&
    dependencies[key].indexOf(version) !== -1
  )
}

function resultForPackage (configuration, tree) {
  var packageWhitelist = configuration.packages || {}
  var result = {
    name: tree.package.name,
    license: tree.package.license,
    author: tree.package.author,
    contributors: tree.package.contributors,
    repository: tree.package.repository,
    homepage: tree.package.homepage,
    version: tree.package.version,
    parent: tree.parent,
    path: tree.path
  }

  // Find and apply any manual license metadata correction.
  var manualCorrection = (
    configuration.corrections &&
    npmLicenseCorrections.find(function (correction) {
      return (
        correction.name === result.name &&
        correction.version === result.version
      )
    })
  )
  if (manualCorrection) {
    result.license = manualCorrection.license
    result.corrected = 'manual'
  }

  // Find and apply any automatic license metadata correction.
  var automaticCorrection = (
    configuration.corrections &&
    correctLicenseMetadata(tree.package)
  )
  if (automaticCorrection) {
    result.license = automaticCorrection
    result.corrected = 'automatic'
  }

  // Check if ignored.
  var ignore = configuration.ignore
  if (ignore && Array.isArray(ignore)) {
    var ignored = ignore.some(function (ignore) {
      if (typeof ignore !== 'object') return false
      if (
        ignore.prefix &&
        typeof ignore.prefix === 'string' &&
        startsWith(result.name, ignore.prefix)
      ) return true
      if (
        ignore.scope &&
        typeof ignore.scope === 'string' &&
        startsWith(result.name, '@' + ignore.scope + '/')
      ) return true
      if (
        ignore.author &&
        typeof ignore.author === 'string' &&
        personMatches(result.author, ignore.author)
      ) return true
      return false
    })
    if (ignored) {
      result.approved = true
      result.ignored = ignored
      return result
    }
  }

  result.approved = false

  var packageWhitelisted = Object.keys(packageWhitelist)
    .some(function (name) {
      return (
        result.name === name &&
        satisfies(result.version, packageWhitelist[name]) === true
      )
    })
  if (packageWhitelisted) {
    result.approved = true
    result.package = true
    return result
  }

  if (!result.license || typeof result.license !== 'string') {
    return result
  }

  var validSPDX = true
  var parsed
  try {
    parsed = parse(result.license)
  } catch (e) {
    validSPDX = false
  }

  var licenseWhitelist = configuration.licensesParsed
  // Check against licensing rule.
  var licenseWhitelisted = (
    validSPDX &&
    spdxWhitelisted(parsed, licenseWhitelist)
  )
  if (licenseWhitelisted) {
    result.approved = true
  }

  return result
}

function startsWith (string, prefix) {
  return string.toLowerCase().indexOf(prefix.toLowerCase()) === 0
}

function personMatches (person, string) {
  if (!person) return false
  if (typeof person === 'string') {
    return contains(person, string)
  }
  if (typeof person === 'object') {
    if (matches('name')) return true
    if (matches('email')) return true
    if (matches('url')) return true
  }
  return false

  function matches (key) {
    return (
      person[key] &&
      typeof person[key] === 'string' &&
      contains(person[key], string)
    )
  }
}

function contains (string, substring) {
  return string.toLowerCase().indexOf(substring.toLowerCase()) !== -1
}

function licensesFromBlueOak (rating) {
  rating = rating.toLowerCase()
  var ids = []
  for (var index = 0; index < blueOakList.length; index++) {
    var element = blueOakList[index]
    element.licenses.forEach(function (license) {
      try {
        parse(license.id)
        ids.push(license.id)
      } catch (e) {
        // pass
      }
    })
    if (rating === element.name.toLowerCase()) break
  }
  return ids
}

function compileLicenseWhitelist (configuration) {
  var licenses = configuration.licenses
  var whitelist = []
  var spdx = licenses.spdx
  if (spdx) pushMissing(spdx, whitelist)
  var blueOak = licenses.blueOak
  if (blueOak) pushMissing(licensesFromBlueOak(blueOak), whitelist)
  if (licenses.osi) pushMissing(osi, whitelist)
  return whitelist
}

function pushMissing (source, sink) {
  source.forEach(function (element) {
    if (sink.indexOf(element) === -1) sink.push(element)
  })
}
