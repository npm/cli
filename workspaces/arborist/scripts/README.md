# Arborist Scripts

These are handy little test scripts to use while debugging and poking
around.

They're untested (or, in some sense, some of them _are_ tests, albeit ad
hoc ones for use when figuring out what a thing should even be), and really
moroe like spikes or examples than anything dependable or useful.

At some point it would be good to gather up some of this and turn it into a
proper `arb` executable.

* `actual.js` - Load the metadata about the modules on disk, and print
  it out nicely.  First argument is the path to load, defaults to `cwd`.
* `virtual.js` - Load the metadata from `npm-shrinkwrap.json`,
    `package-lock.json`, and/or `yarn-lock.json`, and print it out nicely.
    First argument is the path to load, defaults to `cwd`.
* `ideal.js` - Build the ideal tree from `package.json` and/or shrinkwrap
    and lockfile metadata.  First argument is the path to load, defaults to
    `cwd`.  You may also specify the following options:
    * `--quiet` - Do not print the result,
    * `--prefer-dedupe` - Prefer to deduplicate the tree rather than
        get the latest versions of dependencies.
    * `--add=<pkgname>[@<specifier>]` - Add the specified package to the
        root `dependencies` object.
    * `--rm=<pkgname>` - Remove the specified package from the root
        dependencies, devDependencies, optionalDependencies, and/or
        peerDependencies, if found in any of those locations.
* `license.js` - Scan the tree for license information and print it out.
    First argument is the path to look in, defaults to cwd.
* `funding.js` - Scan the tree for funding information and print it out.
    First argument is the path to look in, defaults to cwd.
