import type { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '@/types';
import { createError, ErrorCodes } from '@/core/AxiosError';
import { settle } from '@/core/settle';

const isXhrAdapterSupported = typeof XMLHttpRequest !== 'undefined';

/**
 *  处理请求数据
 * @param {AxiosRequestConfig} config  请求配置
 * @returns {AxiosPromise} 处理后的请求数据
 */
export default isXhrAdapterSupported && function xhrAdapter(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { url, method = 'get', data = null, headers = {}, timeout, responseType } = config;

    const request = new XMLHttpRequest();
    request.open(method.toUpperCase(), url!, true);

    request.onreadystatechange = function () {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status === 0) {
        return;
      }

      const response: AxiosResponse = {
        data: request.response,
        status: request.status,
        statusText: request.statusText,
        headers: headers ?? {},
        config,
        request
      };

      settle(resolve, reject, response);
    };

    request.onerror = function handleError() {
      reject(createError('Network Error', null, config, request));
    };

    request.ontimeout = function handleTimeout() {
      reject(createError(`Timeout of ${timeout} ms exceeded`, ErrorCodes.ERR_TIMEOUT.value, config, request));
    };

    if (responseType) {
      request.responseType = responseType;
    }

    if (timeout) {
      request.timeout = timeout;
    }

    request.send(data as any);
  });
};
