<template>
  <div class="myColorPicker">
    <slot :open="onOpen" :close="onClose" :opened="opened" />
    <div v-if="opened" ref="pop" class="myColorPicker_pop" :class="{custom}">
      <div v-if="!custom">
        <ul class="clearfix myColorPicker_pop_palette">
          <li
            v-for="c in defaultColors"
            :key="c"
            class="myColorPicker_pop_palette_color"
            :class="{active: c===value}"
            @click="onColorSelect(c)"
          >
            <div class="myColorPicker_pop_palette_color_before" :style="{background: c}" />
          </li>
        </ul>
        <hr>
        <ul class="clearfix myColorPicker_pop_palette">
          <li
            v-for="c in customColors"
            :key="c"
            class="myColorPicker_pop_palette_color"
            :class="{active: c===value}"
            @click="onColorSelect(c)"
          >
            <div class="myColorPicker_pop_palette_color_before" :style="{background: c}" />
          </li>
          <li class="myColorPicker_pop_palette_color add" @click="onCustom()">
            <div class="myColorPicker_pop_palette_color_before">
              ＋
            </div>
          </li>
        </ul>
      </div>
      <chrome-picker v-if="custom" v-model="chromeColor" @input="onChromeColorInput" />
    </div>
  </div>
</template>

<style lang="stylus">
@import '../stylus/_settings'

.myColorPicker
  position: relative
  *
    box-sizing: border-box

  hr
    border-color: $colors.lightGrayLighten2
    margin: 6px 0

  &_pop
    width: 202px
    padding: 10px
    border-radius: 4px
    background-color: #fff
    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.16)
    position: absolute
    z-index: 2
    left: 0
    &.custom
      box-shadow: none
      background-color: transparent
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
        &.add
          .myColorPicker_pop_palette_color_before
            border: 1px solid #b0b0b0
            color: #b0b0b0
            width: 20px
            height: 20px
            font-size: 12px
            justify-content: center
            display: flex
            align-items: center

        &.active:after,
        &:hover:after
          border: 1px solid $colors.lightGray
  .vc-chrome
    width: initial
</style>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { colorPickerDefaultColors } from '@/consts';
import { Chrome } from 'vue-color';


@Component({
  components: {
    'chrome-picker': Chrome,
  },
})
export default class MyColorPicker extends Vue {

  $refs!: {
    pop: HTMLDivElement;
  }

  @Prop({ default: null })
  value!: string | null;

  @Prop({ type: Array, default: [] })
  customColors!: string[];

  opened = false;
  custom = false;
  chromeColor: any = '#194d33';

  get defaultColors() {
    return colorPickerDefaultColors;
  }

  onOpen() {
    this.opened = true;
    this.custom = false;
  }

  onClose() {
    this.opened = false;
    this.custom = false;
    this.$emit('close');
  }

  onCustom() {
    this.chromeColor = this.value || this.chromeColor;
    this.custom = true;
  }

  onColorSelect(color: string) {
    this.$emit('input', color);
  }

  onChromeColorInput(color: any) {
    this.$emit('input', this.chromeColor.hex8);
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
