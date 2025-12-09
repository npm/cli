'use strict'

/**
 * Environment Configuration Utility
 *
 * This module provides utilities for running CLI commands in different environments
 * (e.g., development, staging, production).
 *
 * Usage:
 *   npm <command> --env staging
 *   npm <command> --env production
 *   npm <command> -e dev
 *
 * Environment configs are loaded from:
 *   1. .npmrc.{env} files in the project directory
 *   2. ~/.npmrc.{env} files in the user's home directory
 *   3. Environment variables prefixed with npm_config_{env}_
 *
 * Example .npmrc.staging:
 *   registry=https://staging-registry.example.com/
 *   //staging-registry.example.com/:_authToken=${STAGING_NPM_TOKEN}
 */

var fs = require('fs')
var path = require('path')
var log = require('npmlog')

// Common environment names and their aliases
var ENV_ALIASES = {
  dev: 'development',
  prod: 'production',
  stg: 'staging',
  stage: 'staging',
  local: 'local',
  test: 'test'
}

// Resolve environment name to its canonical form
function resolveEnvName (env) {
  if (!env) return null
  var normalized = env.toLowerCase().trim()
  return ENV_ALIASES[normalized] || normalized
}

// Get the path to an environment-specific config file
function getEnvConfigPath (baseDir, env) {
  if (!env) return null
  var resolved = resolveEnvName(env)
  return path.join(baseDir, '.npmrc.' + resolved)
}

// Check if an environment config file exists
function envConfigExists (baseDir, env) {
  var configPath = getEnvConfigPath(baseDir, env)
  if (!configPath) return false
  try {
    fs.accessSync(configPath, fs.constants.R_OK)
    return true
  } catch (e) {
    return false
  }
}

// Load environment-specific config file content
function loadEnvConfig (baseDir, env, cb) {
  var configPath = getEnvConfigPath(baseDir, env)
  if (!configPath) {
    return process.nextTick(function () {
      cb(null, null)
    })
  }

  fs.readFile(configPath, 'utf8', function (err, data) {
    if (err) {
      if (err.code === 'ENOENT') {
        return cb(null, null)
      }
      return cb(err)
    }
    log.verbose('env', 'Loaded environment config from', configPath)
    cb(null, { path: configPath, data: data })
  })
}

// Get environment-specific environment variables
// Looks for npm_config_{env}_{key} pattern
function getEnvSpecificVars (env) {
  if (!env) return {}

  var resolved = resolveEnvName(env)
  var prefix = 'npm_config_' + resolved + '_'
  var vars = {}

  Object.keys(process.env)
    .filter(function (k) {
      return k.toLowerCase().startsWith(prefix.toLowerCase())
    })
    .forEach(function (k) {
      // Extract the key after the env-specific prefix
      var key = k.toLowerCase()
        .replace(prefix.toLowerCase(), '')
        .replace(/(?!^)_/g, '-')
      vars[key] = process.env[k]
    })

  return vars
}

// Validate that an environment is known/configured
function validateEnv (env, projectDir, userDir) {
  if (!env) return { valid: true, env: null }

  var resolved = resolveEnvName(env)
  var projectConfig = envConfigExists(projectDir, resolved)
  var userConfig = envConfigExists(userDir, resolved)
  var hasEnvVars = Object.keys(getEnvSpecificVars(resolved)).length > 0

  if (!projectConfig && !userConfig && !hasEnvVars) {
    log.warn('env', 'No configuration found for environment: ' + resolved)
    log.warn('env', 'Expected one of:')
    log.warn('env', '  - ' + getEnvConfigPath(projectDir, resolved))
    log.warn('env', '  - ' + getEnvConfigPath(userDir, resolved))
    log.warn('env', '  - Environment variables prefixed with npm_config_' + resolved + '_')
  }

  return {
    valid: true, // We allow running even without config
    env: resolved,
    projectConfig: projectConfig,
    userConfig: userConfig,
    hasEnvVars: hasEnvVars
  }
}

// Get information about available environments
function listAvailableEnvs (projectDir, userDir) {
  var envs = {}

  // Check project directory
  try {
    fs.readdirSync(projectDir)
      .filter(function (f) {
        return f.startsWith('.npmrc.')
      })
      .forEach(function (f) {
        var env = f.replace('.npmrc.', '')
        envs[env] = envs[env] || {}
        envs[env].projectConfig = path.join(projectDir, f)
      })
  } catch (e) {
    // Directory might not exist
  }

  // Check user directory
  try {
    fs.readdirSync(userDir)
      .filter(function (f) {
        return f.startsWith('.npmrc.')
      })
      .forEach(function (f) {
        var env = f.replace('.npmrc.', '')
        envs[env] = envs[env] || {}
        envs[env].userConfig = path.join(userDir, f)
      })
  } catch (e) {
    // Directory might not exist
  }

  return envs
}

// Create a wrapper that runs a command with environment-specific config
function withEnvConfig (env, fn) {
  return function (args, cb) {
    var resolved = resolveEnvName(env)
    if (resolved) {
      log.info('env', 'Running with environment:', resolved)
    }
    return fn(args, cb)
  }
}

// Export utilities
module.exports = {
  resolveEnvName: resolveEnvName,
  getEnvConfigPath: getEnvConfigPath,
  envConfigExists: envConfigExists,
  loadEnvConfig: loadEnvConfig,
  getEnvSpecificVars: getEnvSpecificVars,
  validateEnv: validateEnv,
  listAvailableEnvs: listAvailableEnvs,
  withEnvConfig: withEnvConfig,
  ENV_ALIASES: ENV_ALIASES
}
