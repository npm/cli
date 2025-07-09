'use strict'
const t = require('tap')
const MockRegistry = require('./index')
const mockGlobals = require('@npmcli/mock-globals')

class MockProvenance {
  static successfulNock ({
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
  }) {
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

    // Data for mocking the OIDC token request
    const oidcClaims = {
      iss: 'https://oauth2.sigstore.dev/auth',
      email: 'foo@bar.com',
    }
    const idToken = `.${Buffer.from(JSON.stringify(oidcClaims)).toString('base64')}.`

    // Data for mocking Fulcio certifcate request
    const fulcioURL = 'https://mock.fulcio'
    const leafCertificate = `-----BEGIN CERTIFICATE-----\nabc\n-----END CERTIFICATE-----\n`
    const rootCertificate = `-----BEGIN CERTIFICATE-----\nxyz\n-----END CERTIFICATE-----\n`
    const certificateResponse = {
      signedCertificateEmbeddedSct: {
        chain: {
          certificates: [leafCertificate, rootCertificate],
        },
      },
    }

    // Data for mocking Rekor upload
    const rekorURL = 'https://mock.rekor'
    const signature = 'ABC123'
    const b64Cert = Buffer.from(leafCertificate).toString('base64')
    const logIndex = 2513258
    const uuid =
      '69e5a0c1663ee4452674a5c9d5050d866c2ee31e2faaf79913aea7cc27293cf6'

    const signatureBundle = {
      kind: 'hashedrekord',
      apiVersion: '0.0.1',
      spec: {
        signature: {
          content: signature,
          publicKey: { content: b64Cert },
        },
      },
    }

    const rekorEntry = {
      [uuid]: {
        body: Buffer.from(JSON.stringify(signatureBundle)).toString(
          'base64'
        ),
        integratedTime: 1654015743,
        logID:
          'c0d23d6ad406973f9559f3ba2d1ca01f84147d8ffc5b8445c224f98b9591801d',
        logIndex,
        verification: {
          /* eslint-disable-next-line max-len */
          signedEntryTimestamp: 'MEUCIQD6CD7ZNLUipFoxzmSL/L8Ewic4SRkXN77UjfJZ7d/wAAIgatokSuX9Rg0iWxAgSfHMtcsagtDCQalU5IvXdQ+yLEA=',
        },
      },
    }

    const oidcSrv = MockRegistry.tnock(t, oidcURL)
    oidcSrv.get('/?audience=sigstore', undefined, {
      authorization: `Bearer ${requestToken}`,
    }).reply(200, { value: idToken })

    const fulcioSrv = MockRegistry.tnock(t, fulcioURL)
    fulcioSrv.matchHeader('Content-Type', 'application/json')
      .post('/api/v2/signingCert', {
        credentials: { oidcIdentityToken: idToken },
        publicKeyRequest: {
          publicKey: {
            algorithm: 'ECDSA',
            content: /.+/i,
          },
          proofOfPossession: /.+/i,
        },
      })
      .reply(200, certificateResponse)

    const rekorSrv = MockRegistry.tnock(t, rekorURL)
    rekorSrv
      .matchHeader('Accept', 'application/json')
      .matchHeader('Content-Type', 'application/json')
      .post('/api/v1/log/entries')
      .reply(201, rekorEntry)

    return {
      fulcioURL: fulcioURL,
      rekorURL: rekorURL,
    }
  }
}

module.exports = {
  MockProvenance,
}
