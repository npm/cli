// generated from test/fixtures/workspaces-non-simplistic
module.exports = t => {
  const path = t.testdir({
  "a": {
    "package.json": JSON.stringify({
      "name": "pkg-a",
      "dependencies": {
        "@ruyadorno/dep-bar": "^1.0.0"
      }
    })
  },
  "node_modules": {
    ".package-lock.json": JSON.stringify({
      "name": "workspaces-non-simplistic",
      "lockfileVersion": 2,
      "requires": true,
      "packages": {
        "a": {
          "dependencies": {
            "@ruyadorno/dep-bar": "^1.0.0"
          }
        },
        "node_modules/@ruyadorno/dep-bar": {
          "version": "1.0.0",
          "resolved": "https://registry.npmjs.org/@ruyadorno/dep-bar/-/dep-bar-1.0.0.tgz",
          "integrity": "sha512-odCQAbeN4ZPv0AAVIyVMZuX4sMYEsUgVAbAtRa+oDsLAoyz+weSQCDcefkk23sfqsJuOXTiohHJ3rcr0lN0rGA==",
          "dependencies": {
            "@ruyadorno/dep-foo": "^1.0.0"
          }
        },
        "node_modules/@ruyadorno/dep-foo": {
          "version": "1.0.0",
          "resolved": "https://registry.npmjs.org/@ruyadorno/dep-foo/-/dep-foo-1.0.0.tgz",
          "integrity": "sha512-ffU1K0OPjx+75PIZRjDQy/Iwj/tAFYczGiqYx5ak9JWDRDubLwN2VLarPq4w0QqPdZtJ7Z9AMGDLKPmLnu6iZw==",
          "funding": {
            "type": "Patreon",
            "url": "https://patreon.com/ruyadorno"
          }
        },
        "node_modules/abbrev": {
          "version": "1.1.1",
          "resolved": "https://registry.npmjs.org/abbrev/-/abbrev-1.1.1.tgz",
          "integrity": "sha512-nne9/IiQ/hzIhY6pdDnbBtz7DjPTKrY00P/zvPSm5pOFkl6xuGrGnXn/VtTNNfNtAfZ9/1RtehkszU9qcTii0Q==",
          "dev": true
        },
        "node_modules/pkg-a": {
          "resolved": "a",
          "link": true
        }
      }
    }),
    "@ruyadorno": {
      "dep-bar": {
        "package.json": JSON.stringify({
          "name": "@ruyadorno/dep-bar",
          "version": "1.0.0",
          "dependencies": {
            "@ruyadorno/dep-foo": "^1.0.0"
          }
        })
      },
      "dep-foo": {
        "package.json": JSON.stringify({
          "name": "@ruyadorno/dep-foo",
          "version": "1.0.0",
          "description": "",
          "main": "index.js",
          "scripts": {
            "test": "echo \"Error: no test specified\" && exit 1"
          },
          "funding": {
            "type": "Patreon",
            "url": "https://patreon.com/ruyadorno"
          },
          "author": "Ruy Adorno",
          "license": "ISC"
        })
      }
    },
    "abbrev": {
      "LICENSE": `This software is dual-licensed under the ISC and MIT licenses.
You may use this software under EITHER of the following licenses.

----------

The ISC License

Copyright (c) Isaac Z. Schlueter and Contributors

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR
IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

----------

Copyright Isaac Z. Schlueter and Contributors
All rights reserved.

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
`,
      "README.md": `# abbrev-js

Just like [ruby's Abbrev](http://apidock.com/ruby/Abbrev).

Usage:

    var abbrev = require("abbrev");
    abbrev("foo", "fool", "folding", "flop");
    
    // returns:
    { fl: 'flop'
    , flo: 'flop'
    , flop: 'flop'
    , fol: 'folding'
    , fold: 'folding'
    , foldi: 'folding'
    , foldin: 'folding'
    , folding: 'folding'
    , foo: 'foo'
    , fool: 'fool'
    }

This is handy for command-line scripts, or other cases where you want to be able to accept shorthands.
`,
      "abbrev.js": `module.exports = exports = abbrev.abbrev = abbrev

abbrev.monkeyPatch = monkeyPatch

function monkeyPatch () {
  Object.defineProperty(Array.prototype, 'abbrev', {
    value: function () { return abbrev(this) },
    enumerable: false, configurable: true, writable: true
  })

  Object.defineProperty(Object.prototype, 'abbrev', {
    value: function () { return abbrev(Object.keys(this)) },
    enumerable: false, configurable: true, writable: true
  })
}

function abbrev (list) {
  if (arguments.length !== 1 || !Array.isArray(list)) {
    list = Array.prototype.slice.call(arguments, 0)
  }
  for (var i = 0, l = list.length, args = [] ; i < l ; i ++) {
    args[i] = typeof list[i] === "string" ? list[i] : String(list[i])
  }

  // sort them lexicographically, so that they're next to their nearest kin
  args = args.sort(lexSort)

  // walk through each, seeing how much it has in common with the next and previous
  var abbrevs = {}
    , prev = ""
  for (var i = 0, l = args.length ; i < l ; i ++) {
    var current = args[i]
      , next = args[i + 1] || ""
      , nextMatches = true
      , prevMatches = true
    if (current === next) continue
    for (var j = 0, cl = current.length ; j < cl ; j ++) {
      var curChar = current.charAt(j)
      nextMatches = nextMatches && curChar === next.charAt(j)
      prevMatches = prevMatches && curChar === prev.charAt(j)
      if (!nextMatches && !prevMatches) {
        j ++
        break
      }
    }
    prev = current
    if (j === cl) {
      abbrevs[current] = current
      continue
    }
    for (var a = current.substr(0, j) ; j <= cl ; j ++) {
      abbrevs[a] = current
      a += current.charAt(j)
    }
  }
  return abbrevs
}

function lexSort (a, b) {
  return a === b ? 0 : a > b ? 1 : -1
}
`,
      "package.json": JSON.stringify({
        "name": "abbrev",
        "version": "1.1.1",
        "description": "Like ruby's abbrev module, but in js",
        "author": "Isaac Z. Schlueter <i@izs.me>",
        "main": "abbrev.js",
        "scripts": {
          "test": "tap test.js --100",
          "preversion": "npm test",
          "postversion": "npm publish",
          "postpublish": "git push origin --all; git push origin --tags"
        },
        "repository": "http://github.com/isaacs/abbrev-js",
        "license": "ISC",
        "devDependencies": {
          "tap": "^10.1"
        },
        "files": [
          "abbrev.js"
        ]
      })
    },
    "pkg-a": t.fixture('symlink', "../a")
  },
  "package-lock.json": JSON.stringify({
    "name": "workspaces-non-simplistic",
    "lockfileVersion": 2,
    "requires": true,
    "packages": {
      "": {
        "workspaces": [
          "a"
        ],
        "devDependencies": {
          "abbrev": "^1.0.0"
        }
      },
      "a": {
        "dependencies": {
          "@ruyadorno/dep-bar": "^1.0.0"
        }
      },
      "node_modules/@ruyadorno/dep-bar": {
        "version": "1.0.0",
        "resolved": "https://registry.npmjs.org/@ruyadorno/dep-bar/-/dep-bar-1.0.0.tgz",
        "integrity": "sha512-odCQAbeN4ZPv0AAVIyVMZuX4sMYEsUgVAbAtRa+oDsLAoyz+weSQCDcefkk23sfqsJuOXTiohHJ3rcr0lN0rGA==",
        "dependencies": {
          "@ruyadorno/dep-foo": "^1.0.0"
        }
      },
      "node_modules/@ruyadorno/dep-foo": {
        "version": "1.0.0",
        "resolved": "https://registry.npmjs.org/@ruyadorno/dep-foo/-/dep-foo-1.0.0.tgz",
        "integrity": "sha512-ffU1K0OPjx+75PIZRjDQy/Iwj/tAFYczGiqYx5ak9JWDRDubLwN2VLarPq4w0QqPdZtJ7Z9AMGDLKPmLnu6iZw==",
        "funding": {
          "type": "Patreon",
          "url": "https://patreon.com/ruyadorno"
        }
      },
      "node_modules/abbrev": {
        "version": "1.1.1",
        "resolved": "https://registry.npmjs.org/abbrev/-/abbrev-1.1.1.tgz",
        "integrity": "sha512-nne9/IiQ/hzIhY6pdDnbBtz7DjPTKrY00P/zvPSm5pOFkl6xuGrGnXn/VtTNNfNtAfZ9/1RtehkszU9qcTii0Q==",
        "dev": true
      },
      "node_modules/pkg-a": {
        "resolved": "a",
        "link": true
      }
    },
    "dependencies": {
      "@ruyadorno/dep-bar": {
        "version": "1.0.0",
        "resolved": "https://registry.npmjs.org/@ruyadorno/dep-bar/-/dep-bar-1.0.0.tgz",
        "integrity": "sha512-odCQAbeN4ZPv0AAVIyVMZuX4sMYEsUgVAbAtRa+oDsLAoyz+weSQCDcefkk23sfqsJuOXTiohHJ3rcr0lN0rGA==",
        "requires": {
          "@ruyadorno/dep-foo": "^1.0.0"
        }
      },
      "@ruyadorno/dep-foo": {
        "version": "1.0.0",
        "resolved": "https://registry.npmjs.org/@ruyadorno/dep-foo/-/dep-foo-1.0.0.tgz",
        "integrity": "sha512-ffU1K0OPjx+75PIZRjDQy/Iwj/tAFYczGiqYx5ak9JWDRDubLwN2VLarPq4w0QqPdZtJ7Z9AMGDLKPmLnu6iZw=="
      },
      "abbrev": {
        "version": "1.1.1",
        "resolved": "https://registry.npmjs.org/abbrev/-/abbrev-1.1.1.tgz",
        "integrity": "sha512-nne9/IiQ/hzIhY6pdDnbBtz7DjPTKrY00P/zvPSm5pOFkl6xuGrGnXn/VtTNNfNtAfZ9/1RtehkszU9qcTii0Q==",
        "dev": true
      },
      "pkg-a": {
        "version": "file:a",
        "requires": {
          "@ruyadorno/dep-bar": "^1.0.0"
        }
      }
    }
  }),
  "package.json": JSON.stringify({
    "name": "workspaces-non-simplistic",
    "workspaces": [
      "a"
    ],
    "devDependencies": {
      "abbrev": "^1.0.0"
    }
  })
})
  const {utimesSync} = require('fs')
  const n = Date.now() + 10000
  const {resolve} = require('path')
  
  utimesSync(resolve(path, "node_modules/.package-lock.json"), new Date(n), new Date(n))
  return path
}
