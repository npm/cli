'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const logger = require('./logger')();
const fetchGitData = require('./fetchGitData');
const detectLocalGit = require('./detectLocalGit');
const index = require('..');

const getBaseOptions = cb => {
  const options = {};
  let git_commit = process.env.COVERALLS_GIT_COMMIT;
  let git_branch = process.env.COVERALLS_GIT_BRANCH;
  let git_committer_name;
  let git_committer_email;
  let git_message;

  const match = (process.env.CI_PULL_REQUEST || '').match(/(\d+)$/);

  if (match) {
    options.service_pull_request = match[1];
  }

  if (process.env.TRAVIS) {
    options.service_name = 'travis-ci';
    options.service_number = process.env.TRAVIS_BUILD_NUMBER;
    options.service_job_id = process.env.TRAVIS_JOB_ID;
    options.service_pull_request = process.env.TRAVIS_PULL_REQUEST;
    git_commit = 'HEAD';
    git_branch = process.env.TRAVIS_BRANCH;
  }

  if (process.env.DRONE) {
    options.service_name = 'drone';
    options.service_job_id = process.env.DRONE_BUILD_NUMBER;
    options.service_pull_request = process.env.DRONE_PULL_REQUEST;
    git_committer_name = process.env.DRONE_COMMIT_AUTHOR;
    git_committer_email = process.env.DRONE_COMMIT_AUTHOR_EMAIL;
    git_commit = process.env.DRONE_COMMIT;
    git_branch = process.env.DRONE_BRANCH;
    git_message = process.env.DRONE_COMMIT_MESSAGE;
  }

  if (process.env.JENKINS_URL || process.env.JENKINS_HOME) {
    options.service_name = 'jenkins';
    options.service_job_id = process.env.BUILD_ID;
    options.service_pull_request = process.env.CHANGE_ID || process.env.ghprbPullId;
    git_committer_name = process.env.CHANGE_AUTHOR;
    git_committer_email = process.env.CHANGE_AUTHOR_EMAIL;
    git_commit = process.env.GIT_COMMIT;
    git_branch = process.env.CHANGE_BRANCH || process.env.GIT_BRANCH || process.env.BRANCH_NAME;
  }

  if (process.env.CIRCLECI) {
    options.service_name = 'circleci';
    options.service_number = process.env.CIRCLE_WORKFLOW_ID;
    options.service_job_number = process.env.CIRCLE_BUILD_NUM;

    if (process.env.CI_PULL_REQUEST) {
      const pr = process.env.CI_PULL_REQUEST.split('/pull/');
      options.service_pull_request = pr[1];
    }

    git_commit = process.env.CIRCLE_SHA1;
    git_branch = process.env.CIRCLE_BRANCH;
  }

  if (process.env.CI_NAME && process.env.CI_NAME === 'codeship') {
    options.service_name = 'codeship';
    options.service_job_id = process.env.CI_BUILD_NUMBER;
    git_commit = process.env.CI_COMMIT_ID;
    git_branch = process.env.CI_BRANCH;
    git_committer_name = process.env.CI_COMMITTER_NAME;
    git_committer_email = process.env.CI_COMMITTER_EMAIL;
    git_message = process.env.CI_COMMIT_MESSAGE;
  }

  if (process.env.WERCKER) {
    options.service_name = 'wercker';
    options.service_job_id = process.env.WERCKER_BUILD_ID;
    git_commit = process.env.WERCKER_GIT_COMMIT;
    git_branch = process.env.WERCKER_GIT_BRANCH;
  }

  if (process.env.GITLAB_CI) {
    options.service_name = 'gitlab-ci';
    options.service_job_number = process.env.CI_BUILD_NAME;
    options.service_job_id = process.env.CI_BUILD_ID;
    options.service_pull_request = process.env.CI_MERGE_REQUEST_IID;
    git_commit = process.env.CI_BUILD_REF;
    git_branch = process.env.CI_BUILD_REF_NAME;
  }

  if (process.env.APPVEYOR) {
    options.service_name = 'appveyor';
    options.service_job_number = process.env.APPVEYOR_BUILD_NUMBER;
    options.service_job_id = process.env.APPVEYOR_BUILD_ID;
    git_commit = process.env.APPVEYOR_REPO_COMMIT;
    git_branch = process.env.APPVEYOR_REPO_BRANCH;
  }

  if (process.env.SURF_SHA1) {
    options.service_name = 'surf';
    git_commit = process.env.SURF_SHA1;
    git_branch = process.env.SURF_REF;
  }

  if (process.env.BUILDKITE) {
    options.service_name = 'buildkite';
    options.service_job_number = process.env.BUILDKITE_BUILD_NUMBER;
    options.service_job_id = process.env.BUILDKITE_BUILD_ID;
    options.service_pull_request = process.env.BUILDKITE_PULL_REQUEST;
    git_commit = process.env.BUILDKITE_COMMIT;
    git_branch = process.env.BUILDKITE_BRANCH;
    git_committer_name = process.env.BUILDKITE_BUILD_CREATOR;
    git_committer_email = process.env.BUILDKITE_BUILD_CREATOR_EMAIL;
    git_message = process.env.BUILDKITE_MESSAGE;
  }

  if (process.env.SEMAPHORE) {
    options.service_name = 'semaphore';
    options.service_job_id = process.env.SEMAPHORE_BUILD_NUMBER;
    git_commit = process.env.REVISION;
    git_branch = process.env.BRANCH_NAME;
  }

  if (process.env.TF_BUILD) {
    options.service_name = 'Azure Pipelines';
    options.service_job_id = process.env.BUILD_BUILDID;
    options.service_pull_request = process.env.SYSTEM_PULLREQUEST_PULLREQUESTNUMBER;
    git_commit = process.env.BUILD_SOURCEVERSION;
    git_branch = process.env.BUILD_SOURCEBRANCHNAME;
  }

  if (process.env.CF_BRANCH) {
    options.service_name = 'Codefresh';
    options.service_job_id = process.env.CF_BUILD_ID;
    options.service_pull_request = process.env.CF_PULL_REQUEST_ID;
    git_commit = process.env.CF_REVISION;
    git_branch = process.env.CF_BRANCH;
    git_committer_name = process.env.CF_COMMIT_AUTHOR;
    git_message = process.env.CF_COMMIT_MESSAGE;
  }

  options.run_at = process.env.COVERALLS_RUN_AT || JSON.stringify(new Date()).slice(1, -1);

  if (process.env.COVERALLS_SERVICE_NUMBER) {
    options.service_number = process.env.COVERALLS_SERVICE_NUMBER;
  }

  if (process.env.COVERALLS_SERVICE_JOB_NUMBER) {
    options.service_job_number = process.env.COVERALLS_SERVICE_JOB_NUMBER;
  }

  if (process.env.COVERALLS_SERVICE_JOB_ID) {
    options.service_job_id = process.env.COVERALLS_SERVICE_JOB_ID;
  }

  if (!git_commit || !git_branch) {
    const data = detectLocalGit();
    if (data) {
      git_commit = git_commit || data.git_commit;
      git_branch = git_branch || data.git_branch;
    }
  }

  if (process.env.COVERALLS_PARALLEL) {
    options.parallel = true;
  }

  // load a .coveralls.yml file
  const coveralls_yaml_conf = (() => {
    const yml = path.join(process.cwd(), '.coveralls.yml');
    try {
      if (fs.statSync(yml).isFile()) {
        return yaml.safeLoad(fs.readFileSync(yml, 'utf8'));
      }
    } catch (_) {
      logger.debug('No valid .coveralls.yml file found');
    }
  })();

  // try to get repo token and service name from .coveralls.yml file
  if (coveralls_yaml_conf) {
    if (coveralls_yaml_conf.repo_token) {
      options.repo_token = coveralls_yaml_conf.repo_token;
    }

    if (coveralls_yaml_conf.service_name) {
      options.service_name = coveralls_yaml_conf.service_name;
    }
  }

  // try to get the repo token as an environment variable
  if (process.env.COVERALLS_REPO_TOKEN) {
    options.repo_token = process.env.COVERALLS_REPO_TOKEN;
  }

  if (options.service_name === 'travis-pro' && !options.repo_token) {
    logger.warn('Repo token could not be determined.  Continuing without it. ' +
                'This is necessary for private repos only, so may not be an issue at all.');
  }

  // try to get the service name as an environment variable
  if (process.env.COVERALLS_SERVICE_NAME) {
    options.service_name = process.env.COVERALLS_SERVICE_NAME;
  }

  if (process.env.COVERALLS_FLAG_NAME) {
    options.flag_name = process.env.COVERALLS_FLAG_NAME;
  }

  if (git_commit) {
    fetchGitData({
      head: {
        id: git_commit,
        committer_name: git_committer_name,
        committer_email: git_committer_email,
        message: git_message
      },
      branch: git_branch
    }, (err, git) => {
      if (err) {
        logger.warn('there was an error getting git data: ', err);
      } else {
        options.git = git;
      }

      return cb(err, options);
    });
  } else {
    return cb(null, options);
  }
};

const getOptions = (cb, _userOptions) => {
  if (!cb) {
    throw new Error('getOptions requires a callback');
  }

  const userOptions = _userOptions || {};

  getBaseOptions((err, options) => {
    // minimist populates options._ with non-option command line arguments
    const firstNonOptionArgument = index.options._[0];

    if (firstNonOptionArgument) {
      options.filepath = firstNonOptionArgument;
    }

    // lodash or else would be better, but no need for the extra dependency
    for (const option in userOptions) {
      if (Object.prototype.hasOwnProperty.call(userOptions, option)) {
        options[option] = userOptions[option];
      }
    }

    cb(err, options);
  });
};

module.exports.getBaseOptions = getBaseOptions;
module.exports.getOptions = getOptions;
