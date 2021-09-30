// Used by mocha.js, for when we want a callback to pass to
// a child function, but still want to return a Promise.
module.exports = () => {
  let cb
  const p = new Promise((res, rej) => {
    cb = er => er ? rej(er) : res()
  })
  return [cb, p]
}
