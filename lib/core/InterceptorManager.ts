import type { AxiosInterceptorManager, RejectedFn, ResolvedFn } from '@/types';
import { isNil } from '@/helpers/is';

interface Interceptor<T> {
  resolved: ResolvedFn<T>
  rejected?: RejectedFn
}

export default class InterceptorManager<T> implements AxiosInterceptorManager<T> {
  private interceptors: Array<Interceptor<T> | null>;

  constructor() {
    this.interceptors = [];
  }

  use(resolved: RejectedFn, rejected?: RejectedFn): number {
    this.interceptors.push({ resolved, rejected });
    // 返回最后一个元素的下标 作为 拦截器的 id
    return this.interceptors.length - 1;
  }

  eject(id: number) {
    if (this.interceptors[id]) {
      this.interceptors[id] = null;
    }
  }

  forEach(cb: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach(interceptor => {
      if (isNil(interceptor)) {
        cb(interceptor!);
      }
    });
  }
}

