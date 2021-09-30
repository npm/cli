const bindings = require('bindings')('binding.node')
const { Transform } = require('stream')
const { StringDecoder } = require('string_decoder')

class StreamingParser extends Transform {
  constructor (options) {
    super({
      decodeStrings: false
    })
    this._parser = new bindings.Parser(options || {})
    this._decoder = new StringDecoder()
  }

  _transform (chunk, encoding, callback) {
    if (this._parser.isFinished()) {
      callback(new Error('Cannot write additional data to a finished parser'))
      return
    }

    if (encoding === 'buffer') {
      chunk = this._decoder.write(chunk)
    }

    this._parser.write(chunk, callback)
  }

  _flush (callback) {
    this._parser.finalize((result) => {
      this.push(result, 'utf8')
      this.push(null)
      callback()
    })
  }

  _destroy (_err, callback) {
    this._parser.destroy(callback)
  }
}

module.exports = {
  renderHtmlSync: function (markdown, options) {
    return bindings.renderHtmlSync(markdown, options || {})
  },

  renderHtml: function (markdown, options, callback) {
    if (!callback && typeof options === 'function') {
      callback = options
      options = {}
    }

    if (markdown === null || markdown === undefined || typeof markdown !== 'string') {
      throw new Error("Expected argument 'markdown' to be a string")
    }

    let buffer = ''
    const stream = new StreamingParser(options)
    const promise = new Promise((resolve, reject) => {
      stream.on('data', data => buffer += data.toString())
      stream.once('end', () => resolve(buffer))
      stream.once('error', reject)
    })
    stream.write(markdown)
    stream.end()

    if (callback) {
      promise.then((data) => {
        callback(null, data)
      }, (err) => {
        callback(err)
      })
    } else {
      return promise
    }
  },

  version: function () {
    return bindings.cmark_version
  },

  createStreamingParser: function(options) {
    return new StreamingParser(options)
  }
}
