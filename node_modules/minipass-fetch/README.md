# minipass-fetch

An implementation of window.fetch in Node.js using Minipass streams

This is a fork (or more precisely, a reimplementation) of
[node-fetch](http://npm.im/node-fetch).  All streams have been replaced
with [minipass streams](http://npm.im/minipass).

The goal of this module is to stay in sync with the API presented by
`node-fetch`, with the exception of the streaming interface provided.

## Why

Minipass streams are faster and more deterministic in their timing contract
than node-core streams, making them a better fit for many server-side use
cases.

## API

See [node-fetch](http://npm.im/node-fetch)
