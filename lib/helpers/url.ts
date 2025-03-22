import type { Params } from '@/types';
import { isArray, isDate, isNil, isPlainObject } from './is';

interface URLOrigin {
  protocol: string
  host: string
}

/**
 *  判断是否是绝对URL
 * @param url URL
 * @returns {boolean} 是否是绝对URL
};
 */
export function isAbsoluteURL(url: string): boolean {
  return /^(?:[a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

/**
 * 编码
 * @param val 字符串
 * @returns {string} 编码后的字符串
 */
function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']');
}

/**
 * 拼接URL
 * @param {string} baseURL  基础URL
 * @param {string} relativeURL  相对URL
 * @returns {string} 拼接后的URL
 */
export function combineURL(baseURL: string, relativeURL?: string): string {
  return relativeURL ? `${baseURL.replace(/\/+$/, '')}/${relativeURL.replace(/^\/+/, '')}` : baseURL;
}

/**
 * 拼接URL参数
 * @param {string} url URL
 * @param {Params} params 参数
 * @param {Function} paramsSerializer 参数序列化函数
 * @returns {string} 拼接后的URL
 */
export function buildURL(
  url: string,
  params?: Params,
  paramsSerializer?: (params: Params) => string
): string {
  if (!params)
    return url;

  let serializedParams: string;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  }
  else if (isURLSearchParams(params)) {
    serializedParams = params.toString();
  }
  else {
    const parts: string[] = [];
    Object.keys(params).forEach(key => {
      const val = params[key];
      if (isNil(val)) {
        // 判断是否是 null 或 undefined
        return;
      }
      let values;
      if (isArray(val)) {
        values = val;
        key += '[]';
      }
      else {
        values = [val];
      }
      values.forEach(_val => {
        if (isDate(_val)) {
          _val = _val.toISOString();
        }
        else if (isPlainObject(_val)) {
          _val = JSON.stringify(_val);
        }
        parts.push(`${encode(key)}=${encode(_val)}`);
      });
    });
    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    const marIndex = url.indexOf('#');
    if (marIndex !== -1) {
      url = url.slice(0, marIndex);
    }
    url += (!url.includes('?') ? '?' : '&') + serializedParams;
  }
  return url;
}

/**
 * 判断是否是URLSearchParams对象
 * @param val 任意值
 * @returns {boolean} 是否是URLSearchParams对象
 */
export function isURLSearchParams(val: any): val is URLSearchParams {
  return typeof val !== 'undefined' && val instanceof URLSearchParams;
}

const urlParsingNode = document.createElement('a');
const currentOrigin = resolveURL(window.location.href);
function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url);
  const { protocol, host } = urlParsingNode;
  return {
    protocol,
    host
  };
}

/**
 * 判断是否是同源URL
 * @param requestURL 请求URL
 * @returns {boolean} 是否是同源URL
 */
export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL);
  return (
    parsedOrigin.protocol === currentOrigin.protocol && parsedOrigin.host === currentOrigin.host
  );
}

