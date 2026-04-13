const { execFileSync } = require('node:child_process')

module.exports = async ({ github, context, core }) => {
  const pr = context.payload.pull_request
  const sha = process.env.MERGE_COMMIT_SHA
  const { owner, repo } = context.repo

  // For 'labeled' events, only process the newly added label.
  // For 'closed' (merged) events, process all backport labels on the PR.
  const labels = context.payload.action === 'labeled'
    ? [context.payload.label.name].filter(n => n.startsWith('backport:'))
    : pr.labels.map(l => l.name).filter(n => n.startsWith('backport:'))

  if (!labels.length) {
    core.info('No backport labels found, nothing to do')
    return
  }

  const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim()

  // Build cherry-pick args based on merge strategy:
  // - Merge commit (2 parents): cherry-pick -m 1
  // - Squash (1 parent, single commit): cherry-pick that commit
  // - Rebase (1 parent, N commits rebased onto base): cherry-pick the full range to preserve all conventional commits
  const cherryPickArgs = await (async () => {
    const parentCount = git('cat-file', '-p', sha)
      .split('\n')
      .filter(l => l.startsWith('parent ')).length

    if (parentCount > 1) {
      core.info('Detected merge commit')
      return ['-x', '-m', '1', sha]
    }

    if (pr.commits > 1) {
      // Could be squash or rebase. Rebase preserves commit subjects, squash does not.
      const { data: prCommits } = await github.rest.pulls.listCommits({
        owner, repo, pull_number: pr.number, per_page: 100,
      })
      const prSubjects = prCommits.map(c => c.commit.message.split('\n')[0])
      try {
        const branchSubjects = git('log', '--format=%s', '--reverse', `${sha}~${prCommits.length}..${sha}`)
          .split('\n')
        if (
          branchSubjects.length === prSubjects.length &&
          branchSubjects.every((s, i) => s === prSubjects[i])
        ) {
          core.info(`Detected rebase merge with ${prCommits.length} commits`)
          return ['-x', `${sha}~${prCommits.length}..${sha}`]
        }
      } catch {
        // Fall through to squash
      }
      core.info('Detected squash merge')
    }

    return ['-x', sha]
  })()

  const startRef = git('rev-parse', 'HEAD')
  const results = []

  for (const label of labels) {
    const version = label.replace('backport:', '')
    const target = `release/${version}`
    const branch = `backport/${version}/${pr.number}`

    try {
      // Target branch is available locally from fetch-depth: 0
      try {
        git('rev-parse', '--verify', `refs/remotes/origin/${target}`)
      } catch {
        throw new Error(`Target branch \`${target}\` does not exist`)
      }

      // Backport branch requires ls-remote since a parallel run may have created it after our checkout
      try {
        git('ls-remote', '--exit-code', 'origin', `refs/heads/${branch}`)
        core.info(`Branch ${branch} already exists, skipping`)
        continue
      } catch {
        // Expected — branch doesn't exist yet
      }

      git('checkout', '-b', branch, `origin/${target}`)
      git('cherry-pick', ...cherryPickArgs)
      git('push', 'origin', branch)

      const { data: backportPr } = await github.rest.pulls.create({
        owner,
        repo,
        title: pr.title,
        body: `Backport of #${pr.number} to \`${target}\`.`,
        head: branch,
        base: target,
      })

      // Trigger CI on the backport branch. Events from GITHUB_TOKEN don't trigger workflows, but workflow_dispatch is an explicit exception to that rule.
      await github.rest.actions.createWorkflowDispatch({
        owner, repo, workflow_id: 'ci.yml', ref: branch,
      })

      results.push(`🎉 Backport to \`${target}\` created: #${backportPr.number}`)
      core.info(`Created backport PR #${backportPr.number} for ${target}`)
    } catch (error) {
      core.error(`Backport to ${target} failed: ${error.message}`)

      results.push([
        `⚠️ Backport to \`${target}\` failed.`,
        '',
        'This usually means the cherry-pick had conflicts. Please create a manual backport:',
        '',
        '```sh',
        `git fetch origin ${target}`,
        `git checkout -b ${branch} origin/${target}`,
        `git cherry-pick ${cherryPickArgs.join(' ')}`,
        '# resolve any conflicts, then:',
        `git push origin ${branch}`,
        '```',
        '',
        '<details><summary>Error details</summary>',
        '',
        '```',
        error.message,
        '```',
        '',
        '</details>',
      ].join('\n'))
    } finally {
      try {
        git('cherry-pick', '--abort')
      } catch { /* noop */ }
      git('checkout', '-f', startRef)
      try {
        git('branch', '-D', branch)
      } catch { /* noop */ }
    }
  }

  if (results.length) {
    await github.rest.issues.createComment({
      owner,
      repo,
      issue_number: pr.number,
      body: results.join('\n\n---\n\n'),
    })
  }

  const failures = results.filter(r => r.startsWith('⚠️')).length
  if (failures) {
    core.setFailed(`${failures} backport(s) failed`)
  }
}
