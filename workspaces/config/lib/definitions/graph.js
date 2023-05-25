
class Graph {
  #vertices = new Map()
  #definitions = new Map()
  #sorted = null

  get vertices () {
    return this.#vertices.keys()
  }

  get sorted () {
    return [...this.#sorted.keys()].reverse()
  }

  definition (k) {
    return this.#definitions.get(k)
  }

  addDefinition (def) {
    const { key } = def
    if (!this.#vertices.has(key)) {
      this.#vertices.set(key, new Set())
      this.#definitions.set(key, def)
      return
    }
    throw new Error(`vertex ${key} already exists`)
  }

  build () {
    for (const key of this.#vertices.keys()) {
      const def = this.#definitions.get(key)
      for (const d of def.depends) {
        this.#addEdge(d, key)
      }
    }
    this.#sort()
  }

  #edges (v) {
    if (this.#vertices.has(v)) {
      return this.#vertices.get(v)
    }
    throw new Error(`vertex ${v} does not exist`)
  }

  walkFrom (root) {
    const visited = new Map()

    const walker = (v) => {
      for (const edge of this.#edges(v)) {
        if (!visited.has(edge)) {
          visited.set(edge)
          walker(edge)
        }
      }
    }

    walker(root)

    if (visited.has(root)) {
      throw new Error(`Config definitions cannot have cycles. `
        + `Found: ${root} depends on ${[...visited.keys()].join(',')}`)
    }

    return [...visited.keys()]
      .sort((a, b) => this.#sorted.get(a) - this.#sorted.get(b))
  }

  #addEdge (v1, v2) {
    if (v1 === v2) {
      return
    }
    if (this.#vertices.get(v1)) {
      this.#vertices.get(v1).add(v2)
    } else {
      throw new Error(`vertex ${v1} does not exist`)
    }
  }

  #sort () {
    this.#sorted = new Map()
    const visited = new Map()

    const sorter = (v, n) => {
      visited.set(v)
      for (const edge of this.#edges(v)) {
        if (!visited.has(edge)) {
          n = sorter(edge, n)
        }
      }
      this.#sorted.set(v, n)
      return n - 1
    }

    let n = this.#vertices.size - 1
    for (const v of this.#vertices.keys()) {
      if (!visited.has(v)) {
        n = sorter(v, n)
      }
    }

    return this
  }
}

module.exports = Graph
