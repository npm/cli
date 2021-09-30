unicode-length
--------------

[![npm version](https://badge.fury.io/js/unicode-length.svg)](http://badge.fury.io/js/unicode-length)
[![dependencies](https://david-dm.org/jviotti/unicode-length.png)](https://david-dm.org/jviotti/unicode-length.png)
[![Build Status](https://travis-ci.org/jviotti/unicode-length.svg?branch=master)](https://travis-ci.org/jviotti/unicode-length)

Installation
------------

Install `unicode-length` by running:

```sh
$ npm install --save unicode-length
```

Documentation
-------------

### Number unicodeLength.get(String input)

Get the length of a unicode string.

Example:

```coffee
unicodeLength = require('unicode-length')
console.log(unicodeLength.get('汉字'))
# Outputs 2
```

Tests
-----

Run the test suite by doing:

```sh
$ gulp test
```

Contribute
----------

- Issue Tracker: [github.com/jviotti/unicode-length/issues](https://github.com/jviotti/unicode-length/issues)
- Source Code: [github.com/jviotti/unicode-length](https://github.com/jviotti/unicode-length)

Before submitting a PR, please make sure that you include tests, and that [coffeelint](http://www.coffeelint.org/) runs without any warning:

```sh
$ gulp lint
```

Support
-------

If you're having any problem, please [raise an issue](https://github.com/jviotti/unicode-length/issues/new) on GitHub.

License
-------

The project is licensed under the MIT license.
