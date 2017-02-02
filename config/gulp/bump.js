const noTag = ' --no-git-tag';
const tag = '';

module.exports = function(gulp, plugins, versionType, tagged) {
  const conmmand = 'npm version ' + versionType + (tagged ? tag : noTag);
  return plugins.shell.task([conmmand]);
};
