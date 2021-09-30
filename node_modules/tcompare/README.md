# tcompare

A comprehensive comparison library, for use in test frameworks.  Walks an
object once, generating both a simple true/false result, as well as a
nicely formatted human-readable diff string.

## USAGE

```js
const { match, same, strict, has, hasStrict, format } = require('tcompare')

// Result is an object with { Boolean match, String diff }
const result = match(object, pattern)
if (!result.match) {
  console.log(`item did not match pattern`)
  console.log(result.diff)
} else {
  console.log(`it's a match!`)
}
```

## METHODS

* `format(object, [options])` - No comparisons performed.  Just print out the
  object.  Returns just the string format.
* `same(object, pattern, [options])` - Ensure that all items in the pattern are
  found in the object, and vice versa, matching loosely (so, for example `1`
  will match with `'1'`).
* `strict(object, pattern, [options])` - Ensure that all items in the pattern
  are found in the object, and vice versa, matching strictly (so, for example
  `1` will not match with `'1'`).  Objects must have the same constructors,
  and all fields will be matched recursively using the same `strict` test.
* `has(object, pattern, [options])` - Ensure that all items in the pattern are
  found in the object, but ignore additional items found in the object,
  matching loosely.
* `hasStrict(object, pattern, [options])` - Ensure that all items in the
  pattern are found in the object, but ignore additional items found in the
  object, matching strictly.  Constructors do _not_ have to match between
  objects, but if `constructor` is set as an ownProperty on the pattern
  object, then it will be checked.
* `match(object, pattern, [options])` - Verify that all items in `pattern` are
  found in `object`, and that they match.  This is the loosest possible
  algorithm, allowing cases where we just want to verify that an object
  contains a few important properties.  The algorithm is the same as
  the one used by [tmatch](http://npm.im/tmatch).  In a nutshell:
    * If the object and pattern are loosely equal, then pass
    * If the object and the pattern are both Regular Expressions, Date objects
      or Buffers, then pass if they're "equivalent".
    * If the pattern is a RegExp, cast object to a string, and test against the
      RegExp.
    * If both are Strings, pass if pattern appears in object.
    * If pattern is a function, and object is an instance of that function,
      then pass.  (This also applies to Symbol, Number, String, etc.)
    * If pattern and object are collections (object, map, set, array or
      iterable), then compare their contents.  Each type of collection can only
      match its same type, with the exception of non-Set iterables (including
      `arguments` objects), which are cast to Arrays.

There are classes exported to correspond to each of these.  All of these are
instantiated like `new Format(object, options)`.  An `expect` option is
required for all classes except `Format`.  Call `obj.print()` on the resulting
object to generate a diff.  Once the diff (or format) is generated, it'll have
a `match` boolean member.

## OPTIONS

Each method can take the following options.

* `includeEnumerable` - Set to `true` to walk over _all_ enumerable
  properties of a given object when comparing or formatting, rather than
  the default of only showing enumerable own-properties.  Note that
  calling getter functions may be hazardous, as they may trigger
  side-effects.

* `includeGetters` - Set to `true` to walk over all enumerable getters
  on an object's prototype (but not from further down the prototype
  chain), in addition to own-properties.  This is useful in cases where
  you want to compare or print an object with enumerable getters that
  return internal values in a read-only manner.  Note that calling
  getter functions can be hazardous, as they may trigger side-effects.

* `sort` - Set to `true` to sort object keys.  This is important when
  serializing in a deterministic way.

* `style` - Set to `pretty` for a very human-readable style of object printing.
  Set to `js` for a copy-and-paste friendly valid JavaScript output.  Set to
  `tight` for a minimal white-space js format.  Default is `pretty`.  Example:

    ```
    // pretty style
    Object {
      "myMap": Map {
        Object {
          "a": 1,
        } => Object {
          "b": 2,
        }
      }
    }

    // js style
    {
      "myMap": new Map([
        [{
          "a": 1,
        }, {
          "b": 2,
        }]
      ])
    }

    // tight style
    {"myMap":new Map([[{"a":1,},{"b":2,}],]),}
    ```

    Note that `tight` is not suitable for comparisons, only formatting.

## Circular References

Circular references are displayed using YAML-like references, so it's easy to
determine _which_ item is circularly referenced.

When doing comparisons, a pattern and object will be considered matching if
they contain the _same_ circularity.  So, for example, if a pattern refers to
itself, then an object should refer to itself as well.

```js
const a = {list: [], b: {}}
a.list.push(a)
a.list.push(a.b)
a.b.a = a
console.log(format(a))

/*
&ref_1 Object {
  "list": Array [
    <*ref_1>,
    Object {
      "a": <*ref_1>,
    },
  ],
  "b": Object {
    "a": <*ref_1>,
  },
}
*/
```

Note that circular references are never going to be valid JavaScript, even when
using the `js` style.
