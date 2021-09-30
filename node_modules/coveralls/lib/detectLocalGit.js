'use strict';

const fs = require('fs');
const path = require('path');

// branch naming only has a few excluded characters, see git-check-ref-format(1)
const REGEX_BRANCH = /^ref: refs\/heads\/([^?*[\\~^:]+)$/;

function detectLocalGit() {
  let dir = process.cwd();
  let gitDir;

  while (path.resolve('/') !== dir) {
    gitDir = path.join(dir, '.git');
    if (fs.existsSync(path.join(gitDir, 'HEAD'))) {
      break;
    }

    dir = path.dirname(dir);
  }

  if (path.resolve('/') === dir) {
    return;
  }

  const head = fs.readFileSync(path.join(dir, '.git', 'HEAD'), 'utf-8').trim();
  const branch = (head.match(REGEX_BRANCH) || [])[1];
  if (!branch) {
    return { git_commit: head };
  }

  const commit = _parseCommitHashFromRef(dir, branch);

  return {
    git_commit: commit,
    git_branch: branch
  };
}

function _parseCommitHashFromRef(dir, branch) {
  const ref = path.join(dir, '.git', 'refs', 'heads', branch);
  if (fs.existsSync(ref)) {
    return fs.readFileSync(ref, 'utf-8').trim();
  }

  // ref does not exist; get it from packed-refs
  let commit = '';
  const packedRefs = path.join(dir, '.git', 'packed-refs');
  const packedRefsText = fs.readFileSync(packedRefs, 'utf-8');
  packedRefsText.split('\n').forEach(line => {
    if (line.match(`refs/heads/${branch}`)) {
      commit = line.split(' ')[0];
    }
  });
  return commit;
}

module.exports = detectLocalGit;
