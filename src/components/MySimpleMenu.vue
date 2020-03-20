<template>
  <div class="mySimpleMenu">
    <slot :open="onOpen" :close="onClose" :opened="opened" />
    <div v-if="opened" ref="pop" class="mySimpleMenu_popup">
      <ul>
        <slot name="items">
          <!--
          <li>ステータス編集</li>
          <li>メンバー招待</li>
          <li class="archive border">アーカイブ</li>
          -->
        </slot>
      </ul>
    </div>
  </div>
</template>

<style lang="stylus">
.mySimpleMenu
  position: relative
  display: inline-block
  &_popup
    position: absolute
    top: calc(100% + 2px)
    left: 0
    z-index: 10
    box-shadow: none
    user-select: none
    box-shadow: 0px 8px 32px rgba(0,0,0,0.05)
    max-width: 150px
    ul
      border: solid 1px #eee
      display: inline-block
      padding: 8px 0 12px
      background: #fff
      border-radius: 4px
      box-sizing: border-box
      overflow: hidden
      width: 100%
      li
        padding: 7px 15px
        color: #333
        min-width: 110px
        font-size: 12px
        cursor: pointer
        &:hover
          background-color: #eee
</style>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class MySimpleMenu extends Vue {
  $refs!: {
    pop: HTMLDivElement;
  }

  opened = false;

  onOpen() {
    this.opened = true;
  }

  onClose() {
    this.opened = false;
  }

  onWindowClick(ev: MouseEvent) {
    this.onClose();
  }

  onWindowMouseDownUseCapture(ev: MouseEvent) {
    if (this.opened) {
      if (this.$refs.pop !== ev.target && !this.$refs.pop.contains(ev.target as Element)) {
        this.onClose();
      }
    }
  }

  beforeMount() {
    window.addEventListener('click', this.onWindowClick);
    window.addEventListener('mousedown', this.onWindowMouseDownUseCapture, true);
  }

  beforeDestroy() {
    window.removeEventListener('click', this.onWindowClick);
    window.removeEventListener('mousedown', this.onWindowMouseDownUseCapture, true);
  }
}
</script>
