'use strict'

/**
 * Load Environment-Specific Configuration
 *
 * This module loads environment-specific configuration files
 * when the --env flag is used with npm commands.
 *
 * Configuration files are loaded from:
 *   1. {projectDir}/.npmrc.{env}
 *   2. {userDir}/.npmrc.{env}
 *   3. {envConfigDir}/.npmrc.{env} (if env-config-dir is set)
 *
 * Environment-specific configs are merged into the config chain
 * after project config but before user config.
 */

module.exports = loadEnvConfig

var fs = require('fs')
var path = require('path')
var log = require('npmlog')
var environments = require('../utils/environments')

/**
 * Load environment-specific configuration
 *
 * @param {string} env - The environment name (e.g., 'staging', 'production')
 * @param {object} options - Options object
 * @param {string} options.projectDir - Project directory path
 * @param {string} options.userDir - User home directory path
 * @param {string} [options.envConfigDir] - Optional custom env config directory
 * @param {function} cb - Callback(err, configData)
 */
function loadEnvConfig (env, options, cb) {
  if (!env) {
    return process.nextTick(function () {
      cb(null, null)
    })
  }

  var resolvedEnv = environments.resolveEnvName(env)
  if (!resolvedEnv) {
    return process.nextTick(function () {
      cb(null, null)
    })
  }

  log.verbose('env', 'Loading configuration for environment:', resolvedEnv)

  var configPaths = []

  // Add custom env config directory if specified
  if (options.envConfigDir) {
    configPaths.push(path.join(options.envConfigDir, '.npmrc.' + resolvedEnv))
  }

  // Add project-level env config
  if (options.projectDir) {
    configPaths.push(path.join(options.projectDir, '.npmrc.' + resolvedEnv))
  }

  // Add user-level env config
  if (options.userDir) {
    configPaths.push(path.join(options.userDir, '.npmrc.' + resolvedEnv))
  }

  // Try to load from each path in order, using first found
  findFirstConfig(configPaths, function (err, result) {
    if (err) return cb(err)

    if (result) {
      log.info('env', 'Using environment config from:', result.path)
    } else {
      log.verbose('env', 'No environment config file found for:', resolvedEnv)
      log.verbose('env', 'Searched paths:', configPaths.join(', '))
    }

    // Also load environment-specific environment variables
    var envVars = environments.getEnvSpecificVars(resolvedEnv)
    var envVarCount = Object.keys(envVars).length
    if (envVarCount > 0) {
      log.verbose('env', 'Found', envVarCount, 'environment-specific variables')
    }

    cb(null, {
      env: resolvedEnv,
      config: result,
      envVars: envVars
    })
  })
}

/**
 * Find the first existing config file from a list of paths
 */
function findFirstConfig (paths, cb) {
  if (paths.length === 0) {
    return cb(null, null)
  }

  var currentPath = paths[0]
  var remainingPaths = paths.slice(1)

  fs.readFile(currentPath, 'utf8', function (err, data) {
    if (err) {
      if (err.code === 'ENOENT') {
        // File doesn't exist, try next path
        return findFirstConfig(remainingPaths, cb)
      }
      return cb(err)
    }

    // Found a config file
    cb(null, {
      path: currentPath,
      data: data
    })
  })
}

/**
 * Parse environment config file content
 * Returns an object with key-value pairs
 */
loadEnvConfig.parse = function parseEnvConfig (data) {
  if (!data) return {}

  var config = {}
  var lines = data.split(/\r?\n/)

  lines.forEach(function (line) {
    // Skip comments and empty lines
    line = line.trim()
    if (!line || line.startsWith('#') || line.startsWith(';')) {
      return
    }

    // Parse key=value pairs
    var eqIndex = line.indexOf('=')
    if (eqIndex > 0) {
      var key = line.substring(0, eqIndex).trim()
      var value = line.substring(eqIndex + 1).trim()

      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }

      config[key] = value
    }
  })

  return config
}

/**
 * Get environment information for display
 */
loadEnvConfig.getEnvInfo = function getEnvInfo (env, options) {
  var resolvedEnv = environments.resolveEnvName(env)
  if (!resolvedEnv) return null

  var info = {
    name: resolvedEnv,
    configPaths: []
  }

  if (options.envConfigDir) {
    var customPath = path.join(options.envConfigDir, '.npmrc.' + resolvedEnv)
    info.configPaths.push({
      path: customPath,
      exists: environments.envConfigExists(options.envConfigDir, resolvedEnv),
      type: 'custom'
    })
  }

  if (options.projectDir) {
    var projectPath = path.join(options.projectDir, '.npmrc.' + resolvedEnv)
    info.configPaths.push({
      path: projectPath,
      exists: environments.envConfigExists(options.projectDir, resolvedEnv),
      type: 'project'
    })
  }

  if (options.userDir) {
    var userPath = path.join(options.userDir, '.npmrc.' + resolvedEnv)
    info.configPaths.push({
      path: userPath,
      exists: environments.envConfigExists(options.userDir, resolvedEnv),
      type: 'user'
    })
  }

  info.envVars = environments.getEnvSpecificVars(resolvedEnv)

  return info
}
