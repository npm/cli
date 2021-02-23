### Syntax

- `npm ws fund` (runs a top-level cmd in all configured workspaces)
- `npm ws fund --workspace=a` (runs a top-level cmd in the context of a workspace)
- `npm fund -w a` (top-level `ws` becomes redundant if using `-w` and may be omitted)

Adding a top-level `workspaces|ws` command should abstract enough the implementation to make it flexible enough to accomodate future tweaks in the workspace installing algorithm.

[Update]: Maybe add a separate top-level command for configuration management? e.g: `npm wsc add|rm|ls`

#### Where to start?
- [ ] Add new `workspaces|ws` command/alias
- [ ] Add new folder `./lib/workspaces/*.js`
- [ ] Add default behavior that sets `prefix` to top-level commands under `./lib/workspaces/default.js`
- [ ] Add `ws run-script`
- [ ] Add `ws install` (ie. **scoped installs**)
- [ ] Add `ws install <pkg>`
- [ ] Add `ws ci`
- [ ] Add `ws update`
- [ ] Add `ws uninstall`
- [ ] Add `ws outdated` (ie. `cd ./ && npm outdated`, might need tweaking Arborist to only load from a specific tree node)
- [ ] Add `ws ls` (ie. `cd ./ && npm ls`)
- [ ] Add ``

#### What should happen?
- [ ] Should run commands over multiple workspaces
  * (no args) run command across **all** workspaces
  * (`-w=<workspace-name>` named option) filter by only defined names
- [ ] Should support `--parallel` (defaults to `--serial`)
- ref. https://www.npmjs.com/package/npm-run-all

#### What happens under the hood?

```
./lib/workspaces.js `npm workspaces|ws`
./lib/workspaces/default.js <- default... tries `prefix` + <command> / warn if we couldn't do anything...
./lib/workspaces/install.js <- some cmds require special logic
./lib/workspaces/publish.js <- would set `prefix` & then include ./lib/publish.js
...

# The default behavior is to run the command setting the prefix to workspace realpath, e.g:
npm ws publish -w name
# Might be effectively the same as:
npm publish --prefix=<workspace-name>
# Assuming `npm publish` is a command that won't need special tweaks/impl

npm ws install -w name
#      ^--- "scoped install": *only* reify the packages for the workspace defined, e.g:

root:
dependencies:
  d@1.0.0
workspaces:
  a -> foo@^1.0.0 -> c@1
  b -> foo@^1.0.1 -> c@2
  
$ npm ws install -w a
node_modules
+- a -> ../a
+- c@2
+- foo@1.0.1
# NOTE: just be mindful of deduping (ie. you'd get c@2 if all workspaces
# were being installed... you should still get it if you only specify `a`)
# NOTE2: arborist will not place `d` within `node_modules` for
# a "scoped install"

# Adding a new dep to a workspace:
$ npm ws install -w <workspace-name> <pkg> -> ./lib/workspaces/install.js 
#                                  ^--- <pkg> will be installed as a
#                                       dep of workspace-name
```

#### Adding a new dep to a workspace:

```
npm install <pkg>
Arborist
root:
  - <pkg> <-- add user request
 
npm ws install <pkg> -w <workspace-name>
Arborist
root:
  - workspace-name:
    - <pkg> <-- add user request under workspace-name instead
```

#### API: 

```
npm ws <command> -w|--workspace=<pkg-name|group-alias>
```

#### Groups:

A simple way to refer to a set of workspace by using a single name, e.g:

```
.
+- core
  +- foo
+- plugins
  +- lorem
  +- ipsum
```

With a root `package.json` defining both workspaces packages and groups:
```json
{
    "name": "workspace-example",
    "version": "1.0.0",
    "workspaces": {
        "groups": {
            "plugins": ["lorem", "ipsum"],
            "common": ["foo"]
        },
        "packages": [
            "core/*",
            "plugins/*"
        ]
    }
}
```

Running: `npm ws install abbrev -w plugins` effectively means adding abbrev as a dep to both `lorem` and `ipsum` and reifying the tree.
