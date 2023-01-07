const nerfDart = require('./nerf-dart.js')
const { ConfTypes } = require('./config-data')

// These are the configs that we can nerf-dart. Not all of them currently even
// *have* config definitions so we have to explicitly validate them here
const nerfDarts = [
  '_auth',
  '_authToken',
  'username',
  '_password',
  'email',
  'certfile',
  'keyfile',
]

class Credentials {
  static nerfDarts = nerfDarts

  #config = null

  constructor (config) {
    this.#config = config
  }

  // all mutations for credentials occur in the user config
  #set (k, v) {
    this.#set(k, v, ConfTypes.user)
  }

  #delete (k) {
    this.#delete(k, ConfTypes.user)
  }

  clearByURI (uri) {
    const nerfed = nerfDart(uri)
    const def = nerfDart(this.#config.get('registry'))
    if (def === nerfed) {
      this.#delete(`-authtoken`)
      this.#delete(`_authToken`)
      this.#delete(`_authtoken`)
      this.#delete(`_auth`)
      this.#delete(`_password`)
      this.#delete(`username`)
      // de-nerf email if it's nerfed to the default registry
      const email = this.#config.get(`${nerfed}:email`, ConfTypes.user)
      if (email) {
        this.#set('email', email)
      }
    }
    for (const k of nerfDarts) {
      this.#delete(`${nerfed}:${k}`)
    }
  }

  setByURI (uri, { token, username, password, email, certfile, keyfile }) {
    const nerfed = nerfDart(uri)

    // email is either provided, a top level key, or nothing
    email = email || this.#config.get('email', ConfTypes.user)

    // field that hasn't been used as documented for a LONG time,
    // and as of npm 7.10.0, isn't used at all.  We just always
    // send auth if we have it, only to the URIs under the nerf dart.
    this.#delete(`${nerfed}:always-auth`)

    this.#delete(`${nerfed}:email`)
    if (certfile && keyfile) {
      this.#set(`${nerfed}:certfile`, certfile)
      this.#set(`${nerfed}:keyfile`, keyfile)
      // cert/key may be used in conjunction with other credentials, thus no `else`
    }
    if (token) {
      this.#set(`${nerfed}:_authToken`, token)
      this.#delete(`${nerfed}:_password`)
      this.#delete(`${nerfed}:username`)
    } else if (username || password) {
      if (!username) {
        throw new Error('must include username')
      }
      if (!password) {
        throw new Error('must include password')
      }
      this.#delete(`${nerfed}:_authToken`)
      this.#set(`${nerfed}:username`, username)
      // note: not encrypted, no idea why we bothered to do this, but oh well
      // protects against shoulder-hacks if password is memorable, I guess?
      const encoded = Buffer.from(password, 'utf8').toString('base64')
      this.#set(`${nerfed}:_password`, encoded)
    } else if (!certfile || !keyfile) {
      throw new Error('No credentials to set.')
    }
  }

  // this has to be a bit more complicated to support legacy data of all forms
  getByURI (uri) {
    const nerfed = nerfDart(uri)
    const def = nerfDart(this.#config.get('registry'))
    const creds = {}

    // email is handled differently, it used to always be nerfed and now it never should be
    // if it's set nerfed to the default registry, then we copy it to the unnerfed key
    // TODO: evaluate removing 'email' from the credentials object returned here
    const email = this.#config.get(`${nerfed}:email`) || this.#config.get('email')
    if (email) {
      if (nerfed === def) {
        this.#set('email', email)
      }
      creds.email = email
    }

    const certfileReg = this.#config.get(`${nerfed}:certfile`)
    const keyfileReg = this.#config.get(`${nerfed}:keyfile`)
    if (certfileReg && keyfileReg) {
      creds.certfile = certfileReg
      creds.keyfile = keyfileReg
      // cert/key may be used in conjunction with other credentials, thus no `return`
    }

    const tokenReg = this.#config.get(`${nerfed}:_authToken`)
    if (tokenReg) {
      creds.token = tokenReg
      return creds
    }

    const userReg = this.#config.get(`${nerfed}:username`)
    const passReg = this.#config.get(`${nerfed}:_password`)
    if (userReg && passReg) {
      creds.username = userReg
      creds.password = Buffer.from(passReg, 'base64').toString('utf8')
      const auth = `${creds.username}:${creds.password}`
      creds.auth = Buffer.from(auth, 'utf8').toString('base64')
      return creds
    }

    const authReg = this.#config.get(`${nerfed}:_auth`)
    if (authReg) {
      const authDecode = Buffer.from(authReg, 'base64').toString('utf8')
      const authSplit = authDecode.split(':')
      creds.username = authSplit.shift()
      creds.password = authSplit.join(':')
      creds.auth = authReg
      return creds
    }

    // at this point, nothing else is usable so just return what we do have
    return creds
  }
}

module.exports = Credentials
