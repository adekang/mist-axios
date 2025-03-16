import type { IHeaders, Method } from '@/types';
import { deepMerge } from '.';

/**
 *  处理请求头 将请求头中的 common 和 method 合并到一起
 * @param headers 请求头
 * @param method 请求方法
 * @returns {IHeaders} 处理后的请求头
 */
export function flattenHeaders(
  headers: IHeaders | undefined | null,
  method: Method
): IHeaders | undefined | null {
  if (!headers) {
    return headers;
  }
  headers = deepMerge(headers.common, headers[method], headers);
  const methodsToDelete = ['delete', 'get', 'head', 'options', 'post', 'put', 'patch', 'common'];
  methodsToDelete.forEach(method => {
    delete headers![method];
  });
  return headers;
}

