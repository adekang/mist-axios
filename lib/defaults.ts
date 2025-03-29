import type { AxiosRequestConfig } from './types';
import { processHeaders } from './helpers/headers';
import { transformRequest } from './helpers/transform';

export default {
  timeout: 0,
  adapter: 'xhr',
  method: 'get',
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },
  xsrfHeaderName: 'X-XSRF-TOKEN',
  xsrfCookieName: 'XSRF-TOKEN',
  transformRequest: [
    (data, headers) => {
      processHeaders(headers, data);
      return transformRequest(data);
    }
  ],
  transformResponse: [
    function (data) {
      return transformRequest(data);
    }

  ],
  validataStatus: (status: number) => {
    return status >= 200 && status < 300;
  }

} as AxiosRequestConfig;
