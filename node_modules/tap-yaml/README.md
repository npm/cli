# tap-yaml

Yaml handling for TAP parsers and generators

## USAGE

```js
const yaml = require('tap-yaml')

const str = yaml.stringify(someObject)
const obj = yaml.parse(someString)
```

This is essentially a re-export of the [yaml](http://npm.im/yaml)
package, with a few custom types and default properties to be more suitable for
use in [tap](https://www.node-tap.org).

1. Symbol types are added, so that they don't throw.  Shared symbols will
   (within the same process) retain the same Symbol identity through encoding
   and decoding.  Unshared symbols will not retain their object identity.
2. A "safe" `!function` type is added.  Functions aren't parsed to actual
   functions using `eval()`, since that's obviously a Bad Idea, but they do
   parse to an empty function with a `toString()` that contains the original
   string source.
3. An `Error` type is added, which does its best to maintain its properties,
   and always shows message, stack, and name, even if these are non-enumerable.
   If an Error has a custom inspect method that returns an object, then that is
   used as the source of extra properties, so you may filter out what gets
   dumped to your TAP stream.
4. Binary types are implicitly allowed in a standard way.  In Node.js, this
   means that a Buffer object is created, and Buffers can be dumped to YAML
   without any weirdness.
5. `omap` and `set` are configured to refer to Map and Set objects.
6. Objects with a `null` prototype maintain their null-prototyped-ness.
7. `Domain` objects are stringified, but without their giant object graph,
   since that's often a performance issue.
8. `Date` objects are given a non-default `!date` tag rather than the default
   YAML 1.1 `!timestamp`, so that they maintain their explicit date object
   nature through stringifying and re-parsing.
9. The `prettyErrors` option is always enabled.
