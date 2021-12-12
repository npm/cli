// generated from test/fixtures/sax
module.exports = t => {
  const path = t.testdir({
  "package-lock.json": JSON.stringify({
    "name": "sax",
    "version": "1.2.4",
    "lockfileVersion": 1,
    "dependencies": {
      "acorn": {
        "version": "https://registry.npmjs.org/acorn/-/acorn-4.0.4.tgz",
        "integrity": "sha1-F6jWp6bE71OLgU7Jq6wneSk78wo=",
        "dev": true
      },
      "acorn-jsx": {
        "version": "https://registry.npmjs.org/acorn-jsx/-/acorn-jsx-3.0.1.tgz",
        "integrity": "sha1-r9+UiPsezvyDSPb7IvRk4ypYs2s=",
        "dev": true,
        "dependencies": {
          "acorn": {
            "version": "https://registry.npmjs.org/acorn/-/acorn-3.3.0.tgz",
            "integrity": "sha1-ReN/s56No/JbruP/U2niu18iAXo=",
            "dev": true
          }
        }
      },
      "ajv": {
        "version": "https://registry.npmjs.org/ajv/-/ajv-4.11.2.tgz",
        "integrity": "sha1-8WbDwRy8bLncwQKlvP5bcslSh+Y=",
        "dev": true
      },
      "ajv-keywords": {
        "version": "https://registry.npmjs.org/ajv-keywords/-/ajv-keywords-1.5.1.tgz",
        "integrity": "sha1-MU3QpLM2j609/NxU7eYXG4htrzw=",
        "dev": true
      },
      "ansi-escapes": {
        "version": "https://registry.npmjs.org/ansi-escapes/-/ansi-escapes-1.4.0.tgz",
        "integrity": "sha1-06ioOzGapneTZisT52HHkRQiMG4=",
        "dev": true
      },
      "ansi-regex": {
        "version": "https://registry.npmjs.org/ansi-regex/-/ansi-regex-2.0.0.tgz",
        "integrity": "sha1-xQYbbg74qBd15Q9dZhUb9r83EQc=",
        "dev": true
      },
      "ansi-styles": {
        "version": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-2.1.0.tgz",
        "integrity": "sha1-mQ90cUaSe1Wakyv5KVkWPWDA0OI=",
        "dev": true
      },
      "argparse": {
        "version": "https://registry.npmjs.org/argparse/-/argparse-1.0.9.tgz",
        "integrity": "sha1-c9g7wmP4bpf4zE9rrhsOkKfSLIY=",
        "dev": true
      },
      "array-union": {
        "version": "https://registry.npmjs.org/array-union/-/array-union-1.0.2.tgz",
        "integrity": "sha1-mjRBDk9OPaI96jdb5b5w8kd47Dk=",
        "dev": true
      },
      "array-uniq": {
        "version": "https://registry.npmjs.org/array-uniq/-/array-uniq-1.0.3.tgz",
        "integrity": "sha1-r2rId6Jcx/dOBYiUdThY39sk/bY=",
        "dev": true
      },
      "arrify": {
        "version": "https://registry.npmjs.org/arrify/-/arrify-1.0.1.tgz",
        "integrity": "sha1-iYUI2iIm84DfkEcoRWhJwVAaSw0=",
        "dev": true
      },
      "asn1": {
        "version": "https://registry.npmjs.org/asn1/-/asn1-0.2.3.tgz",
        "integrity": "sha1-2sh4dxPJlmhJ/IGAd36+nB3fO4Y=",
        "dev": true
      },
      "assert-plus": {
        "version": "https://registry.npmjs.org/assert-plus/-/assert-plus-0.2.0.tgz",
        "integrity": "sha1-104bh+ev/A24qttwIfP+SBAasjQ=",
        "dev": true
      },
      "asynckit": {
        "version": "https://registry.npmjs.org/asynckit/-/asynckit-0.4.0.tgz",
        "integrity": "sha1-x57Zf380y48robyXkLzDZkdLS3k=",
        "dev": true
      },
      "aws-sign2": {
        "version": "https://registry.npmjs.org/aws-sign2/-/aws-sign2-0.6.0.tgz",
        "integrity": "sha1-FDQt0428yU0OW4fXY81jYSwOeU8=",
        "dev": true
      },
      "aws4": {
        "version": "https://registry.npmjs.org/aws4/-/aws4-1.6.0.tgz",
        "integrity": "sha1-g+9cqGCysy5KDe7e6MdxudtXRx4=",
        "dev": true
      },
      "babel-code-frame": {
        "version": "https://registry.npmjs.org/babel-code-frame/-/babel-code-frame-6.22.0.tgz",
        "integrity": "sha1-AnYgvuVnqIwyVhV05/0IAdMxGOQ=",
        "dev": true,
        "dependencies": {
          "esutils": {
            "version": "https://registry.npmjs.org/esutils/-/esutils-2.0.2.tgz",
            "integrity": "sha1-Cr9PHKpbyx96nYrMbepPqqBLrJs=",
            "dev": true
          }
        }
      },
      "balanced-match": {
        "version": "https://registry.npmjs.org/balanced-match/-/balanced-match-0.3.0.tgz",
        "integrity": "sha1-qRzdHr7xqGZZ5w/03vAWJfwtZ1Y=",
        "dev": true
      },
      "bcrypt-pbkdf": {
        "version": "https://registry.npmjs.org/bcrypt-pbkdf/-/bcrypt-pbkdf-1.0.1.tgz",
        "integrity": "sha1-Y7xdy2EzG5K8Bf1SiVPDNGKgb40=",
        "dev": true,
        "optional": true
      },
      "bind-obj-methods": {
        "version": "https://registry.npmjs.org/bind-obj-methods/-/bind-obj-methods-1.0.0.tgz",
        "integrity": "sha1-T1l5ysFXk633DkiBYeRj4gnKUJw=",
        "dev": true
      },
      "bluebird": {
        "version": "3.5.0",
        "resolved": "https://registry.npmjs.org/bluebird/-/bluebird-3.5.0.tgz",
        "integrity": "sha1-eRQg1/VR7qKJdFOop3ZT+WYG1nw=",
        "dev": true
      },
      "boom": {
        "version": "https://registry.npmjs.org/boom/-/boom-2.10.1.tgz",
        "integrity": "sha1-OciRjO/1eZ+D+UkqhI9iWt0Mdm8=",
        "dev": true
      },
      "brace-expansion": {
        "version": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-1.1.3.tgz",
        "integrity": "sha1-Rr/1ARXUf8mriYVKu4fZgHihCZE=",
        "dev": true
      },
      "buffer-shims": {
        "version": "https://registry.npmjs.org/buffer-shims/-/buffer-shims-1.0.0.tgz",
        "integrity": "sha1-mXjOMXOIxkmth5MCjDR37wRKi1E=",
        "dev": true
      },
      "caller-path": {
        "version": "https://registry.npmjs.org/caller-path/-/caller-path-0.1.0.tgz",
        "integrity": "sha1-lAhe9jWB7NPaqSREqP6U6CV3dR8=",
        "dev": true
      },
      "callsites": {
        "version": "https://registry.npmjs.org/callsites/-/callsites-0.2.0.tgz",
        "integrity": "sha1-r6uWJikQp/M8GaV3WCXGnzTjUMo=",
        "dev": true
      },
      "caseless": {
        "version": "https://registry.npmjs.org/caseless/-/caseless-0.11.0.tgz",
        "integrity": "sha1-cVuW6phBWTzDMGeSP17GDr2k99c=",
        "dev": true
      },
      "chalk": {
        "version": "https://registry.npmjs.org/chalk/-/chalk-1.1.1.tgz",
        "integrity": "sha1-UJr7ZwZudJn36zU1x3RFdyri0Bk=",
        "dev": true,
        "dependencies": {
          "supports-color": {
            "version": "https://registry.npmjs.org/supports-color/-/supports-color-2.0.0.tgz",
            "integrity": "sha1-U10EXOa2Nj+kARcIRimZXp3zJMc=",
            "dev": true
          }
        }
      },
      "circular-json": {
        "version": "https://registry.npmjs.org/circular-json/-/circular-json-0.3.1.tgz",
        "integrity": "sha1-vos2rvzN6LPKeqLWr8B6NyQsDS0=",
        "dev": true
      },
      "clean-yaml-object": {
        "version": "https://registry.npmjs.org/clean-yaml-object/-/clean-yaml-object-0.1.0.tgz",
        "integrity": "sha1-Y/sRDcLOGoTcIfbZM0h20BCui2g=",
        "dev": true
      },
      "cli-cursor": {
        "version": "https://registry.npmjs.org/cli-cursor/-/cli-cursor-1.0.2.tgz",
        "integrity": "sha1-ZNo/fValRBLll5S9Ytw1KV6PKYc=",
        "dev": true
      },
      "cli-width": {
        "version": "https://registry.npmjs.org/cli-width/-/cli-width-2.1.0.tgz",
        "integrity": "sha1-sjTKIJsp72b8UY2bmNWEewDt8Ao=",
        "dev": true
      },
      "co": {
        "version": "https://registry.npmjs.org/co/-/co-4.6.0.tgz",
        "integrity": "sha1-bqa989hTrlTMuOR7+gvz+QMfsYQ=",
        "dev": true
      },
      "code-point-at": {
        "version": "https://registry.npmjs.org/code-point-at/-/code-point-at-1.0.0.tgz",
        "integrity": "sha1-9psZLT99keOC5Lcb3bd4eGGasMY=",
        "dev": true
      },
      "color-support": {
        "version": "https://registry.npmjs.org/color-support/-/color-support-1.1.2.tgz",
        "integrity": "sha1-ScyZuJ0b3vEpLp2TI8ZpcaM+uJ0=",
        "dev": true
      },
      "combined-stream": {
        "version": "https://registry.npmjs.org/combined-stream/-/combined-stream-1.0.5.tgz",
        "integrity": "sha1-k4NwpXtKUd6ix3wV1cX9+JUWQAk=",
        "dev": true
      },
      "concat-map": {
        "version": "https://registry.npmjs.org/concat-map/-/concat-map-0.0.1.tgz",
        "integrity": "sha1-2Klr13/Wjfd5OnMDajug1UBdR3s=",
        "dev": true
      },
      "concat-stream": {
        "version": "https://registry.npmjs.org/concat-stream/-/concat-stream-1.6.0.tgz",
        "integrity": "sha1-CqxmL9Ur54lk1VMvaUeE5wEQrPc=",
        "dev": true,
        "dependencies": {
          "inherits": {
            "version": "https://registry.npmjs.org/inherits/-/inherits-2.0.3.tgz",
            "integrity": "sha1-Yzwsg+PaQqUC9SRmAiSA9CCCYd4=",
            "dev": true
          },
          "isarray": {
            "version": "https://registry.npmjs.org/isarray/-/isarray-1.0.0.tgz",
            "integrity": "sha1-u5NdSFgsuhaMBoNJV6VKPgcSTxE=",
            "dev": true
          },
          "process-nextick-args": {
            "version": "https://registry.npmjs.org/process-nextick-args/-/process-nextick-args-1.0.7.tgz",
            "integrity": "sha1-FQ4gt1ZZCtP5EJPyWk8q2L/zC6M=",
            "dev": true
          },
          "readable-stream": {
            "version": "https://registry.npmjs.org/readable-stream/-/readable-stream-2.2.2.tgz",
            "integrity": "sha1-qeb+w8fdqF+LsbO6cChgRVb8gl4=",
            "dev": true
          }
        }
      },
      "core-util-is": {
        "version": "https://registry.npmjs.org/core-util-is/-/core-util-is-1.0.2.tgz",
        "integrity": "sha1-tf1UIgqivFq1eqtxQMlAdUUDwac=",
        "dev": true
      },
      "coveralls": {
        "version": "https://registry.npmjs.org/coveralls/-/coveralls-2.11.16.tgz",
        "integrity": "sha1-2pBhJlFC3e6VT2g3kSK+l76KtLE=",
        "dev": true,
        "dependencies": {
          "esprima": {
            "version": "https://registry.npmjs.org/esprima/-/esprima-2.7.3.tgz",
            "integrity": "sha1-luO3DVd59q1JzQMmc9HDEnZ7pYE=",
            "dev": true
          },
          "js-yaml": {
            "version": "https://registry.npmjs.org/js-yaml/-/js-yaml-3.6.1.tgz",
            "integrity": "sha1-bl/mfYsgXOTSL60Ft3geja3MSzA=",
            "dev": true
          },
          "minimist": {
            "version": "https://registry.npmjs.org/minimist/-/minimist-1.2.0.tgz",
            "integrity": "sha1-o1AIsg9BOD7sH7kU9M1d95omQoQ=",
            "dev": true
          }
        }
      },
      "cross-spawn": {
        "version": "https://registry.npmjs.org/cross-spawn/-/cross-spawn-4.0.2.tgz",
        "integrity": "sha1-e5JHYhwjrf3ThWAEqCPL45dCTUE=",
        "dev": true,
        "dependencies": {
          "lru-cache": {
            "version": "https://registry.npmjs.org/lru-cache/-/lru-cache-4.0.2.tgz",
            "integrity": "sha1-HRdnnAac2l0ECZGgnbwsDbN35V4=",
            "dev": true
          },
          "which": {
            "version": "https://registry.npmjs.org/which/-/which-1.2.12.tgz",
            "integrity": "sha1-3me15FAmnxlJCe8j7OTr5Bb6EZI=",
            "dev": true
          }
        }
      },
      "cryptiles": {
        "version": "https://registry.npmjs.org/cryptiles/-/cryptiles-2.0.5.tgz",
        "integrity": "sha1-O9/s3GCBR8HGcgL6KR59ylnqo7g=",
        "dev": true
      },
      "d": {
        "version": "https://registry.npmjs.org/d/-/d-0.1.1.tgz",
        "integrity": "sha1-2hhMU10Y2O57oqoim5FACfrhEwk=",
        "dev": true
      },
      "dashdash": {
        "version": "https://registry.npmjs.org/dashdash/-/dashdash-1.14.1.tgz",
        "integrity": "sha1-hTz6D3y+L+1d4gMmuN1YEDX24vA=",
        "dev": true,
        "dependencies": {
          "assert-plus": {
            "version": "https://registry.npmjs.org/assert-plus/-/assert-plus-1.0.0.tgz",
            "integrity": "sha1-8S4PPF13sLHN2RRpQuTpbB5N1SU=",
            "dev": true
          }
        }
      },
      "debug": {
        "version": "https://registry.npmjs.org/debug/-/debug-2.2.0.tgz",
        "integrity": "sha1-+HBX6ZWxofauaklgZkE3vFbwOdo=",
        "dev": true
      },
      "debug-log": {
        "version": "https://registry.npmjs.org/debug-log/-/debug-log-1.0.1.tgz",
        "integrity": "sha1-IwdjLUwEOCuN+KMvcLiVBG1SdF8=",
        "dev": true
      },
      "deep-is": {
        "version": "https://registry.npmjs.org/deep-is/-/deep-is-0.1.3.tgz",
        "integrity": "sha1-s2nW+128E+7PUk+RsHD+7cNXzzQ=",
        "dev": true
      },
      "deglob": {
        "version": "https://registry.npmjs.org/deglob/-/deglob-2.1.0.tgz",
        "integrity": "sha1-TUSr4W7zLHebSXK9FBqAMlApoUo=",
        "dev": true,
        "dependencies": {
          "glob": {
            "version": "https://registry.npmjs.org/glob/-/glob-7.1.1.tgz",
            "integrity": "sha1-gFIR3wT6rxxjo2ADBs31reULLsg=",
            "dev": true
          },
          "minimatch": {
            "version": "https://registry.npmjs.org/minimatch/-/minimatch-3.0.3.tgz",
            "integrity": "sha1-Kk5AkLlrLbBqnX3wEFWmKnfJt3Q=",
            "dev": true
          }
        }
      },
      "del": {
        "version": "https://registry.npmjs.org/del/-/del-2.2.2.tgz",
        "integrity": "sha1-wSyYHQZ4RshLyvhiz/kw2Qf/0ag=",
        "dev": true
      },
      "delayed-stream": {
        "version": "https://registry.npmjs.org/delayed-stream/-/delayed-stream-1.0.0.tgz",
        "integrity": "sha1-3zrhmayt+31ECqrgsp4icrJOxhk=",
        "dev": true
      },
      "diff": {
        "version": "https://registry.npmjs.org/diff/-/diff-1.4.0.tgz",
        "integrity": "sha1-fyjS657nsVqX79ic5j3P2qPMur8=",
        "dev": true
      },
      "doctrine": {
        "version": "https://registry.npmjs.org/doctrine/-/doctrine-1.5.0.tgz",
        "integrity": "sha1-N53Ocw9hZvds76TmcHoVmwLFpvo=",
        "dev": true,
        "dependencies": {
          "esutils": {
            "version": "https://registry.npmjs.org/esutils/-/esutils-2.0.2.tgz",
            "integrity": "sha1-Cr9PHKpbyx96nYrMbepPqqBLrJs=",
            "dev": true
          },
          "isarray": {
            "version": "https://registry.npmjs.org/isarray/-/isarray-1.0.0.tgz",
            "integrity": "sha1-u5NdSFgsuhaMBoNJV6VKPgcSTxE=",
            "dev": true
          }
        }
      },
      "ecc-jsbn": {
        "version": "https://registry.npmjs.org/ecc-jsbn/-/ecc-jsbn-0.1.1.tgz",
        "integrity": "sha1-D8c6ntXw1Tw4GTOYUj735UN3dQU=",
        "dev": true,
        "optional": true
      },
      "es5-ext": {
        "version": "https://registry.npmjs.org/es5-ext/-/es5-ext-0.10.8.tgz",
        "integrity": "sha1-9IxDQk+nx9lvkD4pSHBc+Cb2nDI=",
        "dev": true
      },
      "es6-iterator": {
        "version": "https://registry.npmjs.org/es6-iterator/-/es6-iterator-2.0.0.tgz",
        "integrity": "sha1-vZaFZ9YWNeM8C4BydhPJy0sJa6w=",
        "dev": true
      },
      "es6-map": {
        "version": "https://registry.npmjs.org/es6-map/-/es6-map-0.1.4.tgz",
        "integrity": "sha1-o0sUe+IkdzpNfagHJ5TO+jYyuJc=",
        "dev": true,
        "dependencies": {
          "es5-ext": {
            "version": "https://registry.npmjs.org/es5-ext/-/es5-ext-0.10.12.tgz",
            "integrity": "sha1-qoRkHU23a2Krul5F/YBey6sUAEc=",
            "dev": true
          },
          "es6-symbol": {
            "version": "https://registry.npmjs.org/es6-symbol/-/es6-symbol-3.1.0.tgz",
            "integrity": "sha1-lEgcZV56fK2C66gy2X1UM0ltf/o=",
            "dev": true
          }
        }
      },
      "es6-set": {
        "version": "https://registry.npmjs.org/es6-set/-/es6-set-0.1.4.tgz",
        "integrity": "sha1-lRa2dhwpZLkv9HlFYjOiR9xwfOg=",
        "dev": true,
        "dependencies": {
          "es5-ext": {
            "version": "https://registry.npmjs.org/es5-ext/-/es5-ext-0.10.12.tgz",
            "integrity": "sha1-qoRkHU23a2Krul5F/YBey6sUAEc=",
            "dev": true,
            "dependencies": {
              "es6-symbol": {
                "version": "https://registry.npmjs.org/es6-symbol/-/es6-symbol-3.1.0.tgz",
                "integrity": "sha1-lEgcZV56fK2C66gy2X1UM0ltf/o=",
                "dev": true
              }
            }
          }
        }
      },
      "es6-symbol": {
        "version": "https://registry.npmjs.org/es6-symbol/-/es6-symbol-3.0.0.tgz",
        "integrity": "sha1-PsMQg0pQqiRBqTVaRjYNmSQlzrg=",
        "dev": true
      },
      "es6-weak-map": {
        "version": "https://registry.npmjs.org/es6-weak-map/-/es6-weak-map-2.0.1.tgz",
        "integrity": "sha1-DSu9iCfrX7S6j5f7/qUNQ9sh6oE=",
        "dev": true
      },
      "escape-string-regexp": {
        "version": "https://registry.npmjs.org/escape-string-regexp/-/escape-string-regexp-1.0.3.tgz",
        "integrity": "sha1-ni2LJbwlVcMzZyN1DgPwmcJzW7U=",
        "dev": true
      },
      "escope": {
        "version": "https://registry.npmjs.org/escope/-/escope-3.6.0.tgz",
        "integrity": "sha1-4Bl16BJ4GhY6ba392AOY3GTIicM=",
        "dev": true,
        "dependencies": {
          "estraverse": {
            "version": "https://registry.npmjs.org/estraverse/-/estraverse-4.2.0.tgz",
            "integrity": "sha1-De4/7TH81GlhjOc0IJn8GvoL2xM=",
            "dev": true
          }
        }
      },
      "eslint": {
        "version": "https://registry.npmjs.org/eslint/-/eslint-3.10.2.tgz",
        "integrity": "sha1-yaEOi/bp1lZRIEd4xQM0Hx6sPOc=",
        "dev": true,
        "dependencies": {
          "ansi-styles": {
            "version": "https://registry.npmjs.org/ansi-styles/-/ansi-styles-2.2.1.tgz",
            "integrity": "sha1-tDLdM1i2NM914eRmQ2gkBTPB3b4=",
            "dev": true
          },
          "chalk": {
            "version": "https://registry.npmjs.org/chalk/-/chalk-1.1.3.tgz",
            "integrity": "sha1-qBFcVeSnAv5NFQq9OHKCKn4J/Jg=",
            "dev": true
          },
          "estraverse": {
            "version": "https://registry.npmjs.org/estraverse/-/estraverse-4.2.0.tgz",
            "integrity": "sha1-De4/7TH81GlhjOc0IJn8GvoL2xM=",
            "dev": true
          },
          "esutils": {
            "version": "https://registry.npmjs.org/esutils/-/esutils-2.0.2.tgz",
            "integrity": "sha1-Cr9PHKpbyx96nYrMbepPqqBLrJs=",
            "dev": true
          },
          "fast-levenshtein": {
            "version": "https://registry.npmjs.org/fast-levenshtein/-/fast-levenshtein-2.0.6.tgz",
            "integrity": "sha1-PYpcZog6FqMMqGQ+hR8Zuqd5eRc=",
            "dev": true
          },
          "glob": {
            "version": "https://registry.npmjs.org/glob/-/glob-7.1.1.tgz",
            "integrity": "sha1-gFIR3wT6rxxjo2ADBs31reULLsg=",
            "dev": true
          },
          "js-yaml": {
            "version": "https://registry.npmjs.org/js-yaml/-/js-yaml-3.8.1.tgz",
            "integrity": "sha1-eCulAgC+e55ahTcAG3gE2zrQJig=",
            "dev": true
          },
          "levn": {
            "version": "https://registry.npmjs.org/levn/-/levn-0.3.0.tgz",
            "integrity": "sha1-OwmSTt+fCDwEkP3UwLxEIeBHZO4=",
            "dev": true
          },
          "lodash": {
            "version": "https://registry.npmjs.org/lodash/-/lodash-4.17.4.tgz",
            "integrity": "sha1-eCA6TRwyiuHYbcpkYONptX9AVa4=",
            "dev": true
          },
          "minimatch": {
            "version": "https://registry.npmjs.org/minimatch/-/minimatch-3.0.3.tgz",
            "integrity": "sha1-Kk5AkLlrLbBqnX3wEFWmKnfJt3Q=",
            "dev": true
          },
          "optionator": {
            "version": "https://registry.npmjs.org/optionator/-/optionator-0.8.2.tgz",
            "integrity": "sha1-NkxeQJ0/TWMB1sC0wFu6UBgK62Q=",
            "dev": true
          },
          "strip-bom": {
            "version": "https://registry.npmjs.org/strip-bom/-/strip-bom-3.0.0.tgz",
            "integrity": "sha1-IzTBjpx1n3vdVv3vfprj1YjmjtM=",
            "dev": true
          },
          "type-check": {
            "version": "https://registry.npmjs.org/type-check/-/type-check-0.3.2.tgz",
            "integrity": "sha1-WITKtRLPHTVeP7eE8wgEsrUg23I=",
            "dev": true
          }
        }
      },
      "eslint-config-standard": {
        "version": "https://registry.npmjs.org/eslint-config-standard/-/eslint-config-standard-6.2.1.tgz",
        "integrity": "sha1-06aKr8cZFjnn7kQec0hzkCY1QpI=",
        "dev": true
      },
      "eslint-config-standard-jsx": {
        "version": "https://registry.npmjs.org/eslint-config-standard-jsx/-/eslint-config-standard-jsx-3.2.0.tgz",
        "integrity": "sha1-wkDibtkZoRpCqk3oBZRys4Jo1iA=",
        "dev": true
      },
      "eslint-plugin-promise": {
        "version": "https://registry.npmjs.org/eslint-plugin-promise/-/eslint-plugin-promise-3.4.1.tgz",
        "integrity": "sha1-aRGpAQv4ThfYLhngqw+AqzrW20w=",
        "dev": true
      },
      "eslint-plugin-react": {
        "version": "https://registry.npmjs.org/eslint-plugin-react/-/eslint-plugin-react-6.7.1.tgz",
        "integrity": "sha1-Gvlq6lRYVoJRV9l8G1DVqPtkpac=",
        "dev": true
      },
      "eslint-plugin-standard": {
        "version": "https://registry.npmjs.org/eslint-plugin-standard/-/eslint-plugin-standard-2.0.1.tgz",
        "integrity": "sha1-NYlpn/nJF/LCX3apFmh/ZBw2n/M=",
        "dev": true
      },
      "espree": {
        "version": "https://registry.npmjs.org/espree/-/espree-3.4.0.tgz",
        "integrity": "sha1-QWVvpWKOBCh4Al70Z+ePEly4bh0=",
        "dev": true
      },
      "esprima": {
        "version": "https://registry.npmjs.org/esprima/-/esprima-3.1.3.tgz",
        "integrity": "sha1-/cpRzuYTOJXjyI1TXOSdv/YqRjM=",
        "dev": true
      },
      "esrecurse": {
        "version": "https://registry.npmjs.org/esrecurse/-/esrecurse-4.1.0.tgz",
        "integrity": "sha1-RxO2U2rffyrE8yfVWed1a/9kgiA=",
        "dev": true,
        "dependencies": {
          "estraverse": {
            "version": "https://registry.npmjs.org/estraverse/-/estraverse-4.1.1.tgz",
            "integrity": "sha1-9srKcokzqFDvkGYdDheYK6RxEaI=",
            "dev": true
          }
        }
      },
      "event-emitter": {
        "version": "https://registry.npmjs.org/event-emitter/-/event-emitter-0.3.4.tgz",
        "integrity": "sha1-jWPd+0z+H647MsomXExyAiIIC7U=",
        "dev": true
      },
      "events-to-array": {
        "version": "https://registry.npmjs.org/events-to-array/-/events-to-array-1.0.2.tgz",
        "integrity": "sha1-s0hEZVNP5P9m+90ag7d3cTukBKo=",
        "dev": true
      },
      "exit-hook": {
        "version": "https://registry.npmjs.org/exit-hook/-/exit-hook-1.1.1.tgz",
        "integrity": "sha1-8FyiM7SMBdVP/wd2XfhQfpXAL/g=",
        "dev": true
      },
      "extsprintf": {
        "version": "https://registry.npmjs.org/extsprintf/-/extsprintf-1.0.2.tgz",
        "integrity": "sha1-4QgOBljjALBilJkMxw4VAiNf1VA=",
        "dev": true
      },
      "figures": {
        "version": "https://registry.npmjs.org/figures/-/figures-1.7.0.tgz",
        "integrity": "sha1-y+Hjr/zxzUS4DK3+0o3Hk6lwHS4=",
        "dev": true,
        "dependencies": {
          "escape-string-regexp": {
            "version": "https://registry.npmjs.org/escape-string-regexp/-/escape-string-regexp-1.0.5.tgz",
            "integrity": "sha1-G2HAViGQqN/2rjuyzwIAyhMLhtQ=",
            "dev": true
          }
        }
      },
      "file-entry-cache": {
        "version": "https://registry.npmjs.org/file-entry-cache/-/file-entry-cache-2.0.0.tgz",
        "integrity": "sha1-w5KZDD5oR4PYOLjISkXYoEhFg2E=",
        "dev": true
      },
      "find-root": {
        "version": "https://registry.npmjs.org/find-root/-/find-root-1.0.0.tgz",
        "integrity": "sha1-li/yEaqyXGUg/u641ih/j26VgHo=",
        "dev": true
      },
      "flat-cache": {
        "version": "https://registry.npmjs.org/flat-cache/-/flat-cache-1.2.2.tgz",
        "integrity": "sha1-+oZxTnLCHbiGAXYezy9VXRq8a5Y=",
        "dev": true
      },
      "foreground-child": {
        "version": "1.5.6",
        "resolved": "https://registry.npmjs.org/foreground-child/-/foreground-child-1.5.6.tgz",
        "integrity": "sha1-T9ca0t/elnibmApcCilZN8svXOk=",
        "dev": true,
        "dependencies": {
          "signal-exit": {
            "version": "3.0.2",
            "resolved": "https://registry.npmjs.org/signal-exit/-/signal-exit-3.0.2.tgz",
            "integrity": "sha1-tf3AjxKH6hF4Yo5BXiUTK3NkbG0=",
            "dev": true
          }
        }
      },
      "forever-agent": {
        "version": "https://registry.npmjs.org/forever-agent/-/forever-agent-0.6.1.tgz",
        "integrity": "sha1-+8cfDEGt6zf5bFd60e1C2P2sypE=",
        "dev": true
      },
      "form-data": {
        "version": "https://registry.npmjs.org/form-data/-/form-data-2.1.2.tgz",
        "integrity": "sha1-icNTQAi5fq2ky7FX1Y9vXfAl6uQ=",
        "dev": true
      },
      "fs-exists-cached": {
        "version": "https://registry.npmjs.org/fs-exists-cached/-/fs-exists-cached-1.0.0.tgz",
        "integrity": "sha1-zyVVTKBQ3EmuZla0HeQiWJidy84=",
        "dev": true
      },
      "fs.realpath": {
        "version": "https://registry.npmjs.org/fs.realpath/-/fs.realpath-1.0.0.tgz",
        "integrity": "sha1-FQStJSMVjKpA20onh8sBQRmU6k8=",
        "dev": true
      },
      "function-loop": {
        "version": "https://registry.npmjs.org/function-loop/-/function-loop-1.0.1.tgz",
        "integrity": "sha1-gHa7MF6OajzO7ikgdl8zDRkPNAw=",
        "dev": true
      },
      "generate-function": {
        "version": "https://registry.npmjs.org/generate-function/-/generate-function-2.0.0.tgz",
        "integrity": "sha1-aFj+fAlpt9TpCTM3ZHrHn2DfvnQ=",
        "dev": true
      },
      "generate-object-property": {
        "version": "https://registry.npmjs.org/generate-object-property/-/generate-object-property-1.2.0.tgz",
        "integrity": "sha1-nA4cQDCM6AT0eDYYuTf6iPmdUNA=",
        "dev": true
      },
      "get-stdin": {
        "version": "https://registry.npmjs.org/get-stdin/-/get-stdin-5.0.1.tgz",
        "integrity": "sha1-Ei4WFZHiH/TFJTAwVpPyDmOTo5g=",
        "dev": true
      },
      "getpass": {
        "version": "https://registry.npmjs.org/getpass/-/getpass-0.1.6.tgz",
        "integrity": "sha1-KD/9n8ElaECHUxHBtg6MQBhxEOY=",
        "dev": true,
        "dependencies": {
          "assert-plus": {
            "version": "https://registry.npmjs.org/assert-plus/-/assert-plus-1.0.0.tgz",
            "integrity": "sha1-8S4PPF13sLHN2RRpQuTpbB5N1SU=",
            "dev": true
          }
        }
      },
      "glob": {
        "version": "7.1.2",
        "resolved": "https://registry.npmjs.org/glob/-/glob-7.1.2.tgz",
        "integrity": "sha512-MJTUg1kjuLeQCJ+ccE4Vpa6kKVXkPYJ2mOCQyUuKLcLQsdrMCpBPUi8qVE6+YuaJkozeA9NusTAw3hLr8Xe5EQ==",
        "dev": true
      },
      "globals": {
        "version": "https://registry.npmjs.org/globals/-/globals-9.14.0.tgz",
        "integrity": "sha1-iFmTavADh0EmMFOznQ52yiQeQDQ=",
        "dev": true
      },
      "globby": {
        "version": "https://registry.npmjs.org/globby/-/globby-5.0.0.tgz",
        "integrity": "sha1-69hGZ8oNuzMLmbz8aOrCvFQ3Dg0=",
        "dev": true,
        "dependencies": {
          "glob": {
            "version": "https://registry.npmjs.org/glob/-/glob-7.1.1.tgz",
            "integrity": "sha1-gFIR3wT6rxxjo2ADBs31reULLsg=",
            "dev": true
          },
          "minimatch": {
            "version": "https://registry.npmjs.org/minimatch/-/minimatch-3.0.3.tgz",
            "integrity": "sha1-Kk5AkLlrLbBqnX3wEFWmKnfJt3Q=",
            "dev": true
          }
        }
      },
      "graceful-fs": {
        "version": "https://registry.npmjs.org/graceful-fs/-/graceful-fs-4.1.11.tgz",
        "integrity": "sha1-Dovf5NHduIVNZOBOp8AOKgJuVlg=",
        "dev": true
      },
      "graceful-readlink": {
        "version": "https://registry.npmjs.org/graceful-readlink/-/graceful-readlink-1.0.1.tgz",
        "integrity": "sha1-TK+tdrxi8C+gObL5Tpo906ORpyU=",
        "dev": true
      },
      "har-validator": {
        "version": "https://registry.npmjs.org/har-validator/-/har-validator-2.0.6.tgz",
        "integrity": "sha1-zcvAgYgmWtEZtqWnyKtw7s+10n0=",
        "dev": true,
        "dependencies": {
          "commander": {
            "version": "https://registry.npmjs.org/commander/-/commander-2.9.0.tgz",
            "integrity": "sha1-nJkJQXbhIkDLItbFFGCYQA/g99Q=",
            "dev": true
          },
          "is-my-json-valid": {
            "version": "https://registry.npmjs.org/is-my-json-valid/-/is-my-json-valid-2.15.0.tgz",
            "integrity": "sha1-k27do8o8IR/ZjzstPgjaQ/eykVs=",
            "dev": true
          },
          "jsonpointer": {
            "version": "https://registry.npmjs.org/jsonpointer/-/jsonpointer-4.0.1.tgz",
            "integrity": "sha1-T9kss04OnbPInIYi7PUfm5eMbLk=",
            "dev": true
          },
          "pinkie": {
            "version": "https://registry.npmjs.org/pinkie/-/pinkie-2.0.4.tgz",
            "integrity": "sha1-clVrgM+g1IqXToDnckjoDtT3+HA=",
            "dev": true
          },
          "pinkie-promise": {
            "version": "https://registry.npmjs.org/pinkie-promise/-/pinkie-promise-2.0.1.tgz",
            "integrity": "sha1-ITXW36ejWMBprJsXh3YogihFD/o=",
            "dev": true
          }
        }
      },
      "has-ansi": {
        "version": "https://registry.npmjs.org/has-ansi/-/has-ansi-2.0.0.tgz",
        "integrity": "sha1-NPUEnOHs3ysGSa8+8k5F7TVBbZE=",
        "dev": true
      },
      "hawk": {
        "version": "https://registry.npmjs.org/hawk/-/hawk-3.1.3.tgz",
        "integrity": "sha1-B4REvXwWQLD+VA0sm3PVlnjo4cQ=",
        "dev": true
      },
      "hoek": {
        "version": "https://registry.npmjs.org/hoek/-/hoek-2.16.3.tgz",
        "integrity": "sha1-ILt0A9POo5jpHcRxCo/xuCdKJe0=",
        "dev": true
      },
      "home-or-tmp": {
        "version": "https://registry.npmjs.org/home-or-tmp/-/home-or-tmp-2.0.0.tgz",
        "integrity": "sha1-42w/LSyufXRqhX440Y1fMqeILbg=",
        "dev": true
      },
      "http-signature": {
        "version": "https://registry.npmjs.org/http-signature/-/http-signature-1.1.1.tgz",
        "integrity": "sha1-33LiZwZs0Kxn+3at+OE0qPvPkb8=",
        "dev": true
      },
      "ignore": {
        "version": "https://registry.npmjs.org/ignore/-/ignore-3.2.2.tgz",
        "integrity": "sha1-HFHh71O6tt3BXbTZrE7BOezrNBA=",
        "dev": true
      },
      "imurmurhash": {
        "version": "https://registry.npmjs.org/imurmurhash/-/imurmurhash-0.1.4.tgz",
        "integrity": "sha1-khi5srkoojixPcT7a21XbyMUU+o=",
        "dev": true
      },
      "inflight": {
        "version": "https://registry.npmjs.org/inflight/-/inflight-1.0.4.tgz",
        "integrity": "sha1-bLtFIevVHODsCpNr/XZX736bFyo=",
        "dev": true
      },
      "inherits": {
        "version": "https://registry.npmjs.org/inherits/-/inherits-2.0.1.tgz",
        "integrity": "sha1-sX0I0ya0Qj5Wjv9xn5GwscvfafE=",
        "dev": true
      },
      "inquirer": {
        "version": "https://registry.npmjs.org/inquirer/-/inquirer-0.12.0.tgz",
        "integrity": "sha1-HvK/1jUE3wvHV4X/+MLEHfEvB34=",
        "dev": true,
        "dependencies": {
          "lodash": {
            "version": "https://registry.npmjs.org/lodash/-/lodash-4.17.4.tgz",
            "integrity": "sha1-eCA6TRwyiuHYbcpkYONptX9AVa4=",
            "dev": true
          }
        }
      },
      "interpret": {
        "version": "https://registry.npmjs.org/interpret/-/interpret-1.0.1.tgz",
        "integrity": "sha1-1Xn7f2k7hYAElHrzn6DbSfeVYCw=",
        "dev": true
      },
      "is-fullwidth-code-point": {
        "version": "https://registry.npmjs.org/is-fullwidth-code-point/-/is-fullwidth-code-point-1.0.0.tgz",
        "integrity": "sha1-754xOG8DGn8NZDr4L95QxFfvAMs=",
        "dev": true
      },
      "is-my-json-valid": {
        "version": "https://registry.npmjs.org/is-my-json-valid/-/is-my-json-valid-2.15.0.tgz",
        "integrity": "sha1-k27do8o8IR/ZjzstPgjaQ/eykVs=",
        "dev": true
      },
      "is-path-cwd": {
        "version": "https://registry.npmjs.org/is-path-cwd/-/is-path-cwd-1.0.0.tgz",
        "integrity": "sha1-0iXsIxMuie3Tj9p2dHLmLmXxEG0=",
        "dev": true
      },
      "is-path-in-cwd": {
        "version": "https://registry.npmjs.org/is-path-in-cwd/-/is-path-in-cwd-1.0.0.tgz",
        "integrity": "sha1-ZHdYK4IU1gI0YJRWcAO+ip6sBNw=",
        "dev": true
      },
      "is-path-inside": {
        "version": "https://registry.npmjs.org/is-path-inside/-/is-path-inside-1.0.0.tgz",
        "integrity": "sha1-/AbloWg/vaE95mev9xe7wQpI838=",
        "dev": true
      },
      "is-property": {
        "version": "https://registry.npmjs.org/is-property/-/is-property-1.0.2.tgz",
        "integrity": "sha1-V/4cTkhHTt1lsJkR8msc1Ald2oQ=",
        "dev": true
      },
      "is-resolvable": {
        "version": "https://registry.npmjs.org/is-resolvable/-/is-resolvable-1.0.0.tgz",
        "integrity": "sha1-jfV8YeouPFAUCNEA+wE8+NbgzGI=",
        "dev": true
      },
      "is-typedarray": {
        "version": "https://registry.npmjs.org/is-typedarray/-/is-typedarray-1.0.0.tgz",
        "integrity": "sha1-5HnICFjfDBsR3dppQPlgEfzaSpo=",
        "dev": true
      },
      "isarray": {
        "version": "https://registry.npmjs.org/isarray/-/isarray-0.0.1.tgz",
        "integrity": "sha1-ihis/Kmo9Bd+Cav8YDiTmwXR7t8=",
        "dev": true
      },
      "isexe": {
        "version": "1.1.2",
        "resolved": "https://registry.npmjs.org/isexe/-/isexe-1.1.2.tgz",
        "integrity": "sha1-NvPiLmB1CSD15yQaR2qMakInWtA=",
        "dev": true
      },
      "isstream": {
        "version": "https://registry.npmjs.org/isstream/-/isstream-0.1.2.tgz",
        "integrity": "sha1-R+Y/evVa+m+S4VAOaQ64uFKcCZo=",
        "dev": true
      },
      "jodid25519": {
        "version": "https://registry.npmjs.org/jodid25519/-/jodid25519-1.0.2.tgz",
        "integrity": "sha1-BtSRIlUJNBlHfUJWM2BuDpB4KWc=",
        "dev": true,
        "optional": true
      },
      "js-tokens": {
        "version": "https://registry.npmjs.org/js-tokens/-/js-tokens-3.0.1.tgz",
        "integrity": "sha1-COnxMkhKLEWjCQfp3E1VZ7fxFNc=",
        "dev": true
      },
      "js-yaml": {
        "version": "https://registry.npmjs.org/js-yaml/-/js-yaml-3.4.2.tgz",
        "integrity": "sha1-EJQjg+5LnCwg7eI4jBsPOHiisM4=",
        "dev": true,
        "dependencies": {
          "argparse": {
            "version": "https://registry.npmjs.org/argparse/-/argparse-1.0.2.tgz",
            "integrity": "sha1-vPrjkFllbRlz0LnmoadBVLWpoTY=",
            "dev": true
          },
          "esprima": {
            "version": "https://registry.npmjs.org/esprima/-/esprima-2.2.0.tgz",
            "integrity": "sha1-QpLB1o5Bc9gV+iKQ3Hr8ltgfzYM=",
            "dev": true
          }
        }
      },
      "jsbn": {
        "version": "https://registry.npmjs.org/jsbn/-/jsbn-0.1.0.tgz",
        "integrity": "sha1-ZQmH2g3XT06/WhE3eiqi0nPpff0=",
        "dev": true,
        "optional": true
      },
      "json-schema": {
        "version": "https://registry.npmjs.org/json-schema/-/json-schema-0.2.3.tgz",
        "integrity": "sha1-tIDIkuWaLwWVTOcnvT8qTogvnhM=",
        "dev": true
      },
      "json-stable-stringify": {
        "version": "https://registry.npmjs.org/json-stable-stringify/-/json-stable-stringify-1.0.1.tgz",
        "integrity": "sha1-mnWdOcXy/1A/1TAGRu1EX4jE+a8=",
        "dev": true
      },
      "json-stringify-safe": {
        "version": "https://registry.npmjs.org/json-stringify-safe/-/json-stringify-safe-5.0.1.tgz",
        "integrity": "sha1-Epai1Y/UXxmg9s4B1lcB4sc1tus=",
        "dev": true
      },
      "jsonify": {
        "version": "https://registry.npmjs.org/jsonify/-/jsonify-0.0.0.tgz",
        "integrity": "sha1-LHS27kHZPKUbe1qu6PUDYx0lKnM=",
        "dev": true
      },
      "jsonpointer": {
        "version": "https://registry.npmjs.org/jsonpointer/-/jsonpointer-4.0.1.tgz",
        "integrity": "sha1-T9kss04OnbPInIYi7PUfm5eMbLk=",
        "dev": true
      },
      "jsprim": {
        "version": "https://registry.npmjs.org/jsprim/-/jsprim-1.3.1.tgz",
        "integrity": "sha1-KnJW9wQSop7jZwqspiWZTE3P8lI=",
        "dev": true
      },
      "jsx-ast-utils": {
        "version": "https://registry.npmjs.org/jsx-ast-utils/-/jsx-ast-utils-1.4.0.tgz",
        "integrity": "sha1-Wv44ho9WvIzHrq7wEAuox1vRJZE=",
        "dev": true
      },
      "lcov-parse": {
        "version": "https://registry.npmjs.org/lcov-parse/-/lcov-parse-0.0.10.tgz",
        "integrity": "sha1-GwuP+ayceIklBYK3C3ExXZ2m2aM=",
        "dev": true
      },
      "lodash": {
        "version": "https://registry.npmjs.org/lodash/-/lodash-3.10.1.tgz",
        "integrity": "sha1-W/Rejkm6QYnhfUgnid/RW9FAt7Y=",
        "dev": true
      },
      "log-driver": {
        "version": "https://registry.npmjs.org/log-driver/-/log-driver-1.2.5.tgz",
        "integrity": "sha1-euTsJXMC/XkNVXyxDJcQDYV7AFY=",
        "dev": true
      },
      "mime-db": {
        "version": "https://registry.npmjs.org/mime-db/-/mime-db-1.26.0.tgz",
        "integrity": "sha1-6v/NDk/Gk1z4E02iRuLmw1MFrf8=",
        "dev": true
      },
      "mime-types": {
        "version": "https://registry.npmjs.org/mime-types/-/mime-types-2.1.14.tgz",
        "integrity": "sha1-9+99l1g/yvO30oK2+LVnnaselO4=",
        "dev": true
      },
      "minimatch": {
        "version": "3.0.4",
        "resolved": "https://registry.npmjs.org/minimatch/-/minimatch-3.0.4.tgz",
        "integrity": "sha512-yJHVQEhyqPLUTgt9B83PXu6W3rx4MvvHvSUvToogpwoGDOUQ+yDrR0HRot+yOCdCO7u4hX3pWft6kWBBcqh0UA==",
        "dev": true,
        "dependencies": {
          "balanced-match": {
            "version": "1.0.0",
            "resolved": "https://registry.npmjs.org/balanced-match/-/balanced-match-1.0.0.tgz",
            "integrity": "sha1-ibTRmasr7kneFk6gK4nORi1xt2c=",
            "dev": true
          },
          "brace-expansion": {
            "version": "1.1.8",
            "resolved": "https://registry.npmjs.org/brace-expansion/-/brace-expansion-1.1.8.tgz",
            "integrity": "sha1-wHshHHyVLsH479Uad+8NHTmQopI=",
            "dev": true
          }
        }
      },
      "minimist": {
        "version": "https://registry.npmjs.org/minimist/-/minimist-0.0.8.tgz",
        "integrity": "sha1-hX/Kv8M5fSYluCKCYuhqp6ARsF0=",
        "dev": true
      },
      "mkdirp": {
        "version": "https://registry.npmjs.org/mkdirp/-/mkdirp-0.5.1.tgz",
        "integrity": "sha1-MAV0OOrGz3+MR2fzhkjWaX11yQM=",
        "dev": true
      },
      "ms": {
        "version": "https://registry.npmjs.org/ms/-/ms-0.7.1.tgz",
        "integrity": "sha1-nNE8A62/8ltl7/3nzoZO6VIBcJg=",
        "dev": true
      },
      "mute-stream": {
        "version": "https://registry.npmjs.org/mute-stream/-/mute-stream-0.0.5.tgz",
        "integrity": "sha1-j7+rsKmKJT0xhDMfno3rc3L6xsA=",
        "dev": true
      },
      "natural-compare": {
        "version": "https://registry.npmjs.org/natural-compare/-/natural-compare-1.4.0.tgz",
        "integrity": "sha1-Sr6/7tdUHywnrPspvbvRXI1bpPc=",
        "dev": true
      },
      "number-is-nan": {
        "version": "https://registry.npmjs.org/number-is-nan/-/number-is-nan-1.0.0.tgz",
        "integrity": "sha1-wCD1KcUoKt/dIz2R1LGBw9aG3Es=",
        "dev": true
      },
      "oauth-sign": {
        "version": "https://registry.npmjs.org/oauth-sign/-/oauth-sign-0.8.2.tgz",
        "integrity": "sha1-Rqarfwrq2N6unsBWV4C31O/rnUM=",
        "dev": true
      },
      "object-assign": {
        "version": "https://registry.npmjs.org/object-assign/-/object-assign-4.1.1.tgz",
        "integrity": "sha1-IQmtx5ZYh8/AXLvUQsrIv7s2CGM=",
        "dev": true
      },
      "once": {
        "version": "https://registry.npmjs.org/once/-/once-1.3.2.tgz",
        "integrity": "sha1-2P7sqTsDnsHc3ud0HJK9rF4oCBs=",
        "dev": true
      },
      "onetime": {
        "version": "https://registry.npmjs.org/onetime/-/onetime-1.1.0.tgz",
        "integrity": "sha1-ofeDj4MUxRbwXs78vEzP4EtO14k=",
        "dev": true
      },
      "opener": {
        "version": "https://registry.npmjs.org/opener/-/opener-1.4.2.tgz",
        "integrity": "sha1-syWCCABCr4aAw4mkmRdbTFT/9SM=",
        "dev": true
      },
      "os-homedir": {
        "version": "https://registry.npmjs.org/os-homedir/-/os-homedir-1.0.1.tgz",
        "integrity": "sha1-DWK99EuRb9O73PLKsZGUj7CU8Ac=",
        "dev": true
      },
      "os-tmpdir": {
        "version": "https://registry.npmjs.org/os-tmpdir/-/os-tmpdir-1.0.2.tgz",
        "integrity": "sha1-u+Z0BseaqFxc/sdm/lc0VV36EnQ=",
        "dev": true
      },
      "own-or": {
        "version": "https://registry.npmjs.org/own-or/-/own-or-1.0.0.tgz",
        "integrity": "sha1-Tod/vtqaLsgAD7wLyuOWRe6L+Nw=",
        "dev": true
      },
      "own-or-env": {
        "version": "https://registry.npmjs.org/own-or-env/-/own-or-env-1.0.0.tgz",
        "integrity": "sha1-nvkg/IHi5jz1nUEQElg2jPT8pPs=",
        "dev": true
      },
      "path-is-absolute": {
        "version": "https://registry.npmjs.org/path-is-absolute/-/path-is-absolute-1.0.0.tgz",
        "integrity": "sha1-Jj2tpmqz8vsQv3+dJN2PPlcO+RI=",
        "dev": true
      },
      "path-is-inside": {
        "version": "https://registry.npmjs.org/path-is-inside/-/path-is-inside-1.0.2.tgz",
        "integrity": "sha1-NlQX3t5EQw0cEa9hAn+s8HS9/FM=",
        "dev": true
      },
      "pify": {
        "version": "https://registry.npmjs.org/pify/-/pify-2.3.0.tgz",
        "integrity": "sha1-7RQaasBDqEnqWISY59yosVMw6Qw=",
        "dev": true
      },
      "pinkie": {
        "version": "https://registry.npmjs.org/pinkie/-/pinkie-2.0.4.tgz",
        "integrity": "sha1-clVrgM+g1IqXToDnckjoDtT3+HA=",
        "dev": true
      },
      "pinkie-promise": {
        "version": "https://registry.npmjs.org/pinkie-promise/-/pinkie-promise-2.0.1.tgz",
        "integrity": "sha1-ITXW36ejWMBprJsXh3YogihFD/o=",
        "dev": true
      },
      "pkg-config": {
        "version": "https://registry.npmjs.org/pkg-config/-/pkg-config-1.1.1.tgz",
        "integrity": "sha1-VX7yLXPaPIg3EHdmxS6tq94pj+Q=",
        "dev": true,
        "dependencies": {
          "xtend": {
            "version": "https://registry.npmjs.org/xtend/-/xtend-4.0.1.tgz",
            "integrity": "sha1-pcbVMr5lbiPbgg77lDofBJmNY68=",
            "dev": true
          }
        }
      },
      "pluralize": {
        "version": "https://registry.npmjs.org/pluralize/-/pluralize-1.2.1.tgz",
        "integrity": "sha1-0aIUg/0iu0HlihL6NCGCMUCJfEU=",
        "dev": true
      },
      "prelude-ls": {
        "version": "https://registry.npmjs.org/prelude-ls/-/prelude-ls-1.1.2.tgz",
        "integrity": "sha1-IZMqVJ9eUv/ZqCf1cOBL5iqX2lQ=",
        "dev": true
      },
      "process-nextick-args": {
        "version": "https://registry.npmjs.org/process-nextick-args/-/process-nextick-args-1.0.3.tgz",
        "integrity": "sha1-4nLu2CXV6fTqdNjXOx/jEcO+tjA=",
        "dev": true
      },
      "progress": {
        "version": "https://registry.npmjs.org/progress/-/progress-1.1.8.tgz",
        "integrity": "sha1-4mDHj2Fhzdmw5WzD4Khd4Xx6V74=",
        "dev": true
      },
      "pseudomap": {
        "version": "https://registry.npmjs.org/pseudomap/-/pseudomap-1.0.2.tgz",
        "integrity": "sha1-8FKijacOYYkX7wqKw0wa5aaChrM=",
        "dev": true
      },
      "punycode": {
        "version": "https://registry.npmjs.org/punycode/-/punycode-1.4.1.tgz",
        "integrity": "sha1-wNWmOycYgArY4esPpSachN1BhF4=",
        "dev": true
      },
      "qs": {
        "version": "https://registry.npmjs.org/qs/-/qs-6.3.0.tgz",
        "integrity": "sha1-9AOyZPI7wBIox0ExtAfxjV6l1EI=",
        "dev": true
      },
      "readable-stream": {
        "version": "https://registry.npmjs.org/readable-stream/-/readable-stream-2.0.2.tgz",
        "integrity": "sha1-vsgb6ujPRVFovC5bKzH1vPrtmxs=",
        "dev": true
      },
      "readline2": {
        "version": "https://registry.npmjs.org/readline2/-/readline2-1.0.1.tgz",
        "integrity": "sha1-QQWWCP/BVHV7cV2ZidGZ/783LjU=",
        "dev": true
      },
      "rechoir": {
        "version": "https://registry.npmjs.org/rechoir/-/rechoir-0.6.2.tgz",
        "integrity": "sha1-hSBLVNuoLVdC4oyWdW70OvUOM4Q=",
        "dev": true
      },
      "request": {
        "version": "https://registry.npmjs.org/request/-/request-2.79.0.tgz",
        "integrity": "sha1-Tf5b9r6LjNw3/Pk+BLZVd3InEN4=",
        "dev": true,
        "dependencies": {
          "extend": {
            "version": "https://registry.npmjs.org/extend/-/extend-3.0.0.tgz",
            "integrity": "sha1-WkdDU7nzNT3dgXbf03uRyDpG8dQ=",
            "dev": true
          }
        }
      },
      "require-uncached": {
        "version": "https://registry.npmjs.org/require-uncached/-/require-uncached-1.0.3.tgz",
        "integrity": "sha1-Tg1W1slmL9MeQwEcS5WqSZVUIdM=",
        "dev": true
      },
      "resolve": {
        "version": "https://registry.npmjs.org/resolve/-/resolve-1.1.6.tgz",
        "integrity": "sha1-00kq0FTKgA9b76YS5hvqwe7Jj48=",
        "dev": true
      },
      "resolve-from": {
        "version": "https://registry.npmjs.org/resolve-from/-/resolve-from-1.0.1.tgz",
        "integrity": "sha1-Jsv+k10a7uq7Kbw/5a6wHpPUQiY=",
        "dev": true
      },
      "restore-cursor": {
        "version": "https://registry.npmjs.org/restore-cursor/-/restore-cursor-1.0.1.tgz",
        "integrity": "sha1-NGYfRohjJ/7SmRR5FSJS35LapUE=",
        "dev": true
      },
      "rimraf": {
        "version": "https://registry.npmjs.org/rimraf/-/rimraf-2.4.3.tgz",
        "integrity": "sha1-5bUclDekxYKtuVXp8oz42UXicq8=",
        "dev": true,
        "dependencies": {
          "glob": {
            "version": "5.0.15",
            "resolved": "https://registry.npmjs.org/glob/-/glob-5.0.15.tgz",
            "integrity": "sha1-G8k2ueAvSmA/zCIuz3Yz0wuLk7E=",
            "dev": true
          }
        }
      },
      "run-async": {
        "version": "https://registry.npmjs.org/run-async/-/run-async-0.1.0.tgz",
        "integrity": "sha1-yK1KXhEGYeQCp9IbUw4AnyX444k=",
        "dev": true
      },
      "run-parallel": {
        "version": "https://registry.npmjs.org/run-parallel/-/run-parallel-1.1.6.tgz",
        "integrity": "sha1-KQA8miFj4B4tLfyQV18sbB1hoDk=",
        "dev": true
      },
      "rx-lite": {
        "version": "https://registry.npmjs.org/rx-lite/-/rx-lite-3.1.2.tgz",
        "integrity": "sha1-Gc5QLKVyZl87ZHsQk5+X/RYV8QI=",
        "dev": true
      },
      "safe-buffer": {
        "version": "5.1.1",
        "resolved": "https://registry.npmjs.org/safe-buffer/-/safe-buffer-5.1.1.tgz",
        "integrity": "sha512-kKvNJn6Mm93gAczWVJg7wH+wGYWNrDHdWvpUmHyEsgCtIwwo3bqPtV4tR5tuPaUhTOo/kvhVwd8XwwOllGYkbg==",
        "dev": true,
        "optional": true
      },
      "shelljs": {
        "version": "https://registry.npmjs.org/shelljs/-/shelljs-0.7.6.tgz",
        "integrity": "sha1-N5zM+1a5HIYB5HkzVutTgpJN6a0=",
        "dev": true,
        "dependencies": {
          "glob": {
            "version": "https://registry.npmjs.org/glob/-/glob-7.1.1.tgz",
            "integrity": "sha1-gFIR3wT6rxxjo2ADBs31reULLsg=",
            "dev": true
          },
          "minimatch": {
            "version": "https://registry.npmjs.org/minimatch/-/minimatch-3.0.3.tgz",
            "integrity": "sha1-Kk5AkLlrLbBqnX3wEFWmKnfJt3Q=",
            "dev": true
          }
        }
      },
      "slice-ansi": {
        "version": "https://registry.npmjs.org/slice-ansi/-/slice-ansi-0.0.4.tgz",
        "integrity": "sha1-7b+JA/ZvfOL46v1s7tZeJkyDGzU=",
        "dev": true
      },
      "sntp": {
        "version": "https://registry.npmjs.org/sntp/-/sntp-1.0.9.tgz",
        "integrity": "sha1-ZUEYTMkK7qbG57NeJlkIJEPGYZg=",
        "dev": true
      },
      "source-map-support": {
        "version": "0.4.15",
        "resolved": "https://registry.npmjs.org/source-map-support/-/source-map-support-0.4.15.tgz",
        "integrity": "sha1-AyAt9lwG0r2MfsI2KhkwVv7407E=",
        "dev": true,
        "dependencies": {
          "source-map": {
            "version": "0.5.6",
            "resolved": "https://registry.npmjs.org/source-map/-/source-map-0.5.6.tgz",
            "integrity": "sha1-dc449SvwczxafwwRjYEzSiu19BI=",
            "dev": true
          }
        }
      },
      "sprintf-js": {
        "version": "https://registry.npmjs.org/sprintf-js/-/sprintf-js-1.0.3.tgz",
        "integrity": "sha1-BOaSb2YolTVPPdAVIDYzuFcpfiw=",
        "dev": true
      },
      "sshpk": {
        "version": "https://registry.npmjs.org/sshpk/-/sshpk-1.10.2.tgz",
        "integrity": "sha1-1agEziJpVRVjjnmNviMnPeBwpfo=",
        "dev": true,
        "dependencies": {
          "assert-plus": {
            "version": "https://registry.npmjs.org/assert-plus/-/assert-plus-1.0.0.tgz",
            "integrity": "sha1-8S4PPF13sLHN2RRpQuTpbB5N1SU=",
            "dev": true
          }
        }
      },
      "stack-utils": {
        "version": "https://registry.npmjs.org/stack-utils/-/stack-utils-1.0.0.tgz",
        "integrity": "sha1-I5LNjdvSIkku1sBHlg90FLRsD4M=",
        "dev": true
      },
      "standard": {
        "version": "https://registry.npmjs.org/standard/-/standard-8.6.0.tgz",
        "integrity": "sha1-Y1Eyvnv7VnwpIQBfMPnjUOR1Kq0=",
        "dev": true
      },
      "standard-engine": {
        "version": "https://registry.npmjs.org/standard-engine/-/standard-engine-5.2.0.tgz",
        "integrity": "sha1-QAZgrlrM6K/U22D/IhSpGQrXkKM=",
        "dev": true,
        "dependencies": {
          "minimist": {
            "version": "https://registry.npmjs.org/minimist/-/minimist-1.2.0.tgz",
            "integrity": "sha1-o1AIsg9BOD7sH7kU9M1d95omQoQ=",
            "dev": true
          }
        }
      },
      "string_decoder": {
        "version": "https://registry.npmjs.org/string_decoder/-/string_decoder-0.10.31.tgz",
        "integrity": "sha1-YuIDvEF2bGwoyfyEMB2rHFMQ+pQ=",
        "dev": true
      },
      "string-width": {
        "version": "https://registry.npmjs.org/string-width/-/string-width-1.0.1.tgz",
        "integrity": "sha1-ySEptvHX9SrPmvQkom44ZKBc6wo=",
        "dev": true
      },
      "stringstream": {
        "version": "https://registry.npmjs.org/stringstream/-/stringstream-0.0.5.tgz",
        "integrity": "sha1-TkhM1N5aC7vuGORjB3EKioFiGHg=",
        "dev": true
      },
      "strip-ansi": {
        "version": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-3.0.0.tgz",
        "integrity": "sha1-dRC2ZVZ8qRTMtdfgcnY6yWi+NyQ=",
        "dev": true
      },
      "strip-json-comments": {
        "version": "https://registry.npmjs.org/strip-json-comments/-/strip-json-comments-1.0.4.tgz",
        "integrity": "sha1-HhX7ysl9Pumb8tc7TGVrCCu6+5E=",
        "dev": true
      },
      "supports-color": {
        "version": "https://registry.npmjs.org/supports-color/-/supports-color-2.0.0.tgz",
        "integrity": "sha1-U10EXOa2Nj+kARcIRimZXp3zJMc=",
        "dev": true
      },
      "table": {
        "version": "https://registry.npmjs.org/table/-/table-3.8.3.tgz",
        "integrity": "sha1-K7xULw/amGGnVdOUf+/Ys/UThV8=",
        "dev": true,
        "dependencies": {
          "is-fullwidth-code-point": {
            "version": "https://registry.npmjs.org/is-fullwidth-code-point/-/is-fullwidth-code-point-2.0.0.tgz",
            "integrity": "sha1-o7MKXE8ZkYMWeqq5O+764937ZU8=",
            "dev": true
          },
          "lodash": {
            "version": "https://registry.npmjs.org/lodash/-/lodash-4.17.4.tgz",
            "integrity": "sha1-eCA6TRwyiuHYbcpkYONptX9AVa4=",
            "dev": true
          },
          "string-width": {
            "version": "https://registry.npmjs.org/string-width/-/string-width-2.0.0.tgz",
            "integrity": "sha1-Y1xUNsxypuDDh87KJ41OLuxSaH4=",
            "dev": true
          }
        }
      },
      "tap": {
        "version": "10.5.1",
        "resolved": "https://registry.npmjs.org/tap/-/tap-10.5.1.tgz",
        "integrity": "sha512-1wfxVaE8y6JhVvZRJCn2HzC3ShiF5T17/kZynd2+tkszAWaOJ7ADzWcBKmxtTkXZ/6h4rZgt5qgw2OgQ02ehsw==",
        "dev": true,
        "dependencies": {
          "inherits": {
            "version": "2.0.3",
            "resolved": "https://registry.npmjs.org/inherits/-/inherits-2.0.3.tgz",
            "integrity": "sha1-Yzwsg+PaQqUC9SRmAiSA9CCCYd4=",
            "dev": true,
            "optional": true
          },
          "isarray": {
            "version": "1.0.0",
            "resolved": "https://registry.npmjs.org/isarray/-/isarray-1.0.0.tgz",
            "integrity": "sha1-u5NdSFgsuhaMBoNJV6VKPgcSTxE=",
            "dev": true,
            "optional": true
          },
          "nyc": {
            "version": "11.0.2",
            "resolved": "https://registry.npmjs.org/nyc/-/nyc-11.0.2.tgz",
            "integrity": "sha512-31rRd6ME9NM17w0oPKqi51a6fzJAqYarnzQXK+iL8XaX+3H6VH0BQut7qHIgrv2mBASRic4oNi2KRgcbFODrsQ==",
            "dev": true,
            "dependencies": {
              "align-text": {
                "version": "0.1.4",
                "bundled": true,
                "dev": true
              },
              "amdefine": {
                "version": "1.0.1",
                "bundled": true,
                "dev": true
              },
              "ansi-regex": {
                "version": "2.1.1",
                "bundled": true,
                "dev": true
              },
              "ansi-styles": {
                "version": "2.2.1",
                "bundled": true,
                "dev": true
              },
              "append-transform": {
                "version": "0.4.0",
                "bundled": true,
                "dev": true
              },
              "archy": {
                "version": "1.0.0",
                "bundled": true,
                "dev": true
              },
              "arr-diff": {
                "version": "2.0.0",
                "bundled": true,
                "dev": true
              },
              "arr-flatten": {
                "version": "1.0.3",
                "bundled": true,
                "dev": true
              },
              "array-unique": {
                "version": "0.2.1",
                "bundled": true,
                "dev": true
              },
              "arrify": {
                "version": "1.0.1",
                "bundled": true,
                "dev": true
              },
              "async": {
                "version": "1.5.2",
                "bundled": true,
                "dev": true
              },
              "babel-code-frame": {
                "version": "6.22.0",
                "bundled": true,
                "dev": true
              },
              "babel-generator": {
                "version": "6.24.1",
                "bundled": true,
                "dev": true
              },
              "babel-messages": {
                "version": "6.23.0",
                "bundled": true,
                "dev": true
              },
              "babel-runtime": {
                "version": "6.23.0",
                "bundled": true,
                "dev": true
              },
              "babel-template": {
                "version": "6.24.1",
                "bundled": true,
                "dev": true
              },
              "babel-traverse": {
                "version": "6.24.1",
                "bundled": true,
                "dev": true
              },
              "babel-types": {
                "version": "6.24.1",
                "bundled": true,
                "dev": true
              },
              "babylon": {
                "version": "6.17.2",
                "bundled": true,
                "dev": true
              },
              "balanced-match": {
                "version": "0.4.2",
                "bundled": true,
                "dev": true
              },
              "brace-expansion": {
                "version": "1.1.7",
                "bundled": true,
                "dev": true
              },
              "braces": {
                "version": "1.8.5",
                "bundled": true,
                "dev": true
              },
              "builtin-modules": {
                "version": "1.1.1",
                "bundled": true,
                "dev": true
              },
              "caching-transform": {
                "version": "1.0.1",
                "bundled": true,
                "dev": true
              },
              "center-align": {
                "version": "0.1.3",
                "bundled": true,
                "dev": true,
                "optional": true
              },
              "chalk": {
                "version": "1.1.3",
                "bundled": true,
                "dev": true
              },
              "cliui": {
                "version": "2.1.0",
                "bundled": true,
                "dev": true,
                "optional": true,
                "dependencies": {
                  "wordwrap": {
                    "version": "0.0.2",
                    "bundled": true,
                    "dev": true,
                    "optional": true
                  }
                }
              },
              "code-point-at": {
                "version": "1.1.0",
                "bundled": true,
                "dev": true
              },
              "commondir": {
                "version": "1.0.1",
                "bundled": true,
                "dev": true
              },
              "concat-map": {
                "version": "0.0.1",
                "bundled": true,
                "dev": true
              },
              "convert-source-map": {
                "version": "1.5.0",
                "bundled": true,
                "dev": true
              },
              "core-js": {
                "version": "2.4.1",
                "bundled": true,
                "dev": true
              },
              "cross-spawn": {
                "version": "4.0.2",
                "bundled": true,
                "dev": true
              },
              "debug": {
                "version": "2.6.8",
                "bundled": true,
                "dev": true
              },
              "debug-log": {
                "version": "1.0.1",
                "bundled": true,
                "dev": true
              },
              "decamelize": {
                "version": "1.2.0",
                "bundled": true,
                "dev": true
              },
              "default-require-extensions": {
                "version": "1.0.0",
                "bundled": true,
                "dev": true
              },
              "detect-indent": {
                "version": "4.0.0",
                "bundled": true,
                "dev": true
              },
              "error-ex": {
                "version": "1.3.1",
                "bundled": true,
                "dev": true
              },
              "escape-string-regexp": {
                "version": "1.0.5",
                "bundled": true,
                "dev": true
              },
              "esutils": {
                "version": "2.0.2",
                "bundled": true,
                "dev": true
              },
              "execa": {
                "version": "0.5.1",
                "bundled": true,
                "dev": true
              },
              "expand-brackets": {
                "version": "0.1.5",
                "bundled": true,
                "dev": true
              },
              "expand-range": {
                "version": "1.8.2",
                "bundled": true,
                "dev": true
              },
              "extglob": {
                "version": "0.3.2",
                "bundled": true,
                "dev": true
              },
              "filename-regex": {
                "version": "2.0.1",
                "bundled": true,
                "dev": true
              },
              "fill-range": {
                "version": "2.2.3",
                "bundled": true,
                "dev": true
              },
              "find-cache-dir": {
                "version": "0.1.1",
                "bundled": true,
                "dev": true
              },
              "find-up": {
                "version": "2.1.0",
                "bundled": true,
                "dev": true
              },
              "for-in": {
                "version": "1.0.2",
                "bundled": true,
                "dev": true
              },
              "for-own": {
                "version": "0.1.5",
                "bundled": true,
                "dev": true
              },
              "foreground-child": {
                "version": "1.5.6",
                "bundled": true,
                "dev": true
              },
              "fs.realpath": {
                "version": "1.0.0",
                "bundled": true,
                "dev": true
              },
              "get-caller-file": {
                "version": "1.0.2",
                "bundled": true,
                "dev": true
              },
              "get-stream": {
                "version": "2.3.1",
                "bundled": true,
                "dev": true
              },
              "glob": {
                "version": "7.1.2",
                "bundled": true,
                "dev": true
              },
              "glob-base": {
                "version": "0.3.0",
                "bundled": true,
                "dev": true
              },
              "glob-parent": {
                "version": "2.0.0",
                "bundled": true,
                "dev": true
              },
              "globals": {
                "version": "9.17.0",
                "bundled": true,
                "dev": true
              },
              "graceful-fs": {
                "version": "4.1.11",
                "bundled": true,
                "dev": true
              },
              "handlebars": {
                "version": "4.0.10",
                "bundled": true,
                "dev": true,
                "dependencies": {
                  "source-map": {
                    "version": "0.4.4",
                    "bundled": true,
                    "dev": true
                  }
                }
              },
              "has-ansi": {
                "version": "2.0.0",
                "bundled": true,
                "dev": true
              },
              "has-flag": {
                "version": "1.0.0",
                "bundled": true,
                "dev": true
              },
              "hosted-git-info": {
                "version": "2.4.2",
                "bundled": true,
                "dev": true
              },
              "imurmurhash": {
                "version": "0.1.4",
                "bundled": true,
                "dev": true
              },
              "inflight": {
                "version": "1.0.6",
                "bundled": true,
                "dev": true
              },
              "inherits": {
                "version": "2.0.3",
                "bundled": true,
                "dev": true
              },
              "invariant": {
                "version": "2.2.2",
                "bundled": true,
                "dev": true
              },
              "invert-kv": {
                "version": "1.0.0",
                "bundled": true,
                "dev": true
              },
              "is-arrayish": {
                "version": "0.2.1",
                "bundled": true,
                "dev": true
              },
              "is-buffer": {
                "version": "1.1.5",
                "bundled": true,
                "dev": true
              },
              "is-builtin-module": {
                "version": "1.0.0",
                "bundled": true,
                "dev": true
              },
              "is-dotfile": {
                "version": "1.0.3",
                "bundled": true,
                "dev": true
              },
              "is-equal-shallow": {
                "version": "0.1.3",
                "bundled": true,
                "dev": true
              },
              "is-extendable": {
                "version": "0.1.1",
                "bundled": true,
                "dev": true
              },
              "is-extglob": {
                "version": "1.0.0",
                "bundled": true,
                "dev": true
              },
              "is-finite": {
                "version": "1.0.2",
                "bundled": true,
                "dev": true
              },
              "is-fullwidth-code-point": {
                "version": "1.0.0",
                "bundled": true,
                "dev": true
              },
              "is-glob": {
                "version": "2.0.1",
                "bundled": true,
                "dev": true
              },
              "is-number": {
                "version": "2.1.0",
                "bundled": true,
                "dev": true
              },
              "is-posix-bracket": {
                "version": "0.1.1",
                "bundled": true,
                "dev": true
              },
              "is-primitive": {
                "version": "2.0.0",
                "bundled": true,
                "dev": true
              },
              "is-stream": {
                "version": "1.1.0",
                "bundled": true,
                "dev": true
              },
              "is-utf8": {
                "version": "0.2.1",
                "bundled": true,
                "dev": true
              },
              "isarray": {
                "version": "1.0.0",
                "bundled": true,
                "dev": true
              },
              "isexe": {
                "version": "2.0.0",
                "bundled": true,
                "dev": true
              },
              "isobject": {
                "version": "2.1.0",
                "bundled": true,
                "dev": true
              },
              "istanbul-lib-coverage": {
                "version": "1.1.1",
                "bundled": true,
                "dev": true
              },
              "istanbul-lib-hook": {
                "version": "1.0.7",
                "bundled": true,
                "dev": true
              },
              "istanbul-lib-instrument": {
                "version": "1.7.2",
                "bundled": true,
                "dev": true
              },
              "istanbul-lib-report": {
                "version": "1.1.1",
                "bundled": true,
                "dev": true,
                "dependencies": {
                  "supports-color": {
                    "version": "3.2.3",
                    "bundled": true,
                    "dev": true
                  }
                }
              },
              "istanbul-lib-source-maps": {
                "version": "1.2.1",
                "bundled": true,
                "dev": true
              },
              "istanbul-reports": {
                "version": "1.1.1",
                "bundled": true,
                "dev": true
              },
              "js-tokens": {
                "version": "3.0.1",
                "bundled": true,
                "dev": true
              },
              "jsesc": {
                "version": "1.3.0",
                "bundled": true,
                "dev": true
              },
              "kind-of": {
                "version": "3.2.2",
                "bundled": true,
                "dev": true
              },
              "lazy-cache": {
                "version": "1.0.4",
                "bundled": true,
                "dev": true,
                "optional": true
              },
              "lcid": {
                "version": "1.0.0",
                "bundled": true,
                "dev": true
              },
              "load-json-file": {
                "version": "1.1.0",
                "bundled": true,
                "dev": true
              },
              "locate-path": {
                "version": "2.0.0",
                "bundled": true,
                "dev": true,
                "dependencies": {
                  "path-exists": {
                    "version": "3.0.0",
                    "bundled": true,
                    "dev": true
                  }
                }
              },
              "lodash": {
                "version": "4.17.4",
                "bundled": true,
                "dev": true
              },
              "longest": {
                "version": "1.0.1",
                "bundled": true,
                "dev": true
              },
              "loose-envify": {
                "version": "1.3.1",
                "bundled": true,
                "dev": true
              },
              "lru-cache": {
                "version": "4.0.2",
                "bundled": true,
                "dev": true
              },
              "md5-hex": {
                "version": "1.3.0",
                "bundled": true,
                "dev": true
              },
              "md5-o-matic": {
                "version": "0.1.1",
                "bundled": true,
                "dev": true
              },
              "mem": {
                "version": "1.1.0",
                "bundled": true,
                "dev": true
              },
              "merge-source-map": {
                "version": "1.0.3",
                "bundled": true,
                "dev": true
              },
              "micromatch": {
                "version": "2.3.11",
                "bundled": true,
                "dev": true
              },
              "mimic-fn": {
                "version": "1.1.0",
                "bundled": true,
                "dev": true
              },
              "minimatch": {
                "version": "3.0.4",
                "bundled": true,
                "dev": true
              },
              "minimist": {
                "version": "0.0.8",
                "bundled": true,
                "dev": true
              },
              "mkdirp": {
                "version": "0.5.1",
                "bundled": true,
                "dev": true
              },
              "ms": {
                "version": "2.0.0",
                "bundled": true,
                "dev": true
              },
              "normalize-package-data": {
                "version": "2.3.8",
                "bundled": true,
                "dev": true
              },
              "normalize-path": {
                "version": "2.1.1",
                "bundled": true,
                "dev": true
              },
              "npm-run-path": {
                "version": "2.0.2",
                "bundled": true,
                "dev": true
              },
              "number-is-nan": {
                "version": "1.0.1",
                "bundled": true,
                "dev": true
              },
              "object-assign": {
                "version": "4.1.1",
                "bundled": true,
                "dev": true
              },
              "object.omit": {
                "version": "2.0.1",
                "bundled": true,
                "dev": true
              },
              "once": {
                "version": "1.4.0",
                "bundled": true,
                "dev": true
              },
              "optimist": {
                "version": "0.6.1",
                "bundled": true,
                "dev": true
              },
              "os-homedir": {
                "version": "1.0.2",
                "bundled": true,
                "dev": true
              },
              "os-locale": {
                "version": "2.0.0",
                "bundled": true,
                "dev": true
              },
              "p-finally": {
                "version": "1.0.0",
                "bundled": true,
                "dev": true
              },
              "p-limit": {
                "version": "1.1.0",
                "bundled": true,
                "dev": true
              },
              "p-locate": {
                "version": "2.0.0",
                "bundled": true,
                "dev": true
              },
              "parse-glob": {
                "version": "3.0.4",
                "bundled": true,
                "dev": true
              },
              "parse-json": {
                "version": "2.2.0",
                "bundled": true,
                "dev": true
              },
              "path-exists": {
                "version": "2.1.0",
                "bundled": true,
                "dev": true
              },
              "path-is-absolute": {
                "version": "1.0.1",
                "bundled": true,
                "dev": true
              },
              "path-key": {
                "version": "2.0.1",
                "bundled": true,
                "dev": true
              },
              "path-parse": {
                "version": "1.0.5",
                "bundled": true,
                "dev": true
              },
              "path-type": {
                "version": "1.1.0",
                "bundled": true,
                "dev": true
              },
              "pify": {
                "version": "2.3.0",
                "bundled": true,
                "dev": true
              },
              "pinkie": {
                "version": "2.0.4",
                "bundled": true,
                "dev": true
              },
              "pinkie-promise": {
                "version": "2.0.1",
                "bundled": true,
                "dev": true
              },
              "pkg-dir": {
                "version": "1.0.0",
                "bundled": true,
                "dev": true,
                "dependencies": {
                  "find-up": {
                    "version": "1.1.2",
                    "bundled": true,
                    "dev": true
                  }
                }
              },
              "preserve": {
                "version": "0.2.0",
                "bundled": true,
                "dev": true
              },
              "pseudomap": {
                "version": "1.0.2",
                "bundled": true,
                "dev": true
              },
              "randomatic": {
                "version": "1.1.6",
                "bundled": true,
                "dev": true
              },
              "read-pkg": {
                "version": "1.1.0",
                "bundled": true,
                "dev": true
              },
              "read-pkg-up": {
                "version": "1.0.1",
                "bundled": true,
                "dev": true,
                "dependencies": {
                  "find-up": {
                    "version": "1.1.2",
                    "bundled": true,
                    "dev": true
                  }
                }
              },
              "regenerator-runtime": {
                "version": "0.10.5",
                "bundled": true,
                "dev": true
              },
              "regex-cache": {
                "version": "0.4.3",
                "bundled": true,
                "dev": true
              },
              "remove-trailing-separator": {
                "version": "1.0.1",
                "bundled": true,
                "dev": true
              },
              "repeat-element": {
                "version": "1.1.2",
                "bundled": true,
                "dev": true
              },
              "repeat-string": {
                "version": "1.6.1",
                "bundled": true,
                "dev": true
              },
              "repeating": {
                "version": "2.0.1",
                "bundled": true,
                "dev": true
              },
              "require-directory": {
                "version": "2.1.1",
                "bundled": true,
                "dev": true
              },
              "require-main-filename": {
                "version": "1.0.1",
                "bundled": true,
                "dev": true
              },
              "resolve-from": {
                "version": "2.0.0",
                "bundled": true,
                "dev": true
              },
              "right-align": {
                "version": "0.1.3",
                "bundled": true,
                "dev": true,
                "optional": true
              },
              "rimraf": {
                "version": "2.6.1",
                "bundled": true,
                "dev": true
              },
              "semver": {
                "version": "5.3.0",
                "bundled": true,
                "dev": true
              },
              "set-blocking": {
                "version": "2.0.0",
                "bundled": true,
                "dev": true
              },
              "signal-exit": {
                "version": "3.0.2",
                "bundled": true,
                "dev": true
              },
              "slide": {
                "version": "1.1.6",
                "bundled": true,
                "dev": true
              },
              "source-map": {
                "version": "0.5.6",
                "bundled": true,
                "dev": true
              },
              "spawn-wrap": {
                "version": "1.3.6",
                "bundled": true,
                "dev": true
              },
              "spdx-correct": {
                "version": "1.0.2",
                "bundled": true,
                "dev": true
              },
              "spdx-expression-parse": {
                "version": "1.0.4",
                "bundled": true,
                "dev": true
              },
              "spdx-license-ids": {
                "version": "1.2.2",
                "bundled": true,
                "dev": true
              },
              "string-width": {
                "version": "2.0.0",
                "bundled": true,
                "dev": true,
                "dependencies": {
                  "is-fullwidth-code-point": {
                    "version": "2.0.0",
                    "bundled": true,
                    "dev": true
                  }
                }
              },
              "strip-ansi": {
                "version": "3.0.1",
                "bundled": true,
                "dev": true
              },
              "strip-bom": {
                "version": "2.0.0",
                "bundled": true,
                "dev": true
              },
              "strip-eof": {
                "version": "1.0.0",
                "bundled": true,
                "dev": true
              },
              "supports-color": {
                "version": "2.0.0",
                "bundled": true,
                "dev": true
              },
              "test-exclude": {
                "version": "4.1.1",
                "bundled": true,
                "dev": true
              },
              "to-fast-properties": {
                "version": "1.0.3",
                "bundled": true,
                "dev": true
              },
              "trim-right": {
                "version": "1.0.1",
                "bundled": true,
                "dev": true
              },
              "uglify-js": {
                "version": "2.8.27",
                "bundled": true,
                "dev": true,
                "optional": true,
                "dependencies": {
                  "camelcase": {
                    "version": "1.2.1",
                    "bundled": true,
                    "dev": true,
                    "optional": true
                  },
                  "yargs": {
                    "version": "3.10.0",
                    "bundled": true,
                    "dev": true,
                    "optional": true
                  }
                }
              },
              "uglify-to-browserify": {
                "version": "1.0.2",
                "bundled": true,
                "dev": true,
                "optional": true
              },
              "validate-npm-package-license": {
                "version": "3.0.1",
                "bundled": true,
                "dev": true
              },
              "which": {
                "version": "1.2.14",
                "bundled": true,
                "dev": true
              },
              "which-module": {
                "version": "2.0.0",
                "bundled": true,
                "dev": true
              },
              "window-size": {
                "version": "0.1.0",
                "bundled": true,
                "dev": true,
                "optional": true
              },
              "wordwrap": {
                "version": "0.0.3",
                "bundled": true,
                "dev": true
              },
              "wrap-ansi": {
                "version": "2.1.0",
                "bundled": true,
                "dev": true,
                "dependencies": {
                  "string-width": {
                    "version": "1.0.2",
                    "bundled": true,
                    "dev": true
                  }
                }
              },
              "wrappy": {
                "version": "1.0.2",
                "bundled": true,
                "dev": true
              },
              "write-file-atomic": {
                "version": "1.3.4",
                "bundled": true,
                "dev": true
              },
              "y18n": {
                "version": "3.2.1",
                "bundled": true,
                "dev": true
              },
              "yallist": {
                "version": "2.1.2",
                "bundled": true,
                "dev": true
              },
              "yargs": {
                "version": "8.0.1",
                "bundled": true,
                "dev": true,
                "dependencies": {
                  "camelcase": {
                    "version": "4.1.0",
                    "bundled": true,
                    "dev": true
                  },
                  "cliui": {
                    "version": "3.2.0",
                    "bundled": true,
                    "dev": true,
                    "dependencies": {
                      "string-width": {
                        "version": "1.0.2",
                        "bundled": true,
                        "dev": true
                      }
                    }
                  },
                  "load-json-file": {
                    "version": "2.0.0",
                    "bundled": true,
                    "dev": true
                  },
                  "path-type": {
                    "version": "2.0.0",
                    "bundled": true,
                    "dev": true
                  },
                  "read-pkg": {
                    "version": "2.0.0",
                    "bundled": true,
                    "dev": true
                  },
                  "read-pkg-up": {
                    "version": "2.0.0",
                    "bundled": true,
                    "dev": true
                  },
                  "strip-bom": {
                    "version": "3.0.0",
                    "bundled": true,
                    "dev": true
                  },
                  "yargs-parser": {
                    "version": "7.0.0",
                    "bundled": true,
                    "dev": true
                  }
                }
              },
              "yargs-parser": {
                "version": "5.0.0",
                "bundled": true,
                "dev": true,
                "dependencies": {
                  "camelcase": {
                    "version": "3.0.0",
                    "bundled": true,
                    "dev": true
                  }
                }
              }
            }
          },
          "process-nextick-args": {
            "version": "1.0.7",
            "resolved": "https://registry.npmjs.org/process-nextick-args/-/process-nextick-args-1.0.7.tgz",
            "integrity": "sha1-FQ4gt1ZZCtP5EJPyWk8q2L/zC6M=",
            "dev": true,
            "optional": true
          },
          "signal-exit": {
            "version": "3.0.2",
            "resolved": "https://registry.npmjs.org/signal-exit/-/signal-exit-3.0.2.tgz",
            "integrity": "sha1-tf3AjxKH6hF4Yo5BXiUTK3NkbG0=",
            "dev": true
          },
          "string_decoder": {
            "version": "1.0.2",
            "resolved": "https://registry.npmjs.org/string_decoder/-/string_decoder-1.0.2.tgz",
            "integrity": "sha1-sp4fThEl+pehA4K4pTNze3SR4Xk=",
            "dev": true,
            "optional": true,
            "dependencies": {
              "safe-buffer": {
                "version": "5.0.1",
                "resolved": "https://registry.npmjs.org/safe-buffer/-/safe-buffer-5.0.1.tgz",
                "integrity": "sha1-0mPKVGls2KMGtcplUekt5XkY++c=",
                "dev": true,
                "optional": true
              }
            }
          },
          "tap-mocha-reporter": {
            "version": "3.0.5",
            "resolved": "https://registry.npmjs.org/tap-mocha-reporter/-/tap-mocha-reporter-3.0.5.tgz",
            "integrity": "sha512-YIoWejBBb+6gKOdu5B4H4oIKQhmRJsYGHSE5a6Mv87jriBDy/fAVLRVuMHTAP/vufYPcI3CKAck9VvnZxtQ4mA==",
            "dev": true,
            "dependencies": {
              "readable-stream": {
                "version": "2.3.2",
                "resolved": "https://registry.npmjs.org/readable-stream/-/readable-stream-2.3.2.tgz",
                "integrity": "sha1-WgTfBeT1f+Pw3Gj90R3FyXx+b00=",
                "dev": true,
                "optional": true
              }
            }
          },
          "tmatch": {
            "version": "3.1.0",
            "resolved": "https://registry.npmjs.org/tmatch/-/tmatch-3.1.0.tgz",
            "integrity": "sha512-W3MSATOCN4pVu2qFxmJLIArSifeSOFqnfx9hiUaVgOmeRoI2NbU7RNga+6G+L8ojlFeQge+ZPCclWyUpQ8UeNQ==",
            "dev": true
          }
        }
      },
      "tap-parser": {
        "version": "https://registry.npmjs.org/tap-parser/-/tap-parser-5.3.2.tgz",
        "integrity": "sha1-JB4afGxmyaQEfJ4WxD2WrmHpvok=",
        "dev": true
      },
      "text-table": {
        "version": "https://registry.npmjs.org/text-table/-/text-table-0.2.0.tgz",
        "integrity": "sha1-f17oI66AUgfACvLfSoTsP8+lcLQ=",
        "dev": true
      },
      "through": {
        "version": "https://registry.npmjs.org/through/-/through-2.3.8.tgz",
        "integrity": "sha1-DdTJ/6q8NXlgsbckEV1+Doai4fU=",
        "dev": true
      },
      "tough-cookie": {
        "version": "https://registry.npmjs.org/tough-cookie/-/tough-cookie-2.3.2.tgz",
        "integrity": "sha1-8IH3bkyFcg5sN6X6ztc3FQ2EByo=",
        "dev": true
      },
      "trivial-deferred": {
        "version": "https://registry.npmjs.org/trivial-deferred/-/trivial-deferred-1.0.1.tgz",
        "integrity": "sha1-N21NKdlR1jaKb3oK6FwvTV4GWPM=",
        "dev": true
      },
      "tryit": {
        "version": "https://registry.npmjs.org/tryit/-/tryit-1.0.3.tgz",
        "integrity": "sha1-OTvnMKlEb9Hq1tpZoBQwjzbCics=",
        "dev": true
      },
      "tsame": {
        "version": "1.1.2",
        "resolved": "https://registry.npmjs.org/tsame/-/tsame-1.1.2.tgz",
        "integrity": "sha512-ovCs24PGjmByVPr9tSIOs/yjUX9sJl0grEmOsj9dZA/UknQkgPOKcUqM84aSCvt9awHuhc/boMzTg3BHFalxWw==",
        "dev": true
      },
      "tunnel-agent": {
        "version": "https://registry.npmjs.org/tunnel-agent/-/tunnel-agent-0.4.3.tgz",
        "integrity": "sha1-Y3PbdpCf5XDgjXNYM2Xtgop07us=",
        "dev": true
      },
      "tweetnacl": {
        "version": "https://registry.npmjs.org/tweetnacl/-/tweetnacl-0.14.5.tgz",
        "integrity": "sha1-WuaBd/GS1EViadEIr6k/+HQ/T2Q=",
        "dev": true,
        "optional": true
      },
      "typedarray": {
        "version": "https://registry.npmjs.org/typedarray/-/typedarray-0.0.6.tgz",
        "integrity": "sha1-hnrHTjhkGHsdPUfZlqeOxciDB3c=",
        "dev": true
      },
      "unicode-length": {
        "version": "https://registry.npmjs.org/unicode-length/-/unicode-length-1.0.3.tgz",
        "integrity": "sha1-Wtp6f+1RhBpBijKM8UlHisg1irs=",
        "dev": true,
        "dependencies": {
          "strip-ansi": {
            "version": "https://registry.npmjs.org/strip-ansi/-/strip-ansi-3.0.1.tgz",
            "integrity": "sha1-ajhfuIU9lS1f8F0Oiq+UJ43GPc8=",
            "dev": true
          }
        }
      },
      "uniq": {
        "version": "https://registry.npmjs.org/uniq/-/uniq-1.0.1.tgz",
        "integrity": "sha1-sxxa6CVIRKOoKBVBzisEuGWnNP8=",
        "dev": true
      },
      "user-home": {
        "version": "https://registry.npmjs.org/user-home/-/user-home-2.0.0.tgz",
        "integrity": "sha1-nHC/2Babwdy/SGBODwS4tJzenp8=",
        "dev": true
      },
      "util-deprecate": {
        "version": "https://registry.npmjs.org/util-deprecate/-/util-deprecate-1.0.1.tgz",
        "integrity": "sha1-NVaj0TxMaqeYPX4kJUeBlxmbeIE=",
        "dev": true
      },
      "uuid": {
        "version": "https://registry.npmjs.org/uuid/-/uuid-3.0.1.tgz",
        "integrity": "sha1-ZUS7ot/ajBzxfmKaOjBeK7H+5sE=",
        "dev": true
      },
      "verror": {
        "version": "https://registry.npmjs.org/verror/-/verror-1.3.6.tgz",
        "integrity": "sha1-z/XfEpRtKX0rqu+qJoniW+AcAFw=",
        "dev": true
      },
      "wordwrap": {
        "version": "https://registry.npmjs.org/wordwrap/-/wordwrap-1.0.0.tgz",
        "integrity": "sha1-J1hIEIkUVqQXHI0CJkQa3pDLyus=",
        "dev": true
      },
      "wrappy": {
        "version": "https://registry.npmjs.org/wrappy/-/wrappy-1.0.1.tgz",
        "integrity": "sha1-HmWWmWXMvC20VIxrhKbyxa7dRzk=",
        "dev": true
      },
      "write": {
        "version": "https://registry.npmjs.org/write/-/write-0.2.1.tgz",
        "integrity": "sha1-X8A4KOJkzqP+kUVUdvejxWbLB1c=",
        "dev": true
      },
      "xtend": {
        "version": "https://registry.npmjs.org/xtend/-/xtend-4.0.0.tgz",
        "integrity": "sha1-i8Nv+Hrtvnzp6vC8o2sjVKdDhA8=",
        "dev": true
      },
      "yallist": {
        "version": "https://registry.npmjs.org/yallist/-/yallist-2.0.0.tgz",
        "integrity": "sha1-MGxUODXwnuGkyyO3vOmrNByRzdQ=",
        "dev": true
      },
      "yapool": {
        "version": "https://registry.npmjs.org/yapool/-/yapool-1.0.0.tgz",
        "integrity": "sha1-9pPymjFbUNmp2iZGp6ZkXJaYW2o=",
        "dev": true
      }
    }
  }),
  "package.json": JSON.stringify({
    "name": "sax",
    "description": "An evented streaming XML parser in JavaScript",
    "author": "Isaac Z. Schlueter <i@izs.me> (http://blog.izs.me/)",
    "version": "1.2.4",
    "main": "lib/sax.js",
    "license": "ISC",
    "scripts": {
      "test": "tap test/*.js --cov -j4",
      "posttest": "standard -F test/*.js lib/*.js",
      "preversion": "npm test",
      "postversion": "npm publish",
      "postpublish": "git push origin --all; git push origin --tags"
    },
    "repository": "git://github.com/isaacs/sax-js.git",
    "files": [
      "lib/sax.js",
      "LICENSE",
      "README.md"
    ],
    "devDependencies": {
      "standard": "^8.6.0",
      "tap": "^10.5.1"
    }
  })
})
  return path
}
