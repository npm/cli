// Fixture for #9681: a node with `bin` denied by allowScripts should still
// get its `.bin/` symlink created, while its install scripts are skipped.
module.exports = t => {
  const path = t.testdir({
    'node_modules': {
      'denied-with-bin': {
        'package.json': JSON.stringify({
          name: 'denied-with-bin',
          version: '1.0.0',
          bin: { 'denied-with-bin': 'bin/cli.js' },
          scripts: {
            postinstall: 'node -e "require(\'fs\').writeFileSync(\'ran\', \'\')"',
          },
        }),
        'bin': {
          'cli.js': '#!/usr/bin/env node\nconsole.log("denied-with-bin")\n',
        },
      },
    },
    'package-lock.json': JSON.stringify({
      name: 'testing-allow-scripts-deny-bin',
      version: '1.0.0',
      lockfileVersion: 2,
      requires: true,
      packages: {
        '': {
          name: 'testing-allow-scripts-deny-bin',
          version: '1.0.0',
          dependencies: { 'denied-with-bin': '1.0.0' },
        },
        'node_modules/denied-with-bin': {
          version: '1.0.0',
          hasInstallScript: true,
          bin: { 'denied-with-bin': 'bin/cli.js' },
        },
      },
      dependencies: {
        'denied-with-bin': { version: '1.0.0' },
      },
    }),
    'package.json': JSON.stringify({
      name: 'testing-allow-scripts-deny-bin',
      version: '1.0.0',
      dependencies: { 'denied-with-bin': '1.0.0' },
    }),
  })
  return path
}
