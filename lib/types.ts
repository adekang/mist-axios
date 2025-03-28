import type CancelTokenClass from './cancel/CancelToken';

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
  headers?: IHeaders | undefined | null
  params?: Params
  baseUrl?: string
  timeout?: number
  responseType?: XMLHttpRequestResponseType

  adapter?: 'xhr' | 'fetch' | 'http' | ((config: AxiosRequestConfig) => AxiosPromise)

  cancelToken?: CancelTokenClass

  auth?: AxiosBasicCredentials

  signal?: GenericAbortsignal

  // 跨域请求
  withCredentials?: boolean

  xsrfCookieName?: string
  xsrfHeaderName?: string

  validataStatus?: (status: number) => boolean
  // 参数序列化
  paramsSerializer?: (params: Params) => string

  transformRequest?: AxiosTranformer | AxiosTranformer[]
  transformResponse?: AxiosTranformer | AxiosTranformer[]

  onDownloadProgress?: (progressEvent: ProgressEvent) => void
  onUploadProgress?: (progressEvent: ProgressEvent) => void

  [propName: string]: any
}

export interface AxiosTranformer {
  (this: AxiosRequestConfig, data: unknown, headers?: IHeaders | undefined | null, status?: number): unknown
}

export interface GenericAbortsignal {
  readonly aborted: boolean
  onabort?: ((...args: any) => any) | null
  addEventListener?: (...args: any) => any
  removeEventListener?: (...args: any) => any
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
  isCancel: (val: unknown) => val is Cancel

  CancelToken?: CancelTokenStatic

  // Axios: typeof AxiosClass
  Axios: AxiosClassStatic
  CancelError: CancelStatic

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

export interface CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel
  throwIfRequested: () => void
}

export interface CancelTokenStatic {
  new (executer: CancelExecutor): CancelToken
  source: () => CancelTokenSource

}

export interface Canceler {
  (message: string, config: AxiosRequestConfig, request: XMLHttpRequest): void
}

export interface CancelExecutor {
  (cancel: Canceler): void
}

export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}

export interface Cancel {
  message?: string
}

export interface CancelStatic {
  new (message: string, config: AxiosRequestConfig, request: XMLHttpRequest): Cancel
}

export interface ResolvePromise {
  (reason?: Cancel): void
}

export interface AxiosBasicCredentials {
  username: string
  password: string
}

