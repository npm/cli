module.exports = {
  ...require('./branch-specific-config.js'),
  // Make workspaces use the global version of in workflows.
  // This is needed while workspaces and npm have different engines.
  // TODO: make npm and its workspaces always use the same engines and delete this.
  npm: 'npm',
}
