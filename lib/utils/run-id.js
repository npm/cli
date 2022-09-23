module.exports = (d = new Date()) => {
  return d.toISOString().replace(/[.:]/g, '_')
}
