import Vue from 'vue';
import { install, store as createStore } from 'sinai';
import root from './root';
import { subscribeSyncEvents } from './sync';

install(Vue);

const store = createStore(root, {
  strict: process.env.NODE_ENV !== 'production',
});

declare module 'vue/types/vue' {
  interface Vue {
    $store: typeof store;
  }
}

subscribeSyncEvents(store);

export default store;
