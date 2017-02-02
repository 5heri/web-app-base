import AppConfig from '../AppConfig';
const awsAssetKey = process.env.AWS_ASSET_KEY;
const awsAssetSecret = process.env.AWS_ASSET_SECRET;
const awsAssetRegion = process.env.AWS_ASSET_REGION;

module.exports = function(gulp, plugins) {
  return function() {
    const credentials = {
      key: awsAssetKey,
      secret: awsAssetSecret,
      bucket: AppConfig.s3AssetBucket,
      region: awsAssetRegion
    };
    if (!AppConfig.isDevelopment && !AppConfig.isQA) {
      gulp.src( `${AppConfig.localAssetPath}/**` )
        .pipe(plugins.rename({dirname: AppConfig.s3AssetDirectory}))
        .pipe(plugins.s3(credentials));
    } else {
      console.log('No assets to deploy in development/qa environment.'); // eslint-disable-line
    }
  };
};
