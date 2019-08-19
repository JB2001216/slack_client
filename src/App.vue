<template>
  <div id="app">
    <my-debug-tool v-if="enableDebugTool" />
    <my-flash-message/>
    <router-view/>
  </div>
</template>

<style lang="stylus">
@import '../node_modules/vue-flash-message/dist/vue-flash-message.min.css'
@import './stylus/_fixed/full'

.fade-enter-active, .fade-leave-active
  transition: opacity .2s
.fade-enter, .fade-leave-to
  opacity: 0
</style>

<script lang="ts">
import { Component as SyncComponent, AsyncComponent } from 'vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import MyFlashMessage from '@/components/MyFlashMessage.vue';

const components: { [key: string]: SyncComponent<any, any, any, any> | AsyncComponent<any, any, any, any> } = {
  MyFlashMessage,
};

const enableDebugTool = process.env.NODE_ENV !== 'production';
if (enableDebugTool) {
  components['MyDebugTool'] = () => import(/* webpackChunkName: "debug/MyDebugTool" */ './debug/MyDebugTool.vue');
}

@Component({
  components,
})
export default class App extends Vue {
  get enableDebugTool() {
    return enableDebugTool;
  }
}
</script>
