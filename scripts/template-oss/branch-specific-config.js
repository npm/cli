// Leave this empty to use the default ciVersions from template-oss
// This file is kept here to make it easier to apply template-oss
// changes to other branches which might have different ciVersions
// or other conifg options
module.exports = {
  ciVersions: [
    '12.13.0',
    '12.x',
    '14.15.0',
    '14.x',
    '16.0.0',
    '16.x',
  ],
  omitEngines: [
    // node-gyp is technically incompatible with the CLI's engines but was
    // deemed more of a breaking change to revert than it was to keep the
    // engines mismatched. node-gyp uses ^12.22 || ^14.13 || >=16 and the CLI
    // ^12.13.0 || ^14.15.0 || >=16.0.0
    'node-gyp',
    'docs',
    '@npmcli/docs',
  ],
}
