export enum ApiErrors {
  ValidationError = 'ValidationError',
  ExpiredTokenError = 'ExpiredTokenError',
  LoginUserNotFound = 'LoginUserNotFound',
  AuthenticationFailed = 'AuthenticationFailed',
}

/** Responseのjson()が一度実行されると2度目でエラーになってしまうので回避 */
export async function getJsonFromResponse(res: Response): Promise<any> {
  if (typeof (res as any)._json === 'undefined') {
    try {
      (res as any)._json = await res.json();
    } catch {
      (res as any)._json = null;
    }
  }
  return (res as any)._json;
}
