const Arborist = require('@npmcli/arborist')
const { version } = require('../../../../package.json')

// These are default values that cannot be overridden at any other level so they
// are defined here instead of definitions since we do not want to document them
// but they should still be applied to flat options, and derived configs can depend
// on them unlike other derived configs.

const value = (key, v) => module.exports[key] = v

value('npm-command', '')
value('npm-args', [])
value('npm-version', version)

// the Arborist constructor is used almost everywhere we call pacote, it's
// easiest to attach it to flatOptions so it goes everywhere without having
// to touch every call
value('Arborist', Arborist)

// XXX should this be sha512?  is it even relevant?
value('hash-algorithm', 'sha1')
