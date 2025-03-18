export type Method =
  'get' | 'GET'
  | 'delete' | 'DELETE'
  | 'head' | 'HEAD'
  | 'options' | 'OPTIONS'
  | 'post' | 'POST'
  | 'put' | 'PUT'
  | 'patch' | 'PATCH';

export type Params = Record<string, any>;
export type IHeaders = Record<string, any>;

export interface AxiosRequestConfig {
  url?: string
  method?: Method
  data?: unknown
  headers?: IHeaders | null
  params?: Params
  baseUrl?: string
  timeout?: number
  responseType?: XMLHttpRequestResponseType

  adapter?: 'xhr' | 'fetch' | 'http' | ((config: AxiosRequestConfig) => AxiosPromise)

  validataStatus?: (status: number) => boolean
  // 参数序列化
  paramsSerializer?: (params: Params) => string
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
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }
}

export interface AxiosInstance extends Axios {
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>

  get: <T = any>(url: string, config?: AxiosRequestConfig) => AxiosPromise<T>
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => AxiosPromise<T>
  head: <T = any>(url: string, config?: AxiosRequestConfig) => AxiosPromise<T>
  options: <T = any>(url: string, config?: AxiosRequestConfig) => AxiosPromise<T>

  post: <T = any>(url: string, data?: unknown, config?: AxiosRequestConfig) => AxiosPromise<T>
  put: <T = any>(url: string, data?: unknown, config?: AxiosRequestConfig) => AxiosPromise<T>
  patch: <T = any>(url: string, data?: unknown, config?: AxiosRequestConfig) => AxiosPromise<T>

  postForm: <T = any>(url: string, data?: unknown, config?: AxiosRequestConfig) => AxiosPromise<T>
  putForm: <T = any>(url: string, data?: unknown, config?: AxiosRequestConfig) => AxiosPromise<T>
  patchForm: <T = any>(url: string, data?: unknown, config?: AxiosRequestConfig) => AxiosPromise<T>
}

export interface AxiosStatic extends AxiosInstance {

  create: (config?: AxiosRequestConfig) => AxiosInstance
  all: <T>(promises: Array<T | Promise<T>>) => Promise<T[]>
  spread: <T, R>(callback: (...args: T[]) => R) => (arr: T[]) => R

  Axios: AxiosClassStatic

}

export interface AxiosClassStatic {
  new (config: AxiosRequestConfig): Axios
}

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

export interface AxiosInterceptorManager<T> {
  /**
   * 添加拦截器
   * @param resolved 成功回调
   * @param rejected 失败回调
   * @returns
   */
  use: (resolved: ResolvedFn<T>, rejected?: RejectedFn) => number
  /**
   *  删除拦截器
   * @param id 拦截器 id
   * @returns
   */
  eject: (id: number) => void
}

export interface ResolvedFn<T> {
  (val: T): T | Promise<T>
}

export interface RejectedFn {
  (error: any): any
}

