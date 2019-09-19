<template>
  <div class="myColorPicker">
    <slot :open="onOpen" :close="onClose" :opened="opened" />
    <div v-if="opened" ref="pop" class="myColorPicker_pop">
      <ul class="clearfix myColorPicker_pop_palette">
        <li v-for="c in defaultColors" :key="c" class="myColorPicker_pop_palette_color" :class="{active: c===value}" @click="onColorSelect(c)">
          <div class="myColorPicker_pop_palette_color_before" :style="{background: c}" />
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="stylus">
.myColorPicker
  position: relative
  *
    box-sizing: border-box

  &_pop
    width: 202px
    padding: 10px
    border-radius: 4px
    background-color: #fff
    -webkit-box-shadow: 0 2px 8px 0 rgba(0,0,0,0.16)
    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.16)
    position: absolute
    z-index: 2
    left: 0
    &_palette
      &_color
        float: left
        width: 30px
        height: 30px
        margin-top: 0!important
        cursor: pointer
        position: relative
        &_before,
        &:after
          border-radius: 50%
          position: absolute
          top: 0
          left: 0
          right: 0
          bottom: 0
          margin: auto
        &_before
          width: 16px
          height: 16px
        &:after
          content: ""
          width: 24px
          height: 24px
        &.active:after,
        &:hover:after
          border: 1px solid #c4c4c4
</style>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { colorPickerDefaultColors } from '@/consts';

@Component
export default class MyColorPicker extends Vue {
  $refs!: {
    pop: HTMLDivElement;
  }

  @Prop({ default: null })
  value!: string | null;

  @Prop({ type: Array, default: [] })
  customColors!: string[];

  opened = false;

  get defaultColors() {
    return colorPickerDefaultColors;
  }

  onOpen() {
    this.opened = true;
  }

  onClose() {
    this.opened = false;
  }

  onColorSelect(color: string) {
    this.$emit('input', color);
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
    window.addEventListener('mousedown', this.onWindowMouseDownUseCapture, true);
  }

  beforeDestroy() {
    window.removeEventListener('mousedown', this.onWindowMouseDownUseCapture, true);
  }
}
</script>
