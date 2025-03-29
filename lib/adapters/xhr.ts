/* eslint-disable complexity */
import type { AxiosPromise, AxiosRequestConfig, AxiosResponse, Cancel } from '@/types';
import CancelError from '@/cancel/CancelError';
import { createError, ErrorCodes } from '@/core/AxiosError';
import { settle } from '@/core/settle';
import cookie from '@/helpers/cookie';
import { parseHeaders } from '@/helpers/headers';
import { isFormData } from '@/helpers/is';
import { isURLSameOrigin } from '@/helpers/url';

const isXhrAdapterSupported = typeof XMLHttpRequest !== 'undefined';

/**
 *  处理请求数据
 * @param {AxiosRequestConfig} config  请求配置
 * @returns {AxiosPromise} 处理后的请求数据
 */
export default isXhrAdapterSupported && function xhrAdapter(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      url,
      method = 'get',
      data = null,
      timeout,
      headers,
      responseType,
      cancelToken,
      signal,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      auth,
      onDownloadProgress,
      onUploadProgress
    } = config;

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

      const responseHeaders = request.getAllResponseHeaders();

      const response: AxiosResponse = {
        data: request.response,
        status: request.status,
        statusText: request.statusText,
        headers: parseHeaders(responseHeaders),
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

    if (onDownloadProgress) {
      request.onprogress = onDownloadProgress;
    }
    if (onUploadProgress) {
      request.upload.onprogress = onUploadProgress;
    }

    //  配置 request 开头

    if (responseType) {
      request.responseType = responseType;
    }

    if (timeout) {
      request.timeout = timeout;
    }

    if (withCredentials) {
      request.withCredentials = withCredentials;
    }

    // 配置 request 结束

    // 处理 取消请求 开始
    if (cancelToken || signal) {
      cancelToken && cancelToken.subscribe(onCancel);

      if (signal) {
        signal?.aborted ? onCancel() : signal?.addEventListener?.('abort', onCancel);
      }
    }
    // 处理 取消请求 结束

    // 处理 请求头 开始
    if (isFormData(data)) {
      delete headers!['Content-Type'];
    }

    if ((withCredentials || isURLSameOrigin(url!))) {
      // xsrf
      const xsrfVal = cookie.read(xsrfCookieName!);
      if (xsrfVal && xsrfHeaderName) {
        headers![xsrfHeaderName!] = xsrfVal;
      }
    }

    if (auth) {
      headers!.Authorization = `Basic ${btoa(`${auth.username}:${auth.password}`)}`;
    }

    Object.keys(headers!).forEach(name => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers![name];
      }
      else {
        request.setRequestHeader(name, headers![name]);
      }
    });

    // 处理 请求头 结束

    request.send(data as any);
  });
};
