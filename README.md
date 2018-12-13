# app-env-loader
A webpack loader to handle specific code base on a different environment. It is likely that our code will run on a different environment that needs to be handled specifically. Let's say making API request, it is gonna to request different API server when running code on dev, testing, live environment. this app-env-loader is designed for this scenario.
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
            loader: 'app-env-loader' // <-- add loader here 
          }
        ]
      }
    ...
```

your environment specific files gonna look like down below, base on dev, testing and live environment

```ecmascript 6
// ./config/config.env.js
export default {
  apiHost: 'dev.api.com',
}
```
```ecmascript 6
// ./config/config.env.testing.js
export default {
  apiHost: 'testing.api.com',
}
```
```ecmascript 6
// ./config/config.env.live.js
export default {
  apiHost: 'live.api.com',
}
```
the '.env.' is required in the file name to tell the loader that you need to handle the file specifically, and an environment specific name is followed right after to tell the loader to handle it on the specific envirnoment. you can import your config file:
```ecmascript 6
// index.js
import { apiHost } from './config/config.env.js'
```
you can config the 'package.json' file:
```javascript
  ...
  "scripts": {
    "start": "node scripts/start.js", // <-- this will load the default env file
    "dev": "node scripts/start.js APP_ENV=dev", // <-- set the APP_ENV to the dev environment
    "build-live": "node scripts/build.js APP_ENV=live ", // <-- set the APP_ENV to the live environment
    "build-test": "node scripts/build.js APP_ENV=testing " // <-- set the APP_ENV to the testing environment
  },
  ...
```
Now, you are able to run your code and the loader will know which file need to be loaded base on the APP_ENV.
```ecmascript 6
APP_ENV is not set  ------->  config.env.js
APP_ENV=dev         ------->  config.env.dev.js
APP_ENV=testing     ------->  config.env.testing.js
APP_ENV=live        ------->  config.env.live.js
```
If you are not happy with the name 'env', you can customise it yourself by setting the loader option:


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
            loader: 'app-env-loader', 
            options: {
              test: /\.environment\./ // <-- set the RegExp the match the name you like. 
            }
          }
        ]
      }
    ...
```
and now you files name can be like down below:
```ecmascript 6
config.environment.js
config.environment.dev.js
config.environment.testing.js
config.environment.live.js
```