import { Middleware, RequestContext, ResponseContext, FetchParams, HTTPHeaders, Configuration } from './openapi';
import localStorage from '@/lib/local-storage';
import { loadableLocales } from '@/i18n';

const xApiVersion = '0.0.1';

class AppMiddleWare implements Middleware {
  async pre(context: RequestContext): Promise<FetchParams | void> {
    const headers: HTTPHeaders = <any>context.init.headers || {};

    // version
    headers['X-API-Version'] = xApiVersion;

    // locale
    const locale = localStorage.locale;
    if (locale && loadableLocales.includes(locale)) {
      headers['Accept-Language'] = locale;
    }

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
