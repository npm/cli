let nope = s => String(s)

export let isColorSupported = false
export let reset = nope
export let bold = nope
export let dim = nope
export let italic = nope
export let underline = nope
export let inverse = nope
export let hidden = nope
export let strikethrough = nope
export let black = nope
export let red = nope
export let green = nope
export let yellow = nope
export let blue = nope
export let magenta = nope
export let cyan = nope
export let white = nope
export let gray = nope
export let bgBlack = nope
export let bgRed = nope
export let bgGreen = nope
export let bgYellow = nope
export let bgBlue = nope
export let bgMagenta = nope
export let bgCyan = nope
export let bgWhite = nope

export function createColors() {
  return {
    isColorSupported,
    reset,
    bold,
    dim,
    italic,
    underline,
    inverse,
    hidden,
    strikethrough,
    black,
    red,
    green,
    yellow,
    blue,
    magenta,
    cyan,
    white,
    gray,
    bgBlack,
    bgRed,
    bgGreen,
    bgYellow,
    bgBlue,
    bgMagenta,
    bgCyan,
    bgWhite
  }
}
