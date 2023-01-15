// class that describes a config key we know about
// this keeps us from defining a config key and not
// providing a default, description, etc.
//
// TODO: some kind of categorization system, so we can
// say "these are for registry access", "these are for
// version resolution" etc.

const { Types, getType } = require('./type-defs')
const hasOwn = (o, k) => Object.prototype.hasOwnProperty.call(o, k)

// special affordance for ssl -> SSL
const getFlatKey = (k) => k.replace(/-(ssl|[a-z])/g, (...a) => a[1].toUpperCase())

class Derived {
  #get = null
  #flatKey = null
  #sources = null

  get get () {
    return this.#get
  }

  get sources () {
    return [...this.#sources.values()]
  }

  get flatKey () {
    return this.#flatKey
  }

  constructor (key, { key: defKey, value, get, defSources, nested, sources } = {}) {
    this.#flatKey = getFlatKey(key)

    if (defKey) {
      const defFlatKey = getFlatKey(defKey)
      this.#get = (d) => d[defFlatKey]
      if (sources) {
        throw new Error('Derived configs based on a key cannot have other sources')
      }
    } else if (value !== undefined) {
      this.#get = () => value
      if (sources) {
        throw new Error('Derived configs based on a value cannot have other sources')
      }
    } else if (typeof get === 'function') {
      this.#get = get
    }

    if (!this.#get) {
      throw new Error(`Invalid value for derived key ${key} get: ${get}`)
    }

    if (nested) {
      const originalFn = this.#get
      this.#get = (...args) => originalFn(...args)[this.#flatKey]
    }

    this.#sources = new Set([key, ...(sources || []), ...defSources])
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
    'location',
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
    } else if (
      Array.isArray(def.flatten) &&
      def.flatten.every(f => f === true || typeof f === 'string')
    ) {
      for (const f of def.flatten) {
        this.#derived.add(f)
      }
    } else if (def.flatten) {
      throw new Error('flatten must be true, a string or an array of those values')
    }

    if (!Array.isArray(this.#def.type)) {
      this.#def.type = [this.#def.type]
    }

    // always add null to types if its the default
    if (this.#def.default === null && !this.#def.type.includes(null)) {
      this.#def.type.unshift(null)
    }

    // needs a key
    if (!this.#key) {
      throw new Error(`config lacks key: ${this.#key}`)
    }

    // needs required keys
    for (const req of Definition.required) {
      if (typeof req === 'string' && !hasOwn(this.#def, req)) {
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
    return [].concat(this.#def.short ?? [])
  }

  get isBoolean () {
    return this.#typeDefs.some(t => t?.isBoolean || typeof t === 'boolean')
  }

  get hasNonBoolean () {
    return this.#typeDefs.some(t => !(t?.isBoolean || typeof t === 'boolean'))
  }

  get type () {
    return this.#def.type
  }

  get derived () {
    return [...this.#derived.values()]
  }

  get location () {
    return [].concat(this.#def.location ?? [])
  }

  addDerived (...keys) {
    for (const k of keys) {
      this.#derived.add(k)
    }
  }

  hasDerived (k) {
    return this.#derived.has(k)
  }

  get #typeMultiple () {
    return this.type.includes(Types.Array)
  }

  get #typeDefs () {
    return this.type.map((t) => getType(t) ?? t)
  }

  // a textual description of this config, suitable for help output
  describe () {
    const sections = [
      ['Default', this.#def.defaultDescription ?? describeValue(this.default)],
      ['Type', this.#describeTypes()],
      this.deprecated ? ['DEPRECATED', this.deprecated] : null,
      '',
      this.#def.description,
      ...(this.envExport ? [] : ['',
        'This value is not exported to the environment for child processes.',
      ]),
    ].map((s) => {
      if (Array.isArray(s)) {
        return `* ${s[0]}: ${unindent(s[1])}`
      }
      return typeof s === 'string' ? unindent(s) : null
    })

    return wrapAll(`#### \`${this.#key}\`\n\n${sections.filter(v => v != null).join('\n')}`)
  }

  invalidUsage () {
    const allowMultiple = this.#typeMultiple
    const types = this.type.includes(Types.URL) ? [Types.URL]
      // no actual configs matching this, but path types SHOULD be handled
      // this way, like URLs, for the same reason
      : /* istanbul ignore next */ this.type.includes(Types.Path) ? [Types.Path]
      : this.type

    const mustBe = types.filter(t => t !== Types.Array && t !== null).flatMap((t) => {
      const type = getType(t)
      return type
        ? type.values ?? type.description ?? type.typeDescription
        : describeValue(t)
    })

    const singleValue = mustBe.length === 1
    const oneOf = singleValue && allowMultiple ? 'one or more'
      : !singleValue && allowMultiple ? 'one or more of:'
      : !singleValue ? 'one of:'
      : ''

    return `Must be ${oneOf} ${mustBe.join(', ')}`.replace(/\s+/g, ' ')
  }

  describeUsage () {
    const usage = this.short.map(s => `-${s}`)

    if (this.isBoolean) {
      if (this.default === true) {
        usage.push(`--no-${this.#key}`)
      } else if (this.default === false) {
        usage.push(`--${this.#key}`)
      } else {
        usage.push(`--no-${this.#key}`, `--${this.#key}`)
      }
    } else {
      usage.push(`--${this.#key}`)
    }

    let descriptions = []
    if (this.hasNonBoolean) {
      // only non booleans get hints
      if (this.#def.hint) {
        // if the definition itself has a hint, always use that
        descriptions = [].concat(this.#def.hint)
      } else {
        // otherwise use the types specific values, or the hint, or the value itself
        descriptions = this.#typeDefs
          // null type means optional and doesn't currently affect usage output since
          // all non-optional params have defaults so we render everything as optional
          .filter(t => t !== null && t.type !== Types.Array)
          .flatMap(t => t?.hint ?? (t.type ? this.#key : t))
      }
    }

    const desc = descriptions.filter(Boolean).join('|')
    const usageDesc = `${usage.join('|')} ${desc ? `<${desc}>` : ''}`.trim()

    return this.#typeMultiple ? `${usageDesc} [${usageDesc} ...]` : usageDesc
  }

  #describeTypes () {
    const descriptions = this.#typeDefs
      .filter(t => t?.type !== Types.Array)
      .flatMap(t => t?.typeDescription ?? t?.values ?? JSON.stringify(t))

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
const describeValue = val => Array.isArray(val)
  ? JSON.stringify(val.map(describeValue))
  : typeof val === 'string' ? JSON.stringify(val) : String(val)

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

module.exports = { Definition, Derived, getFlatKey }
