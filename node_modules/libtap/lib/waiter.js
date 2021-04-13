class Waiter {
  constructor (promise, cb, expectReject) {
    this.cb = cb
    this.ready = false
    this.value = null
    this.resolved = false
    this.rejected = false
    this.done = false
    this.finishing = false
    this.expectReject = !!expectReject
    this.promise = new Promise(res => this.resolve = res)
    promise.then(value => {
      if (this.done) {
        return
      }

      this.resolved = true
      this.value = value
      this.done = true
      this.finish()
    }).catch(er => this.reject(er))
  }

  reject (er) {
    if (this.done) {
      return
    }

    this.value = er
    this.rejected = true
    this.done = true
    this.finish()
  }

  abort (er) {
    if (this.done) {
      return
    }

    this.ready = true
    this.finishing = false
    this.done = true
    this.value = er
    // make it clear that this is a problem by doing
    // the opposite of what was requested.
    this.rejected = !this.expectReject
    return this.finish()
  }

  finish () {
    if (this.ready && this.done && !this.finishing) {
      this.finishing = true
      this.cb(this)
      this.resolve()
    }
  }
}

module.exports = Waiter;
