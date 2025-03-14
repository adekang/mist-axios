import type { AxiosErrorCode, AxiosRequestConfig, AxiosResponse, AxiosError as IAxiosError } from '@/types';
import { toJSONObject } from '@/helpers';
import { isFunction } from '@/helpers/is';

export default class AxiosError extends Error implements IAxiosError {
  isAxiosError: boolean;

  // eslint-disable-next-line max-params
  constructor(
    message: string,
    public code: AxiosErrorCode | null,
    public config: AxiosRequestConfig,
    public request?: XMLHttpRequest,
    public response?: AxiosResponse

  ) {
    super(message);
    this.isAxiosError = true;
    // 判断是否是 Node.js 环境
    if (isFunction(Error.captureStackTrace)) {
      Error.captureStackTrace(this, this.constructor);
    }
    else {
      // 浏览器环境
      this.stack = new Error(message).stack;
    }

    // 继承内置 Error 对象
    Object.setPrototypeOf(this, AxiosError.prototype);
  }

  // eslint-disable-next-line ts/explicit-function-return-type
  toJSON() {
    return {
      message: this.message,
      stack: this.stack,
      name: this.name,
      code: this.code,
      status: (this.response && this.response.status) ?? null,
      config: toJSONObject(this.config),
    };
  }
}

const descriptors: Record<string, { value: AxiosErrorCode }> = {}

;[
  'ERR_BAD_OPTION_VALUE',
  'ERR_BAD_OPTION',
  'ECONNABORTED',
  'ETIMEDOUT',
  'ERR_NETWORK',
  'ERR_FR_TOO_MANY_REDIRECTS',
  'ERR_DEPRECATED',
  'ERR_BAD_RESPONSE',
  'ERR_BAD_REQUEST',
  'ERR_CANCELED',
  'ERR_NOT_SUPPORT',
  'ERR_INVALID_URL'
].forEach(code => {
  descriptors[code as AxiosErrorCode] = { value: code as AxiosErrorCode };
});

// AxiosError.ERR_BAD_OPTION_VALUE
Object.defineProperties(AxiosError, descriptors);

// eslint-disable-next-line max-params
function createError(
  message: string,
  code: AxiosErrorCode | null,
  config: AxiosRequestConfig,
  request?: XMLHttpRequest,
  response?: AxiosResponse
): AxiosError {
  return new AxiosError(message, code, config, request, response);
}

export { createError, descriptors as ErrorCodes };
