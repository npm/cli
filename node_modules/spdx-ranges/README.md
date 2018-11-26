```javascript
var assert = require('assert')
var ranges = require('spdx-ranges')

assert(
  Array.isArray(ranges),
  'module is an Array'
)

assert(
  ranges.length > 0,
  'the Array has elements'
)

assert(
  ranges.every(function (e) {
    return Array.isArray(e)
  }),
  'each Array element is an Array'
)

assert(
  ranges.every(function (range) {
    return range.every(function (element) {
      return (
        typeof element === 'string' ||
        (
          Array.isArray(element) &&
          element.every(function (element) {
            return typeof element === 'string'
          })
        )
      )
    })
  }),
  'elements of Array-elements are strings or Arrays of Strings'
)
```
