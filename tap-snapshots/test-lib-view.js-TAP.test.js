/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/lib/view.js TAP should log info by field name array field - 1 element > must match snapshot 1`] = `

claudia
`

exports[`test/lib/view.js TAP should log info by field name array field - 2 elements > must match snapshot 1`] = `

maintainers[0].name = 'claudia'
maintainers[1].name = 'isaacs'
`

exports[`test/lib/view.js TAP should log info by field name maintainers with email > must match snapshot 1`] = `

{
  "maintainers": [
    {
      "name": "claudia",
      "email": "c@yellow.com",
      "twitter": "cyellow"
    },
    {
      "name": "isaacs",
      "email": "i@yellow.com",
      "twitter": "iyellow"
    }
  ],
  "name": "yellow"
}
`

exports[`test/lib/view.js TAP should log info by field name maintainers with url > must match snapshot 1`] = `

[
  "claudia (http://c.pink.com)",
  "isaacs (http://i.pink.com)"
]
`

exports[`test/lib/view.js TAP should log info by field name nested field with brackets > must match snapshot 1`] = `

"Jeremy Ashkenas"
`

exports[`test/lib/view.js TAP should log info by field name readme > must match snapshot 1`] = `

a very useful readme
`

exports[`test/lib/view.js TAP should log info by field name several fields > must match snapshot 1`] = `

{
  "name": "underscore",
  "version": "1.3.1"
}
`

exports[`test/lib/view.js TAP should log info by field name several fields with several versions > must match snapshot 1`] = `

underscore@1.0.3 'Jeremy Ashkenas <jeremy@documentcloud.org>'
underscore@1.0.4 'Jeremy Ashkenas <jeremy@documentcloud.org>'
underscore@1.1.0 'Jeremy Ashkenas <jeremy@documentcloud.org>'
underscore@1.1.1 'Jeremy Ashkenas <jeremy@documentcloud.org>'
underscore@1.1.2 'Jeremy Ashkenas <jeremy@documentcloud.org>'
underscore@1.1.3 'Jeremy Ashkenas <jeremy@documentcloud.org>'
underscore@1.1.4 'Jeremy Ashkenas <jeremy@documentcloud.org>'
underscore@1.1.5 'Jeremy Ashkenas <jeremy@documentcloud.org>'
underscore@1.1.6 'Jeremy Ashkenas <jeremy@documentcloud.org>'
underscore@1.1.7 'Jeremy Ashkenas <jeremy@documentcloud.org>'
underscore@1.2.0 'Jeremy Ashkenas <jeremy@documentcloud.org>'
underscore@1.2.1 'Jeremy Ashkenas <jeremy@documentcloud.org>'
underscore@1.2.2 'Jeremy Ashkenas <jeremy@documentcloud.org>'
underscore@1.2.3 'Jeremy Ashkenas <jeremy@documentcloud.org>'
underscore@1.2.4 'Jeremy Ashkenas <jeremy@documentcloud.org>'
underscore@1.3.0 'Jeremy Ashkenas <jeremy@documentcloud.org>'
underscore@1.3.1 'Jeremy Ashkenas <jeremy@documentcloud.org>'
underscore@1.3.2 'Jeremy Ashkenas <jeremy@documentcloud.org>'
underscore@1.3.3 'Jeremy Ashkenas <jeremy@documentcloud.org>'
underscore@1.4.0 'Jeremy Ashkenas <jeremy@documentcloud.org>'
underscore@1.4.1 'Jeremy Ashkenas <jeremy@documentcloud.org>'
underscore@1.4.2 'Jeremy Ashkenas <jeremy@documentcloud.org>'
underscore@1.4.3 'Jeremy Ashkenas <jeremy@documentcloud.org>'
underscore@1.4.4 'Jeremy Ashkenas <jeremy@documentcloud.org>'
underscore@1.5.0 'Jeremy Ashkenas <jeremy@documentcloud.org>'
underscore@1.5.1 'Jeremy Ashkenas <jeremy@documentcloud.org>'
`

exports[`test/lib/view.js TAP should log info of package in current working dir non-specific version > must match snapshot 1`] = `


[4m[1m[32munderscore[39m@[32m1.3.1[39m[22m[24m | [1m[31mProprietary[39m[22m | deps: [32mnone[39m | versions: [33m26[39m
JavaScript's functional programming helper library.
[36mhttp://documentcloud.github.com/underscore/[39m

dist
.tarball:[36mhttp://localhost:1331/underscore/-/underscore-1.3.1.tgz[39m
.shasum:[33m6cb8aad0e77eb5dbbfb54b22bcd8697309cf9641[39m

maintainers:
-[33mjashkenas[39m <[36mjashkenas@gmail.com[39m>

dist-tags:
[1m[32mlatest[39m[22m: 1.5.1
[1m[32mstable[39m[22m: 1.5.1

published [33mover a year ago[39m by [33mjashkenas[39m <[36mjashkenas@gmail.com[39m>
`

exports[`test/lib/view.js TAP should log info of package in current working dir specific version > must match snapshot 1`] = `


[4m[1m[32munderscore[39m@[32m1.3.1[39m[22m[24m | [1m[31mProprietary[39m[22m | deps: [32mnone[39m | versions: [33m26[39m
JavaScript's functional programming helper library.
[36mhttp://documentcloud.github.com/underscore/[39m

dist
.tarball:[36mhttp://localhost:1331/underscore/-/underscore-1.3.1.tgz[39m
.shasum:[33m6cb8aad0e77eb5dbbfb54b22bcd8697309cf9641[39m

maintainers:
-[33mjashkenas[39m <[36mjashkenas@gmail.com[39m>

dist-tags:
[1m[32mlatest[39m[22m: 1.5.1
[1m[32mstable[39m[22m: 1.5.1

published [33mover a year ago[39m by [33mjashkenas[39m <[36mjashkenas@gmail.com[39m>
`

exports[`test/lib/view.js TAP should log package info mkdirp@0.3.5 > must match snapshot 1`] = `


[4m[1m[32mmkdirp[39m@[32m0.3.5[39m[22m[24m | [32mMIT[39m | deps: [32mnone[39m | versions: [33m17[39m
Recursively mkdir, like \`mkdir -p\`

dist
.tarball:[36mhttp://localhost:1331/mkdirp/-/mkdirp-0.3.5.tgz[39m
.shasum:[33mde3e5f8961c88c787ee1368df849ac4413eca8d7[39m

maintainers:
-[33msubstack[39m <[36mmail@substack.net[39m>

dist-tags:
[1m[32mlatest[39m[22m: 0.3.5

published [33mover a year ago[39m by [33msubstack[39m <[36mmail@substack.net[39m>
`

exports[`test/lib/view.js TAP should log package info package with --json and semver range > must match snapshot 1`] = `

[
  {
    "_id": "underscore@1.3.1",
    "_rev": "131-e6bd048b180d8ca3830d5242e6bd93fa",
    "name": "underscore",
    "description": "JavaScript's functional programming helper library.",
    "dist-tags": {
      "latest": "1.5.1",
      "stable": "1.5.1"
    },
    "versions": [
      "1.0.3",
      "1.0.4",
      "1.1.0",
      "1.1.1",
      "1.1.2",
      "1.1.3",
      "1.1.4",
      "1.1.5",
      "1.1.6",
      "1.1.7",
      "1.2.0",
      "1.2.1",
      "1.2.2",
      "1.2.3",
      "1.2.4",
      "1.3.0",
      "1.3.1",
      "1.3.2",
      "1.3.3",
      "1.4.0",
      "1.4.1",
      "1.4.2",
      "1.4.3",
      "1.4.4",
      "1.5.0",
      "1.5.1"
    ],
    "maintainers": [
      "documentcloud <jeremy@documentcloud.org>",
      "jashkenas <jashkenas@gmail.com>"
    ],
    "author": "Jeremy Ashkenas <jeremy@documentcloud.org>",
    "time": {
      "1.0.3": "2011-12-07T15:12:18.045Z",
      "1.0.4": "2011-12-07T15:12:18.045Z",
      "1.1.0": "2011-12-07T15:12:18.045Z",
      "1.1.1": "2011-12-07T15:12:18.045Z",
      "1.1.2": "2011-12-07T15:12:18.045Z",
      "1.1.3": "2011-12-07T15:12:18.045Z",
      "1.1.4": "2011-12-07T15:12:18.045Z",
      "1.1.5": "2011-12-07T15:12:18.045Z",
      "1.1.6": "2011-12-07T15:12:18.045Z",
      "1.1.7": "2011-12-07T15:12:18.045Z",
      "1.2.0": "2011-12-07T15:12:18.045Z",
      "1.2.1": "2011-12-07T15:12:18.045Z",
      "1.2.2": "2011-11-14T20:28:47.115Z",
      "1.2.3": "2011-12-07T15:12:18.045Z",
      "1.2.4": "2012-01-09T17:23:14.818Z",
      "1.3.0": "2012-01-11T16:41:38.459Z",
      "1.3.1": "2012-01-23T22:57:36.474Z",
      "1.3.2": "2012-04-09T18:38:14.345Z",
      "1.3.3": "2012-04-10T14:43:48.089Z",
      "1.4.0": "2012-09-27T22:02:55.267Z",
      "1.4.1": "2012-10-01T17:20:22.595Z",
      "1.4.2": "2012-10-07T03:05:02.986Z",
      "1.4.3": "2012-12-04T18:47:36.401Z",
      "1.4.4": "2013-01-30T02:12:42.969Z",
      "1.5.0": "2013-07-06T18:05:58.721Z",
      "1.5.1": "2013-07-08T08:38:10.051Z"
    },
    "repository": {
      "type": "git",
      "url": "git://github.com/documentcloud/underscore.git"
    },
    "users": {
      "vesln": true,
      "mvolkmann": true,
      "lancehunt": true,
      "mikl": true,
      "linus": true,
      "vasc": true,
      "bat": true,
      "dmalam": true,
      "mbrevoort": true,
      "danielr": true,
      "rsimoes": true,
      "thlorenz": true,
      "jharding": true,
      "tellnes": true,
      "fgribreau": true,
      "pid": true,
      "tylerstalder": true,
      "graemef": true,
      "gillesruppert": true,
      "travishorn": true,
      "m42am": true,
      "af": true,
      "bencevans": true,
      "Scryptonite": true,
      "konklone": true,
      "esp": true,
      "bryanburgers": true,
      "ehershey": true,
      "freethenation": true,
      "dannydulai": true,
      "megadrive": true,
      "lupomontero": true,
      "cj.nichols": true,
      "dbrockman": true,
      "maxmaximov": true,
      "hyqhyq_3": true,
      "zonetti": true,
      "cparker15": true,
      "lemulot": true,
      "mlowe": true,
      "chilts": true,
      "shanewholloway": true,
      "elgs": true,
      "eins78": true,
      "moonpyk": true
    },
    "_attachments": {
      "underscore-1.5.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 129,
        "digest": "md5-jEzAnjdRfcazh9PKAMa1kw==",
        "length": 22746,
        "stub": true
      },
      "underscore-1.5.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 126,
        "digest": "md5-JiqbW+htmCdz6yVjqaz44Q==",
        "length": 22907,
        "stub": true
      },
      "underscore-1.4.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 104,
        "digest": "md5-s/MrjCiRarwh7tZ9DX+RyA==",
        "length": 41763,
        "stub": true
      },
      "underscore-1.4.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 97,
        "digest": "md5-SbGx702k/T8yuag+j/VjCg==",
        "length": 62294,
        "stub": true
      },
      "underscore-1.4.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 91,
        "digest": "md5-vSAO6RpJID3UCJkAWMEIjg==",
        "length": 61836,
        "stub": true
      },
      "underscore-1.4.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 88,
        "digest": "md5-O72hIvWp7cVwkiA/2eF6rg==",
        "length": 61692,
        "stub": true
      },
      "underscore-1.4.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 85,
        "digest": "md5-26PeH3uwZlxMzfzwS4LmMg==",
        "length": 61579,
        "stub": true
      },
      "underscore-1.3.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 69,
        "digest": "md5-lRWlaQvCPiUt9CVTCTbZqQ==",
        "length": 58692,
        "stub": true
      },
      "underscore-1.3.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 66,
        "digest": "md5-yS3kcu5U31CO0KAJcBJ9yA==",
        "length": 58699,
        "stub": true
      },
      "underscore-1.3.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 60,
        "digest": "md5-Y4Z1Vvv7gZoZtJ9mTz0zSQ==",
        "length": 61440,
        "stub": true
      },
      "underscore-1.3.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 56,
        "digest": "md5-eIPIVGdK7Fzup3CU/AMO4g==",
        "length": 61440,
        "stub": true
      },
      "underscore-1.2.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 54,
        "digest": "md5-jCUzsaWc+tlE/lQNsuLQBA==",
        "length": 61440,
        "stub": true
      },
      "underscore-1.2.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 41,
        "digest": "md5-bP9hXPsRRpFAWlmUNIY+jA==",
        "length": 40960,
        "stub": true
      },
      "underscore-1.2.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 38,
        "digest": "md5-78/kFlhnF2WL94pdo/dfww==",
        "length": 40960,
        "stub": true
      },
      "underscore-1.2.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 35,
        "digest": "md5-gNzWgJppZn3xUj8LCQcJ+Q==",
        "length": 31879,
        "stub": true
      },
      "underscore-1.2.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 33,
        "digest": "md5-WYSTx/McoA2yFB6GmQ5KnA==",
        "length": 31310,
        "stub": true
      },
      "underscore-1.1.7.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 29,
        "digest": "md5-BxaNPc3JexY2qLOK3gDhgw==",
        "length": 29052,
        "stub": true
      },
      "underscore-1.1.6.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 27,
        "digest": "md5-U11VsMTDu6BEZDKJlZidTw==",
        "length": 25592,
        "stub": true
      },
      "underscore-1.1.5.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 25,
        "digest": "md5-rpLusI4XejA3uVROFAZg1A==",
        "length": 25038,
        "stub": true
      },
      "underscore-1.1.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 23,
        "digest": "md5-VrXC+bUYmxwzr2CQH4oq0w==",
        "length": 86233,
        "stub": true
      },
      "underscore-1.1.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 17,
        "digest": "md5-sdTV7zbtYfhAAanQLEcziw==",
        "length": 86107,
        "stub": true
      },
      "underscore-1.1.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 11,
        "digest": "md5-SSm/3w/usRqR+0SrSyCr8A==",
        "length": 85482,
        "stub": true
      },
      "underscore-1.1.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 9,
        "digest": "md5-UW8pTfPbkrRFTiwM6AFlVA==",
        "length": 85214,
        "stub": true
      },
      "underscore-1.1.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 7,
        "digest": "md5-YJcA44Oj1Dm2imfD7dHLag==",
        "length": 71266,
        "stub": true
      },
      "underscore-1.0.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 5,
        "digest": "md5-nRJu+q0L17u8DZqPxVvQKQ==",
        "length": 71018,
        "stub": true
      },
      "underscore-1.0.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 3,
        "digest": "md5-pwgll4db7l4cg7fPTrgVTw==",
        "length": 70285,
        "stub": true
      }
    },
    "_cached": false,
    "_contentLength": 0,
    "homepage": "http://documentcloud.github.com/underscore/",
    "keywords": [
      "util",
      "functional",
      "server",
      "client",
      "browser"
    ],
    "main": "underscore.js",
    "version": "1.3.1",
    "_npmUser": "jashkenas <jashkenas@gmail.com>",
    "dependencies": {},
    "devDependencies": {},
    "engines": {
      "node": "*"
    },
    "_engineSupported": true,
    "_npmVersion": "1.0.104",
    "_nodeVersion": "v0.6.6",
    "_defaultsLoaded": true,
    "dist": {
      "shasum": "6cb8aad0e77eb5dbbfb54b22bcd8697309cf9641",
      "tarball": "http://localhost:1331/underscore/-/underscore-1.3.1.tgz"
    },
    "directories": {}
  },
  {
    "_id": "underscore@1.3.2",
    "_rev": "131-e6bd048b180d8ca3830d5242e6bd93fa",
    "name": "underscore",
    "description": "JavaScript's functional programming helper library.",
    "dist-tags": {
      "latest": "1.5.1",
      "stable": "1.5.1"
    },
    "versions": [
      "1.0.3",
      "1.0.4",
      "1.1.0",
      "1.1.1",
      "1.1.2",
      "1.1.3",
      "1.1.4",
      "1.1.5",
      "1.1.6",
      "1.1.7",
      "1.2.0",
      "1.2.1",
      "1.2.2",
      "1.2.3",
      "1.2.4",
      "1.3.0",
      "1.3.1",
      "1.3.2",
      "1.3.3",
      "1.4.0",
      "1.4.1",
      "1.4.2",
      "1.4.3",
      "1.4.4",
      "1.5.0",
      "1.5.1"
    ],
    "maintainers": [
      "documentcloud <jeremy@documentcloud.org>",
      "jashkenas <jashkenas@gmail.com>"
    ],
    "author": "Jeremy Ashkenas <jeremy@documentcloud.org>",
    "time": {
      "1.0.3": "2011-12-07T15:12:18.045Z",
      "1.0.4": "2011-12-07T15:12:18.045Z",
      "1.1.0": "2011-12-07T15:12:18.045Z",
      "1.1.1": "2011-12-07T15:12:18.045Z",
      "1.1.2": "2011-12-07T15:12:18.045Z",
      "1.1.3": "2011-12-07T15:12:18.045Z",
      "1.1.4": "2011-12-07T15:12:18.045Z",
      "1.1.5": "2011-12-07T15:12:18.045Z",
      "1.1.6": "2011-12-07T15:12:18.045Z",
      "1.1.7": "2011-12-07T15:12:18.045Z",
      "1.2.0": "2011-12-07T15:12:18.045Z",
      "1.2.1": "2011-12-07T15:12:18.045Z",
      "1.2.2": "2011-11-14T20:28:47.115Z",
      "1.2.3": "2011-12-07T15:12:18.045Z",
      "1.2.4": "2012-01-09T17:23:14.818Z",
      "1.3.0": "2012-01-11T16:41:38.459Z",
      "1.3.1": "2012-01-23T22:57:36.474Z",
      "1.3.2": "2012-04-09T18:38:14.345Z",
      "1.3.3": "2012-04-10T14:43:48.089Z",
      "1.4.0": "2012-09-27T22:02:55.267Z",
      "1.4.1": "2012-10-01T17:20:22.595Z",
      "1.4.2": "2012-10-07T03:05:02.986Z",
      "1.4.3": "2012-12-04T18:47:36.401Z",
      "1.4.4": "2013-01-30T02:12:42.969Z",
      "1.5.0": "2013-07-06T18:05:58.721Z",
      "1.5.1": "2013-07-08T08:38:10.051Z"
    },
    "repository": {
      "type": "git",
      "url": "git://github.com/documentcloud/underscore.git"
    },
    "users": {
      "vesln": true,
      "mvolkmann": true,
      "lancehunt": true,
      "mikl": true,
      "linus": true,
      "vasc": true,
      "bat": true,
      "dmalam": true,
      "mbrevoort": true,
      "danielr": true,
      "rsimoes": true,
      "thlorenz": true,
      "jharding": true,
      "tellnes": true,
      "fgribreau": true,
      "pid": true,
      "tylerstalder": true,
      "graemef": true,
      "gillesruppert": true,
      "travishorn": true,
      "m42am": true,
      "af": true,
      "bencevans": true,
      "Scryptonite": true,
      "konklone": true,
      "esp": true,
      "bryanburgers": true,
      "ehershey": true,
      "freethenation": true,
      "dannydulai": true,
      "megadrive": true,
      "lupomontero": true,
      "cj.nichols": true,
      "dbrockman": true,
      "maxmaximov": true,
      "hyqhyq_3": true,
      "zonetti": true,
      "cparker15": true,
      "lemulot": true,
      "mlowe": true,
      "chilts": true,
      "shanewholloway": true,
      "elgs": true,
      "eins78": true,
      "moonpyk": true
    },
    "_attachments": {
      "underscore-1.5.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 129,
        "digest": "md5-jEzAnjdRfcazh9PKAMa1kw==",
        "length": 22746,
        "stub": true
      },
      "underscore-1.5.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 126,
        "digest": "md5-JiqbW+htmCdz6yVjqaz44Q==",
        "length": 22907,
        "stub": true
      },
      "underscore-1.4.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 104,
        "digest": "md5-s/MrjCiRarwh7tZ9DX+RyA==",
        "length": 41763,
        "stub": true
      },
      "underscore-1.4.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 97,
        "digest": "md5-SbGx702k/T8yuag+j/VjCg==",
        "length": 62294,
        "stub": true
      },
      "underscore-1.4.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 91,
        "digest": "md5-vSAO6RpJID3UCJkAWMEIjg==",
        "length": 61836,
        "stub": true
      },
      "underscore-1.4.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 88,
        "digest": "md5-O72hIvWp7cVwkiA/2eF6rg==",
        "length": 61692,
        "stub": true
      },
      "underscore-1.4.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 85,
        "digest": "md5-26PeH3uwZlxMzfzwS4LmMg==",
        "length": 61579,
        "stub": true
      },
      "underscore-1.3.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 69,
        "digest": "md5-lRWlaQvCPiUt9CVTCTbZqQ==",
        "length": 58692,
        "stub": true
      },
      "underscore-1.3.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 66,
        "digest": "md5-yS3kcu5U31CO0KAJcBJ9yA==",
        "length": 58699,
        "stub": true
      },
      "underscore-1.3.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 60,
        "digest": "md5-Y4Z1Vvv7gZoZtJ9mTz0zSQ==",
        "length": 61440,
        "stub": true
      },
      "underscore-1.3.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 56,
        "digest": "md5-eIPIVGdK7Fzup3CU/AMO4g==",
        "length": 61440,
        "stub": true
      },
      "underscore-1.2.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 54,
        "digest": "md5-jCUzsaWc+tlE/lQNsuLQBA==",
        "length": 61440,
        "stub": true
      },
      "underscore-1.2.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 41,
        "digest": "md5-bP9hXPsRRpFAWlmUNIY+jA==",
        "length": 40960,
        "stub": true
      },
      "underscore-1.2.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 38,
        "digest": "md5-78/kFlhnF2WL94pdo/dfww==",
        "length": 40960,
        "stub": true
      },
      "underscore-1.2.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 35,
        "digest": "md5-gNzWgJppZn3xUj8LCQcJ+Q==",
        "length": 31879,
        "stub": true
      },
      "underscore-1.2.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 33,
        "digest": "md5-WYSTx/McoA2yFB6GmQ5KnA==",
        "length": 31310,
        "stub": true
      },
      "underscore-1.1.7.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 29,
        "digest": "md5-BxaNPc3JexY2qLOK3gDhgw==",
        "length": 29052,
        "stub": true
      },
      "underscore-1.1.6.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 27,
        "digest": "md5-U11VsMTDu6BEZDKJlZidTw==",
        "length": 25592,
        "stub": true
      },
      "underscore-1.1.5.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 25,
        "digest": "md5-rpLusI4XejA3uVROFAZg1A==",
        "length": 25038,
        "stub": true
      },
      "underscore-1.1.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 23,
        "digest": "md5-VrXC+bUYmxwzr2CQH4oq0w==",
        "length": 86233,
        "stub": true
      },
      "underscore-1.1.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 17,
        "digest": "md5-sdTV7zbtYfhAAanQLEcziw==",
        "length": 86107,
        "stub": true
      },
      "underscore-1.1.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 11,
        "digest": "md5-SSm/3w/usRqR+0SrSyCr8A==",
        "length": 85482,
        "stub": true
      },
      "underscore-1.1.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 9,
        "digest": "md5-UW8pTfPbkrRFTiwM6AFlVA==",
        "length": 85214,
        "stub": true
      },
      "underscore-1.1.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 7,
        "digest": "md5-YJcA44Oj1Dm2imfD7dHLag==",
        "length": 71266,
        "stub": true
      },
      "underscore-1.0.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 5,
        "digest": "md5-nRJu+q0L17u8DZqPxVvQKQ==",
        "length": 71018,
        "stub": true
      },
      "underscore-1.0.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 3,
        "digest": "md5-pwgll4db7l4cg7fPTrgVTw==",
        "length": 70285,
        "stub": true
      }
    },
    "_cached": false,
    "_contentLength": 0,
    "homepage": "http://documentcloud.github.com/underscore/",
    "keywords": [
      "util",
      "functional",
      "server",
      "client",
      "browser"
    ],
    "main": "underscore.js",
    "version": "1.3.2",
    "_npmUser": "jashkenas <jashkenas@gmail.com>",
    "dependencies": {},
    "devDependencies": {},
    "optionalDependencies": {},
    "engines": {
      "node": "*"
    },
    "_engineSupported": true,
    "_npmVersion": "1.1.1",
    "_nodeVersion": "v0.6.11",
    "_defaultsLoaded": true,
    "dist": {
      "shasum": "1b4e455089ab1d1d38ab6794ffe6cf08f764394a",
      "tarball": "http://localhost:1331/underscore/-/underscore-1.3.2.tgz"
    },
    "readme": "                       __                                                         \\n                      /\\\\ \\\\                                                         __           \\n     __  __    ___    \\\\_\\\\ \\\\     __   _ __   ____    ___    ___   _ __    __       /\\\\_\\\\    ____  \\n    /\\\\ \\\\/\\\\ \\\\ /' _ \`\\\\  /'_  \\\\  /'__\`\\\\/\\\\  __\\\\/ ,__\\\\  / ___\\\\ / __\`\\\\/\\\\  __\\\\/'__\`\\\\     \\\\/\\\\ \\\\  /',__\\\\ \\n    \\\\ \\\\ \\\\_\\\\ \\\\/\\\\ \\\\/\\\\ \\\\/\\\\ \\\\ \\\\ \\\\/\\\\  __/\\\\ \\\\ \\\\//\\\\__, \`\\\\/\\\\ \\\\__//\\\\ \\\\ \\\\ \\\\ \\\\ \\\\//\\\\  __/  __  \\\\ \\\\ \\\\/\\\\__, \`\\\\\\n     \\\\ \\\\____/\\\\ \\\\_\\\\ \\\\_\\\\ \\\\___,_\\\\ \\\\____\\\\\\\\ \\\\_\\\\\\\\/\\\\____/\\\\ \\\\____\\\\ \\\\____/\\\\ \\\\_\\\\\\\\ \\\\____\\\\/\\\\_\\\\ _\\\\ \\\\ \\\\/\\\\____/\\n      \\\\/___/  \\\\/_/\\\\/_/\\\\/__,_ /\\\\/____/ \\\\/_/ \\\\/___/  \\\\/____/\\\\/___/  \\\\/_/ \\\\/____/\\\\/_//\\\\ \\\\_\\\\ \\\\/___/ \\n                                                                                  \\\\ \\\\____/      \\n                                                                                   \\\\/___/\\n                                                                               \\nUnderscore.js is a utility-belt library for JavaScript that provides \\nsupport for the usual functional suspects (each, map, reduce, filter...) \\nwithout extending any core JavaScript objects.\\n\\nFor Docs, License, Tests, and pre-packed downloads, see:\\nhttp://documentcloud.github.com/underscore/\\n\\nMany thanks to our contributors:\\nhttps://github.com/documentcloud/underscore/contributors\\n",
    "directories": {}
  },
  {
    "_id": "underscore@1.3.3",
    "_rev": "131-e6bd048b180d8ca3830d5242e6bd93fa",
    "name": "underscore",
    "description": "JavaScript's functional programming helper library.",
    "dist-tags": {
      "latest": "1.5.1",
      "stable": "1.5.1"
    },
    "versions": [
      "1.0.3",
      "1.0.4",
      "1.1.0",
      "1.1.1",
      "1.1.2",
      "1.1.3",
      "1.1.4",
      "1.1.5",
      "1.1.6",
      "1.1.7",
      "1.2.0",
      "1.2.1",
      "1.2.2",
      "1.2.3",
      "1.2.4",
      "1.3.0",
      "1.3.1",
      "1.3.2",
      "1.3.3",
      "1.4.0",
      "1.4.1",
      "1.4.2",
      "1.4.3",
      "1.4.4",
      "1.5.0",
      "1.5.1"
    ],
    "maintainers": [
      "documentcloud <jeremy@documentcloud.org>",
      "jashkenas <jashkenas@gmail.com>"
    ],
    "author": "Jeremy Ashkenas <jeremy@documentcloud.org>",
    "time": {
      "1.0.3": "2011-12-07T15:12:18.045Z",
      "1.0.4": "2011-12-07T15:12:18.045Z",
      "1.1.0": "2011-12-07T15:12:18.045Z",
      "1.1.1": "2011-12-07T15:12:18.045Z",
      "1.1.2": "2011-12-07T15:12:18.045Z",
      "1.1.3": "2011-12-07T15:12:18.045Z",
      "1.1.4": "2011-12-07T15:12:18.045Z",
      "1.1.5": "2011-12-07T15:12:18.045Z",
      "1.1.6": "2011-12-07T15:12:18.045Z",
      "1.1.7": "2011-12-07T15:12:18.045Z",
      "1.2.0": "2011-12-07T15:12:18.045Z",
      "1.2.1": "2011-12-07T15:12:18.045Z",
      "1.2.2": "2011-11-14T20:28:47.115Z",
      "1.2.3": "2011-12-07T15:12:18.045Z",
      "1.2.4": "2012-01-09T17:23:14.818Z",
      "1.3.0": "2012-01-11T16:41:38.459Z",
      "1.3.1": "2012-01-23T22:57:36.474Z",
      "1.3.2": "2012-04-09T18:38:14.345Z",
      "1.3.3": "2012-04-10T14:43:48.089Z",
      "1.4.0": "2012-09-27T22:02:55.267Z",
      "1.4.1": "2012-10-01T17:20:22.595Z",
      "1.4.2": "2012-10-07T03:05:02.986Z",
      "1.4.3": "2012-12-04T18:47:36.401Z",
      "1.4.4": "2013-01-30T02:12:42.969Z",
      "1.5.0": "2013-07-06T18:05:58.721Z",
      "1.5.1": "2013-07-08T08:38:10.051Z"
    },
    "repository": {
      "type": "git",
      "url": "git://github.com/documentcloud/underscore.git"
    },
    "users": {
      "vesln": true,
      "mvolkmann": true,
      "lancehunt": true,
      "mikl": true,
      "linus": true,
      "vasc": true,
      "bat": true,
      "dmalam": true,
      "mbrevoort": true,
      "danielr": true,
      "rsimoes": true,
      "thlorenz": true,
      "jharding": true,
      "tellnes": true,
      "fgribreau": true,
      "pid": true,
      "tylerstalder": true,
      "graemef": true,
      "gillesruppert": true,
      "travishorn": true,
      "m42am": true,
      "af": true,
      "bencevans": true,
      "Scryptonite": true,
      "konklone": true,
      "esp": true,
      "bryanburgers": true,
      "ehershey": true,
      "freethenation": true,
      "dannydulai": true,
      "megadrive": true,
      "lupomontero": true,
      "cj.nichols": true,
      "dbrockman": true,
      "maxmaximov": true,
      "hyqhyq_3": true,
      "zonetti": true,
      "cparker15": true,
      "lemulot": true,
      "mlowe": true,
      "chilts": true,
      "shanewholloway": true,
      "elgs": true,
      "eins78": true,
      "moonpyk": true
    },
    "_attachments": {
      "underscore-1.5.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 129,
        "digest": "md5-jEzAnjdRfcazh9PKAMa1kw==",
        "length": 22746,
        "stub": true
      },
      "underscore-1.5.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 126,
        "digest": "md5-JiqbW+htmCdz6yVjqaz44Q==",
        "length": 22907,
        "stub": true
      },
      "underscore-1.4.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 104,
        "digest": "md5-s/MrjCiRarwh7tZ9DX+RyA==",
        "length": 41763,
        "stub": true
      },
      "underscore-1.4.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 97,
        "digest": "md5-SbGx702k/T8yuag+j/VjCg==",
        "length": 62294,
        "stub": true
      },
      "underscore-1.4.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 91,
        "digest": "md5-vSAO6RpJID3UCJkAWMEIjg==",
        "length": 61836,
        "stub": true
      },
      "underscore-1.4.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 88,
        "digest": "md5-O72hIvWp7cVwkiA/2eF6rg==",
        "length": 61692,
        "stub": true
      },
      "underscore-1.4.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 85,
        "digest": "md5-26PeH3uwZlxMzfzwS4LmMg==",
        "length": 61579,
        "stub": true
      },
      "underscore-1.3.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 69,
        "digest": "md5-lRWlaQvCPiUt9CVTCTbZqQ==",
        "length": 58692,
        "stub": true
      },
      "underscore-1.3.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 66,
        "digest": "md5-yS3kcu5U31CO0KAJcBJ9yA==",
        "length": 58699,
        "stub": true
      },
      "underscore-1.3.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 60,
        "digest": "md5-Y4Z1Vvv7gZoZtJ9mTz0zSQ==",
        "length": 61440,
        "stub": true
      },
      "underscore-1.3.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 56,
        "digest": "md5-eIPIVGdK7Fzup3CU/AMO4g==",
        "length": 61440,
        "stub": true
      },
      "underscore-1.2.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 54,
        "digest": "md5-jCUzsaWc+tlE/lQNsuLQBA==",
        "length": 61440,
        "stub": true
      },
      "underscore-1.2.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 41,
        "digest": "md5-bP9hXPsRRpFAWlmUNIY+jA==",
        "length": 40960,
        "stub": true
      },
      "underscore-1.2.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 38,
        "digest": "md5-78/kFlhnF2WL94pdo/dfww==",
        "length": 40960,
        "stub": true
      },
      "underscore-1.2.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 35,
        "digest": "md5-gNzWgJppZn3xUj8LCQcJ+Q==",
        "length": 31879,
        "stub": true
      },
      "underscore-1.2.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 33,
        "digest": "md5-WYSTx/McoA2yFB6GmQ5KnA==",
        "length": 31310,
        "stub": true
      },
      "underscore-1.1.7.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 29,
        "digest": "md5-BxaNPc3JexY2qLOK3gDhgw==",
        "length": 29052,
        "stub": true
      },
      "underscore-1.1.6.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 27,
        "digest": "md5-U11VsMTDu6BEZDKJlZidTw==",
        "length": 25592,
        "stub": true
      },
      "underscore-1.1.5.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 25,
        "digest": "md5-rpLusI4XejA3uVROFAZg1A==",
        "length": 25038,
        "stub": true
      },
      "underscore-1.1.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 23,
        "digest": "md5-VrXC+bUYmxwzr2CQH4oq0w==",
        "length": 86233,
        "stub": true
      },
      "underscore-1.1.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 17,
        "digest": "md5-sdTV7zbtYfhAAanQLEcziw==",
        "length": 86107,
        "stub": true
      },
      "underscore-1.1.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 11,
        "digest": "md5-SSm/3w/usRqR+0SrSyCr8A==",
        "length": 85482,
        "stub": true
      },
      "underscore-1.1.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 9,
        "digest": "md5-UW8pTfPbkrRFTiwM6AFlVA==",
        "length": 85214,
        "stub": true
      },
      "underscore-1.1.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 7,
        "digest": "md5-YJcA44Oj1Dm2imfD7dHLag==",
        "length": 71266,
        "stub": true
      },
      "underscore-1.0.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 5,
        "digest": "md5-nRJu+q0L17u8DZqPxVvQKQ==",
        "length": 71018,
        "stub": true
      },
      "underscore-1.0.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 3,
        "digest": "md5-pwgll4db7l4cg7fPTrgVTw==",
        "length": 70285,
        "stub": true
      }
    },
    "_cached": false,
    "_contentLength": 0,
    "homepage": "http://documentcloud.github.com/underscore/",
    "keywords": [
      "util",
      "functional",
      "server",
      "client",
      "browser"
    ],
    "main": "underscore.js",
    "version": "1.3.3",
    "_npmUser": "jashkenas <jashkenas@gmail.com>",
    "dependencies": {},
    "devDependencies": {},
    "optionalDependencies": {},
    "engines": {
      "node": "*"
    },
    "_engineSupported": true,
    "_npmVersion": "1.1.1",
    "_nodeVersion": "v0.6.11",
    "_defaultsLoaded": true,
    "dist": {
      "shasum": "47ac53683daf832bfa952e1774417da47817ae42",
      "tarball": "http://localhost:1331/underscore/-/underscore-1.3.3.tgz"
    },
    "readme": "                       __                                                         \\n                      /\\\\ \\\\                                                         __           \\n     __  __    ___    \\\\_\\\\ \\\\     __   _ __   ____    ___    ___   _ __    __       /\\\\_\\\\    ____  \\n    /\\\\ \\\\/\\\\ \\\\ /' _ \`\\\\  /'_  \\\\  /'__\`\\\\/\\\\  __\\\\/ ,__\\\\  / ___\\\\ / __\`\\\\/\\\\  __\\\\/'__\`\\\\     \\\\/\\\\ \\\\  /',__\\\\ \\n    \\\\ \\\\ \\\\_\\\\ \\\\/\\\\ \\\\/\\\\ \\\\/\\\\ \\\\ \\\\ \\\\/\\\\  __/\\\\ \\\\ \\\\//\\\\__, \`\\\\/\\\\ \\\\__//\\\\ \\\\ \\\\ \\\\ \\\\ \\\\//\\\\  __/  __  \\\\ \\\\ \\\\/\\\\__, \`\\\\\\n     \\\\ \\\\____/\\\\ \\\\_\\\\ \\\\_\\\\ \\\\___,_\\\\ \\\\____\\\\\\\\ \\\\_\\\\\\\\/\\\\____/\\\\ \\\\____\\\\ \\\\____/\\\\ \\\\_\\\\\\\\ \\\\____\\\\/\\\\_\\\\ _\\\\ \\\\ \\\\/\\\\____/\\n      \\\\/___/  \\\\/_/\\\\/_/\\\\/__,_ /\\\\/____/ \\\\/_/ \\\\/___/  \\\\/____/\\\\/___/  \\\\/_/ \\\\/____/\\\\/_//\\\\ \\\\_\\\\ \\\\/___/ \\n                                                                                  \\\\ \\\\____/      \\n                                                                                   \\\\/___/\\n                                                                               \\nUnderscore.js is a utility-belt library for JavaScript that provides \\nsupport for the usual functional suspects (each, map, reduce, filter...) \\nwithout extending any core JavaScript objects.\\n\\nFor Docs, License, Tests, and pre-packed downloads, see:\\nhttp://documentcloud.github.com/underscore/\\n\\nMany thanks to our contributors:\\nhttps://github.com/documentcloud/underscore/contributors\\n",
    "directories": {}
  },
  {
    "_id": "underscore@1.4.0",
    "_rev": "131-e6bd048b180d8ca3830d5242e6bd93fa",
    "name": "underscore",
    "description": "JavaScript's functional programming helper library.",
    "dist-tags": {
      "latest": "1.5.1",
      "stable": "1.5.1"
    },
    "versions": [
      "1.0.3",
      "1.0.4",
      "1.1.0",
      "1.1.1",
      "1.1.2",
      "1.1.3",
      "1.1.4",
      "1.1.5",
      "1.1.6",
      "1.1.7",
      "1.2.0",
      "1.2.1",
      "1.2.2",
      "1.2.3",
      "1.2.4",
      "1.3.0",
      "1.3.1",
      "1.3.2",
      "1.3.3",
      "1.4.0",
      "1.4.1",
      "1.4.2",
      "1.4.3",
      "1.4.4",
      "1.5.0",
      "1.5.1"
    ],
    "maintainers": [
      "jashkenas <jashkenas@gmail.com>"
    ],
    "author": "Jeremy Ashkenas <jeremy@documentcloud.org>",
    "time": {
      "1.0.3": "2011-12-07T15:12:18.045Z",
      "1.0.4": "2011-12-07T15:12:18.045Z",
      "1.1.0": "2011-12-07T15:12:18.045Z",
      "1.1.1": "2011-12-07T15:12:18.045Z",
      "1.1.2": "2011-12-07T15:12:18.045Z",
      "1.1.3": "2011-12-07T15:12:18.045Z",
      "1.1.4": "2011-12-07T15:12:18.045Z",
      "1.1.5": "2011-12-07T15:12:18.045Z",
      "1.1.6": "2011-12-07T15:12:18.045Z",
      "1.1.7": "2011-12-07T15:12:18.045Z",
      "1.2.0": "2011-12-07T15:12:18.045Z",
      "1.2.1": "2011-12-07T15:12:18.045Z",
      "1.2.2": "2011-11-14T20:28:47.115Z",
      "1.2.3": "2011-12-07T15:12:18.045Z",
      "1.2.4": "2012-01-09T17:23:14.818Z",
      "1.3.0": "2012-01-11T16:41:38.459Z",
      "1.3.1": "2012-01-23T22:57:36.474Z",
      "1.3.2": "2012-04-09T18:38:14.345Z",
      "1.3.3": "2012-04-10T14:43:48.089Z",
      "1.4.0": "2012-09-27T22:02:55.267Z",
      "1.4.1": "2012-10-01T17:20:22.595Z",
      "1.4.2": "2012-10-07T03:05:02.986Z",
      "1.4.3": "2012-12-04T18:47:36.401Z",
      "1.4.4": "2013-01-30T02:12:42.969Z",
      "1.5.0": "2013-07-06T18:05:58.721Z",
      "1.5.1": "2013-07-08T08:38:10.051Z"
    },
    "repository": {
      "type": "git",
      "url": "git://github.com/documentcloud/underscore.git"
    },
    "users": {
      "vesln": true,
      "mvolkmann": true,
      "lancehunt": true,
      "mikl": true,
      "linus": true,
      "vasc": true,
      "bat": true,
      "dmalam": true,
      "mbrevoort": true,
      "danielr": true,
      "rsimoes": true,
      "thlorenz": true,
      "jharding": true,
      "tellnes": true,
      "fgribreau": true,
      "pid": true,
      "tylerstalder": true,
      "graemef": true,
      "gillesruppert": true,
      "travishorn": true,
      "m42am": true,
      "af": true,
      "bencevans": true,
      "Scryptonite": true,
      "konklone": true,
      "esp": true,
      "bryanburgers": true,
      "ehershey": true,
      "freethenation": true,
      "dannydulai": true,
      "megadrive": true,
      "lupomontero": true,
      "cj.nichols": true,
      "dbrockman": true,
      "maxmaximov": true,
      "hyqhyq_3": true,
      "zonetti": true,
      "cparker15": true,
      "lemulot": true,
      "mlowe": true,
      "chilts": true,
      "shanewholloway": true,
      "elgs": true,
      "eins78": true,
      "moonpyk": true
    },
    "_attachments": {
      "underscore-1.5.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 129,
        "digest": "md5-jEzAnjdRfcazh9PKAMa1kw==",
        "length": 22746,
        "stub": true
      },
      "underscore-1.5.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 126,
        "digest": "md5-JiqbW+htmCdz6yVjqaz44Q==",
        "length": 22907,
        "stub": true
      },
      "underscore-1.4.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 104,
        "digest": "md5-s/MrjCiRarwh7tZ9DX+RyA==",
        "length": 41763,
        "stub": true
      },
      "underscore-1.4.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 97,
        "digest": "md5-SbGx702k/T8yuag+j/VjCg==",
        "length": 62294,
        "stub": true
      },
      "underscore-1.4.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 91,
        "digest": "md5-vSAO6RpJID3UCJkAWMEIjg==",
        "length": 61836,
        "stub": true
      },
      "underscore-1.4.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 88,
        "digest": "md5-O72hIvWp7cVwkiA/2eF6rg==",
        "length": 61692,
        "stub": true
      },
      "underscore-1.4.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 85,
        "digest": "md5-26PeH3uwZlxMzfzwS4LmMg==",
        "length": 61579,
        "stub": true
      },
      "underscore-1.3.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 69,
        "digest": "md5-lRWlaQvCPiUt9CVTCTbZqQ==",
        "length": 58692,
        "stub": true
      },
      "underscore-1.3.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 66,
        "digest": "md5-yS3kcu5U31CO0KAJcBJ9yA==",
        "length": 58699,
        "stub": true
      },
      "underscore-1.3.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 60,
        "digest": "md5-Y4Z1Vvv7gZoZtJ9mTz0zSQ==",
        "length": 61440,
        "stub": true
      },
      "underscore-1.3.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 56,
        "digest": "md5-eIPIVGdK7Fzup3CU/AMO4g==",
        "length": 61440,
        "stub": true
      },
      "underscore-1.2.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 54,
        "digest": "md5-jCUzsaWc+tlE/lQNsuLQBA==",
        "length": 61440,
        "stub": true
      },
      "underscore-1.2.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 41,
        "digest": "md5-bP9hXPsRRpFAWlmUNIY+jA==",
        "length": 40960,
        "stub": true
      },
      "underscore-1.2.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 38,
        "digest": "md5-78/kFlhnF2WL94pdo/dfww==",
        "length": 40960,
        "stub": true
      },
      "underscore-1.2.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 35,
        "digest": "md5-gNzWgJppZn3xUj8LCQcJ+Q==",
        "length": 31879,
        "stub": true
      },
      "underscore-1.2.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 33,
        "digest": "md5-WYSTx/McoA2yFB6GmQ5KnA==",
        "length": 31310,
        "stub": true
      },
      "underscore-1.1.7.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 29,
        "digest": "md5-BxaNPc3JexY2qLOK3gDhgw==",
        "length": 29052,
        "stub": true
      },
      "underscore-1.1.6.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 27,
        "digest": "md5-U11VsMTDu6BEZDKJlZidTw==",
        "length": 25592,
        "stub": true
      },
      "underscore-1.1.5.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 25,
        "digest": "md5-rpLusI4XejA3uVROFAZg1A==",
        "length": 25038,
        "stub": true
      },
      "underscore-1.1.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 23,
        "digest": "md5-VrXC+bUYmxwzr2CQH4oq0w==",
        "length": 86233,
        "stub": true
      },
      "underscore-1.1.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 17,
        "digest": "md5-sdTV7zbtYfhAAanQLEcziw==",
        "length": 86107,
        "stub": true
      },
      "underscore-1.1.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 11,
        "digest": "md5-SSm/3w/usRqR+0SrSyCr8A==",
        "length": 85482,
        "stub": true
      },
      "underscore-1.1.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 9,
        "digest": "md5-UW8pTfPbkrRFTiwM6AFlVA==",
        "length": 85214,
        "stub": true
      },
      "underscore-1.1.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 7,
        "digest": "md5-YJcA44Oj1Dm2imfD7dHLag==",
        "length": 71266,
        "stub": true
      },
      "underscore-1.0.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 5,
        "digest": "md5-nRJu+q0L17u8DZqPxVvQKQ==",
        "length": 71018,
        "stub": true
      },
      "underscore-1.0.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 3,
        "digest": "md5-pwgll4db7l4cg7fPTrgVTw==",
        "length": 70285,
        "stub": true
      }
    },
    "_cached": false,
    "_contentLength": 0,
    "homepage": "http://underscorejs.org",
    "keywords": [
      "util",
      "functional",
      "server",
      "client",
      "browser"
    ],
    "main": "underscore.js",
    "version": "1.4.0",
    "readme": "                       __\\n                      /\\\\ \\\\                                                         __\\n     __  __    ___    \\\\_\\\\ \\\\     __   _ __   ____    ___    ___   _ __    __       /\\\\_\\\\    ____\\n    /\\\\ \\\\/\\\\ \\\\ /' _ \`\\\\  /'_  \\\\  /'__\`\\\\/\\\\  __\\\\/ ,__\\\\  / ___\\\\ / __\`\\\\/\\\\  __\\\\/'__\`\\\\     \\\\/\\\\ \\\\  /',__\\\\\\n    \\\\ \\\\ \\\\_\\\\ \\\\/\\\\ \\\\/\\\\ \\\\/\\\\ \\\\ \\\\ \\\\/\\\\  __/\\\\ \\\\ \\\\//\\\\__, \`\\\\/\\\\ \\\\__//\\\\ \\\\ \\\\ \\\\ \\\\ \\\\//\\\\  __/  __  \\\\ \\\\ \\\\/\\\\__, \`\\\\\\n     \\\\ \\\\____/\\\\ \\\\_\\\\ \\\\_\\\\ \\\\___,_\\\\ \\\\____\\\\\\\\ \\\\_\\\\\\\\/\\\\____/\\\\ \\\\____\\\\ \\\\____/\\\\ \\\\_\\\\\\\\ \\\\____\\\\/\\\\_\\\\ _\\\\ \\\\ \\\\/\\\\____/\\n      \\\\/___/  \\\\/_/\\\\/_/\\\\/__,_ /\\\\/____/ \\\\/_/ \\\\/___/  \\\\/____/\\\\/___/  \\\\/_/ \\\\/____/\\\\/_//\\\\ \\\\_\\\\ \\\\/___/\\n                                                                                  \\\\ \\\\____/\\n                                                                                   \\\\/___/\\n\\nUnderscore.js is a utility-belt library for JavaScript that provides\\nsupport for the usual functional suspects (each, map, reduce, filter...)\\nwithout extending any core JavaScript objects.\\n\\nFor Docs, License, Tests, and pre-packed downloads, see:\\nhttp://underscorejs.org\\n\\nMany thanks to our contributors:\\nhttps://github.com/documentcloud/underscore/contributors\\n",
    "dist": {
      "shasum": "caaf510c272cbb53748a225dcfd906e5f5a5ccdd",
      "tarball": "http://localhost:1331/underscore/-/underscore-1.4.0.tgz"
    },
    "_npmVersion": "1.1.49",
    "_npmUser": "jashkenas <jashkenas@gmail.com>",
    "directories": {}
  },
  {
    "_id": "underscore@1.4.1",
    "_rev": "131-e6bd048b180d8ca3830d5242e6bd93fa",
    "name": "underscore",
    "description": "JavaScript's functional programming helper library.",
    "dist-tags": {
      "latest": "1.5.1",
      "stable": "1.5.1"
    },
    "versions": [
      "1.0.3",
      "1.0.4",
      "1.1.0",
      "1.1.1",
      "1.1.2",
      "1.1.3",
      "1.1.4",
      "1.1.5",
      "1.1.6",
      "1.1.7",
      "1.2.0",
      "1.2.1",
      "1.2.2",
      "1.2.3",
      "1.2.4",
      "1.3.0",
      "1.3.1",
      "1.3.2",
      "1.3.3",
      "1.4.0",
      "1.4.1",
      "1.4.2",
      "1.4.3",
      "1.4.4",
      "1.5.0",
      "1.5.1"
    ],
    "maintainers": [
      "jashkenas <jashkenas@gmail.com>"
    ],
    "author": "Jeremy Ashkenas <jeremy@documentcloud.org>",
    "time": {
      "1.0.3": "2011-12-07T15:12:18.045Z",
      "1.0.4": "2011-12-07T15:12:18.045Z",
      "1.1.0": "2011-12-07T15:12:18.045Z",
      "1.1.1": "2011-12-07T15:12:18.045Z",
      "1.1.2": "2011-12-07T15:12:18.045Z",
      "1.1.3": "2011-12-07T15:12:18.045Z",
      "1.1.4": "2011-12-07T15:12:18.045Z",
      "1.1.5": "2011-12-07T15:12:18.045Z",
      "1.1.6": "2011-12-07T15:12:18.045Z",
      "1.1.7": "2011-12-07T15:12:18.045Z",
      "1.2.0": "2011-12-07T15:12:18.045Z",
      "1.2.1": "2011-12-07T15:12:18.045Z",
      "1.2.2": "2011-11-14T20:28:47.115Z",
      "1.2.3": "2011-12-07T15:12:18.045Z",
      "1.2.4": "2012-01-09T17:23:14.818Z",
      "1.3.0": "2012-01-11T16:41:38.459Z",
      "1.3.1": "2012-01-23T22:57:36.474Z",
      "1.3.2": "2012-04-09T18:38:14.345Z",
      "1.3.3": "2012-04-10T14:43:48.089Z",
      "1.4.0": "2012-09-27T22:02:55.267Z",
      "1.4.1": "2012-10-01T17:20:22.595Z",
      "1.4.2": "2012-10-07T03:05:02.986Z",
      "1.4.3": "2012-12-04T18:47:36.401Z",
      "1.4.4": "2013-01-30T02:12:42.969Z",
      "1.5.0": "2013-07-06T18:05:58.721Z",
      "1.5.1": "2013-07-08T08:38:10.051Z"
    },
    "repository": {
      "type": "git",
      "url": "git://github.com/documentcloud/underscore.git"
    },
    "users": {
      "vesln": true,
      "mvolkmann": true,
      "lancehunt": true,
      "mikl": true,
      "linus": true,
      "vasc": true,
      "bat": true,
      "dmalam": true,
      "mbrevoort": true,
      "danielr": true,
      "rsimoes": true,
      "thlorenz": true,
      "jharding": true,
      "tellnes": true,
      "fgribreau": true,
      "pid": true,
      "tylerstalder": true,
      "graemef": true,
      "gillesruppert": true,
      "travishorn": true,
      "m42am": true,
      "af": true,
      "bencevans": true,
      "Scryptonite": true,
      "konklone": true,
      "esp": true,
      "bryanburgers": true,
      "ehershey": true,
      "freethenation": true,
      "dannydulai": true,
      "megadrive": true,
      "lupomontero": true,
      "cj.nichols": true,
      "dbrockman": true,
      "maxmaximov": true,
      "hyqhyq_3": true,
      "zonetti": true,
      "cparker15": true,
      "lemulot": true,
      "mlowe": true,
      "chilts": true,
      "shanewholloway": true,
      "elgs": true,
      "eins78": true,
      "moonpyk": true
    },
    "_attachments": {
      "underscore-1.5.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 129,
        "digest": "md5-jEzAnjdRfcazh9PKAMa1kw==",
        "length": 22746,
        "stub": true
      },
      "underscore-1.5.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 126,
        "digest": "md5-JiqbW+htmCdz6yVjqaz44Q==",
        "length": 22907,
        "stub": true
      },
      "underscore-1.4.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 104,
        "digest": "md5-s/MrjCiRarwh7tZ9DX+RyA==",
        "length": 41763,
        "stub": true
      },
      "underscore-1.4.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 97,
        "digest": "md5-SbGx702k/T8yuag+j/VjCg==",
        "length": 62294,
        "stub": true
      },
      "underscore-1.4.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 91,
        "digest": "md5-vSAO6RpJID3UCJkAWMEIjg==",
        "length": 61836,
        "stub": true
      },
      "underscore-1.4.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 88,
        "digest": "md5-O72hIvWp7cVwkiA/2eF6rg==",
        "length": 61692,
        "stub": true
      },
      "underscore-1.4.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 85,
        "digest": "md5-26PeH3uwZlxMzfzwS4LmMg==",
        "length": 61579,
        "stub": true
      },
      "underscore-1.3.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 69,
        "digest": "md5-lRWlaQvCPiUt9CVTCTbZqQ==",
        "length": 58692,
        "stub": true
      },
      "underscore-1.3.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 66,
        "digest": "md5-yS3kcu5U31CO0KAJcBJ9yA==",
        "length": 58699,
        "stub": true
      },
      "underscore-1.3.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 60,
        "digest": "md5-Y4Z1Vvv7gZoZtJ9mTz0zSQ==",
        "length": 61440,
        "stub": true
      },
      "underscore-1.3.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 56,
        "digest": "md5-eIPIVGdK7Fzup3CU/AMO4g==",
        "length": 61440,
        "stub": true
      },
      "underscore-1.2.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 54,
        "digest": "md5-jCUzsaWc+tlE/lQNsuLQBA==",
        "length": 61440,
        "stub": true
      },
      "underscore-1.2.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 41,
        "digest": "md5-bP9hXPsRRpFAWlmUNIY+jA==",
        "length": 40960,
        "stub": true
      },
      "underscore-1.2.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 38,
        "digest": "md5-78/kFlhnF2WL94pdo/dfww==",
        "length": 40960,
        "stub": true
      },
      "underscore-1.2.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 35,
        "digest": "md5-gNzWgJppZn3xUj8LCQcJ+Q==",
        "length": 31879,
        "stub": true
      },
      "underscore-1.2.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 33,
        "digest": "md5-WYSTx/McoA2yFB6GmQ5KnA==",
        "length": 31310,
        "stub": true
      },
      "underscore-1.1.7.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 29,
        "digest": "md5-BxaNPc3JexY2qLOK3gDhgw==",
        "length": 29052,
        "stub": true
      },
      "underscore-1.1.6.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 27,
        "digest": "md5-U11VsMTDu6BEZDKJlZidTw==",
        "length": 25592,
        "stub": true
      },
      "underscore-1.1.5.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 25,
        "digest": "md5-rpLusI4XejA3uVROFAZg1A==",
        "length": 25038,
        "stub": true
      },
      "underscore-1.1.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 23,
        "digest": "md5-VrXC+bUYmxwzr2CQH4oq0w==",
        "length": 86233,
        "stub": true
      },
      "underscore-1.1.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 17,
        "digest": "md5-sdTV7zbtYfhAAanQLEcziw==",
        "length": 86107,
        "stub": true
      },
      "underscore-1.1.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 11,
        "digest": "md5-SSm/3w/usRqR+0SrSyCr8A==",
        "length": 85482,
        "stub": true
      },
      "underscore-1.1.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 9,
        "digest": "md5-UW8pTfPbkrRFTiwM6AFlVA==",
        "length": 85214,
        "stub": true
      },
      "underscore-1.1.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 7,
        "digest": "md5-YJcA44Oj1Dm2imfD7dHLag==",
        "length": 71266,
        "stub": true
      },
      "underscore-1.0.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 5,
        "digest": "md5-nRJu+q0L17u8DZqPxVvQKQ==",
        "length": 71018,
        "stub": true
      },
      "underscore-1.0.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 3,
        "digest": "md5-pwgll4db7l4cg7fPTrgVTw==",
        "length": 70285,
        "stub": true
      }
    },
    "_cached": false,
    "_contentLength": 0,
    "homepage": "http://underscorejs.org",
    "keywords": [
      "util",
      "functional",
      "server",
      "client",
      "browser"
    ],
    "main": "underscore.js",
    "version": "1.4.1",
    "readme": "                       __\\n                      /\\\\ \\\\                                                         __\\n     __  __    ___    \\\\_\\\\ \\\\     __   _ __   ____    ___    ___   _ __    __       /\\\\_\\\\    ____\\n    /\\\\ \\\\/\\\\ \\\\ /' _ \`\\\\  /'_  \\\\  /'__\`\\\\/\\\\  __\\\\/ ,__\\\\  / ___\\\\ / __\`\\\\/\\\\  __\\\\/'__\`\\\\     \\\\/\\\\ \\\\  /',__\\\\\\n    \\\\ \\\\ \\\\_\\\\ \\\\/\\\\ \\\\/\\\\ \\\\/\\\\ \\\\ \\\\ \\\\/\\\\  __/\\\\ \\\\ \\\\//\\\\__, \`\\\\/\\\\ \\\\__//\\\\ \\\\ \\\\ \\\\ \\\\ \\\\//\\\\  __/  __  \\\\ \\\\ \\\\/\\\\__, \`\\\\\\n     \\\\ \\\\____/\\\\ \\\\_\\\\ \\\\_\\\\ \\\\___,_\\\\ \\\\____\\\\\\\\ \\\\_\\\\\\\\/\\\\____/\\\\ \\\\____\\\\ \\\\____/\\\\ \\\\_\\\\\\\\ \\\\____\\\\/\\\\_\\\\ _\\\\ \\\\ \\\\/\\\\____/\\n      \\\\/___/  \\\\/_/\\\\/_/\\\\/__,_ /\\\\/____/ \\\\/_/ \\\\/___/  \\\\/____/\\\\/___/  \\\\/_/ \\\\/____/\\\\/_//\\\\ \\\\_\\\\ \\\\/___/\\n                                                                                  \\\\ \\\\____/\\n                                                                                   \\\\/___/\\n\\nUnderscore.js is a utility-belt library for JavaScript that provides\\nsupport for the usual functional suspects (each, map, reduce, filter...)\\nwithout extending any core JavaScript objects.\\n\\nFor Docs, License, Tests, and pre-packed downloads, see:\\nhttp://underscorejs.org\\n\\nMany thanks to our contributors:\\nhttps://github.com/documentcloud/underscore/contributors\\n",
    "dist": {
      "shasum": "f6a25ffe5d6d3ed4fe8fef37c3a9bfe689b16bb9",
      "tarball": "http://localhost:1331/underscore/-/underscore-1.4.1.tgz"
    },
    "_npmVersion": "1.1.49",
    "_npmUser": "jashkenas <jashkenas@gmail.com>",
    "directories": {}
  },
  {
    "_id": "underscore@1.4.2",
    "_rev": "131-e6bd048b180d8ca3830d5242e6bd93fa",
    "name": "underscore",
    "description": "JavaScript's functional programming helper library.",
    "dist-tags": {
      "latest": "1.5.1",
      "stable": "1.5.1"
    },
    "versions": [
      "1.0.3",
      "1.0.4",
      "1.1.0",
      "1.1.1",
      "1.1.2",
      "1.1.3",
      "1.1.4",
      "1.1.5",
      "1.1.6",
      "1.1.7",
      "1.2.0",
      "1.2.1",
      "1.2.2",
      "1.2.3",
      "1.2.4",
      "1.3.0",
      "1.3.1",
      "1.3.2",
      "1.3.3",
      "1.4.0",
      "1.4.1",
      "1.4.2",
      "1.4.3",
      "1.4.4",
      "1.5.0",
      "1.5.1"
    ],
    "maintainers": [
      "jashkenas <jashkenas@gmail.com>"
    ],
    "author": "Jeremy Ashkenas <jeremy@documentcloud.org>",
    "time": {
      "1.0.3": "2011-12-07T15:12:18.045Z",
      "1.0.4": "2011-12-07T15:12:18.045Z",
      "1.1.0": "2011-12-07T15:12:18.045Z",
      "1.1.1": "2011-12-07T15:12:18.045Z",
      "1.1.2": "2011-12-07T15:12:18.045Z",
      "1.1.3": "2011-12-07T15:12:18.045Z",
      "1.1.4": "2011-12-07T15:12:18.045Z",
      "1.1.5": "2011-12-07T15:12:18.045Z",
      "1.1.6": "2011-12-07T15:12:18.045Z",
      "1.1.7": "2011-12-07T15:12:18.045Z",
      "1.2.0": "2011-12-07T15:12:18.045Z",
      "1.2.1": "2011-12-07T15:12:18.045Z",
      "1.2.2": "2011-11-14T20:28:47.115Z",
      "1.2.3": "2011-12-07T15:12:18.045Z",
      "1.2.4": "2012-01-09T17:23:14.818Z",
      "1.3.0": "2012-01-11T16:41:38.459Z",
      "1.3.1": "2012-01-23T22:57:36.474Z",
      "1.3.2": "2012-04-09T18:38:14.345Z",
      "1.3.3": "2012-04-10T14:43:48.089Z",
      "1.4.0": "2012-09-27T22:02:55.267Z",
      "1.4.1": "2012-10-01T17:20:22.595Z",
      "1.4.2": "2012-10-07T03:05:02.986Z",
      "1.4.3": "2012-12-04T18:47:36.401Z",
      "1.4.4": "2013-01-30T02:12:42.969Z",
      "1.5.0": "2013-07-06T18:05:58.721Z",
      "1.5.1": "2013-07-08T08:38:10.051Z"
    },
    "repository": {
      "type": "git",
      "url": "git://github.com/documentcloud/underscore.git"
    },
    "users": {
      "vesln": true,
      "mvolkmann": true,
      "lancehunt": true,
      "mikl": true,
      "linus": true,
      "vasc": true,
      "bat": true,
      "dmalam": true,
      "mbrevoort": true,
      "danielr": true,
      "rsimoes": true,
      "thlorenz": true,
      "jharding": true,
      "tellnes": true,
      "fgribreau": true,
      "pid": true,
      "tylerstalder": true,
      "graemef": true,
      "gillesruppert": true,
      "travishorn": true,
      "m42am": true,
      "af": true,
      "bencevans": true,
      "Scryptonite": true,
      "konklone": true,
      "esp": true,
      "bryanburgers": true,
      "ehershey": true,
      "freethenation": true,
      "dannydulai": true,
      "megadrive": true,
      "lupomontero": true,
      "cj.nichols": true,
      "dbrockman": true,
      "maxmaximov": true,
      "hyqhyq_3": true,
      "zonetti": true,
      "cparker15": true,
      "lemulot": true,
      "mlowe": true,
      "chilts": true,
      "shanewholloway": true,
      "elgs": true,
      "eins78": true,
      "moonpyk": true
    },
    "_attachments": {
      "underscore-1.5.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 129,
        "digest": "md5-jEzAnjdRfcazh9PKAMa1kw==",
        "length": 22746,
        "stub": true
      },
      "underscore-1.5.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 126,
        "digest": "md5-JiqbW+htmCdz6yVjqaz44Q==",
        "length": 22907,
        "stub": true
      },
      "underscore-1.4.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 104,
        "digest": "md5-s/MrjCiRarwh7tZ9DX+RyA==",
        "length": 41763,
        "stub": true
      },
      "underscore-1.4.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 97,
        "digest": "md5-SbGx702k/T8yuag+j/VjCg==",
        "length": 62294,
        "stub": true
      },
      "underscore-1.4.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 91,
        "digest": "md5-vSAO6RpJID3UCJkAWMEIjg==",
        "length": 61836,
        "stub": true
      },
      "underscore-1.4.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 88,
        "digest": "md5-O72hIvWp7cVwkiA/2eF6rg==",
        "length": 61692,
        "stub": true
      },
      "underscore-1.4.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 85,
        "digest": "md5-26PeH3uwZlxMzfzwS4LmMg==",
        "length": 61579,
        "stub": true
      },
      "underscore-1.3.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 69,
        "digest": "md5-lRWlaQvCPiUt9CVTCTbZqQ==",
        "length": 58692,
        "stub": true
      },
      "underscore-1.3.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 66,
        "digest": "md5-yS3kcu5U31CO0KAJcBJ9yA==",
        "length": 58699,
        "stub": true
      },
      "underscore-1.3.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 60,
        "digest": "md5-Y4Z1Vvv7gZoZtJ9mTz0zSQ==",
        "length": 61440,
        "stub": true
      },
      "underscore-1.3.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 56,
        "digest": "md5-eIPIVGdK7Fzup3CU/AMO4g==",
        "length": 61440,
        "stub": true
      },
      "underscore-1.2.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 54,
        "digest": "md5-jCUzsaWc+tlE/lQNsuLQBA==",
        "length": 61440,
        "stub": true
      },
      "underscore-1.2.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 41,
        "digest": "md5-bP9hXPsRRpFAWlmUNIY+jA==",
        "length": 40960,
        "stub": true
      },
      "underscore-1.2.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 38,
        "digest": "md5-78/kFlhnF2WL94pdo/dfww==",
        "length": 40960,
        "stub": true
      },
      "underscore-1.2.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 35,
        "digest": "md5-gNzWgJppZn3xUj8LCQcJ+Q==",
        "length": 31879,
        "stub": true
      },
      "underscore-1.2.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 33,
        "digest": "md5-WYSTx/McoA2yFB6GmQ5KnA==",
        "length": 31310,
        "stub": true
      },
      "underscore-1.1.7.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 29,
        "digest": "md5-BxaNPc3JexY2qLOK3gDhgw==",
        "length": 29052,
        "stub": true
      },
      "underscore-1.1.6.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 27,
        "digest": "md5-U11VsMTDu6BEZDKJlZidTw==",
        "length": 25592,
        "stub": true
      },
      "underscore-1.1.5.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 25,
        "digest": "md5-rpLusI4XejA3uVROFAZg1A==",
        "length": 25038,
        "stub": true
      },
      "underscore-1.1.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 23,
        "digest": "md5-VrXC+bUYmxwzr2CQH4oq0w==",
        "length": 86233,
        "stub": true
      },
      "underscore-1.1.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 17,
        "digest": "md5-sdTV7zbtYfhAAanQLEcziw==",
        "length": 86107,
        "stub": true
      },
      "underscore-1.1.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 11,
        "digest": "md5-SSm/3w/usRqR+0SrSyCr8A==",
        "length": 85482,
        "stub": true
      },
      "underscore-1.1.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 9,
        "digest": "md5-UW8pTfPbkrRFTiwM6AFlVA==",
        "length": 85214,
        "stub": true
      },
      "underscore-1.1.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 7,
        "digest": "md5-YJcA44Oj1Dm2imfD7dHLag==",
        "length": 71266,
        "stub": true
      },
      "underscore-1.0.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 5,
        "digest": "md5-nRJu+q0L17u8DZqPxVvQKQ==",
        "length": 71018,
        "stub": true
      },
      "underscore-1.0.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 3,
        "digest": "md5-pwgll4db7l4cg7fPTrgVTw==",
        "length": 70285,
        "stub": true
      }
    },
    "_cached": false,
    "_contentLength": 0,
    "homepage": "http://underscorejs.org",
    "keywords": [
      "util",
      "functional",
      "server",
      "client",
      "browser"
    ],
    "main": "underscore.js",
    "version": "1.4.2",
    "readme": "                       __\\n                      /\\\\ \\\\                                                         __\\n     __  __    ___    \\\\_\\\\ \\\\     __   _ __   ____    ___    ___   _ __    __       /\\\\_\\\\    ____\\n    /\\\\ \\\\/\\\\ \\\\ /' _ \`\\\\  /'_  \\\\  /'__\`\\\\/\\\\  __\\\\/ ,__\\\\  / ___\\\\ / __\`\\\\/\\\\  __\\\\/'__\`\\\\     \\\\/\\\\ \\\\  /',__\\\\\\n    \\\\ \\\\ \\\\_\\\\ \\\\/\\\\ \\\\/\\\\ \\\\/\\\\ \\\\ \\\\ \\\\/\\\\  __/\\\\ \\\\ \\\\//\\\\__, \`\\\\/\\\\ \\\\__//\\\\ \\\\ \\\\ \\\\ \\\\ \\\\//\\\\  __/  __  \\\\ \\\\ \\\\/\\\\__, \`\\\\\\n     \\\\ \\\\____/\\\\ \\\\_\\\\ \\\\_\\\\ \\\\___,_\\\\ \\\\____\\\\\\\\ \\\\_\\\\\\\\/\\\\____/\\\\ \\\\____\\\\ \\\\____/\\\\ \\\\_\\\\\\\\ \\\\____\\\\/\\\\_\\\\ _\\\\ \\\\ \\\\/\\\\____/\\n      \\\\/___/  \\\\/_/\\\\/_/\\\\/__,_ /\\\\/____/ \\\\/_/ \\\\/___/  \\\\/____/\\\\/___/  \\\\/_/ \\\\/____/\\\\/_//\\\\ \\\\_\\\\ \\\\/___/\\n                                                                                  \\\\ \\\\____/\\n                                                                                   \\\\/___/\\n\\nUnderscore.js is a utility-belt library for JavaScript that provides\\nsupport for the usual functional suspects (each, map, reduce, filter...)\\nwithout extending any core JavaScript objects.\\n\\nFor Docs, License, Tests, and pre-packed downloads, see:\\nhttp://underscorejs.org\\n\\nMany thanks to our contributors:\\nhttps://github.com/documentcloud/underscore/contributors\\n",
    "dist": {
      "shasum": "cb2aae6a7999a89fd55aaee75bce0311698cebfb",
      "tarball": "http://localhost:1331/underscore/-/underscore-1.4.2.tgz"
    },
    "_npmVersion": "1.1.49",
    "_npmUser": "jashkenas <jashkenas@gmail.com>",
    "directories": {}
  },
  {
    "_id": "underscore@1.4.3",
    "_rev": "131-e6bd048b180d8ca3830d5242e6bd93fa",
    "name": "underscore",
    "description": "JavaScript's functional programming helper library.",
    "dist-tags": {
      "latest": "1.5.1",
      "stable": "1.5.1"
    },
    "versions": [
      "1.0.3",
      "1.0.4",
      "1.1.0",
      "1.1.1",
      "1.1.2",
      "1.1.3",
      "1.1.4",
      "1.1.5",
      "1.1.6",
      "1.1.7",
      "1.2.0",
      "1.2.1",
      "1.2.2",
      "1.2.3",
      "1.2.4",
      "1.3.0",
      "1.3.1",
      "1.3.2",
      "1.3.3",
      "1.4.0",
      "1.4.1",
      "1.4.2",
      "1.4.3",
      "1.4.4",
      "1.5.0",
      "1.5.1"
    ],
    "maintainers": [
      "jashkenas <jashkenas@gmail.com>"
    ],
    "author": "Jeremy Ashkenas <jeremy@documentcloud.org>",
    "time": {
      "1.0.3": "2011-12-07T15:12:18.045Z",
      "1.0.4": "2011-12-07T15:12:18.045Z",
      "1.1.0": "2011-12-07T15:12:18.045Z",
      "1.1.1": "2011-12-07T15:12:18.045Z",
      "1.1.2": "2011-12-07T15:12:18.045Z",
      "1.1.3": "2011-12-07T15:12:18.045Z",
      "1.1.4": "2011-12-07T15:12:18.045Z",
      "1.1.5": "2011-12-07T15:12:18.045Z",
      "1.1.6": "2011-12-07T15:12:18.045Z",
      "1.1.7": "2011-12-07T15:12:18.045Z",
      "1.2.0": "2011-12-07T15:12:18.045Z",
      "1.2.1": "2011-12-07T15:12:18.045Z",
      "1.2.2": "2011-11-14T20:28:47.115Z",
      "1.2.3": "2011-12-07T15:12:18.045Z",
      "1.2.4": "2012-01-09T17:23:14.818Z",
      "1.3.0": "2012-01-11T16:41:38.459Z",
      "1.3.1": "2012-01-23T22:57:36.474Z",
      "1.3.2": "2012-04-09T18:38:14.345Z",
      "1.3.3": "2012-04-10T14:43:48.089Z",
      "1.4.0": "2012-09-27T22:02:55.267Z",
      "1.4.1": "2012-10-01T17:20:22.595Z",
      "1.4.2": "2012-10-07T03:05:02.986Z",
      "1.4.3": "2012-12-04T18:47:36.401Z",
      "1.4.4": "2013-01-30T02:12:42.969Z",
      "1.5.0": "2013-07-06T18:05:58.721Z",
      "1.5.1": "2013-07-08T08:38:10.051Z"
    },
    "repository": {
      "type": "git",
      "url": "git://github.com/documentcloud/underscore.git"
    },
    "users": {
      "vesln": true,
      "mvolkmann": true,
      "lancehunt": true,
      "mikl": true,
      "linus": true,
      "vasc": true,
      "bat": true,
      "dmalam": true,
      "mbrevoort": true,
      "danielr": true,
      "rsimoes": true,
      "thlorenz": true,
      "jharding": true,
      "tellnes": true,
      "fgribreau": true,
      "pid": true,
      "tylerstalder": true,
      "graemef": true,
      "gillesruppert": true,
      "travishorn": true,
      "m42am": true,
      "af": true,
      "bencevans": true,
      "Scryptonite": true,
      "konklone": true,
      "esp": true,
      "bryanburgers": true,
      "ehershey": true,
      "freethenation": true,
      "dannydulai": true,
      "megadrive": true,
      "lupomontero": true,
      "cj.nichols": true,
      "dbrockman": true,
      "maxmaximov": true,
      "hyqhyq_3": true,
      "zonetti": true,
      "cparker15": true,
      "lemulot": true,
      "mlowe": true,
      "chilts": true,
      "shanewholloway": true,
      "elgs": true,
      "eins78": true,
      "moonpyk": true
    },
    "_attachments": {
      "underscore-1.5.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 129,
        "digest": "md5-jEzAnjdRfcazh9PKAMa1kw==",
        "length": 22746,
        "stub": true
      },
      "underscore-1.5.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 126,
        "digest": "md5-JiqbW+htmCdz6yVjqaz44Q==",
        "length": 22907,
        "stub": true
      },
      "underscore-1.4.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 104,
        "digest": "md5-s/MrjCiRarwh7tZ9DX+RyA==",
        "length": 41763,
        "stub": true
      },
      "underscore-1.4.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 97,
        "digest": "md5-SbGx702k/T8yuag+j/VjCg==",
        "length": 62294,
        "stub": true
      },
      "underscore-1.4.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 91,
        "digest": "md5-vSAO6RpJID3UCJkAWMEIjg==",
        "length": 61836,
        "stub": true
      },
      "underscore-1.4.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 88,
        "digest": "md5-O72hIvWp7cVwkiA/2eF6rg==",
        "length": 61692,
        "stub": true
      },
      "underscore-1.4.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 85,
        "digest": "md5-26PeH3uwZlxMzfzwS4LmMg==",
        "length": 61579,
        "stub": true
      },
      "underscore-1.3.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 69,
        "digest": "md5-lRWlaQvCPiUt9CVTCTbZqQ==",
        "length": 58692,
        "stub": true
      },
      "underscore-1.3.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 66,
        "digest": "md5-yS3kcu5U31CO0KAJcBJ9yA==",
        "length": 58699,
        "stub": true
      },
      "underscore-1.3.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 60,
        "digest": "md5-Y4Z1Vvv7gZoZtJ9mTz0zSQ==",
        "length": 61440,
        "stub": true
      },
      "underscore-1.3.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 56,
        "digest": "md5-eIPIVGdK7Fzup3CU/AMO4g==",
        "length": 61440,
        "stub": true
      },
      "underscore-1.2.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 54,
        "digest": "md5-jCUzsaWc+tlE/lQNsuLQBA==",
        "length": 61440,
        "stub": true
      },
      "underscore-1.2.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 41,
        "digest": "md5-bP9hXPsRRpFAWlmUNIY+jA==",
        "length": 40960,
        "stub": true
      },
      "underscore-1.2.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 38,
        "digest": "md5-78/kFlhnF2WL94pdo/dfww==",
        "length": 40960,
        "stub": true
      },
      "underscore-1.2.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 35,
        "digest": "md5-gNzWgJppZn3xUj8LCQcJ+Q==",
        "length": 31879,
        "stub": true
      },
      "underscore-1.2.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 33,
        "digest": "md5-WYSTx/McoA2yFB6GmQ5KnA==",
        "length": 31310,
        "stub": true
      },
      "underscore-1.1.7.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 29,
        "digest": "md5-BxaNPc3JexY2qLOK3gDhgw==",
        "length": 29052,
        "stub": true
      },
      "underscore-1.1.6.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 27,
        "digest": "md5-U11VsMTDu6BEZDKJlZidTw==",
        "length": 25592,
        "stub": true
      },
      "underscore-1.1.5.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 25,
        "digest": "md5-rpLusI4XejA3uVROFAZg1A==",
        "length": 25038,
        "stub": true
      },
      "underscore-1.1.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 23,
        "digest": "md5-VrXC+bUYmxwzr2CQH4oq0w==",
        "length": 86233,
        "stub": true
      },
      "underscore-1.1.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 17,
        "digest": "md5-sdTV7zbtYfhAAanQLEcziw==",
        "length": 86107,
        "stub": true
      },
      "underscore-1.1.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 11,
        "digest": "md5-SSm/3w/usRqR+0SrSyCr8A==",
        "length": 85482,
        "stub": true
      },
      "underscore-1.1.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 9,
        "digest": "md5-UW8pTfPbkrRFTiwM6AFlVA==",
        "length": 85214,
        "stub": true
      },
      "underscore-1.1.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 7,
        "digest": "md5-YJcA44Oj1Dm2imfD7dHLag==",
        "length": 71266,
        "stub": true
      },
      "underscore-1.0.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 5,
        "digest": "md5-nRJu+q0L17u8DZqPxVvQKQ==",
        "length": 71018,
        "stub": true
      },
      "underscore-1.0.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 3,
        "digest": "md5-pwgll4db7l4cg7fPTrgVTw==",
        "length": 70285,
        "stub": true
      }
    },
    "_cached": false,
    "_contentLength": 0,
    "homepage": "http://underscorejs.org",
    "keywords": [
      "util",
      "functional",
      "server",
      "client",
      "browser"
    ],
    "main": "underscore.js",
    "version": "1.4.3",
    "readme": "                       __\\n                      /\\\\ \\\\                                                         __\\n     __  __    ___    \\\\_\\\\ \\\\     __   _ __   ____    ___    ___   _ __    __       /\\\\_\\\\    ____\\n    /\\\\ \\\\/\\\\ \\\\ /' _ \`\\\\  /'_  \\\\  /'__\`\\\\/\\\\  __\\\\/ ,__\\\\  / ___\\\\ / __\`\\\\/\\\\  __\\\\/'__\`\\\\     \\\\/\\\\ \\\\  /',__\\\\\\n    \\\\ \\\\ \\\\_\\\\ \\\\/\\\\ \\\\/\\\\ \\\\/\\\\ \\\\ \\\\ \\\\/\\\\  __/\\\\ \\\\ \\\\//\\\\__, \`\\\\/\\\\ \\\\__//\\\\ \\\\ \\\\ \\\\ \\\\ \\\\//\\\\  __/  __  \\\\ \\\\ \\\\/\\\\__, \`\\\\\\n     \\\\ \\\\____/\\\\ \\\\_\\\\ \\\\_\\\\ \\\\___,_\\\\ \\\\____\\\\\\\\ \\\\_\\\\\\\\/\\\\____/\\\\ \\\\____\\\\ \\\\____/\\\\ \\\\_\\\\\\\\ \\\\____\\\\/\\\\_\\\\ _\\\\ \\\\ \\\\/\\\\____/\\n      \\\\/___/  \\\\/_/\\\\/_/\\\\/__,_ /\\\\/____/ \\\\/_/ \\\\/___/  \\\\/____/\\\\/___/  \\\\/_/ \\\\/____/\\\\/_//\\\\ \\\\_\\\\ \\\\/___/\\n                                                                                  \\\\ \\\\____/\\n                                                                                   \\\\/___/\\n\\nUnderscore.js is a utility-belt library for JavaScript that provides\\nsupport for the usual functional suspects (each, map, reduce, filter...)\\nwithout extending any core JavaScript objects.\\n\\nFor Docs, License, Tests, and pre-packed downloads, see:\\nhttp://underscorejs.org\\n\\nMany thanks to our contributors:\\nhttps://github.com/documentcloud/underscore/contributors\\n",
    "dist": {
      "shasum": "b3d0aaa1ee74d886ea4f2648021a4f8ad779ed1d",
      "tarball": "http://localhost:1331/underscore/-/underscore-1.4.3.tgz"
    },
    "_npmVersion": "1.1.63",
    "_npmUser": "jashkenas <jashkenas@gmail.com>",
    "directories": {}
  },
  {
    "_id": "underscore@1.4.4",
    "_rev": "131-e6bd048b180d8ca3830d5242e6bd93fa",
    "name": "underscore",
    "description": "JavaScript's functional programming helper library.",
    "dist-tags": {
      "latest": "1.5.1",
      "stable": "1.5.1"
    },
    "versions": [
      "1.0.3",
      "1.0.4",
      "1.1.0",
      "1.1.1",
      "1.1.2",
      "1.1.3",
      "1.1.4",
      "1.1.5",
      "1.1.6",
      "1.1.7",
      "1.2.0",
      "1.2.1",
      "1.2.2",
      "1.2.3",
      "1.2.4",
      "1.3.0",
      "1.3.1",
      "1.3.2",
      "1.3.3",
      "1.4.0",
      "1.4.1",
      "1.4.2",
      "1.4.3",
      "1.4.4",
      "1.5.0",
      "1.5.1"
    ],
    "maintainers": [
      "jashkenas <jashkenas@gmail.com>"
    ],
    "author": "Jeremy Ashkenas <jeremy@documentcloud.org>",
    "time": {
      "1.0.3": "2011-12-07T15:12:18.045Z",
      "1.0.4": "2011-12-07T15:12:18.045Z",
      "1.1.0": "2011-12-07T15:12:18.045Z",
      "1.1.1": "2011-12-07T15:12:18.045Z",
      "1.1.2": "2011-12-07T15:12:18.045Z",
      "1.1.3": "2011-12-07T15:12:18.045Z",
      "1.1.4": "2011-12-07T15:12:18.045Z",
      "1.1.5": "2011-12-07T15:12:18.045Z",
      "1.1.6": "2011-12-07T15:12:18.045Z",
      "1.1.7": "2011-12-07T15:12:18.045Z",
      "1.2.0": "2011-12-07T15:12:18.045Z",
      "1.2.1": "2011-12-07T15:12:18.045Z",
      "1.2.2": "2011-11-14T20:28:47.115Z",
      "1.2.3": "2011-12-07T15:12:18.045Z",
      "1.2.4": "2012-01-09T17:23:14.818Z",
      "1.3.0": "2012-01-11T16:41:38.459Z",
      "1.3.1": "2012-01-23T22:57:36.474Z",
      "1.3.2": "2012-04-09T18:38:14.345Z",
      "1.3.3": "2012-04-10T14:43:48.089Z",
      "1.4.0": "2012-09-27T22:02:55.267Z",
      "1.4.1": "2012-10-01T17:20:22.595Z",
      "1.4.2": "2012-10-07T03:05:02.986Z",
      "1.4.3": "2012-12-04T18:47:36.401Z",
      "1.4.4": "2013-01-30T02:12:42.969Z",
      "1.5.0": "2013-07-06T18:05:58.721Z",
      "1.5.1": "2013-07-08T08:38:10.051Z"
    },
    "repository": {
      "type": "git",
      "url": "git://github.com/documentcloud/underscore.git"
    },
    "users": {
      "vesln": true,
      "mvolkmann": true,
      "lancehunt": true,
      "mikl": true,
      "linus": true,
      "vasc": true,
      "bat": true,
      "dmalam": true,
      "mbrevoort": true,
      "danielr": true,
      "rsimoes": true,
      "thlorenz": true,
      "jharding": true,
      "tellnes": true,
      "fgribreau": true,
      "pid": true,
      "tylerstalder": true,
      "graemef": true,
      "gillesruppert": true,
      "travishorn": true,
      "m42am": true,
      "af": true,
      "bencevans": true,
      "Scryptonite": true,
      "konklone": true,
      "esp": true,
      "bryanburgers": true,
      "ehershey": true,
      "freethenation": true,
      "dannydulai": true,
      "megadrive": true,
      "lupomontero": true,
      "cj.nichols": true,
      "dbrockman": true,
      "maxmaximov": true,
      "hyqhyq_3": true,
      "zonetti": true,
      "cparker15": true,
      "lemulot": true,
      "mlowe": true,
      "chilts": true,
      "shanewholloway": true,
      "elgs": true,
      "eins78": true,
      "moonpyk": true
    },
    "_attachments": {
      "underscore-1.5.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 129,
        "digest": "md5-jEzAnjdRfcazh9PKAMa1kw==",
        "length": 22746,
        "stub": true
      },
      "underscore-1.5.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 126,
        "digest": "md5-JiqbW+htmCdz6yVjqaz44Q==",
        "length": 22907,
        "stub": true
      },
      "underscore-1.4.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 104,
        "digest": "md5-s/MrjCiRarwh7tZ9DX+RyA==",
        "length": 41763,
        "stub": true
      },
      "underscore-1.4.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 97,
        "digest": "md5-SbGx702k/T8yuag+j/VjCg==",
        "length": 62294,
        "stub": true
      },
      "underscore-1.4.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 91,
        "digest": "md5-vSAO6RpJID3UCJkAWMEIjg==",
        "length": 61836,
        "stub": true
      },
      "underscore-1.4.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 88,
        "digest": "md5-O72hIvWp7cVwkiA/2eF6rg==",
        "length": 61692,
        "stub": true
      },
      "underscore-1.4.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 85,
        "digest": "md5-26PeH3uwZlxMzfzwS4LmMg==",
        "length": 61579,
        "stub": true
      },
      "underscore-1.3.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 69,
        "digest": "md5-lRWlaQvCPiUt9CVTCTbZqQ==",
        "length": 58692,
        "stub": true
      },
      "underscore-1.3.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 66,
        "digest": "md5-yS3kcu5U31CO0KAJcBJ9yA==",
        "length": 58699,
        "stub": true
      },
      "underscore-1.3.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 60,
        "digest": "md5-Y4Z1Vvv7gZoZtJ9mTz0zSQ==",
        "length": 61440,
        "stub": true
      },
      "underscore-1.3.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 56,
        "digest": "md5-eIPIVGdK7Fzup3CU/AMO4g==",
        "length": 61440,
        "stub": true
      },
      "underscore-1.2.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 54,
        "digest": "md5-jCUzsaWc+tlE/lQNsuLQBA==",
        "length": 61440,
        "stub": true
      },
      "underscore-1.2.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 41,
        "digest": "md5-bP9hXPsRRpFAWlmUNIY+jA==",
        "length": 40960,
        "stub": true
      },
      "underscore-1.2.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 38,
        "digest": "md5-78/kFlhnF2WL94pdo/dfww==",
        "length": 40960,
        "stub": true
      },
      "underscore-1.2.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 35,
        "digest": "md5-gNzWgJppZn3xUj8LCQcJ+Q==",
        "length": 31879,
        "stub": true
      },
      "underscore-1.2.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 33,
        "digest": "md5-WYSTx/McoA2yFB6GmQ5KnA==",
        "length": 31310,
        "stub": true
      },
      "underscore-1.1.7.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 29,
        "digest": "md5-BxaNPc3JexY2qLOK3gDhgw==",
        "length": 29052,
        "stub": true
      },
      "underscore-1.1.6.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 27,
        "digest": "md5-U11VsMTDu6BEZDKJlZidTw==",
        "length": 25592,
        "stub": true
      },
      "underscore-1.1.5.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 25,
        "digest": "md5-rpLusI4XejA3uVROFAZg1A==",
        "length": 25038,
        "stub": true
      },
      "underscore-1.1.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 23,
        "digest": "md5-VrXC+bUYmxwzr2CQH4oq0w==",
        "length": 86233,
        "stub": true
      },
      "underscore-1.1.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 17,
        "digest": "md5-sdTV7zbtYfhAAanQLEcziw==",
        "length": 86107,
        "stub": true
      },
      "underscore-1.1.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 11,
        "digest": "md5-SSm/3w/usRqR+0SrSyCr8A==",
        "length": 85482,
        "stub": true
      },
      "underscore-1.1.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 9,
        "digest": "md5-UW8pTfPbkrRFTiwM6AFlVA==",
        "length": 85214,
        "stub": true
      },
      "underscore-1.1.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 7,
        "digest": "md5-YJcA44Oj1Dm2imfD7dHLag==",
        "length": 71266,
        "stub": true
      },
      "underscore-1.0.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 5,
        "digest": "md5-nRJu+q0L17u8DZqPxVvQKQ==",
        "length": 71018,
        "stub": true
      },
      "underscore-1.0.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 3,
        "digest": "md5-pwgll4db7l4cg7fPTrgVTw==",
        "length": 70285,
        "stub": true
      }
    },
    "_cached": false,
    "_contentLength": 0,
    "homepage": "http://underscorejs.org",
    "keywords": [
      "util",
      "functional",
      "server",
      "client",
      "browser"
    ],
    "main": "underscore.js",
    "version": "1.4.4",
    "devDependencies": {
      "phantomjs": "0.2.2"
    },
    "scripts": {
      "test": "phantomjs test/vendor/runner.js test/index.html?noglobals=true"
    },
    "readme": "                       __\\n                      /\\\\ \\\\                                                         __\\n     __  __    ___    \\\\_\\\\ \\\\     __   _ __   ____    ___    ___   _ __    __       /\\\\_\\\\    ____\\n    /\\\\ \\\\/\\\\ \\\\ /' _ \`\\\\  /'_  \\\\  /'__\`\\\\/\\\\  __\\\\/ ,__\\\\  / ___\\\\ / __\`\\\\/\\\\  __\\\\/'__\`\\\\     \\\\/\\\\ \\\\  /',__\\\\\\n    \\\\ \\\\ \\\\_\\\\ \\\\/\\\\ \\\\/\\\\ \\\\/\\\\ \\\\ \\\\ \\\\/\\\\  __/\\\\ \\\\ \\\\//\\\\__, \`\\\\/\\\\ \\\\__//\\\\ \\\\ \\\\ \\\\ \\\\ \\\\//\\\\  __/  __  \\\\ \\\\ \\\\/\\\\__, \`\\\\\\n     \\\\ \\\\____/\\\\ \\\\_\\\\ \\\\_\\\\ \\\\___,_\\\\ \\\\____\\\\\\\\ \\\\_\\\\\\\\/\\\\____/\\\\ \\\\____\\\\ \\\\____/\\\\ \\\\_\\\\\\\\ \\\\____\\\\/\\\\_\\\\ _\\\\ \\\\ \\\\/\\\\____/\\n      \\\\/___/  \\\\/_/\\\\/_/\\\\/__,_ /\\\\/____/ \\\\/_/ \\\\/___/  \\\\/____/\\\\/___/  \\\\/_/ \\\\/____/\\\\/_//\\\\ \\\\_\\\\ \\\\/___/\\n                                                                                  \\\\ \\\\____/\\n                                                                                   \\\\/___/\\n\\nUnderscore.js is a utility-belt library for JavaScript that provides\\nsupport for the usual functional suspects (each, map, reduce, filter...)\\nwithout extending any core JavaScript objects.\\n\\nFor Docs, License, Tests, and pre-packed downloads, see:\\nhttp://underscorejs.org\\n\\nMany thanks to our contributors:\\nhttps://github.com/documentcloud/underscore/contributors\\n",
    "dist": {
      "shasum": "61a6a32010622afa07963bf325203cf12239d604",
      "tarball": "http://localhost:1331/underscore/-/underscore-1.4.4.tgz"
    },
    "_npmVersion": "1.1.63",
    "_npmUser": "jashkenas <jashkenas@gmail.com>",
    "directories": {}
  },
  {
    "_id": "underscore@1.5.0",
    "_rev": "131-e6bd048b180d8ca3830d5242e6bd93fa",
    "name": "underscore",
    "description": "JavaScript's functional programming helper library.",
    "dist-tags": {
      "latest": "1.5.1",
      "stable": "1.5.1"
    },
    "versions": [
      "1.0.3",
      "1.0.4",
      "1.1.0",
      "1.1.1",
      "1.1.2",
      "1.1.3",
      "1.1.4",
      "1.1.5",
      "1.1.6",
      "1.1.7",
      "1.2.0",
      "1.2.1",
      "1.2.2",
      "1.2.3",
      "1.2.4",
      "1.3.0",
      "1.3.1",
      "1.3.2",
      "1.3.3",
      "1.4.0",
      "1.4.1",
      "1.4.2",
      "1.4.3",
      "1.4.4",
      "1.5.0",
      "1.5.1"
    ],
    "maintainers": [
      "jashkenas <jashkenas@gmail.com>"
    ],
    "author": "Jeremy Ashkenas <jeremy@documentcloud.org>",
    "time": {
      "1.0.3": "2011-12-07T15:12:18.045Z",
      "1.0.4": "2011-12-07T15:12:18.045Z",
      "1.1.0": "2011-12-07T15:12:18.045Z",
      "1.1.1": "2011-12-07T15:12:18.045Z",
      "1.1.2": "2011-12-07T15:12:18.045Z",
      "1.1.3": "2011-12-07T15:12:18.045Z",
      "1.1.4": "2011-12-07T15:12:18.045Z",
      "1.1.5": "2011-12-07T15:12:18.045Z",
      "1.1.6": "2011-12-07T15:12:18.045Z",
      "1.1.7": "2011-12-07T15:12:18.045Z",
      "1.2.0": "2011-12-07T15:12:18.045Z",
      "1.2.1": "2011-12-07T15:12:18.045Z",
      "1.2.2": "2011-11-14T20:28:47.115Z",
      "1.2.3": "2011-12-07T15:12:18.045Z",
      "1.2.4": "2012-01-09T17:23:14.818Z",
      "1.3.0": "2012-01-11T16:41:38.459Z",
      "1.3.1": "2012-01-23T22:57:36.474Z",
      "1.3.2": "2012-04-09T18:38:14.345Z",
      "1.3.3": "2012-04-10T14:43:48.089Z",
      "1.4.0": "2012-09-27T22:02:55.267Z",
      "1.4.1": "2012-10-01T17:20:22.595Z",
      "1.4.2": "2012-10-07T03:05:02.986Z",
      "1.4.3": "2012-12-04T18:47:36.401Z",
      "1.4.4": "2013-01-30T02:12:42.969Z",
      "1.5.0": "2013-07-06T18:05:58.721Z",
      "1.5.1": "2013-07-08T08:38:10.051Z"
    },
    "repository": {
      "type": "git",
      "url": "git://github.com/documentcloud/underscore.git"
    },
    "users": {
      "vesln": true,
      "mvolkmann": true,
      "lancehunt": true,
      "mikl": true,
      "linus": true,
      "vasc": true,
      "bat": true,
      "dmalam": true,
      "mbrevoort": true,
      "danielr": true,
      "rsimoes": true,
      "thlorenz": true,
      "jharding": true,
      "tellnes": true,
      "fgribreau": true,
      "pid": true,
      "tylerstalder": true,
      "graemef": true,
      "gillesruppert": true,
      "travishorn": true,
      "m42am": true,
      "af": true,
      "bencevans": true,
      "Scryptonite": true,
      "konklone": true,
      "esp": true,
      "bryanburgers": true,
      "ehershey": true,
      "freethenation": true,
      "dannydulai": true,
      "megadrive": true,
      "lupomontero": true,
      "cj.nichols": true,
      "dbrockman": true,
      "maxmaximov": true,
      "hyqhyq_3": true,
      "zonetti": true,
      "cparker15": true,
      "lemulot": true,
      "mlowe": true,
      "chilts": true,
      "shanewholloway": true,
      "elgs": true,
      "eins78": true,
      "moonpyk": true
    },
    "_attachments": {
      "underscore-1.5.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 129,
        "digest": "md5-jEzAnjdRfcazh9PKAMa1kw==",
        "length": 22746,
        "stub": true
      },
      "underscore-1.5.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 126,
        "digest": "md5-JiqbW+htmCdz6yVjqaz44Q==",
        "length": 22907,
        "stub": true
      },
      "underscore-1.4.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 104,
        "digest": "md5-s/MrjCiRarwh7tZ9DX+RyA==",
        "length": 41763,
        "stub": true
      },
      "underscore-1.4.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 97,
        "digest": "md5-SbGx702k/T8yuag+j/VjCg==",
        "length": 62294,
        "stub": true
      },
      "underscore-1.4.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 91,
        "digest": "md5-vSAO6RpJID3UCJkAWMEIjg==",
        "length": 61836,
        "stub": true
      },
      "underscore-1.4.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 88,
        "digest": "md5-O72hIvWp7cVwkiA/2eF6rg==",
        "length": 61692,
        "stub": true
      },
      "underscore-1.4.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 85,
        "digest": "md5-26PeH3uwZlxMzfzwS4LmMg==",
        "length": 61579,
        "stub": true
      },
      "underscore-1.3.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 69,
        "digest": "md5-lRWlaQvCPiUt9CVTCTbZqQ==",
        "length": 58692,
        "stub": true
      },
      "underscore-1.3.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 66,
        "digest": "md5-yS3kcu5U31CO0KAJcBJ9yA==",
        "length": 58699,
        "stub": true
      },
      "underscore-1.3.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 60,
        "digest": "md5-Y4Z1Vvv7gZoZtJ9mTz0zSQ==",
        "length": 61440,
        "stub": true
      },
      "underscore-1.3.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 56,
        "digest": "md5-eIPIVGdK7Fzup3CU/AMO4g==",
        "length": 61440,
        "stub": true
      },
      "underscore-1.2.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 54,
        "digest": "md5-jCUzsaWc+tlE/lQNsuLQBA==",
        "length": 61440,
        "stub": true
      },
      "underscore-1.2.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 41,
        "digest": "md5-bP9hXPsRRpFAWlmUNIY+jA==",
        "length": 40960,
        "stub": true
      },
      "underscore-1.2.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 38,
        "digest": "md5-78/kFlhnF2WL94pdo/dfww==",
        "length": 40960,
        "stub": true
      },
      "underscore-1.2.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 35,
        "digest": "md5-gNzWgJppZn3xUj8LCQcJ+Q==",
        "length": 31879,
        "stub": true
      },
      "underscore-1.2.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 33,
        "digest": "md5-WYSTx/McoA2yFB6GmQ5KnA==",
        "length": 31310,
        "stub": true
      },
      "underscore-1.1.7.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 29,
        "digest": "md5-BxaNPc3JexY2qLOK3gDhgw==",
        "length": 29052,
        "stub": true
      },
      "underscore-1.1.6.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 27,
        "digest": "md5-U11VsMTDu6BEZDKJlZidTw==",
        "length": 25592,
        "stub": true
      },
      "underscore-1.1.5.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 25,
        "digest": "md5-rpLusI4XejA3uVROFAZg1A==",
        "length": 25038,
        "stub": true
      },
      "underscore-1.1.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 23,
        "digest": "md5-VrXC+bUYmxwzr2CQH4oq0w==",
        "length": 86233,
        "stub": true
      },
      "underscore-1.1.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 17,
        "digest": "md5-sdTV7zbtYfhAAanQLEcziw==",
        "length": 86107,
        "stub": true
      },
      "underscore-1.1.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 11,
        "digest": "md5-SSm/3w/usRqR+0SrSyCr8A==",
        "length": 85482,
        "stub": true
      },
      "underscore-1.1.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 9,
        "digest": "md5-UW8pTfPbkrRFTiwM6AFlVA==",
        "length": 85214,
        "stub": true
      },
      "underscore-1.1.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 7,
        "digest": "md5-YJcA44Oj1Dm2imfD7dHLag==",
        "length": 71266,
        "stub": true
      },
      "underscore-1.0.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 5,
        "digest": "md5-nRJu+q0L17u8DZqPxVvQKQ==",
        "length": 71018,
        "stub": true
      },
      "underscore-1.0.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 3,
        "digest": "md5-pwgll4db7l4cg7fPTrgVTw==",
        "length": 70285,
        "stub": true
      }
    },
    "_cached": false,
    "_contentLength": 0,
    "homepage": "http://underscorejs.org",
    "keywords": [
      "util",
      "functional",
      "server",
      "client",
      "browser"
    ],
    "main": "underscore.js",
    "version": "1.5.0",
    "devDependencies": {
      "phantomjs": "1.9.0-1"
    },
    "scripts": {
      "test": "phantomjs test/vendor/runner.js test/index.html?noglobals=true"
    },
    "license": "MIT",
    "readme": "                       __\\n                      /\\\\ \\\\                                                         __\\n     __  __    ___    \\\\_\\\\ \\\\     __   _ __   ____    ___    ___   _ __    __       /\\\\_\\\\    ____\\n    /\\\\ \\\\/\\\\ \\\\ /' _ \`\\\\  /'_  \\\\  /'__\`\\\\/\\\\  __\\\\/ ,__\\\\  / ___\\\\ / __\`\\\\/\\\\  __\\\\/'__\`\\\\     \\\\/\\\\ \\\\  /',__\\\\\\n    \\\\ \\\\ \\\\_\\\\ \\\\/\\\\ \\\\/\\\\ \\\\/\\\\ \\\\ \\\\ \\\\/\\\\  __/\\\\ \\\\ \\\\//\\\\__, \`\\\\/\\\\ \\\\__//\\\\ \\\\ \\\\ \\\\ \\\\ \\\\//\\\\  __/  __  \\\\ \\\\ \\\\/\\\\__, \`\\\\\\n     \\\\ \\\\____/\\\\ \\\\_\\\\ \\\\_\\\\ \\\\___,_\\\\ \\\\____\\\\\\\\ \\\\_\\\\\\\\/\\\\____/\\\\ \\\\____\\\\ \\\\____/\\\\ \\\\_\\\\\\\\ \\\\____\\\\/\\\\_\\\\ _\\\\ \\\\ \\\\/\\\\____/\\n      \\\\/___/  \\\\/_/\\\\/_/\\\\/__,_ /\\\\/____/ \\\\/_/ \\\\/___/  \\\\/____/\\\\/___/  \\\\/_/ \\\\/____/\\\\/_//\\\\ \\\\_\\\\ \\\\/___/\\n                                                                                  \\\\ \\\\____/\\n                                                                                   \\\\/___/\\n\\nUnderscore.js is a utility-belt library for JavaScript that provides\\nsupport for the usual functional suspects (each, map, reduce, filter...)\\nwithout extending any core JavaScript objects.\\n\\nFor Docs, License, Tests, and pre-packed downloads, see:\\nhttp://underscorejs.org\\n\\nMany thanks to our contributors:\\nhttps://github.com/documentcloud/underscore/contributors\\n",
    "readmeFilename": "README.md",
    "bugs": {
      "url": "https://github.com/documentcloud/underscore/issues"
    },
    "dist": {
      "shasum": "90c57994d1de16aab8938142e3c5b43547019362",
      "tarball": "http://localhost:1331/underscore/-/underscore-1.5.0.tgz"
    },
    "_from": ".",
    "_npmVersion": "1.2.24",
    "_npmUser": "jashkenas <jashkenas@gmail.com>",
    "directories": {}
  },
  {
    "_id": "underscore@1.5.1",
    "_rev": "131-e6bd048b180d8ca3830d5242e6bd93fa",
    "name": "underscore",
    "description": "JavaScript's functional programming helper library.",
    "dist-tags": {
      "latest": "1.5.1",
      "stable": "1.5.1"
    },
    "versions": [
      "1.0.3",
      "1.0.4",
      "1.1.0",
      "1.1.1",
      "1.1.2",
      "1.1.3",
      "1.1.4",
      "1.1.5",
      "1.1.6",
      "1.1.7",
      "1.2.0",
      "1.2.1",
      "1.2.2",
      "1.2.3",
      "1.2.4",
      "1.3.0",
      "1.3.1",
      "1.3.2",
      "1.3.3",
      "1.4.0",
      "1.4.1",
      "1.4.2",
      "1.4.3",
      "1.4.4",
      "1.5.0",
      "1.5.1"
    ],
    "maintainers": [
      "jashkenas <jashkenas@gmail.com>"
    ],
    "author": "Jeremy Ashkenas <jeremy@documentcloud.org>",
    "time": {
      "1.0.3": "2011-12-07T15:12:18.045Z",
      "1.0.4": "2011-12-07T15:12:18.045Z",
      "1.1.0": "2011-12-07T15:12:18.045Z",
      "1.1.1": "2011-12-07T15:12:18.045Z",
      "1.1.2": "2011-12-07T15:12:18.045Z",
      "1.1.3": "2011-12-07T15:12:18.045Z",
      "1.1.4": "2011-12-07T15:12:18.045Z",
      "1.1.5": "2011-12-07T15:12:18.045Z",
      "1.1.6": "2011-12-07T15:12:18.045Z",
      "1.1.7": "2011-12-07T15:12:18.045Z",
      "1.2.0": "2011-12-07T15:12:18.045Z",
      "1.2.1": "2011-12-07T15:12:18.045Z",
      "1.2.2": "2011-11-14T20:28:47.115Z",
      "1.2.3": "2011-12-07T15:12:18.045Z",
      "1.2.4": "2012-01-09T17:23:14.818Z",
      "1.3.0": "2012-01-11T16:41:38.459Z",
      "1.3.1": "2012-01-23T22:57:36.474Z",
      "1.3.2": "2012-04-09T18:38:14.345Z",
      "1.3.3": "2012-04-10T14:43:48.089Z",
      "1.4.0": "2012-09-27T22:02:55.267Z",
      "1.4.1": "2012-10-01T17:20:22.595Z",
      "1.4.2": "2012-10-07T03:05:02.986Z",
      "1.4.3": "2012-12-04T18:47:36.401Z",
      "1.4.4": "2013-01-30T02:12:42.969Z",
      "1.5.0": "2013-07-06T18:05:58.721Z",
      "1.5.1": "2013-07-08T08:38:10.051Z"
    },
    "repository": {
      "type": "git",
      "url": "git://github.com/jashkenas/underscore.git"
    },
    "users": {
      "vesln": true,
      "mvolkmann": true,
      "lancehunt": true,
      "mikl": true,
      "linus": true,
      "vasc": true,
      "bat": true,
      "dmalam": true,
      "mbrevoort": true,
      "danielr": true,
      "rsimoes": true,
      "thlorenz": true,
      "jharding": true,
      "tellnes": true,
      "fgribreau": true,
      "pid": true,
      "tylerstalder": true,
      "graemef": true,
      "gillesruppert": true,
      "travishorn": true,
      "m42am": true,
      "af": true,
      "bencevans": true,
      "Scryptonite": true,
      "konklone": true,
      "esp": true,
      "bryanburgers": true,
      "ehershey": true,
      "freethenation": true,
      "dannydulai": true,
      "megadrive": true,
      "lupomontero": true,
      "cj.nichols": true,
      "dbrockman": true,
      "maxmaximov": true,
      "hyqhyq_3": true,
      "zonetti": true,
      "cparker15": true,
      "lemulot": true,
      "mlowe": true,
      "chilts": true,
      "shanewholloway": true,
      "elgs": true,
      "eins78": true,
      "moonpyk": true
    },
    "_attachments": {
      "underscore-1.5.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 129,
        "digest": "md5-jEzAnjdRfcazh9PKAMa1kw==",
        "length": 22746,
        "stub": true
      },
      "underscore-1.5.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 126,
        "digest": "md5-JiqbW+htmCdz6yVjqaz44Q==",
        "length": 22907,
        "stub": true
      },
      "underscore-1.4.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 104,
        "digest": "md5-s/MrjCiRarwh7tZ9DX+RyA==",
        "length": 41763,
        "stub": true
      },
      "underscore-1.4.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 97,
        "digest": "md5-SbGx702k/T8yuag+j/VjCg==",
        "length": 62294,
        "stub": true
      },
      "underscore-1.4.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 91,
        "digest": "md5-vSAO6RpJID3UCJkAWMEIjg==",
        "length": 61836,
        "stub": true
      },
      "underscore-1.4.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 88,
        "digest": "md5-O72hIvWp7cVwkiA/2eF6rg==",
        "length": 61692,
        "stub": true
      },
      "underscore-1.4.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 85,
        "digest": "md5-26PeH3uwZlxMzfzwS4LmMg==",
        "length": 61579,
        "stub": true
      },
      "underscore-1.3.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 69,
        "digest": "md5-lRWlaQvCPiUt9CVTCTbZqQ==",
        "length": 58692,
        "stub": true
      },
      "underscore-1.3.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 66,
        "digest": "md5-yS3kcu5U31CO0KAJcBJ9yA==",
        "length": 58699,
        "stub": true
      },
      "underscore-1.3.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 60,
        "digest": "md5-Y4Z1Vvv7gZoZtJ9mTz0zSQ==",
        "length": 61440,
        "stub": true
      },
      "underscore-1.3.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 56,
        "digest": "md5-eIPIVGdK7Fzup3CU/AMO4g==",
        "length": 61440,
        "stub": true
      },
      "underscore-1.2.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 54,
        "digest": "md5-jCUzsaWc+tlE/lQNsuLQBA==",
        "length": 61440,
        "stub": true
      },
      "underscore-1.2.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 41,
        "digest": "md5-bP9hXPsRRpFAWlmUNIY+jA==",
        "length": 40960,
        "stub": true
      },
      "underscore-1.2.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 38,
        "digest": "md5-78/kFlhnF2WL94pdo/dfww==",
        "length": 40960,
        "stub": true
      },
      "underscore-1.2.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 35,
        "digest": "md5-gNzWgJppZn3xUj8LCQcJ+Q==",
        "length": 31879,
        "stub": true
      },
      "underscore-1.2.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 33,
        "digest": "md5-WYSTx/McoA2yFB6GmQ5KnA==",
        "length": 31310,
        "stub": true
      },
      "underscore-1.1.7.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 29,
        "digest": "md5-BxaNPc3JexY2qLOK3gDhgw==",
        "length": 29052,
        "stub": true
      },
      "underscore-1.1.6.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 27,
        "digest": "md5-U11VsMTDu6BEZDKJlZidTw==",
        "length": 25592,
        "stub": true
      },
      "underscore-1.1.5.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 25,
        "digest": "md5-rpLusI4XejA3uVROFAZg1A==",
        "length": 25038,
        "stub": true
      },
      "underscore-1.1.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 23,
        "digest": "md5-VrXC+bUYmxwzr2CQH4oq0w==",
        "length": 86233,
        "stub": true
      },
      "underscore-1.1.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 17,
        "digest": "md5-sdTV7zbtYfhAAanQLEcziw==",
        "length": 86107,
        "stub": true
      },
      "underscore-1.1.2.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 11,
        "digest": "md5-SSm/3w/usRqR+0SrSyCr8A==",
        "length": 85482,
        "stub": true
      },
      "underscore-1.1.1.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 9,
        "digest": "md5-UW8pTfPbkrRFTiwM6AFlVA==",
        "length": 85214,
        "stub": true
      },
      "underscore-1.1.0.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 7,
        "digest": "md5-YJcA44Oj1Dm2imfD7dHLag==",
        "length": 71266,
        "stub": true
      },
      "underscore-1.0.4.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 5,
        "digest": "md5-nRJu+q0L17u8DZqPxVvQKQ==",
        "length": 71018,
        "stub": true
      },
      "underscore-1.0.3.tgz": {
        "content_type": "application/octet-stream",
        "revpos": 3,
        "digest": "md5-pwgll4db7l4cg7fPTrgVTw==",
        "length": 70285,
        "stub": true
      }
    },
    "_cached": false,
    "_contentLength": 0,
    "homepage": "http://underscorejs.org",
    "keywords": [
      "util",
      "functional",
      "server",
      "client",
      "browser"
    ],
    "main": "underscore.js",
    "version": "1.5.1",
    "devDependencies": {
      "phantomjs": "1.9.0-1"
    },
    "scripts": {
      "test": "phantomjs test/vendor/runner.js test/index.html?noglobals=true"
    },
    "license": "MIT",
    "readme": "                       __\\n                      /\\\\ \\\\                                                         __\\n     __  __    ___    \\\\_\\\\ \\\\     __   _ __   ____    ___    ___   _ __    __       /\\\\_\\\\    ____\\n    /\\\\ \\\\/\\\\ \\\\ /' _ \`\\\\  /'_  \\\\  /'__\`\\\\/\\\\  __\\\\/ ,__\\\\  / ___\\\\ / __\`\\\\/\\\\  __\\\\/'__\`\\\\     \\\\/\\\\ \\\\  /',__\\\\\\n    \\\\ \\\\ \\\\_\\\\ \\\\/\\\\ \\\\/\\\\ \\\\/\\\\ \\\\ \\\\ \\\\/\\\\  __/\\\\ \\\\ \\\\//\\\\__, \`\\\\/\\\\ \\\\__//\\\\ \\\\ \\\\ \\\\ \\\\ \\\\//\\\\  __/  __  \\\\ \\\\ \\\\/\\\\__, \`\\\\\\n     \\\\ \\\\____/\\\\ \\\\_\\\\ \\\\_\\\\ \\\\___,_\\\\ \\\\____\\\\\\\\ \\\\_\\\\\\\\/\\\\____/\\\\ \\\\____\\\\ \\\\____/\\\\ \\\\_\\\\\\\\ \\\\____\\\\/\\\\_\\\\ _\\\\ \\\\ \\\\/\\\\____/\\n      \\\\/___/  \\\\/_/\\\\/_/\\\\/__,_ /\\\\/____/ \\\\/_/ \\\\/___/  \\\\/____/\\\\/___/  \\\\/_/ \\\\/____/\\\\/_//\\\\ \\\\_\\\\ \\\\/___/\\n                                                                                  \\\\ \\\\____/\\n                                                                                   \\\\/___/\\n\\nUnderscore.js is a utility-belt library for JavaScript that provides\\nsupport for the usual functional suspects (each, map, reduce, filter...)\\nwithout extending any core JavaScript objects.\\n\\nFor Docs, License, Tests, and pre-packed downloads, see:\\nhttp://underscorejs.org\\n\\nUnderscore is an open-sourced component of DocumentCloud:\\nhttps://github.com/documentcloud\\n\\nMany thanks to our contributors:\\nhttps://github.com/jashkenas/underscore/contributors\\n",
    "readmeFilename": "README.md",
    "bugs": {
      "url": "https://github.com/jashkenas/underscore/issues"
    },
    "dist": {
      "shasum": "d2bde817d176ffade894ab71458e682a14b86dc9",
      "tarball": "http://localhost:1331/underscore/-/underscore-1.5.1.tgz"
    },
    "_from": ".",
    "_npmVersion": "1.2.24",
    "_npmUser": "jashkenas <jashkenas@gmail.com>",
    "directories": {}
  }
]
`

exports[`test/lib/view.js TAP should log package info package with homepage > must match snapshot 1`] = `


[4m[1m[32morange[39m@[32m1.0.0[39m[22m[24m | [1m[31mProprietary[39m[22m | deps: [32mnone[39m | versions: [33m2[39m
[36mhttp://hm.orange.com[39m

dist
.tarball:[36mhttp://hm.orange.com/1.0.0.tgz[39m
.shasum:[33m123[39m
.integrity:[33m---[39m
.unpackedSize:[33m1[39m B

dist-tags:
[1m[32mlatest[39m[22m: 1.0.0
`

exports[`test/lib/view.js TAP should log package info package with license, bugs, repository and other fields > must match snapshot 1`] = `


[4m[1m[32mgreen[39m@[32m1.0.0[39m[22m[24m | [32mACME[39m | deps: [36m2[39m | versions: [33m2[39m

[1m[31mDEPRECATED[39m[22m ⚠️  - true

keywords:[33mcolors[39m, [33mgreen[39m, [33mcrayola[39m

bin:[33mgreen[39m

dist
.tarball:[36mhttp://hm.green.com/1.0.0.tgz[39m
.shasum:[33m123[39m
.integrity:[33m---[39m
.unpackedSize:[33m1[39m B

dependencies:
[33mred[39m: 1.0.0
[33myellow[39m: 1.0.0

dist-tags:
[1m[32mlatest[39m[22m: 1.0.0
`

exports[`test/lib/view.js TAP should log package info package with maintainers info as object > must match snapshot 1`] = `


[4m[1m[32mpink[39m@[32m1.0.0[39m[22m[24m | [1m[31mProprietary[39m[22m | deps: [32mnone[39m | versions: [33m2[39m

dist
.tarball:[36mhttp://hm.pink.com/1.0.0.tgz[39m
.shasum:[33m123[39m
.integrity:[33m---[39m
.unpackedSize:[33m1[39m B

dist-tags:
[1m[32mlatest[39m[22m: 1.0.0
`

exports[`test/lib/view.js TAP should log package info package with more than 25 deps > must match snapshot 1`] = `


[4m[1m[32mblack[39m@[32m1.0.0[39m[22m[24m | [1m[31mProprietary[39m[22m | deps: [36m25[39m | versions: [33m2[39m

dist
.tarball:[36mhttp://hm.black.com/1.0.0.tgz[39m
.shasum:[33m123[39m
.integrity:[33m---[39m
.unpackedSize:[33m1[39m B

dependencies:
[33m0[39m: 1.0.0
[33m10[39m: 1.0.0
[33m11[39m: 1.0.0
[33m12[39m: 1.0.0
[33m13[39m: 1.0.0
[33m14[39m: 1.0.0
[33m15[39m: 1.0.0
[33m16[39m: 1.0.0
[33m17[39m: 1.0.0
[33m18[39m: 1.0.0
[33m19[39m: 1.0.0
[33m1[39m: 1.0.0
[33m20[39m: 1.0.0
[33m21[39m: 1.0.0
[33m22[39m: 1.0.0
[33m23[39m: 1.0.0
[33m2[39m: 1.0.0
[33m3[39m: 1.0.0
[33m4[39m: 1.0.0
[33m5[39m: 1.0.0
[33m6[39m: 1.0.0
[33m7[39m: 1.0.0
[33m8[39m: 1.0.0
[33m9[39m: 1.0.0
(...and 1 more.)

dist-tags:
[1m[32mlatest[39m[22m: 1.0.0
`

exports[`test/lib/view.js TAP should log package info package with no modified time > must match snapshot 1`] = `


[4m[1m[32mcyan[39m@[32m1.0.0[39m[22m[24m | [1m[31mProprietary[39m[22m | deps: [32mnone[39m | versions: [33m2[39m

dist
.tarball:[36mhttp://hm.cyan.com/1.0.0.tgz[39m
.shasum:[33m123[39m
.integrity:[33m---[39m
.unpackedSize:[33m1[39m B

dist-tags:


published by [33mclaudia[39m <[36mclaudia@cyan.com[39m>
`

exports[`test/lib/view.js TAP should log package info package with no repo or homepage > must match snapshot 1`] = `


[4m[1m[32mblue[39m@[32mblue[39m[22m[24m | [1m[31mProprietary[39m[22m | deps: [32mnone[39m | versions: [33m2[39m

dist
.tarball:[36mhttp://hm.blue.com/1.0.0.tgz[39m
.shasum:[33m123[39m
.integrity:[33m---[39m
.unpackedSize:[33m1[39m B

dist-tags:


published [33ma year ago[39m
`
