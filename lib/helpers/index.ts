import { isArray, isObject, isPlainObject, isUndefined } from './is';

/**
 *  将对象转换为 JSON 对象
 * @param obj
 * @returns JSON 对象
 */
export function toJSONObject<T = object>(obj: T) {
  const stack = Array.from({ length: 10 });

  const visit = (source: T, i: number): any => {
    if (isObject(source)) {
      if (stack.includes(source))
        return;

      if (!('toJSON' in source)) {
        stack[i] = source;
        const target: Record<string | number, any> = isArray(source) ? [] : {};
        for (const key in source) {
          const value = (source as Record<string, any>)[key];

          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        }
        stack[i] = void 0;
        return target;
      }
    }

    return source;
  };
  return visit(obj, 0);
}

export const kindOf = (cache => (thing: unknown) => {
  const str = toString.call(thing);
  return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
})(Object.create(null));

const { getPrototypeOf } = Object;

export {
  getPrototypeOf
};

/**
 *  深度合并对象 将多个对象合并到一个对象中 返回合并后的对象 优先级：从后往前
 * @param args 对象
 * @returns 合并后的对象
 */
export function deepMerge(...args: any[]): any {
  const result = Object.create(null);

  const assignValue = (val: unknown, key: string) => {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = deepMerge(result[key], val);
    }
    else if (isPlainObject(val)) {
      result[key] = deepMerge({}, val);
    }
    else {
      result[key] = val;
    }
  };

  for (let i = 0; i < args.length; i++) {
    const obj = args[i];
    for (const key in obj) {
      assignValue(obj[key], key);
    }
  }

  return result;
}

// eslint-disable-next-line ts/no-unsafe-function-type
function _bind(fn: Function, thisArg: unknown) {
  return function wrap() {
    // eslint-disable-next-line prefer-rest-params
    return fn.apply(thisArg, arguments);
  };
}

export function extend<T, U>(to: T, from: U, thisArg?: unknown): T & U {
  for (const key in from) {
    if (thisArg && typeof from[key] === 'function') {
      // eslint-disable-next-line ts/no-unsafe-function-type
      ;(to as T & U)[key] = _bind(from[key] as Function, thisArg) as any;
    }
    else {
      ;(to as T & U)[key] = from[key] as any;
    }
  }

  return to as T & U;
}
