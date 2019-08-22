import Vue from 'vue';
import VueI18n from 'vue-i18n';
import moment from 'moment';
import { Locale, LocaleStruct } from './types';
import defaultLocaleStruct from './locale/en';

Vue.use(VueI18n);

export const defaultLocale: Locale = 'en';
export const loadableLocales: Locale[] = ['en', 'ja'];
const loadedLocales: Locale[] = [defaultLocale];

const i18n = new VueI18n({
  fallbackLocale: defaultLocale,
});
defineLocale(defaultLocale, defaultLocaleStruct);
setLocale(defaultLocale);

function defineLocale(locale: Locale, struct: LocaleStruct) {
  i18n.setLocaleMessage(locale, struct.i18n);
  moment.updateLocale(locale, struct.moment);
}

function setLocale(locale: Locale) {
  i18n.locale = locale;
  moment.locale(locale);
  document.querySelector('html')!.setAttribute('lang', locale);
  return locale;
}

export async function loadLocale(locale: Locale): Promise<Locale> {
  if (locale === i18n.locale) {
    return locale;
  }
  if (!loadableLocales.includes(locale)) {
    return <Locale>i18n.locale;
  }
  if (!loadedLocales.includes(locale)) {
    const struct: LocaleStruct = (await import(/* webpackChunkName: "locale/[request]" */ `./locale/${locale}`)).default;
    defineLocale(locale, struct);
  }
  return setLocale(locale);
}

export default i18n;
export * from './types';
