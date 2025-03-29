import type { AxiosRequestConfig, AxiosResponse, AxiosTranformer } from '@/types';
import defaults from '@/defaults';

export function transformData(this: AxiosRequestConfig, fns: AxiosTranformer[], response?: AxiosResponse) {
  const config = this || defaults;
  const context = response || config;

  const headers = config.headers;

  let data = context.data;

  if (!fns || !Array.isArray(fns))
    return data;
  // 过滤掉非函数项
  const validFns = fns.filter(fn => typeof fn === 'function');

  validFns.forEach(fn => {
    data = fn.call(config, data, headers, response ? response.status : void 0);
  });

  return data;
}
