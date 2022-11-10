const { sigstore } = require('sigstore')

const INTOTO_PAYLOAD_TYPE = 'application/vnd.in-toto+json'
const INTOTO_STATEMENT_TYPE = 'https://in-toto.io/Statement/v0.1'
const SLSA_PREDICATE_TYPE = 'https://slsa.dev/provenance/v0.2'

const BUILDER_ID_PREFIX = 'https://github.com/npm/slsa-provenance'
const BUILD_TYPE_PREFIX = 'https://github.com/npm/slsa-provenance/gha'
const BUILD_TYPE_VERSION = 'v0'

const generateProvenance = async (subject, opts={}) => {
  const { env } = process
  // Ensure that we're running in GHA and an OIDC token is available
  if (
    env['CI'] !== 'true' ||
    env['GITHUB_ACTIONS'] !== 'true' ||
    !env['ACTIONS_ID_TOKEN_REQUEST_URL']
  ) {
    return null
  }

  const provenance = getProvenance(subject)
  const payload = Buffer.from(JSON.stringify(provenance))

  return sigstore.signAttestation(payload, INTOTO_PAYLOAD_TYPE, opts)
}

const getProvenance = (subject) => {
  return {
    _type: INTOTO_STATEMENT_TYPE,
    subject: [getSubject(subject)],
    predicateType: SLSA_PREDICATE_TYPE,
    predicate: getPredicate(),
  }
}

const getSubject = (subject) => {
  return {
    name: subject.name,
    digest: { [subject.algorithm]: subject.digest },
  }
}

const getPredicate = () => {
  const { env } = process

  return {
    buildType: `${BUILD_TYPE_PREFIX}@${BUILD_TYPE_VERSION}`,
    builder: { id: getBuilderID() },
    invocation: {
      configSource: {
        uri: `git+${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}@${env.GITHUB_REF}`,
        digest: {
          sha1: env.GITHUB_SHA,
        },
        entryPoint: env.GITHUB_WORKFLOW_PATH || env.GITHUB_WORKFLOW,
      },
      parameters: {},
      environment: getEnvironment(),
    },
    metadata: {
      buildInvocationId: `${env.GITHUB_RUN_ID}-${env.GITHUB_RUN_ATTEMPT}`,
      completeness: {
        parameters: false,
        environment: false,
        materials: false,
      },
      reproducible: false,
    },
    materials: [
      {
        uri: `git+${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}`,
        digest: {
          sha1: env.GITHUB_SHA,
        },
      },
    ],
  }
}

const getBuilderID = () => {
  return `${BUILDER_ID_PREFIX}@[INSERT_NPM_CLI_VERSION_HERE]`
}

const getEnvironment = () => {
  const { env } = process
  return {
    GITHUB_EVENT_NAME: env.GITHUB_EVENT_NAME,
    GITHUB_JOB: env.GITHUB_JOB,
    GITHUB_REF: env.GITHUB_REF,
    GITHUB_REF_TYPE: env.GITHUB_REF_TYPE,
    GITHUB_REPOSITORY: env.GITHUB_REPOSITORY,
    GITHUB_RUN_ATTEMPT: env.GITHUB_RUN_ATTEMPT,
    GITHUB_RUN_ID: env.GITHUB_RUN_ID,
    GITHUB_RUN_NUMBER: env.GITHUB_RUN_NUMBER,
    GITHUB_SHA: env.GITHUB_SHA,
    GITHUB_WORKFLOW: env.GITHUB_WORKFLOW,
    IMAGE_OS: env.ImageOS,
    IMAGE_VERSION: env.ImageVersion,
    RUNNER_ARCH: env.RUNNER_ARCH,
    RUNNER_NAME: env.RUNNER_NAME,
    RUNNER_OS: env.RUNNER_OS,
  }
}

module.exports = generateProvenance
