[![NPM](https://nodei.co/npm/marked-man.png?downloads=true)](https://nodei.co/npm/marked-man/)

marked-man(1) -- markdown to roff
=================================

SYNOPSIS
--------

```
marked-man README.md > doc/marked-man.1
```

See [marked README](https://github.com/chjj/marked) for documentation about how to use marked.

Note that `marked-man --format=html` is the same as `marked`.


DESCRIPTION
-----------

`marked-man` wraps `marked` to extend it with groff output support in order to
create Unix manual pages for use with `man`.


OPTIONS
-------

`marked-man` invokes `marked --gfm --sanitize`, and you can pass additional
options through.  
The `--breaks` option, which retains intra-paragraph line breaks, can be helpful to match default ronn behavior.

`marked-man` adds some options to `marked`'s existing options:

* `--format <format>`  
Sets the output format. Outputs html if different from `roff`.  
Defaults to `roff`.

* `--name <name>`  
The name shown in the manpage header, if it isn't given in the ronn header like in this README.  
Defaults to empty string.

* `--section <section>`  
The section number shown in the manpage header, if it isn't given in the ronn header like in this README.  
Defaults to empty string.

* `--version <version>`  
The version shown in the manpage footer.  
Defaults to empty string.  
Breaking change in marked-man 0.7.0: this flag is converted to manVersion option,
to avoid conflict with marked.

* `--manual <manual>`  
The manual-group name shown in the manpage header.  
Defaults to empty string.

* `--date <date>`  
The date shown in the manpage header.  
Defaults to now, must be acceptable to `new Date(string or timestamp)`.



INSTALLATION
------------

From the [npm registry](https://npmjs.com):

* locally (`--save`, `--save-dev`, or `--save-optional` add `marked-man` to your `package.json` file as a runtime, development-time, or optional runtime dependency, respectively)

        npm install marked-man [--save|--save-dev|--save-optional]
    
* globally (puts `marked-man` in your system's path):

        [sudo] npm install marked-man -g

EXAMPLE
-------

To view this README as a man page, run something like the following:

    marked-man --version v0.1.0 --manual 'Man Utilities' README.md | man /dev/stdin

SEE ALSO
--------

[Ronn](https://github.com/rtomayko/ronn)


REPORTING BUGS
--------------

See [marked-man repository](https://github.com/kapouer/marked-man).
