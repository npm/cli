/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/can-place-dep.js TAP basic placement check tests basic placement of a dep, no conflicts or issues > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests basic placement with peers > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests can dedupe, cannot place peer > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests cannot place peer inside of dependent > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests conflict an existing dep that is newer, because no preferDedupe > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests conflict an existing dep that is newer, preferDedupe peerConflict > conflict children 1`] = `
Array [
  Object {
    "canPlace": Symbol(CONFLICT),
    "canPlaceSelf": Symbol(CONFLICT),
    "dep": Array [
      "a",
      "3.0.0",
    ],
    "edge": Array [
      "node_modules/b",
      "peer",
      "a",
      "3",
    ],
  },
]
`

exports[`test/can-place-dep.js TAP basic placement check tests conflict in root for nested dep > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests conflict in root for nested dep, no current > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests cycle of peers > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests cycle of peers hanging off entry node > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests do not keep existing dep that matches, but does not satisfy > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests existing peer set cannot be pushed deeper, but new dep set can > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests existing peer set cannot be pushed deeper, neither can new set > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests existing peer set cannot be pushed deeper, neither can new set, conflict on deep peer > conflict children 1`] = `
Array [
  Object {
    "canPlace": Symbol(CONFLICT),
    "canPlaceSelf": Symbol(OK),
    "dep": Array [
      "b",
      "2.2.2",
    ],
    "edge": Array [
      "node_modules/d",
      "peer",
      "b",
      "2",
    ],
  },
  Object {
    "canPlace": Symbol(CONFLICT),
    "canPlaceSelf": Symbol(CONFLICT),
    "dep": Array [
      "c",
      "2.2.2",
    ],
    "edge": Array [
      "node_modules/b",
      "peer",
      "c",
      "2",
    ],
  },
]
`

exports[`test/can-place-dep.js TAP basic placement check tests existing peer set cannot be pushed deeper, neither can new set, conflict on peer > conflict children 1`] = `
Array [
  Object {
    "canPlace": Symbol(CONFLICT),
    "canPlaceSelf": Symbol(OK),
    "dep": Array [
      "b",
      "2.2.2",
    ],
    "edge": Array [
      "node_modules/d",
      "peer",
      "b",
      "2",
    ],
  },
  Object {
    "canPlace": Symbol(CONFLICT),
    "canPlaceSelf": Symbol(CONFLICT),
    "dep": Array [
      "c",
      "2.2.2",
    ],
    "edge": Array [
      "node_modules/b",
      "peer",
      "c",
      "2",
    ],
  },
]
`

exports[`test/can-place-dep.js TAP basic placement check tests existing peer set cannot be pushed deeper, neither can new set, replacement satisfies > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests existing peer set which can be pushed deeper, conflict on peer > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests existing peer set which can be pushed deeper, no current > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests existing peer set which can be pushed deeper, with invalid current > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests existing peer set which can be pushed deeper, with valid current > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests have replacement for conflicted entry node > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests invalid shadowing > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests keep an existing dep that could dedupe, explicit request, preferDedupe > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests keep an existing dep that is older, but also works > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests keep an existing dep that matches > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests keep existing dep that matches, does not satisfy, but peerConflicted > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests nest peer set under dependent node > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests peer all the way down, conflict but not ours > conflict children 1`] = `
Array [
  Object {
    "canPlace": Symbol(CONFLICT),
    "canPlaceSelf": Symbol(CONFLICT),
    "dep": Array [
      "p",
      "1.0.0",
    ],
    "edge": Array [
      "node_modules/d",
      "peer",
      "p",
      "1",
    ],
  },
]
`

exports[`test/can-place-dep.js TAP basic placement check tests peer with peers > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests peers with peerConflicted edges in peerSet > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests peers with peerConflicted edges in peerSet from dependent > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests place nested > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests prod dep directly on conflicted peer, newer > conflict children 1`] = `
Array [
  Object {
    "canPlace": Symbol(CONFLICT),
    "canPlaceSelf": Symbol(CONFLICT),
    "dep": Array [
      "c",
      "2.0.0",
    ],
    "edge": Array [
      "node_modules/b",
      "peer",
      "c",
      "2",
    ],
  },
]
`

exports[`test/can-place-dep.js TAP basic placement check tests prod dep directly on conflicted peer, older > conflict children 1`] = `
Array [
  Object {
    "canPlace": Symbol(CONFLICT),
    "canPlaceSelf": Symbol(CONFLICT),
    "dep": Array [
      "c",
      "1.0.0",
    ],
    "edge": Array [
      "node_modules/b",
      "peer",
      "c",
      "1",
    ],
  },
]
`

exports[`test/can-place-dep.js TAP basic placement check tests replace an existing dep > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests replace an existing dep that could dedupe, explicit request > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests replace an existing dep that is newer, because preferDedupe > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests replace an existing dep that matches, explicit request > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests replacing existing peer set > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests replacing overlapping peer sets > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests replacing partially overlapping divergent peer sets > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests replacing partially overlapping peer sets, subset > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests replacing partially overlapping peer sets, superset > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests return OK because node had errors > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests return REPLACE because node had errors > conflict children 1`] = `
Array []
`

exports[`test/can-place-dep.js TAP basic placement check tests totally valid shadowing > conflict children 1`] = `
Array []
`
