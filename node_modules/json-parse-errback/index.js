module.exports = function (input, callback) {
  var result
  try {
    result = JSON.parse(input)
  } catch (error) {
    return callback(error)
  }
  callback(null, result)
}




