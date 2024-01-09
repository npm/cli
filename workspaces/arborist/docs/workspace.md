# workspaces

Conceptual install example:

```
root
+-- node_modules
|   +-- app => app
|   +-- a => pkgs/a
|   +-- b => pkgs/b
|   +-- c => pkgs/c
|   +-- x
|   +-- y
|   +-- z
|   +-- i
|   +-- n ?
|   +-- j
|   +-- k
+-- app
+-- pkgs
    +-- a (b, c, x, m@file:./m)
    |   +-- m (n)
    |   |   +-- node_modules
    |   |       +-- n ?
    |   +-- node_modules
    |       +-- n ?
    |       +-- m => pkgs/a/m
    |       +-- x
    |       +-- b => pkgs/b
    |       +-- c => pkgs/c
    +-- b (a, c, y)
    +-- c (a, b, z)
    +-- w (nested workspace)
        +-- pkgs
            +-- j
            +-- k
```

- `root/package.json`:

```json
{
  "workspaces": [
    "pkgs/*",
    "app"
  ]
}
```

root `Node`

- be aware it's a **Top-level workspace**
- 4 Edges in edgesOut with type=workspace, referencing workspace children
  - that means we create a link node in root.children.get('app')
    targeting `./app` Node, etc.
- during buildIdeal:
  - need to know that app is in root's workspace
    - app.wsParent = root
    - root.wsChildren.add(app)
  - if any dep CAN be satisfied by a named dep in the workspace, then
    create a Link targeting that workspace child node
      - resolving: _first_ check this.wsParent.get('dep-name'), and if
        that's ok, then resolve with a link to that target.
  - no hoisting by default: when doing `_canPlaceDep`, if target is
    node.wsParent, AND we're not hoisting, THEN: return CONFLICT
- When setting Node.parent or Node.fsParent, set wsParent = parent.wsParent

## Questions / Thoughts
- What a Workspace node class does?
  - Add metadata to lock files
  - Glob only relevant for loadActual
- maybe wsParent wsChildren
- when creating
- start with loadActual
  - loadActual.loadFSNode
  - on check for path is real add another check to make load from/as a workspace
- General impl ideas
  - Do we support an opt-out flag?
  - Do we want to add extra top-level commands to the cli?
    - `npm workspaces info`: Retrieves workspaces locations (might be useful for tooling)
  - What do we do with binaries? Do we only link bins for workspaces that are defined as a top-level dep?
  - In order to support subsets of packages the way Wes been advocating for, instead of supporting adjacent folders with package.json defining different workspaces, what if we were to support a different workspaces config definition within the top-level package.json - maybe something that allows for definition of subsets? something in the likes of:
  ```
  "workspaces": [
    "packages": {
      "set-a": [
        "packages/*"
      ],
      "set-b": [
        "express/express-namespace",
        "express/express"
      ]
    }
  ]
  ```
  - But then we'd need a way for commands to be aware of these subsets...

## Registry vs workspace relationship:

```
given that registry has latest: a@1.1.0

workspace-root
+-- packages
    +-- a (a@1.0.1)
    +-- b (a@^1.0.0)

npm install

workspace-root
+-- packages
    +-- a (a@1.0.1)
    +-- b (a@^1.0.0)
        +-- node_modules
            +-- a -> ../../a

workspaces always prefer to install a nested package if semver is satisfied
```

```
given that registry has latest: a@2.0.0

workspace-root
+-- packages
    +-- a@1.0.1
    +-- b (a@^2.0.0)

npm install

workspace-root
+-- packages
    +-- a@1.0.1
    +-- b (a@^2.0.0)
        +-- node_modules
            +-- a@2.0.0

workspaces will try to install deps from registry if no satisfying semver version was found within its nested packages
```

## Implementation

### Build Ideal Tree

1. Read list of "workpaces" from `package.json`
2. Turn globs into actual locations, retrieve the final list of workspaces paths
3. Arborist needs to be made aware of the list of worskpaces paths
  1. Workspace info parsed (steps 1 and 2) needs to be attached before build ideal tree
  2. On building ideal tree, checks against existing workspaces to append them as child nodes
  3. Edge needs to support a `workspace` type
  4. Edge `satisfiedBy` and/or the `dep-valid` module needs to check against the available workspaces
  5. `edgesOut` with `type: workspace`
4. Represent a workspace node within a tree - is it just `node.workspace` ?

NOTE:
- Now the build ideal tree is reading fs other than `package.json` and `package-lock`

### Load Virtual

1. How to figure out all the structure of workspaces form a pakcage-lock
  1. How it gets saved?
  2. How to build the virtual tree out of reading package-lock
2. maybe support a subset of glob? we need to optimize mapWorkspace regardless
3. lib/shrinkwrap.js has to be aware of workspaces and the structure
  1. Reading from lockfile might render nodes extraneous?
  2. include workspaces map into package-lock files
  3. loadVirtual reads from the lock file and put nodes in the right place


### Reify

1. Correctly symlink workspaces to its dependants `node_modules`

## Open Ended Questions

- Maybe do not hoist workspace dependencies by default?

## Missing:
- Nested workspaces
  - Add support to `mapWorkspaces` in buildIdealTree `_linkFromSpec`
  - Tests
- Test case with a mixed relationship between `file:` deps and workspaces
