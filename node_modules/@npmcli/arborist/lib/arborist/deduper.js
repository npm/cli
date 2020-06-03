module.exports = cls => class Deduper extends cls {
  async dedupe (options = {}) {
    const tree = await this.loadVirtual().catch(() => this.loadActual())
    const names = []
    for (const name of tree.inventory.query('name')) {
      if (tree.inventory.query('name', name).size > 1)
        names.push(name)
    }
    return this.reify({
      ...options,
      preferDedupe: true,
      update: { names }
    })
  }
}
