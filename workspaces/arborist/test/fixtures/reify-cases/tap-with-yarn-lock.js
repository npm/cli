// generated from test/fixtures/tap-with-yarn-lock
module.exports = t => {
  const path = t.testdir({
  "node_modules": {
    "@babel": {
      "code-frame": {
        "package.json": JSON.stringify({
          "name": "@babel/code-frame",
          "version": "7.0.0",
          "description": "Generate errors that contain a code frame that point to source locations.",
          "author": "Sebastian McKenzie <sebmck@gmail.com>",
          "homepage": "https://babeljs.io/",
          "license": "MIT",
          "repository": "https://github.com/babel/babel/tree/master/packages/babel-code-frame",
          "main": "lib/index.js",
          "dependencies": {
            "@babel/highlight": "^7.0.0"
          },
          "devDependencies": {
            "chalk": "^2.0.0",
            "strip-ansi": "^4.0.0"
          }
        })
      },
      "generator": {
        "node_modules": {
          "jsesc": {
            "package.json": JSON.stringify({
              "name": "jsesc",
              "version": "2.5.2",
              "description": "Given some data, jsesc returns the shortest possible stringified & ASCII-safe representation of that data.",
              "homepage": "https://mths.be/jsesc",
              "engines": {
                "node": ">=4"
              },
              "main": "jsesc.js",
              "bin": "bin/jsesc",
              "man": "man/jsesc.1",
              "keywords": [
                "buffer",
                "escape",
                "javascript",
                "json",
                "map",
                "set",
                "string",
                "stringify",
                "tool"
              ],
              "license": "MIT",
              "author": {
                "name": "Mathias Bynens",
                "url": "https://mathiasbynens.be/"
              },
              "repository": {
                "type": "git",
                "url": "https://github.com/mathiasbynens/jsesc.git"
              },
              "bugs": "https://github.com/mathiasbynens/jsesc/issues",
              "files": [
                "LICENSE-MIT.txt",
                "jsesc.js",
                "bin/",
                "man/"
              ],
              "scripts": {
                "build": "grunt template",
                "coveralls": "istanbul cover --verbose --dir 'coverage' 'tests/tests.js' && coveralls < coverage/lcov.info'",
                "cover": "istanbul cover --report 'html' --verbose --dir 'coverage' 'tests/tests.js'",
                "test": "mocha tests"
              },
              "devDependencies": {
                "coveralls": "^2.11.6",
                "grunt": "^0.4.5",
                "grunt-template": "^0.2.3",
                "istanbul": "^0.4.2",
                "mocha": "*",
                "regenerate": "^1.3.0",
                "requirejs": "^2.1.22"
              }
            })
          },
          "source-map": {
            "package.json": JSON.stringify({
              "name": "source-map",
              "description": "Generates and consumes source maps",
              "version": "0.5.7",
              "homepage": "https://github.com/mozilla/source-map",
              "author": "Nick Fitzgerald <nfitzgerald@mozilla.com>",
              "contributors": [
                "Tobias Koppers <tobias.koppers@googlemail.com>",
                "Duncan Beevers <duncan@dweebd.com>",
                "Stephen Crane <scrane@mozilla.com>",
                "Ryan Seddon <seddon.ryan@gmail.com>",
                "Miles Elam <miles.elam@deem.com>",
                "Mihai Bazon <mihai.bazon@gmail.com>",
                "Michael Ficarra <github.public.email@michael.ficarra.me>",
                "Todd Wolfson <todd@twolfson.com>",
                "Alexander Solovyov <alexander@solovyov.net>",
                "Felix Gnass <fgnass@gmail.com>",
                "Conrad Irwin <conrad.irwin@gmail.com>",
                "usrbincc <usrbincc@yahoo.com>",
                "David Glasser <glasser@davidglasser.net>",
                "Chase Douglas <chase@newrelic.com>",
                "Evan Wallace <evan.exe@gmail.com>",
                "Heather Arthur <fayearthur@gmail.com>",
                "Hugh Kennedy <hughskennedy@gmail.com>",
                "David Glasser <glasser@davidglasser.net>",
                "Simon Lydell <simon.lydell@gmail.com>",
                "Jmeas Smith <jellyes2@gmail.com>",
                "Michael Z Goddard <mzgoddard@gmail.com>",
                "azu <azu@users.noreply.github.com>",
                "John Gozde <john@gozde.ca>",
                "Adam Kirkton <akirkton@truefitinnovation.com>",
                "Chris Montgomery <christopher.montgomery@dowjones.com>",
                "J. Ryan Stinnett <jryans@gmail.com>",
                "Jack Herrington <jherrington@walmartlabs.com>",
                "Chris Truter <jeffpalentine@gmail.com>",
                "Daniel Espeset <daniel@danielespeset.com>",
                "Jamie Wong <jamie.lf.wong@gmail.com>",
                "Eddy Bruël <ejpbruel@mozilla.com>",
                "Hawken Rives <hawkrives@gmail.com>",
                "Gilad Peleg <giladp007@gmail.com>",
                "djchie <djchie.dev@gmail.com>",
                "Gary Ye <garysye@gmail.com>",
                "Nicolas Lalevée <nicolas.lalevee@hibnet.org>"
              ],
              "repository": {
                "type": "git",
                "url": "http://github.com/mozilla/source-map.git"
              },
              "main": "./source-map.js",
              "files": [
                "source-map.js",
                "lib/",
                "dist/source-map.debug.js",
                "dist/source-map.js",
                "dist/source-map.min.js",
                "dist/source-map.min.js.map"
              ],
              "engines": {
                "node": ">=0.10.0"
              },
              "license": "BSD-3-Clause",
              "scripts": {
                "test": "npm run build && node test/run-tests.js",
                "build": "webpack --color",
                "toc": "doctoc --title '## Table of Contents' README.md && doctoc --title '## Table of Contents' CONTRIBUTING.md"
              },
              "devDependencies": {
                "doctoc": "^0.15.0",
                "webpack": "^1.12.0"
              },
              "typings": "source-map"
            })
          }
        },
        "package.json": JSON.stringify({
          "name": "@babel/generator",
          "version": "7.5.0",
          "description": "Turns an AST into code.",
          "author": "Sebastian McKenzie <sebmck@gmail.com>",
          "homepage": "https://babeljs.io/",
          "license": "MIT",
          "publishConfig": {
            "access": "public"
          },
          "repository": "https://github.com/babel/babel/tree/master/packages/babel-generator",
          "main": "lib/index.js",
          "files": [
            "lib"
          ],
          "dependencies": {
            "@babel/types": "^7.5.0",
            "jsesc": "^2.5.1",
            "lodash": "^4.17.11",
            "source-map": "^0.5.0",
            "trim-right": "^1.0.1"
          },
          "devDependencies": {
            "@babel/helper-fixtures": "^7.4.4",
            "@babel/parser": "^7.5.0"
          },
          "gitHead": "49da9a07c81156e997e60146eb001ea77b7044c4"
        })
      },
      "helper-function-name": {
        "package.json": JSON.stringify({
          "name": "@babel/helper-function-name",
          "version": "7.1.0",
          "description": "Helper function to change the property 'name' of every function",
          "repository": "https://github.com/babel/babel/tree/master/packages/babel-helper-function-name",
          "license": "MIT",
          "publishConfig": {
            "access": "public"
          },
          "main": "lib/index.js",
          "dependencies": {
            "@babel/helper-get-function-arity": "^7.0.0",
            "@babel/template": "^7.1.0",
            "@babel/types": "^7.0.0"
          }
        })
      },
      "helper-get-function-arity": {
        "package.json": JSON.stringify({
          "name": "@babel/helper-get-function-arity",
          "version": "7.0.0",
          "description": "Helper function to get function arity",
          "repository": "https://github.com/babel/babel/tree/master/packages/babel-helper-get-function-arity",
          "license": "MIT",
          "main": "lib/index.js",
          "dependencies": {
            "@babel/types": "^7.0.0"
          }
        })
      },
      "helper-split-export-declaration": {
        "package.json": JSON.stringify({
          "name": "@babel/helper-split-export-declaration",
          "version": "7.4.4",
          "description": "",
          "repository": "https://github.com/babel/babel/tree/master/packages/babel-helper-split-export-declaration",
          "license": "MIT",
          "publishConfig": {
            "access": "public"
          },
          "main": "lib/index.js",
          "dependencies": {
            "@babel/types": "^7.4.4"
          },
          "gitHead": "2c88694388831b1e5b88e4bbed6781eb2be1edba"
        })
      },
      "highlight": {
        "package.json": JSON.stringify({
          "name": "@babel/highlight",
          "version": "7.5.0",
          "description": "Syntax highlight JavaScript strings for output in terminals.",
          "author": "suchipi <me@suchipi.com>",
          "homepage": "https://babeljs.io/",
          "license": "MIT",
          "publishConfig": {
            "access": "public"
          },
          "repository": "https://github.com/babel/babel/tree/master/packages/babel-highlight",
          "main": "lib/index.js",
          "dependencies": {
            "chalk": "^2.0.0",
            "esutils": "^2.0.2",
            "js-tokens": "^4.0.0"
          },
          "devDependencies": {
            "strip-ansi": "^4.0.0"
          },
          "gitHead": "49da9a07c81156e997e60146eb001ea77b7044c4"
        })
      },
      "parser": {
        "package.json": JSON.stringify({
          "name": "@babel/parser",
          "version": "7.5.0",
          "description": "A JavaScript parser",
          "author": "Sebastian McKenzie <sebmck@gmail.com>",
          "homepage": "https://babeljs.io/",
          "license": "MIT",
          "publishConfig": {
            "tag": "next"
          },
          "keywords": [
            "babel",
            "javascript",
            "parser",
            "tc39",
            "ecmascript",
            "@babel/parser"
          ],
          "repository": "https://github.com/babel/babel/tree/master/packages/babel-parser",
          "main": "lib/index.js",
          "types": "typings/babel-parser.d.ts",
          "files": [
            "bin",
            "lib",
            "typings"
          ],
          "engines": {
            "node": ">=6.0.0"
          },
          "devDependencies": {
            "@babel/code-frame": "^7.0.0",
            "@babel/helper-fixtures": "^7.4.4",
            "charcodes": "^0.2.0",
            "unicode-12.0.0": "^0.7.9"
          },
          "bin": {
            "parser": "./bin/babel-parser.js"
          },
          "gitHead": "49da9a07c81156e997e60146eb001ea77b7044c4"
        })
      },
      "runtime": {
        "package.json": JSON.stringify({
          "name": "@babel/runtime",
          "version": "7.5.2",
          "description": "babel's modular runtime helpers",
          "license": "MIT",
          "publishConfig": {
            "access": "public"
          },
          "repository": "https://github.com/babel/babel/tree/master/packages/babel-runtime",
          "author": "Sebastian McKenzie <sebmck@gmail.com>",
          "dependencies": {
            "regenerator-runtime": "^0.13.2"
          },
          "devDependencies": {
            "@babel/helpers": "^7.5.2"
          },
          "gitHead": "0dbf99bedb1d82b8414685181416c19336dd0d96"
        })
      },
      "template": {
        "package.json": JSON.stringify({
          "name": "@babel/template",
          "version": "7.4.4",
          "description": "Generate an AST from a string template.",
          "author": "Sebastian McKenzie <sebmck@gmail.com>",
          "homepage": "https://babeljs.io/",
          "license": "MIT",
          "publishConfig": {
            "access": "public"
          },
          "repository": "https://github.com/babel/babel/tree/master/packages/babel-template",
          "main": "lib/index.js",
          "dependencies": {
            "@babel/code-frame": "^7.0.0",
            "@babel/parser": "^7.4.4",
            "@babel/types": "^7.4.4"
          },
          "gitHead": "2c88694388831b1e5b88e4bbed6781eb2be1edba"
        })
      },
      "traverse": {
        "node_modules": {
          "debug": {
            "package.json": JSON.stringify({
              "name": "debug",
              "version": "4.1.1",
              "repository": {
                "type": "git",
                "url": "git://github.com/visionmedia/debug.git"
              },
              "description": "small debugging utility",
              "keywords": [
                "debug",
                "log",
                "debugger"
              ],
              "files": [
                "src",
                "dist/debug.js",
                "LICENSE",
                "README.md"
              ],
              "author": "TJ Holowaychuk <tj@vision-media.ca>",
              "contributors": [
                "Nathan Rajlich <nathan@tootallnate.net> (http://n8.io)",
                "Andrew Rhyne <rhyneandrew@gmail.com>"
              ],
              "license": "MIT",
              "scripts": {
                "lint": "xo",
                "test": "npm run test:node && npm run test:browser",
                "test:node": "istanbul cover _mocha -- test.js",
                "pretest:browser": "npm run build",
                "test:browser": "karma start --single-run",
                "prebuild:debug": "mkdir -p dist && browserify --standalone debug -o dist/debug.es6.js .",
                "build:debug": "babel -o dist/debug.js dist/debug.es6.js > dist/debug.js",
                "build:test": "babel -d dist test.js",
                "build": "npm run build:debug && npm run build:test",
                "clean": "rimraf dist coverage",
                "test:coverage": "cat ./coverage/lcov.info | coveralls"
              },
              "dependencies": {
                "ms": "^2.1.1"
              },
              "devDependencies": {
                "@babel/cli": "^7.0.0",
                "@babel/core": "^7.0.0",
                "@babel/preset-env": "^7.0.0",
                "browserify": "14.4.0",
                "chai": "^3.5.0",
                "concurrently": "^3.1.0",
                "coveralls": "^3.0.2",
                "istanbul": "^0.4.5",
                "karma": "^3.0.0",
                "karma-chai": "^0.1.0",
                "karma-mocha": "^1.3.0",
                "karma-phantomjs-launcher": "^1.0.2",
                "mocha": "^5.2.0",
                "mocha-lcov-reporter": "^1.2.0",
                "rimraf": "^2.5.4",
                "xo": "^0.23.0"
              },
              "main": "./src/index.js",
              "browser": "./src/browser.js",
              "unpkg": "./dist/debug.js"
            })
          }
        },
        "package.json": JSON.stringify({
          "name": "@babel/traverse",
          "version": "7.5.0",
          "description": "The Babel Traverse module maintains the overall tree state, and is responsible for replacing, removing, and adding nodes",
          "author": "Sebastian McKenzie <sebmck@gmail.com>",
          "homepage": "https://babeljs.io/",
          "license": "MIT",
          "publishConfig": {
            "access": "public"
          },
          "repository": "https://github.com/babel/babel/tree/master/packages/babel-traverse",
          "main": "lib/index.js",
          "dependencies": {
            "@babel/code-frame": "^7.0.0",
            "@babel/generator": "^7.5.0",
            "@babel/helper-function-name": "^7.1.0",
            "@babel/helper-split-export-declaration": "^7.4.4",
            "@babel/parser": "^7.5.0",
            "@babel/types": "^7.5.0",
            "debug": "^4.1.0",
            "globals": "^11.1.0",
            "lodash": "^4.17.11"
          },
          "devDependencies": {
            "@babel/helper-plugin-test-runner": "^7.0.0"
          },
          "gitHead": "49da9a07c81156e997e60146eb001ea77b7044c4"
        })
      },
      "types": {
        "node_modules": {
          "to-fast-properties": {
            "package.json": JSON.stringify({
              "name": "to-fast-properties",
              "version": "2.0.0",
              "description": "Force V8 to use fast properties for an object",
              "license": "MIT",
              "repository": "sindresorhus/to-fast-properties",
              "author": {
                "name": "Sindre Sorhus",
                "email": "sindresorhus@gmail.com",
                "url": "sindresorhus.com"
              },
              "engines": {
                "node": ">=4"
              },
              "scripts": {
                "test": "node --allow-natives-syntax test.js"
              },
              "files": [
                "index.js"
              ],
              "keywords": [
                "object",
                "obj",
                "properties",
                "props",
                "v8",
                "optimize",
                "fast",
                "convert",
                "mode"
              ],
              "devDependencies": {
                "ava": "0.0.4"
              }
            })
          }
        },
        "package.json": JSON.stringify({
          "name": "@babel/types",
          "version": "7.5.0",
          "description": "Babel Types is a Lodash-esque utility library for AST nodes",
          "author": "Sebastian McKenzie <sebmck@gmail.com>",
          "homepage": "https://babeljs.io/",
          "license": "MIT",
          "repository": "https://github.com/babel/babel/tree/master/packages/babel-types",
          "main": "lib/index.js",
          "types": "lib/index.d.ts",
          "dependencies": {
            "esutils": "^2.0.2",
            "lodash": "^4.17.11",
            "to-fast-properties": "^2.0.0"
          },
          "devDependencies": {
            "@babel/generator": "^7.5.0",
            "@babel/parser": "^7.5.0"
          },
          "gitHead": "49da9a07c81156e997e60146eb001ea77b7044c4"
        })
      }
    },
    "@types": {
      "prop-types": {
        "package.json": JSON.stringify({
          "name": "@types/prop-types",
          "version": "15.7.1",
          "description": "TypeScript definitions for prop-types",
          "license": "MIT",
          "contributors": [
            {
              "name": "DovydasNavickas",
              "url": "https://github.com/DovydasNavickas",
              "githubUsername": "DovydasNavickas"
            },
            {
              "name": "Ferdy Budhidharma",
              "url": "https://github.com/ferdaber",
              "githubUsername": "ferdaber"
            },
            {
              "name": "Sebastian Silbermann",
              "url": "https://github.com/eps1lon",
              "githubUsername": "eps1lon"
            }
          ],
          "main": "",
          "types": "index",
          "repository": {
            "type": "git",
            "url": "https://github.com/DefinitelyTyped/DefinitelyTyped.git",
            "directory": "types/prop-types"
          },
          "scripts": {},
          "dependencies": {},
          "typesPublisherContentHash": "428a2d0735bad0c54710672c573a150461a21fe06b7729a430a049a288c5d991",
          "typeScriptVersion": "2.8"
        })
      },
      "react": {
        "package.json": JSON.stringify({
          "name": "@types/react",
          "version": "16.8.23",
          "description": "TypeScript definitions for React",
          "license": "MIT",
          "contributors": [
            {
              "name": "Asana",
              "url": "https://asana.com"
            },
            {
              "name": "AssureSign",
              "url": "http://www.assuresign.com"
            },
            {
              "name": "Microsoft",
              "url": "https://microsoft.com"
            },
            {
              "name": "John Reilly",
              "url": "https://github.com/johnnyreilly",
              "githubUsername": "johnnyreilly"
            },
            {
              "name": "Benoit Benezech",
              "url": "https://github.com/bbenezech",
              "githubUsername": "bbenezech"
            },
            {
              "name": "Patricio Zavolinsky",
              "url": "https://github.com/pzavolinsky",
              "githubUsername": "pzavolinsky"
            },
            {
              "name": "Digiguru",
              "url": "https://github.com/digiguru",
              "githubUsername": "digiguru"
            },
            {
              "name": "Eric Anderson",
              "url": "https://github.com/ericanderson",
              "githubUsername": "ericanderson"
            },
            {
              "name": "Dovydas Navickas",
              "url": "https://github.com/DovydasNavickas",
              "githubUsername": "DovydasNavickas"
            },
            {
              "name": "Stéphane Goetz",
              "url": "https://github.com/onigoetz",
              "githubUsername": "onigoetz"
            },
            {
              "name": "Josh Rutherford",
              "url": "https://github.com/theruther4d",
              "githubUsername": "theruther4d"
            },
            {
              "name": "Guilherme Hübner",
              "url": "https://github.com/guilhermehubner",
              "githubUsername": "guilhermehubner"
            },
            {
              "name": "Ferdy Budhidharma",
              "url": "https://github.com/ferdaber",
              "githubUsername": "ferdaber"
            },
            {
              "name": "Johann Rakotoharisoa",
              "url": "https://github.com/jrakotoharisoa",
              "githubUsername": "jrakotoharisoa"
            },
            {
              "name": "Olivier Pascal",
              "url": "https://github.com/pascaloliv",
              "githubUsername": "pascaloliv"
            },
            {
              "name": "Martin Hochel",
              "url": "https://github.com/hotell",
              "githubUsername": "hotell"
            },
            {
              "name": "Frank Li",
              "url": "https://github.com/franklixuefei",
              "githubUsername": "franklixuefei"
            },
            {
              "name": "Jessica Franco",
              "url": "https://github.com/Jessidhia",
              "githubUsername": "Jessidhia"
            },
            {
              "name": "Saransh Kataria",
              "url": "https://github.com/saranshkataria",
              "githubUsername": "saranshkataria"
            },
            {
              "name": "Kanitkorn Sujautra",
              "url": "https://github.com/lukyth",
              "githubUsername": "lukyth"
            },
            {
              "name": "Sebastian Silbermann",
              "url": "https://github.com/eps1lon",
              "githubUsername": "eps1lon"
            }
          ],
          "main": "",
          "types": "index",
          "repository": {
            "type": "git",
            "url": "https://github.com/DefinitelyTyped/DefinitelyTyped.git",
            "directory": "types/react"
          },
          "scripts": {},
          "dependencies": {
            "@types/prop-types": "*",
            "csstype": "^2.2.0"
          },
          "typesPublisherContentHash": "f1328612b59aba18da02a2a55080f36bca3ff3d2bb1278d02e50712e501e6318",
          "typeScriptVersion": "2.8"
        })
      }
    },
    "ajv": {
      "package.json": JSON.stringify({
        "name": "ajv",
        "version": "6.10.1",
        "description": "Another JSON Schema Validator",
        "main": "lib/ajv.js",
        "typings": "lib/ajv.d.ts",
        "files": [
          "lib/",
          "dist/",
          "scripts/",
          "LICENSE",
          ".tonic_example.js"
        ],
        "scripts": {
          "eslint": "eslint lib/{compile/,}*.js spec/{**/,}*.js scripts --ignore-pattern spec/JSON-Schema-Test-Suite",
          "jshint": "jshint lib/{compile/,}*.js",
          "lint": "npm run jshint && npm run eslint",
          "test-spec": "mocha spec/{**/,}*.spec.js -R spec",
          "test-fast": "AJV_FAST_TEST=true npm run test-spec",
          "test-debug": "npm run test-spec -- --inspect-brk",
          "test-cov": "nyc npm run test-spec",
          "test-ts": "tsc --target ES5 --noImplicitAny --noEmit spec/typescript/index.ts",
          "bundle": "del-cli dist && node ./scripts/bundle.js . Ajv pure_getters",
          "bundle-beautify": "node ./scripts/bundle.js js-beautify",
          "build": "del-cli lib/dotjs/*.js \"!lib/dotjs/index.js\" && node scripts/compile-dots.js",
          "test-karma": "karma start",
          "test-browser": "del-cli .browser && npm run bundle && scripts/prepare-tests && npm run test-karma",
          "test-all": "npm run test-ts && npm run test-cov && if-node-version 10 npm run test-browser",
          "test": "npm run lint && npm run build && npm run test-all",
          "prepublish": "npm run build && npm run bundle",
          "watch": "watch \"npm run build\" ./lib/dot"
        },
        "nyc": {
          "exclude": [
            "**/spec/**",
            "node_modules"
          ],
          "reporter": [
            "lcov",
            "text-summary"
          ]
        },
        "repository": {
          "type": "git",
          "url": "https://github.com/epoberezkin/ajv.git"
        },
        "keywords": [
          "JSON",
          "schema",
          "validator",
          "validation",
          "jsonschema",
          "json-schema",
          "json-schema-validator",
          "json-schema-validation"
        ],
        "author": "Evgeny Poberezkin",
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/epoberezkin/ajv/issues"
        },
        "homepage": "https://github.com/epoberezkin/ajv",
        "tonicExampleFilename": ".tonic_example.js",
        "dependencies": {
          "fast-deep-equal": "^2.0.1",
          "fast-json-stable-stringify": "^2.0.0",
          "json-schema-traverse": "^0.4.1",
          "uri-js": "^4.2.2"
        },
        "devDependencies": {
          "ajv-async": "^1.0.0",
          "bluebird": "^3.5.3",
          "brfs": "^2.0.0",
          "browserify": "^16.2.0",
          "chai": "^4.0.1",
          "coveralls": "^3.0.1",
          "del-cli": "^2.0.0",
          "dot": "^1.0.3",
          "eslint": "^6.0.0",
          "gh-pages-generator": "^0.2.3",
          "glob": "^7.0.0",
          "if-node-version": "^1.0.0",
          "js-beautify": "^1.7.3",
          "jshint": "^2.10.2",
          "json-schema-test": "^2.0.0",
          "karma": "^4.0.1",
          "karma-chrome-launcher": "^2.2.0",
          "karma-mocha": "^1.1.1",
          "karma-sauce-launcher": "^2.0.0",
          "mocha": "^6.0.0",
          "nyc": "^14.0.0",
          "pre-commit": "^1.1.1",
          "require-globify": "^1.3.0",
          "typescript": "^2.8.3",
          "uglify-js": "^3.3.24",
          "watch": "^1.0.0"
        }
      })
    },
    "ansi-escapes": {
      "package.json": JSON.stringify({
        "name": "ansi-escapes",
        "version": "3.2.0",
        "description": "ANSI escape codes for manipulating the terminal",
        "license": "MIT",
        "repository": "sindresorhus/ansi-escapes",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "ansi",
          "terminal",
          "console",
          "cli",
          "string",
          "tty",
          "escape",
          "escapes",
          "formatting",
          "shell",
          "xterm",
          "log",
          "logging",
          "command-line",
          "text",
          "vt100",
          "sequence",
          "control",
          "code",
          "codes",
          "cursor",
          "iterm",
          "iterm2"
        ],
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        }
      })
    },
    "ansi-regex": {
      "package.json": JSON.stringify({
        "name": "ansi-regex",
        "version": "2.1.1",
        "description": "Regular expression for matching ANSI escape codes",
        "license": "MIT",
        "repository": "chalk/ansi-regex",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "maintainers": [
          "Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)",
          "Joshua Appelman <jappelman@xebia.com> (jbnicolai.com)",
          "JD Ballard <i.am.qix@gmail.com> (github.com/qix-)"
        ],
        "engines": {
          "node": ">=0.10.0"
        },
        "scripts": {
          "test": "xo && ava --verbose",
          "view-supported": "node fixtures/view-codes.js"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "ansi",
          "styles",
          "color",
          "colour",
          "colors",
          "terminal",
          "console",
          "cli",
          "string",
          "tty",
          "escape",
          "formatting",
          "rgb",
          "256",
          "shell",
          "xterm",
          "command-line",
          "text",
          "regex",
          "regexp",
          "re",
          "match",
          "test",
          "find",
          "pattern"
        ],
        "devDependencies": {
          "ava": "0.17.0",
          "xo": "0.16.0"
        },
        "xo": {
          "rules": {
            "guard-for-in": 0,
            "no-loop-func": 0
          }
        }
      })
    },
    "ansi-styles": {
      "package.json": JSON.stringify({
        "name": "ansi-styles",
        "version": "3.2.1",
        "description": "ANSI escape codes for styling strings in the terminal",
        "license": "MIT",
        "repository": "chalk/ansi-styles",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && ava",
          "screenshot": "svg-term --command='node screenshot' --out=screenshot.svg --padding=3 --width=55 --height=3 --at=1000 --no-cursor"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "ansi",
          "styles",
          "color",
          "colour",
          "colors",
          "terminal",
          "console",
          "cli",
          "string",
          "tty",
          "escape",
          "formatting",
          "rgb",
          "256",
          "shell",
          "xterm",
          "log",
          "logging",
          "command-line",
          "text"
        ],
        "dependencies": {
          "color-convert": "^1.9.0"
        },
        "devDependencies": {
          "ava": "*",
          "babel-polyfill": "^6.23.0",
          "svg-term-cli": "^2.1.1",
          "xo": "*"
        },
        "ava": {
          "require": "babel-polyfill"
        }
      })
    },
    "ansicolors": {
      "package.json": JSON.stringify({
        "name": "ansicolors",
        "version": "0.3.2",
        "description": "Functions that surround a string with ansicolor codes so it prints in color.",
        "main": "ansicolors.js",
        "scripts": {
          "test": "node test/*.js"
        },
        "repository": {
          "type": "git",
          "url": "git://github.com/thlorenz/ansicolors.git"
        },
        "keywords": [
          "ansi",
          "colors",
          "highlight",
          "string"
        ],
        "author": "Thorsten Lorenz <thlorenz@gmx.de> (thlorenz.com)",
        "license": "MIT",
        "readmeFilename": "README.md",
        "gitHead": "858847ca28e8b360d9b70eee0592700fa2ab087d"
      })
    },
    "anymatch": {
      "package.json": JSON.stringify({
        "name": "anymatch",
        "version": "3.1.1",
        "description": "Matches strings against configurable strings, globs, regular expressions, and/or functions",
        "files": [
          "index.js",
          "index.d.ts"
        ],
        "dependencies": {
          "normalize-path": "^3.0.0",
          "picomatch": "^2.0.4"
        },
        "author": {
          "name": "Elan Shanker",
          "url": "https://github.com/es128"
        },
        "license": "ISC",
        "homepage": "https://github.com/micromatch/anymatch",
        "repository": {
          "type": "git",
          "url": "https://github.com/micromatch/anymatch"
        },
        "keywords": [
          "match",
          "any",
          "string",
          "file",
          "fs",
          "list",
          "glob",
          "regex",
          "regexp",
          "regular",
          "expression",
          "function"
        ],
        "scripts": {
          "test": "nyc mocha",
          "mocha": "mocha"
        },
        "devDependencies": {
          "mocha": "^6.1.3",
          "nyc": "^14.0.0"
        },
        "engines": {
          "node": ">= 8"
        }
      })
    },
    "append-transform": {
      "package.json": JSON.stringify({
        "name": "append-transform",
        "version": "1.0.0",
        "description": "Install a transform to `require.extensions` that always runs last, even if additional extensions are added later.",
        "license": "MIT",
        "repository": "istanbuljs/append-transform",
        "author": {
          "name": "James Talmage",
          "email": "james@talmage.io",
          "url": "github.com/jamestalmage"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "pretest": "xo",
          "test": "nyc --reporter=lcov --reporter=text ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "transform",
          "require",
          "append",
          "last",
          "coverage",
          "source-map",
          "extension",
          "module"
        ],
        "dependencies": {
          "default-require-extensions": "^2.0.0"
        },
        "devDependencies": {
          "ava": "^0.24.0",
          "coveralls": "^3.0.0",
          "fake-module-system": "^0.3.0",
          "nyc": "^11.3.0",
          "xo": "^0.15.1"
        },
        "xo": {
          "ignores": [
            "test/_mock-module-system.js"
          ]
        }
      })
    },
    "archy": {
      "package.json": JSON.stringify({
        "name": "archy",
        "version": "1.0.0",
        "description": "render nested hierarchies `npm ls` style with unicode pipes",
        "main": "index.js",
        "devDependencies": {
          "tap": "~0.3.3",
          "tape": "~0.1.1"
        },
        "scripts": {
          "test": "tap test"
        },
        "testling": {
          "files": "test/*.js",
          "browsers": {
            "iexplore": [
              "6.0",
              "7.0",
              "8.0",
              "9.0"
            ],
            "chrome": [
              "20.0"
            ],
            "firefox": [
              "10.0",
              "15.0"
            ],
            "safari": [
              "5.1"
            ],
            "opera": [
              "12.0"
            ]
          }
        },
        "repository": {
          "type": "git",
          "url": "http://github.com/substack/node-archy.git"
        },
        "keywords": [
          "hierarchy",
          "npm ls",
          "unicode",
          "pretty",
          "print"
        ],
        "author": {
          "name": "James Halliday",
          "email": "mail@substack.net",
          "url": "http://substack.net"
        },
        "license": "MIT"
      })
    },
    "arg": {
      "package.json": JSON.stringify({
        "name": "arg",
        "version": "4.1.0",
        "description": "Another simple argument parser",
        "main": "index.js",
        "types": "index.d.ts",
        "repository": "zeit/arg",
        "author": "Josh Junon <junon@zeit.co>",
        "license": "MIT",
        "files": [
          "index.js",
          "index.d.ts"
        ],
        "scripts": {
          "pretest": "xo",
          "test": "WARN_EXIT=1 jest --coverage -w 2"
        },
        "xo": {
          "rules": {
            "complexity": 0,
            "max-depth": 0
          }
        },
        "devDependencies": {
          "chai": "^4.1.1",
          "jest": "^20.0.4",
          "xo": "^0.18.2"
        }
      })
    },
    "argparse": {
      "package.json": JSON.stringify({
        "name": "argparse",
        "description": "Very powerful CLI arguments parser. Native port of argparse - python's options parsing library",
        "version": "1.0.10",
        "keywords": [
          "cli",
          "parser",
          "argparse",
          "option",
          "args"
        ],
        "contributors": [
          "Eugene Shkuropat",
          "Paul Jacobson"
        ],
        "files": [
          "index.js",
          "lib/"
        ],
        "license": "MIT",
        "repository": "nodeca/argparse",
        "scripts": {
          "test": "make test"
        },
        "dependencies": {
          "sprintf-js": "~1.0.2"
        },
        "devDependencies": {
          "eslint": "^2.13.1",
          "istanbul": "^0.4.5",
          "mocha": "^3.1.0",
          "ndoc": "^5.0.1"
        }
      })
    },
    "arrify": {
      "package.json": JSON.stringify({
        "name": "arrify",
        "version": "1.0.1",
        "description": "Convert a value to an array",
        "license": "MIT",
        "repository": "sindresorhus/arrify",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=0.10.0"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "array",
          "arr",
          "arrify",
          "arrayify",
          "convert",
          "value"
        ],
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        }
      })
    },
    "asn1": {
      "package.json": JSON.stringify({
        "author": "Joyent (joyent.com)",
        "contributors": [
          "Mark Cavage <mcavage@gmail.com>",
          "David Gwynne <loki@animata.net>",
          "Yunong Xiao <yunong@joyent.com>",
          "Alex Wilson <alex.wilson@joyent.com>"
        ],
        "name": "asn1",
        "description": "Contains parsers and serializers for ASN.1 (currently BER only)",
        "version": "0.2.4",
        "repository": {
          "type": "git",
          "url": "git://github.com/joyent/node-asn1.git"
        },
        "main": "lib/index.js",
        "dependencies": {
          "safer-buffer": "~2.1.0"
        },
        "devDependencies": {
          "istanbul": "^0.3.6",
          "faucet": "0.0.1",
          "tape": "^3.5.0",
          "eslint": "2.13.1",
          "eslint-plugin-joyent": "~1.3.0"
        },
        "scripts": {
          "test": "./node_modules/.bin/tape ./test/ber/*.test.js"
        },
        "license": "MIT"
      })
    },
    "assert-plus": {
      "package.json": JSON.stringify({
        "author": "Mark Cavage <mcavage@gmail.com>",
        "name": "assert-plus",
        "description": "Extra assertions on top of node's assert module",
        "version": "1.0.0",
        "license": "MIT",
        "main": "./assert.js",
        "devDependencies": {
          "tape": "4.2.2",
          "faucet": "0.0.1"
        },
        "optionalDependencies": {},
        "scripts": {
          "test": "./node_modules/.bin/tape tests/*.js | ./node_modules/.bin/faucet"
        },
        "repository": {
          "type": "git",
          "url": "https://github.com/mcavage/node-assert-plus.git"
        },
        "engines": {
          "node": ">=0.8"
        }
      })
    },
    "astral-regex": {
      "package.json": JSON.stringify({
        "name": "astral-regex",
        "version": "1.0.0",
        "description": "Regular expression for matching astral symbols",
        "license": "MIT",
        "repository": "kevva/astral-regex",
        "author": {
          "name": "Kevin Mårtensson",
          "email": "kevinmartensson@gmail.com",
          "url": "github.com/kevva"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "astral",
          "emoji",
          "regex",
          "surrogate"
        ],
        "dependencies": {},
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        }
      })
    },
    "async-hook-domain": {
      "node_modules": {
        "source-map-support": {
          "package.json": JSON.stringify({
            "name": "source-map-support",
            "description": "Fixes stack traces for files with source maps",
            "version": "0.5.12",
            "main": "./source-map-support.js",
            "scripts": {
              "build": "node build.js",
              "serve-tests": "http-server -p 1336",
              "prepublish": "npm run build",
              "test": "mocha"
            },
            "dependencies": {
              "buffer-from": "^1.0.0",
              "source-map": "^0.6.0"
            },
            "devDependencies": {
              "browserify": "^4.2.3",
              "coffeescript": "^1.12.7",
              "http-server": "^0.11.1",
              "mocha": "^3.5.3",
              "webpack": "^1.15.0"
            },
            "repository": {
              "type": "git",
              "url": "https://github.com/evanw/node-source-map-support"
            },
            "bugs": {
              "url": "https://github.com/evanw/node-source-map-support/issues"
            },
            "license": "MIT"
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "async-hook-domain",
        "version": "1.1.3",
        "description": "An implementation of Domain-like error handling, built on async_hooks",
        "main": "index.js",
        "directories": {
          "test": "test"
        },
        "dependencies": {
          "source-map-support": "^0.5.11"
        },
        "devDependencies": {
          "tap": "^14.6.6"
        },
        "scripts": {
          "test": "tap --node-arg=test/run.js test/fixtures",
          "snap": "tap --node-arg=test/run.js test/fixtures",
          "preversion": "npm test",
          "postversion": "npm publish",
          "postpublish": "git push origin --follow-tags"
        },
        "tap": {
          "check-coverage": true
        },
        "repository": {
          "type": "git",
          "url": "git://github.com/isaacs/async-hook-domain.git"
        },
        "keywords": [
          "async",
          "hooks",
          "async_hooks",
          "domain",
          "error",
          "handling",
          "handler",
          "uncaughtException",
          "unhandledRejection",
          "catch",
          "promise",
          "execution",
          "context"
        ],
        "author": "Isaac Z. Schlueter <i@izs.me> (https://blog.izs.me)",
        "license": "ISC",
        "files": [
          "index.js"
        ]
      })
    },
    "asynckit": {
      "package.json": JSON.stringify({
        "name": "asynckit",
        "version": "0.4.0",
        "description": "Minimal async jobs utility library, with streams support",
        "main": "index.js",
        "scripts": {
          "clean": "rimraf coverage",
          "lint": "eslint *.js lib/*.js test/*.js",
          "test": "istanbul cover --reporter=json tape -- 'test/test-*.js' | tap-spec",
          "win-test": "tape test/test-*.js",
          "browser": "browserify -t browserify-istanbul test/lib/browserify_adjustment.js test/test-*.js | obake --coverage | tap-spec",
          "report": "istanbul report",
          "size": "browserify index.js | size-table asynckit",
          "debug": "tape test/test-*.js"
        },
        "pre-commit": [
          "clean",
          "lint",
          "test",
          "browser",
          "report",
          "size"
        ],
        "repository": {
          "type": "git",
          "url": "git+https://github.com/alexindigo/asynckit.git"
        },
        "keywords": [
          "async",
          "jobs",
          "parallel",
          "serial",
          "iterator",
          "array",
          "object",
          "stream",
          "destroy",
          "terminate",
          "abort"
        ],
        "author": "Alex Indigo <iam@alexindigo.com>",
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/alexindigo/asynckit/issues"
        },
        "homepage": "https://github.com/alexindigo/asynckit#readme",
        "devDependencies": {
          "browserify": "^13.0.0",
          "browserify-istanbul": "^2.0.0",
          "coveralls": "^2.11.9",
          "eslint": "^2.9.0",
          "istanbul": "^0.4.3",
          "obake": "^0.1.2",
          "phantomjs-prebuilt": "^2.1.7",
          "pre-commit": "^1.1.3",
          "reamde": "^1.1.0",
          "rimraf": "^2.5.2",
          "size-table": "^0.2.0",
          "tap-spec": "^4.1.1",
          "tape": "^4.5.1"
        },
        "dependencies": {}
      })
    },
    "auto-bind": {
      "package.json": JSON.stringify({
        "name": "auto-bind",
        "version": "2.1.0",
        "description": "Automatically bind methods to their class instance",
        "license": "MIT",
        "repository": "sindresorhus/auto-bind",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=6"
        },
        "scripts": {
          "test": "xo && ava && tsd"
        },
        "files": [
          "index.js",
          "index.d.ts"
        ],
        "keywords": [
          "auto",
          "bind",
          "class",
          "methods",
          "method",
          "automatically",
          "prototype",
          "instance",
          "function",
          "this",
          "self",
          "react",
          "component"
        ],
        "dependencies": {
          "@types/react": "^16.8.12"
        },
        "devDependencies": {
          "ava": "^1.4.1",
          "tsd": "^0.7.2",
          "xo": "^0.24.0"
        }
      })
    },
    "aws-sign2": {
      "package.json": JSON.stringify({
        "author": "Mikeal Rogers <mikeal.rogers@gmail.com> (http://www.futurealoof.com)",
        "name": "aws-sign2",
        "description": "AWS signing. Originally pulled from LearnBoost/knox, maintained as vendor in request, now a standalone module.",
        "version": "0.7.0",
        "repository": {
          "url": "https://github.com/mikeal/aws-sign"
        },
        "license": "Apache-2.0",
        "main": "index.js",
        "dependencies": {},
        "devDependencies": {},
        "optionalDependencies": {},
        "engines": {
          "node": "*"
        }
      })
    },
    "aws4": {
      "package.json": JSON.stringify({
        "name": "aws4",
        "version": "1.8.0",
        "description": "Signs and prepares requests using AWS Signature Version 4",
        "author": "Michael Hart <michael.hart.au@gmail.com> (http://github.com/mhart)",
        "main": "aws4.js",
        "keywords": [
          "amazon",
          "aws",
          "signature",
          "s3",
          "ec2",
          "autoscaling",
          "cloudformation",
          "elasticloadbalancing",
          "elb",
          "elasticbeanstalk",
          "cloudsearch",
          "dynamodb",
          "kinesis",
          "lambda",
          "glacier",
          "sqs",
          "sns",
          "iam",
          "sts",
          "ses",
          "swf",
          "storagegateway",
          "datapipeline",
          "directconnect",
          "redshift",
          "opsworks",
          "rds",
          "monitoring",
          "cloudtrail",
          "cloudfront",
          "codedeploy",
          "elasticache",
          "elasticmapreduce",
          "elastictranscoder",
          "emr",
          "cloudwatch",
          "mobileanalytics",
          "cognitoidentity",
          "cognitosync",
          "cognito",
          "containerservice",
          "ecs",
          "appstream",
          "keymanagementservice",
          "kms",
          "config",
          "cloudhsm",
          "route53",
          "route53domains",
          "logs"
        ],
        "repository": {
          "type": "git",
          "url": "https://github.com/mhart/aws4.git"
        },
        "license": "MIT",
        "devDependencies": {
          "mocha": "^2.4.5",
          "should": "^8.2.2"
        },
        "scripts": {
          "test": "mocha ./test/fast.js ./test/slow.js -b -t 100s -R list"
        }
      })
    },
    "babel-code-frame": {
      "node_modules": {
        "ansi-styles": {
          "package.json": JSON.stringify({
            "name": "ansi-styles",
            "version": "2.2.1",
            "description": "ANSI escape codes for styling strings in the terminal",
            "license": "MIT",
            "repository": "chalk/ansi-styles",
            "author": {
              "name": "Sindre Sorhus",
              "email": "sindresorhus@gmail.com",
              "url": "sindresorhus.com"
            },
            "maintainers": [
              "Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)",
              "Joshua Appelman <jappelman@xebia.com> (jbnicolai.com)"
            ],
            "engines": {
              "node": ">=0.10.0"
            },
            "scripts": {
              "test": "mocha"
            },
            "files": [
              "index.js"
            ],
            "keywords": [
              "ansi",
              "styles",
              "color",
              "colour",
              "colors",
              "terminal",
              "console",
              "cli",
              "string",
              "tty",
              "escape",
              "formatting",
              "rgb",
              "256",
              "shell",
              "xterm",
              "log",
              "logging",
              "command-line",
              "text"
            ],
            "devDependencies": {
              "mocha": "*"
            }
          })
        },
        "chalk": {
          "package.json": JSON.stringify({
            "name": "chalk",
            "version": "1.1.3",
            "description": "Terminal string styling done right. Much color.",
            "license": "MIT",
            "repository": "chalk/chalk",
            "maintainers": [
              "Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)",
              "Joshua Appelman <jappelman@xebia.com> (jbnicolai.com)",
              "JD Ballard <i.am.qix@gmail.com> (github.com/qix-)"
            ],
            "engines": {
              "node": ">=0.10.0"
            },
            "scripts": {
              "test": "xo && mocha",
              "bench": "matcha benchmark.js",
              "coverage": "nyc npm test && nyc report",
              "coveralls": "nyc npm test && nyc report --reporter=text-lcov | coveralls"
            },
            "files": [
              "index.js"
            ],
            "keywords": [
              "color",
              "colour",
              "colors",
              "terminal",
              "console",
              "cli",
              "string",
              "str",
              "ansi",
              "style",
              "styles",
              "tty",
              "formatting",
              "rgb",
              "256",
              "shell",
              "xterm",
              "log",
              "logging",
              "command-line",
              "text"
            ],
            "dependencies": {
              "ansi-styles": "^2.2.1",
              "escape-string-regexp": "^1.0.2",
              "has-ansi": "^2.0.0",
              "strip-ansi": "^3.0.0",
              "supports-color": "^2.0.0"
            },
            "devDependencies": {
              "coveralls": "^2.11.2",
              "matcha": "^0.6.0",
              "mocha": "*",
              "nyc": "^3.0.0",
              "require-uncached": "^1.0.2",
              "resolve-from": "^1.0.0",
              "semver": "^4.3.3",
              "xo": "*"
            },
            "xo": {
              "envs": [
                "node",
                "mocha"
              ]
            }
          })
        },
        "js-tokens": {
          "package.json": JSON.stringify({
            "name": "js-tokens",
            "version": "3.0.2",
            "author": "Simon Lydell",
            "license": "MIT",
            "description": "A regex that tokenizes JavaScript.",
            "keywords": [
              "JavaScript",
              "js",
              "token",
              "tokenize",
              "regex"
            ],
            "files": [
              "index.js"
            ],
            "repository": "lydell/js-tokens",
            "scripts": {
              "test": "mocha --ui tdd",
              "esprima-compare": "node esprima-compare ./index.js everything.js/es5.js",
              "build": "node generate-index.js",
              "dev": "npm run build && npm test"
            },
            "devDependencies": {
              "coffee-script": "~1.12.6",
              "esprima": "^4.0.0",
              "everything.js": "^1.0.3",
              "mocha": "^3.4.2"
            }
          })
        },
        "supports-color": {
          "package.json": JSON.stringify({
            "name": "supports-color",
            "version": "2.0.0",
            "description": "Detect whether a terminal supports color",
            "license": "MIT",
            "repository": "chalk/supports-color",
            "author": {
              "name": "Sindre Sorhus",
              "email": "sindresorhus@gmail.com",
              "url": "sindresorhus.com"
            },
            "maintainers": [
              "Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)",
              "Joshua Appelman <jappelman@xebia.com> (jbnicolai.com)"
            ],
            "engines": {
              "node": ">=0.8.0"
            },
            "scripts": {
              "test": "mocha"
            },
            "files": [
              "index.js"
            ],
            "keywords": [
              "color",
              "colour",
              "colors",
              "terminal",
              "console",
              "cli",
              "ansi",
              "styles",
              "tty",
              "rgb",
              "256",
              "shell",
              "xterm",
              "command-line",
              "support",
              "supports",
              "capability",
              "detect"
            ],
            "devDependencies": {
              "mocha": "*",
              "require-uncached": "^1.0.2"
            }
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "babel-code-frame",
        "version": "6.26.0",
        "description": "Generate errors that contain a code frame that point to source locations.",
        "author": "Sebastian McKenzie <sebmck@gmail.com>",
        "homepage": "https://babeljs.io/",
        "license": "MIT",
        "repository": "https://github.com/babel/babel/tree/master/packages/babel-code-frame",
        "main": "lib/index.js",
        "dependencies": {
          "chalk": "^1.1.3",
          "esutils": "^2.0.2",
          "js-tokens": "^3.0.2"
        }
      })
    },
    "babel-core": {
      "node_modules": {
        "source-map": {
          "package.json": JSON.stringify({
            "name": "source-map",
            "description": "Generates and consumes source maps",
            "version": "0.5.7",
            "homepage": "https://github.com/mozilla/source-map",
            "author": "Nick Fitzgerald <nfitzgerald@mozilla.com>",
            "contributors": [
              "Tobias Koppers <tobias.koppers@googlemail.com>",
              "Duncan Beevers <duncan@dweebd.com>",
              "Stephen Crane <scrane@mozilla.com>",
              "Ryan Seddon <seddon.ryan@gmail.com>",
              "Miles Elam <miles.elam@deem.com>",
              "Mihai Bazon <mihai.bazon@gmail.com>",
              "Michael Ficarra <github.public.email@michael.ficarra.me>",
              "Todd Wolfson <todd@twolfson.com>",
              "Alexander Solovyov <alexander@solovyov.net>",
              "Felix Gnass <fgnass@gmail.com>",
              "Conrad Irwin <conrad.irwin@gmail.com>",
              "usrbincc <usrbincc@yahoo.com>",
              "David Glasser <glasser@davidglasser.net>",
              "Chase Douglas <chase@newrelic.com>",
              "Evan Wallace <evan.exe@gmail.com>",
              "Heather Arthur <fayearthur@gmail.com>",
              "Hugh Kennedy <hughskennedy@gmail.com>",
              "David Glasser <glasser@davidglasser.net>",
              "Simon Lydell <simon.lydell@gmail.com>",
              "Jmeas Smith <jellyes2@gmail.com>",
              "Michael Z Goddard <mzgoddard@gmail.com>",
              "azu <azu@users.noreply.github.com>",
              "John Gozde <john@gozde.ca>",
              "Adam Kirkton <akirkton@truefitinnovation.com>",
              "Chris Montgomery <christopher.montgomery@dowjones.com>",
              "J. Ryan Stinnett <jryans@gmail.com>",
              "Jack Herrington <jherrington@walmartlabs.com>",
              "Chris Truter <jeffpalentine@gmail.com>",
              "Daniel Espeset <daniel@danielespeset.com>",
              "Jamie Wong <jamie.lf.wong@gmail.com>",
              "Eddy Bruël <ejpbruel@mozilla.com>",
              "Hawken Rives <hawkrives@gmail.com>",
              "Gilad Peleg <giladp007@gmail.com>",
              "djchie <djchie.dev@gmail.com>",
              "Gary Ye <garysye@gmail.com>",
              "Nicolas Lalevée <nicolas.lalevee@hibnet.org>"
            ],
            "repository": {
              "type": "git",
              "url": "http://github.com/mozilla/source-map.git"
            },
            "main": "./source-map.js",
            "files": [
              "source-map.js",
              "lib/",
              "dist/source-map.debug.js",
              "dist/source-map.js",
              "dist/source-map.min.js",
              "dist/source-map.min.js.map"
            ],
            "engines": {
              "node": ">=0.10.0"
            },
            "license": "BSD-3-Clause",
            "scripts": {
              "test": "npm run build && node test/run-tests.js",
              "build": "webpack --color",
              "toc": "doctoc --title '## Table of Contents' README.md && doctoc --title '## Table of Contents' CONTRIBUTING.md"
            },
            "devDependencies": {
              "doctoc": "^0.15.0",
              "webpack": "^1.12.0"
            },
            "typings": "source-map"
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "babel-core",
        "version": "6.26.3",
        "description": "Babel compiler core.",
        "author": "Sebastian McKenzie <sebmck@gmail.com>",
        "homepage": "https://babeljs.io/",
        "license": "MIT",
        "repository": "https://github.com/babel/babel/tree/master/packages/babel-core",
        "keywords": [
          "6to5",
          "babel",
          "classes",
          "const",
          "es6",
          "harmony",
          "let",
          "modules",
          "transpile",
          "transpiler",
          "var",
          "babel-core",
          "compiler"
        ],
        "scripts": {
          "bench": "make bench",
          "test": "make test"
        },
        "dependencies": {
          "babel-code-frame": "^6.26.0",
          "babel-generator": "^6.26.0",
          "babel-helpers": "^6.24.1",
          "babel-messages": "^6.23.0",
          "babel-register": "^6.26.0",
          "babel-runtime": "^6.26.0",
          "babel-template": "^6.26.0",
          "babel-traverse": "^6.26.0",
          "babel-types": "^6.26.0",
          "babylon": "^6.18.0",
          "convert-source-map": "^1.5.1",
          "debug": "^2.6.9",
          "json5": "^0.5.1",
          "lodash": "^4.17.4",
          "minimatch": "^3.0.4",
          "path-is-absolute": "^1.0.1",
          "private": "^0.1.8",
          "slash": "^1.0.0",
          "source-map": "^0.5.7"
        },
        "devDependencies": {
          "babel-helper-fixtures": "^6.26.2",
          "babel-helper-transform-fixture-test-runner": "^6.26.2",
          "babel-polyfill": "^6.26.0"
        }
      })
    },
    "babel-generator": {
      "node_modules": {
        "source-map": {
          "package.json": JSON.stringify({
            "name": "source-map",
            "description": "Generates and consumes source maps",
            "version": "0.5.7",
            "homepage": "https://github.com/mozilla/source-map",
            "author": "Nick Fitzgerald <nfitzgerald@mozilla.com>",
            "contributors": [
              "Tobias Koppers <tobias.koppers@googlemail.com>",
              "Duncan Beevers <duncan@dweebd.com>",
              "Stephen Crane <scrane@mozilla.com>",
              "Ryan Seddon <seddon.ryan@gmail.com>",
              "Miles Elam <miles.elam@deem.com>",
              "Mihai Bazon <mihai.bazon@gmail.com>",
              "Michael Ficarra <github.public.email@michael.ficarra.me>",
              "Todd Wolfson <todd@twolfson.com>",
              "Alexander Solovyov <alexander@solovyov.net>",
              "Felix Gnass <fgnass@gmail.com>",
              "Conrad Irwin <conrad.irwin@gmail.com>",
              "usrbincc <usrbincc@yahoo.com>",
              "David Glasser <glasser@davidglasser.net>",
              "Chase Douglas <chase@newrelic.com>",
              "Evan Wallace <evan.exe@gmail.com>",
              "Heather Arthur <fayearthur@gmail.com>",
              "Hugh Kennedy <hughskennedy@gmail.com>",
              "David Glasser <glasser@davidglasser.net>",
              "Simon Lydell <simon.lydell@gmail.com>",
              "Jmeas Smith <jellyes2@gmail.com>",
              "Michael Z Goddard <mzgoddard@gmail.com>",
              "azu <azu@users.noreply.github.com>",
              "John Gozde <john@gozde.ca>",
              "Adam Kirkton <akirkton@truefitinnovation.com>",
              "Chris Montgomery <christopher.montgomery@dowjones.com>",
              "J. Ryan Stinnett <jryans@gmail.com>",
              "Jack Herrington <jherrington@walmartlabs.com>",
              "Chris Truter <jeffpalentine@gmail.com>",
              "Daniel Espeset <daniel@danielespeset.com>",
              "Jamie Wong <jamie.lf.wong@gmail.com>",
              "Eddy Bruël <ejpbruel@mozilla.com>",
              "Hawken Rives <hawkrives@gmail.com>",
              "Gilad Peleg <giladp007@gmail.com>",
              "djchie <djchie.dev@gmail.com>",
              "Gary Ye <garysye@gmail.com>",
              "Nicolas Lalevée <nicolas.lalevee@hibnet.org>"
            ],
            "repository": {
              "type": "git",
              "url": "http://github.com/mozilla/source-map.git"
            },
            "main": "./source-map.js",
            "files": [
              "source-map.js",
              "lib/",
              "dist/source-map.debug.js",
              "dist/source-map.js",
              "dist/source-map.min.js",
              "dist/source-map.min.js.map"
            ],
            "engines": {
              "node": ">=0.10.0"
            },
            "license": "BSD-3-Clause",
            "scripts": {
              "test": "npm run build && node test/run-tests.js",
              "build": "webpack --color",
              "toc": "doctoc --title '## Table of Contents' README.md && doctoc --title '## Table of Contents' CONTRIBUTING.md"
            },
            "devDependencies": {
              "doctoc": "^0.15.0",
              "webpack": "^1.12.0"
            },
            "typings": "source-map"
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "babel-generator",
        "version": "6.26.1",
        "description": "Turns an AST into code.",
        "author": "Sebastian McKenzie <sebmck@gmail.com>",
        "homepage": "https://babeljs.io/",
        "license": "MIT",
        "repository": "https://github.com/babel/babel/tree/master/packages/babel-generator",
        "main": "lib/index.js",
        "files": [
          "lib"
        ],
        "dependencies": {
          "babel-messages": "^6.23.0",
          "babel-runtime": "^6.26.0",
          "babel-types": "^6.26.0",
          "detect-indent": "^4.0.0",
          "jsesc": "^1.3.0",
          "lodash": "^4.17.4",
          "source-map": "^0.5.7",
          "trim-right": "^1.0.1"
        },
        "devDependencies": {
          "babel-helper-fixtures": "^6.26.0",
          "babylon": "^6.18.0"
        }
      })
    },
    "babel-helper-builder-react-jsx": {
      "package.json": JSON.stringify({
        "name": "babel-helper-builder-react-jsx",
        "version": "6.26.0",
        "description": "Helper function to build react jsx",
        "repository": "https://github.com/babel/babel/tree/master/packages/babel-helper-builder-react-jsx",
        "license": "MIT",
        "main": "lib/index.js",
        "dependencies": {
          "babel-runtime": "^6.26.0",
          "babel-types": "^6.26.0",
          "esutils": "^2.0.2"
        }
      })
    },
    "babel-helpers": {
      "package.json": JSON.stringify({
        "name": "babel-helpers",
        "version": "6.24.1",
        "description": "Collection of helper functions used by Babel transforms.",
        "author": "Sebastian McKenzie <sebmck@gmail.com>",
        "homepage": "https://babeljs.io/",
        "license": "MIT",
        "repository": "https://github.com/babel/babel/tree/master/packages/babel-helpers",
        "main": "lib/index.js",
        "dependencies": {
          "babel-runtime": "^6.22.0",
          "babel-template": "^6.24.1"
        }
      })
    },
    "babel-messages": {
      "package.json": JSON.stringify({
        "name": "babel-messages",
        "version": "6.23.0",
        "description": "Collection of debug messages used by Babel.",
        "author": "Sebastian McKenzie <sebmck@gmail.com>",
        "homepage": "https://babeljs.io/",
        "license": "MIT",
        "repository": "https://github.com/babel/babel/tree/master/packages/babel-messages",
        "main": "lib/index.js",
        "dependencies": {
          "babel-runtime": "^6.22.0"
        }
      })
    },
    "babel-plugin-syntax-jsx": {
      "package.json": JSON.stringify({
        "name": "babel-plugin-syntax-jsx",
        "version": "6.18.0",
        "description": "Allow parsing of jsx",
        "repository": "https://github.com/babel/babel/tree/master/packages/babel-plugin-syntax-jsx",
        "license": "MIT",
        "main": "lib/index.js",
        "keywords": [
          "babel-plugin"
        ],
        "dependencies": {},
        "devDependencies": {}
      })
    },
    "babel-plugin-syntax-object-rest-spread": {
      "package.json": JSON.stringify({
        "name": "babel-plugin-syntax-object-rest-spread",
        "version": "6.13.0",
        "description": "Allow parsing of object rest/spread",
        "repository": "https://github.com/babel/babel/tree/master/packages/babel-plugin-syntax-object-rest-spread",
        "license": "MIT",
        "main": "lib/index.js",
        "keywords": [
          "babel-plugin"
        ],
        "dependencies": {},
        "devDependencies": {}
      })
    },
    "babel-plugin-transform-es2015-destructuring": {
      "package.json": JSON.stringify({
        "name": "babel-plugin-transform-es2015-destructuring",
        "version": "6.23.0",
        "description": "Compile ES2015 destructuring to ES5",
        "repository": "https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-es2015-destructuring",
        "license": "MIT",
        "main": "lib/index.js",
        "keywords": [
          "babel-plugin"
        ],
        "dependencies": {
          "babel-runtime": "^6.22.0"
        },
        "devDependencies": {
          "babel-helper-plugin-test-runner": "^6.22.0"
        }
      })
    },
    "babel-plugin-transform-object-rest-spread": {
      "package.json": JSON.stringify({
        "name": "babel-plugin-transform-object-rest-spread",
        "version": "6.26.0",
        "description": "Compile object rest and spread to ES5",
        "repository": "https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-object-rest-spread",
        "license": "MIT",
        "main": "lib/index.js",
        "keywords": [
          "babel-plugin"
        ],
        "dependencies": {
          "babel-plugin-syntax-object-rest-spread": "^6.8.0",
          "babel-runtime": "^6.26.0"
        },
        "devDependencies": {
          "babel-helper-plugin-test-runner": "^6.22.0"
        }
      })
    },
    "babel-plugin-transform-react-jsx": {
      "package.json": JSON.stringify({
        "name": "babel-plugin-transform-react-jsx",
        "version": "6.24.1",
        "description": "Turn JSX into React function calls",
        "repository": "https://github.com/babel/babel/tree/master/packages/babel-plugin-transform-react-jsx",
        "license": "MIT",
        "main": "lib/index.js",
        "keywords": [
          "babel-plugin"
        ],
        "dependencies": {
          "babel-runtime": "^6.22.0",
          "babel-helper-builder-react-jsx": "^6.24.1",
          "babel-plugin-syntax-jsx": "^6.8.0"
        },
        "devDependencies": {
          "babel-helper-plugin-test-runner": "^6.24.1"
        }
      })
    },
    "babel-register": {
      "node_modules": {
        "source-map": {
          "package.json": JSON.stringify({
            "name": "source-map",
            "description": "Generates and consumes source maps",
            "version": "0.5.7",
            "homepage": "https://github.com/mozilla/source-map",
            "author": "Nick Fitzgerald <nfitzgerald@mozilla.com>",
            "contributors": [
              "Tobias Koppers <tobias.koppers@googlemail.com>",
              "Duncan Beevers <duncan@dweebd.com>",
              "Stephen Crane <scrane@mozilla.com>",
              "Ryan Seddon <seddon.ryan@gmail.com>",
              "Miles Elam <miles.elam@deem.com>",
              "Mihai Bazon <mihai.bazon@gmail.com>",
              "Michael Ficarra <github.public.email@michael.ficarra.me>",
              "Todd Wolfson <todd@twolfson.com>",
              "Alexander Solovyov <alexander@solovyov.net>",
              "Felix Gnass <fgnass@gmail.com>",
              "Conrad Irwin <conrad.irwin@gmail.com>",
              "usrbincc <usrbincc@yahoo.com>",
              "David Glasser <glasser@davidglasser.net>",
              "Chase Douglas <chase@newrelic.com>",
              "Evan Wallace <evan.exe@gmail.com>",
              "Heather Arthur <fayearthur@gmail.com>",
              "Hugh Kennedy <hughskennedy@gmail.com>",
              "David Glasser <glasser@davidglasser.net>",
              "Simon Lydell <simon.lydell@gmail.com>",
              "Jmeas Smith <jellyes2@gmail.com>",
              "Michael Z Goddard <mzgoddard@gmail.com>",
              "azu <azu@users.noreply.github.com>",
              "John Gozde <john@gozde.ca>",
              "Adam Kirkton <akirkton@truefitinnovation.com>",
              "Chris Montgomery <christopher.montgomery@dowjones.com>",
              "J. Ryan Stinnett <jryans@gmail.com>",
              "Jack Herrington <jherrington@walmartlabs.com>",
              "Chris Truter <jeffpalentine@gmail.com>",
              "Daniel Espeset <daniel@danielespeset.com>",
              "Jamie Wong <jamie.lf.wong@gmail.com>",
              "Eddy Bruël <ejpbruel@mozilla.com>",
              "Hawken Rives <hawkrives@gmail.com>",
              "Gilad Peleg <giladp007@gmail.com>",
              "djchie <djchie.dev@gmail.com>",
              "Gary Ye <garysye@gmail.com>",
              "Nicolas Lalevée <nicolas.lalevee@hibnet.org>"
            ],
            "repository": {
              "type": "git",
              "url": "http://github.com/mozilla/source-map.git"
            },
            "main": "./source-map.js",
            "files": [
              "source-map.js",
              "lib/",
              "dist/source-map.debug.js",
              "dist/source-map.js",
              "dist/source-map.min.js",
              "dist/source-map.min.js.map"
            ],
            "engines": {
              "node": ">=0.10.0"
            },
            "license": "BSD-3-Clause",
            "scripts": {
              "test": "npm run build && node test/run-tests.js",
              "build": "webpack --color",
              "toc": "doctoc --title '## Table of Contents' README.md && doctoc --title '## Table of Contents' CONTRIBUTING.md"
            },
            "devDependencies": {
              "doctoc": "^0.15.0",
              "webpack": "^1.12.0"
            },
            "typings": "source-map"
          })
        },
        "source-map-support": {
          "package.json": JSON.stringify({
            "name": "source-map-support",
            "description": "Fixes stack traces for files with source maps",
            "version": "0.4.18",
            "main": "./source-map-support.js",
            "scripts": {
              "build": "node build.js",
              "serve-tests": "http-server -p 1336",
              "prepublish": "npm run build",
              "test": "mocha"
            },
            "dependencies": {
              "source-map": "^0.5.6"
            },
            "devDependencies": {
              "browserify": "3.44.2",
              "coffee-script": "1.7.1",
              "http-server": "^0.8.5",
              "mocha": "1.18.2",
              "webpack": "^1.13.3"
            },
            "repository": {
              "type": "git",
              "url": "https://github.com/evanw/node-source-map-support"
            },
            "bugs": {
              "url": "https://github.com/evanw/node-source-map-support/issues"
            },
            "license": "MIT"
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "babel-register",
        "version": "6.26.0",
        "description": "babel require hook",
        "license": "MIT",
        "repository": "https://github.com/babel/babel/tree/master/packages/babel-register",
        "author": "Sebastian McKenzie <sebmck@gmail.com>",
        "main": "lib/node.js",
        "browser": "lib/browser.js",
        "dependencies": {
          "babel-core": "^6.26.0",
          "babel-runtime": "^6.26.0",
          "core-js": "^2.5.0",
          "home-or-tmp": "^2.0.0",
          "lodash": "^4.17.4",
          "mkdirp": "^0.5.1",
          "source-map-support": "^0.4.15"
        },
        "devDependencies": {
          "decache": "^4.1.0"
        }
      })
    },
    "babel-runtime": {
      "node_modules": {
        "regenerator-runtime": {
          "package.json": JSON.stringify({
            "name": "regenerator-runtime",
            "author": "Ben Newman <bn@cs.stanford.edu>",
            "description": "Runtime for Regenerator-compiled generator and async functions.",
            "version": "0.11.1",
            "main": "runtime-module.js",
            "keywords": [
              "regenerator",
              "runtime",
              "generator",
              "async"
            ],
            "repository": {
              "type": "git",
              "url": "https://github.com/facebook/regenerator/tree/master/packages/regenerator-runtime"
            },
            "license": "MIT"
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "babel-runtime",
        "version": "6.26.0",
        "description": "babel selfContained runtime",
        "license": "MIT",
        "repository": "https://github.com/babel/babel/tree/master/packages/babel-runtime",
        "author": "Sebastian McKenzie <sebmck@gmail.com>",
        "dependencies": {
          "core-js": "^2.4.0",
          "regenerator-runtime": "^0.11.0"
        },
        "devDependencies": {
          "babel-helpers": "^6.22.0",
          "babel-plugin-transform-runtime": "^6.23.0"
        }
      })
    },
    "babel-template": {
      "package.json": JSON.stringify({
        "name": "babel-template",
        "version": "6.26.0",
        "description": "Generate an AST from a string template.",
        "author": "Sebastian McKenzie <sebmck@gmail.com>",
        "homepage": "https://babeljs.io/",
        "license": "MIT",
        "repository": "https://github.com/babel/babel/tree/master/packages/babel-template",
        "main": "lib/index.js",
        "dependencies": {
          "babel-runtime": "^6.26.0",
          "babel-traverse": "^6.26.0",
          "babel-types": "^6.26.0",
          "babylon": "^6.18.0",
          "lodash": "^4.17.4"
        }
      })
    },
    "babel-traverse": {
      "node_modules": {
        "globals": {
          "package.json": JSON.stringify({
            "name": "globals",
            "version": "9.18.0",
            "description": "Global identifiers from different JavaScript environments",
            "license": "MIT",
            "repository": "sindresorhus/globals",
            "author": {
              "name": "Sindre Sorhus",
              "email": "sindresorhus@gmail.com",
              "url": "http://sindresorhus.com"
            },
            "engines": {
              "node": ">=0.10.0"
            },
            "scripts": {
              "test": "mocha"
            },
            "files": [
              "index.js",
              "globals.json"
            ],
            "keywords": [
              "globals",
              "global",
              "identifiers",
              "variables",
              "vars",
              "jshint",
              "eslint",
              "environments"
            ],
            "devDependencies": {
              "mocha": "*"
            }
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "babel-traverse",
        "version": "6.26.0",
        "description": "The Babel Traverse module maintains the overall tree state, and is responsible for replacing, removing, and adding nodes",
        "author": "Sebastian McKenzie <sebmck@gmail.com>",
        "homepage": "https://babeljs.io/",
        "license": "MIT",
        "repository": "https://github.com/babel/babel/tree/master/packages/babel-traverse",
        "main": "lib/index.js",
        "dependencies": {
          "babel-code-frame": "^6.26.0",
          "babel-messages": "^6.23.0",
          "babel-runtime": "^6.26.0",
          "babel-types": "^6.26.0",
          "babylon": "^6.18.0",
          "debug": "^2.6.8",
          "globals": "^9.18.0",
          "invariant": "^2.2.2",
          "lodash": "^4.17.4"
        },
        "devDependencies": {
          "babel-generator": "^6.26.0"
        }
      })
    },
    "babel-types": {
      "package.json": JSON.stringify({
        "name": "babel-types",
        "version": "6.26.0",
        "description": "Babel Types is a Lodash-esque utility library for AST nodes",
        "author": "Sebastian McKenzie <sebmck@gmail.com>",
        "homepage": "https://babeljs.io/",
        "license": "MIT",
        "repository": "https://github.com/babel/babel/tree/master/packages/babel-types",
        "main": "lib/index.js",
        "dependencies": {
          "babel-runtime": "^6.26.0",
          "esutils": "^2.0.2",
          "lodash": "^4.17.4",
          "to-fast-properties": "^1.0.3"
        },
        "devDependencies": {
          "babel-generator": "^6.26.0",
          "babylon": "^6.18.0"
        }
      })
    },
    "babylon": {
      "package.json": JSON.stringify({
        "name": "babylon",
        "version": "6.18.0",
        "description": "A JavaScript parser",
        "author": "Sebastian McKenzie <sebmck@gmail.com>",
        "homepage": "https://babeljs.io/",
        "license": "MIT",
        "keywords": [
          "babel",
          "javascript",
          "parser",
          "babylon"
        ],
        "repository": "https://github.com/babel/babylon",
        "main": "lib/index.js",
        "files": [
          "bin",
          "lib"
        ],
        "devDependencies": {
          "ava": "^0.17.0",
          "babel-cli": "^6.14.0",
          "babel-eslint": "^7.0.0",
          "babel-helper-fixtures": "^6.9.0",
          "babel-plugin-external-helpers": "^6.18.0",
          "babel-plugin-istanbul": "^3.0.0",
          "babel-plugin-transform-flow-strip-types": "^6.14.0",
          "babel-preset-es2015": "^6.14.0",
          "babel-preset-stage-0": "^6.5.0",
          "chalk": "^1.1.3",
          "codecov": "^1.0.1",
          "cross-env": "^2.0.0",
          "eslint": "^3.7.1",
          "eslint-config-babel": "^6.0.0",
          "eslint-plugin-flowtype": "^2.20.0",
          "flow-bin": "^0.42.0",
          "nyc": "^10.0.0",
          "rimraf": "^2.5.4",
          "rollup": "^0.41.0",
          "rollup-plugin-babel": "^2.6.1",
          "rollup-plugin-node-resolve": "^2.0.0",
          "rollup-watch": "^3.2.2",
          "unicode-9.0.0": "~0.7.0"
        },
        "bin": {
          "babylon": "./bin/babylon.js"
        },
        "scripts": {
          "build": "npm run clean && rollup -c",
          "coverage": "nyc report --reporter=json && codecov -f coverage/coverage-final.json",
          "lint": "eslint src bin",
          "clean": "rimraf lib",
          "flow": "flow",
          "prepublish": "cross-env BABEL_ENV=production npm run build",
          "preversion": "npm run test && npm run changelog",
          "test": "npm run lint && npm run flow && npm run build -- -m && npm run test-only",
          "test-only": "ava",
          "test-ci": "nyc npm run test-only",
          "changelog": "git log `git describe --tags --abbrev=0`..HEAD --pretty=format:' * %s (%an)' | grep -v 'Merge pull request'",
          "watch": "npm run clean && rollup -c --watch"
        },
        "nyc": {
          "include": [
            "src/**/*.js",
            "bin/**/*.js"
          ],
          "sourceMap": false,
          "instrument": false
        },
        "ava": {
          "files": [
            "test/*.js"
          ],
          "source": [
            "src/**/*.js",
            "bin/**/*.js"
          ]
        },
        "greenkeeper": {
          "ignore": [
            "cross-env"
          ]
        }
      })
    },
    "balanced-match": {
      "package.json": JSON.stringify({
        "name": "balanced-match",
        "description": "Match balanced character pairs, like \"{\" and \"}\"",
        "version": "1.0.0",
        "repository": {
          "type": "git",
          "url": "git://github.com/juliangruber/balanced-match.git"
        },
        "homepage": "https://github.com/juliangruber/balanced-match",
        "main": "index.js",
        "scripts": {
          "test": "make test",
          "bench": "make bench"
        },
        "dependencies": {},
        "devDependencies": {
          "matcha": "^0.7.0",
          "tape": "^4.6.0"
        },
        "keywords": [
          "match",
          "regexp",
          "test",
          "balanced",
          "parse"
        ],
        "author": {
          "name": "Julian Gruber",
          "email": "mail@juliangruber.com",
          "url": "http://juliangruber.com"
        },
        "license": "MIT",
        "testling": {
          "files": "test/*.js",
          "browsers": [
            "ie/8..latest",
            "firefox/20..latest",
            "firefox/nightly",
            "chrome/25..latest",
            "chrome/canary",
            "opera/12..latest",
            "opera/next",
            "safari/5.1..latest",
            "ipad/6.0..latest",
            "iphone/6.0..latest",
            "android-browser/4.2..latest"
          ]
        }
      })
    },
    "bcrypt-pbkdf": {
      "package.json": JSON.stringify({
        "name": "bcrypt-pbkdf",
        "version": "1.0.2",
        "description": "Port of the OpenBSD bcrypt_pbkdf function to pure JS",
        "repository": {
          "type": "git",
          "url": "git://github.com/joyent/node-bcrypt-pbkdf.git"
        },
        "main": "index.js",
        "dependencies": {
          "tweetnacl": "^0.14.3"
        },
        "devDependencies": {},
        "license": "BSD-3-Clause"
      })
    },
    "binary-extensions": {
      "package.json": JSON.stringify({
        "name": "binary-extensions",
        "version": "2.0.0",
        "description": "List of binary file extensions",
        "license": "MIT",
        "repository": "sindresorhus/binary-extensions",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=8"
        },
        "scripts": {
          "test": "xo && ava && tsd"
        },
        "files": [
          "index.js",
          "index.d.ts",
          "binary-extensions.json",
          "binary-extensions.json.d.ts"
        ],
        "keywords": [
          "binary",
          "extensions",
          "extension",
          "file",
          "json",
          "list",
          "array"
        ],
        "devDependencies": {
          "ava": "^1.4.1",
          "tsd": "^0.7.2",
          "xo": "^0.24.0"
        }
      })
    },
    "bind-obj-methods": {
      "package.json": JSON.stringify({
        "name": "bind-obj-methods",
        "version": "2.0.0",
        "description": "Bind methods to an object from that object or some other source. Optionally specify a set of methods to skip over.",
        "main": "bind-obj-methods.js",
        "scripts": {
          "test": "tap test.js --100",
          "preversion": "npm test",
          "postversion": "npm publish",
          "postpublish": "git push origin --all; git push origin --tags"
        },
        "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me/)",
        "license": "ISC",
        "keywords": [],
        "repository": {
          "type": "git",
          "url": "git+https://github.com/isaacs/bind-obj-methods.git"
        },
        "bugs": {
          "url": "https://github.com/isaacs/bind-obj-methods/issues"
        },
        "homepage": "https://github.com/isaacs/bind-obj-methods#readme",
        "devDependencies": {
          "tap": "^10.7.0"
        },
        "files": []
      })
    },
    "brace-expansion": {
      "package.json": JSON.stringify({
        "name": "brace-expansion",
        "description": "Brace expansion as known from sh/bash",
        "version": "1.1.11",
        "repository": {
          "type": "git",
          "url": "git://github.com/juliangruber/brace-expansion.git"
        },
        "homepage": "https://github.com/juliangruber/brace-expansion",
        "main": "index.js",
        "scripts": {
          "test": "tape test/*.js",
          "gentest": "bash test/generate.sh",
          "bench": "matcha test/perf/bench.js"
        },
        "dependencies": {
          "balanced-match": "^1.0.0",
          "concat-map": "0.0.1"
        },
        "devDependencies": {
          "matcha": "^0.7.0",
          "tape": "^4.6.0"
        },
        "keywords": [],
        "author": {
          "name": "Julian Gruber",
          "email": "mail@juliangruber.com",
          "url": "http://juliangruber.com"
        },
        "license": "MIT",
        "testling": {
          "files": "test/*.js",
          "browsers": [
            "ie/8..latest",
            "firefox/20..latest",
            "firefox/nightly",
            "chrome/25..latest",
            "chrome/canary",
            "opera/12..latest",
            "opera/next",
            "safari/5.1..latest",
            "ipad/6.0..latest",
            "iphone/6.0..latest",
            "android-browser/4.2..latest"
          ]
        }
      })
    },
    "braces": {
      "package.json": JSON.stringify({
        "name": "braces",
        "description": "Bash-like brace expansion, implemented in JavaScript. Safer than other brace expansion libs, with complete support for the Bash 4.3 braces specification, without sacrificing speed.",
        "version": "3.0.2",
        "homepage": "https://github.com/micromatch/braces",
        "author": "Jon Schlinkert (https://github.com/jonschlinkert)",
        "contributors": [
          "Brian Woodward (https://twitter.com/doowb)",
          "Elan Shanker (https://github.com/es128)",
          "Eugene Sharygin (https://github.com/eush77)",
          "hemanth.hm (http://h3manth.com)",
          "Jon Schlinkert (http://twitter.com/jonschlinkert)"
        ],
        "repository": "micromatch/braces",
        "bugs": {
          "url": "https://github.com/micromatch/braces/issues"
        },
        "license": "MIT",
        "files": [
          "index.js",
          "lib"
        ],
        "main": "index.js",
        "engines": {
          "node": ">=8"
        },
        "scripts": {
          "test": "mocha",
          "benchmark": "node benchmark"
        },
        "dependencies": {
          "fill-range": "^7.0.1"
        },
        "devDependencies": {
          "ansi-colors": "^3.2.4",
          "bash-path": "^2.0.1",
          "gulp-format-md": "^2.0.0",
          "mocha": "^6.1.1"
        },
        "keywords": [
          "alpha",
          "alphabetical",
          "bash",
          "brace",
          "braces",
          "expand",
          "expansion",
          "filepath",
          "fill",
          "fs",
          "glob",
          "globbing",
          "letter",
          "match",
          "matches",
          "matching",
          "number",
          "numerical",
          "path",
          "range",
          "ranges",
          "sh"
        ],
        "verb": {
          "toc": false,
          "layout": "default",
          "tasks": [
            "readme"
          ],
          "lint": {
            "reflinks": true
          },
          "plugins": [
            "gulp-format-md"
          ]
        }
      })
    },
    "browser-process-hrtime": {
      "package.json": JSON.stringify({
        "name": "browser-process-hrtime",
        "version": "1.0.0",
        "description": "Shim for process.hrtime in the browser",
        "main": "index.js",
        "scripts": {
          "test": "echo \"Error: no test specified\" && exit 1"
        },
        "repository": {
          "type": "git",
          "url": "git://github.com/kumavis/browser-process-hrtime.git"
        },
        "author": "kumavis",
        "license": "BSD-2-Clause"
      })
    },
    "buffer-from": {
      "package.json": JSON.stringify({
        "name": "buffer-from",
        "version": "1.1.1",
        "license": "MIT",
        "repository": "LinusU/buffer-from",
        "files": [
          "index.js"
        ],
        "scripts": {
          "test": "standard && node test"
        },
        "devDependencies": {
          "standard": "^7.1.2"
        },
        "keywords": [
          "buffer",
          "buffer from"
        ]
      })
    },
    "caching-transform": {
      "node_modules": {
        "write-file-atomic": {
          "package.json": JSON.stringify({
            "name": "write-file-atomic",
            "version": "2.4.3",
            "description": "Write files in an atomic fashion w/configurable ownership",
            "main": "index.js",
            "scripts": {
              "test": "standard && tap --100 test/*.js",
              "preversion": "npm test",
              "postversion": "npm publish",
              "postpublish": "git push origin --follow-tags"
            },
            "repository": {
              "type": "git",
              "url": "git@github.com:iarna/write-file-atomic.git"
            },
            "keywords": [
              "writeFile",
              "atomic"
            ],
            "author": "Rebecca Turner <me@re-becca.org> (http://re-becca.org)",
            "license": "ISC",
            "bugs": {
              "url": "https://github.com/iarna/write-file-atomic/issues"
            },
            "homepage": "https://github.com/iarna/write-file-atomic",
            "dependencies": {
              "graceful-fs": "^4.1.11",
              "imurmurhash": "^0.1.4",
              "signal-exit": "^3.0.2"
            },
            "devDependencies": {
              "mkdirp": "^0.5.1",
              "require-inject": "^1.4.0",
              "rimraf": "^2.5.4",
              "standard": "^12.0.1",
              "tap": "^12.1.3"
            },
            "files": [
              "index.js"
            ]
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "caching-transform",
        "version": "3.0.2",
        "description": "Wraps a transform and provides caching",
        "license": "MIT",
        "repository": "istanbuljs/caching-transform",
        "engines": {
          "node": ">=6"
        },
        "scripts": {
          "test": "xo && nyc ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "transform",
          "cache",
          "require",
          "transpile",
          "fast",
          "speed",
          "hash"
        ],
        "dependencies": {
          "hasha": "^3.0.0",
          "make-dir": "^2.0.0",
          "package-hash": "^3.0.0",
          "write-file-atomic": "^2.4.2"
        },
        "devDependencies": {
          "ava": "^1.2.1",
          "coveralls": "^3.0.2",
          "nyc": "^13.3.0",
          "proxyquire": "^2.1.0",
          "rimraf": "^2.6.3",
          "sinon": "^7.2.3",
          "xo": "^0.24.0"
        },
        "nyc": {
          "reporter": [
            "lcov",
            "text"
          ]
        }
      })
    },
    "caller-callsite": {
      "package.json": JSON.stringify({
        "name": "caller-callsite",
        "version": "2.0.0",
        "description": "Get the callsite of the caller function",
        "license": "MIT",
        "repository": "sindresorhus/caller-callsite",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "caller",
          "calling",
          "module",
          "parent",
          "callsites",
          "callsite",
          "stacktrace",
          "stack",
          "trace",
          "function",
          "file"
        ],
        "dependencies": {
          "callsites": "^2.0.0"
        },
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        },
        "xo": {
          "esnext": true
        }
      })
    },
    "caller-path": {
      "package.json": JSON.stringify({
        "name": "caller-path",
        "version": "2.0.0",
        "description": "Get the path of the caller function",
        "license": "MIT",
        "repository": "sindresorhus/caller-path",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "caller",
          "calling",
          "module",
          "path",
          "parent",
          "callsites",
          "callsite",
          "stacktrace",
          "stack",
          "trace",
          "function",
          "file"
        ],
        "dependencies": {
          "caller-callsite": "^2.0.0"
        },
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        },
        "xo": {
          "esnext": true
        }
      })
    },
    "callsites": {
      "package.json": JSON.stringify({
        "name": "callsites",
        "version": "2.0.0",
        "description": "Get callsites from the V8 stack trace API",
        "license": "MIT",
        "repository": "sindresorhus/callsites",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "stacktrace",
          "v8",
          "callsite",
          "callsites",
          "stack",
          "trace",
          "function",
          "file",
          "line",
          "debug"
        ],
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        },
        "xo": {
          "esnext": true
        }
      })
    },
    "camelcase": {
      "package.json": JSON.stringify({
        "name": "camelcase",
        "version": "5.3.1",
        "description": "Convert a dash/dot/underscore/space separated string to camelCase or PascalCase: `foo-bar` → `fooBar`",
        "license": "MIT",
        "repository": "sindresorhus/camelcase",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=6"
        },
        "scripts": {
          "test": "xo && ava && tsd"
        },
        "files": [
          "index.js",
          "index.d.ts"
        ],
        "keywords": [
          "camelcase",
          "camel-case",
          "camel",
          "case",
          "dash",
          "hyphen",
          "dot",
          "underscore",
          "separator",
          "string",
          "text",
          "convert",
          "pascalcase",
          "pascal-case"
        ],
        "devDependencies": {
          "ava": "^1.4.1",
          "tsd": "^0.7.1",
          "xo": "^0.24.0"
        }
      })
    },
    "cardinal": {
      "package.json": JSON.stringify({
        "name": "cardinal",
        "version": "2.1.1",
        "description": "Syntax highlights JavaScript code with ANSI colors to be printed to the terminal.",
        "main": "cardinal.js",
        "scripts": {
          "test": "npm run run-test && npm run lint",
          "run-test": "tape test/*.js",
          "lint": "standart",
          "lint-fix": "standart --fix",
          "demo": "node examples/highlight-string.js; node examples/highlight-self; node examples/highlight-self-hide-semicolons;"
        },
        "bin": {
          "cdl": "./bin/cdl.js"
        },
        "repository": {
          "type": "git",
          "url": "git://github.com/thlorenz/cardinal.git"
        },
        "keywords": [
          "syntax",
          "highlight",
          "theme",
          "javascript",
          "json",
          "terminal",
          "console",
          "print",
          "output"
        ],
        "author": "Thorsten Lorenz <thlorenz@gmx.de> (thlorenz.com)",
        "license": "MIT",
        "dependencies": {
          "ansicolors": "~0.3.2",
          "redeyed": "~2.1.0"
        },
        "devDependencies": {
          "readdirp": "~2.1.0",
          "standart": "~6.1.0",
          "tape": "~4.9.0"
        },
        "standart": {
          "ignore": [
            "test/fixtures"
          ]
        }
      })
    },
    "caseless": {
      "package.json": JSON.stringify({
        "name": "caseless",
        "version": "0.12.0",
        "description": "Caseless object set/get/has, very useful when working with HTTP headers.",
        "main": "index.js",
        "scripts": {
          "test": "node test.js"
        },
        "repository": {
          "type": "git",
          "url": "https://github.com/mikeal/caseless"
        },
        "keywords": [
          "headers",
          "http",
          "caseless"
        ],
        "test": "node test.js",
        "author": "Mikeal Rogers <mikeal.rogers@gmail.com>",
        "license": "Apache-2.0",
        "bugs": {
          "url": "https://github.com/mikeal/caseless/issues"
        },
        "devDependencies": {
          "tape": "^2.10.2"
        }
      })
    },
    "chalk": {
      "package.json": JSON.stringify({
        "name": "chalk",
        "version": "2.4.2",
        "description": "Terminal string styling done right",
        "license": "MIT",
        "repository": "chalk/chalk",
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && tsc --project types && flow --max-warnings=0 && nyc ava",
          "bench": "matcha benchmark.js",
          "coveralls": "nyc report --reporter=text-lcov | coveralls"
        },
        "files": [
          "index.js",
          "templates.js",
          "types/index.d.ts",
          "index.js.flow"
        ],
        "keywords": [
          "color",
          "colour",
          "colors",
          "terminal",
          "console",
          "cli",
          "string",
          "str",
          "ansi",
          "style",
          "styles",
          "tty",
          "formatting",
          "rgb",
          "256",
          "shell",
          "xterm",
          "log",
          "logging",
          "command-line",
          "text"
        ],
        "dependencies": {
          "ansi-styles": "^3.2.1",
          "escape-string-regexp": "^1.0.5",
          "supports-color": "^5.3.0"
        },
        "devDependencies": {
          "ava": "*",
          "coveralls": "^3.0.0",
          "execa": "^0.9.0",
          "flow-bin": "^0.68.0",
          "import-fresh": "^2.0.0",
          "matcha": "^0.7.0",
          "nyc": "^11.0.2",
          "resolve-from": "^4.0.0",
          "typescript": "^2.5.3",
          "xo": "*"
        },
        "types": "types/index.d.ts",
        "xo": {
          "envs": [
            "node",
            "mocha"
          ],
          "ignores": [
            "test/_flow.js"
          ]
        }
      })
    },
    "chokidar": {
      "package.json": JSON.stringify({
        "name": "chokidar",
        "description": "A neat wrapper around node.js fs.watch / fs.watchFile / fsevents.",
        "version": "3.3.0",
        "homepage": "https://github.com/paulmillr/chokidar",
        "author": "Paul Miller (https://paulmillr.com)",
        "contributors": [
          "Paul Miller (https://paulmillr.com)",
          "Elan Shanker"
        ],
        "engines": {
          "node": ">= 8.10.0"
        },
        "main": "index.js",
        "dependencies": {
          "anymatch": "~3.1.1",
          "braces": "~3.0.2",
          "glob-parent": "~5.1.0",
          "is-binary-path": "~2.1.0",
          "is-glob": "~4.0.1",
          "normalize-path": "~3.0.0",
          "readdirp": "~3.2.0"
        },
        "optionalDependencies": {
          "fsevents": "~2.1.1"
        },
        "devDependencies": {
          "@types/node": "^12",
          "chai": "^4.2",
          "dtslint": "1.0.2",
          "eslint": "^6.6.0",
          "mocha": "^6.2.2",
          "nyc": "^14.1.1",
          "rimraf": "^3.0.0",
          "sinon": "^7.5.0",
          "sinon-chai": "^3.3.0",
          "upath": "^1.2.0"
        },
        "files": [
          "index.js",
          "lib/*.js",
          "types/index.d.ts"
        ],
        "repository": {
          "type": "git",
          "url": "git+https://github.com/paulmillr/chokidar.git"
        },
        "bugs": {
          "url": "https://github.com/paulmillr/chokidar/issues"
        },
        "license": "MIT",
        "scripts": {
          "dtslint": "dtslint types",
          "lint": "eslint --report-unused-disable-directives --ignore-path .gitignore .",
          "mocha": "mocha --exit --timeout 60000",
          "test": "npm run lint && npm run mocha"
        },
        "keywords": [
          "fs",
          "watch",
          "watchFile",
          "watcher",
          "watching",
          "file",
          "fsevents"
        ],
        "types": "./types/index.d.ts",
        "eslintConfig": {
          "extends": "eslint:recommended",
          "parserOptions": {
            "ecmaVersion": 9,
            "sourceType": "script"
          },
          "env": {
            "node": true,
            "es6": true
          },
          "rules": {
            "array-callback-return": "error",
            "no-empty": [
              "error",
              {
                "allowEmptyCatch": true
              }
            ],
            "no-lonely-if": "error",
            "no-var": "error",
            "object-shorthand": "error",
            "prefer-arrow-callback": [
              "error",
              {
                "allowNamedFunctions": true
              }
            ],
            "prefer-const": [
              "error",
              {
                "ignoreReadBeforeAssign": true
              }
            ],
            "prefer-destructuring": [
              "error",
              {
                "object": true,
                "array": false
              }
            ],
            "prefer-spread": "error",
            "prefer-template": "error",
            "radix": "error",
            "strict": "error",
            "quotes": [
              "error",
              "single"
            ]
          }
        },
        "nyc": {
          "include": [
            "index.js",
            "lib/*.js"
          ],
          "reporter": [
            "html",
            "text"
          ]
        }
      })
    },
    "ci-info": {
      "package.json": JSON.stringify({
        "name": "ci-info",
        "version": "2.0.0",
        "description": "Get details about the current Continuous Integration environment",
        "main": "index.js",
        "dependencies": {},
        "devDependencies": {
          "clear-require": "^1.0.1",
          "standard": "^12.0.1",
          "tape": "^4.9.1"
        },
        "scripts": {
          "test": "standard && node test.js"
        },
        "repository": {
          "type": "git",
          "url": "https://github.com/watson/ci-info.git"
        },
        "keywords": [
          "ci",
          "continuous",
          "integration",
          "test",
          "detect"
        ],
        "author": "Thomas Watson Steen <w@tson.dk> (https://twitter.com/wa7son)",
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/watson/ci-info/issues"
        },
        "homepage": "https://github.com/watson/ci-info",
        "coordinates": [
          55.778231,
          12.593179
        ]
      })
    },
    "cli-cursor": {
      "package.json": JSON.stringify({
        "name": "cli-cursor",
        "version": "2.1.0",
        "description": "Toggle the CLI cursor",
        "license": "MIT",
        "repository": "sindresorhus/cli-cursor",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "cli",
          "cursor",
          "ansi",
          "toggle",
          "display",
          "show",
          "hide",
          "term",
          "terminal",
          "console",
          "tty",
          "shell",
          "command-line"
        ],
        "dependencies": {
          "restore-cursor": "^2.0.0"
        },
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        },
        "xo": {
          "esnext": true
        }
      })
    },
    "cli-truncate": {
      "package.json": JSON.stringify({
        "name": "cli-truncate",
        "version": "1.1.0",
        "description": "Truncate a string to a specific width in the terminal",
        "license": "MIT",
        "repository": "sindresorhus/cli-truncate",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "truncate",
          "ellipsis",
          "text",
          "limit",
          "slice",
          "cli",
          "terminal",
          "term",
          "shell",
          "width",
          "ansi"
        ],
        "dependencies": {
          "slice-ansi": "^1.0.0",
          "string-width": "^2.0.0"
        },
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        }
      })
    },
    "cliui": {
      "node_modules": {
        "ansi-regex": {
          "package.json": JSON.stringify({
            "name": "ansi-regex",
            "version": "3.0.0",
            "description": "Regular expression for matching ANSI escape codes",
            "license": "MIT",
            "repository": "chalk/ansi-regex",
            "author": {
              "name": "Sindre Sorhus",
              "email": "sindresorhus@gmail.com",
              "url": "sindresorhus.com"
            },
            "engines": {
              "node": ">=4"
            },
            "scripts": {
              "test": "xo && ava",
              "view-supported": "node fixtures/view-codes.js"
            },
            "files": [
              "index.js"
            ],
            "keywords": [
              "ansi",
              "styles",
              "color",
              "colour",
              "colors",
              "terminal",
              "console",
              "cli",
              "string",
              "tty",
              "escape",
              "formatting",
              "rgb",
              "256",
              "shell",
              "xterm",
              "command-line",
              "text",
              "regex",
              "regexp",
              "re",
              "match",
              "test",
              "find",
              "pattern"
            ],
            "devDependencies": {
              "ava": "*",
              "xo": "*"
            }
          })
        },
        "is-fullwidth-code-point": {
          "package.json": JSON.stringify({
            "name": "is-fullwidth-code-point",
            "version": "1.0.0",
            "description": "Check if the character represented by a given Unicode code point is fullwidth",
            "license": "MIT",
            "repository": "sindresorhus/is-fullwidth-code-point",
            "author": {
              "name": "Sindre Sorhus",
              "email": "sindresorhus@gmail.com",
              "url": "sindresorhus.com"
            },
            "engines": {
              "node": ">=0.10.0"
            },
            "scripts": {
              "test": "node test.js"
            },
            "files": [
              "index.js"
            ],
            "keywords": [
              "fullwidth",
              "full-width",
              "full",
              "width",
              "unicode",
              "character",
              "char",
              "string",
              "str",
              "codepoint",
              "code",
              "point",
              "is",
              "detect",
              "check"
            ],
            "dependencies": {
              "number-is-nan": "^1.0.0"
            },
            "devDependencies": {
              "ava": "0.0.4",
              "code-point-at": "^1.0.0"
            }
          })
        },
        "strip-ansi": {
          "package.json": JSON.stringify({
            "name": "strip-ansi",
            "version": "4.0.0",
            "description": "Strip ANSI escape codes",
            "license": "MIT",
            "repository": "chalk/strip-ansi",
            "author": {
              "name": "Sindre Sorhus",
              "email": "sindresorhus@gmail.com",
              "url": "sindresorhus.com"
            },
            "engines": {
              "node": ">=4"
            },
            "scripts": {
              "test": "xo && ava"
            },
            "files": [
              "index.js"
            ],
            "keywords": [
              "strip",
              "trim",
              "remove",
              "ansi",
              "styles",
              "color",
              "colour",
              "colors",
              "terminal",
              "console",
              "string",
              "tty",
              "escape",
              "formatting",
              "rgb",
              "256",
              "shell",
              "xterm",
              "log",
              "logging",
              "command-line",
              "text"
            ],
            "dependencies": {
              "ansi-regex": "^3.0.0"
            },
            "devDependencies": {
              "ava": "*",
              "xo": "*"
            }
          })
        },
        "wrap-ansi": {
          "node_modules": {
            "ansi-regex": {
              "package.json": JSON.stringify({
                "name": "ansi-regex",
                "version": "2.1.1",
                "description": "Regular expression for matching ANSI escape codes",
                "license": "MIT",
                "repository": "chalk/ansi-regex",
                "author": {
                  "name": "Sindre Sorhus",
                  "email": "sindresorhus@gmail.com",
                  "url": "sindresorhus.com"
                },
                "maintainers": [
                  "Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)",
                  "Joshua Appelman <jappelman@xebia.com> (jbnicolai.com)",
                  "JD Ballard <i.am.qix@gmail.com> (github.com/qix-)"
                ],
                "engines": {
                  "node": ">=0.10.0"
                },
                "scripts": {
                  "test": "xo && ava --verbose",
                  "view-supported": "node fixtures/view-codes.js"
                },
                "files": [
                  "index.js"
                ],
                "keywords": [
                  "ansi",
                  "styles",
                  "color",
                  "colour",
                  "colors",
                  "terminal",
                  "console",
                  "cli",
                  "string",
                  "tty",
                  "escape",
                  "formatting",
                  "rgb",
                  "256",
                  "shell",
                  "xterm",
                  "command-line",
                  "text",
                  "regex",
                  "regexp",
                  "re",
                  "match",
                  "test",
                  "find",
                  "pattern"
                ],
                "devDependencies": {
                  "ava": "0.17.0",
                  "xo": "0.16.0"
                },
                "xo": {
                  "rules": {
                    "guard-for-in": 0,
                    "no-loop-func": 0
                  }
                }
              })
            },
            "string-width": {
              "package.json": JSON.stringify({
                "name": "string-width",
                "version": "1.0.2",
                "description": "Get the visual width of a string - the number of columns required to display it",
                "license": "MIT",
                "repository": "sindresorhus/string-width",
                "author": {
                  "name": "Sindre Sorhus",
                  "email": "sindresorhus@gmail.com",
                  "url": "sindresorhus.com"
                },
                "engines": {
                  "node": ">=0.10.0"
                },
                "scripts": {
                  "test": "xo && ava"
                },
                "files": [
                  "index.js"
                ],
                "keywords": [
                  "string",
                  "str",
                  "character",
                  "char",
                  "unicode",
                  "width",
                  "visual",
                  "column",
                  "columns",
                  "fullwidth",
                  "full-width",
                  "full",
                  "ansi",
                  "escape",
                  "codes",
                  "cli",
                  "command-line",
                  "terminal",
                  "console",
                  "cjk",
                  "chinese",
                  "japanese",
                  "korean",
                  "fixed-width"
                ],
                "dependencies": {
                  "code-point-at": "^1.0.0",
                  "is-fullwidth-code-point": "^1.0.0",
                  "strip-ansi": "^3.0.0"
                },
                "devDependencies": {
                  "ava": "*",
                  "xo": "*"
                }
              })
            },
            "strip-ansi": {
              "package.json": JSON.stringify({
                "name": "strip-ansi",
                "version": "3.0.1",
                "description": "Strip ANSI escape codes",
                "license": "MIT",
                "repository": "chalk/strip-ansi",
                "author": {
                  "name": "Sindre Sorhus",
                  "email": "sindresorhus@gmail.com",
                  "url": "sindresorhus.com"
                },
                "maintainers": [
                  "Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)",
                  "Joshua Boy Nicolai Appelman <joshua@jbna.nl> (jbna.nl)",
                  "JD Ballard <i.am.qix@gmail.com> (github.com/qix-)"
                ],
                "engines": {
                  "node": ">=0.10.0"
                },
                "scripts": {
                  "test": "xo && ava"
                },
                "files": [
                  "index.js"
                ],
                "keywords": [
                  "strip",
                  "trim",
                  "remove",
                  "ansi",
                  "styles",
                  "color",
                  "colour",
                  "colors",
                  "terminal",
                  "console",
                  "string",
                  "tty",
                  "escape",
                  "formatting",
                  "rgb",
                  "256",
                  "shell",
                  "xterm",
                  "log",
                  "logging",
                  "command-line",
                  "text"
                ],
                "dependencies": {
                  "ansi-regex": "^2.0.0"
                },
                "devDependencies": {
                  "ava": "*",
                  "xo": "*"
                }
              })
            }
          },
          "package.json": JSON.stringify({
            "name": "wrap-ansi",
            "version": "2.1.0",
            "description": "Wordwrap a string with ANSI escape codes",
            "license": "MIT",
            "repository": "chalk/wrap-ansi",
            "author": {
              "name": "Sindre Sorhus",
              "email": "sindresorhus@gmail.com",
              "url": "sindresorhus.com"
            },
            "maintainers": [
              "Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)",
              "Joshua Appelman <jappelman@xebia.com> (jbnicolai.com)",
              "JD Ballard <i.am.qix@gmail.com> (github.com/qix-)",
              "Benjamin Coe <ben@npmjs.com> (github.com/bcoe)"
            ],
            "engines": {
              "node": ">=0.10.0"
            },
            "scripts": {
              "test": "xo && nyc ava",
              "coveralls": "nyc report --reporter=text-lcov | coveralls"
            },
            "files": [
              "index.js"
            ],
            "keywords": [
              "wrap",
              "break",
              "wordwrap",
              "wordbreak",
              "linewrap",
              "ansi",
              "styles",
              "color",
              "colour",
              "colors",
              "terminal",
              "console",
              "cli",
              "string",
              "tty",
              "escape",
              "formatting",
              "rgb",
              "256",
              "shell",
              "xterm",
              "log",
              "logging",
              "command-line",
              "text"
            ],
            "dependencies": {
              "string-width": "^1.0.1",
              "strip-ansi": "^3.0.1"
            },
            "devDependencies": {
              "ava": "^0.16.0",
              "chalk": "^1.1.0",
              "coveralls": "^2.11.4",
              "has-ansi": "^2.0.0",
              "nyc": "^6.2.1",
              "strip-ansi": "^3.0.0",
              "xo": "*"
            }
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "cliui",
        "version": "4.1.0",
        "description": "easily create complex multi-column command-line-interfaces",
        "main": "index.js",
        "scripts": {
          "pretest": "standard",
          "test": "nyc mocha",
          "coverage": "nyc --reporter=text-lcov mocha | coveralls",
          "release": "standard-version"
        },
        "repository": {
          "type": "git",
          "url": "http://github.com/yargs/cliui.git"
        },
        "config": {
          "blanket": {
            "pattern": [
              "index.js"
            ],
            "data-cover-never": [
              "node_modules",
              "test"
            ],
            "output-reporter": "spec"
          }
        },
        "standard": {
          "ignore": [
            "**/example/**"
          ],
          "globals": [
            "it"
          ]
        },
        "keywords": [
          "cli",
          "command-line",
          "layout",
          "design",
          "console",
          "wrap",
          "table"
        ],
        "author": "Ben Coe <ben@npmjs.com>",
        "license": "ISC",
        "dependencies": {
          "string-width": "^2.1.1",
          "strip-ansi": "^4.0.0",
          "wrap-ansi": "^2.0.0"
        },
        "devDependencies": {
          "chai": "^3.5.0",
          "chalk": "^1.1.2",
          "coveralls": "^2.11.8",
          "mocha": "^3.0.0",
          "nyc": "^10.0.0",
          "standard": "^8.0.0",
          "standard-version": "^3.0.0"
        },
        "files": [
          "index.js"
        ],
        "engine": {
          "node": ">=4"
        }
      })
    },
    "code-point-at": {
      "package.json": JSON.stringify({
        "name": "code-point-at",
        "version": "1.1.0",
        "description": "ES2015 `String#codePointAt()` ponyfill",
        "license": "MIT",
        "repository": "sindresorhus/code-point-at",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=0.10.0"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "es2015",
          "ponyfill",
          "polyfill",
          "shim",
          "string",
          "str",
          "code",
          "point",
          "at",
          "codepoint",
          "unicode"
        ],
        "devDependencies": {
          "ava": "*",
          "xo": "^0.16.0"
        }
      })
    },
    "color-convert": {
      "package.json": JSON.stringify({
        "name": "color-convert",
        "description": "Plain color conversion functions",
        "version": "1.9.3",
        "author": "Heather Arthur <fayearthur@gmail.com>",
        "license": "MIT",
        "repository": "Qix-/color-convert",
        "scripts": {
          "pretest": "xo",
          "test": "node test/basic.js"
        },
        "keywords": [
          "color",
          "colour",
          "convert",
          "converter",
          "conversion",
          "rgb",
          "hsl",
          "hsv",
          "hwb",
          "cmyk",
          "ansi",
          "ansi16"
        ],
        "files": [
          "index.js",
          "conversions.js",
          "css-keywords.js",
          "route.js"
        ],
        "xo": {
          "rules": {
            "default-case": 0,
            "no-inline-comments": 0,
            "operator-linebreak": 0
          }
        },
        "devDependencies": {
          "chalk": "1.1.1",
          "xo": "0.11.2"
        },
        "dependencies": {
          "color-name": "1.1.3"
        }
      })
    },
    "color-name": {
      "package.json": JSON.stringify({
        "name": "color-name",
        "version": "1.1.3",
        "description": "A list of color names and its values",
        "main": "index.js",
        "scripts": {
          "test": "node test.js"
        },
        "repository": {
          "type": "git",
          "url": "git@github.com:dfcreative/color-name.git"
        },
        "keywords": [
          "color-name",
          "color",
          "color-keyword",
          "keyword"
        ],
        "author": "DY <dfcreative@gmail.com>",
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/dfcreative/color-name/issues"
        },
        "homepage": "https://github.com/dfcreative/color-name"
      })
    },
    "color-support": {
      "package.json": JSON.stringify({
        "name": "color-support",
        "version": "1.1.3",
        "description": "A module which will endeavor to guess your terminal's level of color support.",
        "main": "index.js",
        "browser": "browser.js",
        "bin": "bin.js",
        "devDependencies": {
          "tap": "^10.3.3"
        },
        "scripts": {
          "test": "tap test/*.js --100 -J",
          "preversion": "npm test",
          "postversion": "npm publish",
          "postpublish": "git push origin --all; git push origin --tags"
        },
        "repository": {
          "type": "git",
          "url": "git+https://github.com/isaacs/color-support.git"
        },
        "keywords": [
          "terminal",
          "color",
          "support",
          "xterm",
          "truecolor",
          "256"
        ],
        "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me/)",
        "license": "ISC",
        "files": [
          "browser.js",
          "index.js",
          "bin.js"
        ]
      })
    },
    "combined-stream": {
      "package.json": JSON.stringify({
        "author": "Felix Geisendörfer <felix@debuggable.com> (http://debuggable.com/)",
        "name": "combined-stream",
        "description": "A stream that emits multiple other streams one after another.",
        "version": "1.0.8",
        "homepage": "https://github.com/felixge/node-combined-stream",
        "repository": {
          "type": "git",
          "url": "git://github.com/felixge/node-combined-stream.git"
        },
        "main": "./lib/combined_stream",
        "scripts": {
          "test": "node test/run.js"
        },
        "engines": {
          "node": ">= 0.8"
        },
        "dependencies": {
          "delayed-stream": "~1.0.0"
        },
        "devDependencies": {
          "far": "~0.0.7"
        },
        "license": "MIT"
      })
    },
    "commander": {
      "package.json": JSON.stringify({
        "name": "commander",
        "version": "2.20.0",
        "description": "the complete solution for node.js command-line programs",
        "keywords": [
          "commander",
          "command",
          "option",
          "parser"
        ],
        "author": "TJ Holowaychuk <tj@vision-media.ca>",
        "license": "MIT",
        "repository": {
          "type": "git",
          "url": "https://github.com/tj/commander.js.git"
        },
        "scripts": {
          "lint": "eslint index.js",
          "test": "node test/run.js && npm run test-typings",
          "test-typings": "tsc -p tsconfig.json"
        },
        "main": "index",
        "files": [
          "index.js",
          "typings/index.d.ts"
        ],
        "dependencies": {},
        "devDependencies": {
          "@types/node": "^10.11.3",
          "eslint": "^5.6.1",
          "should": "^13.2.3",
          "sinon": "^6.3.4",
          "standard": "^12.0.1",
          "ts-node": "^7.0.1",
          "typescript": "^2.9.2"
        },
        "typings": "typings/index.d.ts"
      })
    },
    "commondir": {
      "package.json": JSON.stringify({
        "name": "commondir",
        "version": "1.0.1",
        "description": "compute the closest common parent for file paths",
        "main": "index.js",
        "dependencies": {},
        "devDependencies": {
          "tape": "^3.5.0"
        },
        "scripts": {
          "test": "tape test/*.js"
        },
        "repository": {
          "type": "git",
          "url": "http://github.com/substack/node-commondir.git"
        },
        "keywords": [
          "common",
          "path",
          "directory",
          "file",
          "parent",
          "root"
        ],
        "author": {
          "name": "James Halliday",
          "email": "mail@substack.net",
          "url": "http://substack.net"
        },
        "license": "MIT",
        "engine": {
          "node": ">=0.4"
        }
      })
    },
    "concat-map": {
      "package.json": JSON.stringify({
        "name": "concat-map",
        "description": "concatenative mapdashery",
        "version": "0.0.1",
        "repository": {
          "type": "git",
          "url": "git://github.com/substack/node-concat-map.git"
        },
        "main": "index.js",
        "keywords": [
          "concat",
          "concatMap",
          "map",
          "functional",
          "higher-order"
        ],
        "directories": {
          "example": "example",
          "test": "test"
        },
        "scripts": {
          "test": "tape test/*.js"
        },
        "devDependencies": {
          "tape": "~2.4.0"
        },
        "license": "MIT",
        "author": {
          "name": "James Halliday",
          "email": "mail@substack.net",
          "url": "http://substack.net"
        },
        "testling": {
          "files": "test/*.js",
          "browsers": {
            "ie": [
              6,
              7,
              8,
              9
            ],
            "ff": [
              3.5,
              10,
              15
            ],
            "chrome": [
              10,
              22
            ],
            "safari": [
              5.1
            ],
            "opera": [
              12
            ]
          }
        }
      })
    },
    "convert-source-map": {
      "package.json": JSON.stringify({
        "name": "convert-source-map",
        "version": "1.6.0",
        "description": "Converts a source-map from/to  different formats and allows adding/changing properties.",
        "main": "index.js",
        "scripts": {
          "test": "tap test/*.js --color"
        },
        "repository": {
          "type": "git",
          "url": "git://github.com/thlorenz/convert-source-map.git"
        },
        "homepage": "https://github.com/thlorenz/convert-source-map",
        "dependencies": {
          "safe-buffer": "~5.1.1"
        },
        "devDependencies": {
          "inline-source-map": "~0.6.2",
          "tap": "~9.0.0"
        },
        "keywords": [
          "convert",
          "sourcemap",
          "source",
          "map",
          "browser",
          "debug"
        ],
        "author": {
          "name": "Thorsten Lorenz",
          "email": "thlorenz@gmx.de",
          "url": "http://thlorenz.com"
        },
        "license": "MIT",
        "engine": {
          "node": ">=0.6"
        },
        "files": [
          "index.js"
        ]
      })
    },
    "core-js": {
      "package.json": JSON.stringify({
        "name": "core-js",
        "description": "Standard library",
        "version": "2.6.9",
        "repository": {
          "type": "git",
          "url": "https://github.com/zloirock/core-js.git"
        },
        "main": "index.js",
        "devDependencies": {
          "LiveScript": "1.3.x",
          "es-observable-tests": "0.2.x",
          "eslint": "4.19.x",
          "eslint-plugin-import": "2.12.x",
          "grunt": "^1.0.2",
          "grunt-cli": "^1.2.0",
          "grunt-contrib-clean": "^1.1.0",
          "grunt-contrib-copy": "^1.0.0",
          "grunt-contrib-uglify": "3.3.x",
          "grunt-contrib-watch": "^1.0.0",
          "grunt-karma": "^2.0.0",
          "grunt-livescript": "0.6.x",
          "karma": "^2.0.0",
          "karma-qunit": "^2.1.0",
          "karma-chrome-launcher": "^2.2.0",
          "karma-firefox-launcher": "^1.0.1",
          "karma-ie-launcher": "^1.0.0",
          "karma-phantomjs-launcher": "1.0.x",
          "phantomjs-prebuilt": "2.1.x",
          "promises-aplus-tests": "^2.1.2",
          "qunit": "2.6.x",
          "temp": "^0.8.3",
          "webpack": "^3.11.0"
        },
        "scripts": {
          "grunt": "grunt",
          "lint": "eslint ./",
          "promises-tests": "promises-aplus-tests tests/promises-aplus/adapter",
          "observables-tests": "node tests/observables/adapter && node tests/observables/adapter-library",
          "test": "npm run grunt clean copy && npm run lint && npm run grunt livescript client karma:default && npm run grunt library karma:library && npm run promises-tests && npm run observables-tests && lsc tests/commonjs",
          "postinstall": "node scripts/postinstall || echo \"ignore\""
        },
        "license": "MIT",
        "keywords": [
          "ES3",
          "ES5",
          "ES6",
          "ES7",
          "ES2015",
          "ES2016",
          "ES2017",
          "ECMAScript 3",
          "ECMAScript 5",
          "ECMAScript 6",
          "ECMAScript 7",
          "ECMAScript 2015",
          "ECMAScript 2016",
          "ECMAScript 2017",
          "Harmony",
          "Strawman",
          "Map",
          "Set",
          "WeakMap",
          "WeakSet",
          "Promise",
          "Symbol",
          "TypedArray",
          "setImmediate",
          "Dict",
          "polyfill",
          "shim"
        ]
      })
    },
    "core-util-is": {
      "package.json": JSON.stringify({
        "name": "core-util-is",
        "version": "1.0.2",
        "description": "The `util.is*` functions introduced in Node v0.12.",
        "main": "lib/util.js",
        "repository": {
          "type": "git",
          "url": "git://github.com/isaacs/core-util-is"
        },
        "keywords": [
          "util",
          "isBuffer",
          "isArray",
          "isNumber",
          "isString",
          "isRegExp",
          "isThis",
          "isThat",
          "polyfill"
        ],
        "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me/)",
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/isaacs/core-util-is/issues"
        },
        "scripts": {
          "test": "tap test.js"
        },
        "devDependencies": {
          "tap": "^2.3.0"
        }
      })
    },
    "coveralls": {
      "node_modules": {
        "minimist": {
          "package.json": JSON.stringify({
            "name": "minimist",
            "version": "1.2.0",
            "description": "parse argument options",
            "main": "index.js",
            "devDependencies": {
              "covert": "^1.0.0",
              "tap": "~0.4.0",
              "tape": "^3.5.0"
            },
            "scripts": {
              "test": "tap test/*.js",
              "coverage": "covert test/*.js"
            },
            "testling": {
              "files": "test/*.js",
              "browsers": [
                "ie/6..latest",
                "ff/5",
                "firefox/latest",
                "chrome/10",
                "chrome/latest",
                "safari/5.1",
                "safari/latest",
                "opera/12"
              ]
            },
            "repository": {
              "type": "git",
              "url": "git://github.com/substack/minimist.git"
            },
            "homepage": "https://github.com/substack/minimist",
            "keywords": [
              "argv",
              "getopt",
              "parser",
              "optimist"
            ],
            "author": {
              "name": "James Halliday",
              "email": "mail@substack.net",
              "url": "http://substack.net"
            },
            "license": "MIT"
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "coveralls",
        "description": "takes json-cov output into stdin and POSTs to coveralls.io",
        "keywords": [
          "coverage",
          "coveralls"
        ],
        "version": "3.0.7",
        "bugs": {
          "url": "https://github.com/nickmerwin/node-coveralls/issues"
        },
        "scripts": {
          "test": "snyk test && make test"
        },
        "bin": {
          "coveralls": "./bin/coveralls.js"
        },
        "maintainers": [
          "Nick Merwin <nick@coveralls.io> (https://coveralls.io)"
        ],
        "contributors": [
          "Gregg Caines <gregg@caines.ca> (http://caines.ca)",
          "Joshua Ma <github@joshma.com> (http://joshma.com)",
          "Alan Gutierrez <alan@prettyrobots.com> (http://www.prettyrobots.com/)",
          "Kir Belevich (https://github.com/svg)",
          "elliotcable <github@elliottcable.name> (http://elliottcable.name/)",
          "Slotos <slotos@gmail.com> (http://slotos.net)",
          "mattjmorrison <mattjmorrison@mattjmorrison.com> (http://mattjmorrison.com)",
          "Arpad Borsos <arpad.borsos@googlemail.com> (http://swatinem.de/)",
          "Adam Moss (https://github.com/adam-moss)"
        ],
        "dependencies": {
          "growl": "~> 1.10.0",
          "js-yaml": "^3.13.1",
          "lcov-parse": "^0.0.10",
          "log-driver": "^1.2.7",
          "minimist": "^1.2.0",
          "request": "^2.86.0"
        },
        "devDependencies": {
          "istanbul": "^0.4.5",
          "jshint": "^2.10.1",
          "mocha": "^6.1.4",
          "mocha-lcov-reporter": "^1.2.0",
          "should": "^9.0.2",
          "sinon-restore": "^1.0.1",
          "snyk": "^1.134.2"
        },
        "engines": {
          "node": ">=4.0.0"
        },
        "main": "index.js",
        "directories": {
          "test": "test"
        },
        "repository": {
          "type": "git",
          "url": "git://github.com/nickmerwin/node-coveralls.git"
        },
        "author": "Gregg Caines",
        "license": "BSD-2-Clause"
      })
    },
    "cp-file": {
      "node_modules": {
        "pify": {
          "package.json": JSON.stringify({
            "name": "pify",
            "version": "4.0.1",
            "description": "Promisify a callback-style function",
            "license": "MIT",
            "repository": "sindresorhus/pify",
            "author": {
              "name": "Sindre Sorhus",
              "email": "sindresorhus@gmail.com",
              "url": "sindresorhus.com"
            },
            "engines": {
              "node": ">=6"
            },
            "scripts": {
              "test": "xo && ava",
              "optimization-test": "node --allow-natives-syntax optimization-test.js"
            },
            "files": [
              "index.js"
            ],
            "keywords": [
              "promise",
              "promises",
              "promisify",
              "all",
              "denodify",
              "denodeify",
              "callback",
              "cb",
              "node",
              "then",
              "thenify",
              "convert",
              "transform",
              "wrap",
              "wrapper",
              "bind",
              "to",
              "async",
              "await",
              "es2015",
              "bluebird"
            ],
            "devDependencies": {
              "ava": "^0.25.0",
              "pinkie-promise": "^2.0.0",
              "v8-natives": "^1.1.0",
              "xo": "^0.23.0"
            }
          })
        },
        "safe-buffer": {
          "package.json": JSON.stringify({
            "name": "safe-buffer",
            "description": "Safer Node.js Buffer API",
            "version": "5.2.0",
            "author": {
              "name": "Feross Aboukhadijeh",
              "email": "feross@feross.org",
              "url": "http://feross.org"
            },
            "bugs": {
              "url": "https://github.com/feross/safe-buffer/issues"
            },
            "devDependencies": {
              "standard": "*",
              "tape": "^4.0.0"
            },
            "homepage": "https://github.com/feross/safe-buffer",
            "keywords": [
              "buffer",
              "buffer allocate",
              "node security",
              "safe",
              "safe-buffer",
              "security",
              "uninitialized"
            ],
            "license": "MIT",
            "main": "index.js",
            "types": "index.d.ts",
            "repository": {
              "type": "git",
              "url": "git://github.com/feross/safe-buffer.git"
            },
            "scripts": {
              "test": "standard && tape test/*.js"
            }
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "cp-file",
        "version": "6.2.0",
        "description": "Copy a file",
        "license": "MIT",
        "repository": "sindresorhus/cp-file",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "maintainers": [
          {
            "name": "Michael Mayer",
            "email": "michael@schnittstabil.de",
            "url": "schnittstabil.de"
          }
        ],
        "engines": {
          "node": ">=6"
        },
        "scripts": {
          "test": "xo && nyc ava && tsd"
        },
        "files": [
          "cp-file-error.js",
          "fs.js",
          "index.js",
          "index.d.ts",
          "progress-emitter.js"
        ],
        "keywords": [
          "copy",
          "cp",
          "file",
          "clone",
          "fs",
          "stream",
          "file-system",
          "ncp",
          "fast",
          "quick",
          "data",
          "content",
          "contents"
        ],
        "dependencies": {
          "graceful-fs": "^4.1.2",
          "make-dir": "^2.0.0",
          "nested-error-stacks": "^2.0.0",
          "pify": "^4.0.1",
          "safe-buffer": "^5.0.1"
        },
        "devDependencies": {
          "ava": "^1.4.1",
          "clear-module": "^3.1.0",
          "coveralls": "^3.0.3",
          "del": "^4.1.0",
          "import-fresh": "^3.0.0",
          "nyc": "^13.3.0",
          "sinon": "^7.3.1",
          "tsd": "^0.7.2",
          "uuid": "^3.3.2",
          "xo": "^0.24.0"
        }
      })
    },
    "cross-spawn": {
      "node_modules": {
        "which": {
          "package.json": JSON.stringify({
            "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me)",
            "name": "which",
            "description": "Like which(1) unix command. Find the first instance of an executable in the PATH.",
            "version": "1.3.1",
            "repository": {
              "type": "git",
              "url": "git://github.com/isaacs/node-which.git"
            },
            "main": "which.js",
            "bin": "./bin/which",
            "license": "ISC",
            "dependencies": {
              "isexe": "^2.0.0"
            },
            "devDependencies": {
              "mkdirp": "^0.5.0",
              "rimraf": "^2.6.2",
              "tap": "^12.0.1"
            },
            "scripts": {
              "test": "tap test/*.js --cov",
              "changelog": "bash gen-changelog.sh",
              "postversion": "npm run changelog && git add CHANGELOG.md && git commit -m 'update changelog - '${npm_package_version}"
            },
            "files": [
              "which.js",
              "bin/which"
            ]
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "cross-spawn",
        "version": "6.0.5",
        "description": "Cross platform child_process#spawn and child_process#spawnSync",
        "keywords": [
          "spawn",
          "spawnSync",
          "windows",
          "cross-platform",
          "path-ext",
          "shebang",
          "cmd",
          "execute"
        ],
        "author": "André Cruz <andre@moxy.studio>",
        "homepage": "https://github.com/moxystudio/node-cross-spawn",
        "repository": {
          "type": "git",
          "url": "git@github.com:moxystudio/node-cross-spawn.git"
        },
        "license": "MIT",
        "main": "index.js",
        "files": [
          "lib"
        ],
        "scripts": {
          "lint": "eslint .",
          "test": "jest --env node --coverage",
          "prerelease": "npm t && npm run lint",
          "release": "standard-version",
          "precommit": "lint-staged",
          "commitmsg": "commitlint -e $GIT_PARAMS"
        },
        "standard-version": {
          "scripts": {
            "posttag": "git push --follow-tags origin master && npm publish"
          }
        },
        "lint-staged": {
          "*.js": [
            "eslint --fix",
            "git add"
          ]
        },
        "commitlint": {
          "extends": [
            "@commitlint/config-conventional"
          ]
        },
        "dependencies": {
          "nice-try": "^1.0.4",
          "path-key": "^2.0.1",
          "semver": "^5.5.0",
          "shebang-command": "^1.2.0",
          "which": "^1.2.9"
        },
        "devDependencies": {
          "@commitlint/cli": "^6.0.0",
          "@commitlint/config-conventional": "^6.0.2",
          "babel-core": "^6.26.0",
          "babel-jest": "^22.1.0",
          "babel-preset-moxy": "^2.2.1",
          "eslint": "^4.3.0",
          "eslint-config-moxy": "^5.0.0",
          "husky": "^0.14.3",
          "jest": "^22.0.0",
          "lint-staged": "^7.0.0",
          "mkdirp": "^0.5.1",
          "regenerator-runtime": "^0.11.1",
          "rimraf": "^2.6.2",
          "standard-version": "^4.2.0"
        },
        "engines": {
          "node": ">=4.8"
        }
      })
    },
    "csstype": {
      "package.json": JSON.stringify({
        "name": "csstype",
        "version": "2.6.6",
        "main": "",
        "types": "index.d.ts",
        "description": "Strict TypeScript and Flow types for style based on MDN data",
        "repository": "https://github.com/frenic/csstype",
        "author": "Fredrik Nicol <fredrik.nicol@gmail.com>",
        "license": "MIT",
        "devDependencies": {
          "@types/chokidar": "^2.1.3",
          "@types/jest": "^24.0.13",
          "@types/jsdom": "^12.2.3",
          "@types/node": "^12.0.7",
          "@types/prettier": "^1.16.4",
          "chalk": "^2.4.2",
          "chokidar": "^3.0.1",
          "fast-glob": "^2.2.7",
          "flow-bin": "^0.100.0",
          "jest": "^24.8.0",
          "jsdom": "^15.1.1",
          "mdn-browser-compat-data": "git+https://github.com/mdn/browser-compat-data.git#0d355f21a6d1a22057a9f318b33ccd7eb7ba6576",
          "mdn-data": "git+https://github.com/mdn/data.git#fcd2fd333aca00c08ab3f876adce10e875b95d7c",
          "prettier": "^1.18.2",
          "sync-request": "^6.1.0",
          "ts-node": "^8.2.0",
          "tslint": "^5.17.0",
          "tslint-config-prettier": "^1.18.0",
          "turndown": "^5.0.3",
          "typescript": "~3.5.1"
        },
        "scripts": {
          "update": "ts-node --files update.ts",
          "build": "ts-node --files build.ts --start",
          "watch": "ts-node --files build.ts --watch",
          "lint": "tslint --exclude node_modules/**/* --exclude **/*.d.ts --fix **/*.ts",
          "pretty": "prettier --write build.ts **/*.{ts,js,json,md}",
          "lazy": "tsc && npm run lint && npm run pretty",
          "test": "jest --no-cache",
          "typecheck": "tsc typecheck.ts --noEmit --pretty & flow check typecheck.js",
          "prepublish": "tsc && npm run test && npm run build && npm run typecheck",
          "rebase-build": "git rebase --exec \"yarn --ignore-scripts && yarn build && git commit -a --amend --no-verify --no-edit --allow-empty\""
        },
        "files": [
          "index.d.ts",
          "index.js.flow"
        ],
        "keywords": [
          "css",
          "style",
          "typescript",
          "flow",
          "typings",
          "types",
          "definitions"
        ]
      })
    },
    "dashdash": {
      "package.json": JSON.stringify({
        "name": "dashdash",
        "description": "A light, featureful and explicit option parsing library.",
        "version": "1.14.1",
        "author": "Trent Mick <trentm@gmail.com> (http://trentm.com)",
        "keywords": [
          "option",
          "parser",
          "parsing",
          "cli",
          "command",
          "args",
          "bash",
          "completion"
        ],
        "repository": {
          "type": "git",
          "url": "git://github.com/trentm/node-dashdash.git"
        },
        "main": "./lib/dashdash.js",
        "dependencies": {
          "assert-plus": "^1.0.0"
        },
        "devDependencies": {
          "nodeunit": "0.9.x"
        },
        "engines": {
          "node": ">=0.10"
        },
        "scripts": {
          "test": "nodeunit test/*.test.js"
        },
        "license": "MIT"
      })
    },
    "debug": {
      "node_modules": {
        "ms": {
          "package.json": JSON.stringify({
            "name": "ms",
            "version": "2.0.0",
            "description": "Tiny milisecond conversion utility",
            "repository": "zeit/ms",
            "main": "./index",
            "files": [
              "index.js"
            ],
            "scripts": {
              "precommit": "lint-staged",
              "lint": "eslint lib/* bin/*",
              "test": "mocha tests.js"
            },
            "eslintConfig": {
              "extends": "eslint:recommended",
              "env": {
                "node": true,
                "es6": true
              }
            },
            "lint-staged": {
              "*.js": [
                "npm run lint",
                "prettier --single-quote --write",
                "git add"
              ]
            },
            "license": "MIT",
            "devDependencies": {
              "eslint": "3.19.0",
              "expect.js": "0.3.1",
              "husky": "0.13.3",
              "lint-staged": "3.4.1",
              "mocha": "3.4.1"
            }
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "debug",
        "version": "2.6.9",
        "repository": {
          "type": "git",
          "url": "git://github.com/visionmedia/debug.git"
        },
        "description": "small debugging utility",
        "keywords": [
          "debug",
          "log",
          "debugger"
        ],
        "author": "TJ Holowaychuk <tj@vision-media.ca>",
        "contributors": [
          "Nathan Rajlich <nathan@tootallnate.net> (http://n8.io)",
          "Andrew Rhyne <rhyneandrew@gmail.com>"
        ],
        "license": "MIT",
        "dependencies": {
          "ms": "2.0.0"
        },
        "devDependencies": {
          "browserify": "9.0.3",
          "chai": "^3.5.0",
          "concurrently": "^3.1.0",
          "coveralls": "^2.11.15",
          "eslint": "^3.12.1",
          "istanbul": "^0.4.5",
          "karma": "^1.3.0",
          "karma-chai": "^0.1.0",
          "karma-mocha": "^1.3.0",
          "karma-phantomjs-launcher": "^1.0.2",
          "karma-sinon": "^1.0.5",
          "mocha": "^3.2.0",
          "mocha-lcov-reporter": "^1.2.0",
          "rimraf": "^2.5.4",
          "sinon": "^1.17.6",
          "sinon-chai": "^2.8.0"
        },
        "main": "./src/index.js",
        "browser": "./src/browser.js",
        "component": {
          "scripts": {
            "debug/index.js": "browser.js",
            "debug/debug.js": "debug.js"
          }
        }
      })
    },
    "decamelize": {
      "package.json": JSON.stringify({
        "name": "decamelize",
        "version": "1.2.0",
        "description": "Convert a camelized string into a lowercased one with a custom separator: unicornRainbow → unicorn_rainbow",
        "license": "MIT",
        "repository": "sindresorhus/decamelize",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=0.10.0"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "decamelize",
          "decamelcase",
          "camelcase",
          "lowercase",
          "case",
          "dash",
          "hyphen",
          "string",
          "str",
          "text",
          "convert"
        ],
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        }
      })
    },
    "default-require-extensions": {
      "package.json": JSON.stringify({
        "name": "default-require-extensions",
        "version": "2.0.0",
        "description": "Node's default require extensions as a separate module",
        "license": "MIT",
        "repository": "avajs/default-require-extensions",
        "author": {
          "name": "James Talmage",
          "email": "james@talmage.io",
          "url": "github.com/jamestalmage"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && nyc ava"
        },
        "main": "js.js",
        "files": [
          "js.js",
          "json.js"
        ],
        "keywords": [
          "require",
          "extension",
          "default",
          "node"
        ],
        "dependencies": {
          "strip-bom": "^3.0.0"
        },
        "devDependencies": {
          "ava": "^0.18.2",
          "nyc": "^10.1.2",
          "xo": "^0.18.1"
        },
        "nyc": {
          "exclude": [
            "fixture"
          ]
        }
      })
    },
    "delayed-stream": {
      "package.json": JSON.stringify({
        "author": "Felix Geisendörfer <felix@debuggable.com> (http://debuggable.com/)",
        "contributors": [
          "Mike Atkins <apeherder@gmail.com>"
        ],
        "name": "delayed-stream",
        "description": "Buffers events from a stream until you are ready to handle them.",
        "license": "MIT",
        "version": "1.0.0",
        "homepage": "https://github.com/felixge/node-delayed-stream",
        "repository": {
          "type": "git",
          "url": "git://github.com/felixge/node-delayed-stream.git"
        },
        "main": "./lib/delayed_stream",
        "engines": {
          "node": ">=0.4.0"
        },
        "scripts": {
          "test": "make test"
        },
        "dependencies": {},
        "devDependencies": {
          "fake": "0.2.0",
          "far": "0.0.1"
        }
      })
    },
    "detect-indent": {
      "package.json": JSON.stringify({
        "name": "detect-indent",
        "version": "4.0.0",
        "description": "Detect the indentation of code",
        "license": "MIT",
        "repository": "sindresorhus/detect-indent",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=0.10.0"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "indent",
          "indentation",
          "detect",
          "infer",
          "identify",
          "code",
          "string",
          "text",
          "source",
          "space",
          "tab"
        ],
        "dependencies": {
          "repeating": "^2.0.0"
        },
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        },
        "xo": {
          "ignores": [
            "fixture/**"
          ]
        }
      })
    },
    "diff": {
      "package.json": JSON.stringify({
        "name": "diff",
        "version": "4.0.1",
        "description": "A javascript text diff implementation.",
        "keywords": [
          "diff",
          "javascript"
        ],
        "maintainers": [
          "Kevin Decker <kpdecker@gmail.com> (http://incaseofstairs.com)"
        ],
        "bugs": {
          "email": "kpdecker@gmail.com",
          "url": "http://github.com/kpdecker/jsdiff/issues"
        },
        "license": "BSD-3-Clause",
        "repository": {
          "type": "git",
          "url": "git://github.com/kpdecker/jsdiff.git"
        },
        "engines": {
          "node": ">=0.3.1"
        },
        "main": "./lib/index.js",
        "module": "./lib/index.es6.js",
        "browser": "./dist/diff.js",
        "scripts": {
          "clean": "rm -rf lib/ dist/",
          "build:node": "yarn babel --out-dir lib  --source-maps=inline src",
          "test": "grunt"
        },
        "devDependencies": {
          "@babel/cli": "^7.2.3",
          "@babel/core": "^7.2.2",
          "@babel/plugin-transform-modules-commonjs": "^7.2.0",
          "@babel/preset-env": "^7.2.3",
          "@babel/register": "^7.0.0",
          "babel-eslint": "^10.0.1",
          "babel-loader": "^8.0.5",
          "chai": "^4.2.0",
          "colors": "^1.3.3",
          "eslint": "^5.12.0",
          "grunt": "^1.0.3",
          "grunt-babel": "^8.0.0",
          "grunt-clean": "^0.4.0",
          "grunt-cli": "^1.3.2",
          "grunt-contrib-clean": "^2.0.0",
          "grunt-contrib-copy": "^1.0.0",
          "grunt-contrib-uglify": "^4.0.0",
          "grunt-contrib-watch": "^1.1.0",
          "grunt-eslint": "^21.0.0",
          "grunt-exec": "^3.0.0",
          "grunt-karma": "^3.0.1",
          "grunt-mocha-istanbul": "^5.0.2",
          "grunt-mocha-test": "^0.13.3",
          "grunt-webpack": "^3.1.3",
          "istanbul": "github:kpdecker/istanbul",
          "karma": "^3.1.4",
          "karma-chrome-launcher": "^2.2.0",
          "karma-mocha": "^1.3.0",
          "karma-mocha-reporter": "^2.0.0",
          "karma-sauce-launcher": "^2.0.2",
          "karma-sourcemap-loader": "^0.3.6",
          "karma-webpack": "^3.0.5",
          "mocha": "^5.2.0",
          "rollup": "^1.0.2",
          "rollup-plugin-babel": "^4.2.0",
          "semver": "^5.6.0",
          "webpack": "^4.28.3",
          "webpack-dev-server": "^3.1.14"
        },
        "optionalDependencies": {}
      })
    },
    "ecc-jsbn": {
      "package.json": JSON.stringify({
        "name": "ecc-jsbn",
        "version": "0.1.2",
        "description": "ECC JS code based on JSBN",
        "main": "index.js",
        "repository": {
          "type": "git",
          "url": "https://github.com/quartzjer/ecc-jsbn.git"
        },
        "keywords": [
          "jsbn",
          "ecc",
          "browserify"
        ],
        "author": {
          "name": "Jeremie Miller",
          "email": "jeremie@jabber.org",
          "url": "http://jeremie.com/"
        },
        "maintainers": [
          {
            "name": "Jeremie Miller",
            "email": "jeremie@jabber.org",
            "url": "http://jeremie.com/"
          },
          {
            "name": "Ryan Bennett",
            "url": "https://github.com/rynomad"
          }
        ],
        "dependencies": {
          "jsbn": "~0.1.0",
          "safer-buffer": "^2.1.0"
        },
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/quartzjer/ecc-jsbn/issues"
        },
        "homepage": "https://github.com/quartzjer/ecc-jsbn"
      })
    },
    "emoji-regex": {
      "package.json": JSON.stringify({
        "name": "emoji-regex",
        "version": "7.0.3",
        "description": "A regular expression to match all Emoji-only symbols as per the Unicode Standard.",
        "homepage": "https://mths.be/emoji-regex",
        "main": "index.js",
        "types": "index.d.ts",
        "keywords": [
          "unicode",
          "regex",
          "regexp",
          "regular expressions",
          "code points",
          "symbols",
          "characters",
          "emoji"
        ],
        "license": "MIT",
        "author": {
          "name": "Mathias Bynens",
          "url": "https://mathiasbynens.be/"
        },
        "repository": {
          "type": "git",
          "url": "https://github.com/mathiasbynens/emoji-regex.git"
        },
        "bugs": "https://github.com/mathiasbynens/emoji-regex/issues",
        "files": [
          "LICENSE-MIT.txt",
          "index.js",
          "index.d.ts",
          "text.js",
          "es2015/index.js",
          "es2015/text.js"
        ],
        "scripts": {
          "build": "rm -rf -- es2015; babel src -d .; NODE_ENV=es2015 babel src -d ./es2015; node script/inject-sequences.js",
          "test": "mocha",
          "test:watch": "npm run test -- --watch"
        },
        "devDependencies": {
          "@babel/cli": "^7.0.0",
          "@babel/core": "^7.0.0",
          "@babel/plugin-proposal-unicode-property-regex": "^7.0.0",
          "@babel/preset-env": "^7.0.0",
          "mocha": "^5.2.0",
          "regexgen": "^1.3.0",
          "unicode-11.0.0": "^0.7.7",
          "unicode-tr51": "^9.0.1"
        }
      })
    },
    "end-of-stream": {
      "package.json": JSON.stringify({
        "name": "end-of-stream",
        "version": "1.4.1",
        "description": "Call a callback when a readable/writable/duplex stream has completed or failed.",
        "repository": {
          "type": "git",
          "url": "git://github.com/mafintosh/end-of-stream.git"
        },
        "dependencies": {
          "once": "^1.4.0"
        },
        "scripts": {
          "test": "node test.js"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "stream",
          "streams",
          "callback",
          "finish",
          "close",
          "end",
          "wait"
        ],
        "bugs": {
          "url": "https://github.com/mafintosh/end-of-stream/issues"
        },
        "homepage": "https://github.com/mafintosh/end-of-stream",
        "main": "index.js",
        "author": "Mathias Buus <mathiasbuus@gmail.com>",
        "license": "MIT"
      })
    },
    "error-ex": {
      "package.json": JSON.stringify({
        "name": "error-ex",
        "description": "Easy error subclassing and stack customization",
        "version": "1.3.2",
        "maintainers": [
          "Josh Junon <i.am.qix@gmail.com> (github.com/qix-)",
          "Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)"
        ],
        "keywords": [
          "error",
          "errors",
          "extend",
          "extending",
          "extension",
          "subclass",
          "stack",
          "custom"
        ],
        "license": "MIT",
        "scripts": {
          "pretest": "xo",
          "test": "mocha --compilers coffee:coffee-script/register"
        },
        "xo": {
          "rules": {
            "operator-linebreak": [
              0
            ]
          }
        },
        "repository": "qix-/node-error-ex",
        "files": [
          "index.js"
        ],
        "devDependencies": {
          "coffee-script": "^1.9.3",
          "coveralls": "^2.11.2",
          "istanbul": "^0.3.17",
          "mocha": "^2.2.5",
          "should": "^7.0.1",
          "xo": "^0.7.1"
        },
        "dependencies": {
          "is-arrayish": "^0.2.1"
        }
      })
    },
    "es6-error": {
      "package.json": JSON.stringify({
        "name": "es6-error",
        "version": "4.1.1",
        "description": "Easily-extendable error for use with ES6 classes",
        "main": "./lib/index",
        "module": "./es6/index.js",
        "typings": "./typings/index.d.ts",
        "files": [
          "lib",
          "es6",
          "typings"
        ],
        "scripts": {
          "test": "cross-env BABEL_ENV=test mocha --require babel-core/register --recursive",
          "clean": "rimraf lib es6",
          "build": "npm run clean && npm run build:cjs && npm run build:es6",
          "build:cjs": "mkdir -p lib && cross-env BABEL_ENV=cjs babel src/index.js -o lib/index.js",
          "build:es6": "mkdir -p es6 && cross-env BABEL_ENV=es6 babel src/index.js -o es6/index.js",
          "prepublishOnly": "npm run build && npm run test"
        },
        "repository": {
          "type": "git",
          "url": "https://github.com/bjyoungblood/es6-error.git"
        },
        "keywords": [
          "es6",
          "error",
          "babel"
        ],
        "author": "Ben Youngblood",
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/bjyoungblood/es6-error/issues"
        },
        "homepage": "https://github.com/bjyoungblood/es6-error",
        "devDependencies": {
          "babel-cli": "^6.26.0",
          "babel-core": "^6.26.0",
          "babel-plugin-add-module-exports": "^0.2.1",
          "babel-plugin-transform-builtin-extend": "^1.1.2",
          "babel-preset-env": "^1.6.1",
          "chai": "^4.1.2",
          "cross-env": "^5.1.1",
          "mocha": "^4.0.1",
          "rimraf": "^2.6.2"
        },
        "dependencies": {}
      })
    },
    "escape-string-regexp": {
      "package.json": JSON.stringify({
        "name": "escape-string-regexp",
        "version": "1.0.5",
        "description": "Escape RegExp special characters",
        "license": "MIT",
        "repository": "sindresorhus/escape-string-regexp",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "maintainers": [
          "Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)",
          "Joshua Boy Nicolai Appelman <joshua@jbna.nl> (jbna.nl)"
        ],
        "engines": {
          "node": ">=0.8.0"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "escape",
          "regex",
          "regexp",
          "re",
          "regular",
          "expression",
          "string",
          "str",
          "special",
          "characters"
        ],
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        }
      })
    },
    "esm": {
      "package.json": JSON.stringify({
        "name": "esm",
        "version": "3.2.25",
        "description": "Tomorrow's ECMAScript modules today!",
        "keywords": "commonjs, ecmascript, export, import, modules, node, require",
        "repository": "standard-things/esm",
        "license": "MIT",
        "author": "John-David Dalton <john.david.dalton@gmail.com>",
        "main": "esm.js",
        "runkitExample": "require = require(\"esm\")(module)\nrequire(\"lodash-es\")",
        "engines": {
          "node": ">=6"
        },
        "husky": {
          "hooks": {
            "precommit": "npm run lint"
          }
        },
        "scripts": {
          "test": "echo \"Error: no test specified\" && exit 1"
        },
        "files": [
          "index.js",
          "esm.js",
          "esm/loader.js"
        ]
      })
    },
    "esprima": {
      "package.json": JSON.stringify({
        "name": "esprima",
        "description": "ECMAScript parsing infrastructure for multipurpose analysis",
        "homepage": "http://esprima.org",
        "main": "dist/esprima.js",
        "bin": {
          "esparse": "./bin/esparse.js",
          "esvalidate": "./bin/esvalidate.js"
        },
        "version": "4.0.1",
        "files": [
          "bin",
          "dist/esprima.js"
        ],
        "engines": {
          "node": ">=4"
        },
        "author": {
          "name": "Ariya Hidayat",
          "email": "ariya.hidayat@gmail.com"
        },
        "maintainers": [
          {
            "name": "Ariya Hidayat",
            "email": "ariya.hidayat@gmail.com",
            "web": "http://ariya.ofilabs.com"
          }
        ],
        "repository": {
          "type": "git",
          "url": "https://github.com/jquery/esprima.git"
        },
        "bugs": {
          "url": "https://github.com/jquery/esprima/issues"
        },
        "license": "BSD-2-Clause",
        "devDependencies": {
          "codecov.io": "~0.1.6",
          "escomplex-js": "1.2.0",
          "everything.js": "~1.0.3",
          "glob": "~7.1.0",
          "istanbul": "~0.4.0",
          "json-diff": "~0.3.1",
          "karma": "~1.3.0",
          "karma-chrome-launcher": "~2.0.0",
          "karma-detect-browsers": "~2.2.3",
          "karma-edge-launcher": "~0.2.0",
          "karma-firefox-launcher": "~1.0.0",
          "karma-ie-launcher": "~1.0.0",
          "karma-mocha": "~1.3.0",
          "karma-safari-launcher": "~1.0.0",
          "karma-safaritechpreview-launcher": "~0.0.4",
          "karma-sauce-launcher": "~1.1.0",
          "lodash": "~3.10.1",
          "mocha": "~3.2.0",
          "node-tick-processor": "~0.0.2",
          "regenerate": "~1.3.2",
          "temp": "~0.8.3",
          "tslint": "~5.1.0",
          "typescript": "~2.3.2",
          "typescript-formatter": "~5.1.3",
          "unicode-8.0.0": "~0.7.0",
          "webpack": "~1.14.0"
        },
        "keywords": [
          "ast",
          "ecmascript",
          "esprima",
          "javascript",
          "parser",
          "syntax"
        ],
        "scripts": {
          "check-version": "node test/check-version.js",
          "tslint": "tslint src/*.ts",
          "code-style": "tsfmt --verify src/*.ts && tsfmt --verify test/*.js",
          "format-code": "tsfmt -r src/*.ts && tsfmt -r test/*.js",
          "complexity": "node test/check-complexity.js",
          "static-analysis": "npm run check-version && npm run tslint && npm run code-style && npm run complexity",
          "hostile-env-tests": "node test/hostile-environment-tests.js",
          "unit-tests": "node test/unit-tests.js",
          "api-tests": "mocha -R dot test/api-tests.js",
          "grammar-tests": "node test/grammar-tests.js",
          "regression-tests": "node test/regression-tests.js",
          "all-tests": "npm run verify-line-ending && npm run generate-fixtures && npm run unit-tests && npm run api-tests && npm run grammar-tests && npm run regression-tests && npm run hostile-env-tests",
          "verify-line-ending": "node test/verify-line-ending.js",
          "generate-fixtures": "node tools/generate-fixtures.js",
          "browser-tests": "npm run compile && npm run generate-fixtures && cd test && karma start --single-run",
          "saucelabs-evergreen": "cd test && karma start saucelabs-evergreen.conf.js",
          "saucelabs-safari": "cd test && karma start saucelabs-safari.conf.js",
          "saucelabs-ie": "cd test && karma start saucelabs-ie.conf.js",
          "saucelabs": "npm run saucelabs-evergreen && npm run saucelabs-ie && npm run saucelabs-safari",
          "analyze-coverage": "istanbul cover test/unit-tests.js",
          "check-coverage": "istanbul check-coverage --statement 100 --branch 100 --function 100",
          "dynamic-analysis": "npm run analyze-coverage && npm run check-coverage",
          "compile": "tsc -p src/ && webpack && node tools/fixupbundle.js",
          "test": "npm run compile && npm run all-tests && npm run static-analysis && npm run dynamic-analysis",
          "prepublish": "npm run compile",
          "profile": "node --prof test/profile.js && mv isolate*.log v8.log && node-tick-processor",
          "benchmark-parser": "node -expose_gc test/benchmark-parser.js",
          "benchmark-tokenizer": "node --expose_gc test/benchmark-tokenizer.js",
          "benchmark": "npm run benchmark-parser && npm run benchmark-tokenizer",
          "codecov": "istanbul report cobertura && codecov < ./coverage/cobertura-coverage.xml",
          "downstream": "node test/downstream.js",
          "travis": "npm test",
          "circleci": "npm test && npm run codecov && npm run downstream",
          "appveyor": "npm run compile && npm run all-tests && npm run browser-tests",
          "droneio": "npm run compile && npm run all-tests && npm run saucelabs",
          "generate-regex": "node tools/generate-identifier-regex.js",
          "generate-xhtml-entities": "node tools/generate-xhtml-entities.js"
        }
      })
    },
    "esutils": {
      "package.json": JSON.stringify({
        "name": "esutils",
        "description": "utility box for ECMAScript language tools",
        "homepage": "https://github.com/estools/esutils",
        "main": "lib/utils.js",
        "version": "2.0.2",
        "engines": {
          "node": ">=0.10.0"
        },
        "directories": {
          "lib": "./lib"
        },
        "files": [
          "LICENSE.BSD",
          "README.md",
          "lib"
        ],
        "maintainers": [
          {
            "name": "Yusuke Suzuki",
            "email": "utatane.tea@gmail.com",
            "web": "http://github.com/Constellation"
          }
        ],
        "repository": {
          "type": "git",
          "url": "http://github.com/estools/esutils.git"
        },
        "devDependencies": {
          "chai": "~1.7.2",
          "coffee-script": "~1.6.3",
          "jshint": "2.6.3",
          "mocha": "~2.2.1",
          "regenerate": "~1.2.1",
          "unicode-7.0.0": "^0.1.5"
        },
        "licenses": [
          {
            "type": "BSD",
            "url": "http://github.com/estools/esutils/raw/master/LICENSE.BSD"
          }
        ],
        "scripts": {
          "test": "npm run-script lint && npm run-script unit-test",
          "lint": "jshint lib/*.js",
          "unit-test": "mocha --compilers coffee:coffee-script -R spec",
          "generate-regex": "node tools/generate-identifier-regex.js"
        }
      })
    },
    "events-to-array": {
      "package.json": JSON.stringify({
        "name": "events-to-array",
        "version": "1.1.2",
        "description": "Put a bunch of emitted events in an array, for testing.",
        "main": "etoa.js",
        "directories": {
          "test": "test"
        },
        "dependencies": {},
        "devDependencies": {
          "tap": "^10.3.2"
        },
        "scripts": {
          "test": "tap test/*.js --100",
          "preversion": "npm test",
          "postversion": "npm publish",
          "postpublish": "git push origin --all; git push origin --tags"
        },
        "repository": {
          "type": "git",
          "url": "https://github.com/isaacs/events-to-array"
        },
        "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me/)",
        "license": "ISC",
        "bugs": {
          "url": "https://github.com/isaacs/events-to-array/issues"
        },
        "homepage": "https://github.com/isaacs/events-to-array"
      })
    },
    "execa": {
      "package.json": JSON.stringify({
        "name": "execa",
        "version": "1.0.0",
        "description": "A better `child_process`",
        "license": "MIT",
        "repository": "sindresorhus/execa",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=6"
        },
        "scripts": {
          "test": "xo && nyc ava"
        },
        "files": [
          "index.js",
          "lib"
        ],
        "keywords": [
          "exec",
          "child",
          "process",
          "execute",
          "fork",
          "execfile",
          "spawn",
          "file",
          "shell",
          "bin",
          "binary",
          "binaries",
          "npm",
          "path",
          "local"
        ],
        "dependencies": {
          "cross-spawn": "^6.0.0",
          "get-stream": "^4.0.0",
          "is-stream": "^1.1.0",
          "npm-run-path": "^2.0.0",
          "p-finally": "^1.0.0",
          "signal-exit": "^3.0.0",
          "strip-eof": "^1.0.0"
        },
        "devDependencies": {
          "ava": "*",
          "cat-names": "^1.0.2",
          "coveralls": "^3.0.1",
          "delay": "^3.0.0",
          "is-running": "^2.0.0",
          "nyc": "^13.0.1",
          "tempfile": "^2.0.0",
          "xo": "*"
        },
        "nyc": {
          "reporter": [
            "text",
            "lcov"
          ],
          "exclude": [
            "**/fixtures/**",
            "**/test.js",
            "**/test/**"
          ]
        }
      })
    },
    "extend": {
      "package.json": JSON.stringify({
        "name": "extend",
        "author": "Stefan Thomas <justmoon@members.fsf.org> (http://www.justmoon.net)",
        "version": "3.0.2",
        "description": "Port of jQuery.extend for node.js and the browser",
        "main": "index",
        "scripts": {
          "pretest": "npm run lint",
          "test": "npm run tests-only",
          "posttest": "npm run coverage-quiet",
          "tests-only": "node test",
          "coverage": "covert test/index.js",
          "coverage-quiet": "covert test/index.js --quiet",
          "lint": "npm run jscs && npm run eslint",
          "jscs": "jscs *.js */*.js",
          "eslint": "eslint *.js */*.js"
        },
        "contributors": [
          {
            "name": "Jordan Harband",
            "url": "https://github.com/ljharb"
          }
        ],
        "keywords": [
          "extend",
          "clone",
          "merge"
        ],
        "repository": {
          "type": "git",
          "url": "https://github.com/justmoon/node-extend.git"
        },
        "dependencies": {},
        "devDependencies": {
          "@ljharb/eslint-config": "^12.2.1",
          "covert": "^1.1.0",
          "eslint": "^4.19.1",
          "jscs": "^3.0.7",
          "tape": "^4.9.1"
        },
        "license": "MIT"
      })
    },
    "extsprintf": {
      "package.json": JSON.stringify({
        "name": "extsprintf",
        "version": "1.3.0",
        "description": "extended POSIX-style sprintf",
        "main": "./lib/extsprintf.js",
        "repository": {
          "type": "git",
          "url": "git://github.com/davepacheco/node-extsprintf.git"
        },
        "engines": [
          "node >=0.6.0"
        ],
        "license": "MIT"
      })
    },
    "fast-deep-equal": {
      "package.json": JSON.stringify({
        "name": "fast-deep-equal",
        "version": "2.0.1",
        "description": "Fast deep equal",
        "main": "index.js",
        "scripts": {
          "eslint": "eslint *.js benchmark spec",
          "test-spec": "mocha spec/*.spec.js -R spec",
          "test-cov": "nyc npm run test-spec",
          "test-ts": "tsc --target ES5 --noImplicitAny index.d.ts",
          "test": "npm run eslint && npm run test-ts && npm run test-cov"
        },
        "repository": {
          "type": "git",
          "url": "git+https://github.com/epoberezkin/fast-deep-equal.git"
        },
        "keywords": [
          "fast",
          "equal",
          "deep-equal"
        ],
        "author": "Evgeny Poberezkin",
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/epoberezkin/fast-deep-equal/issues"
        },
        "homepage": "https://github.com/epoberezkin/fast-deep-equal#readme",
        "devDependencies": {
          "benchmark": "^2.1.4",
          "coveralls": "^2.13.1",
          "deep-eql": "latest",
          "deep-equal": "latest",
          "eslint": "^4.0.0",
          "lodash": "latest",
          "mocha": "^3.4.2",
          "nano-equal": "latest",
          "nyc": "^11.0.2",
          "pre-commit": "^1.2.2",
          "ramda": "latest",
          "shallow-equal-fuzzy": "latest",
          "typescript": "^2.6.1",
          "underscore": "latest"
        },
        "nyc": {
          "exclude": [
            "**/spec/**",
            "node_modules"
          ],
          "reporter": [
            "lcov",
            "text-summary"
          ]
        },
        "files": [
          "index.js",
          "index.d.ts"
        ],
        "types": "index.d.ts"
      })
    },
    "fast-json-stable-stringify": {
      "package.json": JSON.stringify({
        "name": "fast-json-stable-stringify",
        "version": "2.0.0",
        "description": "deterministic `JSON.stringify()` - a faster version of substack's json-stable-strigify without jsonify",
        "main": "index.js",
        "devDependencies": {
          "benchmark": "^2.1.4",
          "coveralls": "^3.0.0",
          "eslint": "^4.9.0",
          "fast-stable-stringify": "latest",
          "faster-stable-stringify": "latest",
          "json-stable-stringify": "latest",
          "nyc": "^11.2.1",
          "pre-commit": "^1.2.2",
          "tape": "~1.0.4"
        },
        "scripts": {
          "eslint": "eslint index.js test",
          "test-spec": "tape test/*.js",
          "test": "npm run eslint && nyc npm run test-spec"
        },
        "repository": {
          "type": "git",
          "url": "git://github.com/epoberezkin/fast-json-stable-stringify.git"
        },
        "homepage": "https://github.com/epoberezkin/fast-json-stable-stringify",
        "keywords": [
          "json",
          "stringify",
          "deterministic",
          "hash",
          "stable"
        ],
        "author": {
          "name": "James Halliday",
          "email": "mail@substack.net",
          "url": "http://substack.net"
        },
        "license": "MIT",
        "nyc": {
          "exclude": [
            "test",
            "node_modules"
          ],
          "reporter": [
            "lcov",
            "text-summary"
          ]
        }
      })
    },
    "fill-range": {
      "package.json": JSON.stringify({
        "name": "fill-range",
        "description": "Fill in a range of numbers or letters, optionally passing an increment or `step` to use, or create a regex-compatible range with `options.toRegex`",
        "version": "7.0.1",
        "homepage": "https://github.com/jonschlinkert/fill-range",
        "author": "Jon Schlinkert (https://github.com/jonschlinkert)",
        "contributors": [
          "Edo Rivai (edo.rivai.nl)",
          "Jon Schlinkert (http://twitter.com/jonschlinkert)",
          "Paul Miller (paulmillr.com)",
          "Rouven Weßling (www.rouvenwessling.de)",
          "(https://github.com/wtgtybhertgeghgtwtg)"
        ],
        "repository": "jonschlinkert/fill-range",
        "bugs": {
          "url": "https://github.com/jonschlinkert/fill-range/issues"
        },
        "license": "MIT",
        "files": [
          "index.js"
        ],
        "main": "index.js",
        "engines": {
          "node": ">=8"
        },
        "scripts": {
          "test": "mocha"
        },
        "dependencies": {
          "to-regex-range": "^5.0.1"
        },
        "devDependencies": {
          "gulp-format-md": "^2.0.0",
          "mocha": "^6.1.1"
        },
        "keywords": [
          "alpha",
          "alphabetical",
          "array",
          "bash",
          "brace",
          "expand",
          "expansion",
          "fill",
          "glob",
          "match",
          "matches",
          "matching",
          "number",
          "numerical",
          "range",
          "ranges",
          "regex",
          "sh"
        ],
        "verb": {
          "toc": false,
          "layout": "default",
          "tasks": [
            "readme"
          ],
          "plugins": [
            "gulp-format-md"
          ],
          "lint": {
            "reflinks": true
          }
        }
      })
    },
    "find-cache-dir": {
      "package.json": JSON.stringify({
        "name": "find-cache-dir",
        "version": "2.1.0",
        "description": "Finds the common standard cache directory",
        "license": "MIT",
        "repository": "avajs/find-cache-dir",
        "engines": {
          "node": ">=6"
        },
        "scripts": {
          "test": "xo && nyc ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "cache",
          "directory",
          "dir",
          "caching",
          "find",
          "search"
        ],
        "dependencies": {
          "commondir": "^1.0.1",
          "make-dir": "^2.0.0",
          "pkg-dir": "^3.0.0"
        },
        "devDependencies": {
          "ava": "^1.3.1",
          "coveralls": "^3.0.3",
          "del": "^4.0.0",
          "nyc": "^13.3.0",
          "xo": "^0.24.0"
        },
        "nyc": {
          "reporter": [
            "lcov",
            "text"
          ]
        }
      })
    },
    "find-up": {
      "package.json": JSON.stringify({
        "name": "find-up",
        "version": "3.0.0",
        "description": "Find a file or directory by walking up parent directories",
        "license": "MIT",
        "repository": "sindresorhus/find-up",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=6"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "find",
          "up",
          "find-up",
          "findup",
          "look-up",
          "look",
          "file",
          "search",
          "match",
          "package",
          "resolve",
          "parent",
          "parents",
          "folder",
          "directory",
          "dir",
          "walk",
          "walking",
          "path"
        ],
        "dependencies": {
          "locate-path": "^3.0.0"
        },
        "devDependencies": {
          "ava": "*",
          "tempy": "^0.2.1",
          "xo": "*"
        }
      })
    },
    "findit": {
      "package.json": JSON.stringify({
        "name": "findit",
        "version": "2.0.0",
        "description": "walk a directory tree recursively with events",
        "main": "index.js",
        "devDependencies": {
          "tap": "~0.4.4",
          "mkdirp": "~0.3.5"
        },
        "scripts": {
          "test": "tap test/*.js"
        },
        "repository": {
          "type": "git",
          "url": "http://github.com/substack/node-findit.git"
        },
        "keywords": [
          "find",
          "walk",
          "directory",
          "recursive",
          "tree",
          "traversal"
        ],
        "author": {
          "name": "James Halliday",
          "email": "mail@substack.net",
          "url": "http://substack.net"
        },
        "license": "MIT"
      })
    },
    "flow-parser": {
      "package.json": JSON.stringify({
        "name": "flow-parser",
        "version": "0.112.0",
        "description": "JavaScript parser written in OCaml. Produces ESTree AST",
        "homepage": "https://flow.org",
        "license": "MIT",
        "author": {
          "name": "Flow Team",
          "email": "flow@fb.com"
        },
        "files": [
          "flow_parser.js"
        ],
        "main": "flow_parser.js",
        "repository": {
          "type": "git",
          "url": "https://github.com/facebook/flow.git"
        },
        "scripts": {
          "test": "node test/run_tests.js",
          "prepublish": "make js"
        },
        "dependencies": {},
        "devDependencies": {
          "ast-types": "0.8.18",
          "colors": ">=0.6.2",
          "esprima-fb": "15001.1001.0-dev-harmony-fb",
          "minimist": ">=0.2.0"
        },
        "engines": {
          "node": ">=0.4.0"
        }
      })
    },
    "flow-remove-types": {
      "package.json": JSON.stringify({
        "name": "flow-remove-types",
        "version": "2.112.0",
        "description": "Removes Flow type annotations from JavaScript files with speed and simplicity.",
        "author": {
          "name": "Flow Team",
          "email": "flow@fb.com"
        },
        "contributors": [
          "Lee Byron <lee@leebyron.com> (http://leebyron.com/)"
        ],
        "license": "MIT",
        "main": "index.js",
        "bin": {
          "flow-remove-types": "./flow-remove-types",
          "flow-node": "./flow-node"
        },
        "files": [
          "index.js",
          "register.js",
          "flow-remove-types",
          "flow-node",
          "LICENSE"
        ],
        "homepage": "https://flow.org",
        "bugs": {
          "url": "https://github.com/facebook/flow/issues"
        },
        "repository": {
          "type": "git",
          "url": "https://github.com/facebook/flow.git"
        },
        "scripts": {
          "test": "./test.sh",
          "test-update": "./test-update.sh"
        },
        "keywords": [
          "flow",
          "flowtype",
          "compiler",
          "transpiler",
          "transform",
          "es6"
        ],
        "dependencies": {
          "flow-parser": "^0.112.0",
          "pirates": "^3.0.2",
          "vlq": "^0.2.1"
        },
        "engines": {
          "node": ">=4"
        }
      })
    },
    "foreground-child": {
      "node_modules": {
        "cross-spawn": {
          "package.json": JSON.stringify({
            "name": "cross-spawn",
            "version": "4.0.2",
            "description": "Cross platform child_process#spawn and child_process#spawnSync",
            "main": "index.js",
            "scripts": {
              "test": "node test/prepare && mocha --bail test/test",
              "lint": "eslint '{*.js,lib/**/*.js,test/**/*.js}'"
            },
            "bugs": {
              "url": "https://github.com/IndigoUnited/node-cross-spawn/issues/"
            },
            "repository": {
              "type": "git",
              "url": "git://github.com/IndigoUnited/node-cross-spawn.git"
            },
            "files": [
              "index.js",
              "lib"
            ],
            "keywords": [
              "spawn",
              "spawnSync",
              "windows",
              "cross",
              "platform",
              "path",
              "ext",
              "path-ext",
              "path_ext",
              "shebang",
              "hashbang",
              "cmd",
              "execute"
            ],
            "author": "IndigoUnited <hello@indigounited.com> (http://indigounited.com)",
            "license": "MIT",
            "dependencies": {
              "lru-cache": "^4.0.1",
              "which": "^1.2.9"
            },
            "devDependencies": {
              "@satazor/eslint-config": "^3.0.0",
              "eslint": "^3.0.0",
              "expect.js": "^0.3.0",
              "glob": "^7.0.0",
              "mkdirp": "^0.5.1",
              "mocha": "^3.0.2",
              "rimraf": "^2.5.0"
            }
          })
        },
        "which": {
          "package.json": JSON.stringify({
            "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me)",
            "name": "which",
            "description": "Like which(1) unix command. Find the first instance of an executable in the PATH.",
            "version": "1.3.1",
            "repository": {
              "type": "git",
              "url": "git://github.com/isaacs/node-which.git"
            },
            "main": "which.js",
            "bin": "./bin/which",
            "license": "ISC",
            "dependencies": {
              "isexe": "^2.0.0"
            },
            "devDependencies": {
              "mkdirp": "^0.5.0",
              "rimraf": "^2.6.2",
              "tap": "^12.0.1"
            },
            "scripts": {
              "test": "tap test/*.js --cov",
              "changelog": "bash gen-changelog.sh",
              "postversion": "npm run changelog && git add CHANGELOG.md && git commit -m 'update changelog - '${npm_package_version}"
            },
            "files": [
              "which.js",
              "bin/which"
            ]
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "foreground-child",
        "version": "1.5.6",
        "description": "Run a child as if it's the foreground process.  Give it stdio.  Exit when it exits.",
        "main": "index.js",
        "directories": {
          "test": "test"
        },
        "dependencies": {
          "cross-spawn": "^4",
          "signal-exit": "^3.0.0"
        },
        "devDependencies": {
          "tap": "^8.0.1"
        },
        "scripts": {
          "test": "tap --coverage test/*.js",
          "changelog": "bash changelog.sh",
          "postversion": "npm run changelog && git add CHANGELOG.md && git commit -m 'update changelog - '${npm_package_version}"
        },
        "repository": {
          "type": "git",
          "url": "git+https://github.com/tapjs/foreground-child.git"
        },
        "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me/)",
        "license": "ISC",
        "bugs": {
          "url": "https://github.com/tapjs/foreground-child/issues"
        },
        "homepage": "https://github.com/tapjs/foreground-child#readme",
        "files": [
          "index.js"
        ]
      })
    },
    "forever-agent": {
      "package.json": JSON.stringify({
        "author": "Mikeal Rogers <mikeal.rogers@gmail.com> (http://www.futurealoof.com)",
        "name": "forever-agent",
        "description": "HTTP Agent that keeps socket connections alive between keep-alive requests. Formerly part of mikeal/request, now a standalone module.",
        "version": "0.6.1",
        "license": "Apache-2.0",
        "repository": {
          "url": "https://github.com/mikeal/forever-agent"
        },
        "main": "index.js",
        "dependencies": {},
        "devDependencies": {},
        "optionalDependencies": {},
        "engines": {
          "node": "*"
        }
      })
    },
    "form-data": {
      "package.json": JSON.stringify({
        "author": "Felix Geisendörfer <felix@debuggable.com> (http://debuggable.com/)",
        "name": "form-data",
        "description": "A library to create readable \"multipart/form-data\" streams. Can be used to submit forms and file uploads to other web applications.",
        "version": "2.3.3",
        "repository": {
          "type": "git",
          "url": "git://github.com/form-data/form-data.git"
        },
        "main": "./lib/form_data",
        "browser": "./lib/browser",
        "scripts": {
          "pretest": "rimraf coverage test/tmp",
          "test": "istanbul cover test/run.js",
          "posttest": "istanbul report lcov text",
          "lint": "eslint lib/*.js test/*.js test/integration/*.js",
          "report": "istanbul report lcov text",
          "ci-lint": "is-node-modern 6 && npm run lint || is-node-not-modern 6",
          "ci-test": "npm run test && npm run browser && npm run report",
          "predebug": "rimraf coverage test/tmp",
          "debug": "verbose=1 ./test/run.js",
          "browser": "browserify -t browserify-istanbul test/run-browser.js | obake --coverage",
          "check": "istanbul check-coverage coverage/coverage*.json",
          "files": "pkgfiles --sort=name",
          "get-version": "node -e \"console.log(require('./package.json').version)\"",
          "update-readme": "sed -i.bak 's/\\/master\\.svg/\\/v'$(npm --silent run get-version)'.svg/g' README.md",
          "restore-readme": "mv README.md.bak README.md",
          "prepublish": "in-publish && npm run update-readme || not-in-publish",
          "postpublish": "npm run restore-readme"
        },
        "pre-commit": [
          "lint",
          "ci-test",
          "check"
        ],
        "engines": {
          "node": ">= 0.12"
        },
        "dependencies": {
          "asynckit": "^0.4.0",
          "combined-stream": "^1.0.6",
          "mime-types": "^2.1.12"
        },
        "devDependencies": {
          "browserify": "^13.1.1",
          "browserify-istanbul": "^2.0.0",
          "coveralls": "^2.11.14",
          "cross-spawn": "^4.0.2",
          "eslint": "^3.9.1",
          "fake": "^0.2.2",
          "far": "^0.0.7",
          "formidable": "^1.0.17",
          "in-publish": "^2.0.0",
          "is-node-modern": "^1.0.0",
          "istanbul": "^0.4.5",
          "obake": "^0.1.2",
          "phantomjs-prebuilt": "^2.1.13",
          "pkgfiles": "^2.3.0",
          "pre-commit": "^1.1.3",
          "request": "2.76.0",
          "rimraf": "^2.5.4",
          "tape": "^4.6.2"
        },
        "license": "MIT"
      })
    },
    "fs-exists-cached": {
      "package.json": JSON.stringify({
        "name": "fs-exists-cached",
        "version": "1.0.0",
        "description": "Just like `fs.exists` and `fs.existsSync`, but cached",
        "main": "index.js",
        "scripts": {
          "test": "tap test.js --100"
        },
        "devDependencies": {
          "tap": "9 || 10"
        },
        "repository": {
          "type": "git",
          "url": "git+https://github.com/isaacs/fs-exists-cached.git"
        },
        "keywords": [],
        "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me/)",
        "license": "ISC",
        "bugs": {
          "url": "https://github.com/isaacs/fs-exists-cached/issues"
        },
        "homepage": "https://github.com/isaacs/fs-exists-cached#readme",
        "dependencies": {}
      })
    },
    "fs.realpath": {
      "package.json": JSON.stringify({
        "name": "fs.realpath",
        "version": "1.0.0",
        "description": "Use node's fs.realpath, but fall back to the JS implementation if the native one fails",
        "main": "index.js",
        "dependencies": {},
        "devDependencies": {},
        "scripts": {
          "test": "tap test/*.js --cov"
        },
        "repository": {
          "type": "git",
          "url": "git+https://github.com/isaacs/fs.realpath.git"
        },
        "keywords": [
          "realpath",
          "fs",
          "polyfill"
        ],
        "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me/)",
        "license": "ISC",
        "files": [
          "old.js",
          "index.js"
        ]
      })
    },
    "fsevents": {
      "package.json": JSON.stringify({
        "name": "fsevents",
        "version": "2.1.2",
        "description": "Native Access to MacOS FSEvents",
        "main": "fsevents.js",
        "types": "fsevents.d.ts",
        "os": [
          "darwin"
        ],
        "files": [
          "fsevents.d.ts",
          "fsevents.js",
          "fsevents.node"
        ],
        "engines": {
          "node": "^8.16.0 || ^10.6.0 || >=11.0.0"
        },
        "scripts": {
          "clean": "node-gyp clean && rm -f fsevents.node",
          "build": "node-gyp clean && rm -f fsevents.node && node-gyp rebuild && node-gyp clean",
          "test": "/bin/bash ./test.sh 2>/dev/null",
          "prepublishOnly": "npm run build"
        },
        "repository": {
          "type": "git",
          "url": "https://github.com/fsevents/fsevents.git"
        },
        "keywords": [
          "fsevents",
          "mac"
        ],
        "contributors": [
          {
            "name": "Philipp Dunkel",
            "email": "pip@pipobscure.com"
          },
          {
            "name": "Ben Noordhuis",
            "email": "info@bnoordhuis.nl"
          },
          {
            "name": "Elan Shankar",
            "email": "elan.shanker@gmail.com"
          },
          {
            "name": "Miroslav Bajtoš",
            "email": "mbajtoss@gmail.com"
          },
          {
            "name": "Paul Miller",
            "url": "https://paulmillr.com"
          }
        ],
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/fsevents/fsevents/issues"
        },
        "homepage": "https://github.com/fsevents/fsevents"
      })
    },
    "function-loop": {
      "package.json": JSON.stringify({
        "name": "function-loop",
        "version": "1.0.2",
        "main": "index.js",
        "scripts": {
          "test": "tap test.js --100"
        },
        "repository": {
          "type": "git",
          "url": "git+https://github.com/isaacs/function-loop.git"
        },
        "keywords": [],
        "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me/)",
        "license": "ISC",
        "bugs": {
          "url": "https://github.com/isaacs/function-loop/issues"
        },
        "homepage": "https://github.com/isaacs/function-loop#readme",
        "devDependencies": {
          "tap": "^9.0.3"
        },
        "description": "Run a list of functions in order in a given object context.  The functions can be callback-taking or promise-returning."
      })
    },
    "get-caller-file": {
      "package.json": JSON.stringify({
        "name": "get-caller-file",
        "version": "2.0.5",
        "description": "",
        "main": "index.js",
        "directories": {
          "test": "tests"
        },
        "files": [
          "index.js",
          "index.js.map",
          "index.d.ts"
        ],
        "scripts": {
          "prepare": "tsc",
          "test": "mocha test",
          "test:debug": "mocha test"
        },
        "repository": {
          "type": "git",
          "url": "git+https://github.com/stefanpenner/get-caller-file.git"
        },
        "author": "Stefan Penner",
        "license": "ISC",
        "bugs": {
          "url": "https://github.com/stefanpenner/get-caller-file/issues"
        },
        "homepage": "https://github.com/stefanpenner/get-caller-file#readme",
        "devDependencies": {
          "@types/chai": "^4.1.7",
          "@types/ensure-posix-path": "^1.0.0",
          "@types/mocha": "^5.2.6",
          "@types/node": "^11.10.5",
          "chai": "^4.1.2",
          "ensure-posix-path": "^1.0.1",
          "mocha": "^5.2.0",
          "typescript": "^3.3.3333"
        },
        "engines": {
          "node": "6.* || 8.* || >= 10.*"
        }
      })
    },
    "get-stream": {
      "package.json": JSON.stringify({
        "name": "get-stream",
        "version": "4.1.0",
        "description": "Get a stream as a string, buffer, or array",
        "license": "MIT",
        "repository": "sindresorhus/get-stream",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=6"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js",
          "buffer-stream.js"
        ],
        "keywords": [
          "get",
          "stream",
          "promise",
          "concat",
          "string",
          "text",
          "buffer",
          "read",
          "data",
          "consume",
          "readable",
          "readablestream",
          "array",
          "object"
        ],
        "dependencies": {
          "pump": "^3.0.0"
        },
        "devDependencies": {
          "ava": "*",
          "into-stream": "^3.0.0",
          "xo": "*"
        }
      })
    },
    "getpass": {
      "package.json": JSON.stringify({
        "name": "getpass",
        "version": "0.1.7",
        "description": "getpass for node.js",
        "main": "lib/index.js",
        "dependencies": {
          "assert-plus": "^1.0.0"
        },
        "repository": {
          "type": "git",
          "url": "https://github.com/arekinath/node-getpass.git"
        },
        "scripts": {
          "test": "tape test/*.test.js"
        },
        "author": "Alex Wilson <alex.wilson@joyent.com>",
        "license": "MIT"
      })
    },
    "glob": {
      "package.json": JSON.stringify({
        "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me/)",
        "name": "glob",
        "description": "a little globber",
        "version": "7.1.4",
        "repository": {
          "type": "git",
          "url": "git://github.com/isaacs/node-glob.git"
        },
        "main": "glob.js",
        "files": [
          "glob.js",
          "sync.js",
          "common.js"
        ],
        "engines": {
          "node": "*"
        },
        "dependencies": {
          "fs.realpath": "^1.0.0",
          "inflight": "^1.0.4",
          "inherits": "2",
          "minimatch": "^3.0.4",
          "once": "^1.3.0",
          "path-is-absolute": "^1.0.0"
        },
        "devDependencies": {
          "mkdirp": "0",
          "rimraf": "^2.2.8",
          "tap": "^12.0.1",
          "tick": "0.0.6"
        },
        "scripts": {
          "prepublish": "npm run benchclean",
          "profclean": "rm -f v8.log profile.txt",
          "test": "tap test/*.js --cov",
          "test-regen": "npm run profclean && TEST_REGEN=1 node test/00-setup.js",
          "bench": "bash benchmark.sh",
          "prof": "bash prof.sh && cat profile.txt",
          "benchclean": "node benchclean.js"
        },
        "license": "ISC"
      })
    },
    "glob-parent": {
      "package.json": JSON.stringify({
        "name": "glob-parent",
        "version": "5.1.0",
        "description": "Extract the non-magic parent path from a glob string.",
        "author": "Gulp Team <team@gulpjs.com> (https://gulpjs.com/)",
        "contributors": [
          "Elan Shanker (https://github.com/es128)",
          "Blaine Bublitz <blaine.bublitz@gmail.com>"
        ],
        "repository": "gulpjs/glob-parent",
        "license": "ISC",
        "engines": {
          "node": ">= 6"
        },
        "main": "index.js",
        "files": [
          "LICENSE",
          "index.js"
        ],
        "scripts": {
          "lint": "eslint .",
          "pretest": "npm run lint",
          "test": "nyc mocha --async-only",
          "azure-pipelines": "nyc mocha --async-only --reporter xunit -O output=test.xunit",
          "coveralls": "nyc report --reporter=text-lcov | coveralls"
        },
        "dependencies": {
          "is-glob": "^4.0.1"
        },
        "devDependencies": {
          "coveralls": "github:phated/node-coveralls#2.x",
          "eslint": "^2.13.1",
          "eslint-config-gulp": "^3.0.1",
          "expect": "^1.20.2",
          "mocha": "^6.0.2",
          "nyc": "^13.3.0"
        },
        "keywords": [
          "glob",
          "parent",
          "strip",
          "path",
          "dirname",
          "directory",
          "base",
          "wildcard"
        ]
      })
    },
    "globals": {
      "package.json": JSON.stringify({
        "name": "globals",
        "version": "11.12.0",
        "description": "Global identifiers from different JavaScript environments",
        "license": "MIT",
        "repository": "sindresorhus/globals",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js",
          "globals.json"
        ],
        "keywords": [
          "globals",
          "global",
          "identifiers",
          "variables",
          "vars",
          "jshint",
          "eslint",
          "environments"
        ],
        "devDependencies": {
          "ava": "0.21.0",
          "xo": "0.18.0"
        },
        "xo": {
          "ignores": [
            "get-browser-globals.js"
          ]
        }
      })
    },
    "graceful-fs": {
      "package.json": JSON.stringify({
        "name": "graceful-fs",
        "description": "A drop-in replacement for fs, making various improvements.",
        "version": "4.2.0",
        "repository": {
          "type": "git",
          "url": "https://github.com/isaacs/node-graceful-fs"
        },
        "main": "graceful-fs.js",
        "directories": {
          "test": "test"
        },
        "scripts": {
          "preversion": "npm test",
          "postversion": "npm publish",
          "postpublish": "git push origin --follow-tags",
          "test": "node test.js | tap -"
        },
        "keywords": [
          "fs",
          "module",
          "reading",
          "retry",
          "retries",
          "queue",
          "error",
          "errors",
          "handling",
          "EMFILE",
          "EAGAIN",
          "EINVAL",
          "EPERM",
          "EACCESS"
        ],
        "license": "ISC",
        "devDependencies": {
          "import-fresh": "^2.0.0",
          "mkdirp": "^0.5.0",
          "rimraf": "^2.2.8",
          "tap": "^12.7.0"
        },
        "files": [
          "fs.js",
          "graceful-fs.js",
          "legacy-streams.js",
          "polyfills.js",
          "clone.js"
        ],
        "dependencies": {}
      })
    },
    "growl": {
      "package.json": JSON.stringify({
        "name": "growl",
        "version": "1.10.5",
        "description": "Growl unobtrusive notifications",
        "author": "TJ Holowaychuk <tj@vision-media.ca>",
        "maintainers": [
          "Joshua Boy Nicolai Appelman <joshua@jbnicolai.nl>",
          "Timo Sand <timo.sand@iki.fi>"
        ],
        "repository": {
          "type": "git",
          "url": "git://github.com/tj/node-growl.git"
        },
        "main": "./lib/growl.js",
        "license": "MIT",
        "devDependencies": {
          "eslint": "^4.8.0",
          "eslint-config-airbnb-base": "^12.0.1",
          "eslint-plugin-import": "^2.7.0",
          "eslint-plugin-node": "^5.2.0"
        },
        "scripts": {
          "test": "node test.js",
          "lint": "eslint --ext js lib "
        },
        "engines": {
          "node": ">=4.x"
        }
      })
    },
    "handlebars": {
      "package.json": JSON.stringify({
        "name": "handlebars",
        "barename": "handlebars",
        "version": "4.1.2",
        "description": "Handlebars provides the power necessary to let you build semantic templates effectively with no frustration",
        "homepage": "http://www.handlebarsjs.com/",
        "keywords": [
          "handlebars",
          "mustache",
          "template",
          "html"
        ],
        "repository": {
          "type": "git",
          "url": "https://github.com/wycats/handlebars.js.git"
        },
        "author": "Yehuda Katz",
        "license": "MIT",
        "readmeFilename": "README.md",
        "engines": {
          "node": ">=0.4.7"
        },
        "dependencies": {
          "neo-async": "^2.6.0",
          "optimist": "^0.6.1",
          "source-map": "^0.6.1"
        },
        "optionalDependencies": {
          "uglify-js": "^3.1.4"
        },
        "devDependencies": {
          "aws-sdk": "^2.1.49",
          "babel-loader": "^5.0.0",
          "babel-runtime": "^5.1.10",
          "benchmark": "~1.0",
          "dtslint": "^0.5.5",
          "dustjs-linkedin": "^2.0.2",
          "eco": "~1.1.0-rc-3",
          "grunt": "^1.0.3",
          "grunt-babel": "^5.0.0",
          "grunt-bg-shell": "^2.3.3",
          "grunt-cli": "^1",
          "grunt-contrib-clean": "^1",
          "grunt-contrib-concat": "^1",
          "grunt-contrib-connect": "^1",
          "grunt-contrib-copy": "^1",
          "grunt-contrib-requirejs": "^1",
          "grunt-contrib-uglify": "^1",
          "grunt-contrib-watch": "^1.1.0",
          "grunt-eslint": "^20.1.0",
          "grunt-saucelabs": "9.x",
          "grunt-webpack": "^1.0.8",
          "istanbul": "^0.3.0",
          "jison": "~0.3.0",
          "mocha": "^5",
          "mock-stdin": "^0.3.0",
          "mustache": "^2.1.3",
          "semver": "^5.0.1",
          "typescript": "^3.4.3",
          "underscore": "^1.5.1",
          "webpack": "^1.12.6",
          "webpack-dev-server": "^1.12.1"
        },
        "main": "lib/index.js",
        "types": "types/index.d.ts",
        "bin": {
          "handlebars": "bin/handlebars"
        },
        "scripts": {
          "checkTypes": "dtslint types",
          "test": "grunt"
        },
        "jspm": {
          "main": "handlebars",
          "directories": {
            "lib": "dist/amd"
          },
          "buildConfig": {
            "minify": true
          }
        },
        "files": [
          "bin",
          "dist/*.js",
          "dist/amd/**/*.js",
          "dist/cjs/**/*.js",
          "lib",
          "print-script",
          "release-notes.md",
          "runtime.js",
          "types/*.d.ts"
        ]
      })
    },
    "har-schema": {
      "package.json": JSON.stringify({
        "version": "2.0.0",
        "name": "har-schema",
        "description": "JSON Schema for HTTP Archive (HAR)",
        "author": "Ahmad Nassri <ahmad@ahmadnassri.com> (https://www.ahmadnassri.com/)",
        "contributors": [
          "Evgeny Poberezkin <e.poberezkin@me.com>"
        ],
        "homepage": "https://github.com/ahmadnassri/har-schema",
        "repository": {
          "type": "git",
          "url": "https://github.com/ahmadnassri/har-schema.git"
        },
        "license": "ISC",
        "main": "lib/index.js",
        "keywords": [
          "har",
          "http",
          "archive",
          "JSON",
          "schema",
          "JSON-schema"
        ],
        "engines": {
          "node": ">=4"
        },
        "files": [
          "lib"
        ],
        "bugs": {
          "url": "https://github.com/ahmadnassri/har-schema/issues"
        },
        "scripts": {
          "test": "tap test --reporter spec",
          "pretest": "snazzy && echint",
          "coverage": "tap test --reporter silent --coverage",
          "codeclimate": "tap --coverage-report=text-lcov | codeclimate-test-reporter",
          "semantic-release": "semantic-release pre && npm publish && semantic-release post"
        },
        "config": {
          "commitizen": {
            "path": "./node_modules/cz-conventional-changelog"
          }
        },
        "devDependencies": {
          "ajv": "^5.0.0",
          "codeclimate-test-reporter": "^0.4.0",
          "cz-conventional-changelog": "^1.2.0",
          "echint": "^2.1.0",
          "semantic-release": "^6.3.2",
          "snazzy": "^5.0.0",
          "tap": "^8.0.1"
        }
      })
    },
    "har-validator": {
      "package.json": JSON.stringify({
        "version": "5.1.3",
        "name": "har-validator",
        "description": "Extremely fast HTTP Archive (HAR) validator using JSON Schema",
        "author": "Ahmad Nassri <ahmad@ahmadnassri.com> (https://www.ahmadnassri.com/)",
        "homepage": "https://github.com/ahmadnassri/node-har-validator",
        "repository": {
          "type": "git",
          "url": "https://github.com/ahmadnassri/node-har-validator.git"
        },
        "license": "MIT",
        "main": "lib/promise.js",
        "keywords": [
          "har",
          "cli",
          "ajv",
          "http",
          "archive",
          "validate",
          "validator"
        ],
        "engines": {
          "node": ">=6"
        },
        "files": [
          "lib"
        ],
        "bugs": {
          "url": "https://github.com/ahmadnassri/node-har-validator/issues"
        },
        "scripts": {
          "lint:deps": "npx updated",
          "lint:ec": "npx editorconfig-checker .",
          "lint:js": "npx eslint .",
          "lint:md": "npx remark --quiet --frail .",
          "lint": "npx run-p lint:*",
          "open:coverage": "opener coverage/lcov-report/index.html",
          "test": "tap test --coverage-report=lcov --no-browser"
        },
        "devDependencies": {
          "tap": "^12.0.1"
        },
        "dependencies": {
          "ajv": "^6.5.5",
          "har-schema": "^2.0.0"
        }
      })
    },
    "has-ansi": {
      "package.json": JSON.stringify({
        "name": "has-ansi",
        "version": "2.0.0",
        "description": "Check if a string has ANSI escape codes",
        "license": "MIT",
        "repository": "sindresorhus/has-ansi",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "maintainers": [
          "Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)",
          "Joshua Appelman <jappelman@xebia.com> (jbnicolai.com)"
        ],
        "engines": {
          "node": ">=0.10.0"
        },
        "scripts": {
          "test": "node test.js"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "ansi",
          "styles",
          "color",
          "colour",
          "colors",
          "terminal",
          "console",
          "string",
          "tty",
          "escape",
          "shell",
          "xterm",
          "command-line",
          "text",
          "regex",
          "regexp",
          "re",
          "match",
          "test",
          "find",
          "pattern",
          "has"
        ],
        "dependencies": {
          "ansi-regex": "^2.0.0"
        },
        "devDependencies": {
          "ava": "0.0.4"
        }
      })
    },
    "has-flag": {
      "package.json": JSON.stringify({
        "name": "has-flag",
        "version": "3.0.0",
        "description": "Check if argv has a specific flag",
        "license": "MIT",
        "repository": "sindresorhus/has-flag",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "has",
          "check",
          "detect",
          "contains",
          "find",
          "flag",
          "cli",
          "command-line",
          "argv",
          "process",
          "arg",
          "args",
          "argument",
          "arguments",
          "getopt",
          "minimist",
          "optimist"
        ],
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        }
      })
    },
    "hasha": {
      "package.json": JSON.stringify({
        "name": "hasha",
        "version": "3.0.0",
        "description": "Hashing made simple. Get the hash of a buffer/string/stream/file.",
        "license": "MIT",
        "repository": "sindresorhus/hasha",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "hash",
          "hashing",
          "crypto",
          "hex",
          "base64",
          "md5",
          "sha1",
          "sha256",
          "sha512",
          "sum",
          "stream",
          "file",
          "fs",
          "buffer",
          "string",
          "text",
          "rev",
          "revving",
          "simple",
          "easy"
        ],
        "dependencies": {
          "is-stream": "^1.0.1"
        },
        "devDependencies": {
          "ava": "*",
          "proxyquire": "^1.7.2",
          "xo": "*"
        }
      })
    },
    "home-or-tmp": {
      "package.json": JSON.stringify({
        "name": "home-or-tmp",
        "version": "2.0.0",
        "description": "Get the user home directory with fallback to the system temp directory",
        "license": "MIT",
        "repository": "sindresorhus/home-or-tmp",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=0.10.0"
        },
        "scripts": {
          "test": "node test.js"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "user",
          "home",
          "homedir",
          "dir",
          "directory",
          "folder",
          "path",
          "tmp",
          "temp",
          "temporary",
          "fallback",
          "graceful",
          "userprofile"
        ],
        "dependencies": {
          "os-homedir": "^1.0.0",
          "os-tmpdir": "^1.0.1"
        },
        "devDependencies": {
          "ava": "0.0.4"
        }
      })
    },
    "hosted-git-info": {
      "package.json": JSON.stringify({
        "name": "hosted-git-info",
        "version": "2.7.1",
        "description": "Provides metadata and conversions from repository urls for Github, Bitbucket and Gitlab",
        "main": "index.js",
        "repository": {
          "type": "git",
          "url": "git+https://github.com/npm/hosted-git-info.git"
        },
        "keywords": [
          "git",
          "github",
          "bitbucket",
          "gitlab"
        ],
        "author": "Rebecca Turner <me@re-becca.org> (http://re-becca.org)",
        "license": "ISC",
        "bugs": {
          "url": "https://github.com/npm/hosted-git-info/issues"
        },
        "homepage": "https://github.com/npm/hosted-git-info",
        "scripts": {
          "prerelease": "npm t",
          "postrelease": "npm publish && git push --follow-tags",
          "pretest": "standard",
          "release": "standard-version -s",
          "test": "tap -J --nyc-arg=--all --coverage test"
        },
        "devDependencies": {
          "standard": "^11.0.1",
          "standard-version": "^4.3.0",
          "tap": "^12.0.1"
        },
        "files": [
          "index.js",
          "git-host.js",
          "git-host-info.js"
        ]
      })
    },
    "http-signature": {
      "package.json": JSON.stringify({
        "name": "http-signature",
        "description": "Reference implementation of Joyent's HTTP Signature scheme.",
        "version": "1.2.0",
        "license": "MIT",
        "author": "Joyent, Inc",
        "contributors": [
          "Mark Cavage <mcavage@gmail.com>",
          "David I. Lehn <dil@lehn.org>",
          "Patrick Mooney <patrick.f.mooney@gmail.com>"
        ],
        "repository": {
          "type": "git",
          "url": "git://github.com/joyent/node-http-signature.git"
        },
        "homepage": "https://github.com/joyent/node-http-signature/",
        "bugs": "https://github.com/joyent/node-http-signature/issues",
        "keywords": [
          "https",
          "request"
        ],
        "engines": {
          "node": ">=0.8",
          "npm": ">=1.3.7"
        },
        "main": "lib/index.js",
        "scripts": {
          "test": "tap test/*.js"
        },
        "dependencies": {
          "assert-plus": "^1.0.0",
          "jsprim": "^1.2.2",
          "sshpk": "^1.7.0"
        },
        "devDependencies": {
          "tap": "0.4.2",
          "uuid": "^2.0.2"
        }
      })
    },
    "import-jsx": {
      "package.json": JSON.stringify({
        "name": "import-jsx",
        "version": "2.0.0",
        "description": "Require and transpile JSX on the fly",
        "license": "MIT",
        "repository": "vadimdemedes/import-jsx",
        "author": {
          "name": "Vadim Demedes",
          "email": "vdemedes@gmail.com",
          "url": "github.com/vadimdemedes"
        },
        "engines": {
          "node": ">= 4"
        },
        "scripts": {
          "test": "xo && nyc --check-coverage --branches=100 --lines=100 --functions=100 --statements=100 ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "react",
          "jsx",
          "require",
          "require-jsx",
          "import"
        ],
        "dependencies": {
          "babel-core": "^6.25.0",
          "babel-plugin-transform-es2015-destructuring": "^6.23.0",
          "babel-plugin-transform-object-rest-spread": "^6.23.0",
          "babel-plugin-transform-react-jsx": "^6.24.1",
          "caller-path": "^2.0.0",
          "resolve-from": "^3.0.0"
        },
        "devDependencies": {
          "ava": "^0.19.1",
          "nyc": "^13.3.0",
          "sinon": "^2.3.5",
          "xo": "^0.18.2"
        }
      })
    },
    "imurmurhash": {
      "package.json": JSON.stringify({
        "name": "imurmurhash",
        "version": "0.1.4",
        "description": "An incremental implementation of MurmurHash3",
        "homepage": "https://github.com/jensyt/imurmurhash-js",
        "main": "imurmurhash.js",
        "files": [
          "imurmurhash.js",
          "imurmurhash.min.js",
          "package.json",
          "README.md"
        ],
        "repository": {
          "type": "git",
          "url": "https://github.com/jensyt/imurmurhash-js"
        },
        "bugs": {
          "url": "https://github.com/jensyt/imurmurhash-js/issues"
        },
        "keywords": [
          "murmur",
          "murmurhash",
          "murmurhash3",
          "hash",
          "incremental"
        ],
        "author": {
          "name": "Jens Taylor",
          "email": "jensyt@gmail.com",
          "url": "https://github.com/homebrewing"
        },
        "license": "MIT",
        "dependencies": {},
        "devDependencies": {},
        "engines": {
          "node": ">=0.8.19"
        }
      })
    },
    "inflight": {
      "package.json": JSON.stringify({
        "name": "inflight",
        "version": "1.0.6",
        "description": "Add callbacks to requests in flight to avoid async duplication",
        "main": "inflight.js",
        "files": [
          "inflight.js"
        ],
        "dependencies": {
          "once": "^1.3.0",
          "wrappy": "1"
        },
        "devDependencies": {
          "tap": "^7.1.2"
        },
        "scripts": {
          "test": "tap test.js --100"
        },
        "repository": {
          "type": "git",
          "url": "https://github.com/npm/inflight.git"
        },
        "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me/)",
        "bugs": {
          "url": "https://github.com/isaacs/inflight/issues"
        },
        "homepage": "https://github.com/isaacs/inflight",
        "license": "ISC"
      })
    },
    "inherits": {
      "package.json": JSON.stringify({
        "name": "inherits",
        "description": "Browser-friendly inheritance fully compatible with standard node.js inherits()",
        "version": "2.0.4",
        "keywords": [
          "inheritance",
          "class",
          "klass",
          "oop",
          "object-oriented",
          "inherits",
          "browser",
          "browserify"
        ],
        "main": "./inherits.js",
        "browser": "./inherits_browser.js",
        "repository": "git://github.com/isaacs/inherits",
        "license": "ISC",
        "scripts": {
          "test": "tap"
        },
        "devDependencies": {
          "tap": "^14.2.4"
        },
        "files": [
          "inherits.js",
          "inherits_browser.js"
        ]
      })
    },
    "ink": {
      "package.json": JSON.stringify({
        "name": "ink",
        "version": "2.3.0",
        "description": "React for CLI",
        "license": "MIT",
        "repository": "vadimdemedes/ink",
        "author": {
          "name": "vdemedes",
          "email": "vdemedes@gmail.com",
          "url": "github.com/vadimdemedes"
        },
        "main": "build",
        "engines": {
          "node": ">=8"
        },
        "scripts": {
          "build": "babel src --out-dir=build",
          "prepare": "npm run build",
          "test": "xo && FORCE_COLOR=true ava",
          "pretest": "npm run build",
          "cast": "svg-term --command='node media/demo.js' --out=media/demo.svg --from=100 --window --width=50 --height=8 --term=iterm2 --profile=Snazzy"
        },
        "types": "index.d.ts",
        "files": [
          "build",
          "index.d.ts"
        ],
        "keywords": [
          "react",
          "cli",
          "jsx",
          "stdout",
          "components",
          "command-line",
          "preact",
          "redux",
          "print",
          "render",
          "colors",
          "text"
        ],
        "dependencies": {
          "@types/react": "^16.8.6",
          "arrify": "^1.0.1",
          "auto-bind": "^2.0.0",
          "chalk": "^2.4.1",
          "cli-cursor": "^2.1.0",
          "cli-truncate": "^1.1.0",
          "is-ci": "^2.0.0",
          "lodash.throttle": "^4.1.1",
          "log-update": "^3.0.0",
          "prop-types": "^15.6.2",
          "react-reconciler": "^0.20.0",
          "scheduler": "^0.13.2",
          "signal-exit": "^3.0.2",
          "slice-ansi": "^1.0.0",
          "string-length": "^2.0.0",
          "widest-line": "^2.0.0",
          "wrap-ansi": "^5.0.0",
          "yoga-layout-prebuilt": "^1.9.3"
        },
        "devDependencies": {
          "@babel/cli": "^7.1.2",
          "@babel/core": "^7.1.2",
          "@babel/plugin-proposal-class-properties": "^7.1.0",
          "@babel/plugin-proposal-object-rest-spread": "^7.0.0",
          "@babel/preset-react": "^7.0.0",
          "ava": "^1.3.1",
          "babel-eslint": "^10.0.1",
          "delay": "^4.1.0",
          "eslint-config-xo-react": "^0.19.0",
          "eslint-plugin-react": "^7.11.1",
          "eslint-plugin-react-hooks": "^1.4.0",
          "import-jsx": "^1.3.0",
          "ms": "^2.1.1",
          "node-pty": "^0.8.1",
          "p-queue": "^3.0.0",
          "react": "^16.6.1",
          "sinon": "^7.2.7",
          "strip-ansi": "^5.2.0",
          "svg-term-cli": "^2.1.1",
          "xo": "^0.24.0"
        },
        "peerDependencies": {
          "react": ">=16.8.0"
        },
        "babel": {
          "plugins": [
            "@babel/plugin-proposal-class-properties",
            "@babel/plugin-proposal-object-rest-spread",
            "@babel/plugin-transform-modules-commonjs"
          ],
          "presets": [
            "@babel/preset-react"
          ]
        },
        "ava": {
          "babel": {
            "testOptions": {
              "plugins": [
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-proposal-object-rest-spread",
                "@babel/plugin-transform-modules-commonjs"
              ],
              "presets": [
                "@babel/preset-react"
              ]
            }
          }
        },
        "xo": {
          "parser": "babel-eslint",
          "extends": [
            "xo-react"
          ],
          "plugins": [
            "react"
          ],
          "overrides": [
            {
              "files": "src/components/*.js",
              "rules": {
                "unicorn/filename-case": "off",
                "react/require-default-props": "warning"
              }
            }
          ]
        }
      })
    },
    "invariant": {
      "package.json": JSON.stringify({
        "name": "invariant",
        "version": "2.2.4",
        "description": "invariant",
        "keywords": [
          "test",
          "invariant"
        ],
        "license": "MIT",
        "author": "Andres Suarez <zertosh@gmail.com>",
        "files": [
          "browser.js",
          "invariant.js",
          "invariant.js.flow"
        ],
        "repository": "https://github.com/zertosh/invariant",
        "scripts": {
          "test": "NODE_ENV=production tap test/*.js && NODE_ENV=development tap test/*.js"
        },
        "dependencies": {
          "loose-envify": "^1.0.0"
        },
        "devDependencies": {
          "browserify": "^11.0.1",
          "flow-bin": "^0.67.1",
          "tap": "^1.4.0"
        },
        "main": "invariant.js",
        "browser": "browser.js",
        "browserify": {
          "transform": [
            "loose-envify"
          ]
        }
      })
    },
    "invert-kv": {
      "package.json": JSON.stringify({
        "name": "invert-kv",
        "version": "2.0.0",
        "description": "Invert the key/value of an object. Example: `{foo: 'bar'}` → `{bar: 'foo'}`",
        "license": "MIT",
        "repository": "sindresorhus/invert-kv",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "object",
          "key",
          "value",
          "kv",
          "invert"
        ],
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        }
      })
    },
    "is-arrayish": {
      "package.json": JSON.stringify({
        "name": "is-arrayish",
        "description": "Determines if an object can be used as an array",
        "version": "0.2.1",
        "author": "Qix (http://github.com/qix-)",
        "keywords": [
          "is",
          "array",
          "duck",
          "type",
          "arrayish",
          "similar",
          "proto",
          "prototype",
          "type"
        ],
        "license": "MIT",
        "scripts": {
          "pretest": "xo",
          "test": "mocha --compilers coffee:coffee-script/register"
        },
        "repository": {
          "type": "git",
          "url": "https://github.com/qix-/node-is-arrayish.git"
        },
        "devDependencies": {
          "coffee-script": "^1.9.3",
          "coveralls": "^2.11.2",
          "istanbul": "^0.3.17",
          "mocha": "^2.2.5",
          "should": "^7.0.1",
          "xo": "^0.6.1"
        }
      })
    },
    "is-binary-path": {
      "package.json": JSON.stringify({
        "name": "is-binary-path",
        "version": "2.1.0",
        "description": "Check if a file path is a binary file",
        "license": "MIT",
        "repository": "sindresorhus/is-binary-path",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=8"
        },
        "scripts": {
          "test": "xo && ava && tsd"
        },
        "files": [
          "index.js",
          "index.d.ts"
        ],
        "keywords": [
          "binary",
          "extensions",
          "extension",
          "file",
          "path",
          "check",
          "detect",
          "is"
        ],
        "dependencies": {
          "binary-extensions": "^2.0.0"
        },
        "devDependencies": {
          "ava": "^1.4.1",
          "tsd": "^0.7.2",
          "xo": "^0.24.0"
        }
      })
    },
    "is-ci": {
      "package.json": JSON.stringify({
        "name": "is-ci",
        "version": "2.0.0",
        "description": "Detect if the current environment is a CI server",
        "bin": "bin.js",
        "main": "index.js",
        "dependencies": {
          "ci-info": "^2.0.0"
        },
        "devDependencies": {
          "clear-module": "^3.0.0",
          "standard": "^12.0.1"
        },
        "scripts": {
          "test": "standard && node test.js"
        },
        "repository": {
          "type": "git",
          "url": "https://github.com/watson/is-ci.git"
        },
        "keywords": [
          "ci",
          "continuous",
          "integration",
          "test",
          "detect"
        ],
        "author": "Thomas Watson Steen <w@tson.dk> (https://twitter.com/wa7son)",
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/watson/is-ci/issues"
        },
        "homepage": "https://github.com/watson/is-ci",
        "coordinates": [
          55.778272,
          12.593116
        ]
      })
    },
    "is-extglob": {
      "package.json": JSON.stringify({
        "name": "is-extglob",
        "description": "Returns true if a string has an extglob.",
        "version": "2.1.1",
        "homepage": "https://github.com/jonschlinkert/is-extglob",
        "author": "Jon Schlinkert (https://github.com/jonschlinkert)",
        "repository": "jonschlinkert/is-extglob",
        "bugs": {
          "url": "https://github.com/jonschlinkert/is-extglob/issues"
        },
        "license": "MIT",
        "files": [
          "index.js"
        ],
        "main": "index.js",
        "engines": {
          "node": ">=0.10.0"
        },
        "scripts": {
          "test": "mocha"
        },
        "devDependencies": {
          "gulp-format-md": "^0.1.10",
          "mocha": "^3.0.2"
        },
        "keywords": [
          "bash",
          "braces",
          "check",
          "exec",
          "expression",
          "extglob",
          "glob",
          "globbing",
          "globstar",
          "is",
          "match",
          "matches",
          "pattern",
          "regex",
          "regular",
          "string",
          "test"
        ],
        "verb": {
          "toc": false,
          "layout": "default",
          "tasks": [
            "readme"
          ],
          "plugins": [
            "gulp-format-md"
          ],
          "related": {
            "list": [
              "has-glob",
              "is-glob",
              "micromatch"
            ]
          },
          "reflinks": [
            "verb",
            "verb-generate-readme"
          ],
          "lint": {
            "reflinks": true
          }
        }
      })
    },
    "is-finite": {
      "package.json": JSON.stringify({
        "name": "is-finite",
        "version": "1.0.2",
        "description": "ES2015 Number.isFinite() ponyfill",
        "license": "MIT",
        "repository": "sindresorhus/is-finite",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=0.10.0"
        },
        "scripts": {
          "test": "ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "es2015",
          "ponyfill",
          "polyfill",
          "shim",
          "number",
          "finite",
          "is"
        ],
        "dependencies": {
          "number-is-nan": "^1.0.0"
        },
        "devDependencies": {
          "ava": "*"
        }
      })
    },
    "is-fullwidth-code-point": {
      "package.json": JSON.stringify({
        "name": "is-fullwidth-code-point",
        "version": "2.0.0",
        "description": "Check if the character represented by a given Unicode code point is fullwidth",
        "license": "MIT",
        "repository": "sindresorhus/is-fullwidth-code-point",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "fullwidth",
          "full-width",
          "full",
          "width",
          "unicode",
          "character",
          "char",
          "string",
          "str",
          "codepoint",
          "code",
          "point",
          "is",
          "detect",
          "check"
        ],
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        },
        "xo": {
          "esnext": true
        }
      })
    },
    "is-glob": {
      "package.json": JSON.stringify({
        "name": "is-glob",
        "description": "Returns `true` if the given string looks like a glob pattern or an extglob pattern. This makes it easy to create code that only uses external modules like node-glob when necessary, resulting in much faster code execution and initialization time, and a better user experience.",
        "version": "4.0.1",
        "homepage": "https://github.com/micromatch/is-glob",
        "author": "Jon Schlinkert (https://github.com/jonschlinkert)",
        "contributors": [
          "Brian Woodward (https://twitter.com/doowb)",
          "Daniel Perez (https://tuvistavie.com)",
          "Jon Schlinkert (http://twitter.com/jonschlinkert)"
        ],
        "repository": "micromatch/is-glob",
        "bugs": {
          "url": "https://github.com/micromatch/is-glob/issues"
        },
        "license": "MIT",
        "files": [
          "index.js"
        ],
        "main": "index.js",
        "engines": {
          "node": ">=0.10.0"
        },
        "scripts": {
          "test": "mocha"
        },
        "dependencies": {
          "is-extglob": "^2.1.1"
        },
        "devDependencies": {
          "gulp-format-md": "^0.1.10",
          "mocha": "^3.0.2"
        },
        "keywords": [
          "bash",
          "braces",
          "check",
          "exec",
          "expression",
          "extglob",
          "glob",
          "globbing",
          "globstar",
          "is",
          "match",
          "matches",
          "pattern",
          "regex",
          "regular",
          "string",
          "test"
        ],
        "verb": {
          "layout": "default",
          "plugins": [
            "gulp-format-md"
          ],
          "related": {
            "list": [
              "assemble",
              "base",
              "update",
              "verb"
            ]
          },
          "reflinks": [
            "assemble",
            "bach",
            "base",
            "composer",
            "gulp",
            "has-glob",
            "is-valid-glob",
            "micromatch",
            "npm",
            "scaffold",
            "verb",
            "vinyl"
          ]
        }
      })
    },
    "is-number": {
      "package.json": JSON.stringify({
        "name": "is-number",
        "description": "Returns true if a number or string value is a finite number. Useful for regex matches, parsing, user input, etc.",
        "version": "7.0.0",
        "homepage": "https://github.com/jonschlinkert/is-number",
        "author": "Jon Schlinkert (https://github.com/jonschlinkert)",
        "contributors": [
          "Jon Schlinkert (http://twitter.com/jonschlinkert)",
          "Olsten Larck (https://i.am.charlike.online)",
          "Rouven Weßling (www.rouvenwessling.de)"
        ],
        "repository": "jonschlinkert/is-number",
        "bugs": {
          "url": "https://github.com/jonschlinkert/is-number/issues"
        },
        "license": "MIT",
        "files": [
          "index.js"
        ],
        "main": "index.js",
        "engines": {
          "node": ">=0.12.0"
        },
        "scripts": {
          "test": "mocha"
        },
        "devDependencies": {
          "ansi": "^0.3.1",
          "benchmark": "^2.1.4",
          "gulp-format-md": "^1.0.0",
          "mocha": "^3.5.3"
        },
        "keywords": [
          "cast",
          "check",
          "coerce",
          "coercion",
          "finite",
          "integer",
          "is",
          "isnan",
          "is-nan",
          "is-num",
          "is-number",
          "isnumber",
          "isfinite",
          "istype",
          "kind",
          "math",
          "nan",
          "num",
          "number",
          "numeric",
          "parseFloat",
          "parseInt",
          "test",
          "type",
          "typeof",
          "value"
        ],
        "verb": {
          "toc": false,
          "layout": "default",
          "tasks": [
            "readme"
          ],
          "related": {
            "list": [
              "is-plain-object",
              "is-primitive",
              "isobject",
              "kind-of"
            ]
          },
          "plugins": [
            "gulp-format-md"
          ],
          "lint": {
            "reflinks": true
          }
        }
      })
    },
    "is-stream": {
      "package.json": JSON.stringify({
        "name": "is-stream",
        "version": "1.1.0",
        "description": "Check if something is a Node.js stream",
        "license": "MIT",
        "repository": "sindresorhus/is-stream",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=0.10.0"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "stream",
          "type",
          "streams",
          "writable",
          "readable",
          "duplex",
          "transform",
          "check",
          "detect",
          "is"
        ],
        "devDependencies": {
          "ava": "*",
          "tempfile": "^1.1.0",
          "xo": "*"
        }
      })
    },
    "is-typedarray": {
      "package.json": JSON.stringify({
        "name": "is-typedarray",
        "version": "1.0.0",
        "description": "Detect whether or not an object is a Typed Array",
        "main": "index.js",
        "scripts": {
          "test": "node test"
        },
        "author": "Hugh Kennedy <hughskennedy@gmail.com> (http://hughsk.io/)",
        "license": "MIT",
        "dependencies": {},
        "devDependencies": {
          "tape": "^2.13.1"
        },
        "repository": {
          "type": "git",
          "url": "git://github.com/hughsk/is-typedarray.git"
        },
        "keywords": [
          "typed",
          "array",
          "detect",
          "is",
          "util"
        ],
        "bugs": {
          "url": "https://github.com/hughsk/is-typedarray/issues"
        },
        "homepage": "https://github.com/hughsk/is-typedarray"
      })
    },
    "isarray": {
      "package.json": JSON.stringify({
        "name": "isarray",
        "description": "Array#isArray for older browsers",
        "version": "1.0.0",
        "repository": {
          "type": "git",
          "url": "git://github.com/juliangruber/isarray.git"
        },
        "homepage": "https://github.com/juliangruber/isarray",
        "main": "index.js",
        "dependencies": {},
        "devDependencies": {
          "tape": "~2.13.4"
        },
        "keywords": [
          "browser",
          "isarray",
          "array"
        ],
        "author": {
          "name": "Julian Gruber",
          "email": "mail@juliangruber.com",
          "url": "http://juliangruber.com"
        },
        "license": "MIT",
        "testling": {
          "files": "test.js",
          "browsers": [
            "ie/8..latest",
            "firefox/17..latest",
            "firefox/nightly",
            "chrome/22..latest",
            "chrome/canary",
            "opera/12..latest",
            "opera/next",
            "safari/5.1..latest",
            "ipad/6.0..latest",
            "iphone/6.0..latest",
            "android-browser/4.2..latest"
          ]
        },
        "scripts": {
          "test": "tape test.js"
        }
      })
    },
    "isexe": {
      "package.json": JSON.stringify({
        "name": "isexe",
        "version": "2.0.0",
        "description": "Minimal module to check if a file is executable.",
        "main": "index.js",
        "directories": {
          "test": "test"
        },
        "devDependencies": {
          "mkdirp": "^0.5.1",
          "rimraf": "^2.5.0",
          "tap": "^10.3.0"
        },
        "scripts": {
          "test": "tap test/*.js --100",
          "preversion": "npm test",
          "postversion": "npm publish",
          "postpublish": "git push origin --all; git push origin --tags"
        },
        "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me/)",
        "license": "ISC",
        "repository": {
          "type": "git",
          "url": "git+https://github.com/isaacs/isexe.git"
        },
        "keywords": [],
        "bugs": {
          "url": "https://github.com/isaacs/isexe/issues"
        },
        "homepage": "https://github.com/isaacs/isexe#readme"
      })
    },
    "isstream": {
      "package.json": JSON.stringify({
        "name": "isstream",
        "version": "0.1.2",
        "description": "Determine if an object is a Stream",
        "main": "isstream.js",
        "scripts": {
          "test": "tar --xform 's/^package/readable-stream-1.0/' -zxf readable-stream-1.0.*.tgz && tar --xform 's/^package/readable-stream-1.1/' -zxf readable-stream-1.1.*.tgz && node test.js; rm -rf readable-stream-1.?/"
        },
        "repository": {
          "type": "git",
          "url": "https://github.com/rvagg/isstream.git"
        },
        "keywords": [
          "stream",
          "type",
          "streams",
          "readable-stream",
          "hippo"
        ],
        "devDependencies": {
          "tape": "~2.12.3",
          "core-util-is": "~1.0.0",
          "isarray": "0.0.1",
          "string_decoder": "~0.10.x",
          "inherits": "~2.0.1"
        },
        "author": "Rod Vagg <rod@vagg.org>",
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/rvagg/isstream/issues"
        },
        "homepage": "https://github.com/rvagg/isstream"
      })
    },
    "istanbul-lib-coverage": {
      "package.json": JSON.stringify({
        "name": "istanbul-lib-coverage",
        "version": "2.0.5",
        "description": "Data library for istanbul coverage objects",
        "author": "Krishnan Anantheswaran <kananthmail-github@yahoo.com>",
        "main": "index.js",
        "files": [
          "lib",
          "index.js"
        ],
        "scripts": {
          "test": "mocha"
        },
        "karmaDeps": {
          "browserify-istanbul": "^0.2.1",
          "karma": "^0.13.10",
          "karma-browserify": "^4.2.1",
          "karma-chrome-launcher": "^0.2.0",
          "karma-coverage": "^0.4.2",
          "karma-mocha": "^0.2.0",
          "karma-phantomjs-launcher": "^0.2.0",
          "phantomjs": "^1.9.17"
        },
        "repository": {
          "type": "git",
          "url": "git@github.com:istanbuljs/istanbuljs.git"
        },
        "keywords": [
          "istanbul",
          "coverage",
          "data"
        ],
        "license": "BSD-3-Clause",
        "bugs": {
          "url": "https://github.com/istanbuljs/istanbuljs/issues"
        },
        "homepage": "https://istanbul.js.org/",
        "engines": {
          "node": ">=6"
        },
        "gitHead": "90e60cc47833bb780680f916488ca24f0be36ca2"
      })
    },
    "istanbul-lib-hook": {
      "package.json": JSON.stringify({
        "name": "istanbul-lib-hook",
        "version": "2.0.7",
        "description": "Hooks for require, vm and script used in istanbul",
        "author": "Krishnan Anantheswaran <kananthmail-github@yahoo.com>",
        "main": "index.js",
        "files": [
          "lib",
          "index.js"
        ],
        "scripts": {
          "test": "mocha"
        },
        "dependencies": {
          "append-transform": "^1.0.0"
        },
        "repository": {
          "type": "git",
          "url": "git+ssh://git@github.com/istanbuljs/istanbuljs.git"
        },
        "keywords": [
          "istanbul",
          "hook"
        ],
        "license": "BSD-3-Clause",
        "bugs": {
          "url": "https://github.com/istanbuljs/istanbuljs/issues"
        },
        "homepage": "https://istanbul.js.org/",
        "engines": {
          "node": ">=6"
        },
        "gitHead": "90e60cc47833bb780680f916488ca24f0be36ca2"
      })
    },
    "istanbul-lib-instrument": {
      "node_modules": {
        "semver": {
          "package.json": JSON.stringify({
            "name": "semver",
            "version": "6.2.0",
            "description": "The semantic version parser used by npm.",
            "main": "semver.js",
            "scripts": {
              "test": "tap",
              "preversion": "npm test",
              "postversion": "npm publish",
              "postpublish": "git push origin --follow-tags"
            },
            "devDependencies": {
              "tap": "^14.3.1"
            },
            "license": "ISC",
            "repository": "https://github.com/npm/node-semver",
            "bin": {
              "semver": "./bin/semver.js"
            },
            "files": [
              "bin",
              "range.bnf",
              "semver.js"
            ],
            "tap": {
              "check-coverage": true
            }
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "istanbul-lib-instrument",
        "version": "3.3.0",
        "description": "Core istanbul API for JS code coverage",
        "author": "Krishnan Anantheswaran <kananthmail-github@yahoo.com>",
        "main": "dist/index.js",
        "files": [
          "dist"
        ],
        "scripts": {
          "release": "babel src --out-dir dist && documentation build -f md -o api.md src",
          "test": "mocha --require=@babel/register",
          "prepublish": "npm run release"
        },
        "dependencies": {
          "@babel/generator": "^7.4.0",
          "@babel/parser": "^7.4.3",
          "@babel/template": "^7.4.0",
          "@babel/traverse": "^7.4.3",
          "@babel/types": "^7.4.0",
          "istanbul-lib-coverage": "^2.0.5",
          "semver": "^6.0.0"
        },
        "license": "BSD-3-Clause",
        "bugs": {
          "url": "https://github.com/istanbuljs/istanbuljs/issues"
        },
        "homepage": "https://istanbul.js.org/",
        "repository": {
          "type": "git",
          "url": "git@github.com:istanbuljs/istanbuljs.git"
        },
        "keywords": [
          "coverage",
          "istanbul",
          "js",
          "instrumentation"
        ],
        "engines": {
          "node": ">=6"
        },
        "gitHead": "90e60cc47833bb780680f916488ca24f0be36ca2"
      })
    },
    "istanbul-lib-processinfo": {
      "node_modules": {
        "rimraf": {
          "package.json": JSON.stringify({
            "name": "rimraf",
            "version": "2.6.3",
            "main": "rimraf.js",
            "description": "A deep deletion module for node (like `rm -rf`)",
            "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me/)",
            "license": "ISC",
            "repository": "git://github.com/isaacs/rimraf.git",
            "scripts": {
              "preversion": "npm test",
              "postversion": "npm publish",
              "postpublish": "git push origin --all; git push origin --tags",
              "test": "tap test/*.js"
            },
            "bin": "./bin.js",
            "dependencies": {
              "glob": "^7.1.3"
            },
            "files": [
              "LICENSE",
              "README.md",
              "bin.js",
              "rimraf.js"
            ],
            "devDependencies": {
              "mkdirp": "^0.5.1",
              "tap": "^12.1.1"
            }
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "istanbul-lib-processinfo",
        "version": "1.0.0",
        "description": "A utility for managing the `processinfo` folder that NYC uses.",
        "main": "index.js",
        "scripts": {
          "test": "tap -j1",
          "snap": "tap -j1",
          "preversion": "npm test",
          "postversion": "npm publish",
          "postpublish": "git push origin --all; git push origin --tags"
        },
        "repository": {
          "type": "git",
          "url": "git+https://github.com/istanbuljs/istanbul-lib-processinfo.git"
        },
        "license": "ISC",
        "dependencies": {
          "archy": "^1.0.0",
          "cross-spawn": "^6.0.5",
          "istanbul-lib-coverage": "^2.0.3",
          "rimraf": "^2.6.3",
          "uuid": "^3.3.2"
        },
        "devDependencies": {
          "nyc": "^14.0.0-rc.1",
          "tap": "^13.0.0-rc.23"
        },
        "tap": {
          "check-coverage": true
        },
        "files": [
          "index.js"
        ],
        "nyc": {
          "include": "index.js"
        }
      })
    },
    "istanbul-lib-report": {
      "node_modules": {
        "supports-color": {
          "package.json": JSON.stringify({
            "name": "supports-color",
            "version": "6.1.0",
            "description": "Detect whether a terminal supports color",
            "license": "MIT",
            "repository": "chalk/supports-color",
            "author": {
              "name": "Sindre Sorhus",
              "email": "sindresorhus@gmail.com",
              "url": "sindresorhus.com"
            },
            "engines": {
              "node": ">=6"
            },
            "scripts": {
              "test": "xo && ava"
            },
            "files": [
              "index.js",
              "browser.js"
            ],
            "keywords": [
              "color",
              "colour",
              "colors",
              "terminal",
              "console",
              "cli",
              "ansi",
              "styles",
              "tty",
              "rgb",
              "256",
              "shell",
              "xterm",
              "command-line",
              "support",
              "supports",
              "capability",
              "detect",
              "truecolor",
              "16m"
            ],
            "dependencies": {
              "has-flag": "^3.0.0"
            },
            "devDependencies": {
              "ava": "^0.25.0",
              "import-fresh": "^2.0.0",
              "xo": "^0.23.0"
            },
            "browser": "browser.js"
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "istanbul-lib-report",
        "version": "2.0.8",
        "description": "Base reporting library for istanbul",
        "author": "Krishnan Anantheswaran <kananthmail-github@yahoo.com>",
        "main": "index.js",
        "files": [
          "lib",
          "index.js"
        ],
        "scripts": {
          "test": "mocha"
        },
        "dependencies": {
          "istanbul-lib-coverage": "^2.0.5",
          "make-dir": "^2.1.0",
          "supports-color": "^6.1.0"
        },
        "license": "BSD-3-Clause",
        "bugs": {
          "url": "https://github.com/istanbuljs/istanbuljs/issues"
        },
        "homepage": "https://istanbul.js.org/",
        "repository": {
          "type": "git",
          "url": "git@github.com:istanbuljs/istanbuljs.git"
        },
        "keywords": [
          "istanbul",
          "report",
          "api",
          "lib"
        ],
        "engines": {
          "node": ">=6"
        },
        "gitHead": "90e60cc47833bb780680f916488ca24f0be36ca2"
      })
    },
    "istanbul-lib-source-maps": {
      "node_modules": {
        "debug": {
          "package.json": JSON.stringify({
            "name": "debug",
            "version": "4.1.1",
            "repository": {
              "type": "git",
              "url": "git://github.com/visionmedia/debug.git"
            },
            "description": "small debugging utility",
            "keywords": [
              "debug",
              "log",
              "debugger"
            ],
            "files": [
              "src",
              "dist/debug.js",
              "LICENSE",
              "README.md"
            ],
            "author": "TJ Holowaychuk <tj@vision-media.ca>",
            "contributors": [
              "Nathan Rajlich <nathan@tootallnate.net> (http://n8.io)",
              "Andrew Rhyne <rhyneandrew@gmail.com>"
            ],
            "license": "MIT",
            "scripts": {
              "lint": "xo",
              "test": "npm run test:node && npm run test:browser",
              "test:node": "istanbul cover _mocha -- test.js",
              "pretest:browser": "npm run build",
              "test:browser": "karma start --single-run",
              "prebuild:debug": "mkdir -p dist && browserify --standalone debug -o dist/debug.es6.js .",
              "build:debug": "babel -o dist/debug.js dist/debug.es6.js > dist/debug.js",
              "build:test": "babel -d dist test.js",
              "build": "npm run build:debug && npm run build:test",
              "clean": "rimraf dist coverage",
              "test:coverage": "cat ./coverage/lcov.info | coveralls"
            },
            "dependencies": {
              "ms": "^2.1.1"
            },
            "devDependencies": {
              "@babel/cli": "^7.0.0",
              "@babel/core": "^7.0.0",
              "@babel/preset-env": "^7.0.0",
              "browserify": "14.4.0",
              "chai": "^3.5.0",
              "concurrently": "^3.1.0",
              "coveralls": "^3.0.2",
              "istanbul": "^0.4.5",
              "karma": "^3.0.0",
              "karma-chai": "^0.1.0",
              "karma-mocha": "^1.3.0",
              "karma-phantomjs-launcher": "^1.0.2",
              "mocha": "^5.2.0",
              "mocha-lcov-reporter": "^1.2.0",
              "rimraf": "^2.5.4",
              "xo": "^0.23.0"
            },
            "main": "./src/index.js",
            "browser": "./src/browser.js",
            "unpkg": "./dist/debug.js"
          })
        },
        "rimraf": {
          "package.json": JSON.stringify({
            "name": "rimraf",
            "version": "2.6.3",
            "main": "rimraf.js",
            "description": "A deep deletion module for node (like `rm -rf`)",
            "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me/)",
            "license": "ISC",
            "repository": "git://github.com/isaacs/rimraf.git",
            "scripts": {
              "preversion": "npm test",
              "postversion": "npm publish",
              "postpublish": "git push origin --all; git push origin --tags",
              "test": "tap test/*.js"
            },
            "bin": "./bin.js",
            "dependencies": {
              "glob": "^7.1.3"
            },
            "files": [
              "LICENSE",
              "README.md",
              "bin.js",
              "rimraf.js"
            ],
            "devDependencies": {
              "mkdirp": "^0.5.1",
              "tap": "^12.1.1"
            }
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "istanbul-lib-source-maps",
        "version": "3.0.6",
        "description": "Source maps support for istanbul",
        "author": "Krishnan Anantheswaran <kananthmail-github@yahoo.com>",
        "main": "index.js",
        "files": [
          "lib",
          "index.js"
        ],
        "scripts": {
          "test": "mocha"
        },
        "dependencies": {
          "debug": "^4.1.1",
          "istanbul-lib-coverage": "^2.0.5",
          "make-dir": "^2.1.0",
          "rimraf": "^2.6.3",
          "source-map": "^0.6.1"
        },
        "devDependencies": {
          "ts-node": "^8.1.0"
        },
        "license": "BSD-3-Clause",
        "bugs": {
          "url": "https://github.com/istanbuljs/istanbuljs/issues"
        },
        "homepage": "https://istanbul.js.org/",
        "repository": {
          "type": "git",
          "url": "git+ssh://git@github.com/istanbuljs/istanbuljs.git"
        },
        "keywords": [
          "istanbul",
          "sourcemaps",
          "sourcemap",
          "source",
          "maps"
        ],
        "engines": {
          "node": ">=6"
        },
        "gitHead": "90e60cc47833bb780680f916488ca24f0be36ca2"
      })
    },
    "istanbul-reports": {
      "package.json": JSON.stringify({
        "name": "istanbul-reports",
        "version": "2.2.6",
        "description": "istanbul reports",
        "author": "Krishnan Anantheswaran <kananthmail-github@yahoo.com>",
        "main": "index.js",
        "files": [
          "index.js",
          "lib"
        ],
        "scripts": {
          "test": "mocha --recursive"
        },
        "dependencies": {
          "handlebars": "^4.1.2"
        },
        "devDependencies": {
          "istanbul-lib-coverage": "^2.0.5",
          "istanbul-lib-report": "^2.0.8"
        },
        "license": "BSD-3-Clause",
        "repository": {
          "type": "git",
          "url": "git@github.com:istanbuljs/istanbuljs"
        },
        "keywords": [
          "istanbul",
          "reports"
        ],
        "bugs": {
          "url": "https://github.com/istanbuljs/istanbuljs/issues"
        },
        "homepage": "https://istanbul.js.org/",
        "engines": {
          "node": ">=6"
        },
        "gitHead": "90e60cc47833bb780680f916488ca24f0be36ca2"
      })
    },
    "jackspeak": {
      "package.json": JSON.stringify({
        "name": "jackspeak",
        "version": "1.4.0",
        "description": "A very strict and proper argument parser.",
        "main": "index.js",
        "scripts": {
          "build-examples": "for i in examples/*.js ; do node $i -h > ${i/.js/.txt}; done",
          "snap": "TAP_SNAPSHOT=1 tap test/*.js -J && npm run build-examples",
          "test": "tap test/*.js --100 -J",
          "preversion": "npm test",
          "postversion": "npm publish",
          "postpublish": "git push origin --all; git push origin --tags"
        },
        "license": "ISC",
        "devDependencies": {
          "tap": "^14.0.0"
        },
        "files": [
          "index.js"
        ],
        "dependencies": {
          "cliui": "^4.1.0"
        },
        "repository": {
          "type": "git",
          "url": "git+https://github.com/isaacs/jackspeak.git"
        },
        "keywords": [
          "argument",
          "parser",
          "args",
          "option",
          "flag",
          "cli",
          "command",
          "line",
          "parse",
          "parsing"
        ],
        "author": "Isaac Z. Schlueter <i@izs.me>",
        "engines": {
          "node": ">=8"
        }
      })
    },
    "js-tokens": {
      "package.json": JSON.stringify({
        "name": "js-tokens",
        "version": "4.0.0",
        "author": "Simon Lydell",
        "license": "MIT",
        "description": "A regex that tokenizes JavaScript.",
        "keywords": [
          "JavaScript",
          "js",
          "token",
          "tokenize",
          "regex"
        ],
        "files": [
          "index.js"
        ],
        "repository": "lydell/js-tokens",
        "scripts": {
          "test": "mocha --ui tdd",
          "esprima-compare": "node esprima-compare ./index.js everything.js/es5.js",
          "build": "node generate-index.js",
          "dev": "npm run build && npm test"
        },
        "devDependencies": {
          "coffeescript": "2.1.1",
          "esprima": "4.0.0",
          "everything.js": "1.0.3",
          "mocha": "5.0.0"
        }
      })
    },
    "js-yaml": {
      "package.json": JSON.stringify({
        "name": "js-yaml",
        "version": "3.13.1",
        "description": "YAML 1.2 parser and serializer",
        "keywords": [
          "yaml",
          "parser",
          "serializer",
          "pyyaml"
        ],
        "homepage": "https://github.com/nodeca/js-yaml",
        "author": "Vladimir Zapparov <dervus.grim@gmail.com>",
        "contributors": [
          "Aleksey V Zapparov <ixti@member.fsf.org> (http://www.ixti.net/)",
          "Vitaly Puzrin <vitaly@rcdesign.ru> (https://github.com/puzrin)",
          "Martin Grenfell <martin.grenfell@gmail.com> (http://got-ravings.blogspot.com)"
        ],
        "license": "MIT",
        "repository": "nodeca/js-yaml",
        "files": [
          "index.js",
          "lib/",
          "bin/",
          "dist/"
        ],
        "bin": {
          "js-yaml": "bin/js-yaml.js"
        },
        "dependencies": {
          "argparse": "^1.0.7",
          "esprima": "^4.0.0"
        },
        "devDependencies": {
          "ansi": "^0.3.1",
          "benchmark": "^2.1.4",
          "browserify": "^16.2.2",
          "codemirror": "^5.13.4",
          "eslint": "^4.1.1",
          "fast-check": "1.1.3",
          "istanbul": "^0.4.5",
          "mocha": "^5.2.0",
          "uglify-js": "^3.0.1"
        },
        "scripts": {
          "test": "make test"
        }
      })
    },
    "jsbn": {
      "package.json": JSON.stringify({
        "name": "jsbn",
        "version": "0.1.1",
        "description": "The jsbn library is a fast, portable implementation of large-number math in pure JavaScript, enabling public-key crypto and other applications on desktop and mobile browsers.",
        "main": "index.js",
        "scripts": {
          "test": "mocha test.js"
        },
        "repository": {
          "type": "git",
          "url": "https://github.com/andyperlitch/jsbn.git"
        },
        "keywords": [
          "biginteger",
          "bignumber",
          "big",
          "integer"
        ],
        "author": "Tom Wu",
        "license": "MIT"
      })
    },
    "jsesc": {
      "package.json": JSON.stringify({
        "name": "jsesc",
        "version": "1.3.0",
        "description": "A JavaScript library for escaping JavaScript strings while generating the shortest possible valid output.",
        "homepage": "https://mths.be/jsesc",
        "main": "jsesc.js",
        "bin": "bin/jsesc",
        "man": "man/jsesc.1",
        "keywords": [
          "string",
          "escape",
          "javascript",
          "tool"
        ],
        "license": "MIT",
        "author": {
          "name": "Mathias Bynens",
          "url": "https://mathiasbynens.be/"
        },
        "repository": {
          "type": "git",
          "url": "https://github.com/mathiasbynens/jsesc.git"
        },
        "bugs": "https://github.com/mathiasbynens/jsesc/issues",
        "files": [
          "LICENSE-MIT.txt",
          "jsesc.js",
          "bin/",
          "man/"
        ],
        "scripts": {
          "test": "node tests/tests.js",
          "build": "grunt template"
        },
        "devDependencies": {
          "coveralls": "^2.11.6",
          "grunt": "^0.4.5",
          "grunt-shell": "^1.1.2",
          "grunt-template": "^0.2.3",
          "istanbul": "^0.4.2",
          "qunit-extras": "^1.4.5",
          "qunitjs": "~1.11.0",
          "regenerate": "^1.2.1",
          "requirejs": "^2.1.22"
        }
      })
    },
    "json-parse-better-errors": {
      "package.json": JSON.stringify({
        "name": "json-parse-better-errors",
        "version": "1.0.2",
        "description": "JSON.parse with context information on error",
        "main": "index.js",
        "files": [
          "*.js"
        ],
        "scripts": {
          "prerelease": "npm t",
          "postrelease": "npm publish && git push --follow-tags",
          "pretest": "standard",
          "release": "standard-version -s",
          "test": "tap -J --coverage test/*.js",
          "update-coc": "weallbehave -o . && git add CODE_OF_CONDUCT.md && git commit -m 'docs(coc): updated CODE_OF_CONDUCT.md'",
          "update-contrib": "weallcontribute -o . && git add CONTRIBUTING.md && git commit -m 'docs(contributing): updated CONTRIBUTING.md'"
        },
        "repository": "https://github.com/zkat/json-parse-better-errors",
        "keywords": [
          "JSON",
          "parser"
        ],
        "author": {
          "name": "Kat Marchán",
          "email": "kzm@zkat.tech",
          "twitter": "maybekatz"
        },
        "license": "MIT",
        "devDependencies": {
          "nyc": "^10.3.2",
          "standard": "^9.0.2",
          "standard-version": "^4.1.0",
          "tap": "^10.3.3",
          "weallbehave": "^1.2.0",
          "weallcontribute": "^1.0.8"
        },
        "config": {
          "nyc": {
            "exclude": [
              "node_modules/**",
              "test/**"
            ]
          }
        }
      })
    },
    "json-schema": {
      "package.json": JSON.stringify({
        "name": "json-schema",
        "version": "0.2.3",
        "author": "Kris Zyp",
        "description": "JSON Schema validation and specifications",
        "maintainers": [
          {
            "name": "Kris Zyp",
            "email": "kriszyp@gmail.com"
          }
        ],
        "keywords": [
          "json",
          "schema"
        ],
        "licenses": [
          {
            "type": "AFLv2.1",
            "url": "http://trac.dojotoolkit.org/browser/dojo/trunk/LICENSE#L43"
          },
          {
            "type": "BSD",
            "url": "http://trac.dojotoolkit.org/browser/dojo/trunk/LICENSE#L13"
          }
        ],
        "repository": {
          "type": "git",
          "url": "http://github.com/kriszyp/json-schema"
        },
        "directories": {
          "lib": "./lib"
        },
        "main": "./lib/validate.js",
        "devDependencies": {
          "vows": "*"
        },
        "scripts": {
          "test": "echo TESTS DISABLED vows --spec test/*.js"
        }
      })
    },
    "json-schema-traverse": {
      "package.json": JSON.stringify({
        "name": "json-schema-traverse",
        "version": "0.4.1",
        "description": "Traverse JSON Schema passing each schema object to callback",
        "main": "index.js",
        "scripts": {
          "eslint": "eslint index.js spec",
          "test-spec": "mocha spec -R spec",
          "test": "npm run eslint && nyc npm run test-spec"
        },
        "repository": {
          "type": "git",
          "url": "git+https://github.com/epoberezkin/json-schema-traverse.git"
        },
        "keywords": [
          "JSON-Schema",
          "traverse",
          "iterate"
        ],
        "author": "Evgeny Poberezkin",
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/epoberezkin/json-schema-traverse/issues"
        },
        "homepage": "https://github.com/epoberezkin/json-schema-traverse#readme",
        "devDependencies": {
          "coveralls": "^2.13.1",
          "eslint": "^3.19.0",
          "mocha": "^3.4.2",
          "nyc": "^11.0.2",
          "pre-commit": "^1.2.2"
        },
        "nyc": {
          "exclude": [
            "**/spec/**",
            "node_modules"
          ],
          "reporter": [
            "lcov",
            "text-summary"
          ]
        }
      })
    },
    "json-stringify-safe": {
      "package.json": JSON.stringify({
        "name": "json-stringify-safe",
        "version": "5.0.1",
        "description": "Like JSON.stringify, but doesn't blow up on circular refs.",
        "keywords": [
          "json",
          "stringify",
          "circular",
          "safe"
        ],
        "homepage": "https://github.com/isaacs/json-stringify-safe",
        "bugs": "https://github.com/isaacs/json-stringify-safe/issues",
        "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me)",
        "contributors": [
          "Andri Möll <andri@dot.ee> (http://themoll.com)"
        ],
        "license": "ISC",
        "repository": {
          "type": "git",
          "url": "git://github.com/isaacs/json-stringify-safe"
        },
        "main": "stringify.js",
        "scripts": {
          "test": "node test.js"
        },
        "devDependencies": {
          "mocha": ">= 2.1.0 < 3",
          "must": ">= 0.12 < 0.13",
          "sinon": ">= 1.12.2 < 2"
        }
      })
    },
    "json5": {
      "package.json": JSON.stringify({
        "name": "json5",
        "version": "0.5.1",
        "description": "JSON for the ES5 era.",
        "keywords": [
          "json",
          "es5"
        ],
        "author": "Aseem Kishore <aseem.kishore@gmail.com>",
        "contributors": [
          "Max Nanasy <max.nanasy@gmail.com>",
          "Andrew Eisenberg <andrew@eisenberg.as>",
          "Jordan Tucker <jordanbtucker@gmail.com>"
        ],
        "main": "lib/json5.js",
        "bin": "lib/cli.js",
        "files": [
          "lib/"
        ],
        "dependencies": {},
        "devDependencies": {
          "gulp": "^3.9.1",
          "gulp-jshint": "^2.0.1",
          "jshint": "^2.9.3",
          "jshint-stylish": "^2.2.1",
          "mocha": "^3.1.0"
        },
        "scripts": {
          "build": "node ./lib/cli.js -c package.json5",
          "test": "mocha --ui exports --reporter spec"
        },
        "homepage": "http://json5.org/",
        "license": "MIT",
        "repository": {
          "type": "git",
          "url": "https://github.com/aseemk/json5.git"
        }
      })
    },
    "jsprim": {
      "package.json": JSON.stringify({
        "name": "jsprim",
        "version": "1.4.1",
        "description": "utilities for primitive JavaScript types",
        "main": "./lib/jsprim.js",
        "repository": {
          "type": "git",
          "url": "git://github.com/joyent/node-jsprim.git"
        },
        "dependencies": {
          "assert-plus": "1.0.0",
          "extsprintf": "1.3.0",
          "json-schema": "0.2.3",
          "verror": "1.10.0"
        },
        "engines": [
          "node >=0.6.0"
        ],
        "license": "MIT"
      })
    },
    "lcid": {
      "package.json": JSON.stringify({
        "name": "lcid",
        "version": "2.0.0",
        "description": "Mapping between standard locale identifiers and Windows locale identifiers (LCID)",
        "license": "MIT",
        "repository": "sindresorhus/lcid",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=6"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js",
          "lcid.json"
        ],
        "keywords": [
          "lcid",
          "locale",
          "string",
          "str",
          "id",
          "identifier",
          "windows",
          "language",
          "lang",
          "map",
          "mapping",
          "convert",
          "json",
          "bcp47",
          "ietf",
          "tag"
        ],
        "dependencies": {
          "invert-kv": "^2.0.0"
        },
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        }
      })
    },
    "lcov-parse": {
      "package.json": JSON.stringify({
        "name": "lcov-parse",
        "description": "Parse lcov results files and return JSON",
        "version": "0.0.10",
        "author": "Dav Glass <davglass@gmail.com>",
        "contributors": [
          "Alan Gutierrez <alan@prettyrobots.com>",
          "Gerard Escalante <gerard@saygo.ca>"
        ],
        "bugs": {
          "url": "http://github.com/davglass/lcov-parse/issues"
        },
        "main": "./lib/index",
        "tags": [
          "lcov",
          "json",
          "coverage",
          "parser"
        ],
        "devDependencies": {
          "istanbul": "^0.2.10",
          "jshint": "^2.5.1",
          "vows": "*",
          "yui-lint": "~0.1.1"
        },
        "scripts": {
          "pretest": "jshint --config ./node_modules/yui-lint/jshint.json ./lib/",
          "test": "istanbul cover --print both ./node_modules/vows/bin/vows -- --spec ./tests/*.js"
        },
        "license": "BSD-3-Clause",
        "repository": {
          "type": "git",
          "url": "http://github.com/davglass/lcov-parse.git"
        }
      })
    },
    "load-json-file": {
      "package.json": JSON.stringify({
        "name": "load-json-file",
        "version": "4.0.0",
        "description": "Read and parse a JSON file",
        "license": "MIT",
        "repository": "sindresorhus/load-json-file",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "read",
          "json",
          "parse",
          "file",
          "fs",
          "graceful",
          "load"
        ],
        "dependencies": {
          "graceful-fs": "^4.1.2",
          "parse-json": "^4.0.0",
          "pify": "^3.0.0",
          "strip-bom": "^3.0.0"
        },
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        },
        "xo": {
          "esnext": true
        }
      })
    },
    "locate-path": {
      "package.json": JSON.stringify({
        "name": "locate-path",
        "version": "3.0.0",
        "description": "Get the first path that exists on disk of multiple paths",
        "license": "MIT",
        "repository": "sindresorhus/locate-path",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=6"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "locate",
          "path",
          "paths",
          "file",
          "files",
          "exists",
          "find",
          "finder",
          "search",
          "searcher",
          "array",
          "iterable",
          "iterator"
        ],
        "dependencies": {
          "p-locate": "^3.0.0",
          "path-exists": "^3.0.0"
        },
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        }
      })
    },
    "lodash": {
      "package.json": JSON.stringify({
        "name": "lodash",
        "version": "4.17.11",
        "description": "Lodash modular utilities.",
        "keywords": "modules, stdlib, util",
        "homepage": "https://lodash.com/",
        "repository": "lodash/lodash",
        "icon": "https://lodash.com/icon.svg",
        "license": "MIT",
        "main": "lodash.js",
        "author": "John-David Dalton <john.david.dalton@gmail.com> (http://allyoucanleet.com/)",
        "contributors": [
          "John-David Dalton <john.david.dalton@gmail.com> (http://allyoucanleet.com/)",
          "Mathias Bynens <mathias@qiwi.be> (https://mathiasbynens.be/)"
        ],
        "scripts": {
          "test": "echo \"See https://travis-ci.org/lodash-archive/lodash-cli for testing details.\""
        }
      })
    },
    "lodash.flattendeep": {
      "package.json": JSON.stringify({
        "name": "lodash.flattendeep",
        "version": "4.4.0",
        "description": "The lodash method `_.flattenDeep` exported as a module.",
        "homepage": "https://lodash.com/",
        "icon": "https://lodash.com/icon.svg",
        "license": "MIT",
        "keywords": "lodash-modularized, flattendeep",
        "author": "John-David Dalton <john.david.dalton@gmail.com> (http://allyoucanleet.com/)",
        "contributors": [
          "John-David Dalton <john.david.dalton@gmail.com> (http://allyoucanleet.com/)",
          "Blaine Bublitz <blaine.bublitz@gmail.com> (https://github.com/phated)",
          "Mathias Bynens <mathias@qiwi.be> (https://mathiasbynens.be/)"
        ],
        "repository": "lodash/lodash",
        "scripts": {
          "test": "echo \"See https://travis-ci.org/lodash/lodash-cli for testing details.\""
        }
      })
    },
    "lodash.throttle": {
      "package.json": JSON.stringify({
        "name": "lodash.throttle",
        "version": "4.1.1",
        "description": "The lodash method `_.throttle` exported as a module.",
        "homepage": "https://lodash.com/",
        "icon": "https://lodash.com/icon.svg",
        "license": "MIT",
        "keywords": "lodash-modularized, throttle",
        "author": "John-David Dalton <john.david.dalton@gmail.com> (http://allyoucanleet.com/)",
        "contributors": [
          "John-David Dalton <john.david.dalton@gmail.com> (http://allyoucanleet.com/)",
          "Blaine Bublitz <blaine.bublitz@gmail.com> (https://github.com/phated)",
          "Mathias Bynens <mathias@qiwi.be> (https://mathiasbynens.be/)"
        ],
        "repository": "lodash/lodash",
        "scripts": {
          "test": "echo \"See https://travis-ci.org/lodash/lodash-cli for testing details.\""
        }
      })
    },
    "log-driver": {
      "package.json": JSON.stringify({
        "name": "log-driver",
        "description": "log-driver is a simple logging framework for logging to stdout",
        "keywords": [
          "logging",
          "logger",
          "log"
        ],
        "version": "1.2.7",
        "bugs": {
          "url": "https://github.com/cainus/logdriver/issues"
        },
        "repository": {
          "type": "git",
          "url": "git://github.com/cainus/logdriver.git"
        },
        "scripts": {
          "test": "make test-codecov"
        },
        "maintainers": [
          "Gregg Caines <gregg@caines.ca> (http://caines.ca)"
        ],
        "devDependencies": {
          "codecov.io": "0.0.1",
          "jshint": "2.4.4",
          "istanbul": "0.2.6",
          "coveralls": "2.10.0",
          "sinon-restore": "1.0.1",
          "mocha": "1.20.1",
          "should": "1.1.0"
        },
        "engines": {
          "node": ">=0.8.6"
        },
        "homepage": "https://github.com/cainus/logdriver",
        "main": "index.js",
        "directories": {
          "test": "test"
        },
        "author": "Gregg Caines",
        "license": "ISC"
      })
    },
    "log-update": {
      "package.json": JSON.stringify({
        "name": "log-update",
        "version": "3.2.0",
        "description": "Log by overwriting the previous output in the terminal. Useful for rendering progress bars, animations, etc.",
        "license": "MIT",
        "repository": "sindresorhus/log-update",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=6"
        },
        "scripts": {
          "test": "xo && ava && tsd"
        },
        "files": [
          "index.js",
          "index.d.ts"
        ],
        "keywords": [
          "log",
          "logger",
          "logging",
          "cli",
          "terminal",
          "term",
          "console",
          "shell",
          "update",
          "refresh",
          "overwrite",
          "output",
          "stdout",
          "progress",
          "bar",
          "animation"
        ],
        "dependencies": {
          "ansi-escapes": "^3.2.0",
          "cli-cursor": "^2.1.0",
          "wrap-ansi": "^5.0.0"
        },
        "devDependencies": {
          "@types/node": "^11.12.2",
          "ava": "^1.4.1",
          "terminal.js": "^1.0.10",
          "tsd": "^0.7.1",
          "xo": "^0.24.0"
        }
      })
    },
    "loose-envify": {
      "package.json": JSON.stringify({
        "name": "loose-envify",
        "version": "1.4.0",
        "description": "Fast (and loose) selective `process.env` replacer using js-tokens instead of an AST",
        "keywords": [
          "environment",
          "variables",
          "browserify",
          "browserify-transform",
          "transform",
          "source",
          "configuration"
        ],
        "homepage": "https://github.com/zertosh/loose-envify",
        "license": "MIT",
        "author": "Andres Suarez <zertosh@gmail.com>",
        "main": "index.js",
        "bin": {
          "loose-envify": "cli.js"
        },
        "repository": {
          "type": "git",
          "url": "git://github.com/zertosh/loose-envify.git"
        },
        "scripts": {
          "test": "tap test/*.js"
        },
        "dependencies": {
          "js-tokens": "^3.0.0 || ^4.0.0"
        },
        "devDependencies": {
          "browserify": "^13.1.1",
          "envify": "^3.4.0",
          "tap": "^8.0.0"
        }
      })
    },
    "lru-cache": {
      "node_modules": {
        "yallist": {
          "package.json": JSON.stringify({
            "name": "yallist",
            "version": "2.1.2",
            "description": "Yet Another Linked List",
            "main": "yallist.js",
            "directories": {
              "test": "test"
            },
            "files": [
              "yallist.js",
              "iterator.js"
            ],
            "dependencies": {},
            "devDependencies": {
              "tap": "^10.3.0"
            },
            "scripts": {
              "test": "tap test/*.js --100",
              "preversion": "npm test",
              "postversion": "npm publish",
              "postpublish": "git push origin --all; git push origin --tags"
            },
            "repository": {
              "type": "git",
              "url": "git+https://github.com/isaacs/yallist.git"
            },
            "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me/)",
            "license": "ISC"
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "lru-cache",
        "description": "A cache object that deletes the least-recently-used items.",
        "version": "4.1.5",
        "author": "Isaac Z. Schlueter <i@izs.me>",
        "keywords": [
          "mru",
          "lru",
          "cache"
        ],
        "scripts": {
          "test": "tap test/*.js --100 -J",
          "snap": "TAP_SNAPSHOT=1 tap test/*.js -J",
          "posttest": "standard test/*.js index.js",
          "coveragerport": "tap --coverage-report=html",
          "lintfix": "standard --fix test/*.js index.js",
          "preversion": "npm test",
          "postversion": "npm publish --tag=legacy",
          "postpublish": "git push origin --all; git push origin --tags"
        },
        "main": "index.js",
        "repository": "git://github.com/isaacs/node-lru-cache.git",
        "devDependencies": {
          "benchmark": "^2.1.4",
          "standard": "^12.0.1",
          "tap": "^12.1.0"
        },
        "license": "ISC",
        "dependencies": {
          "pseudomap": "^1.0.2",
          "yallist": "^2.1.2"
        },
        "files": [
          "index.js"
        ]
      })
    },
    "make-dir": {
      "node_modules": {
        "pify": {
          "package.json": JSON.stringify({
            "name": "pify",
            "version": "4.0.1",
            "description": "Promisify a callback-style function",
            "license": "MIT",
            "repository": "sindresorhus/pify",
            "author": {
              "name": "Sindre Sorhus",
              "email": "sindresorhus@gmail.com",
              "url": "sindresorhus.com"
            },
            "engines": {
              "node": ">=6"
            },
            "scripts": {
              "test": "xo && ava",
              "optimization-test": "node --allow-natives-syntax optimization-test.js"
            },
            "files": [
              "index.js"
            ],
            "keywords": [
              "promise",
              "promises",
              "promisify",
              "all",
              "denodify",
              "denodeify",
              "callback",
              "cb",
              "node",
              "then",
              "thenify",
              "convert",
              "transform",
              "wrap",
              "wrapper",
              "bind",
              "to",
              "async",
              "await",
              "es2015",
              "bluebird"
            ],
            "devDependencies": {
              "ava": "^0.25.0",
              "pinkie-promise": "^2.0.0",
              "v8-natives": "^1.1.0",
              "xo": "^0.23.0"
            }
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "make-dir",
        "version": "2.1.0",
        "description": "Make a directory and its parents if needed - Think `mkdir -p`",
        "license": "MIT",
        "repository": "sindresorhus/make-dir",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=6"
        },
        "scripts": {
          "test": "xo && nyc ava && tsd-check"
        },
        "files": [
          "index.js",
          "index.d.ts"
        ],
        "keywords": [
          "mkdir",
          "mkdirp",
          "make",
          "directories",
          "dir",
          "dirs",
          "folders",
          "directory",
          "folder",
          "path",
          "parent",
          "parents",
          "intermediate",
          "recursively",
          "recursive",
          "create",
          "fs",
          "filesystem",
          "file-system"
        ],
        "dependencies": {
          "pify": "^4.0.1",
          "semver": "^5.6.0"
        },
        "devDependencies": {
          "@types/graceful-fs": "^4.1.3",
          "@types/node": "^11.10.4",
          "ava": "^1.2.0",
          "codecov": "^3.0.0",
          "graceful-fs": "^4.1.11",
          "nyc": "^13.1.0",
          "path-type": "^3.0.0",
          "tempy": "^0.2.1",
          "tsd-check": "^0.3.0",
          "xo": "^0.24.0"
        }
      })
    },
    "make-error": {
      "package.json": JSON.stringify({
        "name": "make-error",
        "version": "1.3.5",
        "main": "index.js",
        "license": "ISC",
        "description": "Make your own error types!",
        "keywords": [
          "create",
          "custom",
          "derive",
          "error",
          "errors",
          "extend",
          "extending",
          "extension",
          "factory",
          "inherit",
          "make",
          "subclass"
        ],
        "homepage": "https://github.com/JsCommunity/make-error",
        "bugs": "https://github.com/JsCommunity/make-error/issues",
        "author": "Julien Fontanet <julien.fontanet@isonoe.net>",
        "repository": {
          "type": "git",
          "url": "git://github.com/JsCommunity/make-error.git"
        },
        "devDependencies": {
          "browserify": "^14.5.0",
          "husky": "^0.14.3",
          "jest": "^20",
          "standard": "^10.0.3",
          "uglify-js": "^3.3.2"
        },
        "jest": {
          "testEnvironment": "node"
        },
        "scripts": {
          "commitmsg": "yarn test",
          "dev-test": "jest --watch",
          "prepublishOnly": "mkdir -p dist && browserify -s makeError index.js | uglifyjs -c > dist/make-error.js",
          "pretest": "standard",
          "test": "jest"
        },
        "files": [
          "dist/",
          "index.js",
          "index.d.ts"
        ]
      })
    },
    "map-age-cleaner": {
      "package.json": JSON.stringify({
        "name": "map-age-cleaner",
        "version": "0.1.3",
        "description": "Automatically cleanup expired items in a Map",
        "license": "MIT",
        "repository": "SamVerschueren/map-age-cleaner",
        "author": {
          "name": "Sam Verschueren",
          "email": "sam.verschueren@gmail.com",
          "url": "github.com/SamVerschueren"
        },
        "main": "dist/index.js",
        "engines": {
          "node": ">=6"
        },
        "scripts": {
          "prepublishOnly": "npm run build",
          "pretest": "npm run build -- --sourceMap",
          "test": "npm run lint && nyc ava dist/test.js",
          "lint": "tslint --format stylish --project .",
          "build": "npm run clean && tsc",
          "clean": "del-cli dist"
        },
        "files": [
          "dist/index.js",
          "dist/index.d.ts"
        ],
        "keywords": [
          "map",
          "age",
          "cleaner",
          "maxage",
          "expire",
          "expiration",
          "expiring"
        ],
        "dependencies": {
          "p-defer": "^1.0.0"
        },
        "devDependencies": {
          "@types/delay": "^2.0.1",
          "@types/node": "^10.7.1",
          "ava": "^0.25.0",
          "codecov": "^3.0.0",
          "del-cli": "^1.1.0",
          "delay": "^3.0.0",
          "nyc": "^12.0.0",
          "tslint": "^5.11.0",
          "tslint-xo": "^0.9.0",
          "typescript": "^3.0.1"
        },
        "typings": "dist/index.d.ts",
        "sideEffects": false,
        "nyc": {
          "exclude": [
            "dist/test.js"
          ]
        }
      })
    },
    "mem": {
      "node_modules": {
        "mimic-fn": {
          "package.json": JSON.stringify({
            "name": "mimic-fn",
            "version": "2.1.0",
            "description": "Make a function mimic another one",
            "license": "MIT",
            "repository": "sindresorhus/mimic-fn",
            "author": {
              "name": "Sindre Sorhus",
              "email": "sindresorhus@gmail.com",
              "url": "sindresorhus.com"
            },
            "engines": {
              "node": ">=6"
            },
            "scripts": {
              "test": "xo && ava && tsd"
            },
            "files": [
              "index.js",
              "index.d.ts"
            ],
            "keywords": [
              "function",
              "mimic",
              "imitate",
              "rename",
              "copy",
              "inherit",
              "properties",
              "name",
              "func",
              "fn",
              "set",
              "infer",
              "change"
            ],
            "devDependencies": {
              "ava": "^1.4.1",
              "tsd": "^0.7.1",
              "xo": "^0.24.0"
            }
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "mem",
        "version": "4.3.0",
        "description": "Memoize functions - An optimization used to speed up consecutive function calls by caching the result of calls with identical input",
        "license": "MIT",
        "repository": "sindresorhus/mem",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=6"
        },
        "scripts": {
          "test": "xo && ava && tsd"
        },
        "files": [
          "index.js",
          "index.d.ts"
        ],
        "keywords": [
          "memoize",
          "function",
          "mem",
          "memoization",
          "cache",
          "caching",
          "optimize",
          "performance",
          "ttl",
          "expire",
          "promise"
        ],
        "dependencies": {
          "map-age-cleaner": "^0.1.1",
          "mimic-fn": "^2.0.0",
          "p-is-promise": "^2.0.0"
        },
        "devDependencies": {
          "ava": "^1.4.1",
          "delay": "^4.1.0",
          "tsd": "^0.7.1",
          "xo": "^0.24.0"
        }
      })
    },
    "merge-source-map": {
      "package.json": JSON.stringify({
        "name": "merge-source-map",
        "version": "1.1.0",
        "description": "Merge old source map and new source map in multi-transform flow",
        "main": "index.js",
        "scripts": {
          "test": "nyc tape test/*.js",
          "lint": "eslint index.js 'test/**/*.js'",
          "version": "npm run lint && npm run test"
        },
        "repository": {
          "type": "git",
          "url": "git+https://github.com/keik/merge-source-map.git"
        },
        "author": "keik <k4t0.kei@gmail.com>",
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/keik/merge-source-map/issues"
        },
        "keywords": [
          "sourcemap",
          "source-map"
        ],
        "dependencies": {
          "source-map": "^0.6.1"
        },
        "devDependencies": {
          "babel-core": "^6.25.0",
          "babel-plugin-syntax-object-rest-spread": "^6.13.0",
          "babel-plugin-transform-es2015-arrow-functions": "^6.22.0",
          "babel-plugin-transform-es2015-spread": "^6.22.0",
          "coffee-script": "^1.12.6",
          "convert-source-map": "^1.5.0",
          "escodegen": "^1.8.1",
          "eslint": "^3.19.0",
          "esprima": "^3.1.3",
          "estraverse": "^4.2.0",
          "nyc": "^8.4.0",
          "tape": "^4.6.3"
        },
        "files": []
      })
    },
    "mime-db": {
      "package.json": JSON.stringify({
        "name": "mime-db",
        "description": "Media Type Database",
        "version": "1.40.0",
        "contributors": [
          "Douglas Christopher Wilson <doug@somethingdoug.com>",
          "Jonathan Ong <me@jongleberry.com> (http://jongleberry.com)",
          "Robert Kieffer <robert@broofa.com> (http://github.com/broofa)"
        ],
        "license": "MIT",
        "keywords": [
          "mime",
          "db",
          "type",
          "types",
          "database",
          "charset",
          "charsets"
        ],
        "repository": "jshttp/mime-db",
        "devDependencies": {
          "bluebird": "3.5.4",
          "co": "4.6.0",
          "cogent": "1.0.1",
          "csv-parse": "4.3.4",
          "eslint": "5.16.0",
          "eslint-config-standard": "12.0.0",
          "eslint-plugin-import": "2.16.0",
          "eslint-plugin-node": "8.0.1",
          "eslint-plugin-promise": "4.1.1",
          "eslint-plugin-standard": "4.0.0",
          "gnode": "0.1.2",
          "mocha": "6.1.4",
          "nyc": "14.0.0",
          "raw-body": "2.3.3",
          "stream-to-array": "2.3.0"
        },
        "files": [
          "HISTORY.md",
          "LICENSE",
          "README.md",
          "db.json",
          "index.js"
        ],
        "engines": {
          "node": ">= 0.6"
        },
        "scripts": {
          "build": "node scripts/build",
          "fetch": "node scripts/fetch-apache && gnode scripts/fetch-iana && node scripts/fetch-nginx",
          "lint": "eslint .",
          "test": "mocha --reporter spec --bail --check-leaks test/",
          "test-cov": "nyc --reporter=html --reporter=text npm test",
          "test-travis": "nyc --reporter=text npm test",
          "update": "npm run fetch && npm run build",
          "version": "node scripts/version-history.js && git add HISTORY.md"
        }
      })
    },
    "mime-types": {
      "package.json": JSON.stringify({
        "name": "mime-types",
        "description": "The ultimate javascript content-type utility.",
        "version": "2.1.24",
        "contributors": [
          "Douglas Christopher Wilson <doug@somethingdoug.com>",
          "Jeremiah Senkpiel <fishrock123@rocketmail.com> (https://searchbeam.jit.su)",
          "Jonathan Ong <me@jongleberry.com> (http://jongleberry.com)"
        ],
        "license": "MIT",
        "keywords": [
          "mime",
          "types"
        ],
        "repository": "jshttp/mime-types",
        "dependencies": {
          "mime-db": "1.40.0"
        },
        "devDependencies": {
          "eslint": "5.16.0",
          "eslint-config-standard": "12.0.0",
          "eslint-plugin-import": "2.17.2",
          "eslint-plugin-node": "8.0.1",
          "eslint-plugin-promise": "4.1.1",
          "eslint-plugin-standard": "4.0.0",
          "mocha": "6.1.4",
          "nyc": "14.0.0"
        },
        "files": [
          "HISTORY.md",
          "LICENSE",
          "index.js"
        ],
        "engines": {
          "node": ">= 0.6"
        },
        "scripts": {
          "lint": "eslint .",
          "test": "mocha --reporter spec test/test.js",
          "test-cov": "nyc --reporter=html --reporter=text npm test",
          "test-travis": "nyc --reporter=text npm test"
        }
      })
    },
    "mimic-fn": {
      "package.json": JSON.stringify({
        "name": "mimic-fn",
        "version": "1.2.0",
        "description": "Make a function mimic another one",
        "license": "MIT",
        "repository": "sindresorhus/mimic-fn",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "function",
          "mimic",
          "imitate",
          "rename",
          "copy",
          "inherit",
          "properties",
          "name",
          "func",
          "fn",
          "set",
          "infer",
          "change"
        ],
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        }
      })
    },
    "minimatch": {
      "package.json": JSON.stringify({
        "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me)",
        "name": "minimatch",
        "description": "a glob matcher in javascript",
        "version": "3.0.4",
        "repository": {
          "type": "git",
          "url": "git://github.com/isaacs/minimatch.git"
        },
        "main": "minimatch.js",
        "scripts": {
          "test": "tap test/*.js --cov",
          "preversion": "npm test",
          "postversion": "npm publish",
          "postpublish": "git push origin --all; git push origin --tags"
        },
        "engines": {
          "node": "*"
        },
        "dependencies": {
          "brace-expansion": "^1.1.7"
        },
        "devDependencies": {
          "tap": "^10.3.2"
        },
        "license": "ISC",
        "files": [
          "minimatch.js"
        ]
      })
    },
    "minimist": {
      "package.json": JSON.stringify({
        "name": "minimist",
        "version": "0.0.8",
        "description": "parse argument options",
        "main": "index.js",
        "devDependencies": {
          "tape": "~1.0.4",
          "tap": "~0.4.0"
        },
        "scripts": {
          "test": "tap test/*.js"
        },
        "testling": {
          "files": "test/*.js",
          "browsers": [
            "ie/6..latest",
            "ff/5",
            "firefox/latest",
            "chrome/10",
            "chrome/latest",
            "safari/5.1",
            "safari/latest",
            "opera/12"
          ]
        },
        "repository": {
          "type": "git",
          "url": "git://github.com/substack/minimist.git"
        },
        "homepage": "https://github.com/substack/minimist",
        "keywords": [
          "argv",
          "getopt",
          "parser",
          "optimist"
        ],
        "author": {
          "name": "James Halliday",
          "email": "mail@substack.net",
          "url": "http://substack.net"
        },
        "license": "MIT"
      })
    },
    "minipass": {
      "package.json": JSON.stringify({
        "name": "minipass",
        "version": "3.1.1",
        "description": "minimal implementation of a PassThrough stream",
        "main": "index.js",
        "dependencies": {
          "yallist": "^4.0.0"
        },
        "devDependencies": {
          "end-of-stream": "^1.4.0",
          "tap": "^14.6.5",
          "through2": "^2.0.3"
        },
        "scripts": {
          "test": "tap",
          "preversion": "npm test",
          "postversion": "npm publish --tag=next",
          "postpublish": "git push origin --follow-tags"
        },
        "repository": {
          "type": "git",
          "url": "git+https://github.com/isaacs/minipass.git"
        },
        "keywords": [
          "passthrough",
          "stream"
        ],
        "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me/)",
        "license": "ISC",
        "files": [
          "index.js"
        ],
        "tap": {
          "check-coverage": true
        },
        "engines": {
          "node": ">=8"
        }
      })
    },
    "mkdirp": {
      "package.json": JSON.stringify({
        "name": "mkdirp",
        "description": "Recursively mkdir, like `mkdir -p`",
        "version": "0.5.1",
        "author": "James Halliday <mail@substack.net> (http://substack.net)",
        "main": "index.js",
        "keywords": [
          "mkdir",
          "directory"
        ],
        "repository": {
          "type": "git",
          "url": "https://github.com/substack/node-mkdirp.git"
        },
        "scripts": {
          "test": "tap test/*.js"
        },
        "dependencies": {
          "minimist": "0.0.8"
        },
        "devDependencies": {
          "tap": "1",
          "mock-fs": "2 >=2.7.0"
        },
        "bin": "bin/cmd.js",
        "license": "MIT"
      })
    },
    "ms": {
      "package.json": JSON.stringify({
        "name": "ms",
        "version": "2.1.2",
        "description": "Tiny millisecond conversion utility",
        "repository": "zeit/ms",
        "main": "./index",
        "files": [
          "index.js"
        ],
        "scripts": {
          "precommit": "lint-staged",
          "lint": "eslint lib/* bin/*",
          "test": "mocha tests.js"
        },
        "eslintConfig": {
          "extends": "eslint:recommended",
          "env": {
            "node": true,
            "es6": true
          }
        },
        "lint-staged": {
          "*.js": [
            "npm run lint",
            "prettier --single-quote --write",
            "git add"
          ]
        },
        "license": "MIT",
        "devDependencies": {
          "eslint": "4.12.1",
          "expect.js": "0.3.1",
          "husky": "0.14.3",
          "lint-staged": "5.0.0",
          "mocha": "4.0.1"
        }
      })
    },
    "neo-async": {
      "package.json": JSON.stringify({
        "name": "neo-async",
        "version": "2.6.1",
        "description": "Neo-Async is thought to be used as a drop-in replacement for Async, it almost fully covers its functionality and runs faster ",
        "main": "async.js",
        "license": "MIT",
        "keywords": "async, util",
        "repository": {
          "type": "git",
          "url": "git@github.com:suguru03/neo-async.git"
        },
        "homepage": "https://github.com/suguru03/neo-async",
        "dependencies": {},
        "devDependencies": {
          "aigle": "^1.8.1",
          "async": "^2.6.0",
          "benchmark": "^2.1.1",
          "bluebird": "^3.5.1",
          "codecov.io": "^0.1.6",
          "fs-extra": "^4.0.2",
          "func-comparator": "^0.7.2",
          "gulp": "^3.9.1",
          "gulp-bump": "^2.8.0",
          "gulp-exit": "0.0.2",
          "gulp-git": "^2.4.2",
          "gulp-jscs": "^4.0.0",
          "gulp-mocha": "^4.2.0",
          "gulp-tag-version": "^1.3.0",
          "gulp-util": "^3.0.7",
          "husky": "^1.2.0",
          "istanbul": "^0.4.3",
          "jsdoc": "^3.5.5",
          "jshint": "^2.9.5",
          "lint-staged": "^8.1.0",
          "lodash": "^4.16.6",
          "minimist": "^1.2.0",
          "mocha": "^3.5.3",
          "mocha-parallel-executor": "^0.3.0",
          "mocha.parallel": "^0.15.3",
          "prettier": "^1.15.2",
          "require-dir": "^0.3.0",
          "run-sequence": "^1.2.2"
        },
        "lint-staged": {
          "*.{js,ts}": [
            "prettier --write",
            "git add"
          ]
        },
        "prettier": {
          "printWidth": 100,
          "singleQuote": true
        },
        "browser": "async.min.js"
      })
    },
    "nested-error-stacks": {
      "package.json": JSON.stringify({
        "name": "nested-error-stacks",
        "version": "2.1.0",
        "description": "An Error subclass that will chain nested Errors and dump nested stacktraces",
        "bugs": {
          "url": "https://github.com/mdlavin/nested-error-stacks/issues"
        },
        "keywords": [
          "error",
          "nested",
          "stack"
        ],
        "repository": {
          "type": "git",
          "url": "https://github.com/mdlavin/nested-error-stacks.git"
        },
        "main": "index.js",
        "files": [
          "index.js",
          "LICENSE"
        ],
        "scripts": {
          "test": "if node --version | grep -vE 'v(0|3)' > /dev/null 2>&1; then eslint . || exit -1; fi; if [ \"$RUN_ZUUL\" != \"true\" ]; then node_modules/.bin/mocha; else npm install zuul && node_modules/.bin/zuul -- test.js; fi"
        },
        "author": "Matt Lavin <matt.lavin@gmail.com>",
        "license": "MIT",
        "devDependencies": {
          "chai": "^3.5.0",
          "eslint": "^3.9.1",
          "mocha": "^3.1.2",
          "uuid": "^2.0.3"
        }
      })
    },
    "nice-try": {
      "package.json": JSON.stringify({
        "name": "nice-try",
        "version": "1.0.5",
        "authors": [
          "Tobias Reich <tobias@electerious.com>"
        ],
        "description": "Tries to execute a function and discards any error that occurs",
        "main": "src/index.js",
        "keywords": [
          "try",
          "catch",
          "error"
        ],
        "license": "MIT",
        "homepage": "https://github.com/electerious/nice-try",
        "repository": {
          "type": "git",
          "url": "https://github.com/electerious/nice-try.git"
        },
        "files": [
          "src"
        ],
        "scripts": {
          "coveralls": "nyc report --reporter=text-lcov | coveralls",
          "test": "nyc node_modules/mocha/bin/_mocha"
        },
        "devDependencies": {
          "chai": "^4.1.2",
          "coveralls": "^3.0.0",
          "nyc": "^12.0.1",
          "mocha": "^5.1.1"
        }
      })
    },
    "node-modules-regexp": {
      "package.json": JSON.stringify({
        "name": "node-modules-regexp",
        "version": "1.0.0",
        "description": "A regular expression for file paths that contain a `node_modules` folder.",
        "license": "MIT",
        "repository": "jamestalmage/node-modules-regexp",
        "author": {
          "name": "James Talmage",
          "email": "james@talmage.io",
          "url": "github.com/jamestalmage"
        },
        "engines": {
          "node": ">=0.10.0"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "node_modules",
          "regular expression",
          "regular expressions",
          "regular",
          "expression",
          "expressions",
          "exclude",
          "include",
          "ignore",
          "node",
          "module"
        ],
        "dependencies": {},
        "devDependencies": {
          "ava": "^0.7.0",
          "xo": "^0.11.2"
        },
        "xo": {
          "ignores": [
            "test.js"
          ]
        }
      })
    },
    "normalize-package-data": {
      "package.json": JSON.stringify({
        "name": "normalize-package-data",
        "version": "2.5.0",
        "author": "Meryn Stol <merynstol@gmail.com>",
        "description": "Normalizes data that can be found in package.json files.",
        "license": "BSD-2-Clause",
        "repository": {
          "type": "git",
          "url": "git://github.com/npm/normalize-package-data.git"
        },
        "main": "lib/normalize.js",
        "scripts": {
          "test": "tap test/*.js"
        },
        "dependencies": {
          "hosted-git-info": "^2.1.4",
          "resolve": "^1.10.0",
          "semver": "2 || 3 || 4 || 5",
          "validate-npm-package-license": "^3.0.1"
        },
        "devDependencies": {
          "async": "^2.6.1",
          "tap": "^12.4.0",
          "underscore": "^1.8.3"
        },
        "files": [
          "lib/*.js",
          "lib/*.json",
          "AUTHORS"
        ]
      })
    },
    "normalize-path": {
      "package.json": JSON.stringify({
        "name": "normalize-path",
        "description": "Normalize slashes in a file path to be posix/unix-like forward slashes. Also condenses repeat slashes to a single slash and removes and trailing slashes, unless disabled.",
        "version": "3.0.0",
        "homepage": "https://github.com/jonschlinkert/normalize-path",
        "author": "Jon Schlinkert (https://github.com/jonschlinkert)",
        "contributors": [
          "Blaine Bublitz (https://twitter.com/BlaineBublitz)",
          "Jon Schlinkert (http://twitter.com/jonschlinkert)"
        ],
        "repository": "jonschlinkert/normalize-path",
        "bugs": {
          "url": "https://github.com/jonschlinkert/normalize-path/issues"
        },
        "license": "MIT",
        "files": [
          "index.js"
        ],
        "main": "index.js",
        "engines": {
          "node": ">=0.10.0"
        },
        "scripts": {
          "test": "mocha"
        },
        "devDependencies": {
          "gulp-format-md": "^1.0.0",
          "minimist": "^1.2.0",
          "mocha": "^3.5.3"
        },
        "keywords": [
          "absolute",
          "backslash",
          "delimiter",
          "file",
          "file-path",
          "filepath",
          "fix",
          "forward",
          "fp",
          "fs",
          "normalize",
          "path",
          "relative",
          "separator",
          "slash",
          "slashes",
          "trailing",
          "unix",
          "urix"
        ],
        "verb": {
          "toc": false,
          "layout": "default",
          "tasks": [
            "readme"
          ],
          "plugins": [
            "gulp-format-md"
          ],
          "related": {
            "description": "Other useful path-related libraries:",
            "list": [
              "contains-path",
              "is-absolute",
              "is-relative",
              "parse-filepath",
              "path-ends-with",
              "path-ends-with",
              "unixify"
            ]
          },
          "lint": {
            "reflinks": true
          }
        }
      })
    },
    "npm-run-path": {
      "package.json": JSON.stringify({
        "name": "npm-run-path",
        "version": "2.0.2",
        "description": "Get your PATH prepended with locally installed binaries",
        "license": "MIT",
        "repository": "sindresorhus/npm-run-path",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "npm",
          "run",
          "path",
          "package",
          "bin",
          "binary",
          "binaries",
          "script",
          "cli",
          "command-line",
          "execute",
          "executable"
        ],
        "dependencies": {
          "path-key": "^2.0.0"
        },
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        },
        "xo": {
          "esnext": true
        }
      })
    },
    "number-is-nan": {
      "package.json": JSON.stringify({
        "name": "number-is-nan",
        "version": "1.0.1",
        "description": "ES2015 Number.isNaN() ponyfill",
        "license": "MIT",
        "repository": "sindresorhus/number-is-nan",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=0.10.0"
        },
        "scripts": {
          "test": "ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "es2015",
          "ecmascript",
          "ponyfill",
          "polyfill",
          "shim",
          "number",
          "is",
          "nan",
          "not"
        ],
        "devDependencies": {
          "ava": "*"
        }
      })
    },
    "nyc": {
      "node_modules": {
        "resolve-from": {
          "package.json": JSON.stringify({
            "name": "resolve-from",
            "version": "4.0.0",
            "description": "Resolve the path of a module like `require.resolve()` but from a given path",
            "license": "MIT",
            "repository": "sindresorhus/resolve-from",
            "author": {
              "name": "Sindre Sorhus",
              "email": "sindresorhus@gmail.com",
              "url": "sindresorhus.com"
            },
            "engines": {
              "node": ">=4"
            },
            "scripts": {
              "test": "xo && ava"
            },
            "files": [
              "index.js"
            ],
            "keywords": [
              "require",
              "resolve",
              "path",
              "module",
              "from",
              "like",
              "import"
            ],
            "devDependencies": {
              "ava": "*",
              "xo": "*"
            }
          })
        },
        "rimraf": {
          "package.json": JSON.stringify({
            "name": "rimraf",
            "version": "2.6.3",
            "main": "rimraf.js",
            "description": "A deep deletion module for node (like `rm -rf`)",
            "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me/)",
            "license": "ISC",
            "repository": "git://github.com/isaacs/rimraf.git",
            "scripts": {
              "preversion": "npm test",
              "postversion": "npm publish",
              "postpublish": "git push origin --all; git push origin --tags",
              "test": "tap test/*.js"
            },
            "bin": "./bin.js",
            "dependencies": {
              "glob": "^7.1.3"
            },
            "files": [
              "LICENSE",
              "README.md",
              "bin.js",
              "rimraf.js"
            ],
            "devDependencies": {
              "mkdirp": "^0.5.1",
              "tap": "^12.1.1"
            }
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "nyc",
        "version": "14.1.1",
        "description": "the Istanbul command line interface",
        "main": "index.js",
        "scripts": {
          "lint": "standard",
          "pretest": "npm run lint && npm run clean && npm run instrument",
          "test": "tap -t360 --no-cov -b test/*.js",
          "snap": "cross-env TAP_SNAPSHOT=1 npm test",
          "posttest": "npm run report",
          "clean": "rimraf ./.nyc_output ./node_modules/.cache ./.self_coverage ./test/fixtures/.nyc_output ./test/fixtures/node_modules/.cache ./self-coverage",
          "instrument": "node ./build-self-coverage.js",
          "report": "node ./bin/nyc report --temp-dir ./.self_coverage/ -r text -r lcov",
          "release": "standard-version"
        },
        "bin": {
          "nyc": "./bin/nyc.js"
        },
        "files": [
          "index.js",
          "bin/*.js",
          "lib/**/*.js"
        ],
        "nyc": {
          "exclude": [
            "node_modules",
            "coverage",
            "self-coverage",
            "test/fixtures/coverage.js",
            "test/build/*",
            "test/src/*",
            "test/nyc.js",
            "test/process-args.js",
            "test/fixtures/_generateCoverage.js"
          ]
        },
        "standard": {
          "ignore": [
            "**/fixtures/**",
            "**/test/build/*"
          ]
        },
        "keywords": [
          "coverage",
          "reporter",
          "subprocess",
          "testing"
        ],
        "contributors": [
          {
            "name": "Isaac Schlueter",
            "website": "https://github.com/isaacs"
          },
          {
            "name": "Mark Wubben",
            "website": "https://novemberborn.net"
          },
          {
            "name": "James Talmage",
            "website": "https://twitter.com/jamestalmage"
          },
          {
            "name": "Krishnan Anantheswaran",
            "website": "https://github.com/gotwarlost"
          }
        ],
        "author": "Ben Coe <ben@npmjs.com>",
        "license": "ISC",
        "dependencies": {
          "archy": "^1.0.0",
          "caching-transform": "^3.0.2",
          "convert-source-map": "^1.6.0",
          "cp-file": "^6.2.0",
          "find-cache-dir": "^2.1.0",
          "find-up": "^3.0.0",
          "foreground-child": "^1.5.6",
          "glob": "^7.1.3",
          "istanbul-lib-coverage": "^2.0.5",
          "istanbul-lib-hook": "^2.0.7",
          "istanbul-lib-instrument": "^3.3.0",
          "istanbul-lib-report": "^2.0.8",
          "istanbul-lib-source-maps": "^3.0.6",
          "istanbul-reports": "^2.2.4",
          "js-yaml": "^3.13.1",
          "make-dir": "^2.1.0",
          "merge-source-map": "^1.1.0",
          "resolve-from": "^4.0.0",
          "rimraf": "^2.6.3",
          "signal-exit": "^3.0.2",
          "spawn-wrap": "^1.4.2",
          "test-exclude": "^5.2.3",
          "uuid": "^3.3.2",
          "yargs": "^13.2.2",
          "yargs-parser": "^13.0.0"
        },
        "devDependencies": {
          "any-path": "^1.3.0",
          "chai": "^4.2.0",
          "coveralls": "^3.0.3",
          "cross-env": "^5.2.0",
          "is-windows": "^1.0.2",
          "lodash": "^4.17.11",
          "newline-regex": "^0.2.1",
          "pify": "^4.0.1",
          "requirejs": "^2.3.6",
          "sanitize-filename": "^1.6.1",
          "source-map-support": "^0.5.12",
          "standard": "^12.0.1",
          "standard-version": "^5.0.2",
          "strip-indent": "^2.0.0",
          "tap": "^12.6.5",
          "which": "^1.3.1",
          "zero-fill": "^2.2.3"
        },
        "engines": {
          "node": ">=6"
        },
        "repository": {
          "type": "git",
          "url": "git@github.com:istanbuljs/nyc.git"
        }
      })
    },
    "oauth-sign": {
      "package.json": JSON.stringify({
        "author": "Mikeal Rogers <mikeal.rogers@gmail.com> (http://www.futurealoof.com)",
        "name": "oauth-sign",
        "description": "OAuth 1 signing. Formerly a vendor lib in mikeal/request, now a standalone module.",
        "version": "0.9.0",
        "license": "Apache-2.0",
        "repository": {
          "url": "https://github.com/mikeal/oauth-sign"
        },
        "main": "index.js",
        "files": [
          "index.js"
        ],
        "dependencies": {},
        "devDependencies": {},
        "optionalDependencies": {},
        "engines": {
          "node": "*"
        },
        "scripts": {
          "test": "node test.js"
        }
      })
    },
    "object-assign": {
      "package.json": JSON.stringify({
        "name": "object-assign",
        "version": "4.1.1",
        "description": "ES2015 `Object.assign()` ponyfill",
        "license": "MIT",
        "repository": "sindresorhus/object-assign",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=0.10.0"
        },
        "scripts": {
          "test": "xo && ava",
          "bench": "matcha bench.js"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "object",
          "assign",
          "extend",
          "properties",
          "es2015",
          "ecmascript",
          "harmony",
          "ponyfill",
          "prollyfill",
          "polyfill",
          "shim",
          "browser"
        ],
        "devDependencies": {
          "ava": "^0.16.0",
          "lodash": "^4.16.4",
          "matcha": "^0.7.0",
          "xo": "^0.16.0"
        }
      })
    },
    "once": {
      "package.json": JSON.stringify({
        "name": "once",
        "version": "1.4.0",
        "description": "Run a function exactly one time",
        "main": "once.js",
        "directories": {
          "test": "test"
        },
        "dependencies": {
          "wrappy": "1"
        },
        "devDependencies": {
          "tap": "^7.0.1"
        },
        "scripts": {
          "test": "tap test/*.js"
        },
        "files": [
          "once.js"
        ],
        "repository": {
          "type": "git",
          "url": "git://github.com/isaacs/once"
        },
        "keywords": [
          "once",
          "function",
          "one",
          "single"
        ],
        "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me/)",
        "license": "ISC"
      })
    },
    "onetime": {
      "package.json": JSON.stringify({
        "name": "onetime",
        "version": "2.0.1",
        "description": "Ensure a function is only called once",
        "license": "MIT",
        "repository": "sindresorhus/onetime",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "once",
          "function",
          "one",
          "onetime",
          "func",
          "fn",
          "single",
          "call",
          "called",
          "prevent"
        ],
        "dependencies": {
          "mimic-fn": "^1.0.0"
        },
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        }
      })
    },
    "opener": {
      "package.json": JSON.stringify({
        "name": "opener",
        "description": "Opens stuff, like webpages and files and executables, cross-platform",
        "version": "1.5.1",
        "author": "Domenic Denicola <d@domenic.me> (https://domenic.me/)",
        "license": "(WTFPL OR MIT)",
        "repository": "domenic/opener",
        "main": "lib/opener.js",
        "bin": "bin/opener-bin.js",
        "files": [
          "lib/",
          "bin/"
        ],
        "scripts": {
          "lint": "eslint ."
        },
        "devDependencies": {
          "eslint": "^5.3.0"
        }
      })
    },
    "optimist": {
      "node_modules": {
        "minimist": {
          "package.json": JSON.stringify({
            "name": "minimist",
            "version": "0.0.10",
            "description": "parse argument options",
            "main": "index.js",
            "devDependencies": {
              "tape": "~1.0.4",
              "tap": "~0.4.0"
            },
            "scripts": {
              "test": "tap test/*.js"
            },
            "testling": {
              "files": "test/*.js",
              "browsers": [
                "ie/6..latest",
                "ff/5",
                "firefox/latest",
                "chrome/10",
                "chrome/latest",
                "safari/5.1",
                "safari/latest",
                "opera/12"
              ]
            },
            "repository": {
              "type": "git",
              "url": "git://github.com/substack/minimist.git"
            },
            "homepage": "https://github.com/substack/minimist",
            "keywords": [
              "argv",
              "getopt",
              "parser",
              "optimist"
            ],
            "author": {
              "name": "James Halliday",
              "email": "mail@substack.net",
              "url": "http://substack.net"
            },
            "license": "MIT"
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "optimist",
        "version": "0.6.1",
        "description": "Light-weight option parsing with an argv hash. No optstrings attached.",
        "main": "./index.js",
        "dependencies": {
          "wordwrap": "~0.0.2",
          "minimist": "~0.0.1"
        },
        "devDependencies": {
          "hashish": "~0.0.4",
          "tap": "~0.4.0"
        },
        "scripts": {
          "test": "tap ./test/*.js"
        },
        "repository": {
          "type": "git",
          "url": "http://github.com/substack/node-optimist.git"
        },
        "keywords": [
          "argument",
          "args",
          "option",
          "parser",
          "parsing",
          "cli",
          "command"
        ],
        "author": {
          "name": "James Halliday",
          "email": "mail@substack.net",
          "url": "http://substack.net"
        },
        "license": "MIT/X11",
        "engine": {
          "node": ">=0.4"
        }
      })
    },
    "os-homedir": {
      "package.json": JSON.stringify({
        "name": "os-homedir",
        "version": "1.0.2",
        "description": "Node.js 4 `os.homedir()` ponyfill",
        "license": "MIT",
        "repository": "sindresorhus/os-homedir",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=0.10.0"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "builtin",
          "core",
          "ponyfill",
          "polyfill",
          "shim",
          "os",
          "homedir",
          "home",
          "dir",
          "directory",
          "folder",
          "user",
          "path"
        ],
        "devDependencies": {
          "ava": "*",
          "path-exists": "^2.0.0",
          "xo": "^0.16.0"
        }
      })
    },
    "os-locale": {
      "package.json": JSON.stringify({
        "name": "os-locale",
        "version": "3.1.0",
        "description": "Get the system locale",
        "license": "MIT",
        "repository": "sindresorhus/os-locale",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=6"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "locale",
          "lang",
          "language",
          "system",
          "os",
          "string",
          "str",
          "user",
          "country",
          "id",
          "identifier",
          "region"
        ],
        "dependencies": {
          "execa": "^1.0.0",
          "lcid": "^2.0.0",
          "mem": "^4.0.0"
        },
        "devDependencies": {
          "ava": "^1.0.1",
          "import-fresh": "^3.0.0",
          "xo": "^0.23.0"
        }
      })
    },
    "os-tmpdir": {
      "package.json": JSON.stringify({
        "name": "os-tmpdir",
        "version": "1.0.2",
        "description": "Node.js os.tmpdir() ponyfill",
        "license": "MIT",
        "repository": "sindresorhus/os-tmpdir",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=0.10.0"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "built-in",
          "core",
          "ponyfill",
          "polyfill",
          "shim",
          "os",
          "tmpdir",
          "tempdir",
          "tmp",
          "temp",
          "dir",
          "directory",
          "env",
          "environment"
        ],
        "devDependencies": {
          "ava": "*",
          "xo": "^0.16.0"
        }
      })
    },
    "own-or": {
      "package.json": JSON.stringify({
        "name": "own-or",
        "version": "1.0.0",
        "description": "Either use the object's own property, or a fallback",
        "main": "own-or.js",
        "scripts": {
          "test": "node test.js"
        },
        "repository": {
          "type": "git",
          "url": "git+https://github.com/isaacs/own-or.git"
        },
        "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me/)",
        "license": "ISC",
        "bugs": {
          "url": "https://github.com/isaacs/own-or/issues"
        },
        "homepage": "https://github.com/isaacs/own-or#readme"
      })
    },
    "own-or-env": {
      "package.json": JSON.stringify({
        "name": "own-or-env",
        "version": "1.0.1",
        "description": "Use an objects own property, or an environment variable.  Optionally treat as a boolean if the env should be set to 1 or 0.",
        "main": "own-or-env.js",
        "scripts": {
          "test": "tap test.js --100",
          "preversion": "npm test",
          "postversion": "npm publish",
          "postpublish": "git push origin --all; git push origin --tags"
        },
        "repository": {
          "type": "git",
          "url": "git+https://github.com/isaacs/own-or-env.git"
        },
        "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me/)",
        "license": "ISC",
        "bugs": {
          "url": "https://github.com/isaacs/own-or-env/issues"
        },
        "homepage": "https://github.com/isaacs/own-or-env#readme",
        "dependencies": {
          "own-or": "^1.0.0"
        },
        "devDependencies": {
          "tap": "^11.1.0"
        }
      })
    },
    "p-defer": {
      "package.json": JSON.stringify({
        "name": "p-defer",
        "version": "1.0.0",
        "description": "Create a deferred promise",
        "license": "MIT",
        "repository": "sindresorhus/p-defer",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "promise",
          "defer",
          "deferred",
          "resolve",
          "reject",
          "lazy",
          "later",
          "async",
          "await",
          "promises",
          "bluebird"
        ],
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        },
        "xo": {
          "esnext": true
        }
      })
    },
    "p-finally": {
      "package.json": JSON.stringify({
        "name": "p-finally",
        "version": "1.0.0",
        "description": "`Promise#finally()` ponyfill - Invoked when the promise is settled regardless of outcome",
        "license": "MIT",
        "repository": "sindresorhus/p-finally",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "promise",
          "finally",
          "handler",
          "function",
          "async",
          "await",
          "promises",
          "settled",
          "ponyfill",
          "polyfill",
          "shim",
          "bluebird"
        ],
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        },
        "xo": {
          "esnext": true
        }
      })
    },
    "p-is-promise": {
      "package.json": JSON.stringify({
        "name": "p-is-promise",
        "version": "2.1.0",
        "description": "Check if something is a promise",
        "license": "MIT",
        "repository": "sindresorhus/p-is-promise",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=6"
        },
        "scripts": {
          "test": "xo && ava && tsd"
        },
        "files": [
          "index.js",
          "index.d.ts"
        ],
        "keywords": [
          "promise",
          "is",
          "detect",
          "check",
          "kind",
          "type",
          "thenable",
          "es2015",
          "async",
          "await",
          "promises",
          "bluebird"
        ],
        "devDependencies": {
          "ava": "^1.4.1",
          "bluebird": "^3.5.4",
          "tsd": "^0.7.2",
          "xo": "^0.24.0"
        }
      })
    },
    "p-limit": {
      "package.json": JSON.stringify({
        "name": "p-limit",
        "version": "2.2.0",
        "description": "Run multiple promise-returning & async functions with limited concurrency",
        "license": "MIT",
        "repository": "sindresorhus/p-limit",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=6"
        },
        "scripts": {
          "test": "xo && ava && tsd-check"
        },
        "files": [
          "index.js",
          "index.d.ts"
        ],
        "keywords": [
          "promise",
          "limit",
          "limited",
          "concurrency",
          "throttle",
          "throat",
          "rate",
          "batch",
          "ratelimit",
          "task",
          "queue",
          "async",
          "await",
          "promises",
          "bluebird"
        ],
        "dependencies": {
          "p-try": "^2.0.0"
        },
        "devDependencies": {
          "ava": "^1.2.1",
          "delay": "^4.1.0",
          "in-range": "^1.0.0",
          "random-int": "^1.0.0",
          "time-span": "^2.0.0",
          "tsd-check": "^0.3.0",
          "xo": "^0.24.0"
        }
      })
    },
    "p-locate": {
      "package.json": JSON.stringify({
        "name": "p-locate",
        "version": "3.0.0",
        "description": "Get the first fulfilled promise that satisfies the provided testing function",
        "license": "MIT",
        "repository": "sindresorhus/p-locate",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=6"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "promise",
          "locate",
          "find",
          "finder",
          "search",
          "searcher",
          "test",
          "array",
          "collection",
          "iterable",
          "iterator",
          "race",
          "fulfilled",
          "fastest",
          "async",
          "await",
          "promises",
          "bluebird"
        ],
        "dependencies": {
          "p-limit": "^2.0.0"
        },
        "devDependencies": {
          "ava": "*",
          "delay": "^3.0.0",
          "in-range": "^1.0.0",
          "time-span": "^2.0.0",
          "xo": "*"
        }
      })
    },
    "p-try": {
      "package.json": JSON.stringify({
        "name": "p-try",
        "version": "2.2.0",
        "description": "`Start a promise chain",
        "license": "MIT",
        "repository": "sindresorhus/p-try",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=6"
        },
        "scripts": {
          "test": "xo && ava && tsd"
        },
        "files": [
          "index.js",
          "index.d.ts"
        ],
        "keywords": [
          "promise",
          "try",
          "resolve",
          "function",
          "catch",
          "async",
          "await",
          "promises",
          "settled",
          "ponyfill",
          "polyfill",
          "shim",
          "bluebird"
        ],
        "devDependencies": {
          "ava": "^1.4.1",
          "tsd": "^0.7.1",
          "xo": "^0.24.0"
        }
      })
    },
    "package-hash": {
      "package.json": JSON.stringify({
        "name": "package-hash",
        "version": "3.0.0",
        "description": "Generates a hash for an installed npm package, useful for salting caches",
        "main": "index.js",
        "files": [
          "index.js"
        ],
        "engines": {
          "node": ">=6"
        },
        "scripts": {
          "lint": "as-i-preach",
          "unpack-fixtures": "node scripts/unpack-fixtures.js",
          "pregenerate-fixture-index": "npm run unpack-fixtures",
          "generate-fixture-index": "node scripts/generate-fixture-index.js",
          "pretest": "npm run unpack-fixtures",
          "test": "ava",
          "posttest": "npm run lint",
          "coverage": "nyc npm test",
          "watch:test": "npm run test -- --watch"
        },
        "repository": {
          "type": "git",
          "url": "git+https://github.com/novemberborn/package-hash.git"
        },
        "author": "Mark Wubben (https://novemberborn.net/)",
        "license": "ISC",
        "bugs": {
          "url": "https://github.com/novemberborn/package-hash/issues"
        },
        "homepage": "https://github.com/novemberborn/package-hash#readme",
        "dependencies": {
          "graceful-fs": "^4.1.15",
          "hasha": "^3.0.0",
          "lodash.flattendeep": "^4.4.0",
          "release-zalgo": "^1.0.0"
        },
        "devDependencies": {
          "@novemberborn/as-i-preach": "^11.0.0",
          "ava": "^1.1.0",
          "codecov": "^3.1.0",
          "nyc": "^13.1.0",
          "rimraf": "^2.6.3",
          "tar": "^4.4.8"
        },
        "nyc": {
          "cache": true,
          "exclude": [
            "scripts",
            "test"
          ],
          "reporter": [
            "html",
            "lcov",
            "text"
          ]
        },
        "standard-engine": "@novemberborn/as-i-preach"
      })
    },
    "parse-json": {
      "package.json": JSON.stringify({
        "name": "parse-json",
        "version": "4.0.0",
        "description": "Parse JSON with more helpful errors",
        "license": "MIT",
        "repository": "sindresorhus/parse-json",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && nyc ava"
        },
        "files": [
          "index.js",
          "vendor"
        ],
        "keywords": [
          "parse",
          "json",
          "graceful",
          "error",
          "message",
          "humanize",
          "friendly",
          "helpful",
          "string",
          "str"
        ],
        "dependencies": {
          "error-ex": "^1.3.1",
          "json-parse-better-errors": "^1.0.1"
        },
        "devDependencies": {
          "ava": "*",
          "nyc": "^11.2.1",
          "xo": "*"
        }
      })
    },
    "path-exists": {
      "package.json": JSON.stringify({
        "name": "path-exists",
        "version": "3.0.0",
        "description": "Check if a path exists",
        "license": "MIT",
        "repository": "sindresorhus/path-exists",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "path",
          "exists",
          "exist",
          "file",
          "filepath",
          "fs",
          "filesystem",
          "file-system",
          "access",
          "stat"
        ],
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        },
        "xo": {
          "esnext": true
        }
      })
    },
    "path-is-absolute": {
      "package.json": JSON.stringify({
        "name": "path-is-absolute",
        "version": "1.0.1",
        "description": "Node.js 0.12 path.isAbsolute() ponyfill",
        "license": "MIT",
        "repository": "sindresorhus/path-is-absolute",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=0.10.0"
        },
        "scripts": {
          "test": "xo && node test.js"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "path",
          "paths",
          "file",
          "dir",
          "absolute",
          "isabsolute",
          "is-absolute",
          "built-in",
          "util",
          "utils",
          "core",
          "ponyfill",
          "polyfill",
          "shim",
          "is",
          "detect",
          "check"
        ],
        "devDependencies": {
          "xo": "^0.16.0"
        }
      })
    },
    "path-key": {
      "package.json": JSON.stringify({
        "name": "path-key",
        "version": "2.0.1",
        "description": "Get the PATH environment variable key cross-platform",
        "license": "MIT",
        "repository": "sindresorhus/path-key",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "path",
          "key",
          "environment",
          "env",
          "variable",
          "var",
          "get",
          "cross-platform",
          "windows"
        ],
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        },
        "xo": {
          "esnext": true
        }
      })
    },
    "path-parse": {
      "package.json": JSON.stringify({
        "name": "path-parse",
        "version": "1.0.6",
        "description": "Node.js path.parse() ponyfill",
        "main": "index.js",
        "scripts": {
          "test": "node test.js"
        },
        "repository": {
          "type": "git",
          "url": "https://github.com/jbgutierrez/path-parse.git"
        },
        "keywords": [
          "path",
          "paths",
          "file",
          "dir",
          "parse",
          "built-in",
          "util",
          "utils",
          "core",
          "ponyfill",
          "polyfill",
          "shim"
        ],
        "author": "Javier Blanco <http://jbgutierrez.info>",
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/jbgutierrez/path-parse/issues"
        },
        "homepage": "https://github.com/jbgutierrez/path-parse#readme"
      })
    },
    "path-type": {
      "package.json": JSON.stringify({
        "name": "path-type",
        "version": "3.0.0",
        "description": "Check if a path is a file, directory, or symlink",
        "license": "MIT",
        "repository": "sindresorhus/path-type",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "path",
          "fs",
          "type",
          "is",
          "check",
          "directory",
          "dir",
          "file",
          "filepath",
          "symlink",
          "symbolic",
          "link",
          "stat",
          "stats",
          "filesystem"
        ],
        "dependencies": {
          "pify": "^3.0.0"
        },
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        }
      })
    },
    "performance-now": {
      "package.json": JSON.stringify({
        "name": "performance-now",
        "description": "Implements performance.now (based on process.hrtime).",
        "keywords": [],
        "version": "2.1.0",
        "author": "Braveg1rl <braveg1rl@outlook.com>",
        "license": "MIT",
        "homepage": "https://github.com/braveg1rl/performance-now",
        "bugs": "https://github.com/braveg1rl/performance-now/issues",
        "repository": {
          "type": "git",
          "url": "git://github.com/braveg1rl/performance-now.git"
        },
        "private": false,
        "dependencies": {},
        "devDependencies": {
          "bluebird": "^3.4.7",
          "call-delayed": "^1.0.0",
          "chai": "^3.5.0",
          "chai-increasing": "^1.2.0",
          "coffee-script": "~1.12.2",
          "mocha": "~3.2.0",
          "pre-commit": "^1.2.2"
        },
        "optionalDependencies": {},
        "main": "lib/performance-now.js",
        "scripts": {
          "build": "mkdir -p lib && rm -rf lib/* && node_modules/.bin/coffee --compile -m --output lib/ src/",
          "prepublish": "npm test",
          "pretest": "npm run build",
          "test": "node_modules/.bin/mocha",
          "watch": "node_modules/.bin/coffee --watch --compile --output lib/ src/"
        },
        "typings": "src/index.d.ts"
      })
    },
    "picomatch": {
      "package.json": JSON.stringify({
        "name": "picomatch",
        "description": "Blazing fast and accurate glob matcher written in JavaScript, with no dependencies and full support for standard and extended Bash glob features, including braces, extglobs, POSIX brackets, and regular expressions.",
        "version": "2.0.7",
        "homepage": "https://github.com/micromatch/picomatch",
        "author": "Jon Schlinkert (https://github.com/jonschlinkert)",
        "repository": "micromatch/picomatch",
        "bugs": {
          "url": "https://github.com/micromatch/picomatch/issues"
        },
        "license": "MIT",
        "files": [
          "index.js",
          "lib"
        ],
        "main": "index.js",
        "engines": {
          "node": ">=8"
        },
        "scripts": {
          "test": "mocha",
          "cover": "nyc --reporter=text --reporter=html mocha"
        },
        "devDependencies": {
          "fill-range": "^7.0.1",
          "gulp-format-md": "^2.0.0",
          "mocha": "^6.0.2",
          "nyc": "^13.3.0",
          "time-require": "github:jonschlinkert/time-require"
        },
        "keywords": [
          "glob",
          "match",
          "picomatch"
        ],
        "verb": {
          "toc": false,
          "layout": false,
          "tasks": [
            "readme"
          ],
          "plugins": [
            "gulp-format-md"
          ],
          "lint": {
            "reflinks": true
          },
          "related": {
            "list": [
              "micromatch",
              "braces"
            ]
          },
          "reflinks": [
            "braces",
            "expand-brackets",
            "extglob",
            "fill-range",
            "micromatch",
            "minimatch",
            "nanomatch",
            "picomatch"
          ]
        }
      })
    },
    "pify": {
      "package.json": JSON.stringify({
        "name": "pify",
        "version": "3.0.0",
        "description": "Promisify a callback-style function",
        "license": "MIT",
        "repository": "sindresorhus/pify",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && ava && npm run optimization-test",
          "optimization-test": "node --allow-natives-syntax optimization-test.js"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "promise",
          "promises",
          "promisify",
          "all",
          "denodify",
          "denodeify",
          "callback",
          "cb",
          "node",
          "then",
          "thenify",
          "convert",
          "transform",
          "wrap",
          "wrapper",
          "bind",
          "to",
          "async",
          "await",
          "es2015",
          "bluebird"
        ],
        "devDependencies": {
          "ava": "*",
          "pinkie-promise": "^2.0.0",
          "v8-natives": "^1.0.0",
          "xo": "*"
        }
      })
    },
    "pirates": {
      "package.json": JSON.stringify({
        "version": "3.0.2",
        "name": "pirates",
        "description": "Properly hijack require",
        "main": "lib/index.js",
        "scripts": {
          "clean": "rimraf lib",
          "build": "babel src -d lib",
          "test": "yarn run lint && cross-env BABEL_ENV=test yarn run build && nyc ava",
          "lint": "eslint .",
          "prepublish": "yarn run clean && yarn run build"
        },
        "files": [
          "lib"
        ],
        "repository": {
          "type": "git",
          "url": "https://github.com/ariporad/pirates.git"
        },
        "engines": {
          "node": ">= 4"
        },
        "author": {
          "name": "Ari Porad",
          "email": "ari@ariporad.com",
          "url": "http://ariporad.com"
        },
        "dependencies": {
          "node-modules-regexp": "^1.0.0"
        },
        "devDependencies": {
          "ava": "^0.23.0",
          "babel-cli": "^6.24.0",
          "babel-eslint": "^8.0.2",
          "babel-plugin-istanbul": "^4.1.1",
          "babel-preset-env": "^1.3.2",
          "cross-env": "^5.0.5",
          "cz-conventional-changelog": "^2.0.0",
          "decache": "^4.1.0",
          "eslint": "^4.6.0",
          "eslint-config-airbnb-base": "^12.0.0",
          "eslint-plugin-import": "^2.2.0",
          "mock-require": "^2.0.2",
          "nyc": "^11.1.0",
          "rewire": "^2.5.1",
          "rimraf": "^2.6.1",
          "semantic-release": "^9.0.0"
        },
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/ariporad/pirates/issues"
        },
        "homepage": "https://github.com/ariporad/pirates#readme",
        "config": {
          "commitizen": {
            "path": "cz-conventional-changelog"
          }
        },
        "ava": {
          "files": [
            "test/*.js"
          ],
          "source": [
            "lib/**/*.js"
          ]
        },
        "nyc": {
          "include": [
            "src/*.js"
          ],
          "reporter": [
            "json",
            "text"
          ],
          "sourceMap": false,
          "instrument": false
        }
      })
    },
    "pkg-dir": {
      "package.json": JSON.stringify({
        "name": "pkg-dir",
        "version": "3.0.0",
        "description": "Find the root directory of a Node.js project or npm package",
        "license": "MIT",
        "repository": "sindresorhus/pkg-dir",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=6"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "package",
          "json",
          "root",
          "npm",
          "entry",
          "find",
          "up",
          "find-up",
          "findup",
          "look-up",
          "look",
          "file",
          "search",
          "match",
          "resolve",
          "parent",
          "parents",
          "folder",
          "directory",
          "dir",
          "walk",
          "walking",
          "path"
        ],
        "dependencies": {
          "find-up": "^3.0.0"
        },
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        }
      })
    },
    "private": {
      "package.json": JSON.stringify({
        "author": {
          "name": "Ben Newman",
          "email": "bn@cs.stanford.edu"
        },
        "name": "private",
        "description": "Utility for associating truly private state with any JavaScript object",
        "keywords": [
          "private",
          "access control",
          "access modifiers",
          "encapsulation",
          "secret",
          "state",
          "privilege",
          "scope",
          "es5"
        ],
        "version": "0.1.8",
        "homepage": "http://github.com/benjamn/private",
        "repository": {
          "type": "git",
          "url": "git://github.com/benjamn/private.git"
        },
        "license": "MIT",
        "main": "private.js",
        "files": [
          "private.js"
        ],
        "scripts": {
          "test": "mocha --reporter spec --full-trace test/run.js"
        },
        "engines": {
          "node": ">= 0.6"
        },
        "devDependencies": {
          "mocha": "^4.0.1"
        }
      })
    },
    "process-nextick-args": {
      "package.json": JSON.stringify({
        "name": "process-nextick-args",
        "version": "2.0.1",
        "description": "process.nextTick but always with args",
        "main": "index.js",
        "files": [
          "index.js"
        ],
        "scripts": {
          "test": "node test.js"
        },
        "repository": {
          "type": "git",
          "url": "https://github.com/calvinmetcalf/process-nextick-args.git"
        },
        "author": "",
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/calvinmetcalf/process-nextick-args/issues"
        },
        "homepage": "https://github.com/calvinmetcalf/process-nextick-args",
        "devDependencies": {
          "tap": "~0.2.6"
        }
      })
    },
    "prop-types": {
      "package.json": JSON.stringify({
        "name": "prop-types",
        "version": "15.7.2",
        "description": "Runtime type checking for React props and similar objects.",
        "main": "index.js",
        "license": "MIT",
        "files": [
          "LICENSE",
          "README.md",
          "checkPropTypes.js",
          "factory.js",
          "factoryWithThrowingShims.js",
          "factoryWithTypeCheckers.js",
          "index.js",
          "prop-types.js",
          "prop-types.min.js",
          "lib"
        ],
        "repository": "facebook/prop-types",
        "keywords": [
          "react"
        ],
        "bugs": {
          "url": "https://github.com/facebook/prop-types/issues"
        },
        "homepage": "https://facebook.github.io/react/",
        "dependencies": {
          "loose-envify": "^1.4.0",
          "object-assign": "^4.1.1",
          "react-is": "^16.8.1"
        },
        "scripts": {
          "pretest": "npm run lint",
          "lint": "eslint .",
          "test": "npm run tests-only",
          "tests-only": "jest",
          "umd": "NODE_ENV=development browserify index.js -t loose-envify --standalone PropTypes -o prop-types.js",
          "umd-min": "NODE_ENV=production browserify index.js -t loose-envify -t uglifyify --standalone PropTypes  -p bundle-collapser/plugin -o | uglifyjs --compress unused,dead_code -o prop-types.min.js",
          "build": "yarn umd && yarn umd-min",
          "prepublish": "yarn build"
        },
        "devDependencies": {
          "babel-jest": "^19.0.0",
          "babel-preset-react": "^6.24.1",
          "browserify": "^16.2.3",
          "bundle-collapser": "^1.2.1",
          "eslint": "^5.13.0",
          "jest": "^19.0.2",
          "react": "^15.5.1",
          "uglifyify": "^3.0.4",
          "uglifyjs": "^2.4.10"
        },
        "browserify": {
          "transform": [
            "loose-envify"
          ]
        }
      })
    },
    "pseudomap": {
      "package.json": JSON.stringify({
        "name": "pseudomap",
        "version": "1.0.2",
        "description": "A thing that is a lot like ES6 `Map`, but without iterators, for use in environments where `for..of` syntax and `Map` are not available.",
        "main": "map.js",
        "directories": {
          "test": "test"
        },
        "devDependencies": {
          "tap": "^2.3.1"
        },
        "scripts": {
          "test": "tap test/*.js"
        },
        "repository": {
          "type": "git",
          "url": "git+https://github.com/isaacs/pseudomap.git"
        },
        "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me/)",
        "license": "ISC",
        "bugs": {
          "url": "https://github.com/isaacs/pseudomap/issues"
        },
        "homepage": "https://github.com/isaacs/pseudomap#readme"
      })
    },
    "psl": {
      "package.json": JSON.stringify({
        "name": "psl",
        "version": "1.2.0",
        "description": "Domain name parser based on the Public Suffix List",
        "repository": {
          "type": "git",
          "url": "git@github.com:lupomontero/psl.git"
        },
        "main": "index.js",
        "scripts": {
          "pretest": "eslint .",
          "test": "mocha test && karma start ./karma.conf.js --single-run",
          "watch": "mocha test --watch",
          "prebuild": "./scripts/update-rules.js",
          "build": "browserify ./index.js --standalone=psl > ./dist/psl.js",
          "postbuild": "cat ./dist/psl.js | uglifyjs -c -m > ./dist/psl.min.js",
          "commit-and-pr": "commit-and-pr",
          "changelog": "git log $(git describe --tags --abbrev=0)..HEAD --oneline --format=\"%h %s (%an <%ae>)\""
        },
        "keywords": [
          "publicsuffix",
          "publicsuffixlist"
        ],
        "author": "Lupo Montero <lupomontero@gmail.com> (https://lupomontero.com/)",
        "license": "MIT",
        "devDependencies": {
          "JSONStream": "^1.3.5",
          "browserify": "^16.2.3",
          "commit-and-pr": "^1.0.3",
          "eslint": "^6.0.1",
          "eslint-config-hapi": "^12.0.0",
          "eslint-plugin-hapi": "^4.1.0",
          "karma": "^4.1.0",
          "karma-browserify": "^6.0.0",
          "karma-mocha": "^1.3.0",
          "karma-mocha-reporter": "^2.2.5",
          "karma-phantomjs-launcher": "^1.0.4",
          "mocha": "^6.1.4",
          "phantomjs-prebuilt": "^2.1.16",
          "request": "^2.88.0",
          "uglify-js": "^3.6.0",
          "watchify": "^3.11.1"
        }
      })
    },
    "pump": {
      "package.json": JSON.stringify({
        "name": "pump",
        "version": "3.0.0",
        "repository": "git://github.com/mafintosh/pump.git",
        "license": "MIT",
        "description": "pipe streams together and close all of them if one of them closes",
        "browser": {
          "fs": false
        },
        "keywords": [
          "streams",
          "pipe",
          "destroy",
          "callback"
        ],
        "author": "Mathias Buus Madsen <mathiasbuus@gmail.com>",
        "dependencies": {
          "end-of-stream": "^1.1.0",
          "once": "^1.3.1"
        },
        "scripts": {
          "test": "node test-browser.js && node test-node.js"
        }
      })
    },
    "punycode": {
      "package.json": JSON.stringify({
        "name": "punycode",
        "version": "1.4.1",
        "description": "A robust Punycode converter that fully complies to RFC 3492 and RFC 5891, and works on nearly all JavaScript platforms.",
        "homepage": "https://mths.be/punycode",
        "main": "punycode.js",
        "keywords": [
          "punycode",
          "unicode",
          "idn",
          "idna",
          "dns",
          "url",
          "domain"
        ],
        "license": "MIT",
        "author": {
          "name": "Mathias Bynens",
          "url": "https://mathiasbynens.be/"
        },
        "contributors": [
          {
            "name": "Mathias Bynens",
            "url": "https://mathiasbynens.be/"
          },
          {
            "name": "John-David Dalton",
            "url": "http://allyoucanleet.com/"
          }
        ],
        "repository": {
          "type": "git",
          "url": "https://github.com/bestiejs/punycode.js.git"
        },
        "bugs": "https://github.com/bestiejs/punycode.js/issues",
        "files": [
          "LICENSE-MIT.txt",
          "punycode.js"
        ],
        "scripts": {
          "test": "node tests/tests.js"
        },
        "devDependencies": {
          "coveralls": "^2.11.4",
          "grunt": "^0.4.5",
          "grunt-contrib-uglify": "^0.11.0",
          "grunt-shell": "^1.1.2",
          "istanbul": "^0.4.1",
          "qunit-extras": "^1.4.4",
          "qunitjs": "~1.11.0",
          "requirejs": "^2.1.22"
        },
        "jspm": {
          "map": {
            "./punycode.js": {
              "node": "@node/punycode"
            }
          }
        }
      })
    },
    "qs": {
      "package.json": JSON.stringify({
        "name": "qs",
        "description": "A querystring parser that supports nesting and arrays, with a depth limit",
        "homepage": "https://github.com/ljharb/qs",
        "version": "6.5.2",
        "repository": {
          "type": "git",
          "url": "https://github.com/ljharb/qs.git"
        },
        "main": "lib/index.js",
        "contributors": [
          {
            "name": "Jordan Harband",
            "email": "ljharb@gmail.com",
            "url": "http://ljharb.codes"
          }
        ],
        "keywords": [
          "querystring",
          "qs"
        ],
        "engines": {
          "node": ">=0.6"
        },
        "dependencies": {},
        "devDependencies": {
          "@ljharb/eslint-config": "^12.2.1",
          "browserify": "^16.2.0",
          "covert": "^1.1.0",
          "editorconfig-tools": "^0.1.1",
          "eslint": "^4.19.1",
          "evalmd": "^0.0.17",
          "iconv-lite": "^0.4.21",
          "mkdirp": "^0.5.1",
          "qs-iconv": "^1.0.4",
          "safe-publish-latest": "^1.1.1",
          "safer-buffer": "^2.1.2",
          "tape": "^4.9.0"
        },
        "scripts": {
          "prepublish": "safe-publish-latest && npm run dist",
          "pretest": "npm run --silent readme && npm run --silent lint",
          "test": "npm run --silent coverage",
          "tests-only": "node test",
          "readme": "evalmd README.md",
          "prelint": "editorconfig-tools check * lib/* test/*",
          "lint": "eslint lib/*.js test/*.js",
          "coverage": "covert test",
          "dist": "mkdirp dist && browserify --standalone Qs lib/index.js > dist/qs.js"
        },
        "license": "BSD-3-Clause"
      })
    },
    "react": {
      "package.json": JSON.stringify({
        "name": "react",
        "description": "React is a JavaScript library for building user interfaces.",
        "keywords": [
          "react"
        ],
        "version": "16.12.0",
        "homepage": "https://reactjs.org/",
        "bugs": "https://github.com/facebook/react/issues",
        "license": "MIT",
        "files": [
          "LICENSE",
          "README.md",
          "build-info.json",
          "index.js",
          "cjs/",
          "umd/"
        ],
        "main": "index.js",
        "repository": {
          "type": "git",
          "url": "https://github.com/facebook/react.git",
          "directory": "packages/react"
        },
        "engines": {
          "node": ">=0.10.0"
        },
        "dependencies": {
          "loose-envify": "^1.1.0",
          "object-assign": "^4.1.1",
          "prop-types": "^15.6.2"
        },
        "browserify": {
          "transform": [
            "loose-envify"
          ]
        }
      })
    },
    "react-is": {
      "package.json": JSON.stringify({
        "name": "react-is",
        "version": "16.8.6",
        "description": "Brand checking of React Elements.",
        "main": "index.js",
        "repository": {
          "type": "git",
          "url": "https://github.com/facebook/react.git",
          "directory": "packages/react-is"
        },
        "keywords": [
          "react"
        ],
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/facebook/react/issues"
        },
        "homepage": "https://reactjs.org/",
        "files": [
          "LICENSE",
          "README.md",
          "build-info.json",
          "index.js",
          "cjs/",
          "umd/"
        ]
      })
    },
    "react-reconciler": {
      "package.json": JSON.stringify({
        "name": "react-reconciler",
        "description": "React package for creating custom renderers.",
        "version": "0.20.4",
        "keywords": [
          "react"
        ],
        "homepage": "https://reactjs.org/",
        "bugs": "https://github.com/facebook/react/issues",
        "license": "MIT",
        "files": [
          "LICENSE",
          "README.md",
          "build-info.json",
          "index.js",
          "persistent.js",
          "reflection.js",
          "cjs/"
        ],
        "main": "index.js",
        "repository": {
          "type": "git",
          "url": "https://github.com/facebook/react.git",
          "directory": "packages/react-reconciler"
        },
        "engines": {
          "node": ">=0.10.0"
        },
        "peerDependencies": {
          "react": "^16.0.0"
        },
        "dependencies": {
          "loose-envify": "^1.1.0",
          "object-assign": "^4.1.1",
          "prop-types": "^15.6.2",
          "scheduler": "^0.13.6"
        },
        "browserify": {
          "transform": [
            "loose-envify"
          ]
        }
      })
    },
    "read-pkg": {
      "package.json": JSON.stringify({
        "name": "read-pkg",
        "version": "3.0.0",
        "description": "Read a package.json file",
        "license": "MIT",
        "repository": "sindresorhus/read-pkg",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "json",
          "read",
          "parse",
          "file",
          "fs",
          "graceful",
          "load",
          "pkg",
          "package",
          "normalize"
        ],
        "dependencies": {
          "load-json-file": "^4.0.0",
          "normalize-package-data": "^2.3.2",
          "path-type": "^3.0.0"
        },
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        }
      })
    },
    "read-pkg-up": {
      "package.json": JSON.stringify({
        "name": "read-pkg-up",
        "version": "4.0.0",
        "description": "Read the closest package.json file",
        "license": "MIT",
        "repository": "sindresorhus/read-pkg-up",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=6"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "json",
          "read",
          "parse",
          "file",
          "fs",
          "graceful",
          "load",
          "pkg",
          "package",
          "find",
          "up",
          "find-up",
          "findup",
          "look-up",
          "look",
          "search",
          "match",
          "resolve",
          "parent",
          "parents",
          "folder",
          "directory",
          "dir",
          "walk",
          "walking",
          "path"
        ],
        "dependencies": {
          "find-up": "^3.0.0",
          "read-pkg": "^3.0.0"
        },
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        }
      })
    },
    "readable-stream": {
      "package.json": JSON.stringify({
        "name": "readable-stream",
        "version": "2.3.6",
        "description": "Streams3, a user-land copy of the stream library from Node.js",
        "main": "readable.js",
        "dependencies": {
          "core-util-is": "~1.0.0",
          "inherits": "~2.0.3",
          "isarray": "~1.0.0",
          "process-nextick-args": "~2.0.0",
          "safe-buffer": "~5.1.1",
          "string_decoder": "~1.1.1",
          "util-deprecate": "~1.0.1"
        },
        "devDependencies": {
          "assert": "^1.4.0",
          "babel-polyfill": "^6.9.1",
          "buffer": "^4.9.0",
          "lolex": "^2.3.2",
          "nyc": "^6.4.0",
          "tap": "^0.7.0",
          "tape": "^4.8.0"
        },
        "scripts": {
          "test": "tap test/parallel/*.js test/ours/*.js && node test/verify-dependencies.js",
          "ci": "tap test/parallel/*.js test/ours/*.js --tap | tee test.tap && node test/verify-dependencies.js",
          "cover": "nyc npm test",
          "report": "nyc report --reporter=lcov"
        },
        "repository": {
          "type": "git",
          "url": "git://github.com/nodejs/readable-stream"
        },
        "keywords": [
          "readable",
          "stream",
          "pipe"
        ],
        "browser": {
          "util": false,
          "./readable.js": "./readable-browser.js",
          "./writable.js": "./writable-browser.js",
          "./duplex.js": "./duplex-browser.js",
          "./lib/internal/streams/stream.js": "./lib/internal/streams/stream-browser.js"
        },
        "nyc": {
          "include": [
            "lib/**.js"
          ]
        },
        "license": "MIT"
      })
    },
    "readdirp": {
      "package.json": JSON.stringify({
        "name": "readdirp",
        "description": "Recursive version of fs.readdir with streaming api.",
        "version": "3.2.0",
        "homepage": "https://github.com/paulmillr/readdirp",
        "repository": {
          "type": "git",
          "url": "git://github.com/paulmillr/readdirp.git"
        },
        "author": "Thorsten Lorenz <thlorenz@gmx.de> (thlorenz.com)",
        "contributors": [
          "Thorsten Lorenz <thlorenz@gmx.de> (thlorenz.com)",
          "Paul Miller (https://paulmillr.com)"
        ],
        "engines": {
          "node": ">= 8"
        },
        "files": [
          "index.js",
          "index.d.ts"
        ],
        "keywords": [
          "recursive",
          "fs",
          "stream",
          "streams",
          "readdir",
          "filesystem",
          "find",
          "filter"
        ],
        "scripts": {
          "test": "nyc mocha && dtslint"
        },
        "dependencies": {
          "picomatch": "^2.0.4"
        },
        "devDependencies": {
          "@types/chai": "^4.1",
          "@types/mocha": "^5.2",
          "@types/node": "^12",
          "chai": "^4.2",
          "chai-subset": "^1.6",
          "dtslint": "^0.9.8",
          "mocha": "~6.1.3",
          "nyc": "^14.1.1",
          "rimraf": "^2.6.3"
        },
        "license": "MIT"
      })
    },
    "redeyed": {
      "package.json": JSON.stringify({
        "name": "redeyed",
        "version": "2.1.1",
        "description": "Takes JavaScript code, along with a config and returns the original code with tokens wrapped as configured.",
        "author": "Thorsten Lorenz <thlorenz@gmx.de> (thlorenz.com)",
        "main": "redeyed.js",
        "scripts": {
          "test": "npm run run-test && npm run lint",
          "run-test": "tape test/*.js",
          "lint": "standart",
          "demo-log": "node examples/replace-log",
          "demo": "cd examples/browser; open index.html"
        },
        "repository": {
          "type": "git",
          "url": "git://github.com/thlorenz/redeyed.git"
        },
        "keywords": [
          "ast",
          "syntax",
          "tree",
          "source",
          "wrap",
          "metadata"
        ],
        "license": "MIT",
        "devDependencies": {
          "cardinal": "~1.0.0",
          "readdirp": "~2.1.0",
          "standart": "^6.1.0",
          "tape": "~4.9.0"
        },
        "dependencies": {
          "esprima": "~4.0.0"
        }
      })
    },
    "regenerator-runtime": {
      "package.json": JSON.stringify({
        "name": "regenerator-runtime",
        "author": "Ben Newman <bn@cs.stanford.edu>",
        "description": "Runtime for Regenerator-compiled generator and async functions.",
        "version": "0.13.2",
        "main": "runtime.js",
        "keywords": [
          "regenerator",
          "runtime",
          "generator",
          "async"
        ],
        "sideEffects": true,
        "repository": {
          "type": "git",
          "url": "https://github.com/facebook/regenerator/tree/master/packages/regenerator-runtime"
        },
        "license": "MIT"
      })
    },
    "release-zalgo": {
      "package.json": JSON.stringify({
        "name": "release-zalgo",
        "version": "1.0.0",
        "description": "Helps you write code with promise-like chains that can run both synchronously and asynchronously",
        "main": "index.js",
        "files": [
          "index.js",
          "lib"
        ],
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "lint": "as-i-preach",
          "test": "ava",
          "posttest": "as-i-preach",
          "coverage": "nyc npm test"
        },
        "repository": {
          "type": "git",
          "url": "git+https://github.com/novemberborn/release-zalgo.git"
        },
        "keywords": [
          "babel"
        ],
        "author": "Mark Wubben (https://novemberborn.net/)",
        "license": "ISC",
        "bugs": {
          "url": "https://github.com/novemberborn/release-zalgo/issues"
        },
        "homepage": "https://github.com/novemberborn/release-zalgo#readme",
        "dependencies": {
          "es6-error": "^4.0.1"
        },
        "devDependencies": {
          "@novemberborn/as-i-preach": "^7.0.0",
          "ava": "^0.18.0",
          "coveralls": "^2.11.15",
          "nyc": "^10.1.2"
        },
        "nyc": {
          "reporter": [
            "html",
            "lcov",
            "text"
          ]
        },
        "standard-engine": "@novemberborn/as-i-preach"
      })
    },
    "repeating": {
      "package.json": JSON.stringify({
        "name": "repeating",
        "version": "2.0.1",
        "description": "Repeat a string - fast",
        "license": "MIT",
        "repository": "sindresorhus/repeating",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=0.10.0"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "repeat",
          "string",
          "repeating",
          "str",
          "text",
          "fill",
          "pad"
        ],
        "dependencies": {
          "is-finite": "^1.0.0"
        },
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        }
      })
    },
    "request": {
      "node_modules": {
        "safe-buffer": {
          "package.json": JSON.stringify({
            "name": "safe-buffer",
            "description": "Safer Node.js Buffer API",
            "version": "5.2.0",
            "author": {
              "name": "Feross Aboukhadijeh",
              "email": "feross@feross.org",
              "url": "http://feross.org"
            },
            "bugs": {
              "url": "https://github.com/feross/safe-buffer/issues"
            },
            "devDependencies": {
              "standard": "*",
              "tape": "^4.0.0"
            },
            "homepage": "https://github.com/feross/safe-buffer",
            "keywords": [
              "buffer",
              "buffer allocate",
              "node security",
              "safe",
              "safe-buffer",
              "security",
              "uninitialized"
            ],
            "license": "MIT",
            "main": "index.js",
            "types": "index.d.ts",
            "repository": {
              "type": "git",
              "url": "git://github.com/feross/safe-buffer.git"
            },
            "scripts": {
              "test": "standard && tape test/*.js"
            }
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "request",
        "description": "Simplified HTTP request client.",
        "keywords": [
          "http",
          "simple",
          "util",
          "utility"
        ],
        "version": "2.88.0",
        "author": "Mikeal Rogers <mikeal.rogers@gmail.com>",
        "repository": {
          "type": "git",
          "url": "https://github.com/request/request.git"
        },
        "bugs": {
          "url": "http://github.com/request/request/issues"
        },
        "license": "Apache-2.0",
        "engines": {
          "node": ">= 4"
        },
        "main": "index.js",
        "files": [
          "lib/",
          "index.js",
          "request.js"
        ],
        "dependencies": {
          "aws-sign2": "~0.7.0",
          "aws4": "^1.8.0",
          "caseless": "~0.12.0",
          "combined-stream": "~1.0.6",
          "extend": "~3.0.2",
          "forever-agent": "~0.6.1",
          "form-data": "~2.3.2",
          "har-validator": "~5.1.0",
          "http-signature": "~1.2.0",
          "is-typedarray": "~1.0.0",
          "isstream": "~0.1.2",
          "json-stringify-safe": "~5.0.1",
          "mime-types": "~2.1.19",
          "oauth-sign": "~0.9.0",
          "performance-now": "^2.1.0",
          "qs": "~6.5.2",
          "safe-buffer": "^5.1.2",
          "tough-cookie": "~2.4.3",
          "tunnel-agent": "^0.6.0",
          "uuid": "^3.3.2"
        },
        "scripts": {
          "test": "npm run lint && npm run test-ci && npm run test-browser",
          "test-ci": "taper tests/test-*.js",
          "test-cov": "istanbul cover tape tests/test-*.js",
          "test-browser": "node tests/browser/start.js",
          "lint": "standard"
        },
        "devDependencies": {
          "bluebird": "^3.2.1",
          "browserify": "^13.0.1",
          "browserify-istanbul": "^2.0.0",
          "buffer-equal": "^1.0.0",
          "codecov": "^3.0.4",
          "coveralls": "^3.0.2",
          "function-bind": "^1.0.2",
          "istanbul": "^0.4.0",
          "karma": "^3.0.0",
          "karma-browserify": "^5.0.1",
          "karma-cli": "^1.0.0",
          "karma-coverage": "^1.0.0",
          "karma-phantomjs-launcher": "^1.0.0",
          "karma-tap": "^3.0.1",
          "phantomjs-prebuilt": "^2.1.3",
          "rimraf": "^2.2.8",
          "server-destroy": "^1.0.1",
          "standard": "^9.0.0",
          "tape": "^4.6.0",
          "taper": "^0.5.0"
        },
        "greenkeeper": {
          "ignore": [
            "hawk",
            "har-validator"
          ]
        }
      })
    },
    "require-directory": {
      "package.json": JSON.stringify({
        "author": "Troy Goode <troygoode@gmail.com> (http://github.com/troygoode/)",
        "name": "require-directory",
        "version": "2.1.1",
        "description": "Recursively iterates over specified directory, require()'ing each file, and returning a nested hash structure containing those modules.",
        "keywords": [
          "require",
          "directory",
          "library",
          "recursive"
        ],
        "homepage": "https://github.com/troygoode/node-require-directory/",
        "main": "index.js",
        "repository": {
          "type": "git",
          "url": "git://github.com/troygoode/node-require-directory.git"
        },
        "contributors": [
          {
            "name": "Troy Goode",
            "email": "troygoode@gmail.com",
            "web": "http://github.com/troygoode/"
          }
        ],
        "license": "MIT",
        "bugs": {
          "url": "http://github.com/troygoode/node-require-directory/issues/"
        },
        "engines": {
          "node": ">=0.10.0"
        },
        "devDependencies": {
          "jshint": "^2.6.0",
          "mocha": "^2.1.0"
        },
        "scripts": {
          "test": "mocha",
          "lint": "jshint index.js test/test.js"
        }
      })
    },
    "require-main-filename": {
      "package.json": JSON.stringify({
        "name": "require-main-filename",
        "version": "2.0.0",
        "description": "shim for require.main.filename() that works in as many environments as possible",
        "main": "index.js",
        "scripts": {
          "pretest": "standard",
          "test": "tap --coverage test.js",
          "release": "standard-version"
        },
        "repository": {
          "type": "git",
          "url": "git+ssh://git@github.com/yargs/require-main-filename.git"
        },
        "keywords": [
          "require",
          "shim",
          "iisnode"
        ],
        "files": [
          "index.js"
        ],
        "author": "Ben Coe <ben@npmjs.com>",
        "license": "ISC",
        "bugs": {
          "url": "https://github.com/yargs/require-main-filename/issues"
        },
        "homepage": "https://github.com/yargs/require-main-filename#readme",
        "devDependencies": {
          "chai": "^4.0.0",
          "standard": "^10.0.3",
          "standard-version": "^4.0.0",
          "tap": "^11.0.0"
        }
      })
    },
    "resolve": {
      "package.json": JSON.stringify({
        "name": "resolve",
        "description": "resolve like require.resolve() on behalf of files asynchronously and synchronously",
        "version": "1.11.1",
        "repository": {
          "type": "git",
          "url": "git://github.com/browserify/resolve.git"
        },
        "main": "index.js",
        "keywords": [
          "resolve",
          "require",
          "node",
          "module"
        ],
        "scripts": {
          "prepublish": "safe-publish-latest",
          "lint": "eslint .",
          "tests-only": "tape test/*.js",
          "pretest": "npm run lint",
          "test": "npm run --silent tests-only",
          "posttest": "npm run test:multirepo",
          "test:multirepo": "cd ./test/resolver/multirepo && npm install && npm test"
        },
        "devDependencies": {
          "@ljharb/eslint-config": "^13.1.1",
          "eslint": "^5.16.0",
          "object-keys": "^1.1.1",
          "safe-publish-latest": "^1.1.2",
          "tap": "0.4.13",
          "tape": "^4.10.1"
        },
        "license": "MIT",
        "author": {
          "name": "James Halliday",
          "email": "mail@substack.net",
          "url": "http://substack.net"
        },
        "dependencies": {
          "path-parse": "^1.0.6"
        }
      }),
      "test": {
        "module_dir": {
          "zmodules": {
            "bbb": {
              "package.json": JSON.stringify({
                "main": "main.js"
              })
            }
          }
        },
        "resolver": {
          "baz": {
            "package.json": JSON.stringify({
              "main": "quux.js"
            })
          },
          "browser_field": {
            "package.json": JSON.stringify({
              "name": "browser_field",
              "main": "a",
              "browser": "b"
            })
          },
          "dot_main": {
            "package.json": JSON.stringify({
              "main": "."
            })
          },
          "dot_slash_main": {
            "package.json": JSON.stringify({
              "main": "./"
            })
          },
          "incorrect_main": {
            "package.json": JSON.stringify({
              "main": "wrong.js"
            })
          },
          "invalid_main": {
            "package.json": JSON.stringify({
              "name": "invalid main",
              "main": [
                "why is this a thing",
                "srsly omg wtf"
              ]
            })
          },
          "multirepo": {
            "package.json": JSON.stringify({
              "name": "monorepo-symlink-test",
              "private": true,
              "version": "0.0.0",
              "description": "",
              "main": "index.js",
              "scripts": {
                "postinstall": "lerna bootstrap",
                "test": "node packages/package-a"
              },
              "author": "",
              "license": "MIT",
              "dependencies": {
                "jquery": "^3.3.1",
                "resolve": "../../../"
              },
              "devDependencies": {
                "lerna": "^3.4.3"
              }
            }),
            "packages": {
              "package-a": {
                "package.json": JSON.stringify({
                  "name": "@my-scope/package-a",
                  "version": "0.0.0",
                  "private": true,
                  "description": "",
                  "license": "MIT",
                  "main": "index.js",
                  "scripts": {
                    "test": "echo \"Error: run tests from root\" && exit 1"
                  },
                  "dependencies": {
                    "@my-scope/package-b": "^0.0.0"
                  }
                })
              },
              "package-b": {
                "package.json": JSON.stringify({
                  "name": "@my-scope/package-b",
                  "private": true,
                  "version": "0.0.0",
                  "description": "",
                  "license": "MIT",
                  "main": "index.js",
                  "scripts": {
                    "test": "echo \"Error: run tests from root\" && exit 1"
                  },
                  "dependencies": {
                    "@my-scope/package-a": "^0.0.0"
                  }
                })
              }
            }
          }
        }
      }
    },
    "resolve-from": {
      "package.json": JSON.stringify({
        "name": "resolve-from",
        "version": "3.0.0",
        "description": "Resolve the path of a module like `require.resolve()` but from a given path",
        "license": "MIT",
        "repository": "sindresorhus/resolve-from",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "require",
          "resolve",
          "path",
          "module",
          "from",
          "like",
          "import",
          "path"
        ],
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        }
      })
    },
    "restore-cursor": {
      "package.json": JSON.stringify({
        "name": "restore-cursor",
        "version": "2.0.0",
        "description": "Gracefully restore the CLI cursor on exit",
        "license": "MIT",
        "repository": "sindresorhus/restore-cursor",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=4"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "exit",
          "quit",
          "process",
          "graceful",
          "shutdown",
          "sigterm",
          "sigint",
          "terminate",
          "kill",
          "stop",
          "cli",
          "cursor",
          "ansi",
          "show",
          "term",
          "terminal",
          "console",
          "tty",
          "shell",
          "command-line"
        ],
        "dependencies": {
          "onetime": "^2.0.0",
          "signal-exit": "^3.0.2"
        }
      })
    },
    "rimraf": {
      "package.json": JSON.stringify({
        "name": "rimraf",
        "version": "2.7.1",
        "main": "rimraf.js",
        "description": "A deep deletion module for node (like `rm -rf`)",
        "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me/)",
        "license": "ISC",
        "repository": "git://github.com/isaacs/rimraf.git",
        "scripts": {
          "preversion": "npm test",
          "postversion": "npm publish",
          "postpublish": "git push origin --all; git push origin --tags",
          "test": "tap test/*.js"
        },
        "bin": "./bin.js",
        "dependencies": {
          "glob": "^7.1.3"
        },
        "files": [
          "LICENSE",
          "README.md",
          "bin.js",
          "rimraf.js"
        ],
        "devDependencies": {
          "mkdirp": "^0.5.1",
          "tap": "^12.1.1"
        }
      })
    },
    "safe-buffer": {
      "package.json": JSON.stringify({
        "name": "safe-buffer",
        "description": "Safer Node.js Buffer API",
        "version": "5.1.2",
        "author": {
          "name": "Feross Aboukhadijeh",
          "email": "feross@feross.org",
          "url": "http://feross.org"
        },
        "bugs": {
          "url": "https://github.com/feross/safe-buffer/issues"
        },
        "devDependencies": {
          "standard": "*",
          "tape": "^4.0.0"
        },
        "homepage": "https://github.com/feross/safe-buffer",
        "keywords": [
          "buffer",
          "buffer allocate",
          "node security",
          "safe",
          "safe-buffer",
          "security",
          "uninitialized"
        ],
        "license": "MIT",
        "main": "index.js",
        "types": "index.d.ts",
        "repository": {
          "type": "git",
          "url": "git://github.com/feross/safe-buffer.git"
        },
        "scripts": {
          "test": "standard && tape test/*.js"
        }
      })
    },
    "safer-buffer": {
      "package.json": JSON.stringify({
        "name": "safer-buffer",
        "version": "2.1.2",
        "description": "Modern Buffer API polyfill without footguns",
        "main": "safer.js",
        "scripts": {
          "browserify-test": "browserify --external tape tests.js > browserify-tests.js && tape browserify-tests.js",
          "test": "standard && tape tests.js"
        },
        "author": {
          "name": "Nikita Skovoroda",
          "email": "chalkerx@gmail.com",
          "url": "https://github.com/ChALkeR"
        },
        "license": "MIT",
        "repository": {
          "type": "git",
          "url": "git+https://github.com/ChALkeR/safer-buffer.git"
        },
        "bugs": {
          "url": "https://github.com/ChALkeR/safer-buffer/issues"
        },
        "devDependencies": {
          "standard": "^11.0.1",
          "tape": "^4.9.0"
        },
        "files": [
          "Porting-Buffer.md",
          "Readme.md",
          "tests.js",
          "dangerous.js",
          "safer.js"
        ]
      })
    },
    "scheduler": {
      "package.json": JSON.stringify({
        "name": "scheduler",
        "version": "0.13.6",
        "description": "Cooperative scheduler for the browser environment.",
        "main": "index.js",
        "repository": {
          "type": "git",
          "url": "https://github.com/facebook/react.git",
          "directory": "packages/scheduler"
        },
        "license": "MIT",
        "keywords": [
          "react"
        ],
        "bugs": {
          "url": "https://github.com/facebook/react/issues"
        },
        "homepage": "https://reactjs.org/",
        "dependencies": {
          "loose-envify": "^1.1.0",
          "object-assign": "^4.1.1"
        },
        "files": [
          "LICENSE",
          "README.md",
          "build-info.json",
          "index.js",
          "tracing.js",
          "tracing-profiling.js",
          "cjs/",
          "umd/"
        ],
        "browserify": {
          "transform": [
            "loose-envify"
          ]
        }
      })
    },
    "semver": {
      "package.json": JSON.stringify({
        "name": "semver",
        "version": "5.7.0",
        "description": "The semantic version parser used by npm.",
        "main": "semver.js",
        "scripts": {
          "test": "tap",
          "preversion": "npm test",
          "postversion": "npm publish",
          "postpublish": "git push origin --all; git push origin --tags"
        },
        "devDependencies": {
          "tap": "^13.0.0-rc.18"
        },
        "license": "ISC",
        "repository": "https://github.com/npm/node-semver",
        "bin": {
          "semver": "./bin/semver"
        },
        "files": [
          "bin",
          "range.bnf",
          "semver.js"
        ],
        "tap": {
          "check-coverage": true
        }
      })
    },
    "set-blocking": {
      "package.json": JSON.stringify({
        "name": "set-blocking",
        "version": "2.0.0",
        "description": "set blocking stdio and stderr ensuring that terminal output does not truncate",
        "main": "index.js",
        "scripts": {
          "pretest": "standard",
          "test": "nyc mocha ./test/*.js",
          "coverage": "nyc report --reporter=text-lcov | coveralls",
          "version": "standard-version"
        },
        "repository": {
          "type": "git",
          "url": "git+https://github.com/yargs/set-blocking.git"
        },
        "keywords": [
          "flush",
          "terminal",
          "blocking",
          "shim",
          "stdio",
          "stderr"
        ],
        "author": "Ben Coe <ben@npmjs.com>",
        "license": "ISC",
        "bugs": {
          "url": "https://github.com/yargs/set-blocking/issues"
        },
        "homepage": "https://github.com/yargs/set-blocking#readme",
        "devDependencies": {
          "chai": "^3.5.0",
          "coveralls": "^2.11.9",
          "mocha": "^2.4.5",
          "nyc": "^6.4.4",
          "standard": "^7.0.1",
          "standard-version": "^2.2.1"
        },
        "files": [
          "index.js",
          "LICENSE.txt"
        ]
      })
    },
    "shebang-command": {
      "package.json": JSON.stringify({
        "name": "shebang-command",
        "version": "1.2.0",
        "description": "Get the command from a shebang",
        "license": "MIT",
        "repository": "kevva/shebang-command",
        "author": {
          "name": "Kevin Martensson",
          "email": "kevinmartensson@gmail.com",
          "url": "github.com/kevva"
        },
        "engines": {
          "node": ">=0.10.0"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "cmd",
          "command",
          "parse",
          "shebang"
        ],
        "dependencies": {
          "shebang-regex": "^1.0.0"
        },
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        },
        "xo": {
          "ignores": [
            "test.js"
          ]
        }
      })
    },
    "shebang-regex": {
      "package.json": JSON.stringify({
        "name": "shebang-regex",
        "version": "1.0.0",
        "description": "Regular expression for matching a shebang",
        "license": "MIT",
        "repository": "sindresorhus/shebang-regex",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=0.10.0"
        },
        "scripts": {
          "test": "node test.js"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "re",
          "regex",
          "regexp",
          "shebang",
          "match",
          "test"
        ],
        "devDependencies": {
          "ava": "0.0.4"
        }
      })
    },
    "signal-exit": {
      "package.json": JSON.stringify({
        "name": "signal-exit",
        "version": "3.0.2",
        "description": "when you want to fire an event no matter how a process exits.",
        "main": "index.js",
        "scripts": {
          "pretest": "standard",
          "test": "tap --timeout=240 ./test/*.js --cov",
          "coverage": "nyc report --reporter=text-lcov | coveralls",
          "release": "standard-version"
        },
        "files": [
          "index.js",
          "signals.js"
        ],
        "repository": {
          "type": "git",
          "url": "https://github.com/tapjs/signal-exit.git"
        },
        "keywords": [
          "signal",
          "exit"
        ],
        "author": "Ben Coe <ben@npmjs.com>",
        "license": "ISC",
        "bugs": {
          "url": "https://github.com/tapjs/signal-exit/issues"
        },
        "homepage": "https://github.com/tapjs/signal-exit",
        "devDependencies": {
          "chai": "^3.5.0",
          "coveralls": "^2.11.10",
          "nyc": "^8.1.0",
          "standard": "^7.1.2",
          "standard-version": "^2.3.0",
          "tap": "^8.0.1"
        }
      })
    },
    "slash": {
      "package.json": JSON.stringify({
        "name": "slash",
        "version": "1.0.0",
        "description": "Convert Windows backslash paths to slash paths",
        "keywords": [
          "path",
          "seperator",
          "sep",
          "slash",
          "backslash",
          "windows",
          "win"
        ],
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "http://sindresorhus.com"
        },
        "repository": "sindresorhus/slash",
        "scripts": {
          "test": "mocha"
        },
        "devDependencies": {
          "mocha": "*"
        },
        "engines": {
          "node": ">=0.10.0"
        },
        "license": "MIT",
        "files": [
          "index.js"
        ]
      })
    },
    "slice-ansi": {
      "package.json": JSON.stringify({
        "name": "slice-ansi",
        "version": "1.0.0",
        "description": "Slice a string with ANSI escape codes",
        "license": "MIT",
        "repository": "chalk/slice-ansi",
        "author": {
          "name": "David Caccavella",
          "email": "threedeecee@gmail.com"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "slice",
          "string",
          "ansi",
          "styles",
          "color",
          "colour",
          "colors",
          "terminal",
          "console",
          "cli",
          "tty",
          "escape",
          "formatting",
          "rgb",
          "256",
          "shell",
          "xterm",
          "log",
          "logging",
          "command-line",
          "text"
        ],
        "dependencies": {
          "is-fullwidth-code-point": "^2.0.0"
        },
        "devDependencies": {
          "ava": "*",
          "chalk": "^2.0.1",
          "random-item": "^1.0.0",
          "strip-ansi": "^4.0.0",
          "xo": "*"
        }
      })
    },
    "source-map": {
      "package.json": JSON.stringify({
        "name": "source-map",
        "description": "Generates and consumes source maps",
        "version": "0.6.1",
        "homepage": "https://github.com/mozilla/source-map",
        "author": "Nick Fitzgerald <nfitzgerald@mozilla.com>",
        "contributors": [
          "Tobias Koppers <tobias.koppers@googlemail.com>",
          "Duncan Beevers <duncan@dweebd.com>",
          "Stephen Crane <scrane@mozilla.com>",
          "Ryan Seddon <seddon.ryan@gmail.com>",
          "Miles Elam <miles.elam@deem.com>",
          "Mihai Bazon <mihai.bazon@gmail.com>",
          "Michael Ficarra <github.public.email@michael.ficarra.me>",
          "Todd Wolfson <todd@twolfson.com>",
          "Alexander Solovyov <alexander@solovyov.net>",
          "Felix Gnass <fgnass@gmail.com>",
          "Conrad Irwin <conrad.irwin@gmail.com>",
          "usrbincc <usrbincc@yahoo.com>",
          "David Glasser <glasser@davidglasser.net>",
          "Chase Douglas <chase@newrelic.com>",
          "Evan Wallace <evan.exe@gmail.com>",
          "Heather Arthur <fayearthur@gmail.com>",
          "Hugh Kennedy <hughskennedy@gmail.com>",
          "David Glasser <glasser@davidglasser.net>",
          "Simon Lydell <simon.lydell@gmail.com>",
          "Jmeas Smith <jellyes2@gmail.com>",
          "Michael Z Goddard <mzgoddard@gmail.com>",
          "azu <azu@users.noreply.github.com>",
          "John Gozde <john@gozde.ca>",
          "Adam Kirkton <akirkton@truefitinnovation.com>",
          "Chris Montgomery <christopher.montgomery@dowjones.com>",
          "J. Ryan Stinnett <jryans@gmail.com>",
          "Jack Herrington <jherrington@walmartlabs.com>",
          "Chris Truter <jeffpalentine@gmail.com>",
          "Daniel Espeset <daniel@danielespeset.com>",
          "Jamie Wong <jamie.lf.wong@gmail.com>",
          "Eddy Bruël <ejpbruel@mozilla.com>",
          "Hawken Rives <hawkrives@gmail.com>",
          "Gilad Peleg <giladp007@gmail.com>",
          "djchie <djchie.dev@gmail.com>",
          "Gary Ye <garysye@gmail.com>",
          "Nicolas Lalevée <nicolas.lalevee@hibnet.org>"
        ],
        "repository": {
          "type": "git",
          "url": "http://github.com/mozilla/source-map.git"
        },
        "main": "./source-map.js",
        "files": [
          "source-map.js",
          "source-map.d.ts",
          "lib/",
          "dist/source-map.debug.js",
          "dist/source-map.js",
          "dist/source-map.min.js",
          "dist/source-map.min.js.map"
        ],
        "engines": {
          "node": ">=0.10.0"
        },
        "license": "BSD-3-Clause",
        "scripts": {
          "test": "npm run build && node test/run-tests.js",
          "build": "webpack --color",
          "toc": "doctoc --title '## Table of Contents' README.md && doctoc --title '## Table of Contents' CONTRIBUTING.md"
        },
        "devDependencies": {
          "doctoc": "^0.15.0",
          "webpack": "^1.12.0"
        },
        "typings": "source-map"
      })
    },
    "source-map-support": {
      "package.json": JSON.stringify({
        "name": "source-map-support",
        "description": "Fixes stack traces for files with source maps",
        "version": "0.5.16",
        "main": "./source-map-support.js",
        "scripts": {
          "build": "node build.js",
          "serve-tests": "http-server -p 1336",
          "prepublish": "npm run build",
          "test": "mocha"
        },
        "dependencies": {
          "buffer-from": "^1.0.0",
          "source-map": "^0.6.0"
        },
        "devDependencies": {
          "browserify": "^4.2.3",
          "coffeescript": "^1.12.7",
          "http-server": "^0.11.1",
          "mocha": "^3.5.3",
          "webpack": "^1.15.0"
        },
        "repository": {
          "type": "git",
          "url": "https://github.com/evanw/node-source-map-support"
        },
        "bugs": {
          "url": "https://github.com/evanw/node-source-map-support/issues"
        },
        "license": "MIT"
      })
    },
    "spawn-wrap": {
      "node_modules": {
        "rimraf": {
          "package.json": JSON.stringify({
            "name": "rimraf",
            "version": "2.6.3",
            "main": "rimraf.js",
            "description": "A deep deletion module for node (like `rm -rf`)",
            "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me/)",
            "license": "ISC",
            "repository": "git://github.com/isaacs/rimraf.git",
            "scripts": {
              "preversion": "npm test",
              "postversion": "npm publish",
              "postpublish": "git push origin --all; git push origin --tags",
              "test": "tap test/*.js"
            },
            "bin": "./bin.js",
            "dependencies": {
              "glob": "^7.1.3"
            },
            "files": [
              "LICENSE",
              "README.md",
              "bin.js",
              "rimraf.js"
            ],
            "devDependencies": {
              "mkdirp": "^0.5.1",
              "tap": "^12.1.1"
            }
          })
        },
        "which": {
          "package.json": JSON.stringify({
            "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me)",
            "name": "which",
            "description": "Like which(1) unix command. Find the first instance of an executable in the PATH.",
            "version": "1.3.1",
            "repository": {
              "type": "git",
              "url": "git://github.com/isaacs/node-which.git"
            },
            "main": "which.js",
            "bin": "./bin/which",
            "license": "ISC",
            "dependencies": {
              "isexe": "^2.0.0"
            },
            "devDependencies": {
              "mkdirp": "^0.5.0",
              "rimraf": "^2.6.2",
              "tap": "^12.0.1"
            },
            "scripts": {
              "test": "tap test/*.js --cov",
              "changelog": "bash gen-changelog.sh",
              "postversion": "npm run changelog && git add CHANGELOG.md && git commit -m 'update changelog - '${npm_package_version}"
            },
            "files": [
              "which.js",
              "bin/which"
            ]
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "spawn-wrap",
        "version": "1.4.2",
        "description": "Wrap all spawned Node.js child processes by adding environs and arguments ahead of the main JavaScript file argument.",
        "main": "index.js",
        "dependencies": {
          "foreground-child": "^1.5.6",
          "mkdirp": "^0.5.0",
          "os-homedir": "^1.0.1",
          "rimraf": "^2.6.2",
          "signal-exit": "^3.0.2",
          "which": "^1.3.0"
        },
        "scripts": {
          "test": "tap --timeout=240 test/*.js",
          "preversion": "npm test",
          "postversion": "npm publish",
          "postpublish": "git push origin --all; git push origin --tags",
          "clean": "rm -rf ~/.node-spawn-wrap-*"
        },
        "repository": {
          "type": "git",
          "url": "git+https://github.com/isaacs/spawn-wrap.git"
        },
        "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me/)",
        "license": "ISC",
        "bugs": {
          "url": "https://github.com/isaacs/spawn-wrap/issues"
        },
        "homepage": "https://github.com/isaacs/spawn-wrap#readme",
        "devDependencies": {
          "tap": "^10.7.3"
        },
        "files": [
          "index.js",
          "shim.js",
          "lib/is-windows.js"
        ]
      })
    },
    "spdx-correct": {
      "package.json": JSON.stringify({
        "name": "spdx-correct",
        "description": "correct invalid SPDX expressions",
        "version": "3.1.0",
        "author": "Kyle E. Mitchell <kyle@kemitchell.com> (https://kemitchell.com)",
        "contributors": [
          "Kyle E. Mitchell <kyle@kemitchell.com> (https://kemitchell.com)",
          "Christian Zommerfelds <aero_super@yahoo.com>",
          "Tal Einat <taleinat@gmail.com>",
          "Dan Butvinik <butvinik@outlook.com>"
        ],
        "dependencies": {
          "spdx-expression-parse": "^3.0.0",
          "spdx-license-ids": "^3.0.0"
        },
        "devDependencies": {
          "defence-cli": "^2.0.1",
          "replace-require-self": "^1.0.0",
          "standard": "^11.0.0",
          "standard-markdown": "^4.0.2",
          "tape": "^4.9.0"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "SPDX",
          "law",
          "legal",
          "license",
          "metadata"
        ],
        "license": "Apache-2.0",
        "repository": "jslicense/spdx-correct.js",
        "scripts": {
          "lint": "standard && standard-markdown README.md",
          "test": "defence README.md | replace-require-self | node && node test.js"
        }
      })
    },
    "spdx-exceptions": {
      "package.json": JSON.stringify({
        "name": "spdx-exceptions",
        "description": "list of SPDX standard license exceptions",
        "version": "2.2.0",
        "author": "The Linux Foundation",
        "contributors": [
          "Kyle E. Mitchell <kyle@kemitchell.com> (https://kemitchell.com/)"
        ],
        "license": "CC-BY-3.0",
        "repository": "kemitchell/spdx-exceptions.json"
      })
    },
    "spdx-expression-parse": {
      "package.json": JSON.stringify({
        "name": "spdx-expression-parse",
        "description": "parse SPDX license expressions",
        "version": "3.0.0",
        "author": "Kyle E. Mitchell <kyle@kemitchell.com> (http://kemitchell.com)",
        "files": [
          "AUTHORS",
          "index.js",
          "parse.js",
          "scan.js"
        ],
        "dependencies": {
          "spdx-exceptions": "^2.1.0",
          "spdx-license-ids": "^3.0.0"
        },
        "devDependencies": {
          "defence-cli": "^2.0.1",
          "mocha": "^3.4.2",
          "replace-require-self": "^1.0.0",
          "standard": "^10.0.2"
        },
        "keywords": [
          "SPDX",
          "law",
          "legal",
          "license",
          "metadata",
          "package",
          "package.json",
          "standards"
        ],
        "license": "MIT",
        "repository": "jslicense/spdx-expression-parse.js",
        "scripts": {
          "lint": "standard",
          "test:readme": "defence -i javascript README.md | replace-require-self | node",
          "test:mocha": "mocha test/index.js",
          "test": "npm run test:mocha && npm run test:readme"
        }
      })
    },
    "spdx-license-ids": {
      "package.json": JSON.stringify({
        "name": "spdx-license-ids",
        "version": "3.0.4",
        "description": "A list of SPDX license identifiers",
        "repository": "shinnn/spdx-license-ids",
        "author": "Shinnosuke Watanabe (https://github.com/shinnn)",
        "license": "CC0-1.0",
        "scripts": {
          "build": "node build.js",
          "pretest": "eslint .",
          "test": "node test.js"
        },
        "files": [
          "deprecated.json",
          "index.json"
        ],
        "keywords": [
          "spdx",
          "license",
          "licenses",
          "id",
          "identifier",
          "identifiers",
          "json",
          "array",
          "oss"
        ],
        "devDependencies": {
          "@shinnn/eslint-config": "^6.8.7",
          "chalk": "^2.4.1",
          "eslint": "^5.10.0",
          "get-spdx-license-ids": "^2.1.0",
          "rmfr": "^2.0.0",
          "tape": "^4.9.1"
        },
        "eslintConfig": {
          "extends": "@shinnn"
        }
      })
    },
    "sprintf-js": {
      "package.json": JSON.stringify({
        "name": "sprintf-js",
        "version": "1.0.3",
        "description": "JavaScript sprintf implementation",
        "author": "Alexandru Marasteanu <hello@alexei.ro> (http://alexei.ro/)",
        "main": "src/sprintf.js",
        "scripts": {
          "test": "mocha test/test.js"
        },
        "repository": {
          "type": "git",
          "url": "https://github.com/alexei/sprintf.js.git"
        },
        "license": "BSD-3-Clause",
        "readmeFilename": "README.md",
        "devDependencies": {
          "mocha": "*",
          "grunt": "*",
          "grunt-contrib-watch": "*",
          "grunt-contrib-uglify": "*"
        }
      })
    },
    "sshpk": {
      "package.json": JSON.stringify({
        "name": "sshpk",
        "version": "1.16.1",
        "description": "A library for finding and using SSH public keys",
        "main": "lib/index.js",
        "scripts": {
          "test": "tape test/*.js"
        },
        "repository": {
          "type": "git",
          "url": "git+https://github.com/joyent/node-sshpk.git"
        },
        "author": "Joyent, Inc",
        "contributors": [
          {
            "name": "Dave Eddy",
            "email": "dave@daveeddy.com"
          },
          {
            "name": "Mark Cavage",
            "email": "mcavage@gmail.com"
          },
          {
            "name": "Alex Wilson",
            "email": "alex@cooperi.net"
          }
        ],
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/arekinath/node-sshpk/issues"
        },
        "engines": {
          "node": ">=0.10.0"
        },
        "directories": {
          "bin": "./bin",
          "lib": "./lib",
          "man": "./man/man1"
        },
        "homepage": "https://github.com/arekinath/node-sshpk#readme",
        "dependencies": {
          "asn1": "~0.2.3",
          "assert-plus": "^1.0.0",
          "dashdash": "^1.12.0",
          "getpass": "^0.1.1",
          "safer-buffer": "^2.0.2",
          "jsbn": "~0.1.0",
          "tweetnacl": "~0.14.0",
          "ecc-jsbn": "~0.1.1",
          "bcrypt-pbkdf": "^1.0.0"
        },
        "optionalDependencies": {},
        "devDependencies": {
          "tape": "^3.5.0",
          "benchmark": "^1.0.0",
          "sinon": "^1.17.2",
          "temp": "^0.8.2"
        }
      })
    },
    "stack-utils": {
      "package.json": JSON.stringify({
        "name": "stack-utils",
        "version": "1.0.2",
        "description": "Captures and cleans stack traces",
        "license": "MIT",
        "repository": "tapjs/stack-utils",
        "author": {
          "name": "James Talmage",
          "email": "james@talmage.io",
          "url": "github.com/jamestalmage"
        },
        "engines": {
          "node": ">=0.10.0"
        },
        "scripts": {
          "test": "tap test/*.js --100 -J",
          "preversion": "npm test",
          "postversion": "npm publish",
          "postpublish": "git push origin --all; git push origin --tags"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          ""
        ],
        "dependencies": {},
        "devDependencies": {
          "bluebird": "^3.1.1",
          "coveralls": "^2.11.6",
          "flatten": "0.0.1",
          "nested-error-stacks": "^2.0.0",
          "pify": "^2.3.0",
          "q": "^1.4.1",
          "tap": "^10.3.2"
        }
      })
    },
    "string-length": {
      "node_modules": {
        "ansi-regex": {
          "package.json": JSON.stringify({
            "name": "ansi-regex",
            "version": "3.0.0",
            "description": "Regular expression for matching ANSI escape codes",
            "license": "MIT",
            "repository": "chalk/ansi-regex",
            "author": {
              "name": "Sindre Sorhus",
              "email": "sindresorhus@gmail.com",
              "url": "sindresorhus.com"
            },
            "engines": {
              "node": ">=4"
            },
            "scripts": {
              "test": "xo && ava",
              "view-supported": "node fixtures/view-codes.js"
            },
            "files": [
              "index.js"
            ],
            "keywords": [
              "ansi",
              "styles",
              "color",
              "colour",
              "colors",
              "terminal",
              "console",
              "cli",
              "string",
              "tty",
              "escape",
              "formatting",
              "rgb",
              "256",
              "shell",
              "xterm",
              "command-line",
              "text",
              "regex",
              "regexp",
              "re",
              "match",
              "test",
              "find",
              "pattern"
            ],
            "devDependencies": {
              "ava": "*",
              "xo": "*"
            }
          })
        },
        "strip-ansi": {
          "package.json": JSON.stringify({
            "name": "strip-ansi",
            "version": "4.0.0",
            "description": "Strip ANSI escape codes",
            "license": "MIT",
            "repository": "chalk/strip-ansi",
            "author": {
              "name": "Sindre Sorhus",
              "email": "sindresorhus@gmail.com",
              "url": "sindresorhus.com"
            },
            "engines": {
              "node": ">=4"
            },
            "scripts": {
              "test": "xo && ava"
            },
            "files": [
              "index.js"
            ],
            "keywords": [
              "strip",
              "trim",
              "remove",
              "ansi",
              "styles",
              "color",
              "colour",
              "colors",
              "terminal",
              "console",
              "string",
              "tty",
              "escape",
              "formatting",
              "rgb",
              "256",
              "shell",
              "xterm",
              "log",
              "logging",
              "command-line",
              "text"
            ],
            "dependencies": {
              "ansi-regex": "^3.0.0"
            },
            "devDependencies": {
              "ava": "*",
              "xo": "*"
            }
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "string-length",
        "version": "2.0.0",
        "description": "Get the real length of a string - by correctly counting astral symbols and ignoring ansi escape codes",
        "license": "MIT",
        "repository": "sindresorhus/string-length",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "unicode",
          "string",
          "length",
          "size",
          "count",
          "astral",
          "symbol",
          "surrogates",
          "codepoints",
          "ansi",
          "escape",
          "codes"
        ],
        "dependencies": {
          "astral-regex": "^1.0.0",
          "strip-ansi": "^4.0.0"
        },
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        }
      })
    },
    "string-width": {
      "node_modules": {
        "ansi-regex": {
          "package.json": JSON.stringify({
            "name": "ansi-regex",
            "version": "3.0.0",
            "description": "Regular expression for matching ANSI escape codes",
            "license": "MIT",
            "repository": "chalk/ansi-regex",
            "author": {
              "name": "Sindre Sorhus",
              "email": "sindresorhus@gmail.com",
              "url": "sindresorhus.com"
            },
            "engines": {
              "node": ">=4"
            },
            "scripts": {
              "test": "xo && ava",
              "view-supported": "node fixtures/view-codes.js"
            },
            "files": [
              "index.js"
            ],
            "keywords": [
              "ansi",
              "styles",
              "color",
              "colour",
              "colors",
              "terminal",
              "console",
              "cli",
              "string",
              "tty",
              "escape",
              "formatting",
              "rgb",
              "256",
              "shell",
              "xterm",
              "command-line",
              "text",
              "regex",
              "regexp",
              "re",
              "match",
              "test",
              "find",
              "pattern"
            ],
            "devDependencies": {
              "ava": "*",
              "xo": "*"
            }
          })
        },
        "strip-ansi": {
          "package.json": JSON.stringify({
            "name": "strip-ansi",
            "version": "4.0.0",
            "description": "Strip ANSI escape codes",
            "license": "MIT",
            "repository": "chalk/strip-ansi",
            "author": {
              "name": "Sindre Sorhus",
              "email": "sindresorhus@gmail.com",
              "url": "sindresorhus.com"
            },
            "engines": {
              "node": ">=4"
            },
            "scripts": {
              "test": "xo && ava"
            },
            "files": [
              "index.js"
            ],
            "keywords": [
              "strip",
              "trim",
              "remove",
              "ansi",
              "styles",
              "color",
              "colour",
              "colors",
              "terminal",
              "console",
              "string",
              "tty",
              "escape",
              "formatting",
              "rgb",
              "256",
              "shell",
              "xterm",
              "log",
              "logging",
              "command-line",
              "text"
            ],
            "dependencies": {
              "ansi-regex": "^3.0.0"
            },
            "devDependencies": {
              "ava": "*",
              "xo": "*"
            }
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "string-width",
        "version": "2.1.1",
        "description": "Get the visual width of a string - the number of columns required to display it",
        "license": "MIT",
        "repository": "sindresorhus/string-width",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "string",
          "str",
          "character",
          "char",
          "unicode",
          "width",
          "visual",
          "column",
          "columns",
          "fullwidth",
          "full-width",
          "full",
          "ansi",
          "escape",
          "codes",
          "cli",
          "command-line",
          "terminal",
          "console",
          "cjk",
          "chinese",
          "japanese",
          "korean",
          "fixed-width"
        ],
        "dependencies": {
          "is-fullwidth-code-point": "^2.0.0",
          "strip-ansi": "^4.0.0"
        },
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        }
      })
    },
    "string_decoder": {
      "package.json": JSON.stringify({
        "name": "string_decoder",
        "version": "1.1.1",
        "description": "The string_decoder module from Node core",
        "main": "lib/string_decoder.js",
        "dependencies": {
          "safe-buffer": "~5.1.0"
        },
        "devDependencies": {
          "babel-polyfill": "^6.23.0",
          "core-util-is": "^1.0.2",
          "inherits": "^2.0.3",
          "tap": "~0.4.8"
        },
        "scripts": {
          "test": "tap test/parallel/*.js && node test/verify-dependencies",
          "ci": "tap test/parallel/*.js test/ours/*.js --tap | tee test.tap && node test/verify-dependencies.js"
        },
        "repository": {
          "type": "git",
          "url": "git://github.com/nodejs/string_decoder.git"
        },
        "homepage": "https://github.com/nodejs/string_decoder",
        "keywords": [
          "string",
          "decoder",
          "browser",
          "browserify"
        ],
        "license": "MIT"
      })
    },
    "strip-ansi": {
      "package.json": JSON.stringify({
        "name": "strip-ansi",
        "version": "3.0.1",
        "description": "Strip ANSI escape codes",
        "license": "MIT",
        "repository": "chalk/strip-ansi",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "maintainers": [
          "Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)",
          "Joshua Boy Nicolai Appelman <joshua@jbna.nl> (jbna.nl)",
          "JD Ballard <i.am.qix@gmail.com> (github.com/qix-)"
        ],
        "engines": {
          "node": ">=0.10.0"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "strip",
          "trim",
          "remove",
          "ansi",
          "styles",
          "color",
          "colour",
          "colors",
          "terminal",
          "console",
          "string",
          "tty",
          "escape",
          "formatting",
          "rgb",
          "256",
          "shell",
          "xterm",
          "log",
          "logging",
          "command-line",
          "text"
        ],
        "dependencies": {
          "ansi-regex": "^2.0.0"
        },
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        }
      })
    },
    "strip-bom": {
      "package.json": JSON.stringify({
        "name": "strip-bom",
        "version": "3.0.0",
        "description": "Strip UTF-8 byte order mark (BOM) from a string",
        "license": "MIT",
        "repository": "sindresorhus/strip-bom",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "strip",
          "bom",
          "byte",
          "order",
          "mark",
          "unicode",
          "utf8",
          "utf-8",
          "remove",
          "delete",
          "trim",
          "text",
          "string"
        ],
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        }
      })
    },
    "strip-eof": {
      "package.json": JSON.stringify({
        "name": "strip-eof",
        "version": "1.0.0",
        "description": "Strip the End-Of-File (EOF) character from a string/buffer",
        "license": "MIT",
        "repository": "sindresorhus/strip-eof",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=0.10.0"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "strip",
          "trim",
          "remove",
          "delete",
          "eof",
          "end",
          "file",
          "newline",
          "linebreak",
          "character",
          "string",
          "buffer"
        ],
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        }
      })
    },
    "supports-color": {
      "package.json": JSON.stringify({
        "name": "supports-color",
        "version": "5.5.0",
        "description": "Detect whether a terminal supports color",
        "license": "MIT",
        "repository": "chalk/supports-color",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js",
          "browser.js"
        ],
        "keywords": [
          "color",
          "colour",
          "colors",
          "terminal",
          "console",
          "cli",
          "ansi",
          "styles",
          "tty",
          "rgb",
          "256",
          "shell",
          "xterm",
          "command-line",
          "support",
          "supports",
          "capability",
          "detect",
          "truecolor",
          "16m"
        ],
        "dependencies": {
          "has-flag": "^3.0.0"
        },
        "devDependencies": {
          "ava": "^0.25.0",
          "import-fresh": "^2.0.0",
          "xo": "^0.20.0"
        },
        "browser": "browser.js"
      })
    },
    "tap-mocha-reporter": {
      "node_modules": {
        "diff": {
          "package.json": JSON.stringify({
            "name": "diff",
            "version": "1.4.0",
            "description": "A javascript text diff implementation.",
            "keywords": [
              "diff",
              "javascript"
            ],
            "maintainers": [
              "Kevin Decker <kpdecker@gmail.com> (http://incaseofstairs.com)"
            ],
            "bugs": {
              "email": "kpdecker@gmail.com",
              "url": "http://github.com/kpdecker/jsdiff/issues"
            },
            "licenses": [
              {
                "type": "BSD",
                "url": "http://github.com/kpdecker/jsdiff/blob/master/LICENSE"
              }
            ],
            "repository": {
              "type": "git",
              "url": "git://github.com/kpdecker/jsdiff.git"
            },
            "engines": {
              "node": ">=0.3.1"
            },
            "main": "./diff",
            "scripts": {
              "test": "istanbul cover node_modules/.bin/_mocha test/*.js && istanbul check-coverage --statements 100 --functions 100 --branches 100 --lines 100 coverage/coverage.json"
            },
            "dependencies": {},
            "devDependencies": {
              "colors": "^1.1.0",
              "istanbul": "^0.3.2",
              "mocha": "^2.2.4",
              "should": "^6.0.1"
            },
            "optionalDependencies": {},
            "files": [
              "diff.js"
            ]
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "tap-mocha-reporter",
        "version": "5.0.0",
        "description": "Format a TAP stream using Mocha's set of reporters",
        "main": "index.js",
        "scripts": {
          "test": "tap test/*.js"
        },
        "repository": {
          "type": "git",
          "url": "https://github.com/isaacs/tap-mocha-reporter"
        },
        "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me/)",
        "license": "ISC",
        "bugs": {
          "url": "https://github.com/isaacs/tap-mocha-reporter/issues"
        },
        "homepage": "https://github.com/isaacs/tap-mocha-reporter",
        "dependencies": {
          "color-support": "^1.1.0",
          "debug": "^2.1.3",
          "diff": "^1.3.2",
          "escape-string-regexp": "^1.0.3",
          "glob": "^7.0.5",
          "tap-parser": "^10.0.0",
          "tap-yaml": "^1.0.0",
          "unicode-length": "^1.0.0"
        },
        "devDependencies": {
          "tap": "^12.7.0"
        },
        "bin": "index.js",
        "optionalDependencies": {
          "readable-stream": "^2.1.5"
        },
        "files": [
          "index.js",
          "lib"
        ],
        "engines": {
          "node": ">= 8"
        }
      })
    },
    "tap-parser": {
      "package.json": JSON.stringify({
        "name": "tap-parser",
        "version": "10.0.1",
        "description": "parse the test anything protocol",
        "main": "index.js",
        "bin": {
          "tap-parser": "bin/cmd.js"
        },
        "dependencies": {
          "events-to-array": "^1.0.1",
          "minipass": "^3.0.0",
          "tap-yaml": "^1.0.0"
        },
        "devDependencies": {
          "glob": "^7.0.5",
          "tap": "^14.4.1"
        },
        "scripts": {
          "snap": "tap",
          "test": "tap",
          "preversion": "npm test",
          "postversion": "npm publish",
          "postpublish": "git push origin --follow-tags"
        },
        "testling": {
          "files": "test/*.js",
          "browsers": [
            "ie/6..latest",
            "chrome/10",
            "chrome/latest",
            "firefox/3.5",
            "firefox/latest",
            "opera/latest",
            "safari/latest"
          ]
        },
        "repository": {
          "type": "git",
          "url": "git://github.com/tapjs/tap-parser.git"
        },
        "homepage": "https://github.com/tapjs/tap-parser",
        "keywords": [
          "tap",
          "test",
          "parser"
        ],
        "license": "MIT",
        "optionalDependencies": {},
        "files": [
          "index.js",
          "bin/cmd.js"
        ],
        "tap": {
          "check-coverage": true
        },
        "nyc": {
          "hookRunInThisContext": true
        },
        "engines": {
          "node": ">= 8"
        }
      })
    },
    "tap-yaml": {
      "package.json": JSON.stringify({
        "name": "tap-yaml",
        "version": "1.0.0",
        "description": "Yaml handling for TAP parsers and generators",
        "main": "index.js",
        "scripts": {
          "test": "tap test/*.js",
          "snap": "tap test/*.js",
          "preversion": "npm test",
          "postversion": "npm publish",
          "postpublish": "git push origin --all; git push origin --tags"
        },
        "repository": {
          "type": "git",
          "url": "git+https://github.com/tapjs/tap-yaml.git"
        },
        "keywords": [
          "tap",
          "yaml",
          "test",
          "testanything"
        ],
        "author": "Isaac Z. Schlueter <i@izs.me>",
        "license": "ISC",
        "dependencies": {
          "yaml": "^1.5.0"
        },
        "devDependencies": {
          "tap": "^13.0.0-rc.21"
        },
        "files": [
          "index.js",
          "lib/**/*.js"
        ],
        "tap": {
          "check-coverage": true
        }
      })
    },
    "tcompare": {
      "package.json": JSON.stringify({
        "name": "tcompare",
        "version": "2.3.0",
        "description": "A comprehensive comparison library, for use in test frameworks",
        "main": "index.js",
        "repository": {
          "type": "git",
          "url": "git+https://github.com/tapjs/tcompare.git"
        },
        "author": "Isaac Z. Schlueter <i@izs.me> (https://izs.me)",
        "license": "ISC",
        "files": [
          "index.js",
          "lib/*.js"
        ],
        "devDependencies": {
          "tap": "^13.1.7"
        },
        "scripts": {
          "test": "tap",
          "snap": "tap",
          "preversion": "npm test",
          "postversion": "npm publish",
          "postpublish": "git push origin --all; git push origin --tags"
        },
        "tap": {
          "check-coverage": true,
          "coverage-map": "map.js"
        }
      })
    },
    "test-exclude": {
      "package.json": JSON.stringify({
        "name": "test-exclude",
        "version": "5.2.3",
        "description": "test for inclusion or exclusion of paths using pkg-conf and globs",
        "main": "index.js",
        "files": [
          "index.js"
        ],
        "scripts": {
          "test": "mocha"
        },
        "repository": {
          "type": "git",
          "url": "git+https://github.com/istanbuljs/istanbuljs.git"
        },
        "keywords": [
          "exclude",
          "include",
          "glob",
          "package",
          "config"
        ],
        "author": "Ben Coe <ben@npmjs.com>",
        "license": "ISC",
        "bugs": {
          "url": "https://github.com/istanbuljs/istanbuljs/issues"
        },
        "homepage": "https://istanbul.js.org/",
        "dependencies": {
          "glob": "^7.1.3",
          "minimatch": "^3.0.4",
          "read-pkg-up": "^4.0.0",
          "require-main-filename": "^2.0.0"
        },
        "engines": {
          "node": ">=6"
        },
        "gitHead": "90e60cc47833bb780680f916488ca24f0be36ca2"
      })
    },
    "to-fast-properties": {
      "package.json": JSON.stringify({
        "name": "to-fast-properties",
        "version": "1.0.3",
        "description": "Force V8 to use fast properties for an object",
        "license": "MIT",
        "repository": "sindresorhus/to-fast-properties",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=0.10.0"
        },
        "scripts": {
          "test": "node --allow-natives-syntax test.js"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "object",
          "obj",
          "properties",
          "props",
          "v8",
          "optimize",
          "fast",
          "convert",
          "mode"
        ],
        "devDependencies": {
          "ava": "0.0.4"
        }
      })
    },
    "to-regex-range": {
      "package.json": JSON.stringify({
        "name": "to-regex-range",
        "description": "Pass two numbers, get a regex-compatible source string for matching ranges. Validated against more than 2.78 million test assertions.",
        "version": "5.0.1",
        "homepage": "https://github.com/micromatch/to-regex-range",
        "author": "Jon Schlinkert (https://github.com/jonschlinkert)",
        "contributors": [
          "Jon Schlinkert (http://twitter.com/jonschlinkert)",
          "Rouven Weßling (www.rouvenwessling.de)"
        ],
        "repository": "micromatch/to-regex-range",
        "bugs": {
          "url": "https://github.com/micromatch/to-regex-range/issues"
        },
        "license": "MIT",
        "files": [
          "index.js"
        ],
        "main": "index.js",
        "engines": {
          "node": ">=8.0"
        },
        "scripts": {
          "test": "mocha"
        },
        "dependencies": {
          "is-number": "^7.0.0"
        },
        "devDependencies": {
          "fill-range": "^6.0.0",
          "gulp-format-md": "^2.0.0",
          "mocha": "^6.0.2",
          "text-table": "^0.2.0",
          "time-diff": "^0.3.1"
        },
        "keywords": [
          "bash",
          "date",
          "expand",
          "expansion",
          "expression",
          "glob",
          "match",
          "match date",
          "match number",
          "match numbers",
          "match year",
          "matches",
          "matching",
          "number",
          "numbers",
          "numerical",
          "range",
          "ranges",
          "regex",
          "regexp",
          "regular",
          "regular expression",
          "sequence"
        ],
        "verb": {
          "layout": "default",
          "toc": false,
          "tasks": [
            "readme"
          ],
          "plugins": [
            "gulp-format-md"
          ],
          "lint": {
            "reflinks": true
          },
          "helpers": {
            "examples": {
              "displayName": "examples"
            }
          },
          "related": {
            "list": [
              "expand-range",
              "fill-range",
              "micromatch",
              "repeat-element",
              "repeat-string"
            ]
          }
        }
      })
    },
    "tough-cookie": {
      "package.json": JSON.stringify({
        "author": {
          "name": "Jeremy Stashewsky",
          "email": "jstash@gmail.com",
          "website": "https://github.com/stash"
        },
        "contributors": [
          {
            "name": "Alexander Savin",
            "website": "https://github.com/apsavin"
          },
          {
            "name": "Ian Livingstone",
            "website": "https://github.com/ianlivingstone"
          },
          {
            "name": "Ivan Nikulin",
            "website": "https://github.com/inikulin"
          },
          {
            "name": "Lalit Kapoor",
            "website": "https://github.com/lalitkapoor"
          },
          {
            "name": "Sam Thompson",
            "website": "https://github.com/sambthompson"
          },
          {
            "name": "Sebastian Mayr",
            "website": "https://github.com/Sebmaster"
          }
        ],
        "license": "BSD-3-Clause",
        "name": "tough-cookie",
        "description": "RFC6265 Cookies and Cookie Jar for node.js",
        "keywords": [
          "HTTP",
          "cookie",
          "cookies",
          "set-cookie",
          "cookiejar",
          "jar",
          "RFC6265",
          "RFC2965"
        ],
        "version": "2.4.3",
        "homepage": "https://github.com/salesforce/tough-cookie",
        "repository": {
          "type": "git",
          "url": "git://github.com/salesforce/tough-cookie.git"
        },
        "bugs": {
          "url": "https://github.com/salesforce/tough-cookie/issues"
        },
        "main": "./lib/cookie",
        "files": [
          "lib"
        ],
        "scripts": {
          "test": "vows test/*_test.js",
          "cover": "nyc --reporter=lcov --reporter=html vows test/*_test.js"
        },
        "engines": {
          "node": ">=0.8"
        },
        "devDependencies": {
          "async": "^1.4.2",
          "nyc": "^11.6.0",
          "string.prototype.repeat": "^0.2.0",
          "vows": "^0.8.1"
        },
        "dependencies": {
          "psl": "^1.1.24",
          "punycode": "^1.4.1"
        }
      })
    },
    "treport": {
      "node_modules": {
        "punycode": {
          "package.json": JSON.stringify({
            "name": "punycode",
            "version": "2.1.1",
            "description": "A robust Punycode converter that fully complies to RFC 3492 and RFC 5891, and works on nearly all JavaScript platforms.",
            "homepage": "https://mths.be/punycode",
            "main": "punycode.js",
            "jsnext:main": "punycode.es6.js",
            "module": "punycode.es6.js",
            "engines": {
              "node": ">=6"
            },
            "keywords": [
              "punycode",
              "unicode",
              "idn",
              "idna",
              "dns",
              "url",
              "domain"
            ],
            "license": "MIT",
            "author": {
              "name": "Mathias Bynens",
              "url": "https://mathiasbynens.be/"
            },
            "contributors": [
              {
                "name": "Mathias Bynens",
                "url": "https://mathiasbynens.be/"
              }
            ],
            "repository": {
              "type": "git",
              "url": "https://github.com/bestiejs/punycode.js.git"
            },
            "bugs": "https://github.com/bestiejs/punycode.js/issues",
            "files": [
              "LICENSE-MIT.txt",
              "punycode.js",
              "punycode.es6.js"
            ],
            "scripts": {
              "test": "mocha tests",
              "prepublish": "node scripts/prepublish.js"
            },
            "devDependencies": {
              "codecov": "^1.0.1",
              "istanbul": "^0.4.1",
              "mocha": "^2.5.3"
            },
            "jspm": {
              "map": {
                "./punycode.js": {
                  "node": "@node/punycode"
                }
              }
            }
          })
        },
        "react": {
          "package.json": JSON.stringify({
            "name": "react",
            "description": "React is a JavaScript library for building user interfaces.",
            "keywords": [
              "react"
            ],
            "version": "16.8.6",
            "homepage": "https://reactjs.org/",
            "bugs": "https://github.com/facebook/react/issues",
            "license": "MIT",
            "files": [
              "LICENSE",
              "README.md",
              "build-info.json",
              "index.js",
              "cjs/",
              "umd/"
            ],
            "main": "index.js",
            "repository": {
              "type": "git",
              "url": "https://github.com/facebook/react.git",
              "directory": "packages/react"
            },
            "engines": {
              "node": ">=0.10.0"
            },
            "dependencies": {
              "loose-envify": "^1.1.0",
              "object-assign": "^4.1.1",
              "prop-types": "^15.6.2",
              "scheduler": "^0.13.6"
            },
            "browserify": {
              "transform": [
                "loose-envify"
              ]
            }
          })
        },
        "unicode-length": {
          "package.json": JSON.stringify({
            "name": "unicode-length",
            "version": "2.0.2",
            "description": "Get the length of unicode strings",
            "main": "lib/unicode-length.js",
            "files": [
              "lib/unicode-length.js"
            ],
            "homepage": "https://github.com/jviotti/unicode-length",
            "repository": {
              "type": "git",
              "url": "git://github.com/jviotti/unicode-length.git"
            },
            "keywords": [
              "unicode",
              "string",
              "length"
            ],
            "directories": {
              "test": "tests"
            },
            "scripts": {
              "lint": "standard",
              "test": "node ./tests/unicode-length.spec.js | tap-spec"
            },
            "author": "Juan Cruz Viotti <jv@jviotti.com>",
            "license": "MIT",
            "devDependencies": {
              "standard": "^12.0.1",
              "tap-spec": "^5.0.0",
              "tape": "^4.10.2"
            },
            "dependencies": {
              "punycode": "^2.0.0",
              "strip-ansi": "^3.0.1"
            }
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "treport",
        "description": "Reporters for node-tap",
        "version": "0.4.2",
        "author": "Isaac Z. Schlueter <i@izs.me> (https://izs.me)",
        "dependencies": {
          "cardinal": "^2.1.1",
          "chalk": "^2.4.2",
          "import-jsx": "^2.0.0",
          "ink": "^2.1.1",
          "ms": "^2.1.1",
          "react": "^16.8.6",
          "string-length": "^2.0.0",
          "tap-parser": "^10.0.1",
          "unicode-length": "^2.0.1"
        },
        "devDependencies": {
          "events-to-array": "^1.1.2",
          "ink-testing-library": "^1.0.1",
          "minipass": "^3.0.0",
          "tap": "^14.7.1"
        },
        "license": "ISC",
        "scripts": {
          "test": "tap",
          "snap": "tap",
          "preversion": "npm test",
          "postversion": "npm publish",
          "postpublish": "git push origin --all; git push origin --tags"
        },
        "tap": {
          "check-coverage": true,
          "test-env": [
            "TERM_PROGRAM=iTerm.app",
            "TERM=xterm-256color",
            "TERM_PROGRAM_VERSION=3.2.7",
            "COLORTERM=truecolor",
            "FORCE_COLOR=1"
          ],
          "coverage-map": "map.js"
        },
        "files": [
          "index.js",
          "types.js",
          "lib/**/!(*.test).js"
        ],
        "nyc": {
          "all": true,
          "include": [
            "index.js",
            "lib/**/!(*.test).js"
          ]
        },
        "main": "index.js",
        "repository": "git://github.com/tapjs/treport"
      })
    },
    "trim-right": {
      "package.json": JSON.stringify({
        "name": "trim-right",
        "version": "1.0.1",
        "description": "Similar to String#trim() but removes only whitespace on the right",
        "license": "MIT",
        "repository": "sindresorhus/trim-right",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=0.10.0"
        },
        "scripts": {
          "test": "node test.js"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "trim",
          "right",
          "string",
          "str",
          "util",
          "utils",
          "utility",
          "whitespace",
          "space",
          "remove",
          "delete"
        ],
        "devDependencies": {
          "ava": "0.0.4"
        }
      })
    },
    "trivial-deferred": {
      "package.json": JSON.stringify({
        "name": "trivial-deferred",
        "version": "1.0.1",
        "description": "The most dead-simple trivial Deferred implementation",
        "main": "index.js",
        "dependencies": {},
        "devDependencies": {
          "tap": "9||10"
        },
        "scripts": {
          "test": "tap test.js --100"
        },
        "repository": {
          "type": "git",
          "url": "git+https://github.com/isaacs/trivial-deferred.git"
        },
        "keywords": [],
        "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me/)",
        "license": "ISC",
        "bugs": {
          "url": "https://github.com/isaacs/trivial-deferred/issues"
        },
        "homepage": "https://github.com/isaacs/trivial-deferred#readme"
      })
    },
    "ts-node": {
      "node_modules": {
        "source-map-support": {
          "package.json": JSON.stringify({
            "name": "source-map-support",
            "description": "Fixes stack traces for files with source maps",
            "version": "0.5.12",
            "main": "./source-map-support.js",
            "scripts": {
              "build": "node build.js",
              "serve-tests": "http-server -p 1336",
              "prepublish": "npm run build",
              "test": "mocha"
            },
            "dependencies": {
              "buffer-from": "^1.0.0",
              "source-map": "^0.6.0"
            },
            "devDependencies": {
              "browserify": "^4.2.3",
              "coffeescript": "^1.12.7",
              "http-server": "^0.11.1",
              "mocha": "^3.5.3",
              "webpack": "^1.15.0"
            },
            "repository": {
              "type": "git",
              "url": "https://github.com/evanw/node-source-map-support"
            },
            "bugs": {
              "url": "https://github.com/evanw/node-source-map-support/issues"
            },
            "license": "MIT"
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "ts-node",
        "version": "8.3.0",
        "description": "TypeScript execution environment and REPL for node.js, with source map support",
        "main": "dist/index.js",
        "types": "dist/index.d.ts",
        "bin": {
          "ts-node": "dist/bin.js"
        },
        "files": [
          "dist/",
          "register/",
          "LICENSE"
        ],
        "scripts": {
          "lint": "tslint \"src/**/*.ts\" --project tsconfig.json",
          "build": "rimraf dist && tsc",
          "test-spec": "mocha dist/**/*.spec.js -R spec --bail",
          "test-cov": "istanbul cover node_modules/mocha/bin/_mocha -- \"dist/**/*.spec.js\" -R spec --bail",
          "test": "npm run build && npm run lint && npm run test-cov",
          "prepare": "npm run build"
        },
        "engines": {
          "node": ">=4.2.0"
        },
        "repository": {
          "type": "git",
          "url": "git://github.com/TypeStrong/ts-node.git"
        },
        "keywords": [
          "typescript",
          "node",
          "runtime",
          "environment",
          "ts",
          "compiler"
        ],
        "author": {
          "name": "Blake Embrey",
          "email": "hello@blakeembrey.com",
          "url": "http://blakeembrey.me"
        },
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/TypeStrong/ts-node/issues"
        },
        "homepage": "https://github.com/TypeStrong/ts-node",
        "devDependencies": {
          "@types/chai": "^4.0.4",
          "@types/diff": "^4.0.2",
          "@types/mocha": "^5.0.0",
          "@types/node": "^12.0.2",
          "@types/proxyquire": "^1.3.28",
          "@types/react": "^16.0.2",
          "@types/semver": "^6.0.0",
          "@types/source-map-support": "^0.5.0",
          "chai": "^4.0.1",
          "istanbul": "^0.4.0",
          "mocha": "^6.1.4",
          "ntypescript": "^1.201507091536.1",
          "proxyquire": "^2.0.0",
          "react": "^16.0.0",
          "rimraf": "^2.5.4",
          "semver": "^6.1.0",
          "tslint": "^5.11.0",
          "tslint-config-standard": "^8.0.1",
          "typescript": "^3.2.4"
        },
        "peerDependencies": {
          "typescript": ">=2.0"
        },
        "dependencies": {
          "arg": "^4.1.0",
          "diff": "^4.0.1",
          "make-error": "^1.1.1",
          "source-map-support": "^0.5.6",
          "yn": "^3.0.0"
        }
      })
    },
    "tunnel-agent": {
      "node_modules": {
        "safe-buffer": {
          "package.json": JSON.stringify({
            "name": "safe-buffer",
            "description": "Safer Node.js Buffer API",
            "version": "5.2.0",
            "author": {
              "name": "Feross Aboukhadijeh",
              "email": "feross@feross.org",
              "url": "http://feross.org"
            },
            "bugs": {
              "url": "https://github.com/feross/safe-buffer/issues"
            },
            "devDependencies": {
              "standard": "*",
              "tape": "^4.0.0"
            },
            "homepage": "https://github.com/feross/safe-buffer",
            "keywords": [
              "buffer",
              "buffer allocate",
              "node security",
              "safe",
              "safe-buffer",
              "security",
              "uninitialized"
            ],
            "license": "MIT",
            "main": "index.js",
            "types": "index.d.ts",
            "repository": {
              "type": "git",
              "url": "git://github.com/feross/safe-buffer.git"
            },
            "scripts": {
              "test": "standard && tape test/*.js"
            }
          })
        }
      },
      "package.json": JSON.stringify({
        "author": "Mikeal Rogers <mikeal.rogers@gmail.com> (http://www.futurealoof.com)",
        "name": "tunnel-agent",
        "license": "Apache-2.0",
        "description": "HTTP proxy tunneling agent. Formerly part of mikeal/request, now a standalone module.",
        "version": "0.6.0",
        "repository": {
          "url": "https://github.com/mikeal/tunnel-agent"
        },
        "main": "index.js",
        "files": [
          "index.js"
        ],
        "dependencies": {
          "safe-buffer": "^5.0.1"
        },
        "devDependencies": {},
        "optionalDependencies": {},
        "engines": {
          "node": "*"
        }
      })
    },
    "tweetnacl": {
      "package.json": JSON.stringify({
        "name": "tweetnacl",
        "version": "0.14.5",
        "description": "Port of TweetNaCl cryptographic library to JavaScript",
        "main": "nacl-fast.js",
        "types": "nacl.d.ts",
        "directories": {
          "test": "test"
        },
        "scripts": {
          "build": "uglifyjs nacl.js -c -m -o nacl.min.js && uglifyjs nacl-fast.js -c -m -o nacl-fast.min.js",
          "test-node": "tape test/*.js | faucet",
          "test-node-all": "make -C test/c && tape test/*.js test/c/*.js | faucet",
          "test-browser": "NACL_SRC=${NACL_SRC:='nacl.min.js'} && npm run build-test-browser && cat $NACL_SRC test/browser/_bundle.js | tape-run | faucet",
          "build-test-browser": "browserify test/browser/init.js test/*.js | uglifyjs -c -m -o test/browser/_bundle.js 2>/dev/null && browserify test/browser/init.js test/*.quick.js | uglifyjs -c -m -o test/browser/_bundle-quick.js 2>/dev/null",
          "test": "npm run test-node-all && npm run test-browser",
          "bench": "node test/benchmark/bench.js",
          "lint": "eslint nacl.js nacl-fast.js test/*.js test/benchmark/*.js"
        },
        "repository": {
          "type": "git",
          "url": "https://github.com/dchest/tweetnacl-js.git"
        },
        "keywords": [
          "crypto",
          "cryptography",
          "curve25519",
          "ed25519",
          "encrypt",
          "hash",
          "key",
          "nacl",
          "poly1305",
          "public",
          "salsa20",
          "signatures"
        ],
        "author": "TweetNaCl-js contributors",
        "license": "Unlicense",
        "bugs": {
          "url": "https://github.com/dchest/tweetnacl-js/issues"
        },
        "homepage": "https://tweetnacl.js.org",
        "devDependencies": {
          "browserify": "^13.0.0",
          "eslint": "^2.2.0",
          "faucet": "^0.0.1",
          "tap-browser-color": "^0.1.2",
          "tape": "^4.4.0",
          "tape-run": "^2.1.3",
          "tweetnacl-util": "^0.13.3",
          "uglify-js": "^2.6.1"
        },
        "browser": {
          "buffer": false,
          "crypto": false
        }
      })
    },
    "typedarray-to-buffer": {
      "package.json": JSON.stringify({
        "name": "typedarray-to-buffer",
        "description": "Convert a typed array to a Buffer without a copy",
        "version": "3.1.5",
        "author": {
          "name": "Feross Aboukhadijeh",
          "email": "feross@feross.org",
          "url": "http://feross.org/"
        },
        "bugs": {
          "url": "https://github.com/feross/typedarray-to-buffer/issues"
        },
        "dependencies": {
          "is-typedarray": "^1.0.0"
        },
        "devDependencies": {
          "airtap": "0.0.4",
          "standard": "*",
          "tape": "^4.0.0"
        },
        "homepage": "http://feross.org",
        "keywords": [
          "buffer",
          "typed array",
          "convert",
          "no copy",
          "uint8array",
          "uint16array",
          "uint32array",
          "int16array",
          "int32array",
          "float32array",
          "float64array",
          "browser",
          "arraybuffer",
          "dataview"
        ],
        "license": "MIT",
        "main": "index.js",
        "repository": {
          "type": "git",
          "url": "git://github.com/feross/typedarray-to-buffer.git"
        },
        "scripts": {
          "test": "standard && npm run test-node && npm run test-browser",
          "test-browser": "airtap -- test/*.js",
          "test-browser-local": "airtap --local -- test/*.js",
          "test-node": "tape test/*.js"
        }
      })
    },
    "typescript": {
      "package.json": JSON.stringify({
        "name": "typescript",
        "author": "Microsoft Corp.",
        "homepage": "https://www.typescriptlang.org/",
        "version": "3.7.2",
        "license": "Apache-2.0",
        "description": "TypeScript is a language for application scale JavaScript development",
        "keywords": [
          "TypeScript",
          "Microsoft",
          "compiler",
          "language",
          "javascript"
        ],
        "bugs": {
          "url": "https://github.com/Microsoft/TypeScript/issues"
        },
        "repository": {
          "type": "git",
          "url": "https://github.com/Microsoft/TypeScript.git"
        },
        "main": "./lib/typescript.js",
        "typings": "./lib/typescript.d.ts",
        "bin": {
          "tsc": "./bin/tsc",
          "tsserver": "./bin/tsserver"
        },
        "engines": {
          "node": ">=4.2.0"
        },
        "devDependencies": {
          "@octokit/rest": "latest",
          "@types/browserify": "latest",
          "@types/chai": "latest",
          "@types/convert-source-map": "latest",
          "@types/glob": "latest",
          "@types/gulp": "^4.0.5",
          "@types/gulp-concat": "latest",
          "@types/gulp-newer": "latest",
          "@types/gulp-rename": "0.0.33",
          "@types/gulp-sourcemaps": "0.0.32",
          "@types/jake": "latest",
          "@types/merge2": "latest",
          "@types/microsoft__typescript-etw": "latest",
          "@types/minimatch": "latest",
          "@types/minimist": "latest",
          "@types/mkdirp": "latest",
          "@types/mocha": "latest",
          "@types/ms": "latest",
          "@types/node": "latest",
          "@types/node-fetch": "^2.3.4",
          "@types/q": "latest",
          "@types/source-map-support": "latest",
          "@types/through2": "latest",
          "@types/travis-fold": "latest",
          "@types/xml2js": "^0.4.0",
          "@typescript-eslint/eslint-plugin": "2.3.2",
          "@typescript-eslint/experimental-utils": "2.3.2",
          "@typescript-eslint/parser": "2.3.2",
          "async": "latest",
          "azure-devops-node-api": "^8.0.0",
          "browser-resolve": "^1.11.2",
          "browserify": "latest",
          "chai": "latest",
          "chalk": "latest",
          "convert-source-map": "latest",
          "del": "5.1.0",
          "eslint": "6.5.1",
          "eslint-formatter-autolinkable-stylish": "1.0.3",
          "eslint-plugin-import": "2.18.2",
          "eslint-plugin-jsdoc": "15.9.9",
          "eslint-plugin-no-null": "1.0.2",
          "fancy-log": "latest",
          "fs-extra": "^6.0.1",
          "glob": "latest",
          "gulp": "^4.0.0",
          "gulp-concat": "latest",
          "gulp-insert": "latest",
          "gulp-newer": "latest",
          "gulp-rename": "latest",
          "gulp-sourcemaps": "latest",
          "istanbul": "latest",
          "merge2": "latest",
          "minimist": "latest",
          "mkdirp": "latest",
          "mocha": "latest",
          "mocha-fivemat-progress-reporter": "latest",
          "ms": "latest",
          "node-fetch": "^2.6.0",
          "plugin-error": "latest",
          "pretty-hrtime": "^1.0.3",
          "prex": "^0.4.3",
          "q": "latest",
          "remove-internal": "^2.9.2",
          "simple-git": "^1.113.0",
          "source-map-support": "latest",
          "through2": "latest",
          "travis-fold": "latest",
          "typescript": "next",
          "vinyl": "latest",
          "vinyl-sourcemaps-apply": "latest",
          "xml2js": "^0.4.19"
        },
        "scripts": {
          "prepare": "gulp build-eslint-rules",
          "pretest": "gulp tests",
          "test": "gulp runtests-parallel --light=false",
          "test:eslint-rules": "gulp run-eslint-rules-tests",
          "build": "npm run build:compiler && npm run build:tests",
          "build:compiler": "gulp local",
          "build:tests": "gulp tests",
          "start": "node lib/tsc",
          "clean": "gulp clean",
          "gulp": "gulp",
          "jake": "gulp",
          "lint": "gulp lint",
          "lint:ci": "gulp lint --ci",
          "lint:compiler": "gulp lint-compiler",
          "lint:scripts": "gulp lint-scripts",
          "setup-hooks": "node scripts/link-hooks.js",
          "update-costly-tests": "node scripts/costly-tests.js"
        },
        "browser": {
          "fs": false,
          "os": false,
          "path": false,
          "crypto": false,
          "buffer": false,
          "@microsoft/typescript-etw": false,
          "source-map-support": false,
          "inspector": false
        },
        "dependencies": {}
      })
    },
    "uglify-js": {
      "package.json": JSON.stringify({
        "name": "uglify-js",
        "description": "JavaScript parser, mangler/compressor and beautifier toolkit",
        "author": "Mihai Bazon <mihai.bazon@gmail.com> (http://lisperator.net/)",
        "license": "BSD-2-Clause",
        "version": "3.6.0",
        "engines": {
          "node": ">=0.8.0"
        },
        "maintainers": [
          "Alex Lam <alexlamsl@gmail.com>",
          "Mihai Bazon <mihai.bazon@gmail.com> (http://lisperator.net/)"
        ],
        "repository": "mishoo/UglifyJS2",
        "main": "tools/node.js",
        "bin": {
          "uglifyjs": "bin/uglifyjs"
        },
        "files": [
          "bin",
          "lib",
          "tools",
          "LICENSE"
        ],
        "dependencies": {
          "commander": "~2.20.0",
          "source-map": "~0.6.1"
        },
        "devDependencies": {
          "acorn": "~6.1.1",
          "semver": "~6.0.0"
        },
        "scripts": {
          "test": "node test/compress.js && node test/mocha.js"
        },
        "keywords": [
          "cli",
          "compress",
          "compressor",
          "ecma",
          "ecmascript",
          "es",
          "es5",
          "javascript",
          "js",
          "jsmin",
          "min",
          "minification",
          "minifier",
          "minify",
          "optimize",
          "optimizer",
          "pack",
          "packer",
          "parse",
          "parser",
          "uglifier",
          "uglify"
        ]
      })
    },
    "unicode-length": {
      "package.json": JSON.stringify({
        "name": "unicode-length",
        "version": "1.0.3",
        "description": "Get the length of unicode strings",
        "main": "build/unicode-length.js",
        "files": [
          "build/unicode-length.js"
        ],
        "homepage": "https://github.com/jviotti/unicode-length",
        "repository": {
          "type": "git",
          "url": "git://github.com/jviotti/unicode-length.git"
        },
        "keywords": [
          "unicode",
          "string",
          "length"
        ],
        "directories": {
          "test": "tests"
        },
        "scripts": {
          "test": "gulp test",
          "prepublish": "gulp build"
        },
        "author": "Juan Cruz Viotti <juanchiviotti@gmail.com>",
        "license": "MIT",
        "devDependencies": {
          "chai": "~1.10.0",
          "coffee-script": "~1.8.0",
          "gulp": "~3.8.10",
          "gulp-coffee": "~2.2.0",
          "gulp-coffeelint": "~0.4.0",
          "gulp-mocha": "~2.0.0",
          "gulp-util": "~3.0.1",
          "mocha": "~2.0.1",
          "sinon": "~1.12.2",
          "sinon-chai": "~2.6.0"
        },
        "dependencies": {
          "punycode": "^1.3.2",
          "strip-ansi": "^3.0.1"
        }
      })
    },
    "uri-js": {
      "node_modules": {
        "punycode": {
          "package.json": JSON.stringify({
            "name": "punycode",
            "version": "2.1.1",
            "description": "A robust Punycode converter that fully complies to RFC 3492 and RFC 5891, and works on nearly all JavaScript platforms.",
            "homepage": "https://mths.be/punycode",
            "main": "punycode.js",
            "jsnext:main": "punycode.es6.js",
            "module": "punycode.es6.js",
            "engines": {
              "node": ">=6"
            },
            "keywords": [
              "punycode",
              "unicode",
              "idn",
              "idna",
              "dns",
              "url",
              "domain"
            ],
            "license": "MIT",
            "author": {
              "name": "Mathias Bynens",
              "url": "https://mathiasbynens.be/"
            },
            "contributors": [
              {
                "name": "Mathias Bynens",
                "url": "https://mathiasbynens.be/"
              }
            ],
            "repository": {
              "type": "git",
              "url": "https://github.com/bestiejs/punycode.js.git"
            },
            "bugs": "https://github.com/bestiejs/punycode.js/issues",
            "files": [
              "LICENSE-MIT.txt",
              "punycode.js",
              "punycode.es6.js"
            ],
            "scripts": {
              "test": "mocha tests",
              "prepublish": "node scripts/prepublish.js"
            },
            "devDependencies": {
              "codecov": "^1.0.1",
              "istanbul": "^0.4.1",
              "mocha": "^2.5.3"
            },
            "jspm": {
              "map": {
                "./punycode.js": {
                  "node": "@node/punycode"
                }
              }
            }
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "uri-js",
        "version": "4.2.2",
        "description": "An RFC 3986/3987 compliant, scheme extendable URI/IRI parsing/validating/resolving library for JavaScript.",
        "main": "dist/es5/uri.all.js",
        "types": "dist/es5/uri.all.d.ts",
        "directories": {
          "test": "tests"
        },
        "scripts": {
          "build:esnext": "node_modules/.bin/tsc",
          "build:es5": "node_modules/.bin/rollup -c && cp dist/esnext/uri.d.ts dist/es5/uri.all.d.ts && npm run build:es5:fix-sourcemap",
          "build:es5:fix-sourcemap": "node_modules/.bin/sorcery -i dist/es5/uri.all.js",
          "build:es5:min": "node_modules/.bin/uglifyjs dist/es5/uri.all.js --support-ie8 --output dist/es5/uri.all.min.js --in-source-map dist/es5/uri.all.js.map --source-map uri.all.min.js.map --comments --compress --mangle --pure-funcs merge subexp  && mv uri.all.min.js.map dist/es5/ && cp dist/es5/uri.all.d.ts dist/es5/uri.all.min.d.ts",
          "build": "npm run build:esnext && npm run build:es5 && npm run build:es5:min",
          "test": "node_modules/.bin/mocha -u mocha-qunit-ui dist/es5/uri.all.js tests/tests.js"
        },
        "repository": {
          "type": "git",
          "url": "http://github.com/garycourt/uri-js"
        },
        "keywords": [
          "URI",
          "IRI",
          "IDN",
          "URN",
          "UUID",
          "HTTP",
          "HTTPS",
          "MAILTO",
          "RFC3986",
          "RFC3987",
          "RFC5891",
          "RFC2616",
          "RFC2818",
          "RFC2141",
          "RFC4122",
          "RFC4291",
          "RFC5952",
          "RFC6068",
          "RFC6874"
        ],
        "author": "Gary Court <gary.court@gmail.com>",
        "license": "BSD-2-Clause",
        "bugs": {
          "url": "https://github.com/garycourt/uri-js/issues"
        },
        "homepage": "https://github.com/garycourt/uri-js",
        "devDependencies": {
          "babel-cli": "^6.26.0",
          "babel-plugin-external-helpers": "^6.22.0",
          "babel-preset-latest": "^6.24.1",
          "mocha": "^3.2.0",
          "mocha-qunit-ui": "^0.1.3",
          "rollup": "^0.41.6",
          "rollup-plugin-babel": "^2.7.1",
          "rollup-plugin-node-resolve": "^2.0.0",
          "sorcery": "^0.10.0",
          "typescript": "^2.8.1",
          "uglify-js": "^2.8.14"
        },
        "dependencies": {
          "punycode": "^2.1.0"
        }
      })
    },
    "util-deprecate": {
      "package.json": JSON.stringify({
        "name": "util-deprecate",
        "version": "1.0.2",
        "description": "The Node.js `util.deprecate()` function with browser support",
        "main": "node.js",
        "browser": "browser.js",
        "scripts": {
          "test": "echo \"Error: no test specified\" && exit 1"
        },
        "repository": {
          "type": "git",
          "url": "git://github.com/TooTallNate/util-deprecate.git"
        },
        "keywords": [
          "util",
          "deprecate",
          "browserify",
          "browser",
          "node"
        ],
        "author": "Nathan Rajlich <nathan@tootallnate.net> (http://n8.io/)",
        "license": "MIT",
        "bugs": {
          "url": "https://github.com/TooTallNate/util-deprecate/issues"
        },
        "homepage": "https://github.com/TooTallNate/util-deprecate"
      })
    },
    "uuid": {
      "package.json": JSON.stringify({
        "name": "uuid",
        "version": "3.3.2",
        "description": "RFC4122 (v1, v4, and v5) UUIDs",
        "commitlint": {
          "extends": [
            "@commitlint/config-conventional"
          ]
        },
        "keywords": [
          "uuid",
          "guid",
          "rfc4122"
        ],
        "license": "MIT",
        "bin": {
          "uuid": "./bin/uuid"
        },
        "devDependencies": {
          "@commitlint/cli": "7.0.0",
          "@commitlint/config-conventional": "7.0.1",
          "eslint": "4.19.1",
          "husky": "0.14.3",
          "mocha": "5.2.0",
          "runmd": "1.0.1",
          "standard-version": "4.4.0"
        },
        "scripts": {
          "commitmsg": "commitlint -E GIT_PARAMS",
          "test": "mocha test/test.js",
          "md": "runmd --watch --output=README.md README_js.md",
          "release": "standard-version",
          "prepare": "runmd --output=README.md README_js.md"
        },
        "browser": {
          "./lib/rng.js": "./lib/rng-browser.js",
          "./lib/sha1.js": "./lib/sha1-browser.js",
          "./lib/md5.js": "./lib/md5-browser.js"
        },
        "repository": {
          "type": "git",
          "url": "https://github.com/kelektiv/node-uuid.git"
        }
      })
    },
    "validate-npm-package-license": {
      "package.json": JSON.stringify({
        "name": "validate-npm-package-license",
        "description": "Give me a string and I'll tell you if it's a valid npm package license string",
        "version": "3.0.4",
        "author": "Kyle E. Mitchell <kyle@kemitchell.com> (https://kemitchell.com)",
        "contributors": [
          "Mark Stacey <markjstacey@gmail.com>"
        ],
        "dependencies": {
          "spdx-correct": "^3.0.0",
          "spdx-expression-parse": "^3.0.0"
        },
        "devDependencies": {
          "defence-cli": "^2.0.1",
          "replace-require-self": "^1.0.0"
        },
        "keywords": [
          "license",
          "npm",
          "package",
          "validation"
        ],
        "license": "Apache-2.0",
        "repository": "kemitchell/validate-npm-package-license.js",
        "scripts": {
          "test": "defence README.md | replace-require-self | node"
        }
      })
    },
    "verror": {
      "node_modules": {
        "extsprintf": {
          "package.json": JSON.stringify({
            "name": "extsprintf",
            "version": "1.4.0",
            "description": "extended POSIX-style sprintf",
            "main": "./lib/extsprintf.js",
            "repository": {
              "type": "git",
              "url": "git://github.com/davepacheco/node-extsprintf.git"
            },
            "engines": [
              "node >=0.6.0"
            ],
            "license": "MIT"
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "verror",
        "version": "1.10.0",
        "description": "richer JavaScript errors",
        "main": "./lib/verror.js",
        "repository": {
          "type": "git",
          "url": "git://github.com/davepacheco/node-verror.git"
        },
        "dependencies": {
          "assert-plus": "^1.0.0",
          "core-util-is": "1.0.2",
          "extsprintf": "^1.2.0"
        },
        "engines": [
          "node >=0.6.0"
        ],
        "scripts": {
          "test": "make test"
        },
        "license": "MIT"
      })
    },
    "vlq": {
      "package.json": JSON.stringify({
        "name": "vlq",
        "description": "Generate, and decode, base64 VLQ mappings for source maps and other uses",
        "author": "Rich Harris",
        "repository": "https://github.com/Rich-Harris/vlq",
        "license": "MIT",
        "version": "0.2.3",
        "main": "dist/vlq.js",
        "module": "src/vlq.js",
        "files": [
          "README.md",
          "LICENSE",
          "src/vlq.js",
          "dist/vlq.js"
        ],
        "devDependencies": {
          "eslint": "^3.19.0",
          "rollup": "^0.41.6"
        },
        "scripts": {
          "build": "rollup src/vlq.js -n vlq -f umd > dist/vlq.js",
          "lint": "eslint src",
          "test": "node test",
          "pretest": "npm run build",
          "prepublish": "npm test"
        }
      })
    },
    "which": {
      "package.json": JSON.stringify({
        "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me)",
        "name": "which",
        "description": "Like which(1) unix command. Find the first instance of an executable in the PATH.",
        "version": "2.0.1",
        "repository": {
          "type": "git",
          "url": "git://github.com/isaacs/node-which.git"
        },
        "main": "which.js",
        "bin": "./bin/which",
        "license": "ISC",
        "dependencies": {
          "isexe": "^2.0.0"
        },
        "devDependencies": {
          "mkdirp": "^0.5.0",
          "rimraf": "^2.6.2",
          "tap": "^14.6.9"
        },
        "scripts": {
          "test": "tap",
          "preversion": "npm test",
          "postversion": "npm publish",
          "prepublish": "npm run changelog",
          "prechangelog": "bash gen-changelog.sh",
          "changelog": "git add CHANGELOG.md",
          "postchangelog": "git commit -m 'update changelog - '${npm_package_version}",
          "postpublish": "git push origin --follow-tags"
        },
        "files": [
          "which.js",
          "bin/which"
        ],
        "tap": {
          "check-coverage": true
        },
        "engines": {
          "node": ">= 8"
        }
      })
    },
    "which-module": {
      "package.json": JSON.stringify({
        "name": "which-module",
        "version": "2.0.0",
        "description": "Find the module object for something that was require()d",
        "main": "index.js",
        "scripts": {
          "pretest": "standard",
          "test": "nyc ava",
          "coverage": "nyc report --reporter=text-lcov | coveralls",
          "release": "standard-version"
        },
        "files": [
          "index.js"
        ],
        "repository": {
          "type": "git",
          "url": "git+https://github.com/nexdrew/which-module.git"
        },
        "keywords": [
          "which",
          "module",
          "exports",
          "filename",
          "require",
          "reverse",
          "lookup"
        ],
        "author": "nexdrew",
        "license": "ISC",
        "bugs": {
          "url": "https://github.com/nexdrew/which-module/issues"
        },
        "homepage": "https://github.com/nexdrew/which-module#readme",
        "devDependencies": {
          "ava": "^0.19.1",
          "coveralls": "^2.13.1",
          "nyc": "^10.3.0",
          "standard": "^10.0.2",
          "standard-version": "^4.0.0"
        }
      })
    },
    "widest-line": {
      "package.json": JSON.stringify({
        "name": "widest-line",
        "version": "2.0.1",
        "description": "Get the visual width of the widest line in a string - the number of columns required to display it",
        "license": "MIT",
        "repository": "sindresorhus/widest-line",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=4"
        },
        "scripts": {
          "test": "xo && ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "string",
          "str",
          "character",
          "char",
          "unicode",
          "width",
          "visual",
          "column",
          "columns",
          "fullwidth",
          "full-width",
          "full",
          "ansi",
          "escape",
          "codes",
          "cli",
          "command-line",
          "terminal",
          "console",
          "cjk",
          "chinese",
          "japanese",
          "korean",
          "fixed-width"
        ],
        "dependencies": {
          "string-width": "^2.1.1"
        },
        "devDependencies": {
          "ava": "*",
          "xo": "*"
        }
      })
    },
    "wordwrap": {
      "package.json": JSON.stringify({
        "name": "wordwrap",
        "description": "Wrap those words. Show them at what columns to start and stop.",
        "version": "0.0.3",
        "repository": {
          "type": "git",
          "url": "git://github.com/substack/node-wordwrap.git"
        },
        "main": "./index.js",
        "keywords": [
          "word",
          "wrap",
          "rule",
          "format",
          "column"
        ],
        "directories": {
          "lib": ".",
          "example": "example",
          "test": "test"
        },
        "scripts": {
          "test": "expresso"
        },
        "devDependencies": {
          "expresso": "=0.7.x"
        },
        "engines": {
          "node": ">=0.4.0"
        },
        "license": "MIT",
        "author": {
          "name": "James Halliday",
          "email": "mail@substack.net",
          "url": "http://substack.net"
        }
      })
    },
    "wrap-ansi": {
      "node_modules": {
        "ansi-regex": {
          "package.json": JSON.stringify({
            "name": "ansi-regex",
            "version": "4.1.0",
            "description": "Regular expression for matching ANSI escape codes",
            "license": "MIT",
            "repository": "chalk/ansi-regex",
            "author": {
              "name": "Sindre Sorhus",
              "email": "sindresorhus@gmail.com",
              "url": "sindresorhus.com"
            },
            "engines": {
              "node": ">=6"
            },
            "scripts": {
              "test": "xo && ava",
              "view-supported": "node fixtures/view-codes.js"
            },
            "files": [
              "index.js"
            ],
            "keywords": [
              "ansi",
              "styles",
              "color",
              "colour",
              "colors",
              "terminal",
              "console",
              "cli",
              "string",
              "tty",
              "escape",
              "formatting",
              "rgb",
              "256",
              "shell",
              "xterm",
              "command-line",
              "text",
              "regex",
              "regexp",
              "re",
              "match",
              "test",
              "find",
              "pattern"
            ],
            "devDependencies": {
              "ava": "^0.25.0",
              "xo": "^0.23.0"
            }
          })
        },
        "string-width": {
          "package.json": JSON.stringify({
            "name": "string-width",
            "version": "3.1.0",
            "description": "Get the visual width of a string - the number of columns required to display it",
            "license": "MIT",
            "repository": "sindresorhus/string-width",
            "author": {
              "name": "Sindre Sorhus",
              "email": "sindresorhus@gmail.com",
              "url": "sindresorhus.com"
            },
            "engines": {
              "node": ">=6"
            },
            "scripts": {
              "test": "xo && ava"
            },
            "files": [
              "index.js"
            ],
            "keywords": [
              "string",
              "str",
              "character",
              "char",
              "unicode",
              "width",
              "visual",
              "column",
              "columns",
              "fullwidth",
              "full-width",
              "full",
              "ansi",
              "escape",
              "codes",
              "cli",
              "command-line",
              "terminal",
              "console",
              "cjk",
              "chinese",
              "japanese",
              "korean",
              "fixed-width"
            ],
            "dependencies": {
              "emoji-regex": "^7.0.1",
              "is-fullwidth-code-point": "^2.0.0",
              "strip-ansi": "^5.1.0"
            },
            "devDependencies": {
              "ava": "^1.0.1",
              "xo": "^0.23.0"
            }
          })
        },
        "strip-ansi": {
          "package.json": JSON.stringify({
            "name": "strip-ansi",
            "version": "5.2.0",
            "description": "Strip ANSI escape codes from a string",
            "license": "MIT",
            "repository": "chalk/strip-ansi",
            "author": {
              "name": "Sindre Sorhus",
              "email": "sindresorhus@gmail.com",
              "url": "sindresorhus.com"
            },
            "engines": {
              "node": ">=6"
            },
            "scripts": {
              "test": "xo && ava && tsd-check"
            },
            "files": [
              "index.js",
              "index.d.ts"
            ],
            "keywords": [
              "strip",
              "trim",
              "remove",
              "ansi",
              "styles",
              "color",
              "colour",
              "colors",
              "terminal",
              "console",
              "string",
              "tty",
              "escape",
              "formatting",
              "rgb",
              "256",
              "shell",
              "xterm",
              "log",
              "logging",
              "command-line",
              "text"
            ],
            "dependencies": {
              "ansi-regex": "^4.1.0"
            },
            "devDependencies": {
              "ava": "^1.3.1",
              "tsd-check": "^0.5.0",
              "xo": "^0.24.0"
            }
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "wrap-ansi",
        "version": "5.1.0",
        "description": "Wordwrap a string with ANSI escape codes",
        "license": "MIT",
        "repository": "chalk/wrap-ansi",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=6"
        },
        "scripts": {
          "test": "xo && nyc ava"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "wrap",
          "break",
          "wordwrap",
          "wordbreak",
          "linewrap",
          "ansi",
          "styles",
          "color",
          "colour",
          "colors",
          "terminal",
          "console",
          "cli",
          "string",
          "tty",
          "escape",
          "formatting",
          "rgb",
          "256",
          "shell",
          "xterm",
          "log",
          "logging",
          "command-line",
          "text"
        ],
        "dependencies": {
          "ansi-styles": "^3.2.0",
          "string-width": "^3.0.0",
          "strip-ansi": "^5.0.0"
        },
        "devDependencies": {
          "ava": "^1.2.1",
          "chalk": "^2.4.2",
          "coveralls": "^3.0.3",
          "has-ansi": "^3.0.0",
          "nyc": "^13.3.0",
          "xo": "^0.24.0"
        }
      })
    },
    "wrappy": {
      "package.json": JSON.stringify({
        "name": "wrappy",
        "version": "1.0.2",
        "description": "Callback wrapping utility",
        "main": "wrappy.js",
        "files": [
          "wrappy.js"
        ],
        "directories": {
          "test": "test"
        },
        "dependencies": {},
        "devDependencies": {
          "tap": "^2.3.1"
        },
        "scripts": {
          "test": "tap --coverage test/*.js"
        },
        "repository": {
          "type": "git",
          "url": "https://github.com/npm/wrappy"
        },
        "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me/)",
        "license": "ISC",
        "bugs": {
          "url": "https://github.com/npm/wrappy/issues"
        },
        "homepage": "https://github.com/npm/wrappy"
      })
    },
    "write-file-atomic": {
      "package.json": JSON.stringify({
        "name": "write-file-atomic",
        "version": "3.0.0",
        "description": "Write files in an atomic fashion w/configurable ownership",
        "main": "index.js",
        "scripts": {
          "pretest": "standard",
          "test": "tap",
          "posttest": "rimraf chowncopy good nochmod nochown nofsync nofsyncopt noopen norename \"norename nounlink\" nowrite",
          "preversion": "npm test",
          "postversion": "npm publish",
          "postpublish": "git push origin --follow-tags"
        },
        "repository": {
          "type": "git",
          "url": "git://github.com/npm/write-file-atomic.git"
        },
        "keywords": [
          "writeFile",
          "atomic"
        ],
        "author": "Rebecca Turner <me@re-becca.org> (http://re-becca.org)",
        "license": "ISC",
        "bugs": {
          "url": "https://github.com/npm/write-file-atomic/issues"
        },
        "homepage": "https://github.com/npm/write-file-atomic",
        "dependencies": {
          "imurmurhash": "^0.1.4",
          "is-typedarray": "^1.0.0",
          "signal-exit": "^3.0.2",
          "typedarray-to-buffer": "^3.1.5"
        },
        "devDependencies": {
          "mkdirp": "^0.5.1",
          "require-inject": "^1.4.4",
          "rimraf": "^2.6.3",
          "standard": "^12.0.1",
          "tap": "^14.1.1"
        },
        "files": [
          "index.js"
        ],
        "tap": {
          "100": true
        }
      })
    },
    "y18n": {
      "package.json": JSON.stringify({
        "name": "y18n",
        "version": "4.0.0",
        "description": "the bare-bones internationalization library used by yargs",
        "main": "index.js",
        "scripts": {
          "pretest": "standard",
          "test": "nyc mocha",
          "coverage": "nyc report --reporter=text-lcov | coveralls",
          "release": "standard-version"
        },
        "repository": {
          "type": "git",
          "url": "git@github.com:yargs/y18n.git"
        },
        "files": [
          "index.js"
        ],
        "keywords": [
          "i18n",
          "internationalization",
          "yargs"
        ],
        "author": "Ben Coe <ben@npmjs.com>",
        "license": "ISC",
        "bugs": {
          "url": "https://github.com/yargs/y18n/issues"
        },
        "homepage": "https://github.com/yargs/y18n",
        "devDependencies": {
          "chai": "^4.0.1",
          "coveralls": "^3.0.0",
          "mocha": "^4.0.1",
          "nyc": "^11.0.1",
          "rimraf": "^2.5.0",
          "standard": "^10.0.0-beta.0",
          "standard-version": "^4.2.0"
        }
      })
    },
    "yallist": {
      "package.json": JSON.stringify({
        "name": "yallist",
        "version": "4.0.0",
        "description": "Yet Another Linked List",
        "main": "yallist.js",
        "directories": {
          "test": "test"
        },
        "files": [
          "yallist.js",
          "iterator.js"
        ],
        "dependencies": {},
        "devDependencies": {
          "tap": "^12.1.0"
        },
        "scripts": {
          "test": "tap test/*.js --100",
          "preversion": "npm test",
          "postversion": "npm publish",
          "postpublish": "git push origin --all; git push origin --tags"
        },
        "repository": {
          "type": "git",
          "url": "git+https://github.com/isaacs/yallist.git"
        },
        "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me/)",
        "license": "ISC"
      })
    },
    "yaml": {
      "package.json": JSON.stringify({
        "name": "yaml",
        "version": "1.6.0",
        "license": "ISC",
        "author": "Eemeli Aro <eemeli@gmail.com>",
        "repository": "github:eemeli/yaml",
        "description": "JavaScript parser and stringifier for YAML",
        "keywords": [
          "YAML",
          "parser",
          "stringifier"
        ],
        "homepage": "https://eemeli.org/yaml/",
        "files": [
          "browser/",
          "dist/",
          "types/",
          "*.js",
          "!.*.js"
        ],
        "main": "./index.js",
        "browser": {
          "./index.js": "./browser/index.js",
          "./map.js": "./browser/map.js",
          "./pair.js": "./browser/pair.js",
          "./parse-cst.js": "./browser/parse-cst.js",
          "./scalar.js": "./browser/scalar.js",
          "./schema.js": "./browser/schema.js",
          "./seq.js": "./browser/seq.js",
          "./types.js": "./browser/types.js",
          "./types/binary.js": "./browser/types/binary.js",
          "./types/omap.js": "./browser/types/omap.js",
          "./types/pairs.js": "./browser/types/pairs.js",
          "./types/set.js": "./browser/types/set.js",
          "./types/timestamp.js": "./browser/types/timestamp.js",
          "./util.js": "./browser/util.js"
        },
        "scripts": {
          "browser:build": "BABEL_ENV=browser babel src/ --out-dir browser/dist/",
          "browser:copy": "cpy '*.js' '!*.config.js' types/ browser/ --parents",
          "dist:build": "babel src/ --out-dir dist/",
          "build": "npm run dist:build && npm run browser:build && npm run browser:copy",
          "prettier": "prettier --write \"{src,tests}/**/*.js\"",
          "lint": "eslint src/",
          "start": "npm run dist:build && node -i -e 'YAML=require(\".\")'",
          "test": "TRACE_LEVEL=log jest",
          "test:trace": "TRACE_LEVEL=trace,log jest --no-cache",
          "docs:install": "cd docs/ && bundle install",
          "docs:deploy": "cd docs/ && ./deploy.sh",
          "docs": "cd docs/ && bundle exec middleman server",
          "preversion": "npm test && npm run build",
          "prepublishOnly": "npm test && npm run build"
        },
        "browserslist": "> 0.5%, not dead",
        "jest": {
          "testMatch": [
            "**/tests/**/*.js"
          ],
          "testPathIgnorePatterns": [
            "tests/common",
            "tests/cst/common"
          ]
        },
        "prettier": {
          "semi": false,
          "singleQuote": true
        },
        "devDependencies": {
          "@babel/cli": "^7.4.4",
          "@babel/core": "^7.4.5",
          "@babel/plugin-proposal-class-properties": "^7.4.4",
          "@babel/plugin-transform-runtime": "^7.4.4",
          "@babel/preset-env": "^7.4.5",
          "babel-eslint": "^10.0.1",
          "babel-jest": "^24.8.0",
          "babel-plugin-trace": "^1.1.0",
          "common-tags": "^1.8.0",
          "cpy-cli": "^2.0.0",
          "eslint": "^5.16.0",
          "eslint-config-prettier": "^4.3.0",
          "eslint-plugin-prettier": "^3.1.0",
          "fast-check": "^1.15.1",
          "jest": "^24.8.0",
          "prettier": "^1.17.1"
        },
        "dependencies": {
          "@babel/runtime": "^7.4.5"
        },
        "engines": {
          "node": ">= 6"
        }
      })
    },
    "yapool": {
      "package.json": JSON.stringify({
        "name": "yapool",
        "version": "1.0.0",
        "description": "Yet Another object pool in JavaScript",
        "main": "index.js",
        "scripts": {
          "test": "tap test.js --100"
        },
        "repository": {
          "type": "git",
          "url": "git+https://github.com/isaacs/yapool.git"
        },
        "keywords": [],
        "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me/)",
        "license": "ISC",
        "bugs": {
          "url": "https://github.com/isaacs/yapool/issues"
        },
        "homepage": "https://github.com/isaacs/yapool#readme",
        "devDependencies": {
          "tap": "^9.0.3 || 10"
        }
      })
    },
    "yargs": {
      "node_modules": {
        "ansi-regex": {
          "package.json": JSON.stringify({
            "name": "ansi-regex",
            "version": "4.1.0",
            "description": "Regular expression for matching ANSI escape codes",
            "license": "MIT",
            "repository": "chalk/ansi-regex",
            "author": {
              "name": "Sindre Sorhus",
              "email": "sindresorhus@gmail.com",
              "url": "sindresorhus.com"
            },
            "engines": {
              "node": ">=6"
            },
            "scripts": {
              "test": "xo && ava",
              "view-supported": "node fixtures/view-codes.js"
            },
            "files": [
              "index.js"
            ],
            "keywords": [
              "ansi",
              "styles",
              "color",
              "colour",
              "colors",
              "terminal",
              "console",
              "cli",
              "string",
              "tty",
              "escape",
              "formatting",
              "rgb",
              "256",
              "shell",
              "xterm",
              "command-line",
              "text",
              "regex",
              "regexp",
              "re",
              "match",
              "test",
              "find",
              "pattern"
            ],
            "devDependencies": {
              "ava": "^0.25.0",
              "xo": "^0.23.0"
            }
          })
        },
        "cliui": {
          "package.json": JSON.stringify({
            "name": "cliui",
            "version": "5.0.0",
            "description": "easily create complex multi-column command-line-interfaces",
            "main": "index.js",
            "scripts": {
              "pretest": "standard",
              "test": "nyc mocha",
              "coverage": "nyc --reporter=text-lcov mocha | coveralls",
              "release": "standard-version"
            },
            "repository": {
              "type": "git",
              "url": "http://github.com/yargs/cliui.git"
            },
            "config": {
              "blanket": {
                "pattern": [
                  "index.js"
                ],
                "data-cover-never": [
                  "node_modules",
                  "test"
                ],
                "output-reporter": "spec"
              }
            },
            "standard": {
              "ignore": [
                "**/example/**"
              ],
              "globals": [
                "it"
              ]
            },
            "keywords": [
              "cli",
              "command-line",
              "layout",
              "design",
              "console",
              "wrap",
              "table"
            ],
            "author": "Ben Coe <ben@npmjs.com>",
            "license": "ISC",
            "dependencies": {
              "string-width": "^3.1.0",
              "strip-ansi": "^5.2.0",
              "wrap-ansi": "^5.1.0"
            },
            "devDependencies": {
              "chai": "^4.2.0",
              "chalk": "^2.4.2",
              "coveralls": "^3.0.3",
              "mocha": "^6.0.2",
              "nyc": "^13.3.0",
              "standard": "^12.0.1",
              "standard-version": "^5.0.2"
            },
            "files": [
              "index.js"
            ],
            "engine": {
              "node": ">=6"
            }
          })
        },
        "string-width": {
          "package.json": JSON.stringify({
            "name": "string-width",
            "version": "3.1.0",
            "description": "Get the visual width of a string - the number of columns required to display it",
            "license": "MIT",
            "repository": "sindresorhus/string-width",
            "author": {
              "name": "Sindre Sorhus",
              "email": "sindresorhus@gmail.com",
              "url": "sindresorhus.com"
            },
            "engines": {
              "node": ">=6"
            },
            "scripts": {
              "test": "xo && ava"
            },
            "files": [
              "index.js"
            ],
            "keywords": [
              "string",
              "str",
              "character",
              "char",
              "unicode",
              "width",
              "visual",
              "column",
              "columns",
              "fullwidth",
              "full-width",
              "full",
              "ansi",
              "escape",
              "codes",
              "cli",
              "command-line",
              "terminal",
              "console",
              "cjk",
              "chinese",
              "japanese",
              "korean",
              "fixed-width"
            ],
            "dependencies": {
              "emoji-regex": "^7.0.1",
              "is-fullwidth-code-point": "^2.0.0",
              "strip-ansi": "^5.1.0"
            },
            "devDependencies": {
              "ava": "^1.0.1",
              "xo": "^0.23.0"
            }
          })
        },
        "strip-ansi": {
          "package.json": JSON.stringify({
            "name": "strip-ansi",
            "version": "5.2.0",
            "description": "Strip ANSI escape codes from a string",
            "license": "MIT",
            "repository": "chalk/strip-ansi",
            "author": {
              "name": "Sindre Sorhus",
              "email": "sindresorhus@gmail.com",
              "url": "sindresorhus.com"
            },
            "engines": {
              "node": ">=6"
            },
            "scripts": {
              "test": "xo && ava && tsd-check"
            },
            "files": [
              "index.js",
              "index.d.ts"
            ],
            "keywords": [
              "strip",
              "trim",
              "remove",
              "ansi",
              "styles",
              "color",
              "colour",
              "colors",
              "terminal",
              "console",
              "string",
              "tty",
              "escape",
              "formatting",
              "rgb",
              "256",
              "shell",
              "xterm",
              "log",
              "logging",
              "command-line",
              "text"
            ],
            "dependencies": {
              "ansi-regex": "^4.1.0"
            },
            "devDependencies": {
              "ava": "^1.3.1",
              "tsd-check": "^0.5.0",
              "xo": "^0.24.0"
            }
          })
        }
      },
      "package.json": JSON.stringify({
        "name": "yargs",
        "version": "13.2.4",
        "description": "yargs the modern, pirate-themed, successor to optimist.",
        "main": "./index.js",
        "contributors": [
          {
            "name": "Yargs Contributors",
            "url": "https://github.com/yargs/yargs/graphs/contributors"
          }
        ],
        "files": [
          "index.js",
          "yargs.js",
          "lib",
          "locales",
          "completion.sh.hbs",
          "completion.zsh.hbs",
          "LICENSE"
        ],
        "dependencies": {
          "cliui": "^5.0.0",
          "find-up": "^3.0.0",
          "get-caller-file": "^2.0.1",
          "os-locale": "^3.1.0",
          "require-directory": "^2.1.1",
          "require-main-filename": "^2.0.0",
          "set-blocking": "^2.0.0",
          "string-width": "^3.0.0",
          "which-module": "^2.0.0",
          "y18n": "^4.0.0",
          "yargs-parser": "^13.1.0"
        },
        "devDependencies": {
          "chai": "^4.2.0",
          "chalk": "^2.4.2",
          "coveralls": "^3.0.3",
          "cpr": "^3.0.1",
          "cross-spawn": "^6.0.4",
          "es6-promise": "^4.2.5",
          "hashish": "0.0.4",
          "mocha": "^5.2.0",
          "nyc": "^14.1.0",
          "rimraf": "^2.6.3",
          "standard": "^12.0.1",
          "standard-version": "^6.0.1",
          "which": "^1.3.1",
          "yargs-test-extends": "^1.0.1"
        },
        "scripts": {
          "pretest": "standard",
          "test": "nyc --cache mocha --require ./test/before.js --timeout=12000 --check-leaks",
          "coverage": "nyc report --reporter=text-lcov | coveralls",
          "release": "standard-version"
        },
        "repository": {
          "type": "git",
          "url": "https://github.com/yargs/yargs.git"
        },
        "homepage": "https://yargs.js.org/",
        "standard": {
          "ignore": [
            "**/example/**"
          ]
        },
        "keywords": [
          "argument",
          "args",
          "option",
          "parser",
          "parsing",
          "cli",
          "command"
        ],
        "license": "MIT",
        "engine": {
          "node": ">=6"
        }
      })
    },
    "yargs-parser": {
      "package.json": JSON.stringify({
        "name": "yargs-parser",
        "version": "13.1.1",
        "description": "the mighty option parser used by yargs",
        "main": "index.js",
        "scripts": {
          "test": "nyc mocha test/*.js",
          "posttest": "standard",
          "coverage": "nyc report --reporter=text-lcov | coveralls",
          "release": "standard-version"
        },
        "repository": {
          "url": "git@github.com:yargs/yargs-parser.git"
        },
        "keywords": [
          "argument",
          "parser",
          "yargs",
          "command",
          "cli",
          "parsing",
          "option",
          "args",
          "argument"
        ],
        "author": "Ben Coe <ben@npmjs.com>",
        "license": "ISC",
        "devDependencies": {
          "chai": "^4.2.0",
          "coveralls": "^3.0.2",
          "mocha": "^5.2.0",
          "nyc": "^14.1.0",
          "standard": "^12.0.1",
          "standard-version": "^6.0.0"
        },
        "dependencies": {
          "camelcase": "^5.0.0",
          "decamelize": "^1.2.0"
        },
        "files": [
          "lib",
          "index.js"
        ],
        "engine": {
          "node": ">=6"
        }
      })
    },
    "yn": {
      "package.json": JSON.stringify({
        "name": "yn",
        "version": "3.1.0",
        "description": "Parse yes/no like values",
        "license": "MIT",
        "repository": "sindresorhus/yn",
        "author": {
          "name": "Sindre Sorhus",
          "email": "sindresorhus@gmail.com",
          "url": "sindresorhus.com"
        },
        "engines": {
          "node": ">=6"
        },
        "scripts": {
          "test": "xo && ava && tsd"
        },
        "files": [
          "index.js",
          "lenient.js",
          "index.d.ts"
        ],
        "keywords": [
          "yn",
          "yes",
          "no",
          "cli",
          "prompt",
          "validate",
          "input",
          "answer",
          "true",
          "false",
          "parse",
          "lenient"
        ],
        "devDependencies": {
          "ava": "^1.4.1",
          "tsd": "^0.7.2",
          "xo": "^0.24.0"
        }
      })
    },
    "yoga-layout-prebuilt": {
      "package.json": JSON.stringify({
        "name": "yoga-layout-prebuilt",
        "version": "1.9.3",
        "description": "Prebuilt yoga-layout package",
        "license": "MIT",
        "repository": "vadimdemedes/yoga-layout-prebuilt",
        "author": {
          "name": "Vadim Demedes",
          "email": "vdemedes@gmail.com",
          "url": "github.com/vadimdemedes"
        },
        "engines": {
          "node": ">=8"
        },
        "scripts": {
          "test": "xo && ava",
          "prepublishOnly": "./build.sh"
        },
        "main": "yoga-layout/dist/entry-browser",
        "files": [
          "yoga-layout"
        ],
        "keywords": [
          "yoga",
          "yoga-layout"
        ],
        "devDependencies": {
          "ava": "^0.25.0",
          "xo": "^0.21.0"
        },
        "xo": {
          "ignores": [
            "yoga-layout"
          ]
        },
        "dependencies": {}
      })
    }
  },
  "package.json": JSON.stringify({
    "name": "tap",
    "version": "14.9.2",
    "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me)",
    "description": "A Test-Anything-Protocol library for JavaScript",
    "homepage": "http://www.node-tap.org/",
    "bin": {
      "tap": "bin/run.js"
    },
    "main": "lib/tap.js",
    "engines": {
      "node": ">=8"
    },
    "dependencies": {
      "async-hook-domain": "^1.1.2",
      "bind-obj-methods": "^2.0.0",
      "browser-process-hrtime": "^1.0.0",
      "chokidar": "^3.0.2",
      "color-support": "^1.1.0",
      "coveralls": "^3.0.6",
      "diff": "^4.0.1",
      "esm": "^3.2.25",
      "findit": "^2.0.0",
      "flow-remove-types": "^2.107.0",
      "foreground-child": "^1.3.3",
      "fs-exists-cached": "^1.0.0",
      "function-loop": "^1.0.2",
      "glob": "^7.1.4",
      "import-jsx": "^2.0.0",
      "ink": "^2.3.0",
      "isexe": "^2.0.0",
      "istanbul-lib-processinfo": "^1.0.0",
      "jackspeak": "^1.4.0",
      "minipass": "^3.0.0",
      "mkdirp": "^0.5.1",
      "nyc": "^14.1.1",
      "opener": "^1.5.1",
      "own-or": "^1.0.0",
      "own-or-env": "^1.0.1",
      "react": "^16.9.0",
      "rimraf": "^2.7.1",
      "signal-exit": "^3.0.0",
      "source-map-support": "^0.5.16",
      "stack-utils": "^1.0.2",
      "tap-mocha-reporter": "^5.0.0",
      "tap-parser": "^10.0.1",
      "tap-yaml": "^1.0.0",
      "tcompare": "^2.3.0",
      "treport": "^0.4.2",
      "trivial-deferred": "^1.0.1",
      "ts-node": "^8.3.0",
      "typescript": "^3.6.3",
      "which": "^2.0.1",
      "write-file-atomic": "^3.0.0",
      "yaml": "^1.6.0",
      "yapool": "^1.0.0"
    },
    "keywords": [
      "assert",
      "tap",
      "test",
      "testing"
    ],
    "license": "ISC",
    "repository": "https://github.com/tapjs/node-tap.git",
    "scripts": {
      "snap": "bash scripts/snap.sh",
      "test": "node bin/run.js test -M coverage-map.js",
      "unit": "bash scripts/unit.sh",
      "posttest": "rm -rf cli-tests-*",
      "postunit": "npm run posttest",
      "t": "node bin/run.js test -J -sfails.txt",
      "preversion": "npm test",
      "postversion": "npm publish",
      "postpublish": "bash postpublish.sh",
      "www:build": "cd docs; npm ci; npm run build",
      "www:develop": "cd docs; npm run develop",
      "start": "npm run www:develop",
      "www:serve": "cd docs; npm run serve"
    },
    "tap": {
      "esm": false,
      "test-ignore": "/(^|/)cli-tests-[0-9]+/",
      "check-coverage": true
    },
    "nyc": {
      "include": [
        "bin/run.js",
        "bin/jsx.js",
        "bin/jack.js",
        "lib/*.js"
      ]
    },
    "files": [
      "bin/run.js",
      "bin/jsx.js",
      "bin/jack.js",
      "lib/*.js"
    ],
    "bundleDependencies": [
      "treport",
      "ink"
    ],
    "funding": {
      "url": "https://github.com/sponsors/isaacs"
    }
  }),
  "yarn.lock": `# THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
# yarn lockfile v1


"@babel/code-frame@^7.0.0":
  version "7.0.0"
  resolved "https://registry.yarnpkg.com/@babel/code-frame/-/code-frame-7.0.0.tgz"
  integrity sha512-OfC2uemaknXr87bdLUkWog7nYuliM9Ij5HUcajsVcMCpQrcLmtxRbVFTIqmcSkSeYRBFBRxs2FiUqFJDLdiebA==
  dependencies:
    "@babel/highlight" "^7.0.0"

"@babel/generator@^7.4.0", "@babel/generator@^7.5.0":
  version "7.5.0"
  resolved "https://registry.yarnpkg.com/@babel/generator/-/generator-7.5.0.tgz"
  integrity sha512-1TTVrt7J9rcG5PMjvO7VEG3FrEoEJNHxumRq66GemPmzboLWtIjjcJgk8rokuAS7IiRSpgVSu5Vb9lc99iJkOA==
  dependencies:
    "@babel/types" "^7.5.0"
    jsesc "^2.5.1"
    lodash "^4.17.11"
    source-map "^0.5.0"
    trim-right "^1.0.1"

"@babel/helper-function-name@^7.1.0":
  version "7.1.0"
  resolved "https://registry.yarnpkg.com/@babel/helper-function-name/-/helper-function-name-7.1.0.tgz"
  integrity sha512-A95XEoCpb3TO+KZzJ4S/5uW5fNe26DjBGqf1o9ucyLyCmi1dXq/B3c8iaWTfBk3VvetUxl16e8tIrd5teOCfGw==
  dependencies:
    "@babel/helper-get-function-arity" "^7.0.0"
    "@babel/template" "^7.1.0"
    "@babel/types" "^7.0.0"

"@babel/helper-get-function-arity@^7.0.0":
  version "7.0.0"
  resolved "https://registry.yarnpkg.com/@babel/helper-get-function-arity/-/helper-get-function-arity-7.0.0.tgz"
  integrity sha512-r2DbJeg4svYvt3HOS74U4eWKsUAMRH01Z1ds1zx8KNTPtpTL5JAsdFv8BNyOpVqdFhHkkRDIg5B4AsxmkjAlmQ==
  dependencies:
    "@babel/types" "^7.0.0"

"@babel/helper-split-export-declaration@^7.4.4":
  version "7.4.4"
  resolved "https://registry.yarnpkg.com/@babel/helper-split-export-declaration/-/helper-split-export-declaration-7.4.4.tgz"
  integrity sha512-Ro/XkzLf3JFITkW6b+hNxzZ1n5OQ80NvIUdmHspih1XAhtN3vPTuUFT4eQnela+2MaZ5ulH+iyP513KJrxbN7Q==
  dependencies:
    "@babel/types" "^7.4.4"

"@babel/highlight@^7.0.0":
  version "7.5.0"
  resolved "https://registry.yarnpkg.com/@babel/highlight/-/highlight-7.5.0.tgz"
  integrity sha512-7dV4eu9gBxoM0dAnj/BCFDW9LFU0zvTrkq0ugM7pnHEgguOEeOz1so2ZghEdzviYzQEED0r4EAgpsBChKy1TRQ==
  dependencies:
    chalk "^2.0.0"
    esutils "^2.0.2"
    js-tokens "^4.0.0"

"@babel/parser@^7.4.3", "@babel/parser@^7.4.4", "@babel/parser@^7.5.0":
  version "7.5.0"
  resolved "https://registry.yarnpkg.com/@babel/parser/-/parser-7.5.0.tgz"
  integrity sha512-I5nW8AhGpOXGCCNYGc+p7ExQIBxRFnS2fd/d862bNOKvmoEPjYPcfIjsfdy0ujagYOIYPczKgD9l3FsgTkAzKA==

"@babel/runtime@^7.4.5":
  version "7.5.2"
  resolved "https://registry.yarnpkg.com/@babel/runtime/-/runtime-7.5.2.tgz"
  integrity sha512-9M29wrrP7//JBGX70+IrDuD1w4iOYhUGpJNMQJVNAXue+cFeFlMTqBECouIziXPUphlgrfjcfiEpGX4t0WGK4g==
  dependencies:
    regenerator-runtime "^0.13.2"

"@babel/template@^7.1.0", "@babel/template@^7.4.0":
  version "7.4.4"
  resolved "https://registry.yarnpkg.com/@babel/template/-/template-7.4.4.tgz"
  integrity sha512-CiGzLN9KgAvgZsnivND7rkA+AeJ9JB0ciPOD4U59GKbQP2iQl+olF1l76kJOupqidozfZ32ghwBEJDhnk9MEcw==
  dependencies:
    "@babel/code-frame" "^7.0.0"
    "@babel/parser" "^7.4.4"
    "@babel/types" "^7.4.4"

"@babel/traverse@^7.4.3":
  version "7.5.0"
  resolved "https://registry.yarnpkg.com/@babel/traverse/-/traverse-7.5.0.tgz"
  integrity sha512-SnA9aLbyOCcnnbQEGwdfBggnc142h/rbqqsXcaATj2hZcegCl903pUD/lfpsNBlBSuWow/YDfRyJuWi2EPR5cg==
  dependencies:
    "@babel/code-frame" "^7.0.0"
    "@babel/generator" "^7.5.0"
    "@babel/helper-function-name" "^7.1.0"
    "@babel/helper-split-export-declaration" "^7.4.4"
    "@babel/parser" "^7.5.0"
    "@babel/types" "^7.5.0"
    debug "^4.1.0"
    globals "^11.1.0"
    lodash "^4.17.11"

"@babel/types@^7.0.0", "@babel/types@^7.4.0", "@babel/types@^7.4.4", "@babel/types@^7.5.0":
  version "7.5.0"
  resolved "https://registry.yarnpkg.com/@babel/types/-/types-7.5.0.tgz"
  integrity sha512-UFpDVqRABKsW01bvw7/wSUe56uy6RXM5+VJibVVAybDGxEW25jdwiFJEf7ASvSaC7sN7rbE/l3cLp2izav+CtQ==
  dependencies:
    esutils "^2.0.2"
    lodash "^4.17.11"
    to-fast-properties "^2.0.0"

"@types/prop-types@*":
  version "15.7.1"
  resolved "https://registry.yarnpkg.com/@types/prop-types/-/prop-types-15.7.1.tgz"
  integrity sha512-CFzn9idOEpHrgdw8JsoTkaDDyRWk1jrzIV8djzcgpq0y9tG4B4lFT+Nxh52DVpDXV+n4+NPNv7M1Dj5uMp6XFg==

"@types/react@^16.8.12", "@types/react@^16.8.6":
  version "16.8.23"
  resolved "https://registry.yarnpkg.com/@types/react/-/react-16.8.23.tgz"
  integrity sha512-abkEOIeljniUN9qB5onp++g0EY38h7atnDHxwKUFz1r3VH1+yG1OKi2sNPTyObL40goBmfKFpdii2lEzwLX1cA==
  dependencies:
    "@types/prop-types" "*"
    csstype "^2.2.0"

ajv@^6.5.5:
  version "6.10.1"
  resolved "https://registry.yarnpkg.com/ajv/-/ajv-6.10.1.tgz"
  integrity sha512-w1YQaVGNC6t2UCPjEawK/vo/dG8OOrVtUmhBT1uJJYxbl5kU2Tj3v6LGqBcsysN1yhuCStJCCA3GqdvKY8sqXQ==
  dependencies:
    fast-deep-equal "^2.0.1"
    fast-json-stable-stringify "^2.0.0"
    json-schema-traverse "^0.4.1"
    uri-js "^4.2.2"

ansi-escapes@^3.2.0:
  version "3.2.0"
  resolved "https://registry.yarnpkg.com/ansi-escapes/-/ansi-escapes-3.2.0.tgz"
  integrity sha512-cBhpre4ma+U0T1oM5fXg7Dy1Jw7zzwv7lt/GoCpr+hDQJoYnKVPLL4dCvSEFMmQurOQvSrwT7SL/DAlhBI97RQ==

ansi-regex@^2.0.0:
  version "2.1.1"
  resolved "https://registry.yarnpkg.com/ansi-regex/-/ansi-regex-2.1.1.tgz"
  integrity sha1-w7M6te42DYbg5ijwRorn7yfWVN8=

ansi-regex@^3.0.0:
  version "3.0.0"
  resolved "https://registry.yarnpkg.com/ansi-regex/-/ansi-regex-3.0.0.tgz"
  integrity sha1-7QMXwyIGT3lGbAKWa922Bas32Zg=

ansi-regex@^4.1.0:
  version "4.1.0"
  resolved "https://registry.yarnpkg.com/ansi-regex/-/ansi-regex-4.1.0.tgz"
  integrity sha512-1apePfXM1UOSqw0o9IiFAovVz9M5S1Dg+4TrDwfMewQ6p/rmMueb7tWZjQ1rx4Loy1ArBggoqGpfqqdI4rondg==

ansi-styles@^2.2.1:
  version "2.2.1"
  resolved "https://registry.yarnpkg.com/ansi-styles/-/ansi-styles-2.2.1.tgz"
  integrity sha1-tDLdM1i2NM914eRmQ2gkBTPB3b4=

ansi-styles@^3.2.0, ansi-styles@^3.2.1:
  version "3.2.1"
  resolved "https://registry.yarnpkg.com/ansi-styles/-/ansi-styles-3.2.1.tgz"
  integrity sha512-VT0ZI6kZRdTh8YyJw3SMbYm/u+NqfsAxEpWO0Pf9sq8/e94WxxOpPKx9FR1FlyCtOVDNOQ+8ntlqFxiRc+r5qA==
  dependencies:
    color-convert "^1.9.0"

ansicolors@~0.3.2:
  version "0.3.2"
  resolved "https://registry.yarnpkg.com/ansicolors/-/ansicolors-0.3.2.tgz"
  integrity sha1-ZlWX3oap/+Oqm/vmyuXG6kJrSXk=

anymatch@~3.1.1:
  version "3.1.1"
  resolved "https://registry.yarnpkg.com/anymatch/-/anymatch-3.1.1.tgz"
  integrity sha512-mM8522psRCqzV+6LhomX5wgp25YVibjh8Wj23I5RPkPppSVSjyKD2A2mBJmWGa+KN7f2D6LNh9jkBCeyLktzjg==
  dependencies:
    normalize-path "^3.0.0"
    picomatch "^2.0.4"

append-transform@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/append-transform/-/append-transform-1.0.0.tgz"
  integrity sha512-P009oYkeHyU742iSZJzZZywj4QRJdnTWffaKuJQLablCZ1uz6/cW4yaRgcDaoQ+uwOxxnt0gRUcwfsNP2ri0gw==
  dependencies:
    default-require-extensions "^2.0.0"

archy@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/archy/-/archy-1.0.0.tgz"
  integrity sha1-+cjBN1fMHde8N5rHeyxipcKGjEA=

arg@^4.1.0:
  version "4.1.0"
  resolved "https://registry.yarnpkg.com/arg/-/arg-4.1.0.tgz"
  integrity sha512-ZWc51jO3qegGkVh8Hwpv636EkbesNV5ZNQPCtRa+0qytRYPEs9IYT9qITY9buezqUH5uqyzlWLcufrzU2rffdg==

argparse@^1.0.7:
  version "1.0.10"
  resolved "https://registry.yarnpkg.com/argparse/-/argparse-1.0.10.tgz"
  integrity sha512-o5Roy6tNG4SL/FOkCAN6RzjiakZS25RLYFrcMttJqbdd8BWrnA+fGz57iN5Pb06pvBGvl5gQ0B48dJlslXvoTg==
  dependencies:
    sprintf-js "~1.0.2"

arrify@^1.0.1:
  version "1.0.1"
  resolved "https://registry.yarnpkg.com/arrify/-/arrify-1.0.1.tgz"
  integrity sha1-iYUI2iIm84DfkEcoRWhJwVAaSw0=

asn1@~0.2.3:
  version "0.2.4"
  resolved "https://registry.yarnpkg.com/asn1/-/asn1-0.2.4.tgz"
  integrity sha512-jxwzQpLQjSmWXgwaCZE9Nz+glAG01yF1QnWgbhGwHI5A6FRIEY6IVqtHhIepHqI7/kyEyQEagBC5mBEFlIYvdg==
  dependencies:
    safer-buffer "~2.1.0"

assert-plus@1.0.0, assert-plus@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/assert-plus/-/assert-plus-1.0.0.tgz"
  integrity sha1-8S4PPF13sLHN2RRpQuTpbB5N1SU=

astral-regex@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/astral-regex/-/astral-regex-1.0.0.tgz"
  integrity sha512-+Ryf6g3BKoRc7jfp7ad8tM4TtMiaWvbF/1/sQcZPkkS7ag3D5nMBCe2UfOTONtAkaG0tO0ij3C5Lwmf1EiyjHg==

async-hook-domain@^1.1.2:
  version "1.1.3"
  resolved "https://registry.yarnpkg.com/async-hook-domain/-/async-hook-domain-1.1.3.tgz"
  integrity sha512-ZovMxSbADV3+biB7oR1GL5lGyptI24alp0LWHlmz1OFc5oL47pz3EiIF6nXOkDW7yLqih4NtsiYduzdDW0i+Wg==
  dependencies:
    source-map-support "^0.5.11"

asynckit@^0.4.0:
  version "0.4.0"
  resolved "https://registry.yarnpkg.com/asynckit/-/asynckit-0.4.0.tgz"
  integrity sha1-x57Zf380y48robyXkLzDZkdLS3k=

auto-bind@^2.0.0:
  version "2.1.0"
  resolved "https://registry.yarnpkg.com/auto-bind/-/auto-bind-2.1.0.tgz"
  integrity sha512-qZuFvkes1eh9lB2mg8/HG18C+5GIO51r+RrCSst/lh+i5B1CtVlkhTE488M805Nr3dKl0sM/pIFKSKUIlg3zUg==
  dependencies:
    "@types/react" "^16.8.12"

aws-sign2@~0.7.0:
  version "0.7.0"
  resolved "https://registry.yarnpkg.com/aws-sign2/-/aws-sign2-0.7.0.tgz"
  integrity sha1-tG6JCTSpWR8tL2+G1+ap8bP+dqg=

aws4@^1.8.0:
  version "1.8.0"
  resolved "https://registry.yarnpkg.com/aws4/-/aws4-1.8.0.tgz"
  integrity sha512-ReZxvNHIOv88FlT7rxcXIIC0fPt4KZqZbOlivyWtXLt8ESx84zd3kMC6iK5jVeS2qt+g7ftS7ye4fi06X5rtRQ==

babel-code-frame@^6.26.0:
  version "6.26.0"
  resolved "https://registry.yarnpkg.com/babel-code-frame/-/babel-code-frame-6.26.0.tgz"
  integrity sha1-Y/1D99weO7fONZR9uP42mj9Yx0s=
  dependencies:
    chalk "^1.1.3"
    esutils "^2.0.2"
    js-tokens "^3.0.2"

babel-core@^6.25.0, babel-core@^6.26.0:
  version "6.26.3"
  resolved "https://registry.yarnpkg.com/babel-core/-/babel-core-6.26.3.tgz"
  integrity sha512-6jyFLuDmeidKmUEb3NM+/yawG0M2bDZ9Z1qbZP59cyHLz8kYGKYwpJP0UwUKKUiTRNvxfLesJnTedqczP7cTDA==
  dependencies:
    babel-code-frame "^6.26.0"
    babel-generator "^6.26.0"
    babel-helpers "^6.24.1"
    babel-messages "^6.23.0"
    babel-register "^6.26.0"
    babel-runtime "^6.26.0"
    babel-template "^6.26.0"
    babel-traverse "^6.26.0"
    babel-types "^6.26.0"
    babylon "^6.18.0"
    convert-source-map "^1.5.1"
    debug "^2.6.9"
    json5 "^0.5.1"
    lodash "^4.17.4"
    minimatch "^3.0.4"
    path-is-absolute "^1.0.1"
    private "^0.1.8"
    slash "^1.0.0"
    source-map "^0.5.7"

babel-generator@^6.26.0:
  version "6.26.1"
  resolved "https://registry.yarnpkg.com/babel-generator/-/babel-generator-6.26.1.tgz"
  integrity sha512-HyfwY6ApZj7BYTcJURpM5tznulaBvyio7/0d4zFOeMPUmfxkCjHocCuoLa2SAGzBI8AREcH3eP3758F672DppA==
  dependencies:
    babel-messages "^6.23.0"
    babel-runtime "^6.26.0"
    babel-types "^6.26.0"
    detect-indent "^4.0.0"
    jsesc "^1.3.0"
    lodash "^4.17.4"
    source-map "^0.5.7"
    trim-right "^1.0.1"

babel-helper-builder-react-jsx@^6.24.1:
  version "6.26.0"
  resolved "https://registry.yarnpkg.com/babel-helper-builder-react-jsx/-/babel-helper-builder-react-jsx-6.26.0.tgz"
  integrity sha1-Of+DE7dci2Xc7/HzHTg+D/KkCKA=
  dependencies:
    babel-runtime "^6.26.0"
    babel-types "^6.26.0"
    esutils "^2.0.2"

babel-helpers@^6.24.1:
  version "6.24.1"
  resolved "https://registry.yarnpkg.com/babel-helpers/-/babel-helpers-6.24.1.tgz"
  integrity sha1-NHHenK7DiOXIUOWX5Yom3fN2ArI=
  dependencies:
    babel-runtime "^6.22.0"
    babel-template "^6.24.1"

babel-messages@^6.23.0:
  version "6.23.0"
  resolved "https://registry.yarnpkg.com/babel-messages/-/babel-messages-6.23.0.tgz"
  integrity sha1-8830cDhYA1sqKVHG7F7fbGLyYw4=
  dependencies:
    babel-runtime "^6.22.0"

babel-plugin-syntax-jsx@^6.8.0:
  version "6.18.0"
  resolved "https://registry.yarnpkg.com/babel-plugin-syntax-jsx/-/babel-plugin-syntax-jsx-6.18.0.tgz"
  integrity sha1-CvMqmm4Tyno/1QaeYtew9Y0NiUY=

babel-plugin-syntax-object-rest-spread@^6.8.0:
  version "6.13.0"
  resolved "https://registry.yarnpkg.com/babel-plugin-syntax-object-rest-spread/-/babel-plugin-syntax-object-rest-spread-6.13.0.tgz"
  integrity sha1-/WU28rzhODb/o6VFjEkDpZe7O/U=

babel-plugin-transform-es2015-destructuring@^6.23.0:
  version "6.23.0"
  resolved "https://registry.yarnpkg.com/babel-plugin-transform-es2015-destructuring/-/babel-plugin-transform-es2015-destructuring-6.23.0.tgz"
  integrity sha1-mXux8auWf2gtKwh2/jWNYOdlxW0=
  dependencies:
    babel-runtime "^6.22.0"

babel-plugin-transform-object-rest-spread@^6.23.0:
  version "6.26.0"
  resolved "https://registry.yarnpkg.com/babel-plugin-transform-object-rest-spread/-/babel-plugin-transform-object-rest-spread-6.26.0.tgz"
  integrity sha1-DzZpLVD+9rfi1LOsFHgTepY7ewY=
  dependencies:
    babel-plugin-syntax-object-rest-spread "^6.8.0"
    babel-runtime "^6.26.0"

babel-plugin-transform-react-jsx@^6.24.1:
  version "6.24.1"
  resolved "https://registry.yarnpkg.com/babel-plugin-transform-react-jsx/-/babel-plugin-transform-react-jsx-6.24.1.tgz"
  integrity sha1-hAoCjn30YN/DotKfDA2R9jduZqM=
  dependencies:
    babel-helper-builder-react-jsx "^6.24.1"
    babel-plugin-syntax-jsx "^6.8.0"
    babel-runtime "^6.22.0"

babel-register@^6.26.0:
  version "6.26.0"
  resolved "https://registry.yarnpkg.com/babel-register/-/babel-register-6.26.0.tgz"
  integrity sha1-btAhFz4vy0htestFxgCahW9kcHE=
  dependencies:
    babel-core "^6.26.0"
    babel-runtime "^6.26.0"
    core-js "^2.5.0"
    home-or-tmp "^2.0.0"
    lodash "^4.17.4"
    mkdirp "^0.5.1"
    source-map-support "^0.4.15"

babel-runtime@^6.22.0, babel-runtime@^6.26.0:
  version "6.26.0"
  resolved "https://registry.yarnpkg.com/babel-runtime/-/babel-runtime-6.26.0.tgz"
  integrity sha1-llxwWGaOgrVde/4E/yM3vItWR/4=
  dependencies:
    core-js "^2.4.0"
    regenerator-runtime "^0.11.0"

babel-template@^6.24.1, babel-template@^6.26.0:
  version "6.26.0"
  resolved "https://registry.yarnpkg.com/babel-template/-/babel-template-6.26.0.tgz"
  integrity sha1-3gPi0WOWsGn0bdn/+FIfsaDjXgI=
  dependencies:
    babel-runtime "^6.26.0"
    babel-traverse "^6.26.0"
    babel-types "^6.26.0"
    babylon "^6.18.0"
    lodash "^4.17.4"

babel-traverse@^6.26.0:
  version "6.26.0"
  resolved "https://registry.yarnpkg.com/babel-traverse/-/babel-traverse-6.26.0.tgz"
  integrity sha1-RqnL1+3MYsjlwGTi0tjQ9ANXZu4=
  dependencies:
    babel-code-frame "^6.26.0"
    babel-messages "^6.23.0"
    babel-runtime "^6.26.0"
    babel-types "^6.26.0"
    babylon "^6.18.0"
    debug "^2.6.8"
    globals "^9.18.0"
    invariant "^2.2.2"
    lodash "^4.17.4"

babel-types@^6.26.0:
  version "6.26.0"
  resolved "https://registry.yarnpkg.com/babel-types/-/babel-types-6.26.0.tgz"
  integrity sha1-o7Bz+Uq0nrb6Vc1lInozQ4BjJJc=
  dependencies:
    babel-runtime "^6.26.0"
    esutils "^2.0.2"
    lodash "^4.17.4"
    to-fast-properties "^1.0.3"

babylon@^6.18.0:
  version "6.18.0"
  resolved "https://registry.yarnpkg.com/babylon/-/babylon-6.18.0.tgz"
  integrity sha512-q/UEjfGJ2Cm3oKV71DJz9d25TPnq5rhBVL2Q4fA5wcC3jcrdn7+SssEybFIxwAvvP+YCsCYNKughoF33GxgycQ==

balanced-match@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/balanced-match/-/balanced-match-1.0.0.tgz"
  integrity sha1-ibTRmasr7kneFk6gK4nORi1xt2c=

bcrypt-pbkdf@^1.0.0:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/bcrypt-pbkdf/-/bcrypt-pbkdf-1.0.2.tgz"
  integrity sha1-pDAdOJtqQ/m2f/PKEaP2Y342Dp4=
  dependencies:
    tweetnacl "^0.14.3"

binary-extensions@^2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/binary-extensions/-/binary-extensions-2.0.0.tgz"
  integrity sha512-Phlt0plgpIIBOGTT/ehfFnbNlfsDEiqmzE2KRXoX1bLIlir4X/MR+zSyBEkL05ffWgnRSf/DXv+WrUAVr93/ow==

bind-obj-methods@^2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/bind-obj-methods/-/bind-obj-methods-2.0.0.tgz"
  integrity sha512-3/qRXczDi2Cdbz6jE+W3IflJOutRVica8frpBn14de1mBOkzDo+6tY33kNhvkw54Kn3PzRRD2VnGbGPcTAk4sw==

brace-expansion@^1.1.7:
  version "1.1.11"
  resolved "https://registry.yarnpkg.com/brace-expansion/-/brace-expansion-1.1.11.tgz"
  integrity sha512-iCuPHDFgrHX7H2vEI/5xpz07zSHB00TpugqhmYtVmMO6518mCuRMoOYFldEBl0g187ufozdaHgWKcYFb61qGiA==
  dependencies:
    balanced-match "^1.0.0"
    concat-map "0.0.1"

braces@~3.0.2:
  version "3.0.2"
  resolved "https://registry.yarnpkg.com/braces/-/braces-3.0.2.tgz"
  integrity sha512-b8um+L1RzM3WDSzvhm6gIz1yfTbBt6YTlcEKAvsmqCZZFw46z626lVj9j1yEPW33H5H+lBQpZMP1k8l+78Ha0A==
  dependencies:
    fill-range "^7.0.1"

browser-process-hrtime@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/browser-process-hrtime/-/browser-process-hrtime-1.0.0.tgz"
  integrity sha512-9o5UecI3GhkpM6DrXr69PblIuWxPKk9Y0jHBRhdocZ2y7YECBFCsHm79Pr3OyR2AvjhDkabFJaDJMYRazHgsow==

buffer-from@^1.0.0:
  version "1.1.1"
  resolved "https://registry.yarnpkg.com/buffer-from/-/buffer-from-1.1.1.tgz"
  integrity sha512-MQcXEUbCKtEo7bhqEs6560Hyd4XaovZlO/k9V3hjVUF/zwW7KBVdSK4gIt/bzwS9MbR5qob+F5jusZsb0YQK2A==

caching-transform@^3.0.2:
  version "3.0.2"
  resolved "https://registry.yarnpkg.com/caching-transform/-/caching-transform-3.0.2.tgz"
  integrity sha512-Mtgcv3lh3U0zRii/6qVgQODdPA4G3zhG+jtbCWj39RXuUFTMzH0vcdMtaJS1jPowd+It2Pqr6y3NJMQqOqCE2w==
  dependencies:
    hasha "^3.0.0"
    make-dir "^2.0.0"
    package-hash "^3.0.0"
    write-file-atomic "^2.4.2"

caller-callsite@^2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/caller-callsite/-/caller-callsite-2.0.0.tgz"
  integrity sha1-hH4PzgoiN1CpoCfFSzNzGtMVQTQ=
  dependencies:
    callsites "^2.0.0"

caller-path@^2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/caller-path/-/caller-path-2.0.0.tgz"
  integrity sha1-Ro+DBE42mrIBD6xfBs7uFbsssfQ=
  dependencies:
    caller-callsite "^2.0.0"

callsites@^2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/callsites/-/callsites-2.0.0.tgz"
  integrity sha1-BuuE8A7qQT2oav/vrL/7Ngk7PFA=

camelcase@^5.0.0:
  version "5.3.1"
  resolved "https://registry.yarnpkg.com/camelcase/-/camelcase-5.3.1.tgz"
  integrity sha512-L28STB170nwWS63UjtlEOE3dldQApaJXZkOI1uMFfzf3rRuPegHaHesyee+YxQ+W6SvRDQV6UrdOdRiR153wJg==

cardinal@^2.1.1:
  version "2.1.1"
  resolved "https://registry.yarnpkg.com/cardinal/-/cardinal-2.1.1.tgz"
  integrity sha1-fMEFXYItISlU0HsIXeolHMe8VQU=
  dependencies:
    ansicolors "~0.3.2"
    redeyed "~2.1.0"

caseless@~0.12.0:
  version "0.12.0"
  resolved "https://registry.yarnpkg.com/caseless/-/caseless-0.12.0.tgz"
  integrity sha1-G2gcIf+EAzyCZUMJBolCDRhxUdw=

chalk@^1.1.3:
  version "1.1.3"
  resolved "https://registry.yarnpkg.com/chalk/-/chalk-1.1.3.tgz"
  integrity sha1-qBFcVeSnAv5NFQq9OHKCKn4J/Jg=
  dependencies:
    ansi-styles "^2.2.1"
    escape-string-regexp "^1.0.2"
    has-ansi "^2.0.0"
    strip-ansi "^3.0.0"
    supports-color "^2.0.0"

chalk@^2.0.0, chalk@^2.4.1, chalk@^2.4.2:
  version "2.4.2"
  resolved "https://registry.yarnpkg.com/chalk/-/chalk-2.4.2.tgz"
  integrity sha512-Mti+f9lpJNcwF4tWV8/OrTTtF1gZi+f8FqlyAdouralcFWFQWF2+NgCHShjkCb+IFBLq9buZwE1xckQU4peSuQ==
  dependencies:
    ansi-styles "^3.2.1"
    escape-string-regexp "^1.0.5"
    supports-color "^5.3.0"

chokidar@^3.0.2:
  version "3.3.0"
  resolved "https://registry.yarnpkg.com/chokidar/-/chokidar-3.3.0.tgz"
  integrity sha512-dGmKLDdT3Gdl7fBUe8XK+gAtGmzy5Fn0XkkWQuYxGIgWVPPse2CxFA5mtrlD0TOHaHjEUqkWNyP1XdHoJES/4A==
  dependencies:
    anymatch "~3.1.1"
    braces "~3.0.2"
    glob-parent "~5.1.0"
    is-binary-path "~2.1.0"
    is-glob "~4.0.1"
    normalize-path "~3.0.0"
    readdirp "~3.2.0"
  optionalDependencies:
    fsevents "~2.1.1"

ci-info@^2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/ci-info/-/ci-info-2.0.0.tgz"
  integrity sha512-5tK7EtrZ0N+OLFMthtqOj4fI2Jeb88C4CAZPu25LDVUgXJ0A3Js4PMGqrn0JU1W0Mh1/Z8wZzYPxqUrXeBboCQ==

cli-cursor@^2.1.0:
  version "2.1.0"
  resolved "https://registry.yarnpkg.com/cli-cursor/-/cli-cursor-2.1.0.tgz"
  integrity sha1-s12sN2R5+sw+lHR9QdDQ9SOP/LU=
  dependencies:
    restore-cursor "^2.0.0"

cli-truncate@^1.1.0:
  version "1.1.0"
  resolved "https://registry.yarnpkg.com/cli-truncate/-/cli-truncate-1.1.0.tgz"
  integrity sha512-bAtZo0u82gCfaAGfSNxUdTI9mNyza7D8w4CVCcaOsy7sgwDzvx6ekr6cuWJqY3UGzgnQ1+4wgENup5eIhgxEYA==
  dependencies:
    slice-ansi "^1.0.0"
    string-width "^2.0.0"

cliui@^4.1.0:
  version "4.1.0"
  resolved "https://registry.yarnpkg.com/cliui/-/cliui-4.1.0.tgz"
  integrity sha512-4FG+RSG9DL7uEwRUZXZn3SS34DiDPfzP0VOiEwtUWlE+AR2EIg+hSyvrIgUUfhdgR/UkAeW2QHgeP+hWrXs7jQ==
  dependencies:
    string-width "^2.1.1"
    strip-ansi "^4.0.0"
    wrap-ansi "^2.0.0"

cliui@^5.0.0:
  version "5.0.0"
  resolved "https://registry.yarnpkg.com/cliui/-/cliui-5.0.0.tgz"
  integrity sha512-PYeGSEmmHM6zvoef2w8TPzlrnNpXIjTipYK780YswmIP9vjxmd6Y2a3CB2Ks6/AU8NHjZugXvo8w3oWM2qnwXA==
  dependencies:
    string-width "^3.1.0"
    strip-ansi "^5.2.0"
    wrap-ansi "^5.1.0"

code-point-at@^1.0.0:
  version "1.1.0"
  resolved "https://registry.yarnpkg.com/code-point-at/-/code-point-at-1.1.0.tgz"
  integrity sha1-DQcLTQQ6W+ozovGkDi7bPZpMz3c=

color-convert@^1.9.0:
  version "1.9.3"
  resolved "https://registry.yarnpkg.com/color-convert/-/color-convert-1.9.3.tgz"
  integrity sha512-QfAUtd+vFdAtFQcC8CCyYt1fYWxSqAiK2cSD6zDB8N3cpsEBAvRxp9zOGg6G/SHHJYAT88/az/IuDGALsNVbGg==
  dependencies:
    color-name "1.1.3"

color-name@1.1.3:
  version "1.1.3"
  resolved "https://registry.yarnpkg.com/color-name/-/color-name-1.1.3.tgz"
  integrity sha1-p9BVi9icQveV3UIyj3QIMcpTvCU=

color-support@^1.1.0:
  version "1.1.3"
  resolved "https://registry.yarnpkg.com/color-support/-/color-support-1.1.3.tgz"
  integrity sha512-qiBjkpbMLO/HL68y+lh4q0/O1MZFj2RX6X/KmMa3+gJD3z+WwI1ZzDHysvqHGS3mP6mznPckpXmw1nI9cJjyRg==

combined-stream@^1.0.6, combined-stream@~1.0.6:
  version "1.0.8"
  resolved "https://registry.yarnpkg.com/combined-stream/-/combined-stream-1.0.8.tgz"
  integrity sha512-FQN4MRfuJeHf7cBbBMJFXhKSDq+2kAArBlmRBvcvFE5BB1HZKXtSFASDhdlz9zOYwxh8lDdnvmMOe/+5cdoEdg==
  dependencies:
    delayed-stream "~1.0.0"

commander@~2.20.0:
  version "2.20.0"
  resolved "https://registry.yarnpkg.com/commander/-/commander-2.20.0.tgz"
  integrity sha512-7j2y+40w61zy6YC2iRNpUe/NwhNyoXrYpHMrSunaMG64nRnaf96zO/KMQR4OyN/UnE5KLyEBnKHd4aG3rskjpQ==

commondir@^1.0.1:
  version "1.0.1"
  resolved "https://registry.yarnpkg.com/commondir/-/commondir-1.0.1.tgz"
  integrity sha1-3dgA2gxmEnOTzKWVDqloo6rxJTs=

concat-map@0.0.1:
  version "0.0.1"
  resolved "https://registry.yarnpkg.com/concat-map/-/concat-map-0.0.1.tgz"
  integrity sha1-2Klr13/Wjfd5OnMDajug1UBdR3s=

convert-source-map@^1.5.1, convert-source-map@^1.6.0:
  version "1.6.0"
  resolved "https://registry.yarnpkg.com/convert-source-map/-/convert-source-map-1.6.0.tgz"
  integrity sha512-eFu7XigvxdZ1ETfbgPBohgyQ/Z++C0eEhTor0qRwBw9unw+L0/6V8wkSuGgzdThkiS5lSpdptOQPD8Ak40a+7A==
  dependencies:
    safe-buffer "~5.1.1"

core-js@^2.4.0, core-js@^2.5.0:
  version "2.6.9"
  resolved "https://registry.yarnpkg.com/core-js/-/core-js-2.6.9.tgz"
  integrity sha512-HOpZf6eXmnl7la+cUdMnLvUxKNqLUzJvgIziQ0DiF3JwSImNphIqdGqzj6hIKyX04MmV0poclQ7+wjWvxQyR2A==

core-util-is@1.0.2, core-util-is@~1.0.0:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/core-util-is/-/core-util-is-1.0.2.tgz"
  integrity sha1-tf1UIgqivFq1eqtxQMlAdUUDwac=

coveralls@^3.0.6:
  version "3.0.7"
  resolved "https://registry.yarnpkg.com/coveralls/-/coveralls-3.0.7.tgz"
  integrity sha512-mUuH2MFOYB2oBaA4D4Ykqi9LaEYpMMlsiOMJOrv358yAjP6enPIk55fod2fNJ8AvwoYXStWQls37rA+s5e7boA==
  dependencies:
    growl "~> 1.10.0"
    js-yaml "^3.13.1"
    lcov-parse "^0.0.10"
    log-driver "^1.2.7"
    minimist "^1.2.0"
    request "^2.86.0"

cp-file@^6.2.0:
  version "6.2.0"
  resolved "https://registry.yarnpkg.com/cp-file/-/cp-file-6.2.0.tgz"
  integrity sha512-fmvV4caBnofhPe8kOcitBwSn2f39QLjnAnGq3gO9dfd75mUytzKNZB1hde6QHunW2Rt+OwuBOMc3i1tNElbszA==
  dependencies:
    graceful-fs "^4.1.2"
    make-dir "^2.0.0"
    nested-error-stacks "^2.0.0"
    pify "^4.0.1"
    safe-buffer "^5.0.1"

cross-spawn@^4:
  version "4.0.2"
  resolved "https://registry.yarnpkg.com/cross-spawn/-/cross-spawn-4.0.2.tgz"
  integrity sha1-e5JHYhwjrf3ThWAEqCPL45dCTUE=
  dependencies:
    lru-cache "^4.0.1"
    which "^1.2.9"

cross-spawn@^6.0.0, cross-spawn@^6.0.5:
  version "6.0.5"
  resolved "https://registry.yarnpkg.com/cross-spawn/-/cross-spawn-6.0.5.tgz"
  integrity sha512-eTVLrBSt7fjbDygz805pMnstIs2VTBNkRm0qxZd+M7A5XDdxVRWO5MxGBXZhjY4cqLYLdtrGqRf8mBPmzwSpWQ==
  dependencies:
    nice-try "^1.0.4"
    path-key "^2.0.1"
    semver "^5.5.0"
    shebang-command "^1.2.0"
    which "^1.2.9"

csstype@^2.2.0:
  version "2.6.6"
  resolved "https://registry.yarnpkg.com/csstype/-/csstype-2.6.6.tgz"
  integrity sha512-RpFbQGUE74iyPgvr46U9t1xoQBM8T4BL8SxrN66Le2xYAPSaDJJKeztV3awugusb3g3G9iL8StmkBBXhcbbXhg==

dashdash@^1.12.0:
  version "1.14.1"
  resolved "https://registry.yarnpkg.com/dashdash/-/dashdash-1.14.1.tgz"
  integrity sha1-hTz6D3y+L+1d4gMmuN1YEDX24vA=
  dependencies:
    assert-plus "^1.0.0"

debug@^2.1.3, debug@^2.6.8, debug@^2.6.9:
  version "2.6.9"
  resolved "https://registry.yarnpkg.com/debug/-/debug-2.6.9.tgz"
  integrity sha512-bC7ElrdJaJnPbAP+1EotYvqZsb3ecl5wi6Bfi6BJTUcNowp6cvspg0jXznRTKDjm/E7AdgFBVeAPVMNcKGsHMA==
  dependencies:
    ms "2.0.0"

debug@^4.1.0, debug@^4.1.1:
  version "4.1.1"
  resolved "https://registry.yarnpkg.com/debug/-/debug-4.1.1.tgz"
  integrity sha512-pYAIzeRo8J6KPEaJ0VWOh5Pzkbw/RetuzehGM7QRRX5he4fPHx2rdKMB256ehJCkX+XRQm16eZLqLNS8RSZXZw==
  dependencies:
    ms "^2.1.1"

decamelize@^1.2.0:
  version "1.2.0"
  resolved "https://registry.yarnpkg.com/decamelize/-/decamelize-1.2.0.tgz"
  integrity sha1-9lNNFRSCabIDUue+4m9QH5oZEpA=

default-require-extensions@^2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/default-require-extensions/-/default-require-extensions-2.0.0.tgz"
  integrity sha1-9fj7sYp9bVCyH2QfZJ67Uiz+JPc=
  dependencies:
    strip-bom "^3.0.0"

delayed-stream@~1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/delayed-stream/-/delayed-stream-1.0.0.tgz"
  integrity sha1-3zrhmayt+31ECqrgsp4icrJOxhk=

detect-indent@^4.0.0:
  version "4.0.0"
  resolved "https://registry.yarnpkg.com/detect-indent/-/detect-indent-4.0.0.tgz"
  integrity sha1-920GQ1LN9Docts5hnE7jqUdd4gg=
  dependencies:
    repeating "^2.0.0"

diff@^1.3.2:
  version "1.4.0"
  resolved "https://registry.yarnpkg.com/diff/-/diff-1.4.0.tgz"
  integrity sha1-fyjS657nsVqX79ic5j3P2qPMur8=

diff@^4.0.1:
  version "4.0.1"
  resolved "https://registry.yarnpkg.com/diff/-/diff-4.0.1.tgz"
  integrity sha512-s2+XdvhPCOF01LRQBC8hf4vhbVmI2CGS5aZnxLJlT5FtdhPCDFq80q++zK2KlrVorVDdL5BOGZ/VfLrVtYNF+Q==

ecc-jsbn@~0.1.1:
  version "0.1.2"
  resolved "https://registry.yarnpkg.com/ecc-jsbn/-/ecc-jsbn-0.1.2.tgz"
  integrity sha1-OoOpBOVDUyh4dMVkt1SThoSamMk=
  dependencies:
    jsbn "~0.1.0"
    safer-buffer "^2.1.0"

emoji-regex@^7.0.1:
  version "7.0.3"
  resolved "https://registry.yarnpkg.com/emoji-regex/-/emoji-regex-7.0.3.tgz"
  integrity sha512-CwBLREIQ7LvYFB0WyRvwhq5N5qPhc6PMjD6bYggFlI5YyDgl+0vxq5VHbMOFqLg7hfWzmu8T5Z1QofhmTIhItA==

end-of-stream@^1.1.0:
  version "1.4.1"
  resolved "https://registry.yarnpkg.com/end-of-stream/-/end-of-stream-1.4.1.tgz"
  integrity sha512-1MkrZNvWTKCaigbn+W15elq2BB/L22nqrSY5DKlo3X6+vclJm8Bb5djXJBmEX6fS3+zCh/F4VBK5Z2KxJt4s2Q==
  dependencies:
    once "^1.4.0"

error-ex@^1.3.1:
  version "1.3.2"
  resolved "https://registry.yarnpkg.com/error-ex/-/error-ex-1.3.2.tgz"
  integrity sha512-7dFHNmqeFSEt2ZBsCriorKnn3Z2pj+fd9kmI6QoWw4//DL+icEBfc0U7qJCisqrTsKTjw4fNFy2pW9OqStD84g==
  dependencies:
    is-arrayish "^0.2.1"

es6-error@^4.0.1:
  version "4.1.1"
  resolved "https://registry.yarnpkg.com/es6-error/-/es6-error-4.1.1.tgz"
  integrity sha512-Um/+FxMr9CISWh0bi5Zv0iOD+4cFh5qLeks1qhAopKVAJw3drgKbKySikp7wGhDL0HPeaja0P5ULZrxLkniUVg==

escape-string-regexp@^1.0.2, escape-string-regexp@^1.0.3, escape-string-regexp@^1.0.5:
  version "1.0.5"
  resolved "https://registry.yarnpkg.com/escape-string-regexp/-/escape-string-regexp-1.0.5.tgz"
  integrity sha1-G2HAViGQqN/2rjuyzwIAyhMLhtQ=

esm@^3.2.25:
  version "3.2.25"
  resolved "https://registry.yarnpkg.com/esm/-/esm-3.2.25.tgz"
  integrity sha512-U1suiZ2oDVWv4zPO56S0NcR5QriEahGtdN2OR6FiOG4WJvcjBVFB0qI4+eKoWFH483PKGuLuu6V8Z4T5g63UVA==

esprima@^4.0.0, esprima@~4.0.0:
  version "4.0.1"
  resolved "https://registry.yarnpkg.com/esprima/-/esprima-4.0.1.tgz"
  integrity sha512-eGuFFw7Upda+g4p+QHvnW0RyTX/SVeJBDM/gCtMARO0cLuT2HcEKnTPvhjV6aGeqrCB/sbNop0Kszm0jsaWU4A==

esutils@^2.0.2:
  version "2.0.2"
  resolved "https://registry.yarnpkg.com/esutils/-/esutils-2.0.2.tgz"
  integrity sha1-Cr9PHKpbyx96nYrMbepPqqBLrJs=

events-to-array@^1.0.1:
  version "1.1.2"
  resolved "https://registry.yarnpkg.com/events-to-array/-/events-to-array-1.1.2.tgz"
  integrity sha1-LUH1Y+H+QA7Uli/hpNXGp1Od9/Y=

execa@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/execa/-/execa-1.0.0.tgz"
  integrity sha512-adbxcyWV46qiHyvSp50TKt05tB4tK3HcmF7/nxfAdhnox83seTDbwnaqKO4sXRy7roHAIFqJP/Rw/AuEbX61LA==
  dependencies:
    cross-spawn "^6.0.0"
    get-stream "^4.0.0"
    is-stream "^1.1.0"
    npm-run-path "^2.0.0"
    p-finally "^1.0.0"
    signal-exit "^3.0.0"
    strip-eof "^1.0.0"

extend@~3.0.2:
  version "3.0.2"
  resolved "https://registry.yarnpkg.com/extend/-/extend-3.0.2.tgz"
  integrity sha512-fjquC59cD7CyW6urNXK0FBufkZcoiGG80wTuPujX590cB5Ttln20E2UB4S/WARVqhXffZl2LNgS+gQdPIIim/g==

extsprintf@1.3.0:
  version "1.3.0"
  resolved "https://registry.yarnpkg.com/extsprintf/-/extsprintf-1.3.0.tgz"
  integrity sha1-lpGEQOMEGnpBT4xS48V06zw+HgU=

extsprintf@^1.2.0:
  version "1.4.0"
  resolved "https://registry.yarnpkg.com/extsprintf/-/extsprintf-1.4.0.tgz"
  integrity sha1-4mifjzVvrWLMplo6kcXfX5VRaS8=

fast-deep-equal@^2.0.1:
  version "2.0.1"
  resolved "https://registry.yarnpkg.com/fast-deep-equal/-/fast-deep-equal-2.0.1.tgz"
  integrity sha1-ewUhjd+WZ79/Nwv3/bLLFf3Qqkk=

fast-json-stable-stringify@^2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/fast-json-stable-stringify/-/fast-json-stable-stringify-2.0.0.tgz"
  integrity sha1-1RQsDK7msRifh9OnYREGT4bIu/I=

fill-range@^7.0.1:
  version "7.0.1"
  resolved "https://registry.yarnpkg.com/fill-range/-/fill-range-7.0.1.tgz"
  integrity sha512-qOo9F+dMUmC2Lcb4BbVvnKJxTPjCm+RRpe4gDuGrzkL7mEVl/djYSu2OdQ2Pa302N4oqkSg9ir6jaLWJ2USVpQ==
  dependencies:
    to-regex-range "^5.0.1"

find-cache-dir@^2.1.0:
  version "2.1.0"
  resolved "https://registry.yarnpkg.com/find-cache-dir/-/find-cache-dir-2.1.0.tgz"
  integrity sha512-Tq6PixE0w/VMFfCgbONnkiQIVol/JJL7nRMi20fqzA4NRs9AfeqMGeRdPi3wIhYkxjeBaWh2rxwapn5Tu3IqOQ==
  dependencies:
    commondir "^1.0.1"
    make-dir "^2.0.0"
    pkg-dir "^3.0.0"

find-up@^3.0.0:
  version "3.0.0"
  resolved "https://registry.yarnpkg.com/find-up/-/find-up-3.0.0.tgz"
  integrity sha512-1yD6RmLI1XBfxugvORwlck6f75tYL+iR0jqwsOrOxMZyGYqUuDhJ0l4AXdO1iX/FTs9cBAMEk1gWSEx1kSbylg==
  dependencies:
    locate-path "^3.0.0"

findit@^2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/findit/-/findit-2.0.0.tgz"
  integrity sha1-ZQnwEmr0wXhVHPqZOU4DLhOk1W4=

flow-parser@^0.112.0:
  version "0.112.0"
  resolved "https://registry.yarnpkg.com/flow-parser/-/flow-parser-0.112.0.tgz"
  integrity sha512-sxjnwhR76B/fUN6n/XerYzn8R1HvtVo3SM8Il3WiZ4nkAlb2BBzKe1TSVKGSyZgD6FW9Bsxom/57ktkqrqmXGA==

flow-remove-types@^2.107.0:
  version "2.112.0"
  resolved "https://registry.yarnpkg.com/flow-remove-types/-/flow-remove-types-2.112.0.tgz"
  integrity sha512-h3bwcfh41nR9kvlhZFr5ySGmzzOyG4VUsnN4OBl9R6anbWAiX4H5lPhKTwZ7AelWF8Rtqmw/Vnq+VLEMg7PdAw==
  dependencies:
    flow-parser "^0.112.0"
    pirates "^3.0.2"
    vlq "^0.2.1"

foreground-child@^1.3.3, foreground-child@^1.5.6:
  version "1.5.6"
  resolved "https://registry.yarnpkg.com/foreground-child/-/foreground-child-1.5.6.tgz"
  integrity sha1-T9ca0t/elnibmApcCilZN8svXOk=
  dependencies:
    cross-spawn "^4"
    signal-exit "^3.0.0"

forever-agent@~0.6.1:
  version "0.6.1"
  resolved "https://registry.yarnpkg.com/forever-agent/-/forever-agent-0.6.1.tgz"
  integrity sha1-+8cfDEGt6zf5bFd60e1C2P2sypE=

form-data@~2.3.2:
  version "2.3.3"
  resolved "https://registry.yarnpkg.com/form-data/-/form-data-2.3.3.tgz"
  integrity sha512-1lLKB2Mu3aGP1Q/2eCOx0fNbRMe7XdwktwOruhfqqd0rIJWwN4Dh+E3hrPSlDCXnSR7UtZ1N38rVXm+6+MEhJQ==
  dependencies:
    asynckit "^0.4.0"
    combined-stream "^1.0.6"
    mime-types "^2.1.12"

fs-exists-cached@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/fs-exists-cached/-/fs-exists-cached-1.0.0.tgz"
  integrity sha1-zyVVTKBQ3EmuZla0HeQiWJidy84=

fs.realpath@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/fs.realpath/-/fs.realpath-1.0.0.tgz"
  integrity sha1-FQStJSMVjKpA20onh8sBQRmU6k8=

fsevents@~2.1.1:
  version "2.1.2"
  resolved "https://registry.yarnpkg.com/fsevents/-/fsevents-2.1.2.tgz"
  integrity sha512-R4wDiBwZ0KzpgOWetKDug1FZcYhqYnUYKtfZYt4mD5SBz76q0KR4Q9o7GIPamsVPGmW3EYPPJ0dOOjvx32ldZA==

function-loop@^1.0.2:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/function-loop/-/function-loop-1.0.2.tgz"
  integrity sha512-Iw4MzMfS3udk/rqxTiDDCllhGwlOrsr50zViTOO/W6lS/9y6B1J0BD2VZzrnWUYBJsl3aeqjgR5v7bWWhZSYbA==

get-caller-file@^2.0.1:
  version "2.0.5"
  resolved "https://registry.yarnpkg.com/get-caller-file/-/get-caller-file-2.0.5.tgz"
  integrity sha512-DyFP3BM/3YHTQOCUL/w0OZHR0lpKeGrxotcHWcqNEdnltqFwXVfhEBQ94eIo34AfQpo0rGki4cyIiftY06h2Fg==

get-stream@^4.0.0:
  version "4.1.0"
  resolved "https://registry.yarnpkg.com/get-stream/-/get-stream-4.1.0.tgz"
  integrity sha512-GMat4EJ5161kIy2HevLlr4luNjBgvmj413KaQA7jt4V8B4RDsfpHk7WQ9GVqfYyyx8OS/L66Kox+rJRNklLK7w==
  dependencies:
    pump "^3.0.0"

getpass@^0.1.1:
  version "0.1.7"
  resolved "https://registry.yarnpkg.com/getpass/-/getpass-0.1.7.tgz"
  integrity sha1-Xv+OPmhNVprkyysSgmBOi6YhSfo=
  dependencies:
    assert-plus "^1.0.0"

glob-parent@~5.1.0:
  version "5.1.0"
  resolved "https://registry.yarnpkg.com/glob-parent/-/glob-parent-5.1.0.tgz"
  integrity sha512-qjtRgnIVmOfnKUE3NJAQEdk+lKrxfw8t5ke7SXtfMTHcjsBfOfWXCQfdb30zfDoZQ2IRSIiidmjtbHZPZ++Ihw==
  dependencies:
    is-glob "^4.0.1"

glob@^7.0.5, glob@^7.1.3, glob@^7.1.4:
  version "7.1.4"
  resolved "https://registry.yarnpkg.com/glob/-/glob-7.1.4.tgz"
  integrity sha512-hkLPepehmnKk41pUGm3sYxoFs/umurYfYJCerbXEyFIWcAzvpipAgVkBqqT9RBKMGjnq6kMuyYwha6csxbiM1A==
  dependencies:
    fs.realpath "^1.0.0"
    inflight "^1.0.4"
    inherits "2"
    minimatch "^3.0.4"
    once "^1.3.0"
    path-is-absolute "^1.0.0"

globals@^11.1.0:
  version "11.12.0"
  resolved "https://registry.yarnpkg.com/globals/-/globals-11.12.0.tgz"
  integrity sha512-WOBp/EEGUiIsJSp7wcv/y6MO+lV9UoncWqxuFfm8eBwzWNgyfBd6Gz+IeKQ9jCmyhoH99g15M3T+QaVHFjizVA==

globals@^9.18.0:
  version "9.18.0"
  resolved "https://registry.yarnpkg.com/globals/-/globals-9.18.0.tgz"
  integrity sha512-S0nG3CLEQiY/ILxqtztTWH/3iRRdyBLw6KMDxnKMchrtbj2OFmehVh0WUCfW3DUrIgx/qFrJPICrq4Z4sTR9UQ==

graceful-fs@^4.1.11, graceful-fs@^4.1.15, graceful-fs@^4.1.2:
  version "4.2.0"
  resolved "https://registry.yarnpkg.com/graceful-fs/-/graceful-fs-4.2.0.tgz"
  integrity sha512-jpSvDPV4Cq/bgtpndIWbI5hmYxhQGHPC4d4cqBPb4DLniCfhJokdXhwhaDuLBGLQdvvRum/UiX6ECVIPvDXqdg==

"growl@~> 1.10.0":
  version "1.10.5"
  resolved "https://registry.yarnpkg.com/growl/-/growl-1.10.5.tgz"
  integrity sha512-qBr4OuELkhPenW6goKVXiv47US3clb3/IbuWF9KNKEijAy9oeHxU9IgzjvJhHkUzhaj7rOUD7+YGWqUjLp5oSA==

handlebars@^4.1.2:
  version "4.1.2"
  resolved "https://registry.yarnpkg.com/handlebars/-/handlebars-4.1.2.tgz"
  integrity sha512-nvfrjqvt9xQ8Z/w0ijewdD/vvWDTOweBUm96NTr66Wfvo1mJenBLwcYmPs3TIBP5ruzYGD7Hx/DaM9RmhroGPw==
  dependencies:
    neo-async "^2.6.0"
    optimist "^0.6.1"
    source-map "^0.6.1"
  optionalDependencies:
    uglify-js "^3.1.4"

har-schema@^2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/har-schema/-/har-schema-2.0.0.tgz"
  integrity sha1-qUwiJOvKwEeCoNkDVSHyRzW37JI=

har-validator@~5.1.0:
  version "5.1.3"
  resolved "https://registry.yarnpkg.com/har-validator/-/har-validator-5.1.3.tgz"
  integrity sha512-sNvOCzEQNr/qrvJgc3UG/kD4QtlHycrzwS+6mfTrrSq97BvaYcPZZI1ZSqGSPR73Cxn4LKTD4PttRwfU7jWq5g==
  dependencies:
    ajv "^6.5.5"
    har-schema "^2.0.0"

has-ansi@^2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/has-ansi/-/has-ansi-2.0.0.tgz"
  integrity sha1-NPUEnOHs3ysGSa8+8k5F7TVBbZE=
  dependencies:
    ansi-regex "^2.0.0"

has-flag@^3.0.0:
  version "3.0.0"
  resolved "https://registry.yarnpkg.com/has-flag/-/has-flag-3.0.0.tgz"
  integrity sha1-tdRU3CGZriJWmfNGfloH87lVuv0=

hasha@^3.0.0:
  version "3.0.0"
  resolved "https://registry.yarnpkg.com/hasha/-/hasha-3.0.0.tgz"
  integrity sha1-UqMvq4Vp1BymmmH/GiFPjrfIvTk=
  dependencies:
    is-stream "^1.0.1"

home-or-tmp@^2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/home-or-tmp/-/home-or-tmp-2.0.0.tgz"
  integrity sha1-42w/LSyufXRqhX440Y1fMqeILbg=
  dependencies:
    os-homedir "^1.0.0"
    os-tmpdir "^1.0.1"

hosted-git-info@^2.1.4:
  version "2.7.1"
  resolved "https://registry.yarnpkg.com/hosted-git-info/-/hosted-git-info-2.7.1.tgz"
  integrity sha512-7T/BxH19zbcCTa8XkMlbK5lTo1WtgkFi3GvdWEyNuc4Vex7/9Dqbnpsf4JMydcfj9HCg4zUWFTL3Za6lapg5/w==

http-signature@~1.2.0:
  version "1.2.0"
  resolved "https://registry.yarnpkg.com/http-signature/-/http-signature-1.2.0.tgz"
  integrity sha1-muzZJRFHcvPZW2WmCruPfBj7rOE=
  dependencies:
    assert-plus "^1.0.0"
    jsprim "^1.2.2"
    sshpk "^1.7.0"

import-jsx@^2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/import-jsx/-/import-jsx-2.0.0.tgz"
  integrity sha512-xmrgtiRnAdjIaRzKwsHut54FA8nx59WqN4MpQvPFr/8yD6BamavkmKHrA5dotAlnIiF4uqMzg/lA5yhPdpIXsA==
  dependencies:
    babel-core "^6.25.0"
    babel-plugin-transform-es2015-destructuring "^6.23.0"
    babel-plugin-transform-object-rest-spread "^6.23.0"
    babel-plugin-transform-react-jsx "^6.24.1"
    caller-path "^2.0.0"
    resolve-from "^3.0.0"

imurmurhash@^0.1.4:
  version "0.1.4"
  resolved "https://registry.yarnpkg.com/imurmurhash/-/imurmurhash-0.1.4.tgz"
  integrity sha1-khi5srkoojixPcT7a21XbyMUU+o=

inflight@^1.0.4:
  version "1.0.6"
  resolved "https://registry.yarnpkg.com/inflight/-/inflight-1.0.6.tgz"
  integrity sha1-Sb1jMdfQLQwJvJEKEHW6gWW1bfk=
  dependencies:
    once "^1.3.0"
    wrappy "1"

inherits@2, inherits@~2.0.3:
  version "2.0.4"
  resolved "https://registry.yarnpkg.com/inherits/-/inherits-2.0.4.tgz"
  integrity sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ==

ink@^2.1.1, ink@^2.3.0:
  version "2.3.0"
  resolved "https://registry.yarnpkg.com/ink/-/ink-2.3.0.tgz"
  integrity sha512-931rgXHAS3hM++8ygWPOBeHOFwTzHh3pDAVZtiBVOUH6tVvJijym43ODUy22ySo2NwYUFeR/Zj3xuWzBEKMiHw==
  dependencies:
    "@types/react" "^16.8.6"
    arrify "^1.0.1"
    auto-bind "^2.0.0"
    chalk "^2.4.1"
    cli-cursor "^2.1.0"
    cli-truncate "^1.1.0"
    is-ci "^2.0.0"
    lodash.throttle "^4.1.1"
    log-update "^3.0.0"
    prop-types "^15.6.2"
    react-reconciler "^0.20.0"
    scheduler "^0.13.2"
    signal-exit "^3.0.2"
    slice-ansi "^1.0.0"
    string-length "^2.0.0"
    widest-line "^2.0.0"
    wrap-ansi "^5.0.0"
    yoga-layout-prebuilt "^1.9.3"

invariant@^2.2.2:
  version "2.2.4"
  resolved "https://registry.yarnpkg.com/invariant/-/invariant-2.2.4.tgz"
  integrity sha512-phJfQVBuaJM5raOpJjSfkiD6BpbCE4Ns//LaXl6wGYtUBY83nWS6Rf9tXm2e8VaK60JEjYldbPif/A2B1C2gNA==
  dependencies:
    loose-envify "^1.0.0"

invert-kv@^2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/invert-kv/-/invert-kv-2.0.0.tgz"
  integrity sha512-wPVv/y/QQ/Uiirj/vh3oP+1Ww+AWehmi1g5fFWGPF6IpCBCDVrhgHRMvrLfdYcwDh3QJbGXDW4JAuzxElLSqKA==

is-arrayish@^0.2.1:
  version "0.2.1"
  resolved "https://registry.yarnpkg.com/is-arrayish/-/is-arrayish-0.2.1.tgz"
  integrity sha1-d8mYQFJ6qOyxqLppe4BkWnqSap0=

is-binary-path@~2.1.0:
  version "2.1.0"
  resolved "https://registry.yarnpkg.com/is-binary-path/-/is-binary-path-2.1.0.tgz"
  integrity sha512-ZMERYes6pDydyuGidse7OsHxtbI7WVeUEozgR/g7rd0xUimYNlvZRE/K2MgZTjWy725IfelLeVcEM97mmtRGXw==
  dependencies:
    binary-extensions "^2.0.0"

is-ci@^2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/is-ci/-/is-ci-2.0.0.tgz"
  integrity sha512-YfJT7rkpQB0updsdHLGWrvhBJfcfzNNawYDNIyQXJz0IViGf75O8EBPKSdvw2rF+LGCsX4FZ8tcr3b19LcZq4w==
  dependencies:
    ci-info "^2.0.0"

is-extglob@^2.1.1:
  version "2.1.1"
  resolved "https://registry.yarnpkg.com/is-extglob/-/is-extglob-2.1.1.tgz"
  integrity sha1-qIwCU1eR8C7TfHahueqXc8gz+MI=

is-finite@^1.0.0:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/is-finite/-/is-finite-1.0.2.tgz"
  integrity sha1-zGZ3aVYCvlUO8R6LSqYwU0K20Ko=
  dependencies:
    number-is-nan "^1.0.0"

is-fullwidth-code-point@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/is-fullwidth-code-point/-/is-fullwidth-code-point-1.0.0.tgz"
  integrity sha1-754xOG8DGn8NZDr4L95QxFfvAMs=
  dependencies:
    number-is-nan "^1.0.0"

is-fullwidth-code-point@^2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/is-fullwidth-code-point/-/is-fullwidth-code-point-2.0.0.tgz"
  integrity sha1-o7MKXE8ZkYMWeqq5O+764937ZU8=

is-glob@^4.0.1, is-glob@~4.0.1:
  version "4.0.1"
  resolved "https://registry.yarnpkg.com/is-glob/-/is-glob-4.0.1.tgz"
  integrity sha512-5G0tKtBTFImOqDnLB2hG6Bp2qcKEFduo4tZu9MT/H6NQv/ghhy30o55ufafxJ/LdH79LLs2Kfrn85TLKyA7BUg==
  dependencies:
    is-extglob "^2.1.1"

is-number@^7.0.0:
  version "7.0.0"
  resolved "https://registry.yarnpkg.com/is-number/-/is-number-7.0.0.tgz"
  integrity sha512-41Cifkg6e8TylSpdtTpeLVMqvSBEVzTttHvERD741+pnZ8ANv0004MRL43QKPDlK9cGvNp6NZWZUBlbGXYxxng==

is-stream@^1.0.1, is-stream@^1.1.0:
  version "1.1.0"
  resolved "https://registry.yarnpkg.com/is-stream/-/is-stream-1.1.0.tgz"
  integrity sha1-EtSj3U5o4Lec6428hBc66A2RykQ=

is-typedarray@^1.0.0, is-typedarray@~1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/is-typedarray/-/is-typedarray-1.0.0.tgz"
  integrity sha1-5HnICFjfDBsR3dppQPlgEfzaSpo=

isarray@~1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/isarray/-/isarray-1.0.0.tgz"
  integrity sha1-u5NdSFgsuhaMBoNJV6VKPgcSTxE=

isexe@^2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/isexe/-/isexe-2.0.0.tgz"
  integrity sha1-6PvzdNxVb/iUehDcsFctYz8s+hA=

isstream@~0.1.2:
  version "0.1.2"
  resolved "https://registry.yarnpkg.com/isstream/-/isstream-0.1.2.tgz"
  integrity sha1-R+Y/evVa+m+S4VAOaQ64uFKcCZo=

istanbul-lib-coverage@^2.0.3, istanbul-lib-coverage@^2.0.5:
  version "2.0.5"
  resolved "https://registry.yarnpkg.com/istanbul-lib-coverage/-/istanbul-lib-coverage-2.0.5.tgz"
  integrity sha512-8aXznuEPCJvGnMSRft4udDRDtb1V3pkQkMMI5LI+6HuQz5oQ4J2UFn1H82raA3qJtyOLkkwVqICBQkjnGtn5mA==

istanbul-lib-hook@^2.0.7:
  version "2.0.7"
  resolved "https://registry.yarnpkg.com/istanbul-lib-hook/-/istanbul-lib-hook-2.0.7.tgz"
  integrity sha512-vrRztU9VRRFDyC+aklfLoeXyNdTfga2EI3udDGn4cZ6fpSXpHLV9X6CHvfoMCPtggg8zvDDmC4b9xfu0z6/llA==
  dependencies:
    append-transform "^1.0.0"

istanbul-lib-instrument@^3.3.0:
  version "3.3.0"
  resolved "https://registry.yarnpkg.com/istanbul-lib-instrument/-/istanbul-lib-instrument-3.3.0.tgz"
  integrity sha512-5nnIN4vo5xQZHdXno/YDXJ0G+I3dAm4XgzfSVTPLQpj/zAV2dV6Juy0yaf10/zrJOJeHoN3fraFe+XRq2bFVZA==
  dependencies:
    "@babel/generator" "^7.4.0"
    "@babel/parser" "^7.4.3"
    "@babel/template" "^7.4.0"
    "@babel/traverse" "^7.4.3"
    "@babel/types" "^7.4.0"
    istanbul-lib-coverage "^2.0.5"
    semver "^6.0.0"

istanbul-lib-processinfo@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/istanbul-lib-processinfo/-/istanbul-lib-processinfo-1.0.0.tgz"
  integrity sha512-FY0cPmWa4WoQNlvB8VOcafiRoB5nB+l2Pz2xGuXHRSy1KM8QFOYfz/rN+bGMCAeejrY3mrpF5oJHcN0s/garCg==
  dependencies:
    archy "^1.0.0"
    cross-spawn "^6.0.5"
    istanbul-lib-coverage "^2.0.3"
    rimraf "^2.6.3"
    uuid "^3.3.2"

istanbul-lib-report@^2.0.8:
  version "2.0.8"
  resolved "https://registry.yarnpkg.com/istanbul-lib-report/-/istanbul-lib-report-2.0.8.tgz"
  integrity sha512-fHBeG573EIihhAblwgxrSenp0Dby6tJMFR/HvlerBsrCTD5bkUuoNtn3gVh29ZCS824cGGBPn7Sg7cNk+2xUsQ==
  dependencies:
    istanbul-lib-coverage "^2.0.5"
    make-dir "^2.1.0"
    supports-color "^6.1.0"

istanbul-lib-source-maps@^3.0.6:
  version "3.0.6"
  resolved "https://registry.yarnpkg.com/istanbul-lib-source-maps/-/istanbul-lib-source-maps-3.0.6.tgz"
  integrity sha512-R47KzMtDJH6X4/YW9XTx+jrLnZnscW4VpNN+1PViSYTejLVPWv7oov+Duf8YQSPyVRUvueQqz1TcsC6mooZTXw==
  dependencies:
    debug "^4.1.1"
    istanbul-lib-coverage "^2.0.5"
    make-dir "^2.1.0"
    rimraf "^2.6.3"
    source-map "^0.6.1"

istanbul-reports@^2.2.4:
  version "2.2.6"
  resolved "https://registry.yarnpkg.com/istanbul-reports/-/istanbul-reports-2.2.6.tgz"
  integrity sha512-SKi4rnMyLBKe0Jy2uUdx28h8oG7ph2PPuQPvIAh31d+Ci+lSiEu4C+h3oBPuJ9+mPKhOyW0M8gY4U5NM1WLeXA==
  dependencies:
    handlebars "^4.1.2"

jackspeak@^1.4.0:
  version "1.4.0"
  resolved "https://registry.yarnpkg.com/jackspeak/-/jackspeak-1.4.0.tgz"
  integrity sha512-VDcSunT+wcccoG46FtzuBAyQKlzhHjli4q31e1fIHGOsRspqNUFjVzGb+7eIFDlTvqLygxapDHPHS0ouT2o/tw==
  dependencies:
    cliui "^4.1.0"

"js-tokens@^3.0.0 || ^4.0.0", js-tokens@^4.0.0:
  version "4.0.0"
  resolved "https://registry.yarnpkg.com/js-tokens/-/js-tokens-4.0.0.tgz"
  integrity sha512-RdJUflcE3cUzKiMqQgsCu06FPu9UdIJO0beYbPhHN4k6apgJtifcoCtT9bcxOpYBtpD2kCM6Sbzg4CausW/PKQ==

js-tokens@^3.0.2:
  version "3.0.2"
  resolved "https://registry.yarnpkg.com/js-tokens/-/js-tokens-3.0.2.tgz"
  integrity sha1-mGbfOVECEw449/mWvOtlRDIJwls=

js-yaml@^3.13.1:
  version "3.13.1"
  resolved "https://registry.yarnpkg.com/js-yaml/-/js-yaml-3.13.1.tgz"
  integrity sha512-YfbcO7jXDdyj0DGxYVSlSeQNHbD7XPWvrVWeVUujrQEoZzWJIRrCPoyk6kL6IAjAG2IolMK4T0hNUe0HOUs5Jw==
  dependencies:
    argparse "^1.0.7"
    esprima "^4.0.0"

jsbn@~0.1.0:
  version "0.1.1"
  resolved "https://registry.yarnpkg.com/jsbn/-/jsbn-0.1.1.tgz"
  integrity sha1-peZUwuWi3rXyAdls77yoDA7y9RM=

jsesc@^1.3.0:
  version "1.3.0"
  resolved "https://registry.yarnpkg.com/jsesc/-/jsesc-1.3.0.tgz"
  integrity sha1-RsP+yMGJKxKwgz25vHYiF226s0s=

jsesc@^2.5.1:
  version "2.5.2"
  resolved "https://registry.yarnpkg.com/jsesc/-/jsesc-2.5.2.tgz"
  integrity sha512-OYu7XEzjkCQ3C5Ps3QIZsQfNpqoJyZZA99wd9aWd05NCtC5pWOkShK2mkL6HXQR6/Cy2lbNdPlZBpuQHXE63gA==

json-parse-better-errors@^1.0.1:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/json-parse-better-errors/-/json-parse-better-errors-1.0.2.tgz"
  integrity sha512-mrqyZKfX5EhL7hvqcV6WG1yYjnjeuYDzDhhcAAUrq8Po85NBQBJP+ZDUT75qZQ98IkUoBqdkExkukOU7Ts2wrw==

json-schema-traverse@^0.4.1:
  version "0.4.1"
  resolved "https://registry.yarnpkg.com/json-schema-traverse/-/json-schema-traverse-0.4.1.tgz"
  integrity sha512-xbbCH5dCYU5T8LcEhhuh7HJ88HXuW3qsI3Y0zOZFKfZEHcpWiHU/Jxzk629Brsab/mMiHQti9wMP+845RPe3Vg==

json-schema@0.2.3:
  version "0.2.3"
  resolved "https://registry.yarnpkg.com/json-schema/-/json-schema-0.2.3.tgz"
  integrity sha1-tIDIkuWaLwWVTOcnvT8qTogvnhM=

json-stringify-safe@~5.0.1:
  version "5.0.1"
  resolved "https://registry.yarnpkg.com/json-stringify-safe/-/json-stringify-safe-5.0.1.tgz"
  integrity sha1-Epai1Y/UXxmg9s4B1lcB4sc1tus=

json5@^0.5.1:
  version "0.5.1"
  resolved "https://registry.yarnpkg.com/json5/-/json5-0.5.1.tgz"
  integrity sha1-Hq3nrMASA0rYTiOWdn6tn6VJWCE=

jsprim@^1.2.2:
  version "1.4.1"
  resolved "https://registry.yarnpkg.com/jsprim/-/jsprim-1.4.1.tgz"
  integrity sha1-MT5mvB5cwG5Di8G3SZwuXFastqI=
  dependencies:
    assert-plus "1.0.0"
    extsprintf "1.3.0"
    json-schema "0.2.3"
    verror "1.10.0"

lcid@^2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/lcid/-/lcid-2.0.0.tgz"
  integrity sha512-avPEb8P8EGnwXKClwsNUgryVjllcRqtMYa49NTsbQagYuT1DcXnl1915oxWjoyGrXR6zH/Y0Zc96xWsPcoDKeA==
  dependencies:
    invert-kv "^2.0.0"

lcov-parse@^0.0.10:
  version "0.0.10"
  resolved "https://registry.yarnpkg.com/lcov-parse/-/lcov-parse-0.0.10.tgz"
  integrity sha1-GwuP+ayceIklBYK3C3ExXZ2m2aM=

load-json-file@^4.0.0:
  version "4.0.0"
  resolved "https://registry.yarnpkg.com/load-json-file/-/load-json-file-4.0.0.tgz"
  integrity sha1-L19Fq5HjMhYjT9U62rZo607AmTs=
  dependencies:
    graceful-fs "^4.1.2"
    parse-json "^4.0.0"
    pify "^3.0.0"
    strip-bom "^3.0.0"

locate-path@^3.0.0:
  version "3.0.0"
  resolved "https://registry.yarnpkg.com/locate-path/-/locate-path-3.0.0.tgz"
  integrity sha512-7AO748wWnIhNqAuaty2ZWHkQHRSNfPVIsPIfwEOWO22AmaoVrWavlOcMR5nzTLNYvp36X220/maaRsrec1G65A==
  dependencies:
    p-locate "^3.0.0"
    path-exists "^3.0.0"

lodash.flattendeep@^4.4.0:
  version "4.4.0"
  resolved "https://registry.yarnpkg.com/lodash.flattendeep/-/lodash.flattendeep-4.4.0.tgz"
  integrity sha1-+wMJF/hqMTTlvJvsDWngAT3f7bI=

lodash.throttle@^4.1.1:
  version "4.1.1"
  resolved "https://registry.yarnpkg.com/lodash.throttle/-/lodash.throttle-4.1.1.tgz"
  integrity sha1-wj6RtxAkKscMN/HhzaknTMOb8vQ=

lodash@^4.17.11, lodash@^4.17.4:
  version "4.17.11"
  resolved "https://registry.yarnpkg.com/lodash/-/lodash-4.17.11.tgz"
  integrity sha512-cQKh8igo5QUhZ7lg38DYWAxMvjSAKG0A8wGSVimP07SIUEK2UO+arSRKbRZWtelMtN5V0Hkwh5ryOto/SshYIg==

log-driver@^1.2.7:
  version "1.2.7"
  resolved "https://registry.yarnpkg.com/log-driver/-/log-driver-1.2.7.tgz"
  integrity sha512-U7KCmLdqsGHBLeWqYlFA0V0Sl6P08EE1ZrmA9cxjUE0WVqT9qnyVDPz1kzpFEP0jdJuFnasWIfSd7fsaNXkpbg==

log-update@^3.0.0:
  version "3.2.0"
  resolved "https://registry.yarnpkg.com/log-update/-/log-update-3.2.0.tgz"
  integrity sha512-KJ6zAPIHWo7Xg1jYror6IUDFJBq1bQ4Bi4wAEp2y/0ScjBBVi/g0thr0sUVhuvuXauWzczt7T2QHghPDNnKBuw==
  dependencies:
    ansi-escapes "^3.2.0"
    cli-cursor "^2.1.0"
    wrap-ansi "^5.0.0"

loose-envify@^1.0.0, loose-envify@^1.1.0, loose-envify@^1.4.0:
  version "1.4.0"
  resolved "https://registry.yarnpkg.com/loose-envify/-/loose-envify-1.4.0.tgz"
  integrity sha512-lyuxPGr/Wfhrlem2CL/UcnUc1zcqKAImBDzukY7Y5F/yQiNdko6+fRLevlw1HgMySw7f611UIY408EtxRSoK3Q==
  dependencies:
    js-tokens "^3.0.0 || ^4.0.0"

lru-cache@^4.0.1:
  version "4.1.5"
  resolved "https://registry.yarnpkg.com/lru-cache/-/lru-cache-4.1.5.tgz"
  integrity sha512-sWZlbEP2OsHNkXrMl5GYk/jKk70MBng6UU4YI/qGDYbgf6YbP4EvmqISbXCoJiRKs+1bSpFHVgQxvJ17F2li5g==
  dependencies:
    pseudomap "^1.0.2"
    yallist "^2.1.2"

make-dir@^2.0.0, make-dir@^2.1.0:
  version "2.1.0"
  resolved "https://registry.yarnpkg.com/make-dir/-/make-dir-2.1.0.tgz"
  integrity sha512-LS9X+dc8KLxXCb8dni79fLIIUA5VyZoyjSMCwTluaXA0o27cCK0bhXkpgw+sTXVpPy/lSO57ilRixqk0vDmtRA==
  dependencies:
    pify "^4.0.1"
    semver "^5.6.0"

make-error@^1.1.1:
  version "1.3.5"
  resolved "https://registry.yarnpkg.com/make-error/-/make-error-1.3.5.tgz"
  integrity sha512-c3sIjNUow0+8swNwVpqoH4YCShKNFkMaw6oH1mNS2haDZQqkeZFlHS3dhoeEbKKmJB4vXpJucU6oH75aDYeE9g==

map-age-cleaner@^0.1.1:
  version "0.1.3"
  resolved "https://registry.yarnpkg.com/map-age-cleaner/-/map-age-cleaner-0.1.3.tgz"
  integrity sha512-bJzx6nMoP6PDLPBFmg7+xRKeFZvFboMrGlxmNj9ClvX53KrmvM5bXFXEWjbz4cz1AFn+jWJ9z/DJSz7hrs0w3w==
  dependencies:
    p-defer "^1.0.0"

mem@^4.0.0:
  version "4.3.0"
  resolved "https://registry.yarnpkg.com/mem/-/mem-4.3.0.tgz"
  integrity sha512-qX2bG48pTqYRVmDB37rn/6PT7LcR8T7oAX3bf99u1Tt1nzxYfxkgqDwUwolPlXweM0XzBOBFzSx4kfp7KP1s/w==
  dependencies:
    map-age-cleaner "^0.1.1"
    mimic-fn "^2.0.0"
    p-is-promise "^2.0.0"

merge-source-map@^1.1.0:
  version "1.1.0"
  resolved "https://registry.yarnpkg.com/merge-source-map/-/merge-source-map-1.1.0.tgz"
  integrity sha512-Qkcp7P2ygktpMPh2mCQZaf3jhN6D3Z/qVZHSdWvQ+2Ef5HgRAPBO57A77+ENm0CPx2+1Ce/MYKi3ymqdfuqibw==
  dependencies:
    source-map "^0.6.1"

mime-db@1.40.0:
  version "1.40.0"
  resolved "https://registry.yarnpkg.com/mime-db/-/mime-db-1.40.0.tgz"
  integrity sha512-jYdeOMPy9vnxEqFRRo6ZvTZ8d9oPb+k18PKoYNYUe2stVEBPPwsln/qWzdbmaIvnhZ9v2P+CuecK+fpUfsV2mA==

mime-types@^2.1.12, mime-types@~2.1.19:
  version "2.1.24"
  resolved "https://registry.yarnpkg.com/mime-types/-/mime-types-2.1.24.tgz"
  integrity sha512-WaFHS3MCl5fapm3oLxU4eYDw77IQM2ACcxQ9RIxfaC3ooc6PFuBMGZZsYpvoXS5D5QTWPieo1jjLdAm3TBP3cQ==
  dependencies:
    mime-db "1.40.0"

mimic-fn@^1.0.0:
  version "1.2.0"
  resolved "https://registry.yarnpkg.com/mimic-fn/-/mimic-fn-1.2.0.tgz"
  integrity sha512-jf84uxzwiuiIVKiOLpfYk7N46TSy8ubTonmneY9vrpHNAnp0QBt2BxWV9dO3/j+BoVAb+a5G6YDPW3M5HOdMWQ==

mimic-fn@^2.0.0:
  version "2.1.0"
  resolved "https://registry.yarnpkg.com/mimic-fn/-/mimic-fn-2.1.0.tgz"
  integrity sha512-OqbOk5oEQeAZ8WXWydlu9HJjz9WVdEIvamMCcXmuqUYjTknH/sqsWvhQ3vgwKFRR1HpjvNBKQ37nbJgYzGqGcg==

minimatch@^3.0.4:
  version "3.0.4"
  resolved "https://registry.yarnpkg.com/minimatch/-/minimatch-3.0.4.tgz"
  integrity sha512-yJHVQEhyqPLUTgt9B83PXu6W3rx4MvvHvSUvToogpwoGDOUQ+yDrR0HRot+yOCdCO7u4hX3pWft6kWBBcqh0UA==
  dependencies:
    brace-expansion "^1.1.7"

minimist@0.0.8:
  version "0.0.8"
  resolved "https://registry.yarnpkg.com/minimist/-/minimist-0.0.8.tgz"
  integrity sha1-hX/Kv8M5fSYluCKCYuhqp6ARsF0=

minimist@^1.2.0:
  version "1.2.0"
  resolved "https://registry.yarnpkg.com/minimist/-/minimist-1.2.0.tgz"
  integrity sha1-o1AIsg9BOD7sH7kU9M1d95omQoQ=

minimist@~0.0.1:
  version "0.0.10"
  resolved "https://registry.yarnpkg.com/minimist/-/minimist-0.0.10.tgz"
  integrity sha1-3j+YVD2/lggr5IrRoMfNqDYwHc8=

minipass@^3.0.0:
  version "3.1.1"
  resolved "https://registry.yarnpkg.com/minipass/-/minipass-3.1.1.tgz"
  integrity sha512-UFqVihv6PQgwj8/yTGvl9kPz7xIAY+R5z6XYjRInD3Gk3qx6QGSD6zEcpeG4Dy/lQnv1J6zv8ejV90hyYIKf3w==
  dependencies:
    yallist "^4.0.0"

mkdirp@^0.5.0, mkdirp@^0.5.1:
  version "0.5.1"
  resolved "https://registry.yarnpkg.com/mkdirp/-/mkdirp-0.5.1.tgz"
  integrity sha1-MAV0OOrGz3+MR2fzhkjWaX11yQM=
  dependencies:
    minimist "0.0.8"

ms@2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/ms/-/ms-2.0.0.tgz"
  integrity sha1-VgiurfwAvmwpAd9fmGF4jeDVl8g=

ms@^2.1.1:
  version "2.1.2"
  resolved "https://registry.yarnpkg.com/ms/-/ms-2.1.2.tgz"
  integrity sha512-sGkPx+VjMtmA6MX27oA4FBFELFCZZ4S4XqeGOXCv68tT+jb3vk/RyaKWP0PTKyWtmLSM0b+adUTEvbs1PEaH2w==

neo-async@^2.6.0:
  version "2.6.1"
  resolved "https://registry.yarnpkg.com/neo-async/-/neo-async-2.6.1.tgz"
  integrity sha512-iyam8fBuCUpWeKPGpaNMetEocMt364qkCsfL9JuhjXX6dRnguRVOfk2GZaDpPjcOKiiXCPINZC1GczQ7iTq3Zw==

nested-error-stacks@^2.0.0:
  version "2.1.0"
  resolved "https://registry.yarnpkg.com/nested-error-stacks/-/nested-error-stacks-2.1.0.tgz"
  integrity sha512-AO81vsIO1k1sM4Zrd6Hu7regmJN1NSiAja10gc4bX3F0wd+9rQmcuHQaHVQCYIEC8iFXnE+mavh23GOt7wBgug==

nice-try@^1.0.4:
  version "1.0.5"
  resolved "https://registry.yarnpkg.com/nice-try/-/nice-try-1.0.5.tgz"
  integrity sha512-1nh45deeb5olNY7eX82BkPO7SSxR5SSYJiPTrTdFUVYwAl8CKMA5N9PjTYkHiRjisVcxcQ1HXdLhx2qxxJzLNQ==

node-modules-regexp@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/node-modules-regexp/-/node-modules-regexp-1.0.0.tgz"
  integrity sha1-jZ2+KJZKSsVxLpExZCEHxx6Q7EA=

normalize-package-data@^2.3.2:
  version "2.5.0"
  resolved "https://registry.yarnpkg.com/normalize-package-data/-/normalize-package-data-2.5.0.tgz"
  integrity sha512-/5CMN3T0R4XTj4DcGaexo+roZSdSFW/0AOOTROrjxzCG1wrWXEsGbRKevjlIL+ZDE4sZlJr5ED4YW0yqmkK+eA==
  dependencies:
    hosted-git-info "^2.1.4"
    resolve "^1.10.0"
    semver "2 || 3 || 4 || 5"
    validate-npm-package-license "^3.0.1"

normalize-path@^3.0.0, normalize-path@~3.0.0:
  version "3.0.0"
  resolved "https://registry.yarnpkg.com/normalize-path/-/normalize-path-3.0.0.tgz"
  integrity sha512-6eZs5Ls3WtCisHWp9S2GUy8dqkpGi4BVSz3GaqiE6ezub0512ESztXUwUB6C6IKbQkY2Pnb/mD4WYojCRwcwLA==

npm-run-path@^2.0.0:
  version "2.0.2"
  resolved "https://registry.yarnpkg.com/npm-run-path/-/npm-run-path-2.0.2.tgz"
  integrity sha1-NakjLfo11wZ7TLLd8jV7GHFTbF8=
  dependencies:
    path-key "^2.0.0"

number-is-nan@^1.0.0:
  version "1.0.1"
  resolved "https://registry.yarnpkg.com/number-is-nan/-/number-is-nan-1.0.1.tgz"
  integrity sha1-CXtgK1NCKlIsGvuHkDGDNpQaAR0=

nyc@^14.1.1:
  version "14.1.1"
  resolved "https://registry.yarnpkg.com/nyc/-/nyc-14.1.1.tgz"
  integrity sha512-OI0vm6ZGUnoGZv/tLdZ2esSVzDwUC88SNs+6JoSOMVxA+gKMB8Tk7jBwgemLx4O40lhhvZCVw1C+OYLOBOPXWw==
  dependencies:
    archy "^1.0.0"
    caching-transform "^3.0.2"
    convert-source-map "^1.6.0"
    cp-file "^6.2.0"
    find-cache-dir "^2.1.0"
    find-up "^3.0.0"
    foreground-child "^1.5.6"
    glob "^7.1.3"
    istanbul-lib-coverage "^2.0.5"
    istanbul-lib-hook "^2.0.7"
    istanbul-lib-instrument "^3.3.0"
    istanbul-lib-report "^2.0.8"
    istanbul-lib-source-maps "^3.0.6"
    istanbul-reports "^2.2.4"
    js-yaml "^3.13.1"
    make-dir "^2.1.0"
    merge-source-map "^1.1.0"
    resolve-from "^4.0.0"
    rimraf "^2.6.3"
    signal-exit "^3.0.2"
    spawn-wrap "^1.4.2"
    test-exclude "^5.2.3"
    uuid "^3.3.2"
    yargs "^13.2.2"
    yargs-parser "^13.0.0"

oauth-sign@~0.9.0:
  version "0.9.0"
  resolved "https://registry.yarnpkg.com/oauth-sign/-/oauth-sign-0.9.0.tgz"
  integrity sha512-fexhUFFPTGV8ybAtSIGbV6gOkSv8UtRbDBnAyLQw4QPKkgNlsH2ByPGtMUqdWkos6YCRmAqViwgZrJc/mRDzZQ==

object-assign@^4.1.1:
  version "4.1.1"
  resolved "https://registry.yarnpkg.com/object-assign/-/object-assign-4.1.1.tgz"
  integrity sha1-IQmtx5ZYh8/AXLvUQsrIv7s2CGM=

once@^1.3.0, once@^1.3.1, once@^1.4.0:
  version "1.4.0"
  resolved "https://registry.yarnpkg.com/once/-/once-1.4.0.tgz"
  integrity sha1-WDsap3WWHUsROsF9nFC6753Xa9E=
  dependencies:
    wrappy "1"

onetime@^2.0.0:
  version "2.0.1"
  resolved "https://registry.yarnpkg.com/onetime/-/onetime-2.0.1.tgz"
  integrity sha1-BnQoIw/WdEOyeUsiu6UotoZ5YtQ=
  dependencies:
    mimic-fn "^1.0.0"

opener@^1.5.1:
  version "1.5.1"
  resolved "https://registry.yarnpkg.com/opener/-/opener-1.5.1.tgz"
  integrity sha512-goYSy5c2UXE4Ra1xixabeVh1guIX/ZV/YokJksb6q2lubWu6UbvPQ20p542/sFIll1nl8JnCyK9oBaOcCWXwvA==

optimist@^0.6.1:
  version "0.6.1"
  resolved "https://registry.yarnpkg.com/optimist/-/optimist-0.6.1.tgz"
  integrity sha1-2j6nRob6IaGaERwybpDrFaAZZoY=
  dependencies:
    minimist "~0.0.1"
    wordwrap "~0.0.2"

os-homedir@^1.0.0, os-homedir@^1.0.1:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/os-homedir/-/os-homedir-1.0.2.tgz"
  integrity sha1-/7xJiDNuDoM94MFox+8VISGqf7M=

os-locale@^3.1.0:
  version "3.1.0"
  resolved "https://registry.yarnpkg.com/os-locale/-/os-locale-3.1.0.tgz"
  integrity sha512-Z8l3R4wYWM40/52Z+S265okfFj8Kt2cC2MKY+xNi3kFs+XGI7WXu/I309QQQYbRW4ijiZ+yxs9pqEhJh0DqW3Q==
  dependencies:
    execa "^1.0.0"
    lcid "^2.0.0"
    mem "^4.0.0"

os-tmpdir@^1.0.1:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/os-tmpdir/-/os-tmpdir-1.0.2.tgz"
  integrity sha1-u+Z0BseaqFxc/sdm/lc0VV36EnQ=

own-or-env@^1.0.1:
  version "1.0.1"
  resolved "https://registry.yarnpkg.com/own-or-env/-/own-or-env-1.0.1.tgz"
  integrity sha512-y8qULRbRAlL6x2+M0vIe7jJbJx/kmUTzYonRAa2ayesR2qWLswninkVyeJe4x3IEXhdgoNodzjQRKAoEs6Fmrw==
  dependencies:
    own-or "^1.0.0"

own-or@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/own-or/-/own-or-1.0.0.tgz"
  integrity sha1-Tod/vtqaLsgAD7wLyuOWRe6L+Nw=

p-defer@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/p-defer/-/p-defer-1.0.0.tgz"
  integrity sha1-n26xgvbJqozXQwBKfU+WsZaw+ww=

p-finally@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/p-finally/-/p-finally-1.0.0.tgz"
  integrity sha1-P7z7FbiZpEEjs0ttzBi3JDNqLK4=

p-is-promise@^2.0.0:
  version "2.1.0"
  resolved "https://registry.yarnpkg.com/p-is-promise/-/p-is-promise-2.1.0.tgz"
  integrity sha512-Y3W0wlRPK8ZMRbNq97l4M5otioeA5lm1z7bkNkxCka8HSPjR0xRWmpCmc9utiaLP9Jb1eD8BgeIxTW4AIF45Pg==

p-limit@^2.0.0:
  version "2.2.0"
  resolved "https://registry.yarnpkg.com/p-limit/-/p-limit-2.2.0.tgz"
  integrity sha512-pZbTJpoUsCzV48Mc9Nh51VbwO0X9cuPFE8gYwx9BTCt9SF8/b7Zljd2fVgOxhIF/HDTKgpVzs+GPhyKfjLLFRQ==
  dependencies:
    p-try "^2.0.0"

p-locate@^3.0.0:
  version "3.0.0"
  resolved "https://registry.yarnpkg.com/p-locate/-/p-locate-3.0.0.tgz"
  integrity sha512-x+12w/To+4GFfgJhBEpiDcLozRJGegY+Ei7/z0tSLkMmxGZNybVMSfWj9aJn8Z5Fc7dBUNJOOVgPv2H7IwulSQ==
  dependencies:
    p-limit "^2.0.0"

p-try@^2.0.0:
  version "2.2.0"
  resolved "https://registry.yarnpkg.com/p-try/-/p-try-2.2.0.tgz"
  integrity sha512-R4nPAVTAU0B9D35/Gk3uJf/7XYbQcyohSKdvAxIRSNghFl4e71hVoGnBNQz9cWaXxO2I10KTC+3jMdvvoKw6dQ==

package-hash@^3.0.0:
  version "3.0.0"
  resolved "https://registry.yarnpkg.com/package-hash/-/package-hash-3.0.0.tgz"
  integrity sha512-lOtmukMDVvtkL84rJHI7dpTYq+0rli8N2wlnqUcBuDWCfVhRUfOmnR9SsoHFMLpACvEV60dX7rd0rFaYDZI+FA==
  dependencies:
    graceful-fs "^4.1.15"
    hasha "^3.0.0"
    lodash.flattendeep "^4.4.0"
    release-zalgo "^1.0.0"

parse-json@^4.0.0:
  version "4.0.0"
  resolved "https://registry.yarnpkg.com/parse-json/-/parse-json-4.0.0.tgz"
  integrity sha1-vjX1Qlvh9/bHRxhPmKeIy5lHfuA=
  dependencies:
    error-ex "^1.3.1"
    json-parse-better-errors "^1.0.1"

path-exists@^3.0.0:
  version "3.0.0"
  resolved "https://registry.yarnpkg.com/path-exists/-/path-exists-3.0.0.tgz"
  integrity sha1-zg6+ql94yxiSXqfYENe1mwEP1RU=

path-is-absolute@^1.0.0, path-is-absolute@^1.0.1:
  version "1.0.1"
  resolved "https://registry.yarnpkg.com/path-is-absolute/-/path-is-absolute-1.0.1.tgz"
  integrity sha1-F0uSaHNVNP+8es5r9TpanhtcX18=

path-key@^2.0.0, path-key@^2.0.1:
  version "2.0.1"
  resolved "https://registry.yarnpkg.com/path-key/-/path-key-2.0.1.tgz"
  integrity sha1-QRyttXTFoUDTpLGRDUDYDMn0C0A=

path-parse@^1.0.6:
  version "1.0.6"
  resolved "https://registry.yarnpkg.com/path-parse/-/path-parse-1.0.6.tgz"
  integrity sha512-GSmOT2EbHrINBf9SR7CDELwlJ8AENk3Qn7OikK4nFYAu3Ote2+JYNVvkpAEQm3/TLNEJFD/xZJjzyxg3KBWOzw==

path-type@^3.0.0:
  version "3.0.0"
  resolved "https://registry.yarnpkg.com/path-type/-/path-type-3.0.0.tgz"
  integrity sha512-T2ZUsdZFHgA3u4e5PfPbjd7HDDpxPnQb5jN0SrDsjNSuVXHJqtwTnWqG0B1jZrgmJ/7lj1EmVIByWt1gxGkWvg==
  dependencies:
    pify "^3.0.0"

performance-now@^2.1.0:
  version "2.1.0"
  resolved "https://registry.yarnpkg.com/performance-now/-/performance-now-2.1.0.tgz"
  integrity sha1-Ywn04OX6kT7BxpMHrjZLSzd8nns=

picomatch@^2.0.4:
  version "2.0.7"
  resolved "https://registry.yarnpkg.com/picomatch/-/picomatch-2.0.7.tgz"
  integrity sha512-oLHIdio3tZ0qH76NybpeneBhYVj0QFTfXEFTc/B3zKQspYfYYkWYgFsmzo+4kvId/bQRcNkVeguI3y+CD22BtA==

pify@^3.0.0:
  version "3.0.0"
  resolved "https://registry.yarnpkg.com/pify/-/pify-3.0.0.tgz"
  integrity sha1-5aSs0sEB/fPZpNB/DbxNtJ3SgXY=

pify@^4.0.1:
  version "4.0.1"
  resolved "https://registry.yarnpkg.com/pify/-/pify-4.0.1.tgz"
  integrity sha512-uB80kBFb/tfd68bVleG9T5GGsGPjJrLAUpR5PZIrhBnIaRTQRjqdJSsIKkOP6OAIFbj7GOrcudc5pNjZ+geV2g==

pirates@^3.0.2:
  version "3.0.2"
  resolved "https://registry.yarnpkg.com/pirates/-/pirates-3.0.2.tgz"
  integrity sha512-c5CgUJq6H2k6MJz72Ak1F5sN9n9wlSlJyEnwvpm9/y3WB4E3pHBDT2c6PEiS1vyJvq2bUxUAIu0EGf8Cx4Ic7Q==
  dependencies:
    node-modules-regexp "^1.0.0"

pkg-dir@^3.0.0:
  version "3.0.0"
  resolved "https://registry.yarnpkg.com/pkg-dir/-/pkg-dir-3.0.0.tgz"
  integrity sha512-/E57AYkoeQ25qkxMj5PBOVgF8Kiu/h7cYS30Z5+R7WaiCCBfLq58ZI/dSeaEKb9WVJV5n/03QwrN3IeWIFllvw==
  dependencies:
    find-up "^3.0.0"

private@^0.1.8:
  version "0.1.8"
  resolved "https://registry.yarnpkg.com/private/-/private-0.1.8.tgz"
  integrity sha512-VvivMrbvd2nKkiG38qjULzlc+4Vx4wm/whI9pQD35YrARNnhxeiRktSOhSukRLFNlzg6Br/cJPet5J/u19r/mg==

process-nextick-args@~2.0.0:
  version "2.0.1"
  resolved "https://registry.yarnpkg.com/process-nextick-args/-/process-nextick-args-2.0.1.tgz"
  integrity sha512-3ouUOpQhtgrbOa17J7+uxOTpITYWaGP7/AhoR3+A+/1e9skrzelGi/dXzEYyvbxubEF6Wn2ypscTKiKJFFn1ag==

prop-types@^15.6.2:
  version "15.7.2"
  resolved "https://registry.yarnpkg.com/prop-types/-/prop-types-15.7.2.tgz"
  integrity sha512-8QQikdH7//R2vurIJSutZ1smHYTcLpRWEOlHnzcWHmBYrOGUysKwSsrC89BCiFj3CbrfJ/nXFdJepOVrY1GCHQ==
  dependencies:
    loose-envify "^1.4.0"
    object-assign "^4.1.1"
    react-is "^16.8.1"

pseudomap@^1.0.2:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/pseudomap/-/pseudomap-1.0.2.tgz"
  integrity sha1-8FKijacOYYkX7wqKw0wa5aaChrM=

psl@^1.1.24:
  version "1.2.0"
  resolved "https://registry.yarnpkg.com/psl/-/psl-1.2.0.tgz"
  integrity sha512-GEn74ZffufCmkDDLNcl3uuyF/aSD6exEyh1v/ZSdAomB82t6G9hzJVRx0jBmLDW+VfZqks3aScmMw9DszwUalA==

pump@^3.0.0:
  version "3.0.0"
  resolved "https://registry.yarnpkg.com/pump/-/pump-3.0.0.tgz"
  integrity sha512-LwZy+p3SFs1Pytd/jYct4wpv49HiYCqd9Rlc5ZVdk0V+8Yzv6jR5Blk3TRmPL1ft69TxP0IMZGJ+WPFU2BFhww==
  dependencies:
    end-of-stream "^1.1.0"
    once "^1.3.1"

punycode@^1.3.2, punycode@^1.4.1:
  version "1.4.1"
  resolved "https://registry.yarnpkg.com/punycode/-/punycode-1.4.1.tgz"
  integrity sha1-wNWmOycYgArY4esPpSachN1BhF4=

punycode@^2.0.0, punycode@^2.1.0:
  version "2.1.1"
  resolved "https://registry.yarnpkg.com/punycode/-/punycode-2.1.1.tgz"
  integrity sha512-XRsRjdf+j5ml+y/6GKHPZbrF/8p2Yga0JPtdqTIY2Xe5ohJPD9saDJJLPvp9+NSBprVvevdXZybnj2cv8OEd0A==

qs@~6.5.2:
  version "6.5.2"
  resolved "https://registry.yarnpkg.com/qs/-/qs-6.5.2.tgz"
  integrity sha512-N5ZAX4/LxJmF+7wN74pUD6qAh9/wnvdQcjq9TZjevvXzSUo7bfmw91saqMjzGS2xq91/odN2dW/WOl7qQHNDGA==

react-is@^16.8.1:
  version "16.8.6"
  resolved "https://registry.yarnpkg.com/react-is/-/react-is-16.8.6.tgz"
  integrity sha512-aUk3bHfZ2bRSVFFbbeVS4i+lNPZr3/WM5jT2J5omUVV1zzcs1nAaf3l51ctA5FFvCRbhrH0bdAsRRQddFJZPtA==

react-reconciler@^0.20.0:
  version "0.20.4"
  resolved "https://registry.yarnpkg.com/react-reconciler/-/react-reconciler-0.20.4.tgz"
  integrity sha512-kxERc4H32zV2lXMg/iMiwQHOtyqf15qojvkcZ5Ja2CPkjVohHw9k70pdDBwrnQhLVetUJBSYyqU3yqrlVTOajA==
  dependencies:
    loose-envify "^1.1.0"
    object-assign "^4.1.1"
    prop-types "^15.6.2"
    scheduler "^0.13.6"

react@^16.8.6:
  version "16.8.6"
  resolved "https://registry.yarnpkg.com/react/-/react-16.8.6.tgz"
  integrity sha512-pC0uMkhLaHm11ZSJULfOBqV4tIZkx87ZLvbbQYunNixAAvjnC+snJCg0XQXn9VIsttVsbZP/H/ewzgsd5fxKXw==
  dependencies:
    loose-envify "^1.1.0"
    object-assign "^4.1.1"
    prop-types "^15.6.2"
    scheduler "^0.13.6"

react@^16.9.0:
  version "16.12.0"
  resolved "https://registry.yarnpkg.com/react/-/react-16.12.0.tgz"
  integrity sha512-fglqy3k5E+81pA8s+7K0/T3DBCF0ZDOher1elBFzF7O6arXJgzyu/FW+COxFvAWXJoJN9KIZbT2LXlukwphYTA==
  dependencies:
    loose-envify "^1.1.0"
    object-assign "^4.1.1"
    prop-types "^15.6.2"

read-pkg-up@^4.0.0:
  version "4.0.0"
  resolved "https://registry.yarnpkg.com/read-pkg-up/-/read-pkg-up-4.0.0.tgz"
  integrity sha512-6etQSH7nJGsK0RbG/2TeDzZFa8shjQ1um+SwQQ5cwKy0dhSXdOncEhb1CPpvQG4h7FyOV6EB6YlV0yJvZQNAkA==
  dependencies:
    find-up "^3.0.0"
    read-pkg "^3.0.0"

read-pkg@^3.0.0:
  version "3.0.0"
  resolved "https://registry.yarnpkg.com/read-pkg/-/read-pkg-3.0.0.tgz"
  integrity sha1-nLxoaXj+5l0WwA4rGcI3/Pbjg4k=
  dependencies:
    load-json-file "^4.0.0"
    normalize-package-data "^2.3.2"
    path-type "^3.0.0"

readable-stream@^2.1.5:
  version "2.3.6"
  resolved "https://registry.yarnpkg.com/readable-stream/-/readable-stream-2.3.6.tgz"
  integrity sha512-tQtKA9WIAhBF3+VLAseyMqZeBjW0AHJoxOtYqSUZNJxauErmLbVm2FW1y+J/YA9dUrAC39ITejlZWhVIwawkKw==
  dependencies:
    core-util-is "~1.0.0"
    inherits "~2.0.3"
    isarray "~1.0.0"
    process-nextick-args "~2.0.0"
    safe-buffer "~5.1.1"
    string_decoder "~1.1.1"
    util-deprecate "~1.0.1"

readdirp@~3.2.0:
  version "3.2.0"
  resolved "https://registry.yarnpkg.com/readdirp/-/readdirp-3.2.0.tgz"
  integrity sha512-crk4Qu3pmXwgxdSgGhgA/eXiJAPQiX4GMOZZMXnqKxHX7TaoL+3gQVo/WeuAiogr07DpnfjIMpXXa+PAIvwPGQ==
  dependencies:
    picomatch "^2.0.4"

redeyed@~2.1.0:
  version "2.1.1"
  resolved "https://registry.yarnpkg.com/redeyed/-/redeyed-2.1.1.tgz"
  integrity sha1-iYS1gV2ZyyIEacme7v/jiRPmzAs=
  dependencies:
    esprima "~4.0.0"

regenerator-runtime@^0.11.0:
  version "0.11.1"
  resolved "https://registry.yarnpkg.com/regenerator-runtime/-/regenerator-runtime-0.11.1.tgz"
  integrity sha512-MguG95oij0fC3QV3URf4V2SDYGJhJnJGqvIIgdECeODCT98wSWDAJ94SSuVpYQUoTcGUIL6L4yNB7j1DFFHSBg==

regenerator-runtime@^0.13.2:
  version "0.13.2"
  resolved "https://registry.yarnpkg.com/regenerator-runtime/-/regenerator-runtime-0.13.2.tgz"
  integrity sha512-S/TQAZJO+D3m9xeN1WTI8dLKBBiRgXBlTJvbWjCThHWZj9EvHK70Ff50/tYj2J/fvBY6JtFVwRuazHN2E7M9BA==

release-zalgo@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/release-zalgo/-/release-zalgo-1.0.0.tgz"
  integrity sha1-CXALflB0Mpc5Mw5TXFqQ+2eFFzA=
  dependencies:
    es6-error "^4.0.1"

repeating@^2.0.0:
  version "2.0.1"
  resolved "https://registry.yarnpkg.com/repeating/-/repeating-2.0.1.tgz"
  integrity sha1-UhTFOpJtNVJwdSf7q0FdvAjQbdo=
  dependencies:
    is-finite "^1.0.0"

request@^2.86.0:
  version "2.88.0"
  resolved "https://registry.yarnpkg.com/request/-/request-2.88.0.tgz"
  integrity sha512-NAqBSrijGLZdM0WZNsInLJpkJokL72XYjUpnB0iwsRgxh7dB6COrHnTBNwN0E+lHDAJzu7kLAkDeY08z2/A0hg==
  dependencies:
    aws-sign2 "~0.7.0"
    aws4 "^1.8.0"
    caseless "~0.12.0"
    combined-stream "~1.0.6"
    extend "~3.0.2"
    forever-agent "~0.6.1"
    form-data "~2.3.2"
    har-validator "~5.1.0"
    http-signature "~1.2.0"
    is-typedarray "~1.0.0"
    isstream "~0.1.2"
    json-stringify-safe "~5.0.1"
    mime-types "~2.1.19"
    oauth-sign "~0.9.0"
    performance-now "^2.1.0"
    qs "~6.5.2"
    safe-buffer "^5.1.2"
    tough-cookie "~2.4.3"
    tunnel-agent "^0.6.0"
    uuid "^3.3.2"

require-directory@^2.1.1:
  version "2.1.1"
  resolved "https://registry.yarnpkg.com/require-directory/-/require-directory-2.1.1.tgz"
  integrity sha1-jGStX9MNqxyXbiNE/+f3kqam30I=

require-main-filename@^2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/require-main-filename/-/require-main-filename-2.0.0.tgz"
  integrity sha512-NKN5kMDylKuldxYLSUfrbo5Tuzh4hd+2E8NPPX02mZtn1VuREQToYe/ZdlJy+J3uCpfaiGF05e7B8W0iXbQHmg==

resolve-from@^3.0.0:
  version "3.0.0"
  resolved "https://registry.yarnpkg.com/resolve-from/-/resolve-from-3.0.0.tgz"
  integrity sha1-six699nWiBvItuZTM17rywoYh0g=

resolve-from@^4.0.0:
  version "4.0.0"
  resolved "https://registry.yarnpkg.com/resolve-from/-/resolve-from-4.0.0.tgz"
  integrity sha512-pb/MYmXstAkysRFx8piNI1tGFNQIFA3vkE3Gq4EuA1dF6gHp/+vgZqsCGJapvy8N3Q+4o7FwvquPJcnZ7RYy4g==

resolve@^1.10.0:
  version "1.11.1"
  resolved "https://registry.yarnpkg.com/resolve/-/resolve-1.11.1.tgz"
  integrity sha512-vIpgF6wfuJOZI7KKKSP+HmiKggadPQAdsp5HiC1mvqnfp0gF1vdwgBWZIdrVft9pgqoMFQN+R7BSWZiBxx+BBw==
  dependencies:
    path-parse "^1.0.6"

restore-cursor@^2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/restore-cursor/-/restore-cursor-2.0.0.tgz"
  integrity sha1-n37ih/gv0ybU/RYpI9YhKe7g368=
  dependencies:
    onetime "^2.0.0"
    signal-exit "^3.0.2"

rimraf@^2.6.2, rimraf@^2.6.3:
  version "2.6.3"
  resolved "https://registry.yarnpkg.com/rimraf/-/rimraf-2.6.3.tgz"
  integrity sha512-mwqeW5XsA2qAejG46gYdENaxXjx9onRNCfn7L0duuP4hCuTIi/QO7PDK07KJfp1d+izWPrzEJDcSqBa0OZQriA==
  dependencies:
    glob "^7.1.3"

rimraf@^2.7.1:
  version "2.7.1"
  resolved "https://registry.yarnpkg.com/rimraf/-/rimraf-2.7.1.tgz"
  integrity sha512-uWjbaKIK3T1OSVptzX7Nl6PvQ3qAGtKEtVRjRuazjfL3Bx5eI409VZSqgND+4UNnmzLVdPj9FqFJNPqBZFve4w==
  dependencies:
    glob "^7.1.3"

safe-buffer@^5.0.1, safe-buffer@^5.1.2:
  version "5.2.0"
  resolved "https://registry.yarnpkg.com/safe-buffer/-/safe-buffer-5.2.0.tgz"
  integrity sha512-fZEwUGbVl7kouZs1jCdMLdt95hdIv0ZeHg6L7qPeciMZhZ+/gdesW4wgTARkrFWEpspjEATAzUGPG8N2jJiwbg==

safe-buffer@~5.1.0, safe-buffer@~5.1.1:
  version "5.1.2"
  resolved "https://registry.yarnpkg.com/safe-buffer/-/safe-buffer-5.1.2.tgz"
  integrity sha512-Gd2UZBJDkXlY7GbJxfsE8/nvKkUEU1G38c1siN6QP6a9PT9MmHB8GnpscSmMJSoF8LOIrt8ud/wPtojys4G6+g==

safer-buffer@^2.0.2, safer-buffer@^2.1.0, safer-buffer@~2.1.0:
  version "2.1.2"
  resolved "https://registry.yarnpkg.com/safer-buffer/-/safer-buffer-2.1.2.tgz"
  integrity sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg==

scheduler@^0.13.2, scheduler@^0.13.6:
  version "0.13.6"
  resolved "https://registry.yarnpkg.com/scheduler/-/scheduler-0.13.6.tgz"
  integrity sha512-IWnObHt413ucAYKsD9J1QShUKkbKLQQHdxRyw73sw4FN26iWr3DY/H34xGPe4nmL1DwXyWmSWmMrA9TfQbE/XQ==
  dependencies:
    loose-envify "^1.1.0"
    object-assign "^4.1.1"

"semver@2 || 3 || 4 || 5", semver@^5.5.0, semver@^5.6.0:
  version "5.7.0"
  resolved "https://registry.yarnpkg.com/semver/-/semver-5.7.0.tgz"
  integrity sha512-Ya52jSX2u7QKghxeoFGpLwCtGlt7j0oY9DYb5apt9nPlJ42ID+ulTXESnt/qAQcoSERyZ5sl3LDIOw0nAn/5DA==

semver@^6.0.0:
  version "6.2.0"
  resolved "https://registry.yarnpkg.com/semver/-/semver-6.2.0.tgz"
  integrity sha512-jdFC1VdUGT/2Scgbimf7FSx9iJLXoqfglSF+gJeuNWVpiE37OIbc1jywR/GJyFdz3mnkz2/id0L0J/cr0izR5A==

set-blocking@^2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/set-blocking/-/set-blocking-2.0.0.tgz"
  integrity sha1-BF+XgtARrppoA93TgrJDkrPYkPc=

shebang-command@^1.2.0:
  version "1.2.0"
  resolved "https://registry.yarnpkg.com/shebang-command/-/shebang-command-1.2.0.tgz"
  integrity sha1-RKrGW2lbAzmJaMOfNj/uXer98eo=
  dependencies:
    shebang-regex "^1.0.0"

shebang-regex@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/shebang-regex/-/shebang-regex-1.0.0.tgz"
  integrity sha1-2kL0l0DAtC2yypcoVxyxkMmO/qM=

signal-exit@^3.0.0, signal-exit@^3.0.2:
  version "3.0.2"
  resolved "https://registry.yarnpkg.com/signal-exit/-/signal-exit-3.0.2.tgz"
  integrity sha1-tf3AjxKH6hF4Yo5BXiUTK3NkbG0=

slash@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/slash/-/slash-1.0.0.tgz"
  integrity sha1-xB8vbDn8FtHNF61LXYlhFK5HDVU=

slice-ansi@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/slice-ansi/-/slice-ansi-1.0.0.tgz"
  integrity sha512-POqxBK6Lb3q6s047D/XsDVNPnF9Dl8JSaqe9h9lURl0OdNqy/ujDrOiIHtsqXMGbWWTIomRzAMaTyawAU//Reg==
  dependencies:
    is-fullwidth-code-point "^2.0.0"

source-map-support@^0.4.15:
  version "0.4.18"
  resolved "https://registry.yarnpkg.com/source-map-support/-/source-map-support-0.4.18.tgz"
  integrity sha512-try0/JqxPLF9nOjvSta7tVondkP5dwgyLDjVoyMDlmjugT2lRZ1OfsrYTkCd2hkDnJTKRbO/Rl3orm8vlsUzbA==
  dependencies:
    source-map "^0.5.6"

source-map-support@^0.5.11, source-map-support@^0.5.6:
  version "0.5.12"
  resolved "https://registry.yarnpkg.com/source-map-support/-/source-map-support-0.5.12.tgz"
  integrity sha512-4h2Pbvyy15EE02G+JOZpUCmqWJuqrs+sEkzewTm++BPi7Hvn/HwcqLAcNxYAyI0x13CpPPn+kMjl+hplXMHITQ==
  dependencies:
    buffer-from "^1.0.0"
    source-map "^0.6.0"

source-map-support@^0.5.16:
  version "0.5.16"
  resolved "https://registry.yarnpkg.com/source-map-support/-/source-map-support-0.5.16.tgz"
  integrity sha512-efyLRJDr68D9hBBNIPWFjhpFzURh+KJykQwvMyW5UiZzYwoF6l4YMMDIJJEyFWxWCqfyxLzz6tSfUFR+kXXsVQ==
  dependencies:
    buffer-from "^1.0.0"
    source-map "^0.6.0"

source-map@^0.5.0, source-map@^0.5.6, source-map@^0.5.7:
  version "0.5.7"
  resolved "https://registry.yarnpkg.com/source-map/-/source-map-0.5.7.tgz"
  integrity sha1-igOdLRAh0i0eoUyA2OpGi6LvP8w=

source-map@^0.6.0, source-map@^0.6.1, source-map@~0.6.1:
  version "0.6.1"
  resolved "https://registry.yarnpkg.com/source-map/-/source-map-0.6.1.tgz"
  integrity sha512-UjgapumWlbMhkBgzT7Ykc5YXUT46F0iKu8SGXq0bcwP5dz/h0Plj6enJqjz1Zbq2l5WaqYnrVbwWOWMyF3F47g==

spawn-wrap@^1.4.2:
  version "1.4.2"
  resolved "https://registry.yarnpkg.com/spawn-wrap/-/spawn-wrap-1.4.2.tgz"
  integrity sha512-vMwR3OmmDhnxCVxM8M+xO/FtIp6Ju/mNaDfCMMW7FDcLRTPFWUswec4LXJHTJE2hwTI9O0YBfygu4DalFl7Ylg==
  dependencies:
    foreground-child "^1.5.6"
    mkdirp "^0.5.0"
    os-homedir "^1.0.1"
    rimraf "^2.6.2"
    signal-exit "^3.0.2"
    which "^1.3.0"

spdx-correct@^3.0.0:
  version "3.1.0"
  resolved "https://registry.yarnpkg.com/spdx-correct/-/spdx-correct-3.1.0.tgz"
  integrity sha512-lr2EZCctC2BNR7j7WzJ2FpDznxky1sjfxvvYEyzxNyb6lZXHODmEoJeFu4JupYlkfha1KZpJyoqiJ7pgA1qq8Q==
  dependencies:
    spdx-expression-parse "^3.0.0"
    spdx-license-ids "^3.0.0"

spdx-exceptions@^2.1.0:
  version "2.2.0"
  resolved "https://registry.yarnpkg.com/spdx-exceptions/-/spdx-exceptions-2.2.0.tgz"
  integrity sha512-2XQACfElKi9SlVb1CYadKDXvoajPgBVPn/gOQLrTvHdElaVhr7ZEbqJaRnJLVNeaI4cMEAgVCeBMKF6MWRDCRA==

spdx-expression-parse@^3.0.0:
  version "3.0.0"
  resolved "https://registry.yarnpkg.com/spdx-expression-parse/-/spdx-expression-parse-3.0.0.tgz"
  integrity sha512-Yg6D3XpRD4kkOmTpdgbUiEJFKghJH03fiC1OPll5h/0sO6neh2jqRDVHOQ4o/LMea0tgCkbMgea5ip/e+MkWyg==
  dependencies:
    spdx-exceptions "^2.1.0"
    spdx-license-ids "^3.0.0"

spdx-license-ids@^3.0.0:
  version "3.0.4"
  resolved "https://registry.yarnpkg.com/spdx-license-ids/-/spdx-license-ids-3.0.4.tgz"
  integrity sha512-7j8LYJLeY/Yb6ACbQ7F76qy5jHkp0U6jgBfJsk97bwWlVUnUWsAgpyaCvo17h0/RQGnQ036tVDomiwoI4pDkQA==

sprintf-js@~1.0.2:
  version "1.0.3"
  resolved "https://registry.yarnpkg.com/sprintf-js/-/sprintf-js-1.0.3.tgz"
  integrity sha1-BOaSb2YolTVPPdAVIDYzuFcpfiw=

sshpk@^1.7.0:
  version "1.16.1"
  resolved "https://registry.yarnpkg.com/sshpk/-/sshpk-1.16.1.tgz"
  integrity sha512-HXXqVUq7+pcKeLqqZj6mHFUMvXtOJt1uoUx09pFW6011inTMxqI8BA8PM95myrIyyKwdnzjdFjLiE6KBPVtJIg==
  dependencies:
    asn1 "~0.2.3"
    assert-plus "^1.0.0"
    bcrypt-pbkdf "^1.0.0"
    dashdash "^1.12.0"
    ecc-jsbn "~0.1.1"
    getpass "^0.1.1"
    jsbn "~0.1.0"
    safer-buffer "^2.0.2"
    tweetnacl "~0.14.0"

stack-utils@^1.0.2:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/stack-utils/-/stack-utils-1.0.2.tgz"
  integrity sha512-MTX+MeG5U994cazkjd/9KNAapsHnibjMLnfXodlkXw76JEea0UiNzrqidzo1emMwk7w5Qhc9jd4Bn9TBb1MFwA==

string-length@^2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/string-length/-/string-length-2.0.0.tgz"
  integrity sha1-1A27aGo6zpYMHP/KVivyxF+DY+0=
  dependencies:
    astral-regex "^1.0.0"
    strip-ansi "^4.0.0"

string-width@^1.0.1:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/string-width/-/string-width-1.0.2.tgz"
  integrity sha1-EYvfW4zcUaKn5w0hHgfisLmxB9M=
  dependencies:
    code-point-at "^1.0.0"
    is-fullwidth-code-point "^1.0.0"
    strip-ansi "^3.0.0"

string-width@^2.0.0, string-width@^2.1.1:
  version "2.1.1"
  resolved "https://registry.yarnpkg.com/string-width/-/string-width-2.1.1.tgz"
  integrity sha512-nOqH59deCq9SRHlxq1Aw85Jnt4w6KvLKqWVik6oA9ZklXLNIOlqg4F2yrT1MVaTjAqvVwdfeZ7w7aCvJD7ugkw==
  dependencies:
    is-fullwidth-code-point "^2.0.0"
    strip-ansi "^4.0.0"

string-width@^3.0.0, string-width@^3.1.0:
  version "3.1.0"
  resolved "https://registry.yarnpkg.com/string-width/-/string-width-3.1.0.tgz"
  integrity sha512-vafcv6KjVZKSgz06oM/H6GDBrAtz8vdhQakGjFIvNrHA6y3HCF1CInLy+QLq8dTJPQ1b+KDUqDFctkdRW44e1w==
  dependencies:
    emoji-regex "^7.0.1"
    is-fullwidth-code-point "^2.0.0"
    strip-ansi "^5.1.0"

string_decoder@~1.1.1:
  version "1.1.1"
  resolved "https://registry.yarnpkg.com/string_decoder/-/string_decoder-1.1.1.tgz"
  integrity sha512-n/ShnvDi6FHbbVfviro+WojiFzv+s8MPMHBczVePfUpDJLwoLT0ht1l4YwBCbi8pJAveEEdnkHyPyTP/mzRfwg==
  dependencies:
    safe-buffer "~5.1.0"

strip-ansi@^3.0.0, strip-ansi@^3.0.1:
  version "3.0.1"
  resolved "https://registry.yarnpkg.com/strip-ansi/-/strip-ansi-3.0.1.tgz"
  integrity sha1-ajhfuIU9lS1f8F0Oiq+UJ43GPc8=
  dependencies:
    ansi-regex "^2.0.0"

strip-ansi@^4.0.0:
  version "4.0.0"
  resolved "https://registry.yarnpkg.com/strip-ansi/-/strip-ansi-4.0.0.tgz"
  integrity sha1-qEeQIusaw2iocTibY1JixQXuNo8=
  dependencies:
    ansi-regex "^3.0.0"

strip-ansi@^5.0.0, strip-ansi@^5.1.0, strip-ansi@^5.2.0:
  version "5.2.0"
  resolved "https://registry.yarnpkg.com/strip-ansi/-/strip-ansi-5.2.0.tgz"
  integrity sha512-DuRs1gKbBqsMKIZlrffwlug8MHkcnpjs5VPmL1PAh+mA30U0DTotfDZ0d2UUsXpPmPmMMJ6W773MaA3J+lbiWA==
  dependencies:
    ansi-regex "^4.1.0"

strip-bom@^3.0.0:
  version "3.0.0"
  resolved "https://registry.yarnpkg.com/strip-bom/-/strip-bom-3.0.0.tgz"
  integrity sha1-IzTBjpx1n3vdVv3vfprj1YjmjtM=

strip-eof@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/strip-eof/-/strip-eof-1.0.0.tgz"
  integrity sha1-u0P/VZim6wXYm1n80SnJgzE2Br8=

supports-color@^2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/supports-color/-/supports-color-2.0.0.tgz"
  integrity sha1-U10EXOa2Nj+kARcIRimZXp3zJMc=

supports-color@^5.3.0:
  version "5.5.0"
  resolved "https://registry.yarnpkg.com/supports-color/-/supports-color-5.5.0.tgz"
  integrity sha512-QjVjwdXIt408MIiAqCX4oUKsgU2EqAGzs2Ppkm4aQYbjm+ZEWEcW4SfFNTr4uMNZma0ey4f5lgLrkB0aX0QMow==
  dependencies:
    has-flag "^3.0.0"

supports-color@^6.1.0:
  version "6.1.0"
  resolved "https://registry.yarnpkg.com/supports-color/-/supports-color-6.1.0.tgz"
  integrity sha512-qe1jfm1Mg7Nq/NSh6XE24gPXROEVsWHxC1LIx//XNlD9iw7YZQGjZNjYN7xGaEG6iKdA8EtNFW6R0gjnVXp+wQ==
  dependencies:
    has-flag "^3.0.0"

tap-mocha-reporter@^5.0.0:
  version "5.0.0"
  resolved "https://registry.yarnpkg.com/tap-mocha-reporter/-/tap-mocha-reporter-5.0.0.tgz"
  integrity sha512-8HlAtdmYGlDZuW83QbF/dc46L7cN+AGhLZcanX3I9ILvxUAl+G2/mtucNPSXecTlG/4iP1hv6oMo0tMhkn3Tsw==
  dependencies:
    color-support "^1.1.0"
    debug "^2.1.3"
    diff "^1.3.2"
    escape-string-regexp "^1.0.3"
    glob "^7.0.5"
    tap-parser "^10.0.0"
    tap-yaml "^1.0.0"
    unicode-length "^1.0.0"
  optionalDependencies:
    readable-stream "^2.1.5"

tap-parser@^10.0.0, tap-parser@^10.0.1:
  version "10.0.1"
  resolved "https://registry.yarnpkg.com/tap-parser/-/tap-parser-10.0.1.tgz"
  integrity sha512-qdT15H0DoJIi7zOqVXDn9X0gSM68JjNy1w3VemwTJlDnETjbi6SutnqmBfjDJAwkFS79NJ97gZKqie00ZCGmzg==
  dependencies:
    events-to-array "^1.0.1"
    minipass "^3.0.0"
    tap-yaml "^1.0.0"

tap-yaml@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/tap-yaml/-/tap-yaml-1.0.0.tgz"
  integrity sha512-Rxbx4EnrWkYk0/ztcm5u3/VznbyFJpyXO12dDBHKWiDVxy7O2Qw6MRrwO5H6Ww0U5YhRY/4C/VzWmFPhBQc4qQ==
  dependencies:
    yaml "^1.5.0"

tcompare@^2.3.0:
  version "2.3.0"
  resolved "https://registry.yarnpkg.com/tcompare/-/tcompare-2.3.0.tgz"
  integrity sha512-fAfA73uFtFGybWGt4+IYT6UPLYVZQ4NfsP+IXEZGY0vh8e2IF7LVKafcQNMRBLqP0wzEA65LM9Tqj+FSmO8GLw==

test-exclude@^5.2.3:
  version "5.2.3"
  resolved "https://registry.yarnpkg.com/test-exclude/-/test-exclude-5.2.3.tgz"
  integrity sha512-M+oxtseCFO3EDtAaGH7iiej3CBkzXqFMbzqYAACdzKui4eZA+pq3tZEwChvOdNfa7xxy8BfbmgJSIr43cC/+2g==
  dependencies:
    glob "^7.1.3"
    minimatch "^3.0.4"
    read-pkg-up "^4.0.0"
    require-main-filename "^2.0.0"

to-fast-properties@^1.0.3:
  version "1.0.3"
  resolved "https://registry.yarnpkg.com/to-fast-properties/-/to-fast-properties-1.0.3.tgz"
  integrity sha1-uDVx+k2MJbguIxsG46MFXeTKGkc=

to-fast-properties@^2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/to-fast-properties/-/to-fast-properties-2.0.0.tgz"
  integrity sha1-3F5pjL0HkmW8c+A3doGk5Og/YW4=

to-regex-range@^5.0.1:
  version "5.0.1"
  resolved "https://registry.yarnpkg.com/to-regex-range/-/to-regex-range-5.0.1.tgz"
  integrity sha512-65P7iz6X5yEr1cwcgvQxbbIw7Uk3gOy5dIdtZ4rDveLqhrdJP+Li/Hx6tyK0NEb+2GCyneCMJiGqrADCSNk8sQ==
  dependencies:
    is-number "^7.0.0"

tough-cookie@~2.4.3:
  version "2.4.3"
  resolved "https://registry.yarnpkg.com/tough-cookie/-/tough-cookie-2.4.3.tgz"
  integrity sha512-Q5srk/4vDM54WJsJio3XNn6K2sCG+CQ8G5Wz6bZhRZoAe/+TxjWB/GlFAnYEbkYVlON9FMk/fE3h2RLpPXo4lQ==
  dependencies:
    psl "^1.1.24"
    punycode "^1.4.1"

treport@^0.4.2:
  version "0.4.2"
  resolved "https://registry.yarnpkg.com/treport/-/treport-0.4.2.tgz"
  integrity sha512-Po8pQ/rmu4lVNmZWBgqyiHoIWXFeWaMA3H/WoCKw+DiS0xFn43UYRH6hYnjmrWCp0rkLItELQP/maO9uHDe/7A==
  dependencies:
    cardinal "^2.1.1"
    chalk "^2.4.2"
    import-jsx "^2.0.0"
    ink "^2.1.1"
    ms "^2.1.1"
    react "^16.8.6"
    string-length "^2.0.0"
    tap-parser "^10.0.1"
    unicode-length "^2.0.1"

trim-right@^1.0.1:
  version "1.0.1"
  resolved "https://registry.yarnpkg.com/trim-right/-/trim-right-1.0.1.tgz"
  integrity sha1-yy4SAwZ+DI3h9hQJS5/kVwTqYAM=

trivial-deferred@^1.0.1:
  version "1.0.1"
  resolved "https://registry.yarnpkg.com/trivial-deferred/-/trivial-deferred-1.0.1.tgz"
  integrity sha1-N21NKdlR1jaKb3oK6FwvTV4GWPM=

ts-node@^8.3.0:
  version "8.3.0"
  resolved "https://registry.yarnpkg.com/ts-node/-/ts-node-8.3.0.tgz"
  integrity sha512-dyNS/RqyVTDcmNM4NIBAeDMpsAdaQ+ojdf0GOLqE6nwJOgzEkdRNzJywhDfwnuvB10oa6NLVG1rUJQCpRN7qoQ==
  dependencies:
    arg "^4.1.0"
    diff "^4.0.1"
    make-error "^1.1.1"
    source-map-support "^0.5.6"
    yn "^3.0.0"

tunnel-agent@^0.6.0:
  version "0.6.0"
  resolved "https://registry.yarnpkg.com/tunnel-agent/-/tunnel-agent-0.6.0.tgz"
  integrity sha1-J6XeoGs2sEoKmWZ3SykIaPD8QP0=
  dependencies:
    safe-buffer "^5.0.1"

tweetnacl@^0.14.3, tweetnacl@~0.14.0:
  version "0.14.5"
  resolved "https://registry.yarnpkg.com/tweetnacl/-/tweetnacl-0.14.5.tgz"
  integrity sha1-WuaBd/GS1EViadEIr6k/+HQ/T2Q=

typedarray-to-buffer@^3.1.5:
  version "3.1.5"
  resolved "https://registry.yarnpkg.com/typedarray-to-buffer/-/typedarray-to-buffer-3.1.5.tgz"
  integrity sha512-zdu8XMNEDepKKR+XYOXAVPtWui0ly0NtohUscw+UmaHiAWT8hrV1rr//H6V+0DvJ3OQ19S979M0laLfX8rm82Q==
  dependencies:
    is-typedarray "^1.0.0"

typescript@^3.6.3:
  version "3.7.2"
  resolved "https://registry.yarnpkg.com/typescript/-/typescript-3.7.2.tgz"
  integrity sha512-ml7V7JfiN2Xwvcer+XAf2csGO1bPBdRbFCkYBczNZggrBZ9c7G3riSUeJmqEU5uOtXNPMhE3n+R4FA/3YOAWOQ==

uglify-js@^3.1.4:
  version "3.6.0"
  resolved "https://registry.yarnpkg.com/uglify-js/-/uglify-js-3.6.0.tgz"
  integrity sha512-W+jrUHJr3DXKhrsS7NUVxn3zqMOFn0hL/Ei6v0anCIMoKC93TjcflTagwIHLW7SfMFfiQuktQyFVCFHGUE0+yg==
  dependencies:
    commander "~2.20.0"
    source-map "~0.6.1"

unicode-length@^1.0.0:
  version "1.0.3"
  resolved "https://registry.yarnpkg.com/unicode-length/-/unicode-length-1.0.3.tgz"
  integrity sha1-Wtp6f+1RhBpBijKM8UlHisg1irs=
  dependencies:
    punycode "^1.3.2"
    strip-ansi "^3.0.1"

unicode-length@^2.0.1:
  version "2.0.2"
  resolved "https://registry.yarnpkg.com/unicode-length/-/unicode-length-2.0.2.tgz"
  integrity sha512-Ph/j1VbS3/r77nhoY2WU0GWGjVYOHL3xpKp0y/Eq2e5r0mT/6b649vm7KFO6RdAdrZkYLdxphYVgvODxPB+Ebg==
  dependencies:
    punycode "^2.0.0"
    strip-ansi "^3.0.1"

uri-js@^4.2.2:
  version "4.2.2"
  resolved "https://registry.yarnpkg.com/uri-js/-/uri-js-4.2.2.tgz"
  integrity sha512-KY9Frmirql91X2Qgjry0Wd4Y+YTdrdZheS8TFwvkbLWf/G5KNJDCh6pKL5OZctEW4+0Baa5idK2ZQuELRwPznQ==
  dependencies:
    punycode "^2.1.0"

util-deprecate@~1.0.1:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/util-deprecate/-/util-deprecate-1.0.2.tgz"
  integrity sha1-RQ1Nyfpw3nMnYvvS1KKJgUGaDM8=

uuid@^3.3.2:
  version "3.3.2"
  resolved "https://registry.yarnpkg.com/uuid/-/uuid-3.3.2.tgz"
  integrity sha512-yXJmeNaw3DnnKAOKJE51sL/ZaYfWJRl1pK9dr19YFCu0ObS231AB1/LbqTKRAQ5kw8A90rA6fr4riOUpTZvQZA==

validate-npm-package-license@^3.0.1:
  version "3.0.4"
  resolved "https://registry.yarnpkg.com/validate-npm-package-license/-/validate-npm-package-license-3.0.4.tgz"
  integrity sha512-DpKm2Ui/xN7/HQKCtpZxoRWBhZ9Z0kqtygG8XCgNQ8ZlDnxuQmWhj566j8fN4Cu3/JmbhsDo7fcAJq4s9h27Ew==
  dependencies:
    spdx-correct "^3.0.0"
    spdx-expression-parse "^3.0.0"

verror@1.10.0:
  version "1.10.0"
  resolved "https://registry.yarnpkg.com/verror/-/verror-1.10.0.tgz"
  integrity sha1-OhBcoXBTr1XW4nDB+CiGguGNpAA=
  dependencies:
    assert-plus "^1.0.0"
    core-util-is "1.0.2"
    extsprintf "^1.2.0"

vlq@^0.2.1:
  version "0.2.3"
  resolved "https://registry.yarnpkg.com/vlq/-/vlq-0.2.3.tgz"
  integrity sha512-DRibZL6DsNhIgYQ+wNdWDL2SL3bKPlVrRiBqV5yuMm++op8W4kGFtaQfCs4KEJn0wBZcHVHJ3eoywX8983k1ow==

which-module@^2.0.0:
  version "2.0.0"
  resolved "https://registry.yarnpkg.com/which-module/-/which-module-2.0.0.tgz"
  integrity sha1-2e8H3Od7mQK4o6j6SzHD4/fm6Ho=

which@^1.2.9, which@^1.3.0:
  version "1.3.1"
  resolved "https://registry.yarnpkg.com/which/-/which-1.3.1.tgz"
  integrity sha512-HxJdYWq1MTIQbJ3nw0cqssHoTNU267KlrDuGZ1WYlxDStUtKUhOaJmh112/TZmHxxUfuJqPXSOm7tDyas0OSIQ==
  dependencies:
    isexe "^2.0.0"

which@^2.0.1:
  version "2.0.1"
  resolved "https://registry.yarnpkg.com/which/-/which-2.0.1.tgz"
  integrity sha512-N7GBZOTswtB9lkQBZA4+zAXrjEIWAUOB93AvzUiudRzRxhUdLURQ7D/gAIMY1gatT/LTbmbcv8SiYazy3eYB7w==
  dependencies:
    isexe "^2.0.0"

widest-line@^2.0.0:
  version "2.0.1"
  resolved "https://registry.yarnpkg.com/widest-line/-/widest-line-2.0.1.tgz"
  integrity sha512-Ba5m9/Fa4Xt9eb2ELXt77JxVDV8w7qQrH0zS/TWSJdLyAwQjWoOzpzj5lwVftDz6n/EOu3tNACS84v509qwnJA==
  dependencies:
    string-width "^2.1.1"

wordwrap@~0.0.2:
  version "0.0.3"
  resolved "https://registry.yarnpkg.com/wordwrap/-/wordwrap-0.0.3.tgz"
  integrity sha1-o9XabNXAvAAI03I0u68b7WMFkQc=

wrap-ansi@^2.0.0:
  version "2.1.0"
  resolved "https://registry.yarnpkg.com/wrap-ansi/-/wrap-ansi-2.1.0.tgz"
  integrity sha1-2Pw9KE3QV5T+hJc8rs3Rz4JP3YU=
  dependencies:
    string-width "^1.0.1"
    strip-ansi "^3.0.1"

wrap-ansi@^5.0.0, wrap-ansi@^5.1.0:
  version "5.1.0"
  resolved "https://registry.yarnpkg.com/wrap-ansi/-/wrap-ansi-5.1.0.tgz"
  integrity sha512-QC1/iN/2/RPVJ5jYK8BGttj5z83LmSKmvbvrXPNCLZSEb32KKVDJDl/MOt2N01qU2H/FkzEa9PKto1BqDjtd7Q==
  dependencies:
    ansi-styles "^3.2.0"
    string-width "^3.0.0"
    strip-ansi "^5.0.0"

wrappy@1:
  version "1.0.2"
  resolved "https://registry.yarnpkg.com/wrappy/-/wrappy-1.0.2.tgz"
  integrity sha1-tSQ9jz7BqjXxNkYFvA0QNuMKtp8=

write-file-atomic@^2.4.2:
  version "2.4.3"
  resolved "https://registry.yarnpkg.com/write-file-atomic/-/write-file-atomic-2.4.3.tgz"
  integrity sha512-GaETH5wwsX+GcnzhPgKcKjJ6M2Cq3/iZp1WyY/X1CSqrW+jVNM9Y7D8EC2sM4ZG/V8wZlSniJnCKWPmBYAucRQ==
  dependencies:
    graceful-fs "^4.1.11"
    imurmurhash "^0.1.4"
    signal-exit "^3.0.2"

write-file-atomic@^3.0.0:
  version "3.0.0"
  resolved "https://registry.yarnpkg.com/write-file-atomic/-/write-file-atomic-3.0.0.tgz"
  integrity sha512-EIgkf60l2oWsffja2Sf2AL384dx328c0B+cIYPTQq5q2rOYuDV00/iPFBOUiDKKwKMOhkymH8AidPaRvzfxY+Q==
  dependencies:
    imurmurhash "^0.1.4"
    is-typedarray "^1.0.0"
    signal-exit "^3.0.2"
    typedarray-to-buffer "^3.1.5"

y18n@^4.0.0:
  version "4.0.0"
  resolved "https://registry.yarnpkg.com/y18n/-/y18n-4.0.0.tgz"
  integrity sha512-r9S/ZyXu/Xu9q1tYlpsLIsa3EeLXXk0VwlxqTcFRfg9EhMW+17kbt9G0NrgCmhGb5vT2hyhJZLfDGx+7+5Uj/w==

yallist@^2.1.2:
  version "2.1.2"
  resolved "https://registry.yarnpkg.com/yallist/-/yallist-2.1.2.tgz"
  integrity sha1-HBH5IY8HYImkfdUS+TxmmaaoHVI=

yallist@^4.0.0:
  version "4.0.0"
  resolved "https://registry.yarnpkg.com/yallist/-/yallist-4.0.0.tgz"
  integrity sha512-3wdGidZyq5PB084XLES5TpOSRA3wjXAlIWMhum2kRcv/41Sn2emQ0dycQW4uZXLejwKvg6EsvbdlVL+FYEct7A==

yaml@^1.5.0, yaml@^1.6.0:
  version "1.6.0"
  resolved "https://registry.yarnpkg.com/yaml/-/yaml-1.6.0.tgz"
  integrity sha512-iZfse3lwrJRoSlfs/9KQ9iIXxs9++RvBFVzAqbbBiFT+giYtyanevreF9r61ZTbGMgWQBxAua3FzJiniiJXWWw==
  dependencies:
    "@babel/runtime" "^7.4.5"

yapool@^1.0.0:
  version "1.0.0"
  resolved "https://registry.yarnpkg.com/yapool/-/yapool-1.0.0.tgz"
  integrity sha1-9pPymjFbUNmp2iZGp6ZkXJaYW2o=

yargs-parser@^13.0.0, yargs-parser@^13.1.0:
  version "13.1.1"
  resolved "https://registry.yarnpkg.com/yargs-parser/-/yargs-parser-13.1.1.tgz"
  integrity sha512-oVAVsHz6uFrg3XQheFII8ESO2ssAf9luWuAd6Wexsu4F3OtIW0o8IribPXYrD4WC24LWtPrJlGy87y5udK+dxQ==
  dependencies:
    camelcase "^5.0.0"
    decamelize "^1.2.0"

yargs@^13.2.2:
  version "13.2.4"
  resolved "https://registry.yarnpkg.com/yargs/-/yargs-13.2.4.tgz"
  integrity sha512-HG/DWAJa1PAnHT9JAhNa8AbAv3FPaiLzioSjCcmuXXhP8MlpHO5vwls4g4j6n30Z74GVQj8Xa62dWVx1QCGklg==
  dependencies:
    cliui "^5.0.0"
    find-up "^3.0.0"
    get-caller-file "^2.0.1"
    os-locale "^3.1.0"
    require-directory "^2.1.1"
    require-main-filename "^2.0.0"
    set-blocking "^2.0.0"
    string-width "^3.0.0"
    which-module "^2.0.0"
    y18n "^4.0.0"
    yargs-parser "^13.1.0"

yn@^3.0.0:
  version "3.1.0"
  resolved "https://registry.yarnpkg.com/yn/-/yn-3.1.0.tgz"
  integrity sha512-kKfnnYkbTfrAdd0xICNFw7Atm8nKpLcLv9AZGEt+kczL/WQVai4e2V6ZN8U/O+iI6WrNuJjNNOyu4zfhl9D3Hg==

yoga-layout-prebuilt@^1.9.3:
  version "1.9.3"
  resolved "https://registry.yarnpkg.com/yoga-layout-prebuilt/-/yoga-layout-prebuilt-1.9.3.tgz"
  integrity sha512-9SNQpwuEh2NucU83i2KMZnONVudZ86YNcFk9tq74YaqrQfgJWO3yB9uzH1tAg8iqh5c9F5j0wuyJ2z72wcum2w==
`
})
  return path
}
