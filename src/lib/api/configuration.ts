import { Middleware, RequestContext, ResponseContext, FetchParams, HTTPHeaders, Configuration } from './openapi';

const xApiVersion = '0.0.1';

class AppMiddleWare implements Middleware {
  async pre(context: RequestContext): Promise<FetchParams | void> {
    // version
    const headers: HTTPHeaders = <any>context.init.headers || {};
    headers['X-API-Version'] = xApiVersion;
    context.init.headers = headers;
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
