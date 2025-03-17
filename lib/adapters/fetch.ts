import type { AxiosPromise, AxiosRequestConfig } from '@/types';
import { isFunction } from '@/helpers/is';

const isFetchAdapterSupported = typeof fetch !== 'undefined' && isFunction(fetch);

export default isFetchAdapterSupported && function fetchAdapter(_config: AxiosRequestConfig): AxiosPromise {
  return new Promise((_resolve, _reject) => {
    // TODO 未实现

  });
};
