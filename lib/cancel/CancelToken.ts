import type { Canceler, CancelExecutor, CancelTokenSource, CancelToken as ICancelToken, ResolvePromise } from '../types';
import CancelError from './CancelError';

export default class CancelToken implements ICancelToken {
  promise: Promise<CancelError>;
  reason?: CancelError;

  private _listeners?: ResolvePromise[];
  constructor(executer: CancelExecutor) {
    let resolvePromise: ResolvePromise;

    this.promise = new Promise(resolve => {
      resolvePromise = resolve as ResolvePromise;
    });

    this.promise.then(cancel => {
      if (!this._listeners)
        return;
      for (const listener of this._listeners) {
        listener(cancel);
      }

      this._listeners = void 0;
    });

    executer((message, config, request) => {
      if (this.reason)
        return;
      this.reason = new CancelError(message, config, request);
      resolvePromise(this.reason);
    });
  }

  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }

  subscribe(listener: ResolvePromise): void {
    if (this.reason) {
      listener(this.reason);
      return;
    }
    if (this._listeners) {
      this._listeners.push(listener);
    }
    else {
      this._listeners = [listener];
    }
  }

  unsubscribe(listener: ResolvePromise): void {
    if (!this._listeners)
      return;
    const index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
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
