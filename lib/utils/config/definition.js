// class that describes a config key we know about
// this keeps us from defining a config key and not
// providing a default, description, etc.
//
// TODO: some kind of categorization system, so we can
// say "these are for registry access", "these are for
// version resolution" etc.

const { TypeDefs } = require('@npmcli/config')
const { wrap, unindent } = require('../wrap')

const required = ['type', 'description', 'default']

const allowed = [
  'default',
  'defaultDescription',
  'deprecated',
  'description',
  'flatten',
  'hint',
  'short',
  'type',
  'usage',
  'envExport',
]

class Definition {
  #key = null
  #def = null

  constructor (key, def) {
    this.#key = key
    this.#def = def
    this.validate()
  }

  get default () {
    return this.#def.default
  }

  get type () {
    return this.#def.type
  }

  get deprecated () {
    return this.#def.deprecated
  }

  get envExport () {
    // if it's set falsey, don't export it, otherwise we do by default
    return this.#def.envExport ?? true
  }

  get flatten () {
    return this.#def.flatten
  }

  get derived () {
    return this.#def.derived
  }

  // get type () {
  //   return Array.isArray(this.#def.type)
  //     ? this.#def.type.map((t) => TypeDefs.getType(t) ?? t)
  //     : TypeDefs.getType(this.#def.type) ?? this.#def.type
  // }

  get hint () {
    // hint is only used for non-boolean values
    return this.#def.hint ?? `<${TypeDefs.isNumber(this.#def.type) ? 'number' : this.#key}>`
  }

  get usage () {
    return this.#def.usage ?? describeUsage({ ...this.#def, type: this.type })
  }

  get defaultDescription () {
    return this.#def.defaultDescription ?? describeValue(this.#def.default)
  }

  get typeDescription () {
    return describeTypes(this.type)
  }

  validate () {
    for (const req of required) {
      if (!Object.prototype.hasOwnProperty.call(this.#def, req)) {
        throw new Error(`config \`${this.#key}\` lacks key \`${req}\``)
      }
    }
    if (!this.#key) {
      throw new Error(`config lacks key: ${this.#key}`)
    }
    for (const field of Object.keys(this.#def)) {
      if (!allowed.includes(field)) {
        throw new Error(`config defines unknown field ${field}: ${this.#key}`)
      }
    }
  }

  // a textual description of this config, suitable for help output
  describe () {
    const noEnvExport = this.envExport
      ? ''
      : 'This value is not exported to the environment for child processes.'

    const sections = [
      ['Default', this.defaultDescription],
      ['Type', this.typeDescription],
      this.deprecated ? ['DEPRECATED', this.deprecated] : null,
      this.description,
      noEnvExport,
    ].filter(Boolean).map((s) => {
      if (Array.isArray(s)) {
        return `* ${s[0]}: ${unindent(s[1])}`
      }
      return unindent(s)
    })

    return wrapAll(`#### \`${this.key}\`\n\n${sections.join('\n')}`)
  }
}

const describeUsage = def => {
  let key = ''

  // Single type
  if (!Array.isArray(def.type)) {
    if (def.short) {
      key = `-${def.short}|`
    }

    if (TypeDefs.isBoolean(def.type) && def.default !== false) {
      key = `${key}--no-${def.key}`
    } else {
      key = `${key}--${def.key}`
    }

    if (!TypeDefs.isBoolean(def.type)) {
      key = `${key} ${def.hint}`
    }

    return key
  }

  key = `--${def.key}`
  if (def.short) {
    key = `-${def.short}|--${def.key}`
  }

  // Multiple types
  let types = def.type
  const multiple = types.includes(Array)
  const bool = TypeDefs.isBoolean(types)

  // null type means optional and doesn't currently affect usage output since
  // all non-optional params have defaults so we render everything as optional
  types = types.filter(t => t !== null && t !== Array && !TypeDefs.isBoolean(t))

  if (!types.length) {
    return key
  }

  let description
  if (!types.some(t => typeof t !== 'string')) {
    // Specific values, use specifics given
    description = `<${types.filter(d => d).join('|')}>`
  } else {
    // Generic values, use hint
    description = def.hint
  }

  if (bool) {
    // Currently none of our multi-type configs with boolean values default to
    // false so all their hints should show `--no-`, if we ever add ones that
    // default to false we can branch the logic here
    key = `--no-${def.key}|${key}`
  }

  const usage = `${key} ${description}`
  if (multiple) {
    return `${usage} [${usage} ...]`
  } else {
    return usage
  }
}

const describeTypes = types => {
  const descriptions = [].concat(types).filter(t => t !== Array).map(t => describeType(t))

  // [a] => "a"
  // [a, b] => "a or b"
  // [a, b, c] => "a, b, or c"
  // [a, Array] => "a (can be set multiple times)"
  // [a, Array, b] => "a or b (can be set multiple times)"
  const last = descriptions.length > 1 ? [descriptions.pop()] : []
  const oxford = descriptions.length > 1 ? ', or ' : ' or '
  const words = [descriptions.join(', ')].concat(last).join(oxford)
  const multiple = types.includes(Array) ? ' (can be set multiple times)' : ''
  return `${words}${multiple}`
}

const describeType = (type) => type.typeDescription || describeValue(type)

// if it's a string, quote it.  otherwise, just cast to string.
const describeValue = val => (typeof val === 'string' ? JSON.stringify(val) : String(val))

const wrapAll = s => {
  let inCodeBlock = false
  return s
    .split('\n\n')
    .map(block => {
      if (inCodeBlock || block.startsWith('```')) {
        inCodeBlock = !block.endsWith('```')
        return block
      }

      if (block.charAt(0) === '*') {
        return (
          '* ' +
          block
            .slice(1)
            .trim()
            .split('\n* ')
            .map(li => {
              return wrap(li).replace(/\n/g, '\n  ')
            })
            .join('\n* ')
        )
      } else {
        return wrap(block)
      }
    })
    .join('\n\n')
}

module.exports = Definition
