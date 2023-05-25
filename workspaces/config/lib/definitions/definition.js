// class that describes a config key we know about
// this keeps us from defining a config key and not
// providing a default, description, etc.
//
// TODO: some kind of categorization system, so we can
// say "these are for registry access", "these are for
// version resolution" etc.

const { Types, getType } = require('../type-defs')
const { Locations, LocationNames } = require('./locations')

class Definition {
  // special affordance for ssl -> SSL and tty -> TTY
  static getFlatKey = (k) => k.replace(/-(ssl|tty|[a-z])/g, (...a) => a[1].toUpperCase())

  static required = [
    'default',
    'description',
    'type',
  ]

  static allowed = [
    ...Definition.required,
    'alias',
    'defaultDescription',
    'deprecated',
    'deprecatedKey',
    'depends',
    'derived',
    'envExport',
    'exclusive',
    'flatten',
    'hint',
    'internal',
    'key',
    'location',
    'setEnv',
    'setProcess',
    'short',
    'usage',
    'value',
  ]

  #key = null
  #def = null
  #displayKey = null

  #shortKeys = []
  #aliasKeys = []
  #shorthands = []

  #getValue = []
  #flatten = []
  #dependencies = null
  #depends = []
  #location = []

  #envKeys = []
  #envEntries = []
  #processKeys = []
  #processEntries = []

  constructor (k, def) {
    this.#def = def
    this.#displayKey = k
    this.#key = this.#def.key ?? this.#displayKey

    if (this.#def.derived) {
      this.#location = [null]
      this.#flatten = [this.#key]
      this.#def.description = null
    } else if (this.#def.internal) {
      this.#location = [Locations.internal]
      this.#def.description = null
    } else {
      for (const v of toArray(this.#def.flatten)) {
        this.#flatten.push(v === true ? this.#key : v)
      }
      for (const v of toArray(this.#def.location)) {
        this.#location.push(v)
      }
      if (this.#location.length) {
        this.#location.push(Locations.builtin, Locations.default)
      } else {
        this.#location = [...LocationNames]
      }
    }

    if (typeof this.#def.value === 'function') {
      this.#getValue.push(this.#def.value)
    } else {
      if (this.#def.derived) {
        throw new Error('derived defintions must have a value function')
      }
    }

    if (!Array.isArray(this.#def.type)) {
      this.#def.type = [this.#def.type]
    }

    // if default is not set, then it is null
    if (!hasOwn(this.#def, 'default')) {
      this.#def.default = null
    }

    // always add null to types if its the default
    if (this.#def.default === null && !this.#def.type.includes(null)) {
      this.#def.type.unshift(null)
    }

    for (const typeDef of this.#typeDefs) {
      if (typeDef === undefined) {
        throw new Error(`type cannot contain \`undefined\`. `
        + `This is probably a mistake from using an incorrect key from Types.*`)
      }
      if (typeDef?.depend) {
        this.#depends = this.#depends.concat(typeDef.depend)
      }
      if (typeDef?.value) {
        this.#getValue.unshift(...toArray(typeDef.value))
      }
    }

    for (const v of toArray(this.#def.depends)) {
      this.#depends.push(v)
    }
    if (hasOwn(this.#def, 'deprecatedKey')) {
      const depKey = this.#def.deprecatedKey
      this.#depends.push(depKey)
      this.#getValue.unshift((val, obj) => {
        const depValue = obj[Definition.getFlatKey(depKey)]
        return depValue !== this.#def.default ? depValue : val
      })
    }

    if (this.#def.setEnv) {
      for (const [envKey, envValue] of Object.entries(this.#def.setEnv)) {
        this.#envKeys.push(envKey)
        this.#envEntries.push([envKey, envValue === true ? identity : envValue])
      }
    }

    if (this.#def.setProcess) {
      for (const [procKey, procValue] of Object.entries(this.#def.setProcess)) {
        this.#processKeys.push(procKey)
        this.#processEntries.push([procKey, procValue === true ? identity : procValue])
      }
    }

    // There is currently no difference between aliases and shorts but
    // they are separated to make a future upgrade path from nopt easier
    const { short = [], alias = [] } = this.#def

    if (typeof short === 'string') {
      this.#addShort(short)
    } else if (short && typeof short === 'object') {
      const isArr = Array.isArray(short)
      for (const s of isArr ? short : Object.entries(short)) {
        this.#addShort(...isArr ? [s] : s)
      }
    }

    if (typeof alias === 'string') {
      this.#addAlias(alias)
    } else if (alias && typeof alias === 'object') {
      const isArr = Array.isArray(alias)
      for (const s of isArr ? alias : Object.entries(alias)) {
        this.#addAlias(...isArr ? [s] : s)
      }
    }

    // needs a key
    if (!this.#key) {
      throw new Error(`config lacks key: ${this.#key}`)
    }

    // needs required keys
    for (const req of Definition.required) {
      if (!hasOwn(this.#def, req)) {
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

  get key () {
    return this.#key
  }

  get displayKey () {
    return this.#displayKey
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
    return this.#shortKeys
  }

  get alias () {
    return this.#aliasKeys
  }

  get shorthands () {
    return this.#shorthands
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

  get flatten () {
    return this.#flatten
  }

  get depends () {
    return this.#def.depends ?? []
  }

  get dependencies () {
    return this.#dependencies
  }

  get isDerived () {
    return !!this.#def.derived
  }

  get isInternal () {
    return !!this.#def.internal
  }

  get envKeys () {
    return this.#envKeys
  }

  get setEnv () {
    return this.#envEntries
  }

  get processKeys () {
    return this.#processKeys
  }

  get setProcess () {
    return this.#processEntries
  }

  get exclusive () {
    return !this.#def.exclusive
      ? ''
      : `\nThis config can not be used with: \`${this.#def.exclusive.join('`, `')}\``
  }

  get #typeMultiple () {
    return this.type.includes(Types.Array)
  }

  get #typeDefs () {
    return this.type.map((t) => getType(t) ?? t)
  }

  // alias and short definitions can include values so we only add them to the
  // keys if they map to the same value as using the full key would since these
  // are shown in usage
  #addShort (...args) {
    if (args.length === 1 || args[1] === true) {
      this.#shortKeys.push(args[0])
    }
    this.#addShorthand(...args)
  }

  #addAlias (...args) {
    if (args.length === 1 || args[1] === true) {
      this.#aliasKeys.push(args[0])
    }
    this.#addShorthand(...args)
  }

  #addShorthand (key, value) {
    // TODO: when we switch off of nopt, use an arg parser that supports
    // more reasonable aliasing and short opts right in the definitions set.
    // aliases where they get expanded into a completely different thing
    // these are NOT supported in the environment or npmrc files, only
    // expanded on the CLI.
    let shorthand = [`--${this.#key}`]
    if (typeof value === 'string') {
      shorthand.push(value)
    } else if (value === false) {
      shorthand = [`--no-${this.#key}`]
    }
    this.#shorthands.push([key, shorthand])
  }

  getValue (value, obj) {
    if (!this.#getValue.length) {
      return value
    }
    if (this.isDerived) {
      return this.#getValue[0](value)
    }
    return this.#getValue.reduce((a, fn) => fn(a, obj), value)
  }

  setDependencies (deps) {
    this.#dependencies = deps
  }

  isAllowed (where) {
    // if a location is specified, then it is only allowed there
    // otherwise it is allowed anywhere
    return this.#location.includes(where)
  }

  // a textual description of this config, suitable for help output
  describe () {
    const sections = [
      ['Default', this.#def.defaultDescription ?? describeValue(this.default)],
      ['Type', this.#describeTypes()],
      this.deprecated ? ['DEPRECATED', this.deprecated] : null,
      '',
      this.#def.description,
      this.exclusive,
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
      : this.type.includes(Types.Path) ? [Types.Path]
      : this.type

    const mustBe = types.filter(t => t !== Types.Array && t !== null).flatMap((t) => {
      const type = getType(t)
      return type
        ? type.values ?? type.description ?? type.typeDescription
        : describeValue(t)
    }).reduce((set, desc) => set.add(desc), new Set())

    const singleValue = mustBe.size === 1
    const oneOf = singleValue && allowMultiple ? 'one or more'
      : !singleValue && allowMultiple ? 'one or more of:'
      : !singleValue ? 'one of:'
      : ''

    return `Must be ${oneOf} ${[...mustBe].join(', ')}`.replace(/\s+/g, ' ')
  }

  describeUsage () {
    const usage = [
      ...this.short.map(s => `-${s}`),
      ...this.alias.map(s => `--${s}`),
    ]

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

const hasOwn = (o, k) => Object.prototype.hasOwnProperty.call(o, k)

const toArray = (v) => [].concat(v ?? [])

const identity = v => v

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

module.exports = Definition
