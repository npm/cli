/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/lib/commands/doctor.js TAP all clear > logs 1`] = `
Object {
  "error": Array [],
  "info": Array [
    "doctor Running checkup",
    "doctor Pinging registry",
    "doctor Getting npm package information",
    "doctor Getting Node.js release information",
    "doctor Finding git in your PATH",
    "doctor getBinPath Finding npm global bin in your PATH",
    "doctor verifyCachedFiles Verifying the npm cache",
    String(
      doctor verifyCachedFiles Verification complete. Stats: {
      doctor   "badContentCount": 0,
      doctor   "reclaimedCount": 0,
      doctor   "missingContent": 0,
      doctor   "verifiedContent": 0
      doctor }
    ),
  ],
  "warn": Array [],
}
`

exports[`test/lib/commands/doctor.js TAP all clear > output 1`] = `
Check                               Value   Recommendation/Notes
npm ping                            ok       
npm -v                              ok      current: v1.0.0, latest: v1.0.0
node -v                             ok      current: v1.0.0, recommended: v1.0.0
npm config get registry             ok      using default registry (https://registry.npmjs.org/)
git executable in PATH              ok      /path/to/git
global bin folder in PATH           ok      {CWD}/global/bin
Perms check on cached files         ok       
Perms check on local node_modules   ok       
Perms check on global node_modules  ok       
Perms check on local bin folder     ok       
Perms check on global bin folder    ok       
Verify cache contents               ok      verified 0 tarballs
`

exports[`test/lib/commands/doctor.js TAP all clear in color > everything is ok in color 1`] = `
[4mCheck[24m                               [4mValue[24m   [4mRecommendation/Notes[24m
npm ping                            [32mok[39m       
npm -v                              [32mok[39m      current: v1.0.0, latest: v1.0.0
node -v                             [32mok[39m      current: v1.0.0, recommended: v1.0.0
npm config get registry             [32mok[39m      using default registry (https://registry.npmjs.org/)
git executable in PATH              [32mok[39m      /path/to/git
global bin folder in PATH           [32mok[39m      {CWD}/global/bin
Perms check on cached files         [32mok[39m       
Perms check on local node_modules   [32mok[39m       
Perms check on global node_modules  [32mok[39m       
Perms check on local bin folder     [32mok[39m       
Perms check on global bin folder    [32mok[39m       
Verify cache contents               [32mok[39m      verified 0 tarballs
`

exports[`test/lib/commands/doctor.js TAP all clear in color > logs 1`] = `
Object {
  "error": Array [],
  "info": Array [
    "/u001b[94mdoctor/u001b[39m Running checkup",
    "/u001b[94mdoctor/u001b[39m Pinging registry",
    "/u001b[94mdoctor/u001b[39m Getting npm package information",
    "/u001b[94mdoctor/u001b[39m Getting Node.js release information",
    "/u001b[94mdoctor/u001b[39m Finding git in your PATH",
    "/u001b[94mdoctor/u001b[39m getBinPath Finding npm global bin in your PATH",
    "/u001b[94mdoctor/u001b[39m verifyCachedFiles Verifying the npm cache",
    String(
      /u001b[94mdoctor/u001b[39m verifyCachedFiles Verification complete. Stats: {
      /u001b[94mdoctor/u001b[39m   "badContentCount": 0,
      /u001b[94mdoctor/u001b[39m   "reclaimedCount": 0,
      /u001b[94mdoctor/u001b[39m   "missingContent": 0,
      /u001b[94mdoctor/u001b[39m   "verifiedContent": 0
      /u001b[94mdoctor/u001b[39m }
    ),
  ],
  "warn": Array [],
}
`

exports[`test/lib/commands/doctor.js TAP bad proxy > logs 1`] = `
Object {
  "error": Array [],
  "info": Array [
    "doctor Running checkup",
    "doctor Pinging registry",
    "doctor Getting npm package information",
    "doctor Getting Node.js release information",
    "doctor Finding git in your PATH",
    "doctor getBinPath Finding npm global bin in your PATH",
    "doctor verifyCachedFiles Verifying the npm cache",
    String(
      doctor verifyCachedFiles Verification complete. Stats: {
      doctor   "badContentCount": 0,
      doctor   "reclaimedCount": 0,
      doctor   "missingContent": 0,
      doctor   "verifiedContent": 0
      doctor }
    ),
  ],
  "warn": Array [],
}
`

exports[`test/lib/commands/doctor.js TAP bad proxy > output 1`] = `
Check                               Value   Recommendation/Notes
npm ping                            not ok  Invalid protocol \`ssh:\` connecting to proxy \`npmjs.org\`
npm -v                              not ok  Error: Invalid protocol \`ssh:\` connecting to proxy \`npmjs.org\`
node -v                             not ok  Error: Invalid protocol \`ssh:\` connecting to proxy \`npmjs.org\`
npm config get registry             ok      using default registry (https://registry.npmjs.org/)
git executable in PATH              ok      /path/to/git
global bin folder in PATH           ok      {CWD}/global/bin
Perms check on cached files         ok       
Perms check on local node_modules   ok       
Perms check on global node_modules  ok       
Perms check on local bin folder     ok       
Perms check on global bin folder    ok       
Verify cache contents               ok      verified 0 tarballs
`

exports[`test/lib/commands/doctor.js TAP cacache badContent > corrupted cache content 1`] = `
Check                               Value   Recommendation/Notes
npm ping                            ok       
npm -v                              ok      current: v1.0.0, latest: v1.0.0
node -v                             ok      current: v1.0.0, recommended: v1.0.0
npm config get registry             ok      using default registry (https://registry.npmjs.org/)
git executable in PATH              ok      /path/to/git
global bin folder in PATH           ok      {CWD}/global/bin
Perms check on cached files         ok       
Perms check on local node_modules   ok       
Perms check on global node_modules  ok       
Perms check on local bin folder     ok       
Perms check on global bin folder    ok       
Verify cache contents               ok      verified 2 tarballs
`

exports[`test/lib/commands/doctor.js TAP cacache badContent > logs 1`] = `
Object {
  "error": Array [],
  "info": Array [
    "doctor Running checkup",
    "doctor Pinging registry",
    "doctor Getting npm package information",
    "doctor Getting Node.js release information",
    "doctor Finding git in your PATH",
    "doctor getBinPath Finding npm global bin in your PATH",
    "doctor verifyCachedFiles Verifying the npm cache",
    String(
      doctor verifyCachedFiles Verification complete. Stats: {
      doctor   "badContentCount": 1,
      doctor   "reclaimedCount": 0,
      doctor   "missingContent": 0,
      doctor   "verifiedContent": 2
      doctor }
    ),
  ],
  "warn": Array [
    "doctor verifyCachedFiles Corrupted content removed: 1",
    "doctor verifyCachedFiles Cache issues have been fixed",
  ],
}
`

exports[`test/lib/commands/doctor.js TAP cacache missingContent > logs 1`] = `
Object {
  "error": Array [],
  "info": Array [
    "doctor Running checkup",
    "doctor Pinging registry",
    "doctor Getting npm package information",
    "doctor Getting Node.js release information",
    "doctor Finding git in your PATH",
    "doctor getBinPath Finding npm global bin in your PATH",
    "doctor verifyCachedFiles Verifying the npm cache",
    String(
      doctor verifyCachedFiles Verification complete. Stats: {
      doctor   "badContentCount": 0,
      doctor   "reclaimedCount": 0,
      doctor   "missingContent": 1,
      doctor   "verifiedContent": 2
      doctor }
    ),
  ],
  "warn": Array [
    "doctor verifyCachedFiles Missing content: 1",
    "doctor verifyCachedFiles Cache issues have been fixed",
  ],
}
`

exports[`test/lib/commands/doctor.js TAP cacache missingContent > missing content 1`] = `
Check                               Value   Recommendation/Notes
npm ping                            ok       
npm -v                              ok      current: v1.0.0, latest: v1.0.0
node -v                             ok      current: v1.0.0, recommended: v1.0.0
npm config get registry             ok      using default registry (https://registry.npmjs.org/)
git executable in PATH              ok      /path/to/git
global bin folder in PATH           ok      {CWD}/global/bin
Perms check on cached files         ok       
Perms check on local node_modules   ok       
Perms check on global node_modules  ok       
Perms check on local bin folder     ok       
Perms check on global bin folder    ok       
Verify cache contents               ok      verified 2 tarballs
`

exports[`test/lib/commands/doctor.js TAP cacache reclaimedCount > content garbage collected 1`] = `
Check                               Value   Recommendation/Notes
npm ping                            ok       
npm -v                              ok      current: v1.0.0, latest: v1.0.0
node -v                             ok      current: v1.0.0, recommended: v1.0.0
npm config get registry             ok      using default registry (https://registry.npmjs.org/)
git executable in PATH              ok      /path/to/git
global bin folder in PATH           ok      {CWD}/global/bin
Perms check on cached files         ok       
Perms check on local node_modules   ok       
Perms check on global node_modules  ok       
Perms check on local bin folder     ok       
Perms check on global bin folder    ok       
Verify cache contents               ok      verified 2 tarballs
`

exports[`test/lib/commands/doctor.js TAP cacache reclaimedCount > logs 1`] = `
Object {
  "error": Array [],
  "info": Array [
    "doctor Running checkup",
    "doctor Pinging registry",
    "doctor Getting npm package information",
    "doctor Getting Node.js release information",
    "doctor Finding git in your PATH",
    "doctor getBinPath Finding npm global bin in your PATH",
    "doctor verifyCachedFiles Verifying the npm cache",
    String(
      doctor verifyCachedFiles Verification complete. Stats: {
      doctor   "badContentCount": 0,
      doctor   "reclaimedCount": 1,
      doctor   "missingContent": 0,
      doctor   "verifiedContent": 2
      doctor }
    ),
  ],
  "warn": Array [
    "doctor verifyCachedFiles Content garbage-collected: 1 (undefined bytes)",
    "doctor verifyCachedFiles Cache issues have been fixed",
  ],
}
`

exports[`test/lib/commands/doctor.js TAP discrete checks cache > logs 1`] = `
Object {
  "error": Array [],
  "info": Array [
    "doctor Running checkup",
    "doctor verifyCachedFiles Verifying the npm cache",
    String(
      doctor verifyCachedFiles Verification complete. Stats: {
      doctor   "badContentCount": 0,
      doctor   "reclaimedCount": 0,
      doctor   "missingContent": 0,
      doctor   "verifiedContent": 0
      doctor }
    ),
  ],
  "warn": Array [],
}
`

exports[`test/lib/commands/doctor.js TAP discrete checks cache > output 1`] = `
Check                        Value   Recommendation/Notes
Perms check on cached files  ok       
Verify cache contents        ok      verified 0 tarballs
`

exports[`test/lib/commands/doctor.js TAP discrete checks git > logs 1`] = `
Object {
  "error": Array [],
  "info": Array [
    "doctor Running checkup",
  ],
  "warn": Array [],
}
`

exports[`test/lib/commands/doctor.js TAP discrete checks git > output 1`] = `
Check  Value   Recommendation/Notes
`

exports[`test/lib/commands/doctor.js TAP discrete checks invalid environment > logs 1`] = `
Object {
  "error": Array [],
  "info": Array [
    "doctor Running checkup",
    "doctor Finding git in your PATH",
    "doctor getBinPath Finding npm global bin in your PATH",
  ],
  "warn": Array [],
}
`

exports[`test/lib/commands/doctor.js TAP discrete checks invalid environment > output 1`] = `
Check                      Value   Recommendation/Notes
git executable in PATH     ok      /path/to/git
global bin folder in PATH  not ok  Error: Add {CWD}/global/bin to your $PATH
`

exports[`test/lib/commands/doctor.js TAP discrete checks permissions - not windows > logs 1`] = `
Object {
  "error": Array [],
  "info": Array [
    "doctor Running checkup",
  ],
  "warn": Array [],
}
`

exports[`test/lib/commands/doctor.js TAP discrete checks permissions - not windows > output 1`] = `
Check                               Value   Recommendation/Notes
Perms check on cached files         ok       
Perms check on local node_modules   ok       
Perms check on global node_modules  ok       
Perms check on local bin folder     ok       
Perms check on global bin folder    ok       
`

exports[`test/lib/commands/doctor.js TAP discrete checks permissions - windows > logs 1`] = `
Object {
  "error": Array [],
  "info": Array [
    "doctor Running checkup",
  ],
  "warn": Array [],
}
`

exports[`test/lib/commands/doctor.js TAP discrete checks permissions - windows > output 1`] = `
Check  Value   Recommendation/Notes
`

exports[`test/lib/commands/doctor.js TAP discrete checks ping > logs 1`] = `
Object {
  "error": Array [],
  "info": Array [
    "doctor Running checkup",
    "doctor Pinging registry",
  ],
  "warn": Array [],
}
`

exports[`test/lib/commands/doctor.js TAP discrete checks ping > output 1`] = `
Check     Value   Recommendation/Notes
npm ping  ok       
`

exports[`test/lib/commands/doctor.js TAP discrete checks registry > logs 1`] = `
Object {
  "error": Array [],
  "info": Array [
    "doctor Running checkup",
    "doctor Pinging registry",
  ],
  "warn": Array [],
}
`

exports[`test/lib/commands/doctor.js TAP discrete checks registry > output 1`] = `
Check                    Value   Recommendation/Notes
npm ping                 ok       
npm config get registry  ok      using default registry (https://registry.npmjs.org/)
`

exports[`test/lib/commands/doctor.js TAP discrete checks versions > logs 1`] = `
Object {
  "error": Array [],
  "info": Array [
    "doctor Running checkup",
    "doctor Getting npm package information",
    "doctor Getting Node.js release information",
  ],
  "warn": Array [],
}
`

exports[`test/lib/commands/doctor.js TAP discrete checks versions > output 1`] = `
Check    Value   Recommendation/Notes
npm -v   ok      current: v1.0.0, latest: v1.0.0
node -v  ok      current: v1.0.0, recommended: v1.0.0
`

exports[`test/lib/commands/doctor.js TAP error reading directory > logs 1`] = `
Object {
  "error": Array [],
  "info": Array [
    "doctor Running checkup",
    "doctor Pinging registry",
    "doctor Getting npm package information",
    "doctor Getting Node.js release information",
    "doctor Finding git in your PATH",
    "doctor getBinPath Finding npm global bin in your PATH",
    "doctor verifyCachedFiles Verifying the npm cache",
    String(
      doctor verifyCachedFiles Verification complete. Stats: {
      doctor   "badContentCount": 0,
      doctor   "reclaimedCount": 0,
      doctor   "missingContent": 0,
      doctor   "verifiedContent": 0
      doctor }
    ),
  ],
  "warn": Array [
    "doctor checkFilesPermission error reading directory {CWD}/cache",
    "doctor checkFilesPermission error reading directory {CWD}/prefix/node_modules",
    "doctor checkFilesPermission error reading directory {CWD}/global/node_modules",
    "doctor checkFilesPermission error reading directory {CWD}/prefix/node_modules/.bin",
    "doctor checkFilesPermission error reading directory {CWD}/global/bin",
  ],
}
`

exports[`test/lib/commands/doctor.js TAP error reading directory > readdir error 1`] = `
Check                               Value   Recommendation/Notes
npm ping                            ok       
npm -v                              ok      current: v1.0.0, latest: v1.0.0
node -v                             ok      current: v1.0.0, recommended: v1.0.0
npm config get registry             ok      using default registry (https://registry.npmjs.org/)
git executable in PATH              ok      /path/to/git
global bin folder in PATH           ok      {CWD}/global/bin
Perms check on cached files         not ok  Check the permissions of files in {CWD}/cache (should be owned by current user)
Perms check on local node_modules   not ok  Check the permissions of files in {CWD}/prefix/node_modules (should be owned by current user)
Perms check on global node_modules  not ok  Check the permissions of files in {CWD}/global/node_modules
Perms check on local bin folder     not ok  Check the permissions of files in {CWD}/prefix/node_modules/.bin
Perms check on global bin folder    not ok  Check the permissions of files in {CWD}/global/bin
Verify cache contents               ok      verified 0 tarballs
`

exports[`test/lib/commands/doctor.js TAP incorrect owner > incorrect owner 1`] = `
Check                               Value   Recommendation/Notes
npm ping                            ok       
npm -v                              ok      current: v1.0.0, latest: v1.0.0
node -v                             ok      current: v1.0.0, recommended: v1.0.0
npm config get registry             ok      using default registry (https://registry.npmjs.org/)
git executable in PATH              ok      /path/to/git
global bin folder in PATH           ok      {CWD}/global/bin
Perms check on cached files         not ok  Check the permissions of files in {CWD}/cache (should be owned by current user)
Perms check on local node_modules   ok       
Perms check on global node_modules  ok       
Perms check on local bin folder     ok       
Perms check on global bin folder    ok       
Verify cache contents               ok      verified 0 tarballs
`

exports[`test/lib/commands/doctor.js TAP incorrect owner > logs 1`] = `
Object {
  "error": Array [],
  "info": Array [
    "doctor Running checkup",
    "doctor Pinging registry",
    "doctor Getting npm package information",
    "doctor Getting Node.js release information",
    "doctor Finding git in your PATH",
    "doctor getBinPath Finding npm global bin in your PATH",
    "doctor verifyCachedFiles Verifying the npm cache",
    String(
      doctor verifyCachedFiles Verification complete. Stats: {
      doctor   "badContentCount": 0,
      doctor   "reclaimedCount": 0,
      doctor   "missingContent": 0,
      doctor   "verifiedContent": 0
      doctor }
    ),
  ],
  "warn": Array [
    "doctor checkFilesPermission should be owner of {CWD}/cache/_cacache",
  ],
}
`

exports[`test/lib/commands/doctor.js TAP incorrect permissions > incorrect owner 1`] = `
Check                               Value   Recommendation/Notes
npm ping                            ok       
npm -v                              ok      current: v1.0.0, latest: v1.0.0
node -v                             ok      current: v1.0.0, recommended: v1.0.0
npm config get registry             ok      using default registry (https://registry.npmjs.org/)
git executable in PATH              ok      /path/to/git
global bin folder in PATH           ok      {CWD}/global/bin
Perms check on cached files         not ok  Check the permissions of files in {CWD}/cache (should be owned by current user)
Perms check on local node_modules   not ok  Check the permissions of files in {CWD}/prefix/node_modules (should be owned by current user)
Perms check on global node_modules  not ok  Check the permissions of files in {CWD}/global/node_modules
Perms check on local bin folder     not ok  Check the permissions of files in {CWD}/prefix/node_modules/.bin
Perms check on global bin folder    not ok  Check the permissions of files in {CWD}/global/bin
Verify cache contents               ok      verified 0 tarballs
`

exports[`test/lib/commands/doctor.js TAP incorrect permissions > logs 1`] = `
Object {
  "error": Array [
    "doctor checkFilesPermission Missing permissions on {CWD}/cache (expect: readable)",
    "doctor checkFilesPermission Missing permissions on {CWD}/prefix/node_modules (expect: readable, writable)",
    "doctor checkFilesPermission Missing permissions on {CWD}/global/node_modules (expect: readable)",
    "doctor checkFilesPermission Missing permissions on {CWD}/prefix/node_modules/.bin (expect: readable, writable, executable)",
    "doctor checkFilesPermission Missing permissions on {CWD}/global/bin (expect: executable)",
  ],
  "info": Array [
    "doctor Running checkup",
    "doctor Pinging registry",
    "doctor Getting npm package information",
    "doctor Getting Node.js release information",
    "doctor Finding git in your PATH",
    "doctor getBinPath Finding npm global bin in your PATH",
    "doctor verifyCachedFiles Verifying the npm cache",
    String(
      doctor verifyCachedFiles Verification complete. Stats: {
      doctor   "badContentCount": 0,
      doctor   "reclaimedCount": 0,
      doctor   "missingContent": 0,
      doctor   "verifiedContent": 0
      doctor }
    ),
  ],
  "warn": Array [],
}
`

exports[`test/lib/commands/doctor.js TAP missing git > logs 1`] = `
Object {
  "error": Array [],
  "info": Array [
    "doctor Running checkup",
    "doctor Pinging registry",
    "doctor Getting npm package information",
    "doctor Getting Node.js release information",
    "doctor Finding git in your PATH",
    "doctor getBinPath Finding npm global bin in your PATH",
    "doctor verifyCachedFiles Verifying the npm cache",
    String(
      doctor verifyCachedFiles Verification complete. Stats: {
      doctor   "badContentCount": 0,
      doctor   "reclaimedCount": 0,
      doctor   "missingContent": 0,
      doctor   "verifiedContent": 0
      doctor }
    ),
  ],
  "warn": Array [
    String(
      doctor getGitPath Error: test error
      doctor     at which ({CWD}/{TESTDIR}/doctor.js:313:15)
      doctor     at Doctor.getGitPath ({CWD}/lib/commands/doctor.js:300:18)
      doctor     at Doctor.exec ({CWD}/lib/commands/doctor.js:130:40)
      doctor     at processTicksAndRejections (node:internal/process/task_queues:95:5)
      doctor     at MockNpm.exec ({CWD}/test/fixtures/mock-npm.js:80:26)
    ),
  ],
}
`

exports[`test/lib/commands/doctor.js TAP missing git > missing git 1`] = `
Check                               Value   Recommendation/Notes
npm ping                            ok       
npm -v                              ok      current: v1.0.0, latest: v1.0.0
node -v                             ok      current: v1.0.0, recommended: v1.0.0
npm config get registry             ok      using default registry (https://registry.npmjs.org/)
git executable in PATH              not ok  Error: Install git and ensure it's in your PATH.
global bin folder in PATH           ok      {CWD}/global/bin
Perms check on cached files         ok       
Perms check on local node_modules   ok       
Perms check on global node_modules  ok       
Perms check on local bin folder     ok       
Perms check on global bin folder    ok       
Verify cache contents               ok      verified 0 tarballs
`

exports[`test/lib/commands/doctor.js TAP missing global directories > logs 1`] = `
Object {
  "error": Array [],
  "info": Array [
    "doctor Running checkup",
    "doctor Pinging registry",
    "doctor Getting npm package information",
    "doctor Getting Node.js release information",
    "doctor Finding git in your PATH",
    "doctor getBinPath Finding npm global bin in your PATH",
    "doctor verifyCachedFiles Verifying the npm cache",
    String(
      doctor verifyCachedFiles Verification complete. Stats: {
      doctor   "badContentCount": 0,
      doctor   "reclaimedCount": 0,
      doctor   "missingContent": 0,
      doctor   "verifiedContent": 0
      doctor }
    ),
  ],
  "warn": Array [
    "doctor checkFilesPermission error getting info for {CWD}/global/node_modules",
    "doctor checkFilesPermission error getting info for {CWD}/global/bin",
  ],
}
`

exports[`test/lib/commands/doctor.js TAP missing global directories > missing global directories 1`] = `
Check                               Value   Recommendation/Notes
npm ping                            ok       
npm -v                              ok      current: v1.0.0, latest: v1.0.0
node -v                             ok      current: v1.0.0, recommended: v1.0.0
npm config get registry             ok      using default registry (https://registry.npmjs.org/)
git executable in PATH              ok      /path/to/git
global bin folder in PATH           ok      {CWD}/global/bin
Perms check on cached files         ok       
Perms check on local node_modules   ok       
Perms check on global node_modules  not ok  Check the permissions of files in {CWD}/global/node_modules
Perms check on local bin folder     ok       
Perms check on global bin folder    not ok  Check the permissions of files in {CWD}/global/bin
Verify cache contents               ok      verified 0 tarballs
`

exports[`test/lib/commands/doctor.js TAP missing local node_modules > logs 1`] = `
Object {
  "error": Array [],
  "info": Array [
    "doctor Running checkup",
    "doctor Pinging registry",
    "doctor Getting npm package information",
    "doctor Getting Node.js release information",
    "doctor Finding git in your PATH",
    "doctor getBinPath Finding npm global bin in your PATH",
    "doctor verifyCachedFiles Verifying the npm cache",
    String(
      doctor verifyCachedFiles Verification complete. Stats: {
      doctor   "badContentCount": 0,
      doctor   "reclaimedCount": 0,
      doctor   "missingContent": 0,
      doctor   "verifiedContent": 0
      doctor }
    ),
  ],
  "warn": Array [],
}
`

exports[`test/lib/commands/doctor.js TAP missing local node_modules > missing local node_modules 1`] = `
Check                               Value   Recommendation/Notes
npm ping                            ok       
npm -v                              ok      current: v1.0.0, latest: v1.0.0
node -v                             ok      current: v1.0.0, recommended: v1.0.0
npm config get registry             ok      using default registry (https://registry.npmjs.org/)
git executable in PATH              ok      /path/to/git
global bin folder in PATH           ok      {CWD}/global/bin
Perms check on cached files         ok       
Perms check on local node_modules   ok       
Perms check on global node_modules  ok       
Perms check on local bin folder     ok       
Perms check on global bin folder    ok       
Verify cache contents               ok      verified 0 tarballs
`

exports[`test/lib/commands/doctor.js TAP node out of date - current > logs 1`] = `
Object {
  "error": Array [],
  "info": Array [
    "doctor Running checkup",
    "doctor Pinging registry",
    "doctor Getting npm package information",
    "doctor Getting Node.js release information",
    "doctor Finding git in your PATH",
    "doctor getBinPath Finding npm global bin in your PATH",
    "doctor verifyCachedFiles Verifying the npm cache",
    String(
      doctor verifyCachedFiles Verification complete. Stats: {
      doctor   "badContentCount": 0,
      doctor   "reclaimedCount": 0,
      doctor   "missingContent": 0,
      doctor   "verifiedContent": 0
      doctor }
    ),
  ],
  "warn": Array [],
}
`

exports[`test/lib/commands/doctor.js TAP node out of date - current > node is out of date 1`] = `
Check                               Value   Recommendation/Notes
npm ping                            ok       
npm -v                              ok      current: v1.0.0, latest: v1.0.0
node -v                             not ok  Use node v2.0.1 (current: v2.0.0)
npm config get registry             ok      using default registry (https://registry.npmjs.org/)
git executable in PATH              ok      /path/to/git
global bin folder in PATH           ok      {CWD}/global/bin
Perms check on cached files         ok       
Perms check on local node_modules   ok       
Perms check on global node_modules  ok       
Perms check on local bin folder     ok       
Perms check on global bin folder    ok       
Verify cache contents               ok      verified 0 tarballs
`

exports[`test/lib/commands/doctor.js TAP node out of date - lts > logs 1`] = `
Object {
  "error": Array [],
  "info": Array [
    "doctor Running checkup",
    "doctor Pinging registry",
    "doctor Getting npm package information",
    "doctor Getting Node.js release information",
    "doctor Finding git in your PATH",
    "doctor getBinPath Finding npm global bin in your PATH",
    "doctor verifyCachedFiles Verifying the npm cache",
    String(
      doctor verifyCachedFiles Verification complete. Stats: {
      doctor   "badContentCount": 0,
      doctor   "reclaimedCount": 0,
      doctor   "missingContent": 0,
      doctor   "verifiedContent": 0
      doctor }
    ),
  ],
  "warn": Array [],
}
`

exports[`test/lib/commands/doctor.js TAP node out of date - lts > node is out of date 1`] = `
Check                               Value   Recommendation/Notes
npm ping                            ok       
npm -v                              ok      current: v1.0.0, latest: v1.0.0
node -v                             not ok  Use node v1.0.0 (current: v0.0.1)
npm config get registry             ok      using default registry (https://registry.npmjs.org/)
git executable in PATH              ok      /path/to/git
global bin folder in PATH           ok      {CWD}/global/bin
Perms check on cached files         ok       
Perms check on local node_modules   ok       
Perms check on global node_modules  ok       
Perms check on local bin folder     ok       
Perms check on global bin folder    ok       
Verify cache contents               ok      verified 0 tarballs
`

exports[`test/lib/commands/doctor.js TAP non-default registry > logs 1`] = `
Object {
  "error": Array [],
  "info": Array [
    "doctor Running checkup",
    "doctor Pinging registry",
    "doctor Getting npm package information",
    "doctor Getting Node.js release information",
    "doctor Finding git in your PATH",
    "doctor getBinPath Finding npm global bin in your PATH",
    "doctor verifyCachedFiles Verifying the npm cache",
    String(
      doctor verifyCachedFiles Verification complete. Stats: {
      doctor   "badContentCount": 0,
      doctor   "reclaimedCount": 0,
      doctor   "missingContent": 0,
      doctor   "verifiedContent": 0
      doctor }
    ),
  ],
  "warn": Array [],
}
`

exports[`test/lib/commands/doctor.js TAP non-default registry > non default registry 1`] = `
Check                               Value   Recommendation/Notes
npm ping                            ok       
npm -v                              ok      current: v1.0.0, latest: v1.0.0
node -v                             ok      current: v1.0.0, recommended: v1.0.0
npm config get registry             not ok  Try \`npm config set registry=https://registry.npmjs.org/\`
git executable in PATH              ok      /path/to/git
global bin folder in PATH           ok      {CWD}/global/bin
Perms check on cached files         ok       
Perms check on local node_modules   ok       
Perms check on global node_modules  ok       
Perms check on local bin folder     ok       
Perms check on global bin folder    ok       
Verify cache contents               ok      verified 0 tarballs
`

exports[`test/lib/commands/doctor.js TAP npm out of date > logs 1`] = `
Object {
  "error": Array [],
  "info": Array [
    "doctor Running checkup",
    "doctor Pinging registry",
    "doctor Getting npm package information",
    "doctor Getting Node.js release information",
    "doctor Finding git in your PATH",
    "doctor getBinPath Finding npm global bin in your PATH",
    "doctor verifyCachedFiles Verifying the npm cache",
    String(
      doctor verifyCachedFiles Verification complete. Stats: {
      doctor   "badContentCount": 0,
      doctor   "reclaimedCount": 0,
      doctor   "missingContent": 0,
      doctor   "verifiedContent": 0
      doctor }
    ),
  ],
  "warn": Array [],
}
`

exports[`test/lib/commands/doctor.js TAP npm out of date > npm is out of date 1`] = `
Check                               Value   Recommendation/Notes
npm ping                            ok       
npm -v                              not ok  Use npm v2.0.0
node -v                             ok      current: v1.0.0, recommended: v1.0.0
npm config get registry             ok      using default registry (https://registry.npmjs.org/)
git executable in PATH              ok      /path/to/git
global bin folder in PATH           ok      {CWD}/global/bin
Perms check on cached files         ok       
Perms check on local node_modules   ok       
Perms check on global node_modules  ok       
Perms check on local bin folder     ok       
Perms check on global bin folder    ok       
Verify cache contents               ok      verified 0 tarballs
`

exports[`test/lib/commands/doctor.js TAP ping 404 > logs 1`] = `
Object {
  "error": Array [],
  "info": Array [
    "doctor Running checkup",
    "doctor Pinging registry",
    "doctor Getting npm package information",
    "doctor Getting Node.js release information",
    "doctor Finding git in your PATH",
    "doctor getBinPath Finding npm global bin in your PATH",
    "doctor verifyCachedFiles Verifying the npm cache",
    String(
      doctor verifyCachedFiles Verification complete. Stats: {
      doctor   "badContentCount": 0,
      doctor   "reclaimedCount": 0,
      doctor   "missingContent": 0,
      doctor   "verifiedContent": 0
      doctor }
    ),
  ],
  "warn": Array [],
}
`

exports[`test/lib/commands/doctor.js TAP ping 404 > ping 404 1`] = `
Check                               Value   Recommendation/Notes
npm ping                            not ok  404 404 Not Found - GET https://registry.npmjs.org/-/ping?write=true
npm -v                              ok      current: v1.0.0, latest: v1.0.0
node -v                             ok      current: v1.0.0, recommended: v1.0.0
npm config get registry             ok      using default registry (https://registry.npmjs.org/)
git executable in PATH              ok      /path/to/git
global bin folder in PATH           ok      {CWD}/global/bin
Perms check on cached files         ok       
Perms check on local node_modules   ok       
Perms check on global node_modules  ok       
Perms check on local bin folder     ok       
Perms check on global bin folder    ok       
Verify cache contents               ok      verified 0 tarballs
`

exports[`test/lib/commands/doctor.js TAP ping 404 in color > logs 1`] = `
Object {
  "error": Array [],
  "info": Array [
    "/u001b[94mdoctor/u001b[39m Running checkup",
    "/u001b[94mdoctor/u001b[39m Pinging registry",
    "/u001b[94mdoctor/u001b[39m Getting npm package information",
    "/u001b[94mdoctor/u001b[39m Getting Node.js release information",
    "/u001b[94mdoctor/u001b[39m Finding git in your PATH",
    "/u001b[94mdoctor/u001b[39m getBinPath Finding npm global bin in your PATH",
    "/u001b[94mdoctor/u001b[39m verifyCachedFiles Verifying the npm cache",
    String(
      /u001b[94mdoctor/u001b[39m verifyCachedFiles Verification complete. Stats: {
      /u001b[94mdoctor/u001b[39m   "badContentCount": 0,
      /u001b[94mdoctor/u001b[39m   "reclaimedCount": 0,
      /u001b[94mdoctor/u001b[39m   "missingContent": 0,
      /u001b[94mdoctor/u001b[39m   "verifiedContent": 0
      /u001b[94mdoctor/u001b[39m }
    ),
  ],
  "warn": Array [],
}
`

exports[`test/lib/commands/doctor.js TAP ping 404 in color > ping 404 in color 1`] = `
[4mCheck[24m                               [4mValue[24m   [4mRecommendation/Notes[24m
[31mnpm ping[39m                            [31mnot ok[39m  [36m404 404 Not Found - GET https://registry.npmjs.org/-/ping?write=true[39m
npm -v                              [32mok[39m      current: v1.0.0, latest: v1.0.0
node -v                             [32mok[39m      current: v1.0.0, recommended: v1.0.0
npm config get registry             [32mok[39m      using default registry (https://registry.npmjs.org/)
git executable in PATH              [32mok[39m      /path/to/git
global bin folder in PATH           [32mok[39m      {CWD}/global/bin
Perms check on cached files         [32mok[39m       
Perms check on local node_modules   [32mok[39m       
Perms check on global node_modules  [32mok[39m       
Perms check on local bin folder     [32mok[39m       
Perms check on global bin folder    [32mok[39m       
Verify cache contents               [32mok[39m      verified 0 tarballs
`

exports[`test/lib/commands/doctor.js TAP ping exception with code > logs 1`] = `
Object {
  "error": Array [],
  "info": Array [
    "doctor Running checkup",
    "doctor Pinging registry",
    "doctor Getting npm package information",
    "doctor Getting Node.js release information",
    "doctor Finding git in your PATH",
    "doctor getBinPath Finding npm global bin in your PATH",
    "doctor verifyCachedFiles Verifying the npm cache",
    String(
      doctor verifyCachedFiles Verification complete. Stats: {
      doctor   "badContentCount": 0,
      doctor   "reclaimedCount": 0,
      doctor   "missingContent": 0,
      doctor   "verifiedContent": 0
      doctor }
    ),
  ],
  "warn": Array [],
}
`

exports[`test/lib/commands/doctor.js TAP ping exception with code > ping failure 1`] = `
Check                               Value   Recommendation/Notes
npm ping                            not ok  request to https://registry.npmjs.org/-/ping?write=true failed, reason: Test Error
npm -v                              ok      current: v1.0.0, latest: v1.0.0
node -v                             ok      current: v1.0.0, recommended: v1.0.0
npm config get registry             ok      using default registry (https://registry.npmjs.org/)
git executable in PATH              ok      /path/to/git
global bin folder in PATH           ok      {CWD}/global/bin
Perms check on cached files         ok       
Perms check on local node_modules   ok       
Perms check on global node_modules  ok       
Perms check on local bin folder     ok       
Perms check on global bin folder    ok       
Verify cache contents               ok      verified 0 tarballs
`

exports[`test/lib/commands/doctor.js TAP ping exception without code > logs 1`] = `
Object {
  "error": Array [],
  "info": Array [
    "doctor Running checkup",
    "doctor Pinging registry",
    "doctor Getting npm package information",
    "doctor Getting Node.js release information",
    "doctor Finding git in your PATH",
    "doctor getBinPath Finding npm global bin in your PATH",
    "doctor verifyCachedFiles Verifying the npm cache",
    String(
      doctor verifyCachedFiles Verification complete. Stats: {
      doctor   "badContentCount": 0,
      doctor   "reclaimedCount": 0,
      doctor   "missingContent": 0,
      doctor   "verifiedContent": 0
      doctor }
    ),
  ],
  "warn": Array [],
}
`

exports[`test/lib/commands/doctor.js TAP ping exception without code > ping failure 1`] = `
Check                               Value   Recommendation/Notes
npm ping                            not ok  request to https://registry.npmjs.org/-/ping?write=true failed, reason: Test Error
npm -v                              ok      current: v1.0.0, latest: v1.0.0
node -v                             ok      current: v1.0.0, recommended: v1.0.0
npm config get registry             ok      using default registry (https://registry.npmjs.org/)
git executable in PATH              ok      /path/to/git
global bin folder in PATH           ok      {CWD}/global/bin
Perms check on cached files         ok       
Perms check on local node_modules   ok       
Perms check on global node_modules  ok       
Perms check on local bin folder     ok       
Perms check on global bin folder    ok       
Verify cache contents               ok      verified 0 tarballs
`

exports[`test/lib/commands/doctor.js TAP silent errors > logs 1`] = `
Object {
  "error": Array [],
  "info": Array [],
  "warn": Array [],
}
`

exports[`test/lib/commands/doctor.js TAP silent errors > output 1`] = `

`

exports[`test/lib/commands/doctor.js TAP silent success > logs 1`] = `
Object {
  "error": Array [],
  "info": Array [],
  "warn": Array [],
}
`

exports[`test/lib/commands/doctor.js TAP silent success > output 1`] = `

`

exports[`test/lib/commands/doctor.js TAP windows skips permissions checks > logs 1`] = `
Object {
  "error": Array [],
  "info": Array [
    "doctor Running checkup",
    "doctor Pinging registry",
    "doctor Getting npm package information",
    "doctor Getting Node.js release information",
    "doctor Finding git in your PATH",
    "doctor getBinPath Finding npm global bin in your PATH",
  ],
  "warn": Array [],
}
`

exports[`test/lib/commands/doctor.js TAP windows skips permissions checks > no permissions checks 1`] = `
Check                      Value   Recommendation/Notes
npm ping                   ok       
npm -v                     ok      current: v1.0.0, latest: v1.0.0
node -v                    ok      current: v1.0.0, recommended: v1.0.0
npm config get registry    ok      using default registry (https://registry.npmjs.org/)
git executable in PATH     ok      /path/to/git
global bin folder in PATH  ok      {CWD}/global
`
