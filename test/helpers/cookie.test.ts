import cookie from '@/helpers/cookie';
import { describe, expect, it } from 'vitest';

describe('helpers:cookie', () => {
  it('should read cookie', () => {
    document.cookie = 'foo=bar';
    expect(cookie.read('foo')).toBe('bar');
  });

  it('should return null if cookie name is not exist', () => {
    document.cookie = 'foo=bar';
    expect(cookie.read('baz')).toBeNull();
  });
});
