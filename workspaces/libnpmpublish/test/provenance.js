'use strict'

const t = require('tap')

const mockGlobals = require('../../../test/fixtures/mock-globals.js')

// Set-up a spy for the sigstore.attest function so we can inspect the
// provenance payload
const attestLog = []
const { generateProvenance } = t.mock('../lib/provenance.js', {
  sigstore: {
    sigstore: {
      attest: (...any) => attestLog.push(any),
    },
  },
})

// Environment variables
const workflowPath = '.github/workflows/publish.yml'
const repository = 'github/foo'
const serverUrl = 'https://github.com'
const ref = 'refs/heads/main'
const sha = 'deadbeef'
const runID = '123456'
const runAttempt = '1'

// Provenance subject
const subject = {
  name: 'npm',
  version: '7.0.0',
  digest: {
    sha1: 'deadbeef',
  },
}

t.test('generateProvenance - GHA environment', async t => {
  // Reset the spy
  attestLog.length = 0

  mockGlobals(t, {
    'process.env': {
      CI: true,
      GITHUB_ACTIONS: true,
      GITHUB_REPOSITORY: repository,
      GITHUB_REF: ref,
      GITHUB_SHA: sha,
      GITHUB_SERVER_URL: serverUrl,
      GITHUB_WORKFLOW_REF: `${repository}/${workflowPath}@${ref}`,
      GITHUB_RUN_ID: runID,
      GITHUB_RUN_ATTEMPT: runAttempt,
    },
  })

  const options = { foo: 'bar' }
  await generateProvenance(subject, options)

  const [payload, payloadType, opts] = attestLog[0]

  t.equal(payloadType, 'application/vnd.in-toto+json')
  t.equal(opts, options)

  const provenance = JSON.parse(payload.toString('utf8'))
  t.same(provenance.subject, subject)
  t.equal(provenance.predicate.invocation.configSource.uri, `git+${serverUrl}/${repository}@${ref}`)
  t.equal(provenance.predicate.invocation.configSource.digest.sha1, sha)
  t.equal(provenance.predicate.invocation.configSource.entryPoint, workflowPath)
  t.equal(provenance.predicate.metadata.buildInvocationId, `${runID}-${runAttempt}`)
  t.equal(provenance.predicate.materials[0].uri, `git+${serverUrl}/${repository}@${ref}`)
  t.equal(provenance.predicate.materials[0].digest.sha1, sha)
})

t.test('generateProvenance - incomplete environment', async t => {
  // Reset the spy
  attestLog.length = 0

  // Simulate running in a non-GHA environment
  mockGlobals(t, {
    'process.env': {
      CI: undefined,
      GITHUB_ACTIONS: undefined,
      GITHUB_REPOSITORY: undefined,
      GITHUB_REF: undefined,
      GITHUB_SHA: undefined,
      GITHUB_SERVER_URL: undefined,
      GITHUB_WORKFLOW_REF: undefined,
      GITHUB_RUN_ID: undefined,
      GITHUB_RUN_ATTEMPT: undefined,
    },
  })

  t.doesNotThrow(async () => await generateProvenance(subject, {}))
})
