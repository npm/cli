const hasIntl = typeof Intl === 'object' && !!Intl
const Collator = hasIntl && Intl.Collator
const cache = new Map()

const collatorCompare = locale => {
  const collator = new Collator(locale)
  return (a, b) => collator.compare(a, b)
}

const localeCompare = locale => (a, b) => a.localeCompare(b, locale)

module.exports = locale => {
  if (!locale || typeof locale !== 'string')
    throw new TypeError('locale required')

  if (cache.has(locale))
    return cache.get(locale)

  const compare = hasIntl ? collatorCompare(locale) : localeCompare(locale)
  cache.set(locale, compare)
  return compare
}
