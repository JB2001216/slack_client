import { Locale } from '@/i18n/types';
import { RawLocation } from 'vue-router';

enum LocalStorageKeys {
  Locale = 'locale',
  Tokens = 'tokens',
  AppLastLocation = 'appLastLocation',
  UserLastLocations = 'userLastLocations',
  ProjectLastLocations = 'projectLastLocations',
}

class LocalStorage {
  constructor(private _keyPrefix: string) {}

  get locale(): Locale | null {
    return this._get(LocalStorageKeys.Locale) as Locale | null;
  }
  set locale(v: Locale | null) {
    this._set(LocalStorageKeys.Locale, v);
  }

  get tokens(): string[] {
    const json = this._get(LocalStorageKeys.Tokens);
    if (!json) return [];
    return JSON.parse(json);
  }
  set tokens(v: string[]) {
    this._set(LocalStorageKeys.Tokens, JSON.stringify(v));
  }

  get appLastLocation(): RawLocation | null {
    const json = this._get(LocalStorageKeys.AppLastLocation);
    if (!json) return null;
    return JSON.parse(json);
  }
  set appLastLocation(v: RawLocation | null) {
    this._set(LocalStorageKeys.AppLastLocation, JSON.stringify(v));
  }

  get userLastLocations(): {[userId: number]: RawLocation} {
    const json = this._get(LocalStorageKeys.UserLastLocations);
    if (!json) return {};
    return JSON.parse(json);
  }
  set userLastLocations(v: {[userId: number]: RawLocation}) {
    this._set(LocalStorageKeys.UserLastLocations, JSON.stringify(v));
  }

  get projectLastLocations(): {[userId: number]: {[projectId: number]: RawLocation}} {
    const json = this._get(LocalStorageKeys.ProjectLastLocations);
    if (!json) return {};
    return JSON.parse(json);
  }
  set projectLastLocations(v: {[userId: number]: {[projectId: number]: RawLocation}}) {
    this._set(LocalStorageKeys.ProjectLastLocations, JSON.stringify(v));
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
