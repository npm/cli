var leven = require('leven')

function didYouMean (scmd, commands) {
  var bestSimilarity = commands.filter(function (cmd) {
    return leven(scmd, cmd) < scmd.length * 0.4
  }).map(function (str) {
    return '    ' + str
  })

  if (bestSimilarity.length === 0) return ''
  if (bestSimilarity.length === 1) {
    return '\nDid you mean this?\n' + bestSimilarity[0]
  } else {
    return ['\nDid you mean one of these?']
      .concat(bestSimilarity.slice(0, 3)).join('\n')
  }
}

module.exports = didYouMean
