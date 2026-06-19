/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/lib/utils/explain-dep-error.js TAP explain depth > strict scripts array, full depth 1`] = `
has-install-script@1.2.3
node_modules/has-install-script
  has-install-script@"^1.0.0" from the root project

nested-install-script@4.5.6
node_modules/parent/node_modules/nested-install-script
  nested-install-script@"^4.0.0" from parent@7.0.0
  node_modules/parent
    parent@"^7.0.0" from the root project
`

exports[`test/lib/utils/explain-dep-error.js TAP explain depth > transitive, depth 2 1`] = `
foo@"^9.9.9" from bar@1.0.0
node_modules/bar
  bar@"^1.0.0" from baz@2.0.0
  node_modules/baz
`

exports[`test/lib/utils/explain-dep-error.js TAP explain depth > transitive, full depth 1`] = `
foo@"^9.9.9" from bar@1.0.0
node_modules/bar
  bar@"^1.0.0" from baz@2.0.0
  node_modules/baz
    dev baz@"^2.0.0" from the root project
`

exports[`test/lib/utils/explain-dep-error.js TAP report directEdge > report file (no color) 1`] = `
# npm ETARGET error report

Could not resolve dependency:
foo@"^9.9.9" from the root project
`

exports[`test/lib/utils/explain-dep-error.js TAP report directEdge > report with color 1`] = `
Could not resolve dependency:
foo@"^9.9.9" from the root project
`

exports[`test/lib/utils/explain-dep-error.js TAP report directEdge > report with no color 1`] = `
Could not resolve dependency:
foo@"^9.9.9" from the root project
`

exports[`test/lib/utils/explain-dep-error.js TAP report incompatibleNode > report file (no color) 1`] = `
# npm EBADPLATFORM error report

This package is installed because:
fsevents@2.3.3
node_modules/fsevents
  fsevents@"^2.3.0" from chokidar@3.6.0
  node_modules/chokidar
    dev chokidar@"^3.0.0" from the root project
`

exports[`test/lib/utils/explain-dep-error.js TAP report incompatibleNode > report with color 1`] = `
This package is installed because:
fsevents@2.3.3[2m[22m
[2mnode_modules/fsevents[22m
  fsevents@"^2.3.0" from chokidar@3.6.0[2m[22m
  [2mnode_modules/chokidar[22m
    [34mdev[39m chokidar@"^3.0.0" from the root project
`

exports[`test/lib/utils/explain-dep-error.js TAP report incompatibleNode > report with no color 1`] = `
This package is installed because:
fsevents@2.3.3
node_modules/fsevents
  fsevents@"^2.3.0" from chokidar@3.6.0
  node_modules/chokidar
    dev chokidar@"^3.0.0" from the root project
`

exports[`test/lib/utils/explain-dep-error.js TAP report remoteEdge > report file (no color) 1`] = `
# npm EALLOWREMOTE error report

Could not resolve dependency:
sketchy@"github:foo/sketchy" from middle@3.1.4
node_modules/middle
  middle@"^3.0.0" from the root project
`

exports[`test/lib/utils/explain-dep-error.js TAP report remoteEdge > report with color 1`] = `
Could not resolve dependency:
sketchy@"github:foo/sketchy" from middle@3.1.4[2m[22m
[2mnode_modules/middle[22m
  middle@"^3.0.0" from the root project
`

exports[`test/lib/utils/explain-dep-error.js TAP report remoteEdge > report with no color 1`] = `
Could not resolve dependency:
sketchy@"github:foo/sketchy" from middle@3.1.4
node_modules/middle
  middle@"^3.0.0" from the root project
`

exports[`test/lib/utils/explain-dep-error.js TAP report strictScripts > report file (no color) 1`] = `
# npm ESTRICTALLOWSCRIPTS error report

These packages are installed because:
has-install-script@1.2.3
node_modules/has-install-script
  has-install-script@"^1.0.0" from the root project

nested-install-script@4.5.6
node_modules/parent/node_modules/nested-install-script
  nested-install-script@"^4.0.0" from parent@7.0.0
  node_modules/parent
    parent@"^7.0.0" from the root project
`

exports[`test/lib/utils/explain-dep-error.js TAP report strictScripts > report with color 1`] = `
These packages are installed because:
has-install-script@1.2.3[2m[22m
[2mnode_modules/has-install-script[22m
  has-install-script@"^1.0.0" from the root project

nested-install-script@4.5.6[2m[22m
[2mnode_modules/parent/node_modules/nested-install-script[22m
  nested-install-script@"^4.0.0" from parent@7.0.0[2m[22m
  [2mnode_modules/parent[22m
    parent@"^7.0.0" from the root project
`

exports[`test/lib/utils/explain-dep-error.js TAP report strictScripts > report with no color 1`] = `
These packages are installed because:
has-install-script@1.2.3
node_modules/has-install-script
  has-install-script@"^1.0.0" from the root project

nested-install-script@4.5.6
node_modules/parent/node_modules/nested-install-script
  nested-install-script@"^4.0.0" from parent@7.0.0
  node_modules/parent
    parent@"^7.0.0" from the root project
`

exports[`test/lib/utils/explain-dep-error.js TAP report transitiveEdge > report file (no color) 1`] = `
# npm ETARGET error report

Could not resolve dependency:
foo@"^9.9.9" from bar@1.0.0
node_modules/bar
  bar@"^1.0.0" from baz@2.0.0
  node_modules/baz
    dev baz@"^2.0.0" from the root project
`

exports[`test/lib/utils/explain-dep-error.js TAP report transitiveEdge > report with color 1`] = `
Could not resolve dependency:
foo@"^9.9.9" from bar@1.0.0[2m[22m
[2mnode_modules/bar[22m
  bar@"^1.0.0" from baz@2.0.0[2m[22m
  [2mnode_modules/baz[22m
    [34mdev[39m baz@"^2.0.0" from the root project
`

exports[`test/lib/utils/explain-dep-error.js TAP report transitiveEdge > report with no color 1`] = `
Could not resolve dependency:
foo@"^9.9.9" from bar@1.0.0
node_modules/bar
  bar@"^1.0.0" from baz@2.0.0
  node_modules/baz
    dev baz@"^2.0.0" from the root project
`
