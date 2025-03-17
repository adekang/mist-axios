import type { AxiosResponse } from '@/types';
import { createError, ErrorCodes } from './AxiosError';

/**
 *  处理请求返回的结果
 * @param resolve
 * @param reject
 * @param response
 */
export function settle(
  resolve: (value: AxiosResponse) => void,
  reject: (reason: any) => void,
  response: AxiosResponse
): void {
  const validataStatus = response.config.validataStatus;
  if (!response.status || !validataStatus || validataStatus(response.status)) {
    resolve(response);
  }
  else {
    reject(createError(`Request failed with status code ${response.status}`, [ErrorCodes.ERR_BAD_REQUEST.value, ErrorCodes.ERR_BAD_RESPONSE.value][
      Math.floor(response.status / 100) - 4
    ], response.config, response.request, response));
  }
}
