declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'production' | 'development';
    VUE_APP_API_BASE_PATH: string;
    VUE_APP_TITLE: string;
    VUE_APP_URL_SCHEME: string;
  }
}
