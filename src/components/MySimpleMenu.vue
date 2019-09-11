<template>
  <div class="mySimpleMenu">
    <slot :open="onOpen" :close="onClose" :opened="opened" />
    <div v-if="opened" ref="pop" class="other_status">
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
  .other_status
    position: absolute
    top: calc(100% + 2px)
    left: 0
    z-index: 10
    box-shadow: none
    user-select: none
    ul
      padding-left: 0
      padding-right: 0
      border: solid 1px #eee
      li
        padding: 7px 15px
        color: #333
        &:hover
          background: #eee
        a
          padding: 0
          display: block
          text-decoration: none
          color: inherit
          transition: 0.5s
          line-height: normal
          min-height: initial
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
