import Vue from 'vue';
import { install, store as createStore, Getters, Mutations, Actions, module } from 'sinai';
import i18n, { Locale, loadLocale, defaultLocale } from './i18n';
import localStorage from '@/lib/local-storage';

install(Vue);

class RootState {
  locale: Locale = defaultLocale;
  titleKey?: string = undefined;
}

class RootGetters extends Getters<RootState>() {
  get title() {
    if (!this.state.titleKey) {
      return '';
    }
    return i18n.t(this.state.titleKey).toString();
  }
  get documentTitle() {
    const title = this.title;
    return (title === '' ? '' : `${title} - `) + process.env.VUE_APP_TITLE;
  }
}

class RootMutations extends Mutations<RootState>() {
  setLocale(locale: Locale) {
    this.state.locale = locale;
    localStorage.locale = locale;
  }
  setTitleKey(titleKey: string) {
    this.state.titleKey = titleKey;
  }
}

class RootActions extends Actions<RootState, RootGetters, RootMutations>() {
  async loadLocale(locale: Locale) {
    this.mutations.setLocale(await loadLocale(locale));
  }
}

const root = module({
  state: RootState,
  getters: RootGetters,
  mutations: RootMutations,
  actions: RootActions,
});

const store = createStore(root, {
  strict: process.env.NODE_ENV !== 'production',
});

declare module 'vue/types/vue' {
  interface Vue {
    $store: typeof store;
  }
}

export default store;
