<template>
  <div id="app">
    <my-debug-tool v-if="enableDebugTool" />
    <router-view/>
  </div>
</template>

<style lang="stylus">
@import './stylus/_fixed/full'
</style>

<script lang="ts">
import { Component as SyncComponent, AsyncComponent } from 'vue';
import { Component, Prop, Vue } from 'vue-property-decorator';

const components: { [key: string]: SyncComponent<any, any, any, any> | AsyncComponent<any, any, any, any> } = {};

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
