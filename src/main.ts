import Vue from 'vue';
import router from './router';
import store from './store';
import i18n, { defaultLocale } from './i18n';
import localStorage from '@/lib/local-storage';

import App from './App.vue';

Vue.config.productionTip = process.env.NODE_ENV !== 'production';
Vue.config.devtools = process.env.NODE_ENV !== 'production';

(async() => {
  // 初期言語設定
  await store.actions.loadLocale(localStorage.locale || defaultLocale);

  new Vue({
    router,
    store,
    i18n,
    render: (h) => h(App),
  }).$mount('#app');
})();
