# Running npm commands in the context of a workspace

## API

Top-level command that serves as a shortcut to run a top-level command in **all** configured workspaces:

```sh
$ npm wsc test
```

By using the `--workspace` / `-w` config option, will serve as a shortcut to channelling a specific command to `npm wsc`:

```sh
$ npm test -w=workspace-a
```

## Commands

When running commands across workspaces each command might need tweaking to behave as expected from a user point of view.

### npm diff

Same as `cd workspace-a && npm diff` ?

NOTE: if two `--diff` args are used than the current working directory makes no functional change.

### npm dist-tag (no args)

Same as `cd workspace-a && npm dist-tag` ?

### npm exec (no args)

Same as `cd workspace-a && npm exec` ?

### npm explain

Should trim loadActual tree that starts at the node `./workspace-a/`.

### npm fund

Sets Arb.path to point to the workspace path.

### npm init

Should it create a new workspace?

### npm ls

Is it the equivalent of `cd workspace-a && npm ls` OR `npm ls workspace-a` ?

### npm pack

Same as `cd workspace-a && npm pack` ?

### npm publish

Same as `cd workspace-a && npm publish` ? This one in particular feel like there might need other tweaks?

### npm outdated

Sets Arb.path to point to the workspace path. More tweaks?

List deps of workspaces the same way we list direct deps of the project today.

### npm run-script|restart|start|stop|test

Run the script in the given workspace `path`.

- Should not fail if script missing?
  e.g:
    npm ws run build
    - if no build script anywhere FAILS
    - if theres one or more build script: SUCCEED, ignore missing
- Should it just append `./node_modules/.bin` to `$PATH`?
- Should it cwd to workspace folder?

### npm rebuild

Same as `npm rebuild workspace-a` ?

### npm view

Same as `cd workspaces-a && npm view`

### npm ci|dedupe|find-dupes|prune|install|uninstall|update

**Primarily Arborist commands**

Use a different arborist API that:
- Run a complete `buildIdealTree`.
- Only reify's that workspace and its branch of the install tree.
- Updates `./workspace-a/package.json` file

`Arborist.filteredReify()` ?
`Arborist.reify({ workspaces|filteredPaths: [] })`

### Arborist.loadActual:
- ls / fund / outdated / explain
- filtered load actual API

### Categories:
- Arborist.loadActual filtered cmd
- Arborist.reify filtered cmd
- cd <ws> && npm <cmd>
- Others? Custom impl?
- Makes no sense to run in a workspaces env, should probably exit with an error code

### Random Ideas:
- `npm ws` prints out supported commands?
