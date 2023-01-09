if (require.main === module) {
  require('./lib/cli/validate-engines.js')(process)
} else {
  throw new Error('The programmatic API was removed in npm v8.0.0')
}
