let nope = s => String(s)

function createColors() {
  return {
    isColorSupported: false,
    reset: nope,
    bold: nope,
    dim: nope,
    italic: nope,
    underline: nope,
    inverse: nope,
    hidden: nope,
    strikethrough: nope,
    black: nope,
    red: nope,
    green: nope,
    yellow: nope,
    blue: nope,
    magenta: nope,
    cyan: nope,
    white: nope,
    gray: nope,
    bgBlack: nope,
    bgRed: nope,
    bgGreen: nope,
    bgYellow: nope,
    bgBlue: nope,
    bgMagenta: nope,
    bgCyan: nope,
    bgWhite: nope
  }
}

module.exports = createColors()
module.exports.createColors = createColors
