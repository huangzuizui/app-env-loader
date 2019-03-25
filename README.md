# app-env-loader
A webpack loader to handle specific code base on a different environment. It is likely that our code will run on a 
different environment that needs to be handled specifically. Let's say making API request, it is gonna to request 
different API server when running code on dev, testing, live environment. this app-env-loader is designed for this 
scenario.

It's now support multiple environment config, Let's say If you want to load file base on two kinds of environments 
which are app env(dev, testing, uat, live. etc) and region(us, uk, cn, th. etc)
## Install
```javascript
npm install app-env-loader --save-dev
```
## Usage
**webpack.config.js**
```ecmascript 6
    ...
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        include: paths.appSrc,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              ...
            },
          },
          {
            loader: 'app-env-loader', // <-- add loader here 
            options: {
              environments: [ // <-- environments setting are mandatory
                {
                  key: 'APP_ENV', // <-- 'key' is the environment variable name you specified in command line.
                  name: 'env', // <-- 'name' is the the default part of string in the file path, which will be replaced by environment variable value you specified in command line.
                },
                {
                  key: 'APP_REGION',
                  name: 'region',
                },
              ]
            }
          }
        ]
      }
    ...
```

your environment specific files gonna look like down below, base on dev, testing and live environment

```ecmascript 6
// ./config/config.env.region.js
export default {
  apiHost: 'dev.api.com',
  language: 'us'
}
```
```ecmascript 6
// ./config/config.env.th.js
export default {
  apiHost: 'dev.api.com',
  language: 'th'
}
```
```ecmascript 6
// ./config/config.testing.cn.js
export default {
  apiHost: 'testing.api.com',
  language: 'cn'
}
```
```ecmascript 6
// ./config/config.live.us.js
export default {
  apiHost: 'live.api.com',
  language: 'us'
}
```
the 'env' or 'region' is required in the file name to tell the loader that you need to handle the file specifically, 
and the default environment name would replace  the specific envirnoment name. you can import your config file:
```ecmascript 6
// index.js
import { apiHost } from './config/config.env.region.js'
```
you can config the 'package.json' file:
```javascript
  ...
  "scripts": {
    "start": "node scripts/start.js", // <-- this will load the default env file
    "dev": "node scripts/start.js APP_ENV=dev", // <-- set the APP_ENV to the dev environment, region to default
    "dev:us": "node scripts/start.js APP_ENV=dev APP_REGION=us", // <-- set the APP_ENV to the dev environment, region to us
    "build:live:us": "node scripts/build.js APP_ENV=live APP_REGION=us", // <-- set the APP_ENV to the live environment, region to us
    "build:live:uk": "node scripts/build.js APP_ENV=live APP_REGION=uk", // <-- set the APP_ENV to the live environment, region to uk
    "build:live:th": "node scripts/build.js APP_ENV=live APP_REGION=th", // <-- set the APP_ENV to the live environment, region to th
    "build:test:cn": "node scripts/build.js APP_ENV=testing APP_REGION=cn " // <-- set the APP_ENV to the testing environment, region to cn
  },
  ...
```
Now, you are able to run your code and the loader will know which file need to be loaded base on the APP_ENV and APP_REGION.
```ecmascript 6
APP_ENV APP_REGION both not set ------->  config.env.region.js
APP_ENV=dev APP_REGION is not set------>  config.dev.region.js
APP_ENV=dev APP_REGION=th       ------->  config.dev.th.js
APP_ENV=testing APP_REGION=us   ------->  config.testing.us.js
APP_ENV=live APP_REGION=cn      ------->  config.live.cn.js
```
PS: the loader simply replace the environment name in the file path which means it matters not the environment string 
is in the file name or the fold name include that file. eg: both `foo/env/bar/baz.js` or `foo/bar/baz.env.js` is valid.