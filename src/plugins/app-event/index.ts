import Vue, { VueConstructor } from 'vue';
import AppEventBusVue from './AppEventBus.vue';
import { AppEventBus } from './types';

const bus: AppEventBus = new AppEventBusVue();

export default {
  install(Vue: VueConstructor) {
    Vue.mixin({
      methods: {
        $appOn: bus.on,
        $appOff: bus.off,
        $appEmit: bus.emit,
      },
    });
  },
};

declare module 'vue/types/vue' {
  interface Vue {
    $appOn: typeof bus.on;
    $appOff: typeof bus.off;
    $appEmit: typeof bus.emit;
  }
}
