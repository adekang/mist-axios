import type { AxiosInstance, AxiosRequestConfig } from './types';
import Axios from './core/Axios';
import _default from './defaults';

function createInstance(config: AxiosRequestConfig): AxiosInstance {
  const context = new Axios(config);

  return context as AxiosInstance;
}

const axios = createInstance(_default);

export default axios;
