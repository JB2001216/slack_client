import Vue, { VueConstructor } from 'vue';
import AppEventBusVue from './AppEventBus.vue';
import { AppEventBus } from './types';

export const appEventBus: AppEventBus = new AppEventBusVue();
export * from './types';

export default {
  install(Vue: VueConstructor) {
    Vue.mixin({
      methods: {
        $appOn: appEventBus.on,
        $appOff: appEventBus.off,
        $appEmit: appEventBus.emit,
      },
    });
  },
};

declare module 'vue/types/vue' {
  interface Vue {
    $appOn: typeof appEventBus.on;
    $appOff: typeof appEventBus.off;
    $appEmit: typeof appEventBus.emit;
  }
}
