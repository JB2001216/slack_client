export abstract class BaseError<T> extends Error {
  constructor(options: {
    message?: string;
    data?: T;
  } = {}) {
    super(options.message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.data = options.data;
  }
  readonly data?: T;
}

/**
 * VueRouterでnext(error)を送る際に、
 * errorオブジェクトににnameが入っているとVueRouteがLocationと勘違いするので、
 * シンプルなErrorでラップする
 */
export class RouteError extends BaseError<any> {
  constructor(err: any) {
    super({
      message: 'RouteError',
      data: err,
    });
  }
}

/**
 * メッセージ表示用のシンプルなエラー
 */
export class BasicError extends BaseError<undefined> {
  constructor(message: string) {
    super({
      message,
    });
  }
}
