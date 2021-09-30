'use strict'

module.exports = (obj, proto, bound) => {
  bound = bound || Object.create(null)

  if (Array.isArray(bound))
    bound = bound.reduce((s, k) => (s[k] = true, s), Object.create(null))

  // don't try to bind constructors, it's weird
  bound.constructor = true
  proto = proto || obj

  for (const k of Object.getOwnPropertyNames(proto)) {
    if (bound[k]) {
      continue
    }

    const descriptor = {...Object.getOwnPropertyDescriptor(proto, k)};

    if ('value' in descriptor) {
      if (typeof descriptor.value !== 'function') {
        continue
      }

      descriptor.value = descriptor.value.bind(obj);
      if (!descriptor.configurable) {
        if (!descriptor.writable) {
          continue;
        }

        obj[k] = descriptor.value;
        bound[k] = true;
        continue;
      }

      bound[k] = true;
      Object.defineProperty(obj, k, descriptor)
    }
  }
}
