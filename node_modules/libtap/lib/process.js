module.exports = typeof process === 'object' && process ? process
  : require('./fake-process.js')
