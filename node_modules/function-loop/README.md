# function-loop

Run a list of functions in order in a given object context.  The
functions can be Promise-returning to do async operations, or return
anything else if they are done synchronously.

This module is
[zalgo-exposing](http://blog.izs.me/post/59142742143/designing-apis-for-asynchrony),
meaning that synchronous returns will result in a sync call to the supplied
cb, and async calls will result in the done callback being called
asynchronously.  The loop will return a Promise indicating when it is
finished, if any async functions are encountered.  It does not artificially
defer if functions are called synchronously.

## API

`loop(context, functionList, doneCallback, errorCallback)`

Run all the functions in the context of the `context` object, and then
call the `doneCallback` or call the `errorCallback` if there are any
errors.

Functions can return a Promise to do async operations, or not if they are
done synchronously.  Throws are reported to the `errorCallback` provided.

Return value is a Promise if any of the functions are asynchronous, or
`undefined` otherwise.
