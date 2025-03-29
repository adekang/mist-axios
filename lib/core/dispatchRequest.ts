import type { AxiosRequestConfig, AxiosResponse } from '../types';
import adapters from '@/adapters';
import defaults from '@/defaults';
import { flattenHeaders } from '@/helpers/headers';
import { isArray } from '@/helpers/is';
import { buildURL, combineURL, isAbsoluteURL } from '@/helpers/url';
import { transformData } from './transformData';

/**
 *  发送请求
 * @param config 请求配置
 * @returns {Promise<any>} 返回一个Promise
 */
export default function dispatchRequest(config: AxiosRequestConfig): Promise<any> {
  throwIfCancellationRequested(config);
  processConfig(config);
  const adapter = adapters.getAdapter(config?.adapter || defaults.adapter);
  return adapter(config).then((res: AxiosResponse) => {
    return transformResponseData(res);
  });
}

/**
 *  处理请求配置
 * @param config 请求配置
 */
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config);

  config.data = transformData.call(config, isArray(config.transformRequest) ? config.transformRequest : [config.transformRequest!]);
  config.headers = flattenHeaders(config.headers, config.method!);
}

/**
 *  处理请URL 参数拼接 URL合并 等
 * @param config
 * @returns {string} 处理后的URL
 */
export function transformURL(config: AxiosRequestConfig): string {
  const { url, params, baseUrl, paramsSerializer } = config;

  const fullPath = baseUrl && !isAbsoluteURL(url!) ? combineURL(baseUrl, url) : url;

  return buildURL(fullPath!, params, paramsSerializer);
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

function transformResponseData(res: AxiosResponse) {
  res.data = transformData.call(res, isArray(res.config.transformResponse) ? res.config.transformResponse : [res.config.transformResponse!]);
  return res;
}
