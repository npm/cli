// Sample dependency-explanation objects attached to install resolution
// errors. Edge-shaped objects come from `edge.explain()` (ETARGET,
// EALLOWREMOTE/EALLOWGIT, tarball/network, EINCOMPLETEMANIFEST). The array of
// node-shaped objects comes from `node.explain()` (ESTRICTALLOWSCRIPTS).
module.exports = {
  // a direct, top-level dependency request that failed to resolve
  directEdge: {
    type: 'prod',
    name: 'foo',
    spec: '^9.9.9',
    from: {
      location: '/some/project',
    },
  },

  // a transitive dependency request, requested via a chain of dependents
  transitiveEdge: {
    type: 'prod',
    name: 'foo',
    spec: '^9.9.9',
    from: {
      name: 'bar',
      version: '1.0.0',
      location: 'node_modules/bar',
      dependents: [
        {
          type: 'prod',
          name: 'bar',
          spec: '^1.0.0',
          from: {
            name: 'baz',
            version: '2.0.0',
            location: 'node_modules/baz',
            dependents: [
              {
                type: 'dev',
                name: 'baz',
                spec: '^2.0.0',
                from: { location: '/some/project' },
              },
            ],
          },
        },
      ],
    },
  },

  // a git/remote dependency blocked by an allow-* policy
  remoteEdge: {
    type: 'prod',
    name: 'sketchy',
    spec: 'github:foo/sketchy',
    from: {
      name: 'middle',
      version: '3.1.4',
      location: 'node_modules/middle',
      dependents: [
        {
          type: 'prod',
          name: 'middle',
          spec: '^3.0.0',
          from: { location: '/some/project' },
        },
      ],
    },
  },

  // EBADPLATFORM/EBADENGINE: a single node explanation for a package that
  // resolved fine but is incompatible with the current OS/CPU/engine
  incompatibleNode: {
    name: 'fsevents',
    version: '2.3.3',
    location: 'node_modules/fsevents',
    dependents: [
      {
        type: 'prod',
        name: 'fsevents',
        spec: '^2.3.0',
        from: {
          name: 'chokidar',
          version: '3.6.0',
          location: 'node_modules/chokidar',
          dependents: [
            {
              type: 'dev',
              name: 'chokidar',
              spec: '^3.0.0',
              from: { location: '/some/project' },
            },
          ],
        },
      },
    ],
  },

  // ESTRICTALLOWSCRIPTS: an array of node explanations, one per unreviewed pkg
  strictScripts: [
    {
      name: 'has-install-script',
      version: '1.2.3',
      location: 'node_modules/has-install-script',
      dependents: [
        {
          type: 'prod',
          name: 'has-install-script',
          spec: '^1.0.0',
          from: { location: '/some/project' },
        },
      ],
    },
    {
      name: 'nested-install-script',
      version: '4.5.6',
      location: 'node_modules/parent/node_modules/nested-install-script',
      dependents: [
        {
          type: 'prod',
          name: 'nested-install-script',
          spec: '^4.0.0',
          from: {
            name: 'parent',
            version: '7.0.0',
            location: 'node_modules/parent',
            dependents: [
              {
                type: 'prod',
                name: 'parent',
                spec: '^7.0.0',
                from: { location: '/some/project' },
              },
            ],
          },
        },
      ],
    },
  ],
}
