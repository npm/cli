if (require.main === module) {
  require('./lib/cli.js')(process)
} else {
  throw new Error('The programmatic API was removed in npm V8.0.0')
}
