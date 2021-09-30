const Format = require('./format.js')
const jsdiff = require('diff')

class Same extends Format {
  constructor (obj, options = {}) {
    super(obj, options)
    this.expect = options.expect

    if (!options || !options.hasOwnProperty('expect'))
      throw new TypeError('Same called without expected value')

    if (options.style === 'tight')
      throw new Error('"tight" style not appropriate for diffs')

    this.provisional = !!options.provisional

    this.expectPath = (this.parent ? this.parent.expectPath : [])
      .concat([this.expect])
    this.simpleMatch(this.expect)
  }

  get expectAsArray () {
    const value = Array.isArray(this.expect) ? this.expect
      : this.isArray() ? Array.from(this.expect)
      : null

    Object.defineProperty(this, 'expectAsArray', { value })
    return value
  }

  simpleMatch () {
    this.simple = this.test()
    if (!this.simple)
      this.unmatch()
  }

  test () {
    const a = this.object
    const b = this.expect
    return (
      typeof a === 'function' && typeof b === 'function'
      ? a === b || (a.name === b.name && a.toString() === b.toString())
      : typeof a === 'symbol' || typeof b === 'symbol'
      ? typeof a === typeof b && a.toString() === b.toString()
      : typeof a !== 'object' && typeof b !== 'object' && a == b ? true
      : a === b ? true
      : a === null || b === null ? a == b
      : a !== a ? b !== b
      : typeof a !== 'object' || typeof b !== 'object' ? false
      : !this.isError() && b instanceof Error ? false
      : this.isError() && (
        b.message && b.message !== a.message ||
        b.name && b.name !== a.name) ? false
      : this.isSet() && !(new Format(b).isSet()) ? false
      : this.isMap() && !(new Format(b).isMap()) ? false
      : this.isArray() && !(new Format(b).isArray()) ? false
      : Buffer.isBuffer(a) && Buffer.isBuffer(b) ? a.equals(b)
      : a instanceof Date && b instanceof Date
        ? a.getTime() === b.getTime()
      : a instanceof RegExp && b instanceof RegExp ? this.regexpSame(a, b)
      : 'COMPLEX' // might still be a deeper mismatch, of course
    )
  }

  prefix (str, pref) {
    if (pref === '-' || pref === '+')
      this.unmatch()

    const tail = str.slice(-1) === '\n' ? '\n' : ''
    if (tail)
      str = str.slice(0, -1)
    return pref + str.split('\n').join(`\n${pref}`) + tail
  }

  prettyDiff (diff) {
    // XXX don't bother building up a +/- patch string, just keep an array
    // of expect and actual lines, so we can avoid building a string just
    // to rip it apart and turn it into a new string.  This requires
    // refactoring how parents collect diff strings from their children,
    // though, because there's a lot of `out += stuff` all over this class.
    // Also, we currently just append child nodes' print() output, and
    // rely on being able to generate the body of objects before generating
    // the head, in order to get the &ref_1 headers, so just pushing the
    // diff output up to the parent in this.prefix() won't work.  It's a
    // pretty significant refactor.
    //
    // jsdiff does a better job fragmenting and especially diffing long
    // strings.  collect up what we found, and then throw it at that.
    // It's still worthwhile to use tcompare's diff initially, though,
    // because it lets us make the diffed data more user-friendly, eg
    // when comparing a large object to a relatively small pattern.
    const re = /(.)([^\n]*)(\n|$)/g
    let expect = ''
    let actual = ''
    let match
    if (!/\n$/.test(diff))
      diff += '\n'
    while (match = re.exec(diff)) {
      const line = match[2] + match[3]
      switch (match[1]) {
        case '+':
          actual += line
          break
        case '-':
          expect += line
          break
        case ' ':
          expect += line
          actual += line
          break
        default:
          throw new Error('invalid diffline ' + JSON.stringify(match[0]))
      }
    }

    return jsdiff.createTwoFilesPatch(
      'expected',
      'actual',
      expect,
      actual,
      undefined,
      undefined,
      { context: 3 },
    ).replace(/^\=+\n/, '')
  }

  // print as a plain old Format, because super.print() will end up
  // diving into the worker methods which are overridden by design.
  // This is for when we know what we want, and don't want to dig.
  simplePrint (obj, options = {}) {
    return new Format(obj, {
      ...this.options,
      ...options,
    }).print()
  }

  print () {
    if (this.memo)
      return this.memo

    const seen = this.seen()
    const seenExpect = this.seenExpect()

    // handle top-level simple matches
    // if the're shallowly unequal, then just do the diff
    const out = !this.simple ? this.diff()
      : seen !== seenExpect ? this.diff()
      : this.simple === true
        ?  this.prefix(this.simplePrint(this.object), ' ')
      : seen ? super.print()
      : !this.parent ? this.collection()
      : `${this.printStart()}${this.collection()}${this.printEnd()}`

    return this.memo = (this.parent ? out : this.prettyDiff(out))
  }

  // if we make it into any of these, we know it's the same type
  // there's no need to ' ' out the starts if we're already going
  // to put the ' ' in front of the key, though.
  spaceIfNoPref (s) {
    return this.id ? this.prefix(s, ' ').slice(1) : this.spaceIfNoKey(s)
  }
  spaceIfNoKey (s) {
    return this.options.hasOwnProperty('key') &&
      !(this.parent.isArray() || this.parent.isSet())
      ? this.prefix(s, ' ').slice(1) : this.prefix(s, ' ')
  }
  printKey (k) {
    return this.prefix(super.printKey(k), ' ')
  }

  seenExpect () {
    if (!this.expect || typeof this.expect !== 'object')
      return false

    for (let p = this.parent; p; p = p.parent) {
      if (p.expect === this.expect) {
        p.id = p.id || p.getId()
        return p
      }
    }
    return false
  }

  nodeId () {
    const s = super.nodeId()
    return s ? this.spaceIfNoKey(s) : ''
  }

  arrayEmpty () { return this.spaceIfNoPref(super.arrayEmpty()) }
  arrayHead () { return this.spaceIfNoPref(super.arrayHead()) }
  arrayTail () { return this.prefix(super.arrayTail(), ' ') }
  setEmpty () { return this.spaceIfNoPref(super.setEmpty()) }
  setHead () { return this.spaceIfNoPref(super.setHead()) }
  setTail () { return this.prefix(super.setTail(), ' ') }
  mapEmpty () { return this.spaceIfNoPref(super.mapEmpty()) }
  mapHead () { return this.spaceIfNoPref(super.mapHead()) }
  mapTail () { return this.prefix(super.mapTail(), ' ') }
  pojoEmpty () { return this.spaceIfNoPref(super.pojoEmpty()) }
  pojoHead () { return this.spaceIfNoPref(super.pojoHead()) }
  pojoTail () { return this.prefix(super.pojoTail(), ' ') }
  errorEmpty () { return this.spaceIfNoPref(super.errorEmpty()) }
  errorHead () { return this.spaceIfNoPref(super.errorHead()) }
  errorTail () { return this.prefix(super.errorTail(), ' ') }

  // don't need a stringIsEmpty, because we will simple diff if !==
  mapIsEmpty () {
    return super.mapIsEmpty() && this.expect.size === 0
  }
  setIsEmpty () {
    return super.setIsEmpty() && this.expect.size === 0
  }
  pojoIsEmpty () {
    return super.pojoIsEmpty() && this.pojoExpectIsEmpty()
  }
  pojoExpectIsEmpty () {
    return super.pojoIsEmpty(this.expect)
  }
  arrayIsEmpty () {
    return super.arrayIsEmpty() && this.expect.length === 0
  }

  arrayBody () {
    const obj = this.objectAsArray
    const exp = this.expectAsArray

    // just need to handle extra/missing values
    if (obj.length === exp.length)
      return super.arrayBody()

    let out = ''
    let key = 0
    for (; key < obj.length && key < exp.length; key++) {
      out += this.arrayEntry(key, obj[key])
    }
    for (; key < obj.length; key++) {
      this.unmatch()
      out += this.prefix(this.simplePrint(obj[key], {
        level: this.level + 1,
        parent: this,
      }), '+')
    }
    for (; key < exp.length; key++) {
      this.unmatch()
      out += this.prefix(this.simplePrint(exp[key], {
        level: this.level + 1,
        parent: this,
      }), '-')
    }
    return out
  }

  setBody () {
    let out = ''
    const seen = new Set()
    for (const val of this.object) {
      if (this.expect.has(val)) {
        seen.add(val)
        out += this.setEntry(val)
        continue
      }

      let sawMatch = false
      for (const exp of this.expect) {
        if (seen.has(exp))
          continue

        const s = this.child(val, {
          expect: exp,
          provisional: true
        })
        const sp = s.print()
        if (s.match) {
          sawMatch = true
          seen.add(exp)
          out += sp
          break
        }
      }

      if (!sawMatch) {
        this.unmatch()
        out += this.prefix(this.simplePrint(val, {
          level: this.level + 1,
          parent: this,
        }), '+')
      }
    }

    // loop through missing keys
    for (const val of this.expect) {
      if (!seen.has(val)) {
        this.unmatch()
        out += this.prefix(this.simplePrint(val, {
          level: this.level + 1,
          parent: this,
          key: val
        }), '-')
      }
    }

    return out
  }

  mapEntry (key, val, expectKey) {
    return this.child(val, {key, expectKey}).print()
  }

  mapBody () {
    const objEnt = this.object.entries()
    let out = ''
    const seen = new Set()
    for (const [key, val] of objEnt) {
      if (this.expect.has(key)) {
        out += this.mapEntry(key, val, key)
        seen.add(key)
        continue
      }
      // try to find a matching key
      let sawMatch = false
      for (const [expkey, expval] of this.expect.entries()) {
        if (seen.has(expkey)) {
          continue
        }

        const s = this.child(key, {
          expect: expkey,
          provisional: true,
        })
        const sp = s.print()
        if (s.match) {
          sawMatch = true
          seen.add(expkey)
          out += this.mapEntry(key, val, expkey)
          break
        }
      }

      if (!sawMatch) {
        this.unmatch()
        out += this.prefix(this.simplePrint(val, {
          key,
          level: this.level + 1,
          parent: this,
        }), '+')
      }
    }

    // loop through missing keys
    for (const [key, val] of this.expect.entries()) {
      if (!seen.has(key)) {
        this.unmatch()
        out += this.prefix(this.simplePrint(val, {
          level: this.level + 1,
          parent: this,
          key,
        }), '-')
      }
    }
    return out
  }

  error () {
    if (this.errorIsEmpty())
      return this.errorEmpty()
    const b = this.errorBody()
    if (!b)
      return this.errorEmpty()

    return this.errorHead() + b + this.errorTail()
  }
  errorIsEmpty () {
    const Ctor = this.constructor
    return super.errorIsEmpty() && (
      new Ctor(this.object.name, {expect: this.expect.name}).test() &&
      new Ctor(this.object.message, {expect: this.expect.message}).test()
    )
  }
  errorBody () {
    let out = this.pojoBody()
    let objKeys = this.pojoKeys()
    let expKeys = this.pojoKeys(this.expect)
    // catch 2 often non-enumerable but very important items
    if (objKeys.indexOf('name') === -1 &&
        expKeys.indexOf('name') === -1 &&
        this.object.name) {
      out += this.pojoEntry('name', this.object.name)
    }
    if (objKeys.indexOf('message') === -1 &&
        expKeys.indexOf('message') === -1 &&
        this.object.name) {
      out += this.pojoEntry('message', this.object.message)
    }
    return out
  }

  pojoBody () {
    const objEnt = this.pojoEntries(this.object)
    const expEnt = this.pojoEntries(this.expect)
    let out = ''
    for (const [key, val] of objEnt) {
      if (key in this.expect)
        out += this.pojoEntry(key, val)
      else {
        this.unmatch()
        out += this.prefix(this.simplePrint(this.object[key], {
          level: this.level + 1,
          parent: this,
          key,
        }), '+')
      }
    }
    for (const [key, val] of expEnt) {
      if (key in this.object)
        continue
      this.unmatch()
      out += this.prefix(this.simplePrint(this.expect[key], {
        level: this.level + 1,
        parent: this,
        key,
      }), '-')
    }
    return out
  }

  diff () {
    this.unmatch()
    const expect = this.expect
    const obj = this.object
    const pexp = this.prefix(this.simplePrint(expect, {
      seen: this.seenExpect,
    }), '-')
    const texp = pexp.slice(-1) === '\n' ? '' : '\n'
    const pobj = this.prefix(this.simplePrint(obj), '+')
    const tobj = pobj.slice(-1) === '\n' ? '' : '\n'
    return `${pexp}${texp}${pobj}${tobj}`
  }

  childExpect (key) {
    const exp = this.expectAsArray
    // if we get here, we know that both expect and actual
    // are collections of the same type.  Otherwise, they
    // would have gotten the simple printed diff
    return this.isSet() ? key
      : this.isMap() ? this.expect.get(key)
      : this.isArray() ? exp[key]
      : this.expect[key]
  }

  child (obj, options, cls) {
    const expectKey = Object.prototype.hasOwnProperty
      .call(options, 'expectKey') ? options.expectKey : options.key

    return super.child(obj, {
      expect: this.childExpect(expectKey),
      ...options,
    }, cls)
  }

  unmatch () {
    if (this.match) {
      this.match = false
      if (!this.provisional)
        this.parent && this.parent.unmatch()
    }
  }

  regexpSame (a, b) {
    return a.source === b.source &&
      a.global === b.global &&
      a.multiline === b.multiline &&
      a.lastIndex === b.lastIndex &&
      a.ignoreCase === b.ignoreCase
  }
}

module.exports = Same
