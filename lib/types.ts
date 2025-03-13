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
