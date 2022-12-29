/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/lib/commands/init.js TAP displays output  > displays helper info 1`] = `

`

exports[`test/lib/commands/init.js TAP displays output  > displays helper info 2`] = `

`

exports[`test/lib/commands/init.js TAP workspaces no args -- yes > should print helper info 1`] = `

added 1 package in {TIME}
`

exports[`test/lib/commands/init.js TAP workspaces no args -- yes > should reify tree on init ws complete 1`] = `
{
  "name": "top-level",
  "lockfileVersion": 3,
  "requires": true,
  "packages": {
    "": {
      "name": "top-level",
      "workspaces": [
        "a"
      ]
    },
    "a": {
      "version": "1.0.0",
      "license": "ISC",
      "devDependencies": {}
    },
    "node_modules/a": {
      "resolved": "a",
      "link": true
    }
  }
}

`
