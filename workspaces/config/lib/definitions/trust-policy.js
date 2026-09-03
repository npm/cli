const Definition = require('./definition.js')

module.exports = {
  'trust-policy': new Definition('trust-policy', {
    default: null,
    hint: '<policy>',
    type: [null, 'no-downgrade'],
    envExport: false,
    description: `
      Enforce a package trust policy while constructing the dependency tree.

      When set to no-downgrade, npm rejects a selected registry package
      version if an earlier-published stable version established stronger trust
      evidence. Trust levels are ordered as trusted publisher provenance,
      provenance attestation, then no trust evidence. Publish time, not semver
      order, determines which versions are earlier.
    `,
    flatten: (key, obj, flatOptions) => {
      flatOptions.trustPolicy = obj[key]
    },
  }),
  'trust-policy-exclude': new Definition('trust-policy-exclude', {
    default: [],
    hint: '<package-spec>',
    type: [Array, String],
    envExport: false,
    description: `
      Package names, exact versions, or semver ranges exempt from
      trust-policy=no-downgrade. Values may be repeated or comma-separated.
    `,
    flatten: (key, obj, flatOptions) => {
      const values = Array.isArray(obj[key]) ? obj[key] : [obj[key]]
      const list = values
        .flatMap(v => String(v).split(','))
        .map(v => v.trim())
        .filter(Boolean)
      flatOptions.trustPolicyExclude = [...new Set(list)]
    },
  }),
  'trust-policy-ignore-after': new Definition('trust-policy-ignore-after', {
    default: null,
    hint: '<minutes>',
    type: [null, Number],
    envExport: false,
    description: `
      Skip trust-downgrade enforcement for selected package versions published
      more than this many minutes ago. This can limit false positives for older
      packages that predate provenance publishing.
    `,
    flatten: (key, obj, flatOptions) => {
      flatOptions.trustPolicyIgnoreAfter = obj[key]
    },
  }),
}
