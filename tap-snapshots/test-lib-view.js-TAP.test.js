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
  "claudia (http://c.yellow.com)",
  "isaacs (http://i.yellow.com)"
]
`

exports[`test/lib/view.js TAP should log info by field name nested field with brackets > must match snapshot 1`] = `

"Jeremy Ashkenas"
`

exports[`test/lib/view.js TAP should log info by field name readme > must match snapshot 1`] = `


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

exports[`test/lib/view.js TAP should log info by field name unknown nested field > must match snapshot 1`] = `


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

exports[`test/lib/view.js TAP should log package info package with homepage > must match snapshot 1`] = `


[4m[1m[32morange[39m@[32mundefined[39m[22m[24m | [1m[31mProprietary[39m[22m | deps: [32mnone[39m | versions: [33m2[39m
[36mhttp://hm.orange.com[39m

dist
.tarball:[36mundefined[39m
.shasum:[33mundefined[39m
.integrity:[33m---[39m
.unpackedSize:[33m1[39m B

dist-tags:
[1m[32m1.0.1[39m[22m: [object Object]
`

exports[`test/lib/view.js TAP should log package info package with license, bugs, repository and other fields > must match snapshot 1`] = `


[4m[1m[32mgreen[39m@[32mundefined[39m[22m[24m | [32mACME[39m | deps: [36m2[39m | versions: [33m2[39m

[1m[31mDEPRECATED[39m[22m ⚠️  - true

keywords:[33mcolors[39m, [33mgreen[39m, [33mcrayola[39m

bin:[33mgreen[39m

dist
.tarball:[36mundefined[39m
.shasum:[33mundefined[39m
.integrity:[33m---[39m
.unpackedSize:[33m1[39m B

dependencies:
[33mred[39m: [object Object]
[33myellow[39m: [object Object]

dist-tags:
[1m[32m1.0.1[39m[22m: [object Object]
`

exports[`test/lib/view.js TAP should log package info package with maintainers info as object > must match snapshot 1`] = `


[4m[1m[32mpink[39m@[32mundefined[39m[22m[24m | [1m[31mProprietary[39m[22m | deps: [32mnone[39m | versions: [33m2[39m

dist
.tarball:[36mundefined[39m
.shasum:[33mundefined[39m
.integrity:[33m---[39m
.unpackedSize:[33m1[39m B

dist-tags:
[1m[32m1.0.1[39m[22m: [object Object]
`

exports[`test/lib/view.js TAP should log package info package with more than 25 deps > must match snapshot 1`] = `


[4m[1m[32mblack[39m@[32mundefined[39m[22m[24m | [1m[31mProprietary[39m[22m | deps: [36m25[39m | versions: [33m2[39m

dist
.tarball:[36mundefined[39m
.shasum:[33mundefined[39m
.integrity:[33m---[39m
.unpackedSize:[33m1[39m B

dependencies:
[33m0[39m: [object Object]
[33m10[39m: [object Object]
[33m11[39m: [object Object]
[33m12[39m: [object Object]
[33m13[39m: [object Object]
[33m14[39m: [object Object]
[33m15[39m: [object Object]
[33m16[39m: [object Object]
[33m17[39m: [object Object]
[33m18[39m: [object Object]
[33m19[39m: [object Object]
[33m1[39m: [object Object]
[33m20[39m: [object Object]
[33m21[39m: [object Object]
[33m22[39m: [object Object]
[33m23[39m: [object Object]
[33m2[39m: [object Object]
[33m3[39m: [object Object]
[33m4[39m: [object Object]
[33m5[39m: [object Object]
[33m6[39m: [object Object]
[33m7[39m: [object Object]
[33m8[39m: [object Object]
[33m9[39m: [object Object]
(...and 1 more.)

dist-tags:
[1m[32m1.0.1[39m[22m: [object Object]
`

exports[`test/lib/view.js TAP should log package info package with no modified time > must match snapshot 1`] = `


[4m[1m[32mcyan[39m@[32mundefined[39m[22m[24m | [1m[31mProprietary[39m[22m | deps: [32mnone[39m | versions: [33m2[39m

dist
.tarball:[36mundefined[39m
.shasum:[33mundefined[39m

dist-tags:


published by [33mclaudia[39m <[36mclaudia@cyan.com[39m>
`

exports[`test/lib/view.js TAP should log package info package with no repo or homepage > must match snapshot 1`] = `


[4m[1m[32mblue[39m@[32mundefined[39m[22m[24m | [1m[31mProprietary[39m[22m | deps: [32mnone[39m | versions: [33m2[39m

dist
.tarball:[36mundefined[39m
.shasum:[33mundefined[39m

dist-tags:


published [33ma year ago[39m
`

exports[`test/lib/view.js TAP should log package info package with no versions > must match snapshot 1`] = `

`
