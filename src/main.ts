import Vue from 'vue';
import VCalendar from 'v-calendar';
import VueFlashMessage from 'vue-flash-message';
import VueScrollTo from 'vue-scrollto';
import router from './router';
import store from './store';
import i18n from './i18n';
import * as components from './components';
import * as filters from './filters';
import ApiErrorAction from './plugins/api-error-action';
import App from './App.vue';

Vue.config.productionTip = process.env.NODE_ENV !== 'production';
Vue.config.devtools = process.env.NODE_ENV !== 'production';

// v-calendar
Vue.use<VCalendar.PluginOptions>(VCalendar, {
  componentPrefix: 'vc',
  datePickerShowCaps: true,
});

// vue-flash-message
Vue.use<VueFlashMessage.PluginOptions>(VueFlashMessage, {
  method: '$flash',
  createShortcuts: false,
  messageOptions: {
    timeout: 5000,
    pauseOnInteract: true,
  },
});
declare module 'vue/types/vue' {
  interface Vue {
    $flash: VueFlashMessage.MessageMethod;
  }
}

// vue-scrollto
Vue.use<VueScrollTo.Options>(<any>VueScrollTo, {
  container: 'body',
  duration: 500,
  easing: 'ease',
  offset: 0,
  force: true,
  cancelable: true,
  onStart: false,
  onDone: false,
  onCancel: false,
  x: false,
  y: true,
});

// フィルタ登録
type FiltersKey = keyof typeof filters;
(<FiltersKey[]>Object.keys(filters)).forEach((k) => {
  const f = filters[k];
  Vue.filter(k, f);
});

// api-error-action
Vue.use(ApiErrorAction);

// コンポーネント登録
type ComponentsKey = keyof typeof components;
(<ComponentsKey[]>Object.keys(components)).forEach((k) => {
  const c = components[k];
  Vue.component(k, c);
});

(async() => {
  // 初期設定
  await Promise.all([
    // 言語
    store.actions.initLocale(),
    // ログインユーザー
    store.actions.initLoggedInUsers(),
  ]);

  new Vue({
    router,
    store,
    i18n,
    render: (h) => h(App),
  }).$mount('#app');
})();
