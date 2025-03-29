import type { AxiosInstance, AxiosRequestConfig, AxiosStatic } from './types';
import CancelError from './cancel/CancelError';
import CancelToken from './cancel/CancelToken';
import isCancel from './cancel/isCancel';
import Axios from './core/Axios';
import mergeConfig from './core/mergeConfig';
import defaults from './defaults';
import { extend } from './helpers';

function createInstance(config: AxiosRequestConfig) {
  const context = new Axios(config);

  // 使用方法 axios.request()
  const instance = Axios.prototype.request.bind(context);

  extend(instance, Axios.prototype, context);
  extend(instance, context);

  return instance as AxiosInstance;
}

const axios = createInstance(defaults) as AxiosStatic;

// 使用方法 axios.create()
axios.create = function create(config) {
  return createInstance(mergeConfig(defaults, config));
};

// 使用方法 axios.all()
axios.all = function all(promises) {
  return Promise.all(promises);
};

// 使用方法 axios.spread()
axios.spread = function spread(callback) {
  return function wrap(arr) {
    // eslint-disable-next-line prefer-spread
    return callback.apply(null, arr);
  };
};

axios.CancelError = CancelError;
axios.CancelToken = CancelToken;
axios.isCancel = isCancel;

axios.Axios = Axios;

export default axios;
