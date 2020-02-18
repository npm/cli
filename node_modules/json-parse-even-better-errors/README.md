# json-parse-even-better-errors [![npm version](https://img.shields.io/npm/v/json-parse-even-better-errors.svg)](https://npm.im/json-parse-even-better-errors) [![license](https://img.shields.io/npm/l/json-parse-even-better-errors.svg)](https://npm.im/json-parse-even-better-errors) [![Travis](https://img.shields.io/travis/npm/json-parse-even-better-errors.svg)](https://travis-ci.org/npm/json-parse-even-better-errors) [![AppVeyor](https://ci.appveyor.com/api/projects/status/github/npm/json-parse-even-better-errors?svg=true)](https://ci.appveyor.com/project/npm/json-parse-even-better-errors) [![Coverage Status](https://coveralls.io/repos/github/npm/json-parse-even-better-errors/badge.svg?branch=latest)](https://coveralls.io/github/npm/json-parse-even-better-errors?branch=latest)

[`json-parse-even-better-errors`](https://github.com/npm/json-parse-even-better-errors) is a Node.js library for
getting nicer errors out of `JSON.parse()`, including context and position of the parse errors.

## Install

`$ npm install --save json-parse-even-better-errors`

## Table of Contents

* [Example](#example)
* [Features](#features)
* [Contributing](#contributing)
* [API](#api)
  * [`parse`](#parse)

### Example

```javascript
const parseJson = require('json-parse-even-better-errors')

parseJson('"foo"')
parseJson('garbage') // more useful error message
```

### Features

* Like JSON.parse, but the errors are better.

### API

#### <a name="parse"></a> `parse(txt, reviver = null, context = 20)`

Works just like `JSON.parse`, but will include a bit more information when an
error happens.  This throws a `JSONParseError`.

#### <a name="jsonparseerror"></a> `class JSONParseError(er, text, context = 20, caller = null)`

Extends the JavaScript `SyntaxError` class to parse the message and provide
better metadata.

Pass in the error thrown by the built-in `JSON.parse`, and the text being
parsed, and it'll parse out the bits needed to be helpful.

`context` defaults to 20.

Set a `caller` function to trim internal implementation details out of the
stack trace.  When calling `parseJson`, this is set to the `parseJson`
function.  If not set, then the constructor defaults to itself, so the
stack trace will point to the spot where you call `new JSONParseError`.
