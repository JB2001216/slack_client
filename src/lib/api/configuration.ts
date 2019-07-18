import { AjaxRequest } from 'rxjs/ajax';
import { Middleware, RequestContext, RequestArgs, HttpHeaders, Configuration } from './openapi';

const xApiVersion = '0.0.1';
const timeout = 60000; // msec

export enum ApiErrors {
  ValidationError = 'ValidationError',
  ExpiredTokenError = 'ExpiredTokenError',
}

class AppMiddleWare implements Middleware {
  pre(context: RequestContext): RequestArgs {
    // version
    const headers: HttpHeaders = <any>context.options.headers || {};
    headers['X-API-Version'] = xApiVersion;
    context.options.headers = headers;

    // timeout
    (<AjaxRequest>context.options).timeout = timeout;

    return context;
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
