import { ENV_URL_API } from '@/configs/env';
import Fetcher from '@/plugins/fetcher';

import { isEnvProduction } from '../env';

import { defineHeaders } from './headers';


const baseURL = ENV_URL_API;

export default (function () {
  if (!isEnvProduction()) {
    console.log('Initializing Fetcher helper');
    console.log(`baseURL API: ${baseURL}`);
  }

  let fetcherFunction = Fetcher({ baseURL, headers: defineHeaders });
  if (process.env.NODE_ENV === 'development') {
    console.log('Throttling Fetcher helper in development mode');
  }

  return fetcherFunction;
})();
