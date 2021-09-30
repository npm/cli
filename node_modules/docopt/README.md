`docopt` – a command line option parser that will make you smile [![Build Status](https://travis-ci.org/stuartcarnie/docopt.coffee.svg)](https://travis-ci.org/stuartcarnie/docopt.coffee)
===============================================================

> [docopt](http://docopt.org) is a language for description of command-line
> interfaces. This is `docopt` implementation in CoffeeScript, that could
> be used for server-side CoffeeScript and JavaScript programs.

Isn't it awesome how modern command-line arguments parsers generate
help message based on your code?!

**Hell no!**  You know what's awesome?  When the option parser *is* generated
based on the help message that you write yourself!  This way you don't need to 
write this stupid repeatable parser-code, and instead can write a beautiful 
help message (the way you want it!), which adds readability to your code.

Now you can write an awesome, readable, clean, DRY code like *this*:

```coffeescript
doc = """
Usage:
  quick_example.coffee tcp <host> <port> [--timeout=<seconds>]
  quick_example.coffee serial <port> [--baud=9600] [--timeout=<seconds>]
  quick_example.coffee -h | --help | --version

"""
{docopt} = require '../docopt'

console.log docopt(doc, version: '0.1.1rc')
```

Hell yeah! The option parser is generated based on `doc` string above, that you
pass to the `docopt` function.



API `{docopt} = require 'docopt'`
---------------------------------

### `options = docopt(doc, {argv: process.argv[2..], help: true, version: null, options_first: false, exit: true})`

`docopt` takes 1 required argument, and 3 optional keyword arguments:

* `doc` (required) should be a string with the help message, written according 
to rules of the [docopt language](http://docopt.org). Here's a quick example:

  ```bash
  Usage: your_program [options]

    -h --help     Show this.
    -v --verbose  Print more text.
    --quiet       Print less text.
    -o FILE       Specify output file [default: ./test.txt].
  ```

* `argv` is an optional argument vector. It defaults to the arguments passed
to your program (`process.argv[2..]`). You can also supply it with an array
of strings, as with `process.argv`. For example: `['--verbose', '-o', 'hai.txt']`.

* `help` (default:`true`) specifies whether the parser should automatically
print the help message (supplied as `doc`) in case `-h` or `--help` options
are encountered. After showing the usage-message, the program will terminate.
If you want to handle `-h` or `--help` options manually (the same as other options),
set `help=false`.

* `version` (default:`null`) is an optional argument that specifies the
version of your program. If supplied, then, if the parser encounters
`--version` option, it will print the supplied version and terminate.
`version` could be any printable object, but most likely a string,
e.g. `'2.1.0rc1'`.

* `options_first`, by default `false`.  If set to `true` will
disallow mixing options and positional argument.  I.e. after first
positional argument, all arguments will be interpreted as positional
even if the look like options.  This can be used for strict
compatibility with POSIX, or if you want to dispatch your arguments
to other programs.

* `exit`, by default `true`.  If set to `false` will
cause docopt to throw exceptions instead of printing the error to console and terminating the application.
This flag is mainly for testing purposes.

**Note:** Although `docopt` automatically handles `-h`, `--help` and `--version` options,
you still need to mention them in the options description (`doc`) for your users to
know about them.

The **return** value is an `Object` with properties (giving long options precedence), 
like this:

```javascript
{'--timeout': '10',
 '--baud': '4800',
 '--version': false,
 '--help': false,
 '-h': false,
 serial: true,
 tcp: false,
 '<host>': false,
 '<port>': '/dev/ttyr01'}
```
