export type Method =
  'get' | 'GET'
  | 'delete' | 'DELETE'
  | 'head' | 'HEAD'
  | 'options' | 'OPTIONS'
  | 'post' | 'POST'
  | 'put' | 'PUT'
  | 'patch' | 'PATCH';

export type Paramas = Record<string, any>;
export type IHeaders = Record<string, any>;

export interface AxiosRequestConfig {
  url?: string
  method?: string
  data?: unknown
  headers?: IHeaders | null
  params?: Paramas

  validataStatus?: (status: number) => boolean
}

export interface AxiosResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: IHeaders
  config: AxiosRequestConfig
  request: XMLHttpRequest
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {}

export interface Axios {
  defaults: AxiosRequestConfig
  request: <T = any>(config: AxiosRequestConfig) => AxiosPromise<T>
}

export interface AxiosInstance extends Axios {}

export type AxiosErrorCode =
  | 'ERR_BAD_OPTION_VALUE'
  | 'ERR_BAD_OPTION'
  | 'ECONNABORTED'
  | 'ETIMEDOUT'
  | 'ERR_NETWORK'
  | 'ERR_FR_TOO_MANY_REDIRECTS'
  | 'ERR_DEPRECATED'
  | 'ERR_BAD_RESPONSE'
  | 'ERR_BAD_REQUEST'
  | 'ERR_CANCELED'
  | 'ERR_NOT_SUPPORT'
  | 'ERR_INVALID_URL';

export interface AxiosError extends Error {
  /**
   * 判断是否是 AxiosError 类型
   * @type {boolean}
   */
  isAxiosError: boolean
  /**
   * 请求配置
   * @type {AxiosRequestConfig}
   */
  config: AxiosRequestConfig
  /**
   * 错误码
   * @type {AxiosErrorCode}
   */
  code?: AxiosErrorCode | null
  /**
   * 请求对象
   * @type {XMLHttpRequest}
   */
  request?: XMLHttpRequest
  /**
   * 响应对象
   * @type {AxiosResponse}
   */
  response?: AxiosResponse
}
