// Best-effort attachment of a dependency "explanation" to an error, so the CLI
// can show *why* a package is in the tree (mirroring how ERESOLVE errors carry
// explain() data). `compute` returns the explanation (an edge.explain() /
// node.explain() result, or an array of them) and is invoked lazily, so the
// potentially expensive graph walk only runs when a caller is actually failing.
// Never throws and never overwrites an existing explanation.
const attachExplanation = (err, compute) => {
  if (!err || typeof err !== 'object' || err.explanation !== undefined) {
    return err
  }
  try {
    const explanation = compute()
    if (explanation !== undefined) {
      err.explanation = explanation
    }
  } catch {
    // advisory only; never mask the original error
  }
  return err
}

module.exports = { attachExplanation }
