/* This file is automatically added by @npmcli/template-oss. Do not edit. */

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'deps', 'chore']],
    'header-max-length': [2, 'always', 80],
    'subject-case': [0],
    'body-max-line-length': [0],
  },
}
