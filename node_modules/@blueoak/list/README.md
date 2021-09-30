[Blue Oak Council's license list](https://blueoakcouncil.org/list) in JSON format

# Data

This package exports an Array.

Each element of the Array is an Object corresponding to a license rating:

```javascript
{
  "name": "Gold",
  "licenses": [/* Objects */]
}
```

Each element of each `licenses` Array is an Object:

```javascript
{
  "name": "MIT License", // name of the license
  "id": "MIT", // SPDX or temporary ID
  "url": "https://spdx.org/licenses/MIT.html"
}
```

# Versioning

This package's versions track the version of the license list.  Version 1 of the license list is version 1.0.0 of this package.  Any changes to the content of the list increment that version number.  Any technical changes to this package only, and not to the content of the list, will be minor or patch releases.
