'use strict'

const output = require('../utils/output.js')

exports.printInstallReport = function (result) {
  if (result.length === 0) return
  var report = 'Help sustain the packages you depend on!'
  result.forEach(function (record) {
    var name = record.name
    var version = record.version
    report += '\n' + name + '@' + version + ':\n'
    report += record.data.contributors
      .map(function (contributor) {
        var line = '  ' + contributor.name
        if (contributor.homepage) {
          line += ' (' + contributor.homepage + ')'
        }
        line += '\n'
        if (contributor.links) {
          line += contributor.links
            .map(function (link) {
              return '    ' + link.uri
            })
            .join('\n') + '\n'
        }
        return line
      })
      .join('\n')
  })
  output(report)
}
