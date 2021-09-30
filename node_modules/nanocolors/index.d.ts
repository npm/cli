export type Color = (text: string | number) => string

export interface Colors {
  isColorSupported: boolean
  reset: Color
  bold: Color
  dim: Color
  italic: Color
  underline: Color
  inverse: Color
  hidden: Color
  strikethrough: Color
  black: Color
  red: Color
  green: Color
  yellow: Color
  blue: Color
  magenta: Color
  cyan: Color
  white: Color
  gray: Color
  bgBlack: Color
  bgRed: Color
  bgGreen: Color
  bgYellow: Color
  bgBlue: Color
  bgMagenta: Color
  bgCyan: Color
  bgWhite: Color
}

export const isColorSupported: boolean
export function createColors(enabled?: boolean): Colors
export const reset: Color
export const bold: Color
export const dim: Color
export const italic: Color
export const underline: Color
export const inverse: Color
export const hidden: Color
export const strikethrough: Color
export const black: Color
export const red: Color
export const green: Color
export const yellow: Color
export const blue: Color
export const magenta: Color
export const cyan: Color
export const white: Color
export const gray: Color
export const bgBlack: Color
export const bgRed: Color
export const bgGreen: Color
export const bgYellow: Color
export const bgBlue: Color
export const bgMagenta: Color
export const bgCyan: Color
export const bgWhite: Color
