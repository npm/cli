# licensee

Check npm package dependency license metadata against rules.

## Configuration

Licensee accepts two kinds of configuration:

1. a rule about permitted licenses
2. a package whitelist of name-and-range pairs

You can set configuration with command flags or a `.licensee.json`
file at the root of your package, like so:

```json
{
  "licenses": {
    "spdx": [
      "MIT",
      "BSD-2-Clause",
      "BSD-3-Clause",
      "Apache-2.0"
    ]
  },
  "packages": {
    "optimist": "<=0.6.1"
  },
  "corrections": false,
  "ignore": [
    {"scope": "kemitchell"},
    {"prefix": "commonform-"},
    {"author": "Kyle E. Mitchell"}
  ]
}
```

The `licenses` object adds licenses to a whitelist.
Any package with [standard license metadata][metadata]
that satisfies that whitelist according to
[spdx-whitelisted][whitelisted] will not cause an error.

[parse]: https://www.npmjs.com/package/spdx-expression-parse
[whitelisted]: https://www.npmjs.com/package/spdx-whitelisted

Instead of whitelisting each license by SPDX identifier,
you can whitelist categories of licenses.

For example, you can specify a minimum Blue Oak Council [license
rating]---lead, bronze, silver, or gold---like so:

[license rating]: https://blueoakcouncil.org/list

```json
{
  "licenses": {
    "blueOak": "bronze"
  }
}
```

You can combine categories and specific license identifiers, too:

```json
{
  "licenses": {
    "spdx": ["CC-BY-4.0"],
    "blueOak": "gold"
  }
}
```

The `packages` property is a map from package name to a
[node-semver][semver] Semantic Versioning range.  Packages whose
license metadata don't match the SPDX license expression in
`licenses` but have a name and version described in `packages`
will not cause an error.

[metadata]: https://docs.npmjs.com/files/package.json#license
[semver]: https://www.npmjs.com/package/semver

The `corrections` flag toggles community corrections to npm
package license metadata.  When enabled, `licensee` will check
against `license` values from [npm-license-corrections] when
available, and also use [correct-license-metadata] to try to
correct old-style `licenses` arrays and other unambiguous, but
invalid, metadata.

[npm-license-corrections]: https://www.npmjs.com/package/npm-license-corrections

[correct-license-metadata]: https://www.npmjs.com/package/correct-license-metadata

The optional `ignore` array instructs `licensee` to approve packages
without considering their `license` metadata.  Ignore rules can take
one of three forms:

1.  `{"scope":"x"}` ignores all packages in scope `x`, like `@x/y`.

2.  `{"prefix":"x"}` ignores all packages whose names start with `x`,
    but not scoped packages whose scopes do not match, like `@y/x`.

3.  `{"author":"x"}` ignores all packages whose authors' names,
    e-mail addresses, or URLs contain `x`.

All ignore rules are case-insensitive.

## Use

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

To check only production dependencies, ignoring development dependencies,
use `--production` flag:

```json
{
  "scripts": {
    "posttest": "licensee --production"
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

## JavaScript Module

The package exports an asynchronous function of three arguments:

1. A configuration object in the same form as `.licensee.json`.

2. The path of the package to check.

3. An error-first callback that yields an array of objects, one per
   dependency.
