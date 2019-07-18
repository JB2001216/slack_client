import { Locale } from '@/i18n/types';

enum LocalStorageKeys {
  Locale = 'locale',
  Tokens = 'tokens',
}

class LocalStorage {
  constructor(private _keyPrefix: string) {}

  get locale(): Locale | null {
    return <Locale | null> this._get(LocalStorageKeys.Locale);
  }
  set locale(v: Locale | null) {
    this._set(LocalStorageKeys.Locale, v);
  }

  get tokens(): string[] {
    const tokenJson = this._get(LocalStorageKeys.Tokens);
    if (!tokenJson) {
      return [];
    }
    return JSON.parse(tokenJson);
  }
  set tokens(v: string[]) {
    this._set(LocalStorageKeys.Tokens, JSON.stringify(v));
  }

  private _fullKey(key: LocalStorageKeys) {
    return this._keyPrefix + key;
  }

  private _set(key: LocalStorageKeys, value: string | null) {
    const fullKey = this._fullKey(key);
    if (!value || value === '') {
      window.localStorage.removeItem(fullKey);
      return;
    }
    window.localStorage.setItem(fullKey, value);
  }

  private _get(key: LocalStorageKeys) {
    const fullKey = this._fullKey(key);
    return window.localStorage.getItem(fullKey);
  }
}

export default new LocalStorage(`${process.env.VUE_APP_TITLE}.`);
