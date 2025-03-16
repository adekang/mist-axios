import type { AxiosPromise, AxiosRequestConfig, AxiosResponse } from '../types';
import { flattenHeaders } from '@/helpers/headers';
import { buildURL, combineURL, isAbsoluteURL } from '@/helpers/url';
import { createError, ErrorCodes } from './AxiosError';

export default function dispatchRequest(config: AxiosRequestConfig): Promise<any> {
  processConfig(config);
  return xhr(config);
}
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config);
  config.headers = flattenHeaders(config.headers, config.method!);
}

/**
 *  处理请URL 参数拼接 URL合并 等
 * @param config
 * @returns
 */
export function transformURL(config: AxiosRequestConfig): string {
  const { url, params, baseUrl, paramsSerializer } = config;

  const fullPath = baseUrl && !isAbsoluteURL(url!) ? combineURL(baseUrl, url) : url;

  return buildURL(fullPath!, params, paramsSerializer);
}

/**
 *  处理请求数据
 * @param {AxiosRequestConfig} config  请求配置
 * @returns {AxiosPromise} 处理后的请求数据
 */
function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { url, method = 'get', data = null, headers = {} } = config;

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

    request.send(data as any);
  });
}

/**
 *  处理请求返回的结果
 * @param resolve
 * @param reject
 * @param response
 */
function settle(
  resolve: (value: AxiosResponse) => void,
  reject: (reason: any) => void,
  response: AxiosResponse
): void {
  const validataStatus = response.config.validataStatus;
  if (!response.status || !validataStatus || validataStatus(response.status)) {
    resolve(response);
  }
  else {
    reject(createError(`Request failed with status code ${response.status}`, [ErrorCodes.ERR_BAD_REQUEST.value, ErrorCodes.ERR_BAD_RESPONSE.value][
      Math.floor(response.status / 100) - 4
    ], response.config, response.request, response));
  }
}
