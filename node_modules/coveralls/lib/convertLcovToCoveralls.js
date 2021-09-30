'use strict';

const fs = require('fs');
const path = require('path');
const lcovParse = require('lcov-parse');
const logger = require('./logger')();

const detailsToCoverage = (length, details) => {
  const coverage = new Array(length);

  details.forEach(obj => {
    coverage[obj.line - 1] = obj.hit;
  });

  return coverage;
};

const detailsToBranches = details => {
  const branches = [];

  details.forEach(obj => {
    ['line', 'block', 'branch', 'taken'].forEach(key => {
      branches.push(obj[key] || 0);
    });
  });

  return branches;
};

const convertLcovFileObject = (file, filepath) => {
  const rootpath = filepath;
  filepath = path.resolve(rootpath, file.file);
  const source = fs.readFileSync(filepath, 'utf8');
  const lines = source.split('\n');
  const coverage = detailsToCoverage(lines.length, file.lines.details);
  const branches = detailsToBranches(file.branches.details);

  return {
    name: path.relative(rootpath, path.resolve(rootpath, file.file)).split(path.sep).join('/'),
    source,
    coverage,
    branches
  };
};

const cleanFilePath = file => {
  if (file.includes('!')) {
    const regex = /^(.*!)(.*)$/g;
    const matches = regex.exec(file);
    return matches[matches.length - 1];
  }

  return file;
};

const convertLcovToCoveralls = (input, options, cb) => {
  let filepath = options.filepath || '';
  logger.debug('in: ', filepath);
  filepath = path.resolve(process.cwd(), filepath);
  lcovParse(input, (err, parsed) => {
    if (err) {
      logger.error('error from lcovParse: ', err);
      logger.error('input: ', input);
      return cb(err);
    }

    const postJson = {
      source_files: []
    };

    if (options.flag_name) {
      postJson.flag_name = options.flag_name;
    }

    if (options.git) {
      postJson.git = options.git;
    }

    if (options.run_at) {
      postJson.run_at = options.run_at;
    }

    if (options.service_name) {
      postJson.service_name = options.service_name;
    }

    if (options.service_number) {
      postJson.service_number = options.service_number;
    }

    if (options.service_job_id) {
      postJson.service_job_id = options.service_job_id;
    }

    if (options.service_job_number) {
      postJson.service_job_number = options.service_job_number;
    }

    if (options.service_pull_request) {
      postJson.service_pull_request = options.service_pull_request;
    }

    if (options.repo_token) {
      postJson.repo_token = options.repo_token;
    }

    if (options.parallel) {
      postJson.parallel = options.parallel;
    }

    parsed.forEach(file => {
      file.file = cleanFilePath(file.file);
      const currentFilePath = path.resolve(filepath, file.file);
      if (fs.existsSync(currentFilePath)) {
        postJson.source_files.push(convertLcovFileObject(file, filepath));
      }
    });

    return cb(null, postJson);
  });
};

module.exports = convertLcovToCoveralls;

/* example coveralls json file

{
  "service_job_id": "1234567890",
  "service_name": "travis-ci",
  "source_files": [
    {
      "name": "example.rb",
      "source": "def four\n  4\nend",
      "coverage": [null, 1, null]
    },
    {
      "name": "two.rb",
      "source": "def seven\n  eight\n  nine\nend",
      "coverage": [null, 1, 0, null]
    }
  ]
}

example output from lcov parser:

[
  {
    "file": "index.js",
    "lines": {
      "found": 0,
      "hit": 0,
      "details": [
        {
          "line": 1,
          "hit": 1
        },
        {
          "line": 2,
          "hit": 1
        },
        {
          "line": 3,
          "hit": 1
        },
        {
          "line": 5,
          "hit": 1
        }
      ]
    }
  }
]

*/
