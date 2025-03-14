import type { AxiosRequestConfig } from '@/types';
import { deepMerge } from '@/helpers';
import { isNil, isPlainObject } from '@/helpers/is';

interface StrategyFn {
  (val1: unknown, val2: unknown): any
}

const defaultStrategy: StrategyFn = (val1, val2) => {
  return val2 ?? val1;
};

const fromVal2Strategy: StrategyFn = (_, val2) => {
  // eslint-disable-next-line valid-typeof
  if (typeof val2 !== null) {
    return val2;
  }
};

const deepMergeStrat: StrategyFn = (val1, val2) => {
  if (isPlainObject(val2)) {
    return deepMerge(val1, val2);
  }
  if (!isNil(val2)) {
    return val2;
  }
  if (isPlainObject(val1)) {
    return deepMerge(val1);
  }
  if (!isNil(val1)) {
    return val1;
  }
};

const strategyMap = new Map<string, StrategyFn>();

const strategyKeysFromVal2 = ['url', 'params', 'data'];
const strategyKeysDeepMerge = ['headers', 'auth'];

strategyKeysFromVal2.forEach(key => strategyMap.set(key, fromVal2Strategy));
strategyKeysDeepMerge.forEach(key => strategyMap.set(key, deepMergeStrat));

/**
 *  合并配置 config2 优先级高于 config1
 * @param config1
 * @param config2
 * @returns
 */
export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config2) {
    config2 = {};
  }

  const config: Record<string, any> = {};
  const mergeField = (key: string): void => {
    const strategy = strategyMap.get(key) ?? defaultStrategy;
    config[key] = strategy(config1[key], config2![key]);
  };

  for (let key in config2) {
    mergeField(key);
  }

  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key);
    }
  }

  return config;
}
