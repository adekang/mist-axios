import type { AxiosInstance, AxiosRequestConfig } from './types';
import Axios from './core/Axios';

function createInstance(config: AxiosRequestConfig): AxiosInstance {
  const context = new Axios(config);

  return context as AxiosInstance;
}

const axios = createInstance({
  method: 'get',
  headers: {
    'Content-Type': 'application/json'
  },
  validataStatus: (status: number) => status >= 200 && status < 300
});

export default axios;
