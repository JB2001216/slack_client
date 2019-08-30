<template>
  <div id="app" :class="{[theme]: true}">
    <my-debug-tool v-if="enableDebugTool" />
    <my-flash-message/>
    <router-view/>

    <!-- TODO: 暫定的に言語切替をここに入れる -->
    <div style="background:rgba(0,0,0,0.5); border-radius:6px; padding:5px 8px; position:fixed; left:2px; bottom:10px; z-index:1; color:#fff;">
      <template v-for="(locale, i) in loadableLocales">
        <span v-if="i !== 0" :key="i" style="padding: 0 4px;">|</span>
        <span :key="locale" @click.prevent="$store.actions.setLocale(locale)" style="cursor:pointer;">{{locale}}</span>
      </template>
    </div>
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
import { loadableLocales } from '@/i18n';

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
  theme: 'color_default' | 'color_gray_green' | 'color_blueGray_green' = 'color_blueGray_green';

  get enableDebugTool() {
    return enableDebugTool;
  }

  get loadableLocales() {
    return loadableLocales;
  }
}
</script>
