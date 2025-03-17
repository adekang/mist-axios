import type { AxiosPromise, AxiosRequestConfig } from '@/types';
import { isArray, isFunction, isString } from '@/helpers/is';
import fetchAdapter from './fetch';
import httpAdapter from './http';
import xhrAdapter from './xhr';

const kenowAdapters: Record<string, ((config: AxiosRequestConfig) => AxiosPromise) | false> = {
  fetch: fetchAdapter,
  http: httpAdapter,
  xhr: xhrAdapter
};

type AdapterType = AxiosRequestConfig['adapter'];

export default {
  adapter: kenowAdapters,
  getAdapter(adapters: Array<AdapterType> | AdapterType) {
    adapters = isArray(adapters) ? adapters : [adapters];
    const { length } = adapters;

    let nameOfAdapter: AdapterType;

    let adapter: ((config: AxiosRequestConfig) => AxiosPromise) | false | undefined;

    for (let i = 0; i < length; i++) {
      nameOfAdapter = adapters[i];

      // eslint-disable-next-line no-cond-assign
      if ((adapter = isString(nameOfAdapter) ? kenowAdapters[nameOfAdapter.toLowerCase()] : nameOfAdapter)) {
        break;
      }
    }

    if (!adapter) {
      if (adapter === false) {
        throw new Error(`The adapter ${nameOfAdapter} is not supported`);
      }

      throw new Error(`unknown adapter ${nameOfAdapter} is specified`);
    }

    if (!isFunction(adapter)) {
      throw new Error(`The adapter ${nameOfAdapter} is not a function`);
    }
    return adapter;
  }

};
