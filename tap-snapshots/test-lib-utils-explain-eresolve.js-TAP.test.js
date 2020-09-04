/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/lib/utils/explain-eresolve.js TAP cycleNested > explain with color 1`] = `
While resolving: [1m@isaacs/peer-dep-cycle-a[22m@[1m1.0.0[22m
Found: [1m@isaacs/peer-dep-cycle-c[22m@[1m2.0.0[22m[2m at node_modules/@isaacs/peer-dep-cycle-c[22m
  for: prod dependency [1m@isaacs/peer-dep-cycle-c[22m@"[1m2.x[22m"
  from: the root project

Could not add conflicting dependency: [1m@isaacs/peer-dep-cycle-b[22m@[1m1.0.0[22m[2m at node_modules/@isaacs/peer-dep-cycle-b[22m
  for: peer dependency [1m@isaacs/peer-dep-cycle-b[22m@"[1m1[22m"
  from: [1m@isaacs/peer-dep-cycle-a[22m@[1m1.0.0[22m[2m at node_modules/@isaacs/peer-dep-cycle-a[22m
    for: prod dependency [1m@isaacs/peer-dep-cycle-a[22m@"[1m1.x[22m"
    from: the root project

Conflicting peer dependency: [1m@isaacs/peer-dep-cycle-c[22m@[1m1.0.0[22m[2m at node_modules/@isaacs/peer-dep-cycle-c[22m
  for: peer dependency [1m@isaacs/peer-dep-cycle-c[22m@"[1m1[22m"
  from: [1m@isaacs/peer-dep-cycle-b[22m@[1m1.0.0[22m[2m at node_modules/@isaacs/peer-dep-cycle-b[22m
    for: peer dependency [1m@isaacs/peer-dep-cycle-b[22m@"[1m1[22m"
    from: [1m@isaacs/peer-dep-cycle-a[22m@[1m1.0.0[22m[2m at node_modules/@isaacs/peer-dep-cycle-a[22m
`

exports[`test/lib/utils/explain-eresolve.js TAP cycleNested > explain with no color, depth of 6 1`] = `
While resolving: @isaacs/peer-dep-cycle-a@1.0.0
Found: @isaacs/peer-dep-cycle-c@2.0.0 at node_modules/@isaacs/peer-dep-cycle-c
  for: prod dependency @isaacs/peer-dep-cycle-c@"2.x"
  from: the root project

Could not add conflicting dependency: @isaacs/peer-dep-cycle-b@1.0.0 at node_modules/@isaacs/peer-dep-cycle-b
  for: peer dependency @isaacs/peer-dep-cycle-b@"1"
  from: @isaacs/peer-dep-cycle-a@1.0.0 at node_modules/@isaacs/peer-dep-cycle-a
    for: prod dependency @isaacs/peer-dep-cycle-a@"1.x"
    from: the root project

Conflicting peer dependency: @isaacs/peer-dep-cycle-c@1.0.0 at node_modules/@isaacs/peer-dep-cycle-c
  for: peer dependency @isaacs/peer-dep-cycle-c@"1"
  from: @isaacs/peer-dep-cycle-b@1.0.0 at node_modules/@isaacs/peer-dep-cycle-b
    for: peer dependency @isaacs/peer-dep-cycle-b@"1"
    from: @isaacs/peer-dep-cycle-a@1.0.0 at node_modules/@isaacs/peer-dep-cycle-a
      for: prod dependency @isaacs/peer-dep-cycle-a@"1.x"
      from: the root project
`

exports[`test/lib/utils/explain-eresolve.js TAP cycleNested > report 1`] = `
# npm resolution error report

\${TIME}

While resolving: @isaacs/peer-dep-cycle-a@1.0.0
Found: @isaacs/peer-dep-cycle-c@2.0.0 at node_modules/@isaacs/peer-dep-cycle-c
  for: prod dependency @isaacs/peer-dep-cycle-c@"2.x"
  from: the root project

Could not add conflicting dependency: @isaacs/peer-dep-cycle-b@1.0.0 at node_modules/@isaacs/peer-dep-cycle-b
  for: peer dependency @isaacs/peer-dep-cycle-b@"1"
  from: @isaacs/peer-dep-cycle-a@1.0.0 at node_modules/@isaacs/peer-dep-cycle-a
    for: prod dependency @isaacs/peer-dep-cycle-a@"1.x"
    from: the root project

Conflicting peer dependency: @isaacs/peer-dep-cycle-c@1.0.0 at node_modules/@isaacs/peer-dep-cycle-c
  for: peer dependency @isaacs/peer-dep-cycle-c@"1"
  from: @isaacs/peer-dep-cycle-b@1.0.0 at node_modules/@isaacs/peer-dep-cycle-b
    for: peer dependency @isaacs/peer-dep-cycle-b@"1"
    from: @isaacs/peer-dep-cycle-a@1.0.0 at node_modules/@isaacs/peer-dep-cycle-a
      for: prod dependency @isaacs/peer-dep-cycle-a@"1.x"
      from: the root project

Fix the upstream dependency conflict, or retry
this command with --legacy-peer-deps
to accept an incorrect (and potentially broken) dependency resolution.

Raw JSON explanation object:

{
  "name": "cycleNested",
  "json": true
}

`

exports[`test/lib/utils/explain-eresolve.js TAP cycleNested > report with color 1`] = `
While resolving: [1m@isaacs/peer-dep-cycle-a[22m@[1m1.0.0[22m
Found: [1m@isaacs/peer-dep-cycle-c[22m@[1m2.0.0[22m[2m at node_modules/@isaacs/peer-dep-cycle-c[22m
  for: prod dependency [1m@isaacs/peer-dep-cycle-c[22m@"[1m2.x[22m"
  from: the root project

Could not add conflicting dependency: [1m@isaacs/peer-dep-cycle-b[22m@[1m1.0.0[22m[2m at node_modules/@isaacs/peer-dep-cycle-b[22m
  for: peer dependency [1m@isaacs/peer-dep-cycle-b[22m@"[1m1[22m"
  from: [1m@isaacs/peer-dep-cycle-a[22m@[1m1.0.0[22m[2m at node_modules/@isaacs/peer-dep-cycle-a[22m
    for: prod dependency [1m@isaacs/peer-dep-cycle-a[22m@"[1m1.x[22m"
    from: the root project

Conflicting peer dependency: [1m@isaacs/peer-dep-cycle-c[22m@[1m1.0.0[22m[2m at node_modules/@isaacs/peer-dep-cycle-c[22m
  for: peer dependency [1m@isaacs/peer-dep-cycle-c[22m@"[1m1[22m"
  from: [1m@isaacs/peer-dep-cycle-b[22m@[1m1.0.0[22m[2m at node_modules/@isaacs/peer-dep-cycle-b[22m
    for: peer dependency [1m@isaacs/peer-dep-cycle-b[22m@"[1m1[22m"
    from: [1m@isaacs/peer-dep-cycle-a[22m@[1m1.0.0[22m[2m at node_modules/@isaacs/peer-dep-cycle-a[22m
      for: prod dependency [1m@isaacs/peer-dep-cycle-a[22m@"[1m1.x[22m"
      from: the root project

Fix the upstream dependency conflict, or retry
this command with --legacy-peer-deps
to accept an incorrect (and potentially broken) dependency resolution.

See \${REPORT} for a full report.
`

exports[`test/lib/utils/explain-eresolve.js TAP cycleNested > report with color, depth only 2 1`] = `
While resolving: [1m@isaacs/peer-dep-cycle-a[22m@[1m1.0.0[22m
Found: [1m@isaacs/peer-dep-cycle-c[22m@[1m2.0.0[22m[2m at node_modules/@isaacs/peer-dep-cycle-c[22m
  for: prod dependency [1m@isaacs/peer-dep-cycle-c[22m@"[1m2.x[22m"
  from: the root project

Could not add conflicting dependency: [1m@isaacs/peer-dep-cycle-b[22m@[1m1.0.0[22m[2m at node_modules/@isaacs/peer-dep-cycle-b[22m
  for: peer dependency [1m@isaacs/peer-dep-cycle-b[22m@"[1m1[22m"
  from: [1m@isaacs/peer-dep-cycle-a[22m@[1m1.0.0[22m[2m at node_modules/@isaacs/peer-dep-cycle-a[22m
    for: prod dependency [1m@isaacs/peer-dep-cycle-a[22m@"[1m1.x[22m"
    from: the root project

Conflicting peer dependency: [1m@isaacs/peer-dep-cycle-c[22m@[1m1.0.0[22m[2m at node_modules/@isaacs/peer-dep-cycle-c[22m
  for: peer dependency [1m@isaacs/peer-dep-cycle-c[22m@"[1m1[22m"
  from: [1m@isaacs/peer-dep-cycle-b[22m@[1m1.0.0[22m[2m at node_modules/@isaacs/peer-dep-cycle-b[22m
    for: peer dependency [1m@isaacs/peer-dep-cycle-b[22m@"[1m1[22m"
    from: [1m@isaacs/peer-dep-cycle-a[22m@[1m1.0.0[22m[2m at node_modules/@isaacs/peer-dep-cycle-a[22m

Fix the upstream dependency conflict, or retry
this command with --legacy-peer-deps
to accept an incorrect (and potentially broken) dependency resolution.

See \${REPORT} for a full report.
`

exports[`test/lib/utils/explain-eresolve.js TAP cycleNested > report with no color, depth of 6 1`] = `
While resolving: @isaacs/peer-dep-cycle-a@1.0.0
Found: @isaacs/peer-dep-cycle-c@2.0.0 at node_modules/@isaacs/peer-dep-cycle-c
  for: prod dependency @isaacs/peer-dep-cycle-c@"2.x"
  from: the root project

Could not add conflicting dependency: @isaacs/peer-dep-cycle-b@1.0.0 at node_modules/@isaacs/peer-dep-cycle-b
  for: peer dependency @isaacs/peer-dep-cycle-b@"1"
  from: @isaacs/peer-dep-cycle-a@1.0.0 at node_modules/@isaacs/peer-dep-cycle-a
    for: prod dependency @isaacs/peer-dep-cycle-a@"1.x"
    from: the root project

Conflicting peer dependency: @isaacs/peer-dep-cycle-c@1.0.0 at node_modules/@isaacs/peer-dep-cycle-c
  for: peer dependency @isaacs/peer-dep-cycle-c@"1"
  from: @isaacs/peer-dep-cycle-b@1.0.0 at node_modules/@isaacs/peer-dep-cycle-b
    for: peer dependency @isaacs/peer-dep-cycle-b@"1"
    from: @isaacs/peer-dep-cycle-a@1.0.0 at node_modules/@isaacs/peer-dep-cycle-a
      for: prod dependency @isaacs/peer-dep-cycle-a@"1.x"
      from: the root project

Fix the upstream dependency conflict, or retry
this command with --legacy-peer-deps
to accept an incorrect (and potentially broken) dependency resolution.

See \${REPORT} for a full report.
`

exports[`test/lib/utils/explain-eresolve.js TAP gatsby > explain with color 1`] = `
While resolving: [1mgatsby-interface[22m@[1m0.0.166[22m
Found: [1mreact[22m@[1m16.13.1[22m[2m at node_modules/react[22m
  for: peer dependency [1mreact[22m@"[1m^16.4.2[22m"
  from: [1mgatsby[22m@[1m2.24.53[22m[2m at node_modules/gatsby[22m
    for: prod dependency [1mgatsby[22m@""
    from: the root project
  and: 26 more (react-dom, @reach/router, gatsby-cli, gatsby-link, gatsby-react-router-scroll, ...)

Could not add conflicting dependency: [1mreact[22m@[1m16.8.1[22m[2m at node_modules/react[22m
  for: peer dependency [1mreact[22m@"[1m16.8.1[22m"
  from: [1mgatsby-interface[22m@[1m0.0.166[22m[2m at node_modules/gatsby-recipes/node_modules/gatsby-interface[22m
    for: prod dependency [1mgatsby-interface[22m@"[1m^0.0.166[22m"
    from: [1mgatsby-recipes[22m@[1m0.2.20[22m[2m at node_modules/gatsby-recipes[22m
`

exports[`test/lib/utils/explain-eresolve.js TAP gatsby > explain with no color, depth of 6 1`] = `
While resolving: gatsby-interface@0.0.166
Found: react@16.13.1 at node_modules/react
  for: peer dependency react@"^16.4.2"
  from: gatsby@2.24.53 at node_modules/gatsby
    for: prod dependency gatsby@""
    from: the root project
  and: peer dependency react@"^16.13.1"
  from: react-dom@16.13.1 at node_modules/react-dom
    for: peer dependency react-dom@"^16.4.2"
    from: gatsby@2.24.53 at node_modules/gatsby
      for: prod dependency gatsby@""
      from: the root project
    and: peer dependency react-dom@"15.x || 16.x || 16.4.0-alpha.0911da3"
    from: @reach/router@1.3.4 at node_modules/@reach/router
      for: prod dependency @reach/router@"^1.3.4"
      from: gatsby@2.24.53 at node_modules/gatsby
        for: prod dependency gatsby@""
        from: the root project
      and: peer dependency @reach/router@"^1.3.3"
      from: gatsby-link@2.4.13 at node_modules/gatsby-link
        for: prod dependency gatsby-link@"^2.4.13"
        from: gatsby@2.24.53 at node_modules/gatsby
          for: prod dependency gatsby@""
          from: the root project
      and: 1 more (gatsby-react-router-scroll)
    and: peer dependency react-dom@"^16.4.2"
    from: gatsby-link@2.4.13 at node_modules/gatsby-link
      for: prod dependency gatsby-link@"^2.4.13"
      from: gatsby@2.24.53 at node_modules/gatsby
        for: prod dependency gatsby@""
        from: the root project
    and: 2 more (gatsby-react-router-scroll, react-hot-loader)
  and: peer dependency react@"15.x || 16.x || 16.4.0-alpha.0911da3"
  from: @reach/router@1.3.4 at node_modules/@reach/router
    for: prod dependency @reach/router@"^1.3.4"
    from: gatsby@2.24.53 at node_modules/gatsby
      for: prod dependency gatsby@""
      from: the root project
    and: peer dependency @reach/router@"^1.3.3"
    from: gatsby-link@2.4.13 at node_modules/gatsby-link
      for: prod dependency gatsby-link@"^2.4.13"
      from: gatsby@2.24.53 at node_modules/gatsby
        for: prod dependency gatsby@""
        from: the root project
    and: peer dependency @reach/router@"^1.0.0"
    from: gatsby-react-router-scroll@3.0.12 at node_modules/gatsby-react-router-scroll
      for: prod dependency gatsby-react-router-scroll@"^3.0.12"
      from: gatsby@2.24.53 at node_modules/gatsby
        for: prod dependency gatsby@""
        from: the root project
  and: 24 more (gatsby-cli, gatsby-link, gatsby-react-router-scroll, react-hot-loader, create-react-context, ...)

Could not add conflicting dependency: react@16.8.1 at node_modules/react
  for: peer dependency react@"16.8.1"
  from: gatsby-interface@0.0.166 at node_modules/gatsby-recipes/node_modules/gatsby-interface
    for: prod dependency gatsby-interface@"^0.0.166"
    from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
      for: prod dependency gatsby-recipes@"^0.2.20"
      from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
        for: prod dependency gatsby-cli@"^2.12.91"
        from: gatsby@2.24.53 at node_modules/gatsby
          for: prod dependency gatsby@""
          from: the root project
`

exports[`test/lib/utils/explain-eresolve.js TAP gatsby > report 1`] = `
# npm resolution error report

\${TIME}

While resolving: gatsby-interface@0.0.166
Found: react@16.13.1 at node_modules/react
  for: peer dependency react@"^16.4.2"
  from: gatsby@2.24.53 at node_modules/gatsby
    for: prod dependency gatsby@""
    from: the root project
  and: peer dependency react@"^16.13.1"
  from: react-dom@16.13.1 at node_modules/react-dom
    for: peer dependency react-dom@"^16.4.2"
    from: gatsby@2.24.53 at node_modules/gatsby
      for: prod dependency gatsby@""
      from: the root project
    and: peer dependency react-dom@"15.x || 16.x || 16.4.0-alpha.0911da3"
    from: @reach/router@1.3.4 at node_modules/@reach/router
      for: prod dependency @reach/router@"^1.3.4"
      from: gatsby@2.24.53 at node_modules/gatsby
        for: prod dependency gatsby@""
        from: the root project
      and: peer dependency @reach/router@"^1.3.3"
      from: gatsby-link@2.4.13 at node_modules/gatsby-link
        for: prod dependency gatsby-link@"^2.4.13"
        from: gatsby@2.24.53 at node_modules/gatsby
          for: prod dependency gatsby@""
          from: the root project
      and: peer dependency @reach/router@"^1.0.0"
      from: gatsby-react-router-scroll@3.0.12 at node_modules/gatsby-react-router-scroll
        for: prod dependency gatsby-react-router-scroll@"^3.0.12"
        from: gatsby@2.24.53 at node_modules/gatsby
          for: prod dependency gatsby@""
          from: the root project
    and: peer dependency react-dom@"^16.4.2"
    from: gatsby-link@2.4.13 at node_modules/gatsby-link
      for: prod dependency gatsby-link@"^2.4.13"
      from: gatsby@2.24.53 at node_modules/gatsby
        for: prod dependency gatsby@""
        from: the root project
    and: peer dependency react-dom@"^16.4.2"
    from: gatsby-react-router-scroll@3.0.12 at node_modules/gatsby-react-router-scroll
      for: prod dependency gatsby-react-router-scroll@"^3.0.12"
      from: gatsby@2.24.53 at node_modules/gatsby
        for: prod dependency gatsby@""
        from: the root project
    and: peer dependency react-dom@"^15.0.0 || ^16.0.0"
    from: react-hot-loader@4.12.21 at node_modules/react-hot-loader
      for: prod dependency react-hot-loader@"^4.12.21"
      from: gatsby@2.24.53 at node_modules/gatsby
        for: prod dependency gatsby@""
        from: the root project
  and: peer dependency react@"15.x || 16.x || 16.4.0-alpha.0911da3"
  from: @reach/router@1.3.4 at node_modules/@reach/router
    for: prod dependency @reach/router@"^1.3.4"
    from: gatsby@2.24.53 at node_modules/gatsby
      for: prod dependency gatsby@""
      from: the root project
    and: peer dependency @reach/router@"^1.3.3"
    from: gatsby-link@2.4.13 at node_modules/gatsby-link
      for: prod dependency gatsby-link@"^2.4.13"
      from: gatsby@2.24.53 at node_modules/gatsby
        for: prod dependency gatsby@""
        from: the root project
    and: peer dependency @reach/router@"^1.0.0"
    from: gatsby-react-router-scroll@3.0.12 at node_modules/gatsby-react-router-scroll
      for: prod dependency gatsby-react-router-scroll@"^3.0.12"
      from: gatsby@2.24.53 at node_modules/gatsby
        for: prod dependency gatsby@""
        from: the root project
  and: prod dependency react@"^16.8.0"
  from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
    for: prod dependency gatsby-cli@"^2.12.91"
    from: gatsby@2.24.53 at node_modules/gatsby
      for: prod dependency gatsby@""
      from: the root project
  and: peer dependency react@"^16.4.2"
  from: gatsby-link@2.4.13 at node_modules/gatsby-link
    for: prod dependency gatsby-link@"^2.4.13"
    from: gatsby@2.24.53 at node_modules/gatsby
      for: prod dependency gatsby@""
      from: the root project
  and: peer dependency react@"^16.4.2"
  from: gatsby-react-router-scroll@3.0.12 at node_modules/gatsby-react-router-scroll
    for: prod dependency gatsby-react-router-scroll@"^3.0.12"
    from: gatsby@2.24.53 at node_modules/gatsby
      for: prod dependency gatsby@""
      from: the root project
  and: peer dependency react@"^15.0.0 || ^16.0.0"
  from: react-hot-loader@4.12.21 at node_modules/react-hot-loader
    for: prod dependency react-hot-loader@"^4.12.21"
    from: gatsby@2.24.53 at node_modules/gatsby
      for: prod dependency gatsby@""
      from: the root project
  and: peer dependency react@"^0.14.0 || ^15.0.0 || ^16.0.0"
  from: create-react-context@0.3.0 at node_modules/create-react-context
    for: prod dependency create-react-context@"0.3.0"
    from: @reach/router@1.3.4 at node_modules/@reach/router
      for: prod dependency @reach/router@"^1.3.4"
      from: gatsby@2.24.53 at node_modules/gatsby
        for: prod dependency gatsby@""
        from: the root project
      and: peer dependency @reach/router@"^1.3.3"
      from: gatsby-link@2.4.13 at node_modules/gatsby-link
        for: prod dependency gatsby-link@"^2.4.13"
        from: gatsby@2.24.53 at node_modules/gatsby
          for: prod dependency gatsby@""
          from: the root project
      and: peer dependency @reach/router@"^1.0.0"
      from: gatsby-react-router-scroll@3.0.12 at node_modules/gatsby-react-router-scroll
        for: prod dependency gatsby-react-router-scroll@"^3.0.12"
        from: gatsby@2.24.53 at node_modules/gatsby
          for: prod dependency gatsby@""
          from: the root project
  and: peer dependency react@"^16.12.0"
  from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
    for: prod dependency gatsby-recipes@"^0.2.20"
    from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
      for: prod dependency gatsby-cli@"^2.12.91"
      from: gatsby@2.24.53 at node_modules/gatsby
        for: prod dependency gatsby@""
        from: the root project
  and: peer dependency react@">=16.8.0"
  from: ink@2.7.1 at node_modules/ink
    for: prod dependency ink@"^2.7.1"
    from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
      for: prod dependency gatsby-cli@"^2.12.91"
      from: gatsby@2.24.53 at node_modules/gatsby
        for: prod dependency gatsby@""
        from: the root project
    and: peer dependency ink@"^2.0.0"
    from: ink-spinner@3.1.0 at node_modules/ink-spinner
      for: prod dependency ink-spinner@"^3.1.0"
      from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
        for: prod dependency gatsby-cli@"^2.12.91"
        from: gatsby@2.24.53 at node_modules/gatsby
          for: prod dependency gatsby@""
          from: the root project
    and: peer dependency ink@">=2.0.0"
    from: ink-box@1.0.0 at node_modules/ink-box
      for: prod dependency ink-box@"^1.0.0"
      from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
        for: prod dependency gatsby-recipes@"^0.2.20"
        from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
          for: prod dependency gatsby-cli@"^2.12.91"
          from: gatsby@2.24.53 at node_modules/gatsby
            for: prod dependency gatsby@""
            from: the root project
  and: peer dependency react@"^16.8.2"
  from: ink-spinner@3.1.0 at node_modules/ink-spinner
    for: prod dependency ink-spinner@"^3.1.0"
    from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
      for: prod dependency gatsby-cli@"^2.12.91"
      from: gatsby@2.24.53 at node_modules/gatsby
        for: prod dependency gatsby@""
        from: the root project
  and: peer dependency react@">=16.3.0"
  from: @emotion/core@10.0.35 at node_modules/@emotion/core
    for: prod dependency @emotion/core@"^10.0.14"
    from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
      for: prod dependency gatsby-recipes@"^0.2.20"
      from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
        for: prod dependency gatsby-cli@"^2.12.91"
        from: gatsby@2.24.53 at node_modules/gatsby
          for: prod dependency gatsby@""
          from: the root project
    and: peer dependency @emotion/core@"^10.0.27"
    from: @emotion/styled@10.0.27 at node_modules/@emotion/styled
      for: prod dependency @emotion/styled@"^10.0.14"
      from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
        for: prod dependency gatsby-recipes@"^0.2.20"
        from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
          for: prod dependency gatsby-cli@"^2.12.91"
          from: gatsby@2.24.53 at node_modules/gatsby
            for: prod dependency gatsby@""
            from: the root project
      and: peer dependency @emotion/styled@"^10.0.14"
      from: gatsby-interface@0.0.166 at node_modules/gatsby-recipes/node_modules/gatsby-interface
        for: prod dependency gatsby-interface@"^0.0.166"
        from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
          for: prod dependency gatsby-recipes@"^0.2.20"
          from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
            for: prod dependency gatsby-cli@"^2.12.91"
            from: gatsby@2.24.53 at node_modules/gatsby
              for: prod dependency gatsby@""
              from: the root project
    and: peer dependency @emotion/core@"^10.0.14"
    from: gatsby-interface@0.0.166 at node_modules/gatsby-recipes/node_modules/gatsby-interface
      for: prod dependency gatsby-interface@"^0.0.166"
      from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
        for: prod dependency gatsby-recipes@"^0.2.20"
        from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
          for: prod dependency gatsby-cli@"^2.12.91"
          from: gatsby@2.24.53 at node_modules/gatsby
            for: prod dependency gatsby@""
            from: the root project
    and: peer dependency @emotion/core@"^10.0.28"
    from: @emotion/styled-base@10.0.31 at node_modules/@emotion/styled-base
      for: prod dependency @emotion/styled-base@"^10.0.27"
      from: @emotion/styled@10.0.27 at node_modules/@emotion/styled
        for: prod dependency @emotion/styled@"^10.0.14"
        from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
          for: prod dependency gatsby-recipes@"^0.2.20"
          from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
            for: prod dependency gatsby-cli@"^2.12.91"
            from: gatsby@2.24.53 at node_modules/gatsby
              for: prod dependency gatsby@""
              from: the root project
        and: peer dependency @emotion/styled@"^10.0.14"
        from: gatsby-interface@0.0.166 at node_modules/gatsby-recipes/node_modules/gatsby-interface
          for: prod dependency gatsby-interface@"^0.0.166"
          from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
            for: prod dependency gatsby-recipes@"^0.2.20"
            from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
              for: prod dependency gatsby-cli@"^2.12.91"
              from: gatsby@2.24.53 at node_modules/gatsby
                for: prod dependency gatsby@""
                from: the root project
  and: peer dependency react@">=16.3.0"
  from: @emotion/styled@10.0.27 at node_modules/@emotion/styled
    for: prod dependency @emotion/styled@"^10.0.14"
    from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
      for: prod dependency gatsby-recipes@"^0.2.20"
      from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
        for: prod dependency gatsby-cli@"^2.12.91"
        from: gatsby@2.24.53 at node_modules/gatsby
          for: prod dependency gatsby@""
          from: the root project
    and: peer dependency @emotion/styled@"^10.0.14"
    from: gatsby-interface@0.0.166 at node_modules/gatsby-recipes/node_modules/gatsby-interface
      for: prod dependency gatsby-interface@"^0.0.166"
      from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
        for: prod dependency gatsby-recipes@"^0.2.20"
        from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
          for: prod dependency gatsby-cli@"^2.12.91"
          from: gatsby@2.24.53 at node_modules/gatsby
            for: prod dependency gatsby@""
            from: the root project
  and: peer dependency react@"^16.13.1"
  from: @mdx-js/react@2.0.0-next.7 at node_modules/@mdx-js/react
    for: prod dependency @mdx-js/react@"^2.0.0-next.4"
    from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
      for: prod dependency gatsby-recipes@"^0.2.20"
      from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
        for: prod dependency gatsby-cli@"^2.12.91"
        from: gatsby@2.24.53 at node_modules/gatsby
          for: prod dependency gatsby@""
          from: the root project
    and: prod dependency @mdx-js/react@"^2.0.0-next.7"
    from: @mdx-js/runtime@2.0.0-next.7 at node_modules/@mdx-js/runtime
      for: prod dependency @mdx-js/runtime@"^2.0.0-next.4"
      from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
        for: prod dependency gatsby-recipes@"^0.2.20"
        from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
          for: prod dependency gatsby-cli@"^2.12.91"
          from: gatsby@2.24.53 at node_modules/gatsby
            for: prod dependency gatsby@""
            from: the root project
  and: peer dependency react@"^16.13.1"
  from: @mdx-js/runtime@2.0.0-next.7 at node_modules/@mdx-js/runtime
    for: prod dependency @mdx-js/runtime@"^2.0.0-next.4"
    from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
      for: prod dependency gatsby-recipes@"^0.2.20"
      from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
        for: prod dependency gatsby-cli@"^2.12.91"
        from: gatsby@2.24.53 at node_modules/gatsby
          for: prod dependency gatsby@""
          from: the root project
  and: peer dependency react@">=16.8.0"
  from: formik@2.1.5 at node_modules/formik
    for: prod dependency formik@"^2.0.8"
    from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
      for: prod dependency gatsby-recipes@"^0.2.20"
      from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
        for: prod dependency gatsby-cli@"^2.12.91"
        from: gatsby@2.24.53 at node_modules/gatsby
          for: prod dependency gatsby@""
          from: the root project
    and: peer dependency formik@"^2.0.8"
    from: gatsby-interface@0.0.166 at node_modules/gatsby-recipes/node_modules/gatsby-interface
      for: prod dependency gatsby-interface@"^0.0.166"
      from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
        for: prod dependency gatsby-recipes@"^0.2.20"
        from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
          for: prod dependency gatsby-cli@"^2.12.91"
          from: gatsby@2.24.53 at node_modules/gatsby
            for: prod dependency gatsby@""
            from: the root project
  and: peer dependency react@"^16.4.2"
  from: gatsby@2.6.0 at node_modules/gatsby-recipes/node_modules/gatsby
    for: peer dependency gatsby@"2.6.0"
    from: gatsby-interface@0.0.166 at node_modules/gatsby-recipes/node_modules/gatsby-interface
      for: prod dependency gatsby-interface@"^0.0.166"
      from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
        for: prod dependency gatsby-recipes@"^0.2.20"
        from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
          for: prod dependency gatsby-cli@"^2.12.91"
          from: gatsby@2.24.53 at node_modules/gatsby
            for: prod dependency gatsby@""
            from: the root project
  and: peer dependency react@"^16.0.0"
  from: react-dom@16.8.1 at node_modules/gatsby-recipes/node_modules/react-dom
    for: peer dependency react-dom@"16.8.1"
    from: gatsby-interface@0.0.166 at node_modules/gatsby-recipes/node_modules/gatsby-interface
      for: prod dependency gatsby-interface@"^0.0.166"
      from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
        for: prod dependency gatsby-recipes@"^0.2.20"
        from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
          for: prod dependency gatsby-cli@"^2.12.91"
          from: gatsby@2.24.53 at node_modules/gatsby
            for: prod dependency gatsby@""
            from: the root project
    and: peer dependency react-dom@"^16.4.2"
    from: gatsby@2.6.0 at node_modules/gatsby-recipes/node_modules/gatsby
      for: peer dependency gatsby@"2.6.0"
      from: gatsby-interface@0.0.166 at node_modules/gatsby-recipes/node_modules/gatsby-interface
        for: prod dependency gatsby-interface@"^0.0.166"
        from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
          for: prod dependency gatsby-recipes@"^0.2.20"
          from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
            for: prod dependency gatsby-cli@"^2.12.91"
            from: gatsby@2.24.53 at node_modules/gatsby
              for: prod dependency gatsby@""
              from: the root project
    and: peer dependency react-dom@"^0.14.0 || ^15.0.0 || ^16.0.0"
    from: gatsby-react-router-scroll@2.3.1 at node_modules/gatsby-recipes/node_modules/gatsby-react-router-scroll
      for: prod dependency gatsby-react-router-scroll@"^2.0.7"
      from: gatsby@2.6.0 at node_modules/gatsby-recipes/node_modules/gatsby
        for: peer dependency gatsby@"2.6.0"
        from: gatsby-interface@0.0.166 at node_modules/gatsby-recipes/node_modules/gatsby-interface
          for: prod dependency gatsby-interface@"^0.0.166"
          from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
            for: prod dependency gatsby-recipes@"^0.2.20"
            from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
              for: prod dependency gatsby-cli@"^2.12.91"
              from: gatsby@2.24.53 at node_modules/gatsby
                for: prod dependency gatsby@""
                from: the root project
  and: peer dependency react@"*"
  from: react-icons@3.11.0 at node_modules/react-icons
    for: prod dependency react-icons@"^3.0.1"
    from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
      for: prod dependency gatsby-recipes@"^0.2.20"
      from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
        for: prod dependency gatsby-cli@"^2.12.91"
        from: gatsby@2.24.53 at node_modules/gatsby
          for: prod dependency gatsby@""
          from: the root project
    and: peer dependency react-icons@"^3.2.1"
    from: gatsby-interface@0.0.166 at node_modules/gatsby-recipes/node_modules/gatsby-interface
      for: prod dependency gatsby-interface@"^0.0.166"
      from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
        for: prod dependency gatsby-recipes@"^0.2.20"
        from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
          for: prod dependency gatsby-cli@"^2.12.91"
          from: gatsby@2.24.53 at node_modules/gatsby
            for: prod dependency gatsby@""
            from: the root project
  and: peer dependency react@">=16.8.0"
  from: ink-box@1.0.0 at node_modules/ink-box
    for: prod dependency ink-box@"^1.0.0"
    from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
      for: prod dependency gatsby-recipes@"^0.2.20"
      from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
        for: prod dependency gatsby-cli@"^2.12.91"
        from: gatsby@2.24.53 at node_modules/gatsby
          for: prod dependency gatsby@""
          from: the root project
  and: peer dependency react@"^0.14.0 || ^15.0.0 || ^16.0.0"
  from: react-circular-progressbar@2.0.3 at node_modules/react-circular-progressbar
    for: prod dependency react-circular-progressbar@"^2.0.0"
    from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
      for: prod dependency gatsby-recipes@"^0.2.20"
      from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
        for: prod dependency gatsby-cli@"^2.12.91"
        from: gatsby@2.24.53 at node_modules/gatsby
          for: prod dependency gatsby@""
          from: the root project
  and: peer dependency react@"^16.13.1"
  from: react-reconciler@0.25.1 at node_modules/react-reconciler
    for: prod dependency react-reconciler@"^0.25.1"
    from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
      for: prod dependency gatsby-recipes@"^0.2.20"
      from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
        for: prod dependency gatsby-cli@"^2.12.91"
        from: gatsby@2.24.53 at node_modules/gatsby
          for: prod dependency gatsby@""
          from: the root project
  and: peer dependency react@">= 16.8.0"
  from: urql@1.10.0 at node_modules/urql
    for: prod dependency urql@"^1.9.7"
    from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
      for: prod dependency gatsby-recipes@"^0.2.20"
      from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
        for: prod dependency gatsby-cli@"^2.12.91"
        from: gatsby@2.24.53 at node_modules/gatsby
          for: prod dependency gatsby@""
          from: the root project
  and: peer dependency react@">=16.3.0"
  from: @emotion/styled-base@10.0.31 at node_modules/@emotion/styled-base
    for: prod dependency @emotion/styled-base@"^10.0.27"
    from: @emotion/styled@10.0.27 at node_modules/@emotion/styled
      for: prod dependency @emotion/styled@"^10.0.14"
      from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
        for: prod dependency gatsby-recipes@"^0.2.20"
        from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
          for: prod dependency gatsby-cli@"^2.12.91"
          from: gatsby@2.24.53 at node_modules/gatsby
            for: prod dependency gatsby@""
            from: the root project
      and: peer dependency @emotion/styled@"^10.0.14"
      from: gatsby-interface@0.0.166 at node_modules/gatsby-recipes/node_modules/gatsby-interface
        for: prod dependency gatsby-interface@"^0.0.166"
        from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
          for: prod dependency gatsby-recipes@"^0.2.20"
          from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
            for: prod dependency gatsby-cli@"^2.12.91"
            from: gatsby@2.24.53 at node_modules/gatsby
              for: prod dependency gatsby@""
              from: the root project
  and: peer dependency react@"^16.0.0"
  from: react-reconciler@0.24.0 at node_modules/ink/node_modules/react-reconciler
    for: prod dependency react-reconciler@"^0.24.0"
    from: ink@2.7.1 at node_modules/ink
      for: prod dependency ink@"^2.7.1"
      from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
        for: prod dependency gatsby-cli@"^2.12.91"
        from: gatsby@2.24.53 at node_modules/gatsby
          for: prod dependency gatsby@""
          from: the root project
      and: peer dependency ink@"^2.0.0"
      from: ink-spinner@3.1.0 at node_modules/ink-spinner
        for: prod dependency ink-spinner@"^3.1.0"
        from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
          for: prod dependency gatsby-cli@"^2.12.91"
          from: gatsby@2.24.53 at node_modules/gatsby
            for: prod dependency gatsby@""
            from: the root project
      and: peer dependency ink@">=2.0.0"
      from: ink-box@1.0.0 at node_modules/ink-box
        for: prod dependency ink-box@"^1.0.0"
        from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
          for: prod dependency gatsby-recipes@"^0.2.20"
          from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
            for: prod dependency gatsby-cli@"^2.12.91"
            from: gatsby@2.24.53 at node_modules/gatsby
              for: prod dependency gatsby@""
              from: the root project
  and: peer dependency react@"^0.14.0 || ^15.0.0 || ^16.0.0"
  from: gatsby-react-router-scroll@2.3.1 at node_modules/gatsby-recipes/node_modules/gatsby-react-router-scroll
    for: prod dependency gatsby-react-router-scroll@"^2.0.7"
    from: gatsby@2.6.0 at node_modules/gatsby-recipes/node_modules/gatsby
      for: peer dependency gatsby@"2.6.0"
      from: gatsby-interface@0.0.166 at node_modules/gatsby-recipes/node_modules/gatsby-interface
        for: prod dependency gatsby-interface@"^0.0.166"
        from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
          for: prod dependency gatsby-recipes@"^0.2.20"
          from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
            for: prod dependency gatsby-cli@"^2.12.91"
            from: gatsby@2.24.53 at node_modules/gatsby
              for: prod dependency gatsby@""
              from: the root project
  and: peer dependency react@"^16.13.1"
  from: @mdx-js/react@1.6.16 at node_modules/gatsby-recipes/node_modules/gatsby-interface/node_modules/@mdx-js/react
    for: prod dependency @mdx-js/react@"^1.5.2"
    from: gatsby-interface@0.0.166 at node_modules/gatsby-recipes/node_modules/gatsby-interface
      for: prod dependency gatsby-interface@"^0.0.166"
      from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
        for: prod dependency gatsby-recipes@"^0.2.20"
        from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
          for: prod dependency gatsby-cli@"^2.12.91"
          from: gatsby@2.24.53 at node_modules/gatsby
            for: prod dependency gatsby@""
            from: the root project

Could not add conflicting dependency: react@16.8.1 at node_modules/react
  for: peer dependency react@"16.8.1"
  from: gatsby-interface@0.0.166 at node_modules/gatsby-recipes/node_modules/gatsby-interface
    for: prod dependency gatsby-interface@"^0.0.166"
    from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
      for: prod dependency gatsby-recipes@"^0.2.20"
      from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
        for: prod dependency gatsby-cli@"^2.12.91"
        from: gatsby@2.24.53 at node_modules/gatsby
          for: prod dependency gatsby@""
          from: the root project

Fix the upstream dependency conflict, or retry
this command with --legacy-peer-deps or --force
to accept an incorrect (and potentially broken) dependency resolution.

Raw JSON explanation object:

{
  "name": "gatsby",
  "json": true
}

`

exports[`test/lib/utils/explain-eresolve.js TAP gatsby > report with color 1`] = `
While resolving: [1mgatsby-interface[22m@[1m0.0.166[22m
Found: [1mreact[22m@[1m16.13.1[22m[2m at node_modules/react[22m
  for: peer dependency [1mreact[22m@"[1m^16.4.2[22m"
  from: [1mgatsby[22m@[1m2.24.53[22m[2m at node_modules/gatsby[22m
    for: prod dependency [1mgatsby[22m@""
    from: the root project
  and: peer dependency [1mreact[22m@"[1m^16.13.1[22m"
  from: [1mreact-dom[22m@[1m16.13.1[22m[2m at node_modules/react-dom[22m
    for: peer dependency [1mreact-dom[22m@"[1m^16.4.2[22m"
    from: [1mgatsby[22m@[1m2.24.53[22m[2m at node_modules/gatsby[22m
      for: prod dependency [1mgatsby[22m@""
      from: the root project
    and: peer dependency [1mreact-dom[22m@"[1m15.x || 16.x || 16.4.0-alpha.0911da3[22m"
    from: [1m@reach/router[22m@[1m1.3.4[22m[2m at node_modules/@reach/router[22m
      for: prod dependency [1m@reach/router[22m@"[1m^1.3.4[22m"
      from: [1mgatsby[22m@[1m2.24.53[22m[2m at node_modules/gatsby[22m
        for: prod dependency [1mgatsby[22m@""
        from: the root project
      and: 2 more (gatsby-link, gatsby-react-router-scroll)
    and: 3 more (gatsby-link, gatsby-react-router-scroll, react-hot-loader)
  and: 25 more (@reach/router, gatsby-cli, gatsby-link, gatsby-react-router-scroll, react-hot-loader, ...)

Could not add conflicting dependency: [1mreact[22m@[1m16.8.1[22m[2m at node_modules/react[22m
  for: peer dependency [1mreact[22m@"[1m16.8.1[22m"
  from: [1mgatsby-interface[22m@[1m0.0.166[22m[2m at node_modules/gatsby-recipes/node_modules/gatsby-interface[22m
    for: prod dependency [1mgatsby-interface[22m@"[1m^0.0.166[22m"
    from: [1mgatsby-recipes[22m@[1m0.2.20[22m[2m at node_modules/gatsby-recipes[22m
      for: prod dependency [1mgatsby-recipes[22m@"[1m^0.2.20[22m"
      from: [1mgatsby-cli[22m@[1m2.12.91[22m[2m at node_modules/gatsby-cli[22m
        for: prod dependency [1mgatsby-cli[22m@"[1m^2.12.91[22m"
        from: [1mgatsby[22m@[1m2.24.53[22m[2m at node_modules/gatsby[22m

Fix the upstream dependency conflict, or retry
this command with --legacy-peer-deps or --force
to accept an incorrect (and potentially broken) dependency resolution.

See \${REPORT} for a full report.
`

exports[`test/lib/utils/explain-eresolve.js TAP gatsby > report with color, depth only 2 1`] = `
While resolving: [1mgatsby-interface[22m@[1m0.0.166[22m
Found: [1mreact[22m@[1m16.13.1[22m[2m at node_modules/react[22m
  for: peer dependency [1mreact[22m@"[1m^16.4.2[22m"
  from: [1mgatsby[22m@[1m2.24.53[22m[2m at node_modules/gatsby[22m
    for: prod dependency [1mgatsby[22m@""
    from: the root project
  and: 26 more (react-dom, @reach/router, gatsby-cli, gatsby-link, gatsby-react-router-scroll, ...)

Could not add conflicting dependency: [1mreact[22m@[1m16.8.1[22m[2m at node_modules/react[22m
  for: peer dependency [1mreact[22m@"[1m16.8.1[22m"
  from: [1mgatsby-interface[22m@[1m0.0.166[22m[2m at node_modules/gatsby-recipes/node_modules/gatsby-interface[22m
    for: prod dependency [1mgatsby-interface[22m@"[1m^0.0.166[22m"
    from: [1mgatsby-recipes[22m@[1m0.2.20[22m[2m at node_modules/gatsby-recipes[22m

Fix the upstream dependency conflict, or retry
this command with --legacy-peer-deps or --force
to accept an incorrect (and potentially broken) dependency resolution.

See \${REPORT} for a full report.
`

exports[`test/lib/utils/explain-eresolve.js TAP gatsby > report with no color, depth of 6 1`] = `
While resolving: gatsby-interface@0.0.166
Found: react@16.13.1 at node_modules/react
  for: peer dependency react@"^16.4.2"
  from: gatsby@2.24.53 at node_modules/gatsby
    for: prod dependency gatsby@""
    from: the root project
  and: peer dependency react@"^16.13.1"
  from: react-dom@16.13.1 at node_modules/react-dom
    for: peer dependency react-dom@"^16.4.2"
    from: gatsby@2.24.53 at node_modules/gatsby
      for: prod dependency gatsby@""
      from: the root project
    and: peer dependency react-dom@"15.x || 16.x || 16.4.0-alpha.0911da3"
    from: @reach/router@1.3.4 at node_modules/@reach/router
      for: prod dependency @reach/router@"^1.3.4"
      from: gatsby@2.24.53 at node_modules/gatsby
        for: prod dependency gatsby@""
        from: the root project
      and: peer dependency @reach/router@"^1.3.3"
      from: gatsby-link@2.4.13 at node_modules/gatsby-link
        for: prod dependency gatsby-link@"^2.4.13"
        from: gatsby@2.24.53 at node_modules/gatsby
          for: prod dependency gatsby@""
          from: the root project
      and: 1 more (gatsby-react-router-scroll)
    and: peer dependency react-dom@"^16.4.2"
    from: gatsby-link@2.4.13 at node_modules/gatsby-link
      for: prod dependency gatsby-link@"^2.4.13"
      from: gatsby@2.24.53 at node_modules/gatsby
        for: prod dependency gatsby@""
        from: the root project
    and: 2 more (gatsby-react-router-scroll, react-hot-loader)
  and: peer dependency react@"15.x || 16.x || 16.4.0-alpha.0911da3"
  from: @reach/router@1.3.4 at node_modules/@reach/router
    for: prod dependency @reach/router@"^1.3.4"
    from: gatsby@2.24.53 at node_modules/gatsby
      for: prod dependency gatsby@""
      from: the root project
    and: peer dependency @reach/router@"^1.3.3"
    from: gatsby-link@2.4.13 at node_modules/gatsby-link
      for: prod dependency gatsby-link@"^2.4.13"
      from: gatsby@2.24.53 at node_modules/gatsby
        for: prod dependency gatsby@""
        from: the root project
    and: peer dependency @reach/router@"^1.0.0"
    from: gatsby-react-router-scroll@3.0.12 at node_modules/gatsby-react-router-scroll
      for: prod dependency gatsby-react-router-scroll@"^3.0.12"
      from: gatsby@2.24.53 at node_modules/gatsby
        for: prod dependency gatsby@""
        from: the root project
  and: 24 more (gatsby-cli, gatsby-link, gatsby-react-router-scroll, react-hot-loader, create-react-context, ...)

Could not add conflicting dependency: react@16.8.1 at node_modules/react
  for: peer dependency react@"16.8.1"
  from: gatsby-interface@0.0.166 at node_modules/gatsby-recipes/node_modules/gatsby-interface
    for: prod dependency gatsby-interface@"^0.0.166"
    from: gatsby-recipes@0.2.20 at node_modules/gatsby-recipes
      for: prod dependency gatsby-recipes@"^0.2.20"
      from: gatsby-cli@2.12.91 at node_modules/gatsby-cli
        for: prod dependency gatsby-cli@"^2.12.91"
        from: gatsby@2.24.53 at node_modules/gatsby
          for: prod dependency gatsby@""
          from: the root project

Fix the upstream dependency conflict, or retry
this command with --legacy-peer-deps or --force
to accept an incorrect (and potentially broken) dependency resolution.

See \${REPORT} for a full report.
`

exports[`test/lib/utils/explain-eresolve.js TAP withShrinkwrap > explain with color 1`] = `
While resolving: [1m@isaacs/peer-dep-cycle-b[22m@[1m1.0.0[22m
Found: [1m@isaacs/peer-dep-cycle-c[22m@[1m2.0.0[22m[2m at node_modules/@isaacs/peer-dep-cycle-c[22m
  for: prod dependency [1m@isaacs/peer-dep-cycle-c[22m@"[1m2.x[22m"
  from: the root project

Could not add conflicting dependency: [1m@isaacs/peer-dep-cycle-c[22m@[1m1.0.0[22m[2m at node_modules/@isaacs/peer-dep-cycle-c[22m
  for: peer dependency [1m@isaacs/peer-dep-cycle-c[22m@"[1m1[22m"
  from: [1m@isaacs/peer-dep-cycle-b[22m@[1m1.0.0[22m[2m at node_modules/@isaacs/peer-dep-cycle-b[22m
    for: peer dependency [1m@isaacs/peer-dep-cycle-b[22m@"[1m1[22m"
    from: [1m@isaacs/peer-dep-cycle-a[22m@[1m1.0.0[22m[2m at node_modules/@isaacs/peer-dep-cycle-a[22m
`

exports[`test/lib/utils/explain-eresolve.js TAP withShrinkwrap > explain with no color, depth of 6 1`] = `
While resolving: @isaacs/peer-dep-cycle-b@1.0.0
Found: @isaacs/peer-dep-cycle-c@2.0.0 at node_modules/@isaacs/peer-dep-cycle-c
  for: prod dependency @isaacs/peer-dep-cycle-c@"2.x"
  from: the root project

Could not add conflicting dependency: @isaacs/peer-dep-cycle-c@1.0.0 at node_modules/@isaacs/peer-dep-cycle-c
  for: peer dependency @isaacs/peer-dep-cycle-c@"1"
  from: @isaacs/peer-dep-cycle-b@1.0.0 at node_modules/@isaacs/peer-dep-cycle-b
    for: peer dependency @isaacs/peer-dep-cycle-b@"1"
    from: @isaacs/peer-dep-cycle-a@1.0.0 at node_modules/@isaacs/peer-dep-cycle-a
      for: prod dependency @isaacs/peer-dep-cycle-a@"1.x"
      from: the root project
`

exports[`test/lib/utils/explain-eresolve.js TAP withShrinkwrap > report 1`] = `
# npm resolution error report

\${TIME}

While resolving: @isaacs/peer-dep-cycle-b@1.0.0
Found: @isaacs/peer-dep-cycle-c@2.0.0 at node_modules/@isaacs/peer-dep-cycle-c
  for: prod dependency @isaacs/peer-dep-cycle-c@"2.x"
  from: the root project

Could not add conflicting dependency: @isaacs/peer-dep-cycle-c@1.0.0 at node_modules/@isaacs/peer-dep-cycle-c
  for: peer dependency @isaacs/peer-dep-cycle-c@"1"
  from: @isaacs/peer-dep-cycle-b@1.0.0 at node_modules/@isaacs/peer-dep-cycle-b
    for: peer dependency @isaacs/peer-dep-cycle-b@"1"
    from: @isaacs/peer-dep-cycle-a@1.0.0 at node_modules/@isaacs/peer-dep-cycle-a
      for: prod dependency @isaacs/peer-dep-cycle-a@"1.x"
      from: the root project

Fix the upstream dependency conflict, or retry
this command with --legacy-peer-deps or --force
to accept an incorrect (and potentially broken) dependency resolution.

Raw JSON explanation object:

{
  "name": "withShrinkwrap",
  "json": true
}

`

exports[`test/lib/utils/explain-eresolve.js TAP withShrinkwrap > report with color 1`] = `
While resolving: [1m@isaacs/peer-dep-cycle-b[22m@[1m1.0.0[22m
Found: [1m@isaacs/peer-dep-cycle-c[22m@[1m2.0.0[22m[2m at node_modules/@isaacs/peer-dep-cycle-c[22m
  for: prod dependency [1m@isaacs/peer-dep-cycle-c[22m@"[1m2.x[22m"
  from: the root project

Could not add conflicting dependency: [1m@isaacs/peer-dep-cycle-c[22m@[1m1.0.0[22m[2m at node_modules/@isaacs/peer-dep-cycle-c[22m
  for: peer dependency [1m@isaacs/peer-dep-cycle-c[22m@"[1m1[22m"
  from: [1m@isaacs/peer-dep-cycle-b[22m@[1m1.0.0[22m[2m at node_modules/@isaacs/peer-dep-cycle-b[22m
    for: peer dependency [1m@isaacs/peer-dep-cycle-b[22m@"[1m1[22m"
    from: [1m@isaacs/peer-dep-cycle-a[22m@[1m1.0.0[22m[2m at node_modules/@isaacs/peer-dep-cycle-a[22m
      for: prod dependency [1m@isaacs/peer-dep-cycle-a[22m@"[1m1.x[22m"
      from: the root project

Fix the upstream dependency conflict, or retry
this command with --legacy-peer-deps or --force
to accept an incorrect (and potentially broken) dependency resolution.

See \${REPORT} for a full report.
`

exports[`test/lib/utils/explain-eresolve.js TAP withShrinkwrap > report with color, depth only 2 1`] = `
While resolving: [1m@isaacs/peer-dep-cycle-b[22m@[1m1.0.0[22m
Found: [1m@isaacs/peer-dep-cycle-c[22m@[1m2.0.0[22m[2m at node_modules/@isaacs/peer-dep-cycle-c[22m
  for: prod dependency [1m@isaacs/peer-dep-cycle-c[22m@"[1m2.x[22m"
  from: the root project

Could not add conflicting dependency: [1m@isaacs/peer-dep-cycle-c[22m@[1m1.0.0[22m[2m at node_modules/@isaacs/peer-dep-cycle-c[22m
  for: peer dependency [1m@isaacs/peer-dep-cycle-c[22m@"[1m1[22m"
  from: [1m@isaacs/peer-dep-cycle-b[22m@[1m1.0.0[22m[2m at node_modules/@isaacs/peer-dep-cycle-b[22m
    for: peer dependency [1m@isaacs/peer-dep-cycle-b[22m@"[1m1[22m"
    from: [1m@isaacs/peer-dep-cycle-a[22m@[1m1.0.0[22m[2m at node_modules/@isaacs/peer-dep-cycle-a[22m

Fix the upstream dependency conflict, or retry
this command with --legacy-peer-deps or --force
to accept an incorrect (and potentially broken) dependency resolution.

See \${REPORT} for a full report.
`

exports[`test/lib/utils/explain-eresolve.js TAP withShrinkwrap > report with no color, depth of 6 1`] = `
While resolving: @isaacs/peer-dep-cycle-b@1.0.0
Found: @isaacs/peer-dep-cycle-c@2.0.0 at node_modules/@isaacs/peer-dep-cycle-c
  for: prod dependency @isaacs/peer-dep-cycle-c@"2.x"
  from: the root project

Could not add conflicting dependency: @isaacs/peer-dep-cycle-c@1.0.0 at node_modules/@isaacs/peer-dep-cycle-c
  for: peer dependency @isaacs/peer-dep-cycle-c@"1"
  from: @isaacs/peer-dep-cycle-b@1.0.0 at node_modules/@isaacs/peer-dep-cycle-b
    for: peer dependency @isaacs/peer-dep-cycle-b@"1"
    from: @isaacs/peer-dep-cycle-a@1.0.0 at node_modules/@isaacs/peer-dep-cycle-a
      for: prod dependency @isaacs/peer-dep-cycle-a@"1.x"
      from: the root project

Fix the upstream dependency conflict, or retry
this command with --legacy-peer-deps or --force
to accept an incorrect (and potentially broken) dependency resolution.

See \${REPORT} for a full report.
`
