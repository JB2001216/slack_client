import VueI18n from 'vue-i18n';
import { ApiErrors, getJsonFromResponse } from '@/lib/api';

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

/**
 * Errorオブジェクトからエラーメッセージを取得
 */
export async function getErrorMessage(err: any, i18n: VueI18n, options: { firstMessageOnValidationError?: boolean } = {}): Promise<string> {
  if (err instanceof RouteError) {
    err = err.data;
  }

  if (err instanceof Response) {
    const json = await getJsonFromResponse(err);
    if (json && json.error) {
      if (ApiErrors.ValidationError === json.error) {
        if (options.firstMessageOnValidationError) {
          const m = getFirstMessageOfValidationError(json.data);
          if (m) {
            return m;
          }
        }
        return i18n.t('common.invalidInput').toString();
      }
      if (json.data && typeof json.data.detail === 'string') {
        return json.data.detail;
      }
    }
    if (!err.status) {
      return i18n.t('common.networkConnectionError').toString();
    }

  } else if (err instanceof BasicError) {
    return err.message;
  }

  return i18n.t('common.anErrorHasOccurred').toString();
}

function getFirstMessageOfValidationError(data: any) {
  if (Array.isArray(data) && data.length) {
    data = data[0];
  }
  if (!Array.isArray(data) && typeof data === 'object') {
    for (const [k, v] of Object.entries(data)) {
      if (typeof v === 'string') {
        return v;
      }
      if (Array.isArray(v) && v.length && typeof v[0] === 'string') {
        return v[0];
      }
    }
  }
  return undefined;
}
