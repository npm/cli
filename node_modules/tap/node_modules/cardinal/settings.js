'use strict'

var path =  require('path')
var fs   =  require('fs')
var utl  =  require('./utl')
var home =  process.env.HOME
var settings

function getSettings(home_) {
  if (settings) return settings
  var settingsJson
  try {
    settingsJson = fs.readFileSync(path.join(home_ || home, '.cardinalrc'), 'utf-8')
  } catch (_) {
    // no .cardinalrc found - not a problem
    return undefined
  }
  try {
    return JSON.parse(settingsJson)
  } catch (e) {
    // Have a .cardinalrc, but something about it is wrong - warn the user
    // Coudn't parse the contained JSON
    console.error(e)
    return undefined
  }
}

// home_ mainly to be used during tests
// Resolves the preferred theme from the .cardinalrc found in the HOME directory
// If it couldn't be resolved, undefined is returned
function resolveTheme(home_) {
  var themePath
  var settings = getSettings(home_)

  if (!settings || !settings.theme) return undefined

  try {
    // allow specifying just the name of a built-in theme or a full path to a custom theme
    themePath = utl.isPath(settings.theme) ? settings.theme : path.join(__dirname, 'themes', settings.theme)

    return require(themePath)
  } catch (e) {
    // Specified theme path is invalid
    console.error(e)
    return undefined
  }
}

module.exports = {
    resolveTheme: resolveTheme
  , getSettings: getSettings
}

