const npmFetch = require('npm-registry-fetch')
const { webAuthOpener } = require('npm-profile')
const { createOpener } = require('./open-url.js')
const read = require('./read-user-info.js')

class RegistryClient {
  constructor (npm) {
    this.npm = npm
  }

  async fetch (url, opts = {}) {
    const fullOpts = { ...this.npm.flatOptions, ...opts }
    return this.#withOtpRetry(fullOpts, (o) => npmFetch(url, o))
  }

  async fetchJson (url, opts = {}) {
    const response = await this.fetch(url, opts)
    return response.json()
  }

  async fetchWithJson (url, data, opts = {}) {
    const jsonOpts = {
      ...opts,
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json',
        ...opts.headers,
      },
    }
    return this.fetch(url, jsonOpts)
  }

  async postJson (url, data, opts = {}) {
    const response = await this.fetchWithJson(url, data, { method: 'POST', ...opts })
    return response.json()
  }

  async putJson (url, data, opts = {}) {
    const response = await this.fetchWithJson(url, data, { method: 'PUT', ...opts })
    return response.json()
  }

  async withOtp (fn, opts = {}) {
    const fullOpts = { ...this.npm.flatOptions, ...opts }
    return this.#withOtpRetry(fullOpts, fn)
  }

  async #withOtpRetry (opts, fn) {
    try {
      return await fn(opts)
    } catch (err) {
      // Only attempt OTP retry if we're in an interactive terminal
      if (!process.stdin.isTTY || !process.stdout.isTTY) {
        throw err
      }

      // Handle web-based OTP flow
      if (err.code === 'EOTP' && err.body?.authUrl && err.body?.doneUrl) {
        const { token: otp } = await webAuthOpener(
          createOpener(this.npm, 'Authenticate your account at'),
          err.body.authUrl,
          err.body.doneUrl,
          opts
        )
        return await fn({ ...opts, otp })
      }

      // Handle classic OTP prompt
      if (err.code === 'EOTP' || (err.code === 'E401' && /one-time pass/.test(err.body))) {
        const otp = await read.otp('This operation requires a one-time password.\nEnter OTP:')
        return await fn({ ...opts, otp })
      }

      // Re-throw any other errors
      throw err
    }
  }
}

module.exports = RegistryClient
