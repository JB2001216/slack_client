import { Middleware, RequestContext, ResponseContext, FetchParams, HTTPHeaders, Configuration } from './openapi';
import { BaseError } from '@/lib/errors';

const xApiVersion = '0.0.1';

export enum ApiErrors {
  ValidationError = 'ValidationError',
  ExpiredTokenError = 'ExpiredTokenError',
  LoginUserNotFound = 'LoginUserNotFound',
  AuthenticationFailed = 'AuthenticationFailed',
}

export class FetchError extends BaseError<Response> {
  constructor(data: Response) {
    super({
      message: 'FetchError',
      data,
    });
  }
}

class AppMiddleWare implements Middleware {
  async pre(context: RequestContext): Promise<FetchParams | void> {
    // version
    const headers: HTTPHeaders = <any>context.init.headers || {};
    headers['X-API-Version'] = xApiVersion;
    context.init.headers = headers;
    return context;
  }

  async post(context: ResponseContext): Promise<Response | void> {
    const res = context.response;
    // error
    if (res.status < 200 || res.status >= 300) {
      try {
        const json = await res.json();
        res.json = () => Promise.resolve(json);
      } catch { }
      throw new FetchError(res);
    }
    return res;
  }
}

export function createConfiguration(token = ''): Configuration {
  return new Configuration({
    basePath: process.env.VUE_APP_API_BASE_PATH,
    apiKey: token.trim() === '' ? undefined : `Token ${token}`,
    middleware: [
      new AppMiddleWare(),
    ],
  });
}
