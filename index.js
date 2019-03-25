const fs = require('fs');
const loaderUtils = require('loader-utils');

let envs;
let argReg;
let envConfigs;

module.exports = function (source) {
  // do nothing if environment variable is not set in command line;
  if (envs === null) return source;
  // do nothing if loader config is not set in webpack config;

  if (envConfigs === null) return source;
  envConfigs = loaderUtils.getOptions(this) && loaderUtils.getOptions(this).environments;

  if (!envConfigs || !envConfigs.length) {
    console.warn('no app-env-loader environments options setting is found in webpack config!')
    envConfigs = null;
    return source;
  }

  if (envs === undefined) {
    envs = {};
    process.argv.forEach((argv) => {
      envConfigs.forEach((arg) => {
        if ((new RegExp(`${arg.key}=([\\S]+)$`)).test(argv) && RegExp.$1) {
          envs[arg.name] = RegExp.$1;
        }
      })
    })

    // no env require in command line
    if (!Object.keys(envs).length) {
      envs = null;
      return source;
    }

    argReg = new RegExp(`(${Object.keys(envs).join('|')})`, 'g');
  }

  const path = this.resourcePath;
  const isEnvPath = path.search(argReg) > -1;

  // no env config info in file path
  if (!isEnvPath) return source;

  const envResourcePath = path.replace(argReg, envKey => envs[envKey]);

  // a warning will present when the relevant env file is not found, and will fallback to origin path instead
  if (!fs.existsSync(envResourcePath)) {
    console.warn(`environment file "${envResourcePath}" dose not exist! fallback to "${path}"`);
    return source;
  }

  const envResource = fs.readFileSync(envResourcePath, 'utf-8');

  return envResource;
};