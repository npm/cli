# async-hook-domain

An implementation of the error-handling properties of the (deprecated) `domain`
node core module, re-implemented on top of
[`async_hooks`](https://nodejs.org/api/async_hooks.html).

[![Linux Build](https://travis-ci.org/tapjs/async-hook-domain.svg?branch=master)](https://travis-ci.org/tapjs/async-hook-domain)

## USAGE

```js
const Domain = require('async-hook-domain')

// instantiating a Domain attaches it to the current async execution
// context, and all child contexts that come off of it.  You don't have
// to call d.enter() or d.run(cb), just instantiate and it's done.
// Pass an error-handling function to the constructor.  This function
// will be called whenever there is an uncaught exception or an
// unhandled Promise rejection.

const d = new Domain(er => {
  console.log('caught an error', er)
  // if you re-throw, it's not going to be caught, and will probably
  // cause the process to crash.
})

setTimeout(() => {
  throw new Error('this is caught by the domain a few lines up')
})

process.nextTick(() => {
  const d2 = new Domain(er => {
    console.log('any contexts spawned from this nextTick are caught here', er)
    // only catch one error.  The next one will go to the parent
    d2.destroy()
  })
  fs.readFile('does not exist', (er, data) => {
    if (er)
      throw er
  })
  fs.readFile('also does not exist', (er, data) => {
    if (er)
      throw er
  })
})

// Adding a new domain here in the same context as the d above will
// take over for this current context, as well as any that are created
// from now on.  But it won't affect the setTimeout above, because that
// async context was created before this domain existed.
const d3 = new Domain(er => console.log('d3', er))

// Unhandled promise rejections are handled, too.
Promise.reject(new Error('this will be handled by d3'))

// since a Promise rejection is an async hop, if we destroyed it right
// now, it would not be there to catch the Promise.reject event.
setTimeout(() => {
  // destroying d3 makes it like it never happened, so this will
  // be handled by the parent domain we created at the outset.
  d3.destroy()
  throw new Error('this will be handled by the parent')
})

// When all domains are destroyed either manually or by virtue of their
// async execution contexts being completed, or if no domain is active
// for the current execution context, then it reverts back to normal
// operation, with all event handlers removed and everything cleaned up.
setTimeout(() => {
  d.destroy()
  throw new Error('this crashes the process like normal')
}, 500) // time for the other contexts to wrap up
```

If you want to limit a Domain to a narrower scope, you can use node's
[`AsyncResource`](https://nodejs.org/api/async_hooks.html#async_hooks_class_asyncresource)
class, and instantiate the domain within its `runInAsyncScope(cb)` method.
From then on, the domain will only be active when running from that Async
Resource's scope.

## API

### `process.env.ASYNC_HOOK_DOMAIN_DEBUG = '1'`

Set the `ASYNC_HOOK_DOMAIN_DEBUG` environment variable to `'1'` to print a lot
of debugging information to stderr.

### const d = new Domain(errorHandlerFunction(error, type))

Create a new Domain and assign it to the current execution context and all
child contexts that the current one triggers.

The handler function is called with two arguments.  The first is the error that
was thrown or the rejection value of the rejected Promise.  The second is
either `'uncaughtException'` or `'unhandledRejection'`, depending on the type
of event that raised the error.

### d.parent Domain

If a Domain is already assigned to the current context on creation, then the
current Domain set as the new Domain's `parent`.  On destruction, any of a
Domain's still-active execution contexts are assigned to its parent.

### d.onerror Function

The `errorHandlerFunction` passed into the constructor.  Called when an
uncaughtException or unhandledRejection occurs in the scope of the Domain.

If this function throws, then the domain will be destroyed, and the thrown
error will be raised.  If the domain doesn't have a parent, then this will
likely crash the process entirely.

### d.destroyed Boolean

Set to `true` if the domain is destroyed.

### d.ids Set

A set of the `executionAsyncId` values corresponding to the execution contexts
for which this Domain handles errors.

### d.destroy() Function

Call to destroy the domain.  This removes it from the system entirely,
assigning any outstanding ids to its parent, if it has one, or leaving them
uncovered if not.

This is called implicitly when the domain's last covered execution context is
destroyed, since at that point, the domain is unreachable anyway.
