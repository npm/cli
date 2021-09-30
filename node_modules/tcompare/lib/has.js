const Same = require('./same.js')
const Format = require('./format.js')
class Has extends Same {
  arrayBody () {
    const obj = this.objectAsArray
    const exp = this.expectAsArray

    if (obj.length === exp.length)
      return super.arrayBody()

    // only need to handle missing values, not extra ones
    let out = ''
    let key = 0
    for (; key < obj.length && key < exp.length; key++) {
      out += this.arrayEntry(key, obj[key])
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

  isArray () {
    const sup = super.isArray()
    if (!sup)
      return sup
    if (this.expect && !new Format(this.expect).isArray())
      return false
    return true
  }

  mapIsEmpty () {
    return this.expect.size === 0
  }
  setIsEmpty () {
    return this.expect.size === 0
  }
  pojoIsEmpty () {
    return this.pojoExpectIsEmpty()
  }
  arrayIsEmpty () {
    return this.expect.length === 0
  }
  errorIsEmpty () {
    const Ctor = this.constructor
    return this.pojoIsEmpty() && (
      (this.expect.name
        ? new Ctor(this.object.name, {expect: this.expect.name}).test()
        : true) &&
      (this.expect.message
        ? new Ctor(this.object.message, {expect: this.expect.message}).test()
        : true)
    )
  }

  setBody () {
    if (this.object.size === this.expect.size)
      return super.setBody()

    let out = ''
    const seen = new Set()
    for (const exp of this.expect) {
      if (this.object.has(exp)) {
        seen.add(exp)
        out += this.setEntry(exp)
        continue
      }

      let sawMatch = false
      for (const val of this.object) {
        if (seen.has(val))
          continue

        const s = this.child(val, {
          expect: exp,
          provisional: true
        })
        const sp = s.print()
        if (s.match) {
          sawMatch = true
          seen.add(val)
          out += sp
          break
        }
      }

      if (!sawMatch) {
        this.unmatch()
        out += this.prefix(this.simplePrint(exp, {
          level: this.level + 1,
          parent: this,
        }), '-')
      }
    }

    return out
  }

  mapBody () {
    const expEnt = this.expect.entries()
    let out = ''
    const seen = new Set()
    for (const [key, val] of expEnt) {
      if (this.object.has(key)) {
        out += this.mapEntry(key, this.object.get(key), key)
        seen.add(key)
        continue
      }
      // try to find a matching key
      let sawMatch = false
      for (const [objkey, objval] of this.object.entries()) {
        if (seen.has(objkey)) {
          continue
        }

        const s = this.child(objkey, {
          expect: key,
          provisional: true,
        })
        const sp = s.print()
        if (s.match) {
          sawMatch = true
          seen.add(objkey)
          out += this.mapEntry(objkey, this.object.get(objkey), key)
          break
        }
      }

      if (!sawMatch && val !== undefined && val !== null) {
        this.unmatch()
        out += this.prefix(this.simplePrint(val, {
          key,
          level: this.level + 1,
          parent: this,
        }), '-')
      }
    }
    return out
  }

  errorBody () {
    let out = this.pojoBody()
    let expKeys = this.pojoKeys(this.expect)

    if (expKeys.indexOf('name') === -1 && this.expect.name) {
      out += this.pojoEntry('name', this.object.name)
    }
    if (expKeys.indexOf('message') === -1 && this.expect.message) {
      out += this.pojoEntry('message', this.object.message)
    }
    return out
  }

  pojoBody () {
    const expEnt = this.pojoEntries(this.expect)

    let out = ''
    for (const [key, val] of expEnt) {
      if ((key in this.object) || val === undefined || val === null)
        out += this.pojoEntry(key, this.object[key])
      else {
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
}

module.exports = Has
