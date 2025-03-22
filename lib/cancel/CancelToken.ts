import type { Canceler, CancelExecutor, CancelTokenSource, CancelToken as ICancelToken } from '../types';

interface ResolvePromise {
  (reason?: string): void

}

export default class CancelToken implements ICancelToken {
  promise: Promise<string>;
  reason?: string;
  constructor(executer: CancelExecutor) {
    let resolvePromise: ResolvePromise;

    this.promise = new Promise(resolve => {
      resolvePromise = resolve as ResolvePromise;
    });

    executer(message => {
      if (this.reason) {
        return void 0;
      }

      this.reason = message;
      resolvePromise(message);
    });
  }

  throwIfRequested() {
    if (this.reason) {
      throw new Error(this.reason);
    }
  }

  static source(): CancelTokenSource {
    let cancel!: Canceler;
    const token = new CancelToken(c => {
      cancel = c;
    });

    return {
      cancel,
      token
    };
  }
}
