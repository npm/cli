Check npm package dependency license metadata against rules.

# Configuration

Licensee accepts two kinds of configuration:

1. a rule about permitted licenses
2. a package whitelist of name-and-range pairs

You can set configuration with command flags or a `.licensee.json`
file at the root of your package, like so:

```json
{
  "license": "(MIT OR BSD-2-Clause OR BSD-3-Clause OR Apache-2.0)",
  "whitelist": {
    "optimist": "<=0.6.1"
  }
}
```

The `license` property is an SPDX license expression that
[spdx-expression-parse][parse] can parse. Any package with [standard
license metadata][metadata] that satisfies the SPDX license expression
according to [spdx-satisfies][satisfies] will not cause an error.

[parse]: https://www.npmjs.com/package/spdx-expression-parse
[satisfies]: https://www.npmjs.com/package/spdx-satisfies

The `whitelist` is a map from package name to a [node-semver][semver]
Semantic Versioning range. Packages whose license metadata don't match
the SPDX license expression in `license` but have a name and version
described in `whitelist` will not cause an error.

[metadata]: https://docs.npmjs.com/files/package.json#license
[semver]: https://www.npmjs.com/package/semver

# Use

To install and use `licensee` globally:

```bash
npm install --global licensee
cd your-package
licensee --init
licensee
```

The `licensee` script prints a report about dependencies and their
license terms to standard output.  It exits with status `0` when all
packages in `./node_modules` meet the configured licensing criteria
and `1` when one or more do not.

To install it as a development dependency of your package:

```bash
cd your-package
npm install --save-dev licensee
```

Consider adding `licensee` to your npm scripts:

```json
{
  "scripts": {
    "posttest": "licensee"
  }
}
```

For output as newline-delimited JSON objects, for further processing:

```json
{
  "scripts": {
    "posttest": "licensee --ndjson"
  }
}
```

To skip the readout of license information:

```json
{
  "scripts": {
    "posttest": "licensee --quiet"
  }
}
```

If you want a readout of dependency information, but don't want
your continuous integration going red, you can ignore `licensee`'s
exit code:

```json
{
  "scripts": {
    "posttest": "licensee || true"
  }
}
```

To save the readout of license information to a file:

```json
{
  "scripts": {
    "posttest": "licensee | tee LICENSES || true"
  }
}
```

Alternatively, for a readout of just packages without approved licenses:

```json
{
  "scripts": {
    "posttest": "licensee --errors-only"
  }
}
```

# JavaScript Module

The package exports an asynchronous function of three arguments:

1. A configuration object in the same form as `.licensee.json`.

2. The path of the package to check.

3. An error-first callback that yields an array of objects, one per
   dependency.
