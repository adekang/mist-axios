import type { AxiosRequestConfig } from './types';

export default {
  timeout: 0,
  adapter: 'xhr',
  method: 'get',
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },
  validataStatus: (status: number) => {
    return status >= 200 && status < 300;
  }

} as AxiosRequestConfig;
