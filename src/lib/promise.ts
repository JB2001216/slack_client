import { BaseError } from './errors';

/**
 * Promiseタイムアウト
 */
export class PromiseTimeoutError extends BaseError<undefined> {
  constructor(message = 'PromiseTimeout') {
    super({ message });
  }
}

export function promiseOrTimeout<T>(promise: Promise<T>, timeoutMsec: number = 0): Promise<T> {
  let timerId: NodeJS.Timeout | null = null;
  const promises = [promise];
  if (timeoutMsec > 0) {
    promises.push(new Promise(function(resolve, reject) {
      timerId = setTimeout(function() {
        reject(new PromiseTimeoutError());
      }, timeoutMsec);
    }));
  }
  return Promise.race<T>(promises)
    .finally(function() {
      if (timerId) {
        clearTimeout(timerId!);
      }
    });
}
