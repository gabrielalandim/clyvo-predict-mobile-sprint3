const { execSync } = require('child_process');

function git(command) {
  try {
    return execSync(`git ${command}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return '';
  }
}

const commitHash = process.env.EAS_BUILD_GIT_COMMIT_HASH || git('rev-parse HEAD') || 'desconhecido';
const hasLocalChanges = !process.env.EAS_BUILD_GIT_COMMIT_HASH && git('status --porcelain').length > 0;

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    commitHash,
    hasLocalChanges,
    buildDate: new Date().toISOString(),
  },
});
