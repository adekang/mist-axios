import type { IHeaders, Method } from '@/types';
import { deepMerge } from '.';
import { isPlainObject } from './is';

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

const ignoreDuplicateOf = new Set([
  'age',
  'authorization',
  'content-length',
  'content-type',
  'etag',
  'expires',
  'from',
  'host',
  'if-modified-since',
  'if-unmodified-since',
  'last-modified',
  'location',
  'max-forwards',
  'proxy-authorization',
  'referer',
  'retry-after',
  'user-agent'
]);
/**
 *解析请求头
 * @param rawHeaders 请求头
 * @returns {IHeaders} 解析后的请求头
 */
export function parseHeaders(rawHeaders: string): IHeaders {
  const parsed = Object.create(null);
  if (!rawHeaders)
    return parsed;

  rawHeaders.split('\n').forEach(line => {
    let [key, ...vals] = line.split(':');
    key = key.trim().toLowerCase();

    if (!key || (parsed[key] && ignoreDuplicateOf.has(key))) {
      return;
    }
    const val = vals.join(':').trim();

    if (key === 'set-cookie') {
      if (parsed[key]) {
        parsed[key].push(val);
      }
      else {
        parsed[key] = [val];
      }
    }
    else {
      parsed[key] = parsed[key] ? `${parsed[key]}, ${val}` : val;
    }
  });

  return parsed;
}

/**
 *  格式化请求头 将请求头中的 Content-Type 格式化为 Content-Type
 * @param headers 请求头
 * @param normalizedName  格式化后的请求头
 * @returns {void}
 */
function normalizeHeaderName(headers: IHeaders | undefined | null, normalizedName: string) {
  if (!headers)
    return;
  Object.keys(headers).forEach(name => {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = headers[name];
      delete headers[name];
    }
  });
}

/**
 * 格式化请求头
 * @param headers 请求头
 * @param data 请求数据
 * @returns {IHeaders} 格式化后的请求头
 */
export function processHeaders(
  headers: IHeaders | undefined | null,
  data: unknown
): IHeaders | undefined | null {
  normalizeHeaderName(headers, 'Content-Type');

  if (isPlainObject(data)) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json;charset=utf-8';
    }
  }

  return headers;
}
