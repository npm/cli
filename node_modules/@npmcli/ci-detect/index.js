module.exports = () =>
  process.env.GERRIT_PROJECT ? 'gerrit'
  : process.env.GITLAB_CI ? 'gitlab'
  : process.env.APPVEYOR ? 'appveyor'
  : process.env.CIRCLECI ? 'circle-ci'
  : process.env.SEMAPHORE ? 'semaphore'
  : process.env.DRONE ? 'drone'
  : process.env.GITHUB_ACTION ? 'github-actions'
  : process.env.TDDIUM ? 'tddium'
  : process.env.JENKINS_URL ? 'jenkins'
  : process.env['bamboo.buildKey'] ? 'bamboo'
  : process.env.GO_PIPELINE_NAME ? 'gocd'
  // codeship and a few others
  : process.env.CI_NAME ? process.env.CI_NAME
  // test travis after the others, since several CI systems mimic it
  : process.env.TRAVIS ? 'travis-ci'
  // aws CodeBuild/CodePipeline
  : process.env.CODEBUILD_SRC_DIR ? 'aws-codebuild'
  : process.env.CI === 'true' || process.env.CI === '1' ? 'custom'
  // Google Cloud Build - it sets almost nothing
  : process.env.BUILDER_OUTPUT ? 'builder'
  : false
