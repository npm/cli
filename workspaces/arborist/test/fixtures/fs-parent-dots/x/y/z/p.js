process.env.ARBORIST_DEBUG = '1'

const Arborist = require('../../../..')
const arb = new Arborist({ follow: true })
const main = async () => {
  const tree = await arb.buildIdealTree()
  for (const node of tree.inventory.values()) {
    const {
      fsParent,
      path,
      location,
      package: pkg,
    } = node
    console.error({
      path,
      location,
      fsParent: fsParent && fsParent.path,
      pkg,
    })
  }
}
main()
