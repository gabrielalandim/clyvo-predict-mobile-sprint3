const { execFileSync } = require('child_process');

function git(...args) {
  try {
    return execFileSync('git', args, { stdio: ['ignore', 'pipe', 'ignore'], windowsHide: true }).toString().trim();
  } catch {
    return '';
  }
}

const commitHash = process.env.EAS_BUILD_GIT_COMMIT_HASH || git('rev-parse', 'HEAD') || 'desconhecido';
const hasLocalChanges = !process.env.EAS_BUILD_GIT_COMMIT_HASH && git('status', '--porcelain').length > 0;

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    commitHash,
    hasLocalChanges,
    buildDate: new Date().toISOString(),
  },
});
