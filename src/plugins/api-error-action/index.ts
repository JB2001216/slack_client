import Vue, { VueConstructor } from 'vue';
import ApiErrorActionBus from './ApiErrorActionBus.vue';

const bus = new ApiErrorActionBus();

export default {
  install(Vue: VueConstructor) {
    Vue.mixin({
      methods: {
        async $showApiError(vm: Vue, err: any) {
          await (<any>bus).show(vm, err);
        },
      },
    });
  },
};

declare module 'vue/types/vue' {
  interface Vue {
    $showApiError: (vm: Vue, err: any) => Promise<void>;
  }
}
