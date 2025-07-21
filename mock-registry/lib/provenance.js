const mockGlobals = require('@npmcli/mock-globals')
const nock = require('nock')

const sigstoreIdToken = () => {
  return `.${Buffer.from(JSON.stringify({
    iss: 'https://oauth2.sigstore.dev/auth',
    email: 'foo@bar.com',
  }))
  .toString('base64')}.`
}

const mockProvenance = (t, {
  oidcURL,
  requestToken,
  workflowPath,
  repository,
  serverUrl,
  ref,
  sha,
  runID,
  runAttempt,
  runnerEnv,
}) => {
  const idToken = sigstoreIdToken()

  mockGlobals(t, {
    'process.env': {
      CI: true,
      GITHUB_ACTIONS: true,
      ACTIONS_ID_TOKEN_REQUEST_URL: oidcURL,
      ACTIONS_ID_TOKEN_REQUEST_TOKEN: requestToken,
      GITHUB_WORKFLOW_REF: `${repository}/${workflowPath}@${ref}`,
      GITHUB_REPOSITORY: repository,
      GITHUB_SERVER_URL: serverUrl,
      GITHUB_REF: ref,
      GITHUB_SHA: sha,
      GITHUB_RUN_ID: runID,
      GITHUB_RUN_ATTEMPT: runAttempt,
      RUNNER_ENVIRONMENT: runnerEnv,
    },
  })

  const url = new URL(oidcURL)
  nock(url.origin)
    .get(url.pathname)
    .query({ audience: 'sigstore' })
    .matchHeader('authorization', `Bearer ${requestToken}`)
    .matchHeader('accept', 'application/json')
    .reply(200, { value: idToken })

  const leafCertificate = `-----BEGIN CERTIFICATE-----\nabc\n-----END CERTIFICATE-----\n`

  // Mock the Fulcio signing certificate endpoint
  nock('https://fulcio.sigstore.dev')
    .post('/api/v2/signingCert')
    .reply(200, {
      signedCertificateEmbeddedSct: {
        chain: {
          certificates: [
            leafCertificate,
            `-----BEGIN CERTIFICATE-----\nxyz\n-----END CERTIFICATE-----\n`,
          ],
        },
      },
    })

  nock('https://rekor.sigstore.dev')
    .post('/api/v1/log/entries')
    .reply(201, {
      '69e5a0c1663ee4452674a5c9d5050d866c2ee31e2faaf79913aea7cc27293cf6': {
        body: Buffer.from(JSON.stringify({
          kind: 'hashedrekord',
          apiVersion: '0.0.1',
          spec: {
            signature: {
              content: 'ABC123',
              publicKey: { content: Buffer.from(leafCertificate).toString('base64') },
            },
          },
        })).toString(
          'base64'
        ),
        integratedTime: 1654015743,
        logID:
          'c0d23d6ad406973f9559f3ba2d1ca01f84147d8ffc5b8445c224f98b9591801d',
        logIndex: 2513258,
        verification: {
          signedEntryTimestamp: 'MEUCIQD6CD7ZNLUipFoxzmSL/L8Ewic4SRkXN77UjfJZ7d/wAAIgatokSuX9Rg0iWxAgSfHMtcsagtDCQalU5IvXdQ+yLEA=',
        },
      },
    })
}

module.exports = {
  mockProvenance,
  sigstoreIdToken,
}
