<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as api from '@/lib/api';
import { AppEventMap, AppEventBus } from './types';

@Component
export default class ApiEventBusVue extends Vue implements AppEventBus {
  on<K extends keyof AppEventMap>(type: K, callback: (ev: AppEventMap[K]) => any) {
    this.$on(type, callback);
  }
  off<K extends keyof AppEventMap>(type: K, callback: (ev: AppEventMap[K]) => any) {
    this.$off(type, callback);
  }
  emit<K extends keyof AppEventMap>(type: K, ev: AppEventMap[K]) {
    this.$emit(type, ev);
  }
}
</script>
