import { getPrototypeOf, kindOf } from '.';

const objToString = Object.prototype.toString;

// eslint-disable-next-line valid-typeof
const typeOfTest = (type: string) => (thing: unknown): boolean => typeof thing === type;

// eslint-disable-next-line ts/no-unsafe-function-type
export const isFunction = typeOfTest('function') as (thing: unknown) => thing is Function;

export const isString = typeOfTest('string') as (thing: unknown) => thing is string;

export const isNumber = typeOfTest('number') as (thing: unknown) => thing is number;

export const isUndefined = typeOfTest('undefined') as (thing: unknown) => thing is undefined;

export function isObject(thing: unknown): thing is object {
  return typeof thing === 'object' && thing !== null;
}

export const isArray = <T = any>(thing: unknown): thing is T[] => Array.isArray(thing);

/**
 *  判断是否是 null 或 undefined
 * @param thing 任意值
 * @returns boolean
 */
// eslint-disable-next-line eqeqeq
export const isNil = (thing: unknown): boolean => thing == null;

/**
 *  判断是否是一个普通对象
 * @param val 任意值
 * @returns boolean
 */
export function isPlainObject(val: unknown): boolean {
  if (kindOf(val) !== 'object') {
    return false;
  }
  const prototype = getPrototypeOf(val);
  return (
    (prototype === null
      || prototype === Object.prototype
      || Object.getPrototypeOf(prototype) === null)
    && !(Symbol.toStringTag in (val as object))
    && !(Symbol.iterator in (val as object))
  );
}

/**
 *  判断是否是一个日期对象
 * @param val 任意值
 * @returns boolean
 */
export function isDate(val: unknown): val is Date {
  return objToString.call(val) === '[object Date]';
}

/**
 * 判断是否是一个 FormData 对象
 * @param val 任意值
 * @returns boolean
 */
export function isFormData(val: unknown): val is FormData {
  return typeof val !== 'undefined' && val instanceof FormData;
}

/**
 * 判断是否是一个 URLSearchParams 对象
 * @param val 任意值
 * @returns boolean
 */
export function isURLSearchParams(val: unknown): val is URLSearchParams {
  return typeof val !== 'undefined' && val instanceof URLSearchParams;
}
