import type { AxiosPromise, AxiosRequestConfig, AxiosResponse, Cancel } from '@/types';
import CancelError from '@/cancel/CancelError';
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
    const { url, method = 'get', data = null, headers = {}, timeout, responseType, cancelToken, signal } = config;

    const request = new XMLHttpRequest();

    const onCancel = (reason?: Cancel) => {
      reject(reason ?? new CancelError('canceled', config, request));
      request.abort();
    };

    const done = () => {
      if (cancelToken) {
        cancelToken.unsubscribe(onCancel);
      }

      if (signal) {
        signal.removeEventListener?.('abort', onCancel);
      }
    };
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

      settle(val => {
        done();
        resolve(val);
      }, err => {
        reject(err);
        done();
      }, response);
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

    if (cancelToken || signal) {
      cancelToken && cancelToken.subscribe(onCancel);

      if (signal) {
        signal?.aborted ? onCancel() : signal?.addEventListener?.('abort', onCancel);
      }
    }

    request.send(data as any);
  });
};
