import { isArray, isDate, isFormData, isPlainObject, isURLSearchParams } from '@/helpers/is';
import { describe, expect, it } from 'vitest';

describe('isXX', () => {
  it('should validate Array', () => {
    expect(isArray([])).toBeTruthy();
    expect(isArray('[]')).toBeFalsy();
    expect(isArray(document.all)).toBeFalsy();
  });

  it('should validate Date', () => {
    expect(isDate(new Date())).toBeTruthy();
    expect(isDate(Date.now())).toBeFalsy();
  });

  it('should validate PlainObject', () => {
    expect(isPlainObject({})).toBeTruthy();
    expect(isPlainObject(new Date())).toBeFalsy();
    expect(isPlainObject(null)).toBeFalsy();
  });

  it('should validate FormData', () => {
    expect(isFormData(new FormData())).toBeTruthy();
    expect(isFormData(void 0)).toBeFalsy();
    expect(isFormData({})).toBeFalsy();
  });

  it('should validate URLSearchParams', () => {
    expect(isURLSearchParams(new URLSearchParams())).toBeTruthy();
    expect(isURLSearchParams(void 0)).toBeFalsy();
    expect(isURLSearchParams('foo=1&bar=2')).toBeFalsy();
  });
});
