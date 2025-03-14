import { AxiosRequestConfig } from "./types";


export default {
  method: 'get',
  headers: {
    common: {
      Accept: 'application/json, text/plain, */*'
    }
  },
  validataStatus: (status: number) => {
    return status >= 200 && status < 300;
  }

} as AxiosRequestConfig