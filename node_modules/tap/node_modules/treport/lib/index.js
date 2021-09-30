const React = require('react')
const {render} = require('ink')
const importJSX = require('import-jsx')
/* istanbul ignore next */
const reporter = {
  report (tap, Type = 'base') {
    // NB: React will only render as a tag if it's capitalized
    if (typeof Type === 'function' && Type.prototype.isReactComponent)
      return render(<Type tap={tap} />)

    if (typeof Type !== 'string' || !types.includes(Type))
      throw new Error('unsupported report type: ' + Type)

    const Report = importJSX('./reports/' + Type)
    render(<Report tap={tap} />)
  }
}

/* istanbul ignore next */
module.exports = (...args) => reporter.report(...args)

const types = module.exports.types = require('../types.js')
const cap = s => s.replace(/^./, $0 => $0.toUpperCase())
types.forEach(type =>
  Object.defineProperty(module.exports, cap(type), {
    get: () => importJSX(`./reports/${type}`),
    enumerable: true,
  }))
