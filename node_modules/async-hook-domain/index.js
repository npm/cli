const { executionAsyncId, createHook } = require('async_hooks')

// grab a reference to this right away, in case the user changes it
// weird thing to do, but this is used in tests a lot, where weird
// things are quite common.
const proc = typeof process === 'object' && process ? process : /* istanbul ignore next */ {
  env: {},
  emit: /* istanbul ignore next */ () => {},
  once: /* istanbul ignore next */ () => {},
  _fatalException: /* istanbul ignore next */ () => {},
}

const debug = proc.env.ASYNC_HOOK_DOMAIN_DEBUG !== '1' ? () => {}
: (() => {
  const {writeSync} = require('fs')
  const {format} = require('util')
  return (...args) => writeSync(2, format(...args) + '\n')
})()

const domains = new Map()

// this is to work around the fact that node loses the executionAsyncId
// when a Promise rejects within an async context, for some reason.
// See: https://github.com/nodejs/node/issues/26794
let promiseExecutionId = null
let activePromise = null

// the async hook activation and deactivation
let domainHook = null
const activateDomains = () => {
  if (!domainHook) {
    debug('ACTIVATE')
    domainHook = createHook(hookMethods)
    domainHook.enable()
    proc.emit = domainProcessEmit
    proc._fatalException = domainProcessFatalException
  }
}
const deactivateDomains = () => {
  if (domainHook) {
    debug('DEACTIVATE')
    domainHook.disable()
    domainHook = null
    proc.emit = realProcessEmit
    proc._fatalException = realProcessFatalException
  }
}

// the hook callbacks
const hookMethods = {
  init (id, type, triggerId, resource) {
    const current = domains.get(triggerId)
    if (current) {
      debug('INIT', id, type, current)
      current.ids.add(id)
      domains.set(id, current)
      debug('POST INIT', id, type, current)
    }
  },

  promiseResolve (id) {
    debug('PROMISE RESOLVE', id)
    promiseExecutionId = id
  },

  destroy (id) {
    const domain = domains.get(id)
    debug('DESTROY', id, domain && domain.ids)
    if (!domain)
      return
    domains.delete(id)
    domain.ids.delete(id)
    if (!domain.ids.size)
      domain.destroy()
  },
}

// Dangerous monkey-patching ahead.
// Errors can bubble up to the top level in one of two ways:
// 1. thrown
// 2. promise rejection
//
// Thrown errors are easy.  They emit `uncaughtException`, and
// are considered nonfatal if there are listeners that don't throw.
// Managing an event listener is relatively straightforward, but we
// need to recognize when the error ISN'T handled by a domain, and
// make the error fatal, which is tricky but doable.
//
// Promise rejections are harder.  They do one of four possible things,
// depending on the --unhandled-rejections argument passed to node.
// - throw:
//   - call process._fatalException(er) and THEN emits unhandledRejection
//   - emit unhandledRejection
//   - if no handlers, warn
// - ignore: emit only
// - always warn: emit event, then warn
// - default:
//   - emit event
//   - if not handled, print warning and deprecation
//
// When we're ready to make a hard break with the domains builtin, and
// drop support for everything below 12.11.0, it'd be good to do this with
// a process.setUncaughtExceptionCaptureCallback().  However, the downside
// there is that any module that does this has to be a singleton, which
// feels overly pushy for a library like this.
//
// Also, there's been changes in how this all works between v8 and now.
//
// To cover all cases, we monkey-patch process._fatalException and .emit

const _handled = Symbol('handled by async-hook-domain')
const domainProcessEmit = (ev, ...args) => {
  if (ev === 'unhandledRejection') {
    debug('DOMAIN PROCESS EMIT', ev, ...args)
    const er = args[0]
    const p = args[1]
    // check to see if we have a domain
    const fromPromise = ev === 'unhandledRejection'
    const domain = currentDomain(fromPromise)
    if (domain) {
      debug('HAS DOMAIN', domain)
      if (promiseFatal) {
        // don't need to handle a second time when the event emits
        return realProcessEmit.call(proc, ev, ...args) || true
      }
      try {
        domain.onerror(er, ev)
      } catch (e) {
        domain.destroy()
        // this is pretty bad.  treat it as a fatal exception, which
        // may or may not be caught in the next domain up.
        // We drop 'from promise', because now it's a throw.
        return domainProcessFatalException(e)
      }
      return realProcessEmit.call(proc, ev, ...args) || true
    }
  }
  return realProcessEmit.call(proc, ev, ...args)
}

const currentDomain = fromPromise =>
  domains.get(executionAsyncId()) ||
    (fromPromise ? domains.get(promiseExecutionId) : null)

const realProcessEmit = proc.emit

let promiseFatal = false
const domainProcessFatalException = (er, fromPromise) => {
  debug('_FATAL EXCEPTION', er, fromPromise)

  const domain = currentDomain(fromPromise)
  if (domain) {
    const ev = fromPromise ? 'unhandledRejection' : 'uncaughtException'
    // if it's from a promise, then that means --unhandled-rejection=strict
    // we don't need to handle it a second time.
    promiseFatal = promiseFatal || fromPromise
    try {
      domain.onerror(er, ev)
    } catch (e) {
      domain.destroy()
      return domainProcessFatalException(e)
    }
    // we add a handler just to ensure that node knows the event will
    // be handled.  otherwise we get async hook stack corruption.
    if (promiseFatal) {
      // don't blow up our process on a promise if we handled it.
      return true
    }
    proc.once(ev, () => {})
    // this ||true is just a safety guard.  it should always be true.
    return realProcessFatalException.call(proc, er, fromPromise) ||
      /* istanbul ignore next */ true
  }
  return realProcessFatalException.call(proc, er, fromPromise)
}

const realProcessFatalException = proc._fatalException

class Domain {
  constructor (onerror) {
    if (typeof onerror !== 'function') {
      // point at where the wrong thing was actually done
      const er = new TypeError('onerror must be a function')
      Error.captureStackTrace(er, this.constructor)
      throw er
    }
    const eid = executionAsyncId()
    this.ids = new Set([eid])
    this.onerror = onerror
    this.parent = domains.get(executionAsyncId())
    this.destroyed = false
    domains.set(eid, this)
    activateDomains()
  }

  destroy () {
    if (this.destroyed)
      return
    this.destroyed = true
    // find the nearest non-destroyed parent, assign all ids to it
    let parent = this.parent
    while (parent && parent.destroyed) {
      parent = parent.parent
    }
    this.parent = parent
    if (parent) {
      for (const id of this.ids) {
        domains.set(id, parent)
        parent.ids.add(id)
      }
    } else {
      for (const id of this.ids) {
        domains.delete(id)
      }
    }
    this.ids = new Set()
    if (!domains.size)
      deactivateDomains()
  }
}

module.exports = Domain
