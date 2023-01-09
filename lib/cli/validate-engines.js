// This is separate to indicate that it should contain code we expect to work in
// all versions of node >= 6.  This is a best effort to catch syntax errors to
// give users a good error message if they are using a node version that doesn't
// allow syntax we are using such as private properties, etc. This file is
// linted with ecmaVersion=6 so we don't use invalid syntax, which is set in the
// .eslintrc.local.json file

const { engines: { node: supportNode }, version } = require('../../package.json')

const wrap = (cols, lines) => lines.join(' ').split(/[ \n]+/).reduce((left, right) => {
  const last = left.split('\n').pop()
  const join = last.length && last.length + right.length > cols ? '\n' : ' '
  return left + join + right
}).trim()

module.exports = (process) => {
  const node = process.version.replace(/-.*$/, '')
  const cols = Math.min(Math.max(20, process.stdout.columns) || 80, 80)

  const unsupportedMessage = wrap(cols, [
    `npm v${version} does not support Node.js ${node}.`,
    `You should probably upgrade to a newer version of node as we can't make any`,
    `promises that npm will work with this version.`,
    `This version of npm supports the following node versions: \`${supportNode}\`.`,
    'You can find the latest version at https://nodejs.org/.',
  ])

  const brokenMessage = wrap(cols, [
    `ERROR: npm v${version} is known not to run on Node.js ${node}.`,
    `You'll need to upgrade to a newer Node.js version in order to use this version of npm.`,
    `This version of npm supports the following node versions: \`${supportNode}\`.`,
    'You can find the latest version at https://nodejs.org/.',
  ])

  // coverage ignored because this is only hit in very unsupported node versions
  // and it's a best effort attempt to show something nice in those cases
  /* istanbul ignore next */
  const syntaxErrorHandler = (err) => {
    if (err instanceof SyntaxError) {
      // eslint-disable-next-line no-console
      console.error(`${brokenMessage}\n\nERROR:`)
      // eslint-disable-next-line no-console
      console.error(err)
      return process.exit(1)
    }
    throw err
  }

  process.on('uncaughtException', syntaxErrorHandler)
  process.on('unhandledRejection', syntaxErrorHandler)

  return require('./index.js')(process, {
    node,
    npm: version,
    engines: supportNode,
    unsupportedMessage,
    off: () => {
      process.off('uncaughtException', syntaxErrorHandler)
      process.off('unhandledRejection', syntaxErrorHandler)
    },
  })
}
