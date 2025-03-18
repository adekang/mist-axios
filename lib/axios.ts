import type { AxiosRequestConfig, AxiosStatic } from './types';
import Axios from './core/Axios';
import mergeConfig from './core/mergeConfig';
import defaults from './defaults';
import { extend } from './helpers';

function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config);
  const instance = Axios.prototype.request.bind(context);

  extend(instance, Axios.prototype, context);
  extend(instance, context);

  return instance as AxiosStatic;
}

const axios = createInstance(defaults);

axios.create = function create(config): AxiosStatic {
  return createInstance(mergeConfig(defaults, config));
};

axios.all = function all(promises) {
  return Promise.all(promises);
};

axios.spread = function spread(callback) {
  return function wrap(arr) {
    // eslint-disable-next-line prefer-spread
    return callback.apply(null, arr);
  };
};

axios.Axios = Axios;

export default axios;
