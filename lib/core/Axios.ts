import type { AxiosRequestConfig, Axios as IAxios, Method } from '@/types';
import dispatchRequest, { transformURL } from '@/core/dispatchRequest';
import mergeConfig from './mergeConfig';

export default class Axios implements IAxios {
  defaults: AxiosRequestConfig;

  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig;
    this._eachMethodNoData();
    this._eachMethodWithData();
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

  getUri(config: AxiosRequestConfig): string {
    config = mergeConfig(this.defaults, config);
    return transformURL(config);
  }

  private _eachMethodNoData() {
    (['get', 'delete', 'head', 'options'] as Method[]).forEach(method => {
      Axios.prototype[method] = function (url: string, config: AxiosRequestConfig = {}) {
        return this.request(mergeConfig(config || {}, { method, url }));
      };
    });
  }

  private _eachMethodWithData() {
    (['put', 'post', 'patch'] as Method[]).forEach(method => {
      const genHttpMethod = (isForm: boolean) => (url: string, data: any = {}, config: AxiosRequestConfig = {}) => {
        return this.request(mergeConfig(config || {}, { method, url, data, headers: isForm ? { 'Content-Type': 'multipart/form-data' } : {} }));
      };
      Axios.prototype[method] = genHttpMethod(false);
      Axios.prototype[`${method}Form`] = genHttpMethod(true);
    });
  }
}
