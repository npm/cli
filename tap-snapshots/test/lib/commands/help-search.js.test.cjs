/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/lib/commands/help-search.js TAP --color > contains color highlighted search term 1`] = `
npm help help-search                                               help-search:5
--------------------------------------------------------------------------------
<!-- automatically generated, do not edit manually -->
<!-- see lib/commands/[40m[31mhelp-search[39m[49m.js -->
\`\`\`bash
npm [40m[31mhelp-search[39m[49m <text>



npm help help                                                      help-search:4
--------------------------------------------------------------------------------
If the topic does not exist, or if multiple terms are provided, then npm
will run the \`[40m[31mhelp-search[39m[49m\` command to find a match.  Note that, if
\`[40m[31mhelp-search[39m[49m\` finds a single subject, then it will run \`help\` on that



npm help config                                                    help-search:1
--------------------------------------------------------------------------------
* Type: Boolean
Show extended information in \`ls\`, \`search\`, and \`[40m[31mhelp-search[39m[49m\`.
<!-- automatically generated, do not edit manually -->



npm help outdated                                                  help-search:1
--------------------------------------------------------------------------------
* Type: Boolean
Show extended information in \`ls\`, \`search\`, and \`[40m[31mhelp-search[39m[49m\`.
<!-- automatically generated, do not edit manually -->



npm help ls                                                        help-search:1
--------------------------------------------------------------------------------
* Type: Boolean
Show extended information in \`ls\`, \`search\`, and \`[40m[31mhelp-search[39m[49m\`.
<!-- automatically generated, do not edit manually -->



npm help search                                                    help-search:1
--------------------------------------------------------------------------------
* Type: Boolean
Show extended information in \`ls\`, \`search\`, and \`[40m[31mhelp-search[39m[49m\`.
<!-- automatically generated, do not edit manually -->



npm help config                                                    help-search:1
--------------------------------------------------------------------------------
* Type: Boolean
Show extended information in \`ls\`, \`search\`, and \`[40m[31mhelp-search[39m[49m\`.
<!-- automatically generated, do not edit manually -->
`

exports[`test/lib/commands/help-search.js TAP --long > outputs detailed results 1`] = `
npm help exec                                                            exec:35
--------------------------------------------------------------------------------
<!-- automatically generated, do not edit manually -->
<!-- see lib/commands/exec.js -->
\`\`\`bash
npm exec -- <pkg>[@<version>] [args...]



npm help npx                                                             exec:23
--------------------------------------------------------------------------------
<!-- automatically generated, do not edit manually -->
<!-- see lib/commands/exec.js -->
\`\`\`bash



npm help config                                                          exec:13
--------------------------------------------------------------------------------
Tells npm to create symlinks (or \`.cmd\` shims on Windows) for package
executables.
Set to false to have it not do this. This can be used to work around the



npm help init                                                            exec:13
--------------------------------------------------------------------------------
\`initializer\` in this case is an npm package named \`create-<initializer>\`,
which will be installed by [\`npm-exec\`](/commands/npm-exec), and then have its
main bin executed -- presumably creating or updating \`package.json\` and
running any other initialization-related operations.



npm help scripts                                                         exec:11
--------------------------------------------------------------------------------
of built-in scripts and their preset life cycle events as well as
arbitrary scripts. These all can be executed by running
\`npm run-script <stage>\` or \`npm run <stage>\` for short. *Pre* and *post*



npm help package-json                                                    exec:10
--------------------------------------------------------------------------------
### bin
A lot of packages have one or more executable files that they'd like to
install into the PATH. npm makes this pretty easy (in fact, it uses this
feature to install the "npm" executable.)



npm help run-script                                                       exec:4
--------------------------------------------------------------------------------
were in when you ran \`npm run\`.
\`npm run\` sets the \`NODE\` environment variable to the \`node\` executable
with which \`npm\` is executed.



npm help link                                                             exec:3
--------------------------------------------------------------------------------
folder \`{prefix}/lib/node_modules/<package>\` that links to the package
where the \`npm link\` command was executed. It will also link any bins in
the package to \`{prefix}/bin/{name}\`.  Note that \`npm link\` uses the global



npm help install                                                          exec:3
--------------------------------------------------------------------------------
    * \`GIT_ASKPASS\`
    * \`GIT_EXEC_PATH\`
    * \`GIT_PROXY_COMMAND\`



npm help version                                                          exec:3
--------------------------------------------------------------------------------
will link workspaces into the \`node_modules\` folder. - Commands that do
other things (test, exec, publish, etc.) will operate on the root project,
_unless_ one or more workspaces are specified in the \`workspace\` config.
`

exports[`test/lib/commands/help-search.js TAP help-search install > outputs results 1`] = `
Top hits for "install"
————————————————————————————————————————————————————————————————————————————————
npm help install                                                     install:140
npm help config                                                       install:63
npm help scripts                                                      install:59
npm help package-json                                                 install:56
npm help folders                                                      install:42
npm help install-test                                                 install:41
npm help update                                                       install:38
npm help install                                                      install:33
npm help audit                                                        install:29
npm help link                                                         install:25
————————————————————————————————————————————————————————————————————————————————
(run with -l or --long to see more context)
`

exports[`test/lib/commands/help-search.js TAP help-search run install > shows sorted hit counts for both terms 1`] = `
Top hits for "run" "install"
————————————————————————————————————————————————————————————————————————————————
npm help install                                              install:140 run:15
npm help scripts                                               install:59 run:49
npm help config                                                install:63 run:28
npm help package-json                                          install:56 run:13
npm help install-test                                          install:41 run:12
npm help update                                                install:38 run:14
npm help folders                                                install:42 run:9
npm help audit                                                 install:29 run:15
npm help run-script                                             install:4 run:36
npm help exec                                                  install:12 run:26
————————————————————————————————————————————————————————————————————————————————
(run with -l or --long to see more context)
`

exports[`test/lib/commands/help-search.js TAP help-search run script > shows sorted hit counts for both terms 1`] = `
Top hits for "run" "script"
————————————————————————————————————————————————————————————————————————————————
npm help scripts                                                run:49 script:74
npm help run-script                                             run:36 script:48
npm help config                                                 run:28 script:32
npm help package-json                                           run:13 script:36
npm help install                                                run:15 script:25
npm help exec                                                   run:26 script:14
npm help start                                                  run:14 script:24
npm help version                                                run:18 script:19
npm help restart                                                run:13 script:24
npm help prune                                                  run:18 script:16
————————————————————————————————————————————————————————————————————————————————
(run with -l or --long to see more context)
`
