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
  releaseBranches: [
    'v8',
  ],
}
