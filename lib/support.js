'use strict'

var npm = require('./npm.js')
var output = require('./utils/output.js')
var readPackageTree = require('read-package-tree')
var runParallelLimit = require('run-parallel-limit')
var simpleGet = require('simple-get')
var semver = require('semver')
var hasANSI = require('has-ansi')

module.exports = support

const usage = require('./utils/usage')
support.usage = usage(
  'support',
  '\nnpm support [--json]'
)

support.completion = function (opts, cb) {
  const argv = opts.conf.argv.remain

  switch (argv[2]) {
    case 'support':
      return cb(null, [])
    default:
      return cb(new Error(argv[2] + ' not recognized'))
  }
}

function support (args, silent, cb) {
  readPackageTree(npm.dir, function (error, tree) {
    if (error) return cb(error)
    var supportablePackages = Array.from(findSupportablePackages(tree))
    downloadSupportData(supportablePackages, function (error, data) {
      if (error) return cb(error)

      if (typeof cb !== 'function') {
        cb = silent
        silent = false
      }
      if (silent) return cb(null, data)

      var out
      var json = npm.config.get('json')
      if (json) {
        out = JSON.stringify(data, null, 2)
      } else {
        out = data
          .sort(function (a, b) {
            var comparison = a.name.localeCompare(b.name)
            return comparison === 0
              ? semver.compare(a.version, b.version)
              : comparison
          })
          .map(displaySupportData)
          .join('\n\n')
      }
      output(out)
      if (error) process.exitCode = 1
      cb(error, data)
    })
  })
}

function findSupportablePackages (root) {
  var set = new Set()
  iterate(root)
  return set

  function iterate (node) {
    node.children.forEach(recurse)
  }

  function recurse (node) {
    var metadata = node.package
    if (metadata.support) {
      set.add({
        name: metadata.name,
        version: metadata.version,
        homepage: metadata.homepage,
        repository: metadata.repository,
        support: metadata.support,
        parent: node.parent,
        path: node.path
      })
    }
    if (node.children) iterate(node)
  }
}

function downloadSupportData (supportablePackages, cb) {
  var cache = new Map()
  var headers = { 'user-agent': npm.config.get('user-agent') }
  runParallelLimit(supportablePackages.map(function (entry) {
    return function task (done) {
      var url = entry.support
      get(url, function (error, response, projectData) {
        if (error) {
          return done(null, {
            url: url,
            error: 'could not download data'
          })
        }
        if (typeof projectData !== 'object' || Array.isArray(projectData)) {
          return done(null, {
            url: url,
            error: 'not an object'
          })
        }
        var contributors = projectData.contributors
        if (!Array.isArray(contributors)) {
          return done(null, projectData)
        }
        runParallelLimit(contributors.map(function (contributor) {
          return function (done) {
            if (
              typeof contributor !== 'object' ||
              typeof contributor.url !== 'string'
            ) {
              return setImmediate(function () {
                done(null, contributor)
              })
            }
            get(contributor.url, function (error, response, contributorData) {
              if (error) {
                return done(null, {
                  url: contributor.url,
                  error: error
                })
              }
              contributorData.url = contributor.url
              done(null, contributorData)
            })
          }
        }), 5, function (error, resolvedContributors) {
          if (error) return done(error)
          done(null, {
            name: entry.name,
            version: entry.version,
            url: entry.support,
            homepage: entry.homepage,
            contributors: resolvedContributors
          })
        })
      })
    }
  }), 5, cb)

  function get (url, cb) {
    var cached = cache.get(url)
    if (cached) {
      return setImmediate(function () {
        cb(null, {cached: true}, cached)
      })
    }
    simpleGet.concat({
      url: url,
      json: true,
      headers: headers
    }, cb)
  }
}

function displaySupportData (entry) {
  var returned = [entry.name + '@' + entry.version]
  if (looksLikeURL(entry.homepage)) {
    returned[0] += ' (' + entry.homepage + ')'
  }
  if (Array.isArray(entry.contributors)) {
    entry.contributors.forEach(function (contributor) {
      var name = contributor.name
      if (looksLikeSafeString(name)) {
        var item = ['- ' + name]
        var email = contributor.email
        if (looksLikeSafeString(email)) {
          item[0] += ' <' + email + '>'
        }
        var homepage = contributor.homepage
        if (looksLikeURL(homepage)) {
          item[0] += ' (' + homepage + ')'
        }
        var links = contributor.links
        if (Array.isArray(links)) {
          links.forEach(function (link) {
            if (looksLikeURL(link)) item.push('  ' + link)
          })
        }
        returned.push(item.join('\n'))
      }
    })
  }
  return returned.join('\n')
}

function looksLikeSafeString (argument) {
  return (
    typeof argument === 'string' &&
    argument.length > 0 &&
    argument.length < 80 &&
    !hasANSI(argument)
  )
}

function looksLikeURL (argument) {
  return (
    looksLikeSafeString(argument) &&
    (
      argument.indexOf('https://') === 0 ||
      argument.indexOf('http://') === 0
    )
  )
}
