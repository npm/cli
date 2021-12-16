/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/vuln.js TAP basic vulnerability object tests > json after adding effect 1`] = `
{"name":"name","severity":"critical","isDirect":false,"via":[{"type":"advisory","source":420,"title":"borgsafalamash","name":"name","dependency":"name","severity":"critical","range":"1.x < 1.3"},{"type":"advisory","source":69,"title":"flerbygurrf","name":"name","dependency":"name","severity":"low","range":"2.x < 2.3.2 || 3.x <3.0.1"}],"effects":["another"],"range":"1.0.0 - 3.0.0","nodes":[],"fixAvailable":true}
`

exports[`test/vuln.js TAP basic vulnerability object tests > json formatted 1`] = `
{
  "name": "name",
  "severity": "critical",
  "isDirect": false,
  "via": [
    {
      "type": "advisory",
      "source": 420,
      "title": "borgsafalamash",
      "name": "name",
      "dependency": "name",
      "severity": "critical",
      "range": "1.x < 1.3"
    },
    {
      "type": "advisory",
      "source": 69,
      "title": "flerbygurrf",
      "name": "name",
      "dependency": "name",
      "severity": "low",
      "range": "2.x < 2.3.2 || 3.x <3.0.1"
    }
  ],
  "effects": [],
  "range": "1.0.0 - 3.0.0",
  "nodes": [],
  "fixAvailable": true
}
`

exports[`test/vuln.js TAP basic vulnerability object tests > json formatted after loading 1`] = `
{
  "name": "name",
  "severity": "critical",
  "isDirect": true,
  "via": [
    {
      "type": "advisory",
      "source": 420,
      "title": "borgsafalamash",
      "name": "name",
      "dependency": "name",
      "severity": "critical",
      "range": "1.x < 1.3"
    },
    {
      "type": "advisory",
      "source": 69,
      "title": "flerbygurrf",
      "name": "name",
      "dependency": "name",
      "severity": "low",
      "range": "2.x < 2.3.2 || 3.x <3.0.1"
    }
  ],
  "effects": [
    "another"
  ],
  "range": "1.0.0 - 3.0.0",
  "nodes": [
    "node_modules/thing"
  ],
  "fixAvailable": false
}
`

exports[`test/vuln.js TAP basic vulnerability object tests > json formatted metavuln 1`] = `
{
  "name": "another",
  "severity": "critical",
  "isDirect": false,
  "via": [
    "name",
    "name"
  ],
  "effects": [],
  "range": "1.0.0 - 2.0.1",
  "nodes": [],
  "fixAvailable": false
}
`
