<template>
  <div id="app" :class="{[theme]: true, [`platform-${platform}`]: true, frameless, active}">
    <div v-if="frameless" class="appTitlebar" @dblclick="onAppTitlebarDblClick()" />
    <div v-if="enabledMdl2Controls" class="mdl2Controls">
      <div class="mdl2Controls_button minimize" @click="onWindowMinimizeButtonClick()">
        <span>&#xE921;</span>
      </div>
      <div v-if="!maximized" class="mdl2Controls_button maximize" @click="onWindowMaximizeButtonClick()">
        <span>&#xE922;</span>
      </div>
      <div v-if="maximized" class="mdl2Controls_button restore" @click="onWindowResizeButtonClick()">
        <span>&#xE923;</span>
      </div>
      <div class="mdl2Controls_button close" @click="onWindowCloseButtonClick()">
        <span>&#xE8BB;</span>
      </div>
    </div>

    <my-debug-tool v-if="enableDebugTool" />
    <my-flash-message />
    <setting-router-view />
    <router-view />

    <!-- TODO: 暫定的に設定をここに入れる -->
    <div style="background:rgba(0,0,0,0.5); font-size:12px; border-radius:3px; padding:1px 6px; position:fixed; left:2px; bottom:75px; z-index:1; color:#fff;">
      <template v-for="(t,i) in themes">
        <span v-if="i !== 0" :key="i" style="padding: 0 4px;">|</span>
        <span :key="t" style="cursor:pointer;" @click="theme=t">{{ i+1 }}</span>
      </template>
    </div>
    <div style="background:rgba(0,0,0,0.5); font-size:12px; border-radius:3px; padding:1px 6px; position:fixed; left:2px; bottom:50px; z-index:1; color:#fff;">
      <template v-for="(locale, i) in loadableLocales">
        <span v-if="i !== 0" :key="i" style="padding: 0 4px;">|</span>
        <span :key="locale" style="cursor:pointer;" @click.prevent="$store.actions.setLocale(locale)">{{ locale }}</span>
      </template>
    </div>
    <div style="background:rgba(0,0,0,0.5); font-size:12px; border-radius:3px; padding:1px 6px; position:fixed; left:2px; bottom:25px; z-index:1; color:#fff;">
      <span>v{{ version }}</span>
    </div>
  </div>
</template>


<style lang="stylus">
@import './stylus/_fixed/full'

#app
  .fade-enter-active, .fade-leave-active
    transition: opacity 200ms
  .fade-enter, .fade-leave-to
    opacity: 0
  .slide-right-enter-active, .slide-right-leave-active
    transform: translate(0px, 0px)
    transition: transform 225ms ease-in-out
  .slide-right-enter, .slide-right-leave-to
    transform: translateX(100vw) translateX(0px)

  &.frameless
    .appTitlebar
      -webkit-app-region: drag
      position: fixed
      top: 0
      left: 0
      right: 0
      height: 20px
      user-select: none
      background: #fff
      opacity: 0
      z-index: 999999

    .mdl2Controls
      -webkit-app-region: no-drag
      display: grid
      grid-template-columns: repeat(3, 46px)
      position: fixed
      top: 0
      right: 0
      height: 20px// 32px
      font-family: $mdl2-font-family
      font-size: 10px
      color: rgba(0,0,0,0.8)
      z-index: 999999
      &_button
        grid-row: 1 / span 1
        display: flex
        justify-content: center
        align-items: center
        width: 100%
        height: 100%
        user-select: none
        cursor: default
        &:hover
          background: rgba(0,0,0,0.1)
          color: rgba(0,0,0,0.8) !important
        &.close:hover
          background: #E81123
          color: rgba(255,255,255,1) !important
    &:not(.active)
      .mdl2Controls
        &_button
          color: rgba(0,0,0,0.3)
</style>


<script lang="ts">
import { Component as SyncComponent, AsyncComponent } from 'vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import MyFlashMessage from '@/components/MyFlashMessage.vue';
import { getErrorMessage } from '@/lib/errors';
import SettingRouterView from '@/views/setting/SettingRouterView.vue';
import { loadableLocales } from '@/i18n';
import { AppEventMap } from '@/plugins/app-event';
import { remote } from 'electron';
import { eventsSub } from '@/events-subscription';

type Theme = 'color_gray_green' | 'color_blueGray_green';

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
  theme: Theme = 'color_blueGray_green';
  themes: Theme[] = [
    'color_gray_green',
    'color_blueGray_green',
  ];
  maximized = false;
  active = true;

  get enableDebugTool() {
    return enableDebugTool;
  }

  get loadableLocales() {
    return loadableLocales;
  }

  get version() {
    return remote.app.getVersion();
  }

  get platform() {
    return process.platform;
  }

  get frameless() {
    return this.platform === 'win32' || this.platform === 'darwin';
  }

  get enabledMdl2Controls() {
    return this.platform === 'win32';
  }

  get myUser() {
    return this.$store.state.activeUser.myUser!;
  }

  created() {
    eventsSub.init(this.myUser.space.id);
  }

  toggleWindowMaximize() {
    const win = remote.getCurrentWindow();
    win.isMaximized() ? win.unmaximize() : win.maximize();
  }

  setMaximized() {
    const win = remote.getCurrentWindow();
    this.maximized = win.isMaximized();
  }

  onAppTitlebarDblClick() {
    this.toggleWindowMaximize();
  }

  onWindowMinimizeButtonClick() {
    const win = remote.getCurrentWindow();
    win.minimize();
  }

  onWindowMaximizeButtonClick() {
    this.toggleWindowMaximize();
  }

  onWindowResizeButtonClick() {
    this.toggleWindowMaximize();
  }

  onWindowCloseButtonClick() {
    const win = remote.getCurrentWindow();
    win.hide();
  }

  onWindowResize() {
    this.setMaximized();
  }

  onWindowBlur() {
    this.active = false;
  }

  onWindowFocus() {
    this.active = true;
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

  beforeMount() {
    this.setMaximized();
    this.$appOn('flash', this.onFlash);
    this.$appOn('error', this.onError);
    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('blur', this.onWindowBlur);
    window.addEventListener('focus', this.onWindowFocus);
  }

  mounted() {
    window.focus();
  }

  beforeDestroy() {
    this.$appOff('flash', this.onFlash);
    this.$appOff('error', this.onError);
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('blur', this.onWindowBlur);
    window.removeEventListener('focus', this.onWindowFocus);
  }
}
</script>
