'use strict';

const { execFile } = require('child_process');
require('./logger')();

function fetchGitData(git, cb) {
  if (!cb) {
    throw new Error('fetchGitData requires a callback');
  }

  //-- Malformed/undefined git object
  if (typeof git === 'undefined') {
    return cb(new Error('No options passed'));
  }

  if (!Object.prototype.hasOwnProperty.call(git, 'head')) {
    return cb(new Error('You must provide the head'));
  }

  if (!Object.prototype.hasOwnProperty.call(git.head, 'id')) {
    return cb(new Error('You must provide the head.id'));
  }

  //-- Set required properties of git if they weren"t provided
  if (!Object.prototype.hasOwnProperty.call(git, 'branch')) {
    git.branch = '';
  }

  if (!Object.prototype.hasOwnProperty.call(git, 'remotes')) {
    git.remotes = [];
  }

  //-- Assert the property types
  if (typeof git.branch !== 'string') {
    git.branch = '';
  }

  if (!(Array.isArray(git.remotes))) {
    git.remotes = [];
  }

  //-- Use git?
  execFile('git', ['rev-parse', '--verify', git.head.id], err => {
    if (err) {
      // git is not available...
      git.head.author_name = git.head.author_name || 'Unknown Author';
      git.head.author_email = git.head.author_email || '';
      git.head.committer_name = git.head.committer_name || 'Unknown Committer';
      git.head.committer_email = git.head.committer_email || '';
      git.head.message = git.head.message || 'Unknown Commit Message';
      return cb(null, git);
    }

    fetchHeadDetails(git, cb);
  });
}

function fetchBranch(git, cb) {
  execFile('git', ['branch'], (err, branches) => {
    if (err) {
      return cb(err);
    }

    git.branch = (branches.match(/^\* (\w+)/) || [])[1];
    fetchRemotes(git, cb);
  });
}

const REGEX_COMMIT_DETAILS = /\nauthor (.+?) <([^>]*)>.+\ncommitter (.+?) <([^>]*)>.+[\S\s]*?\n\n(.*)/m;

function fetchHeadDetails(git, cb) {
  execFile('git', ['cat-file', '-p', git.head.id], (err, response) => {
    if (err) {
      return cb(err);
    }

    const items = response.match(REGEX_COMMIT_DETAILS).slice(1);
    const fields = ['author_name', 'author_email', 'committer_name', 'committer_email', 'message'];
    fields.forEach((field, index) => {
      git.head[field] = items[index];
    });

    if (git.branch) {
      fetchRemotes(git, cb);
    } else {
      fetchBranch(git, cb);
    }
  });
}

function fetchRemotes(git, cb) {
  execFile('git', ['remote', '-v'], (err, remotes) => {
    if (err) {
      return cb(err);
    }

    const processed = {};
    remotes.split('\n').forEach(remote => {
      if (!/\s\(push\)$/.test(remote)) {
        return;
      }

      remote = remote.split(/\s+/);
      saveRemote(processed, git, remote[0], remote[1]);
    });
    cb(null, git);
  });
}

function saveRemote(processed, git, name, url) {
  const key = `${name}-${url}`;
  if (Object.prototype.hasOwnProperty.call(processed, key)) {
    return;
  }

  processed[key] = true;
  git.remotes.push({ name, url });
}

module.exports = fetchGitData;
