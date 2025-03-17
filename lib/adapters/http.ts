import type { AxiosPromise, AxiosRequestConfig } from '@/types';
import { kindOf } from '@/helpers';

// eslint-disable-next-line node/prefer-global/process
const isHttpAdapterSupported = typeof process !== 'undefined' && kindOf(process) === 'process';

export default isHttpAdapterSupported && function httpAdapter(_config: AxiosRequestConfig): AxiosPromise {
  return new Promise((_resolve, _reject) => {
    // TODO 未实现

  });
};
