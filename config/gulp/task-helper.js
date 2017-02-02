module.exports = function(gulp, plugins) {
  return {
    get: function(task) {
      const restArgs = [].slice.call(arguments, 1);
      const appliedArgs = [gulp, plugins].concat(restArgs);

      return require('./' + task).apply(null, appliedArgs);
    }
  };
};
