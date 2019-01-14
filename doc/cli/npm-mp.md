npm-mp(1) -- Find and install required packages in a file or directory
======================================================================

## SYNOPSIS

    npm mp <folder>
    npm mp <file>

    common options: [i|install|c|check]

## DESCRIPTION

Missing-packages (mp) is a tool you will love to use whenever
you create a NodeJS package or work in team. It is used to check that all packages
used in a file or directory are well installed in the 'node_modules' directory.

The packages to install are read in from prompts.

It can be used when passing a folder from one person to another
and automatically detect what dependencies are required for the files in the folder
to work properly.

## CONFIGURATION

### check

Default: none

`check` is used whenever the purpose is only to know what dependency should be installed.

e.g.
  ```
  npm mp check ./folder1
  ```

### install

Default: true

`install` is used whenever the purpose is to install all dependencies used in
a file or folder that are missing in the `package.json`.

e.g.
  ```
  npm mp i ./file42.js
  ```

## SEE ALSO

* npm-registry(7)
* npm-config(1)
* npm-config(7)
* npmrc(5)
* npm-owner(1)
* npm-whoami(1)
