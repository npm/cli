// class that describes a config key we know about
// this keeps us from defining a config key and not
// providing a default, description, etc.
//
// TODO: some kind of categorization system, so we can
// say "these are for registry access", "these are for
// version resolution" etc.

const { Types, getType } = require('../type-defs')
const hasOwn = (o, k) => Object.prototype.hasOwnProperty.call(o, k)

const camelCase = (k) => k.replace(/-(ssl|[a-z])/g, (...a) => a[1].toUpperCase())

class Derived {
  #set = null
  #sources = null

  get set () {
    return this.#set
  }

  get sources () {
    return [...this.#sources.values()]
  }

  constructor (key, { key: defKey, value, set, defSources, nested, sources } = {}) {
    if (defKey) {
      const camelKey = camelCase(defKey)
      this.#set = (d) => d[camelKey]
      if (sources) {
        throw new Error('Derived configs based on a key cannot have other sources')
      }
    } else if (value !== undefined) {
      this.#set = () => value
      if (sources) {
        throw new Error('Derived configs based on a value cannot have other sources')
      }
    } else if (typeof set === 'function') {
      this.#set = set
    }

    if (!this.#set) {
      throw new Error(`Invalid value for derived key ${key} set: ${set}`)
    }

    if (nested) {
      const originalFn = this.#set
      const camelKey = camelCase(key)
      this.#set = (...args) => originalFn(...args)[camelKey]
    }

    this.#sources = new Set([...(sources || []), ...defSources])
  }
}

class Definition {
  static required = ['type', 'description', 'default']
  static allowed = [
    ...Definition.required,
    'defaultDescription',
    'deprecated',
    'flatten',
    'hint',
    'short',
    'usage',
    'envExport',
  ]

  #key = null
  #def = null
  #derived = new Set()

  constructor (key, def) {
    this.#key = key
    this.#def = def

    if (def.flatten === true) {
      this.#derived.add(key)
    } else if (typeof def.flatten === 'string') {
      this.#derived.add(def.flatten)
    } else if (Array.isArray(def.flatten)) {
      for (const f of def.flatten) {
        this.#derived.add(f)
      }
    }

    // needs a key
    if (!this.#key) {
      throw new Error(`config lacks key: ${this.#key}`)
    }

    // needs required keys
    for (const req of Definition.required) {
      if (typeof req === 'string' && !this.#hasOwn(req)) {
        throw new Error(`config \`${this.#key}\` lacks required key: \`${req}\``)
      }
    }

    // only allowed fields
    for (const field of Object.keys(this.#def)) {
      if (!Definition.allowed.includes(field)) {
        throw new Error(`config defines unknown field ${field}: ${this.#key}`)
      }
    }
  }

  #hasOwn (k) {
    return hasOwn(this.#def, k)
  }

  get default () {
    return this.#def.default
  }

  get deprecated () {
    return this.#def.deprecated?.trim()?.replace(/\n +/, '\n')
  }

  get envExport () {
    // if it's set falsey, don't export it, otherwise we do by default
    return this.#def.envExport ?? true
  }

  get short () {
    return [].concat(this.#def.short)
  }

  get isBoolean () {
    return this.#typeDefs.some(t => t?.isBoolean)
  }

  get type () {
    return this.#def.type
  }

  get derived () {
    return [...this.#derived.values()]
  }

  get #types () {
    return [].concat(this.#def.type)
  }

  get #typeMultiple () {
    return this.#typeDefs.includes(Types.Array)
  }

  get #typeDefs () {
    return this.#types.map((t) => getType(t) ?? t)
  }

  get #defaultDescription () {
    return this.#def.defaultDescription ?? describeValue(this.#def.default)
  }

  get #typeDescription () {
    return this.#describeTypes()
  }

  addDerived (...keys) {
    for (const k of keys) {
      this.#derived.add(k)
    }
  }

  hasDerived (k) {
    return this.#derived.has(k)
  }

  // a textual description of this config, suitable for help output
  describe () {
    const sections = [
      ['Default', this.#defaultDescription],
      ['Type', this.#typeDescription],
      this.deprecated ? ['DEPRECATED', this.deprecated] : null,
      this.#def.description,
      !this.envExport && 'This value is not exported to the environment for child processes.',
    ].map((s) => {
      if (Array.isArray(s)) {
        return `* ${s[0]}: ${unindent(s[1])}`
      }
      return s ? unindent(s) : null
    })

    return wrapAll(`#### \`${this.key}\`\n\n${sections.filter(Boolean).join('\n')}`)
  }

  mustBe () {
    const allowMultiple = this.#typeMultiple
    const types = this.#types.includes(Types.Url) ? [Types.Url]
    // no actual configs matching this, but path types SHOULD be handled
      // this way, like URLs, for the same reason
      : /* istanbul ignore next */ this.#types.includes(Types.Path) ? [Types.Path]
      : this.#types

    const mustBe = types.filter(t => t !== Types.Array).map((t) => {
      const type = getType(t)
      return type?.description ?? type?.typeDescription ?? type
    })
    const singleValue = mustBe.length === 1

    const oneOf = singleValue && allowMultiple ? 'one or more'
      : !singleValue && allowMultiple ? 'one or more of:'
      : !singleValue ? 'one of:'
      : ''

    return `Must be ${oneOf} ${mustBe.map(describeValue).join(', ')}`.replace(/\s+/g, ' ')
  }

  describeUsage () {
    const usage = this.short.map(s => `-${s}`)

    if (this.isBoolean && this.default !== false) {
      usage.push(`--no-${this.#key}`)
    }

    usage.push(`--${this.#key}`)

    let description = []
    if (!this.isBoolean) {
      // null type means optional and doesn't currently affect usage output since
      // all non-optional params have defaults so we render everything as optional
      const valueTypes = this.#typeDefs.filter(t => t !== null && t.type !== Types.Array)

      if (valueTypes.some(t => typeof t !== 'string' && typeof t !== 'number')) {
      // Generic values, use hint
        description = this.#def.hint ? [].concat(this.#def.hint) : this.typeDefs.map(t => t?.hint)
      } else {
      // Specific values, use specifics given
        description = valueTypes
      }
    }

    const d = description.filter(Boolean).join('|')
    const usageDesc = `${usage.join('|')} ${d ? `<${d}>` : ''}`.trim()

    return this.$typeMultiple ? `${usageDesc} [${usageDesc} ...]` : usageDesc
  }

  #describeTypes () {
    const descriptions = this.#typeDefs
      .filter(t => t?.type !== Types.Array)
      .flatMap(t => t?.typeDescription ?? t)
      .map(describeValue)

    // [a] => "a"
    // [a, b] => "a or b"
    // [a, b, c] => "a, b, or c"
    // [a, Array] => "a (can be set multiple times)"
    // [a, Array, b] => "a or b (can be set multiple times)"
    const last = descriptions.length > 1 ? [descriptions.pop()] : []
    const oxford = descriptions.length > 1 ? ', or ' : ' or '
    const words = [descriptions.join(', ')].concat(last).join(oxford)
    const multiple = this.#typeMultiple ? ' (can be set multiple times)' : ''
    return `${words}${multiple}`
  }
}

// if it's a string, quote it.  otherwise, just cast to string.
const describeValue = val => (typeof val === 'string' ? JSON.stringify(val) : String(val))

const unindent = s => {
  // get the first \n followed by a bunch of spaces, and pluck off
  // that many spaces from the start of every line.
  const match = s.match(/\n +/)
  return !match ? s.trim() : s.split(match[0]).join('\n').trim()
}

const wrap = (str, { min = 20, max = 80, padding = 5, columns = process.stdout.columns } = {}) => {
  const cols = Math.min(Math.max(min, columns) || max, max) - padding
  return unindent(str)
    .split(/[ \n]+/)
    .reduce((left, right) => {
      const last = left.split('\n').pop()
      const join = last.length && last.length + right.length > cols ? '\n' : ' '
      return left + join + right
    })
}

const wrapAll = s => {
  let inCodeBlock = false
  return s.split('\n\n').map(block => {
    if (inCodeBlock || block.startsWith('```')) {
      inCodeBlock = !block.endsWith('```')
      return block
    }

    if (block.startsWith('*')) {
      return '* ' + block
        .slice(1)
        .trim()
        .split('\n* ')
        .map(li => wrap(li).replace(/\n/g, '\n  '))
        .join('\n* ')
    }

    return wrap(block)
  }).join('\n\n')
}

module.exports = { Definition, Derived, camelCase }
