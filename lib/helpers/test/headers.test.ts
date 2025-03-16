import { describe, expect, it } from 'vitest';
import { flattenHeaders } from '../headers';

describe('header test', () => {
  it('flattenHeaders', () => {
    const headers = {
      common: {
        Accept: 'application/json, text/plain, */*'
      },
      delete: {
        'Content-Type': 'application/json'
      },
      get: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      head: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      post: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      put: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      patch: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    expect(flattenHeaders(headers, 'get')).toEqual({
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/x-www-form-urlencoded'
    });
  });
});
