import { Middleware, RequestContext, RequestArgs, HttpHeaders, Configuration } from './openapi';
export * from './openapi';

const xApiVersion = '0.0.1';

class AppMiddleWare implements Middleware {
  pre(context: RequestContext): RequestArgs {
    const headers: HttpHeaders = <any>context.options.headers || {};
    headers['X-API-Version'] = xApiVersion;
    context.options.headers = headers;
    return context;
  }
}

export function createConfiguration(token?: string): Configuration {
  return new Configuration({
    basePath: process.env.VUE_APP_API_BASE_PATH,
    apiKey: token ? `Token ${token}` : undefined,
    middleware: [
      new AppMiddleWare(),
    ],
  });
}
