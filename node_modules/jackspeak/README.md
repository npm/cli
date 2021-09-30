# jackspeak

A very strict and proper argument parser.

## USAGE

Pass one or more objects into the exported `jack(...)` function.  Each
object can have the following fields, and would typically represent a
"section" in a usage/help output.

Using multiple sections allows for using some of the "special" fields
as argument names as well; just put them in different sections.

- `main` Function

    May only appear once.  If provided, will be called with the resulting
    parsed object.

    Each of the defined flags and options will be set on the result
    object, as well as a special `_` array containing all the positional
    arguments.  `_` also has the following properties:

    - `usage` A function that dumps the help output to stdout.
    - `explicit` A `Set` containing the names of all arguments that were
      explicitly set.
    - `original` The `argv` array before any expansions.
    - `parsed` The `argv` array once all aliases have been expanded.
    - `reparse` A function that takes a string or array of strings, and
      parses it according to the options initially provided.  Note that
      this does _not_ update the results object, it's just for expanding
      aliases and short options.
    - `update` A function that takes either a single `--key=val`, an array
      of `--key=val` values, or an object (as read from an rc file, for
      example), and updates the result data accordingly.  This will _not_
      update any options set explicitly in the original argv.

- `usage` String or Array

    The `Usage: ...` bits that go at the top of the help output

- `description` String

    A heading for the section.  Something like `File Options` to
    preface all of the options for working with files.

- `help` String

    A longer-form (multi-paragraph) section of text that explains the
    stuff in more details.

- `argv` Array

    A list of arguments to parse.  If not provided, jackspeak will
    pull form `process.argv`.  It knows how to skip over the node binary
    and main script filename.

    If a section is just an array, then it'll be treated as the argv.

- `env` Object

    A set of key-value pairs to pull environment variables from.  If
    not specified, jackspeak will pull from `process.env`.

    Note that environs are parsed and loaded right away when they are
    defined, so you must put `env` on a jackspeak object before
    definint any environent 

- One or more argument definition objects.  These can be formed using
  the functions exported by `require('jackspeak')`.  The key is the
  full canonical name of the argument as it appears in the parsed
  result set.

    Note that the `--help` flag with the `-h` shorthand will be added
    by default, and that `--` will always stop parsing and treat the
    rest of the argv as positional arguments.  However, `help` and
    `--` _may_ be added to a jack section to customize the usage text.

    All types can have the following options:

    - `description` - Help text for this option.

    - `hidden` - Do not show this value in the help output.

    - `implies` - JavaScript object of values to set in the result
      objet when this flag or option is encountered in the arguments.
      This can be used to have one flag enable another by default, for
      example.

    The types are:

    - `flag(options)` - A boolean value which can be set or unset, but
      not given a value.

        Flags can have the following options:

        - `default` - Either `true` or `false`.  If unspecified, flags
          default to `false`.

        - `envDefault` - The name of an environment variable which provides
          the default value for this flag.  The environment variable will
          be parsed as an `env(flag(...))` value, with `'1'` for true and
          `'0'` for false.

        - `short` - A "short" form of the value which is indicated
          with a single dash.  If `short` is a single character, then
          it can be combined gnu-style with other short flags.

        - `negate` - An object defining how the `--no-<whatever>` form
          of the flag works.  It can have any options that would be
          passed to a flag, other than `negate`.

            For example, it can specify the help text for the negated
            form, or provide a different shorthand character.  So, for
            example, `--color` could have `-c` as a shorthand, and
            `--no-color` could be shorthanded to `-C`.

        - `alias` - Either a string or array of what this flag expands
          to.  This means that the flag key won't have a value, but
          will instead be expanded to its alias.  To expand an alias
          to multiple arguments, use an array.  For example, in the
          `rsync` program, `-m` expands to `-r -N -l inf
          --no-remove-listing`

    - `opt(options)` - An argument which takes a value.

        Opts can have the following options:

        - `default` - A default value.  If unspecified, opts default
          to `undefined`.

        - `envDefault` - The name of an environment variable which provides
          the default value for this opt.

        - `valid` - An array of valid values.  If the user provides a
          value outside this set, it will throw an error.

        - `alias` - A string or array of options that this option
          expands to when used.  This works the same as flag aliases,
          with the exception that you may include the string
          `${value}` in the alias string(s) to substitute in the value
          provided to this opt.

            For example, `--big=<n>` could be an alias for
            `--font-size=<n> --bold` by doing:

            ```js
            jack({
              big: opt({
                alias: ['--font-size=${value}', '--bold']
              })
            })
            ```
        - `hint` - A string to use in the help output as the value
          provided to the opt.  For example, if you wanted to print
          `--output=<file>`, then you'd set `hint: 'file'` here.
          Defaults to the opt name.

        - `short` - A "short" form of the opt which is indicated
          with a single dash.  If `short` is a single character, then
          it can be combined gnu-style with short flags, and take a
          value without an `=` character.

            For example, in [tap](https://www.node-tap.org), `-bRspec`
            is equivalent to `--bail --reporter=spec`.

    - `num(options)` - An `opt` that is a number.  This will be
      provided in the result as an actual number (rather than a
      string) and will raise an error if given a non-numeric value.

        This is numericized by using the `+` operator, so any
        JavaScript number represenation will do.

        All of the `opt()` options are supported, plus these:

        - `min` - A number that this value cannot be smaller than.
        - `max` - A number that this value cannot be larger than.

    - `list(options)` - An option which can take multiple values by
      being specified multiple times, and is represented in the result
      object as an array of values.  If the list is not present in the
      arguments, then it will be an empty array.

    - `count(options)` - A flag which can be set multiple times to
      increase a value.  Unsetting decrements the value, setting
      increments it.  This can be useful for things like `-v` to set a
      verbosity level, or `-d` to set a debug level.

        Counts always default to 0.

        Note that a `count` is actually a flag that can be set
        multiple times.  Thus, it is a composition of the `list` and
        `flag` types.

    - `env(options)` - An environment variable that the program is
      interested in.

        All environment variables will be present in the result
        object.  `env()` can be composed with other types to change
        how the environment variable is handled.

        - Compose with `flag()` to define an environment variable that
          is set to `'1'` to mean `true`, or `'0'` or `''` to mean
          `false`.  Presented in the result object as a boolean value.
          For example:

            ```js
            jack({
              FOO: env(flag({
                description: 'Set to "1" to enable the foo flag'
              }))
            })
            ```

        - Compose with `list()` to define an environment variable that
          is set to multiple values separated by a delimiter.  For
          example:

            ```js
            jack({
              NODE_DEBUG: env(list({
                delimiter: ',',
                description: 'Define which bits to debug'
              }))
            })
            ```

            This can be further composed with `num` to pass in a list
            of numbers separated by a delimiter.

            When composed with `count` (which is the composition of
            `list` and `flag`), you would pass in a delimited list of
            `1` and `0` characters, and it'd count up the `1` values.
            I don't know why you'd ever do this, but it works.

        - Compose with `num()` to parse the environ as a numeric
          value, and raise an error if it is non-numeric.

### Type Composition

Compose types by applying more than one function to the arg
definition options.  For example, for a numeric environment
variable, you can do:

```js
jack({
  HOW_MANY_FOOS: env(num({
    description: 'set to define the number of foos'
    max: 10,
    min: 2,
    default: 5,
  }))
})
```

The order of composition does not matter in normal cases, but note
that some compositions will contradict one another.  For example,
composing `flag` (an argument that does not take a value) with `opt`
(an argument that _does_ take a value) will result in the outermost
function taking precedence.

## Some Example Code

Also see [the examples
folder](https://github.com/isaacs/jackspeak/tree/master/examples)

```js
const { jack, flag, opt, list, count, num } = require('jackspeak')

jack({
  // Optional
  // the function to call with the options argument when it's all done
  // if not provided, then jack() will return the parsed options
  // if any unknown options are passed in, then it'll abort with
  // the usage output and an error message
  main: myFunction,

  // Optional
  // defaults to process.argv, and slices off the first item if
  // it's process.execPath and the second item if it's
  // require.main.filename
  argv: process.argv,

  // Optional
  // This will be auto-generated from the descriptions if not supplied
  // top level usage line, printed by -h
  // will be auto-generated if not specified
  usage: 'foo [options] <files>',

  // Optional
  // longer-form help text
  // will be reformatted and wrapped to terminal column width,
  // so go ahead and format it however you like here.
  help: `
    Executes all the files and interprets their output as
    TAP formatted test result data.

    To parse TAP data from stdin, specify "-" as a filename.
  `

  // flags don't take a value, they're boolean on or off, and can be
  // turned off by prefixing with `--no-`
  // so this adds support for -b to mean --bail, or -B to mean --no-bail
  flag: flag({
    // specify a short value if you like.  this must be a single char
    short: 'f',
    // description is optional as well.
    description: `Make the flags wave`,
    // you can can always negate a flag with `--no-flag`
    // specifying a negate option will let you define a short
    // single-char option for negation.
    negate: {
      short: 'F',
      description: `Do not wave the flags`
    },
    // default value for flags is 'false', unless you change it
    default: true
  }),

  // Options that take a value are specified with `opt()`
  reporter: opt({
    short: 'R',
    description: 'the style of report to display',
  })

  // if you want a number, say so, and jackspeak will enforce it
  jobs: num({
    short: 'j',
    description: 'how many jobs to run in parallel',
    default: 1
  }),

  // Aliases can be a flag or option that expands to
  // some other value when used.
  'jobs-auto': flag({
    short: 'J',
    alias: '--jobs=' + require('os').cpus().length
  }),

  // you can also set defaults with an environ of course
  timeout: num({
    short: 't',
    default: +process.env.TAP_TIMEOUT || 30,
  }),

  // this makes --no-timeout equivalue to setting timeout to zero
  'no-timeout': flag({
    short: 'T',
    alias: '--timeout=0'
  }),

  // A list is an option that can be specified multiple times,
  // to expand into an array of all the settings.  Normal opts
  // will just give you the last value specified.
  'node-arg': list(),

  // A counter is a flag that increments or decrements its value
  // each time it's specified.
  // In this case, `-ddd` would return { debug: 3 } in the result
  debug: count({
    short: 'd'
  })

  // an alias can expand to multiple things, not just one
  foo: flag({
    alias: ['--statements=100', '--lines=100', '--branches=100'],
  }),

  // An option alias can take a value and use it in the expansion.
  // use `${value}` in the alias to sub in what the user provides
  covlevel: opt({
    alias: [
      '--statements=${value}',
      '--lines=${value}',
      '--branches=${value}'
    ]
  }),

  // aliases can recurse, as well
  100: flag({
    alias: '--covlevel=100'
  }),

  // opts take a value, and is set to the string in the results
  // you can combine multiple short-form flags together, but
  // an opt will end the combine chain, posix-style.  So,
  // -bofilename would be like --bail --output-file=filename
  'output-file': opt({
    short: 'o',
    // optional: make it -o<file> in the help output insead of -o<value>
    hint: 'file',
    description: `Send the raw output to the specified file.`
  }),
})
```

## Name

The inspiration for this module is [yargs](http://npm.im/yargs), which
is pirate talk themed.  Yargs has all the features, and is infinitely
flexible.  "Jackspeak" is the slang of the royal navy.  This module
does not have all the features.  It is declarative and rigid by design.
