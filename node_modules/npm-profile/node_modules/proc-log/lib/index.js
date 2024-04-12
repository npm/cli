module.exports = {
  output: {
    LEVELS: [
      'standard',
      'error',
      'buffer',
    ],
    standard: function (...args) {
      return process.emit('output', 'standard', ...args)
    },
    error: function (...args) {
      return process.emit('output', 'error', ...args)
    },
    buffer: function (...args) {
      return process.emit('output', 'buffer', ...args)
    },
  },
  log: {
    LEVELS: [
      'notice',
      'error',
      'warn',
      'info',
      'verbose',
      'http',
      'silly',
      'timing',
      'pause',
      'resume',
    ],
    error: function (...args) {
      return process.emit('log', 'error', ...args)
    },
    notice: function (...args) {
      return process.emit('log', 'notice', ...args)
    },
    warn: function (...args) {
      return process.emit('log', 'warn', ...args)
    },
    info: function (...args) {
      return process.emit('log', 'info', ...args)
    },
    verbose: function (...args) {
      return process.emit('log', 'verbose', ...args)
    },
    http: function (...args) {
      return process.emit('log', 'http', ...args)
    },
    silly: function (...args) {
      return process.emit('log', 'silly', ...args)
    },
    timing: function (...args) {
      return process.emit('log', 'timing', ...args)
    },
    pause: function (...args) {
      return process.emit('log', 'pause', ...args)
    },
    resume: function (...args) {
      return process.emit('log', 'resume', ...args)
    },
  },
}
