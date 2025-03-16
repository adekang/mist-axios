import { describe, expect, it } from 'vitest';

export function sum(a, b) {
  return a + b;
}

/**
 * add test
 */
describe('add test', () => {
  it('expect(sum(1, 2)).toBe(3)', () => {
    expect(sum(1, 2)).toBe(3);
  });
});
