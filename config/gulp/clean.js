import AppConfig from '../AppConfig';

const del = require('del');

module.exports = function() {
  return function(cb) {
    del([`${AppConfig.localAssetPath}/**/*`, './public/ver.json'], cb);
  };
};
