<template>
  <div id="app" :class="{[theme]: true}">
    <my-debug-tool v-if="enableDebugTool" />
    <my-flash-message/>
    <setting-router-view/>
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
@import './stylus/_fixed/full'

.fade-enter-active, .fade-leave-active
  transition: opacity 200ms
.fade-enter, .fade-leave-to
  opacity: 0
.slide-right-enter-active, .slide-right-leave-active
  transform: translate(0px, 0px)
  transition: transform 225ms ease-in-out
.slide-right-enter, .slide-right-leave-to
  transform: translateX(100vw) translateX(0px)
</style>


<script lang="ts">
import { Component as SyncComponent, AsyncComponent } from 'vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import MyFlashMessage from '@/components/MyFlashMessage.vue';
import { getErrorMessage } from '@/lib/errors';
import SettingRouterView from '@/views/setting/SettingRouterView.vue';
import { loadableLocales } from '@/i18n';
import { AppEventMap } from '@/plugins/app-event';

const components: { [key: string]: SyncComponent<any, any, any, any> | AsyncComponent<any, any, any, any> } = {
  MyFlashMessage,
  SettingRouterView,
};

const enableDebugTool = process.env.NODE_ENV !== 'production';
if (enableDebugTool) {
  components['MyDebugTool'] = () => import(/* webpackChunkName: "plugins/debug/MyDebugTool" */ './plugins/debug/MyDebugTool.vue');
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

  onFlash(ev: AppEventMap['flash']) {
    this.$flash(ev.message, ev.name, ev.options);
  }

  async onError(ev: AppEventMap['error']) {
    if (typeof ev.flash === 'undefined' || ev.flash) {
      const message = await getErrorMessage(ev.err, this.$i18n, ev.options);
      this.$flash(message, 'error');
    }
  }

  mounted() {
    this.$flash('success', 'success', { timeout: 0 });
    this.$flash('error', 'error', { timeout: 0 });
  }

  beforeMount() {
    this.$appOn('flash', this.onFlash);
    this.$appOn('error', this.onError);
  }

  beforeDestroy() {
    this.$appOff('flash', this.onFlash);
    this.$appOff('error', this.onError);
  }
}
</script>
