const { styleText } = require('node:util')

// npm derives its own color booleans from config + tty (see the `color`
// definition in @npmcli/config), so we bypass styleText's own stream
// detection with `validateStream: false` and force color on or off based on
// those booleans instead. `text` is coerced to a string since, unlike chalk,
// styleText throws on non-string input and callers pass numbers/Errors/etc.
const paint = (enabled, format, text) => {
  const str = String(text)
  return enabled ? styleText(format, str, { validateStream: false }) : str
}

// Returns a colorizer with the signature `(format, text) => string`. `format`
// is anything styleText accepts (a color name or an array of color names).
// Used where a single call site needs to emit both colorized and plain output
// (eg the ERESOLVE report, whose file copy is always uncolored).
const colorize = (enabled) => (format, text) => paint(enabled, format, text)

// Color state, set from the display layer once config is loaded. It lives on
// the process global rather than in module scope so it stays a single source of truth
// even when this module is duplicated across separate module registries (as
// happens under the test runner's module mocking), mirroring how the previous
// chalk instances were shared via the single npm object.
const STATE = Symbol.for('npmcli.color.state')
global[STATE] ??= { stdout: false, stderr: false }
const state = global[STATE]

const setColor = ({ stdout, stderr }) => {
  state.stdout = stdout
  state.stderr = stderr
}

// Colorize for output written to stdout / stderr respectively.
const stdout = (format, text) => paint(state.stdout, format, text)
const stderr = (format, text) => paint(state.stderr, format, text)

module.exports = {
  setColor,
  colorize,
  stdout,
  stderr,
}
