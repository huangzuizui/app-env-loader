const fs = require('fs');
const loaderUtils = require('loader-utils');
const defaultEnvPathReg = /\.env\./;

module.exports = function (source) {
  let envPathReg;
  const path = this.resourcePath;
  const envType = process.argv.reduce((_, arg) => (/^APP_ENV=([\S]+)$/.test(arg) && RegExp.$1)) || process.env.APP_ENV;

  // do nothing when APP_ENV is not set;
  if (!envType) return source;

  const options = loaderUtils.getOptions(this);

  if (options && options.test) {
    if (!(options.test instanceof RegExp)) throw new Error('app-env-loader test option should be a regular expression');
    envPathReg = options.test;
  } else {
    envPathReg = defaultEnvPathReg;
  }

  // do nothing when resource path is meet the requirements of envPathReg
  if (!envPathReg.test(path)) return source;

  const envResourcePath = this.resourcePath.replace(envPathReg, function (p) {
    return `${p}${envType}.`;
  });

  // a warning will present when the relevant env file is not found
  if (!fs.existsSync(envResourcePath)) {
    console.warn(`env file "${envResourcePath}" dose not exist!`);
    return source;
  }

  const envResource = fs.readFileSync(envResourcePath, 'utf-8');

  return envResource;
};