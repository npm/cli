```javascript
var assert = require('assert')
var valid = require('spdx-expression-validate')
```

# Simple License Expressions
```javascript
assert(!valid('Invalid-Identifier'))
assert(valid('GPL-2.0'))
assert(valid('GPL-2.0+'))
assert(valid('LicenseRef-23'))
assert(valid('LicenseRef-MIT-Style-1'))
assert(valid('DocumentRef-spdx-tool-1.2:LicenseRef-MIT-Style-2'))
```

# Composite License Expressions

## Disjunctive `OR` Operator
```javascript
assert(valid('(LGPL-2.1 OR MIT)'))
assert(valid('(LGPL-2.1 OR MIT OR BSD-3-Clause)'))
```

## Conjunctive `AND` Operator
```javascript
assert(valid('(LGPL-2.1 AND MIT)'))
assert(valid('(LGPL-2.1 AND MIT AND BSD-2-Clause)'))
```

## Exception `WITH` Operator
```javascript
assert(valid('(GPL-2.0+ WITH Bison-exception-2.2)'))
```

# Strict Whitespace Rules
```javascript
assert(!valid('MIT '))
assert(!valid(' MIT'))
assert(!valid('MIT  AND  BSD-3-Clause'))
```

---

[The Software Package Data Exchange (SPDX) specification](http://spdx.org) is the work of the [Linux Foundation](http://www.linuxfoundation.org) and its contributors, and is licensed under the terms of [the Creative Commons Attribution License 3.0 Unported (SPDX: "CC-BY-3.0")](http://spdx.org/licenses/CC-BY-3.0). "SPDX" is a United States federally registered trademark of the Linux Foundation.
