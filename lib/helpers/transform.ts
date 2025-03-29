import { isPlainObject } from './is';

export function transformRequest(data: unknown) {
  if (isPlainObject(data))
    return JSON.stringify(data);
  return data;
}

export function transformResponse(data: unknown): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    }
    catch (_e) {
      // Do nothing
    }
  }
  return data;
}
