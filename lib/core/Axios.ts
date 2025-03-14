import type { AxiosRequestConfig, Axios as IAxios } from '@/types';
import dispatchRequest from '@/core/dispatchRequest';
import mergeConfig from './mergeConfig';

export default class Axios implements IAxios {
  defaults: AxiosRequestConfig;
  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig;
  }

  request(url: string | AxiosRequestConfig, config: AxiosRequestConfig = {}): Promise<any> {
    if (typeof url === 'string') {
      config.url = url;
    }
    else {
      config = url;
    }

    config = mergeConfig(this.defaults, config);

    return dispatchRequest(config);
  }
}
