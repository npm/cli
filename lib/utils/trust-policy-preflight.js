const { verifyTrustPolicy } = require('@npmcli/arborist/lib/trust-policy-verifier.js')

const trustPolicyPreflight = async ({ arb, options }) => {
  const effectiveOptions = { ...arb.options, ...options }

  if (effectiveOptions.trustPolicy !== 'no-downgrade') {
    return
  }

  if (!arb.idealTree) {
    await arb.buildIdealTree(options)
  }

  await verifyTrustPolicy(arb.idealTree, effectiveOptions)
}

module.exports = trustPolicyPreflight
