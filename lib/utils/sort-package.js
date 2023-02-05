/**
 * This is a pure function that creates a new object with keys from
 * the parameter, in sorted order.
 * @param {object} originalObject The keys are pulled from this object.
 * @returns a new object with the same keys as the parameter,
 * except in sorted order
 */
const createObjectjWithSortedKeys = (originalObject) => {
  const keys = Object.keys(originalObject)
  keys.sort()
  const objectWithSortedKeys = {}
  for (const key of keys) {
    objectWithSortedKeys[key] = originalObject[key]
  }
  return objectWithSortedKeys
}

module.exports = createObjectjWithSortedKeys
