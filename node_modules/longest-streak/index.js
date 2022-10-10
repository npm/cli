/**
 * Get the count of the longest repeating streak of `character` in `value`.
 *
 * @param {string} value
 *   Content to search in.
 * @param {string} character
 *   Single character to look for.
 * @returns {number}
 *   Count of most frequent adjacent `character`s in `value`.
 */
export function longestStreak(value, character) {
  const source = String(value)
  let index = source.indexOf(character)
  let expected = index
  let count = 0
  let max = 0

  if (typeof character !== 'string' || character.length !== 1) {
    throw new Error('Expected character')
  }

  while (index !== -1) {
    if (index === expected) {
      if (++count > max) {
        max = count
      }
    } else {
      count = 1
    }

    expected = index + 1
    index = source.indexOf(character, expected)
  }

  return max
}
