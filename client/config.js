// filepath: c:\Users\zag20\Desktop\sumi-mvp\client\config.js
import Constants from 'expo-constants';

const ENV = {
  dev: {
    API_URL: 'http://localhost:5050',
    CLIENT_URL:"http://localhost:8081"
  },
  prod: {
    API_URL: 'http://localhost:5050',
    CLIENT_URL: "http://localhost:8081"
  },
};

const getEnvVars = (env = Constants.manifest.releaseChannel) => {
  if (env === 'default') {
    return ENV.dev;
  } else {
    return ENV.prod;
  }
};

export default getEnvVars;