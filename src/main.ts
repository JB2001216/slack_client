import Vue from 'vue';
import VueFlashMessage from 'vue-flash-message';
import router from './router';
import store from './store';
import i18n from './i18n';
import * as components from './components';
import ApiErrorAction from './plugins/api-error-action';
import App from './App.vue';
import localStorage from '@/lib/local-storage';

localStorage.tokens = ['4c443bb2f4825823f4d39ea373f7cf328154a069'];

Vue.config.productionTip = process.env.NODE_ENV !== 'production';
Vue.config.devtools = process.env.NODE_ENV !== 'production';

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
