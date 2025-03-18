import type { AxiosPromise, AxiosRequestConfig, AxiosResponse, Axios as IAxios, Method, RejectedFn, ResolvedFn } from '@/types';
import dispatchRequest, { transformURL } from '@/core/dispatchRequest';
import InterceptorManager from './InterceptorManager';
import mergeConfig from './mergeConfig';

interface Interceptors {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}

interface PromiseChainNode<T> {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn
}

type PromiseChain<T> = PromiseChainNode<T>[];

export default class Axios implements IAxios {
  defaults: AxiosRequestConfig;
  interceptors: Interceptors;

  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig;
    this.interceptors = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>(),
    };
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
    const chain: PromiseChain<any> = [
      {
        resolved: dispatchRequest,
        rejected: void 0
      }
    ];

    // -> 【requestInterceptors】-> dispatchRequest -> 【responseInterceptors】->
    this.interceptors.request.forEach(interceptor => chain.unshift(interceptor));
    this.interceptors.response.forEach(interceptor => chain.push(interceptor));

    let promise = Promise.resolve(config) as AxiosPromise<AxiosRequestConfig>;

    while (chain.length) {
      const { resolved, rejected } = chain.shift()!;
      promise = promise.then(resolved, rejected);
    }

    return promise;
  }

  getUri(config?: AxiosRequestConfig): string {
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
