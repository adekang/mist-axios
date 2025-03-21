import { isPlainObject } from './is';

export function transformRequest(data: unknown): any {
  if (isPlainObject(data))
    return JSON.stringify(data);

  return data;
}

export function transformResponse(data: unknown): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    }
    // eslint-disable-next-line unused-imports/no-unused-vars
    catch (_) {
      /* istanbul ignore next */
      /* do nothing */
    }
  }
  return data;
}
