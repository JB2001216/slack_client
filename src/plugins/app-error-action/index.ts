import Vue, { VueConstructor } from 'vue';
import AppErrorActionBus from './AppErrorActionBus.vue';

const bus = new AppErrorActionBus();

export default {
  install(Vue: VueConstructor) {
    Vue.mixin({
      methods: {
        async $showAppError(vm: Vue, err: any) {
          await (<any>bus).show(vm, err);
        },
      },
    });
  },
};

declare module 'vue/types/vue' {
  interface Vue {
    $showAppError: (vm: Vue, err: any) => Promise<void>;
  }
}
