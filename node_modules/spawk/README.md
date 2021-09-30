# spawk

node.js child_process.spawn mocking library

Spawk can be used to test modules that call spawn in isolation.

Note: This module does its best to implement platform specific behaviors
of [`child_process.spawn()`](https://nodejs.org/api/child_process.html),
anything that behaves differently is a
[bug](https://github.com/wraithgar/spawk/issues/new/choose).

## Example

```js
const spawk = require('spawk')
spawk.spawn('ls').exit(1).stdout('custom response')

const child = require('child_process').spawn('ls')

```

`child` here will be a mocked ChildProcess object that will exit
with a status code of 1, and will receive the string `custom response`
on its stdout interface.

By default, any calls to `spawn` that do not match an existing mock will
pass through to the original `spawn`.  See `preventUnmatched` below for
more info on how to change this.

Each intercepted call will only be used once, so if you want to
intercept multiple calls to the same command you need to call
`spawk.spawn` for each call you want to be intercepted.  They will be
used in the order that they were created.

# API

## spawk

```sh
npm install spawk
```

```sh
const spawk = require('spawk')
```

### spawk.spawn(command, arguments, options)

Intercept and mock a call to `child_process.spawn`.
Returns a `Interceptor` object, see below for more info.
Parameters are defined as follows:

- `command`

Command to intercept and mock.  Can either be a string, a `RegExp`, or a
function.  The interceptor will mock a given call if the string matches
exactly, or the `RegExp` matches, or the function returns true.  The
function will be passed three parameters: the command, args, and options
passed to `child_process.spawn`.  The function will be called under the
context of the `Interceptor`, so you will have access to the methods and
attributes described below.

- `arguments`

Optional arguments that must accompany the given `command` in order to
be mocked.  Can either be an array or a function.  The interceptor will
mock a given call if the array matches exactly, or if the function
returns true.  The function will be passed one parameter: the args
passed to `child_process.spawn`.  The function will be called under the
context of the `Interceptor`, so you will have access to the methods and
attributes described below.

- `options`

Optional options that must accompany the given `command` in order to be
mocked.  Can either be an object or a function.  The interceptor will
mock a given call if all of the attributes in these options match, or if
the function returns true.  If an object, only the attributes you give
are matched, others do not affect whether or not it matches.  If a
function, it will be passed one parameter: the options passed to
`child_process.spawn`.  The function will be called under the context of
the `Interceptor`, so you will have access to the methods and attributes
described below.

When generating stdin/stdin/stdout streams for the interceptor, if the
call to `spawn` specifies `inherit` for their modes they will not be
created.

### spawk.allowUnmatched()

Allow calls to `child_process.spawn` that do not match any interceptor
to pass through to node's implementation.  This is the default state.

### spawk.preventUnmatched()

Allow calls to `child_process.spawn` that do not match any interceptor
from passing through to node's implementation.  An unmatched call will
cause an exception to be thrown.

### spawk.done()

Ensure that all configured interceptors have been called.  If they have
this will return `true`.  If they have not this will throw an exception.

### spawk.clean()

Remove any currently configured interceptors.

### spawk.unload()

Unloads spawk from intercepting `child_process.spawn` calls completely.
This also removes any currently configured interceptors.

### spawk.load()

Loads spawk for intercepting `child_process.spawn` calls.  This is
called by default, you should only need to call this if you have
previously called `spawk.unload()` for some reason.


## Interceptor

```js
const interceptor = spawk.spawn('ls')
```

All of the following methods can be chained together.

By default a interceptor will exit with a code of `0` with no signal,
and nothing written to either `stdout` or `stderr`.

### interceptor.called

Boolean that denotes whether or not this interceptor has been called yet

### interceptor.description

Helpful string representation of the interceptor.

### interceptor.calledWith

When the interceptor has been called, this will be an object that
contains the command, args, and options that were actually called.

### interceptor.signals

Array containing any signals that the interceptor received via `.kill()`

### interceptor.exit(code)

Tells the interceptor what status code to exit with.  Defaults to `0`.

This can be either a number or a function that returns a number.  The
function can also be async or return a Promise.  The function will be
called with `this` set to the interceptor.

Calling this will clear out any signal previously set with
`interceptor.signal`

### interceptor.signal(signal)

Tells the interceptor what signal to exit with.  Defaults to null (exit
with no signal).

This can be either a string or a function that returns a string.  The
function can also be async or return a Promise.  The function will be
called with `this` set to the interceptor.

Calling this will clear out any code previously set with
`interceptor.exit`

### interceptor.stdout(data)

Tells the interceptor what to write to stdout before exit.

This can be either a string, buffer, or a function that returns a string
or buffer.  The function can also be async or return a Promise.  The
function will be called with `this` set to the interceptor.

### interceptor.stderr(data)

Tells the interceptor what to write to stderr before exit.

This can be either a string, buffer, or a function that returns a string
or buffer.  The function can also be async or return a Promise.  The
function will be called with `this` set to the interceptor.

### interceptor.delay(ms)

Tells the interceptor to delay exiting for a given number of
milliseconds.

### interceptor.exitOnSignal(signal)

Tells the interceptor to delay exiting until it receives the given
signal.  Setting this will ignore any delay you have set.  This will
also be the signal that the interceptor exits with, unless you otherwise
change it via `interceptor.signal`.

### interceptor.spawnError(error)

Tells the interceptor to emit the given error object via the `error`
event, instead of the normal `spawn` event.  The interceptor will not
emit the `exit` or `close` events in this case, nor will it set up any
stdio objects.  This can be combined with `interceptor.delay` to delay
this error, or with `interceptor.exitOnSignal` to error when the given
signal is received (replicating a process that can not be killed).
