// this weird little engine is to loop if the functions keep
// returning synchronously, since that's faster and makes shallower
// stack traces, but await and recurse if any of them return a Promise

const loop = (self, arr, cb, onerr, i = 0) => {
  while (i < arr.length) {
    const fn = arr[i]
    let ret = null
    try {
      ret = fn.call(self)
    } catch (er) {
      return onerr.call(self, er)
    }
    i++
    if (ret && typeof ret.then === 'function')
      return ret.then(() => loop(self, arr, cb, onerr, i), onerr.bind(self))
  }

  return cb.call(self)
}

module.exports = loop
