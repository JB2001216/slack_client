<template>
  <div class="myProjectStatusInput" :class="{disabled}">
    <canvas ref="canvas" class="myProjectStatusInput_canvas" />
    <div class="myProjectStatusInput_progress">
      <div
        v-for="(o, i) in progressOptionsWithTextWidth"
        :key="`dd-${o.id}`"
        class="myProjectStatusInput_progress_item"
        @click="select(o)"
      >
        <div class="myProjectStatusInput_progress_item_color" :style="{background: getColor(o)}">
          <div
            class="myProjectStatusInput_progress_item_text"
            :style="{
              'max-width': o.textWidthDisplay ? `${o.textWidthDisplay}px` : o.textWidthDisplay,
              'min-width': o.textWidthDisplay ? `${o.textWidthDisplay}px` : o.textWidthDisplay,
            }"
          >
            {{ o.name }}
          </div>
        </div>
        <div v-if="i < progressOptions.length - 1" class="myProjectStatusInput_progress_item_ex" />
        <div v-if="i < progressOptions.length - 1" class="myProjectStatusInput_progress_item_arrowBorder" />
        <div v-if="i < progressOptions.length - 1" class="myProjectStatusInput_progress_item_arrow" :style="{'border-left-color': getColor(o)}" />
        <div v-if="o.textWidthDisplay === 0 || (o.textWidthDisplay && o.textWidthDisplay / o.textWidth < 0.99)" class="myProjectStatusInput_progress_item_tip">
          <span class="myProjectStatusInput_progress_item_tip_box">{{ o.name }}</span>
        </div>
      </div>
    </div>
    <div
      v-if="etcOptions.length"
      class="myProjectStatusInput_etc"
      :style="{'background-color': isEtc(selectedOption) ? (selectedOption.color || defaultColor) : undefined}"
      @click.stop="showOtherDialog()"
    >
      <span class="myProjectStatusInput_etc_text">{{ isEtc(selectedOption) ? selectedOption.name : $t('components.myProjectStatusInput.others') }}</span>
      <img class="myProjectStatusInput_etc_icon" src="~@/assets/images/icn/pulldown2.svg">
      <transition name="fade">
        <div v-if="selectingEtc" class="myProjectStatusInput_etc_dialog">
          <div
            v-for="o in etcOptions"
            :key="o.id"
            class="myProjectStatusInput_etc_dialog_item"
            @click="select(o)"
          >
            <span class="myProjectStatusInput_etc_dialog_item_color" :style="{background: o.color || defaultColor}" />
            <span class="myProjectStatusInput_etc_dialog_item_text">{{ o.name }}</span>
          </div>
        </div>
      </transition>
    </div>
    <div v-else style="display:none;" />
  </div>
</template>


<style lang="stylus" scoped>
@import '../stylus/_fixed/base/_theme'

.myProjectStatusInput
  max-width: 100%
  display: flex
  flex-wrap: nowrap
  user-select: none
  *
    box-sizing: content-box
  &_canvas
    display: none
  &_progress
    flex-shrink: 1
    display: flex
    flex-wrap: nowrap
    &_item
      flex-shrink: 1
      cursor: pointer
      height: 28px
      position: relative
      border: 1px solid #fff
      &:first-child
        border-radius: 100px 0 0 100px
        .myProjectStatusInput_progress_item_color
          border-radius: 100px 0 0 100px
      &:last-child
        border-radius: 0 100px 100px 0
        padding-right: 21px
        .myProjectStatusInput_progress_item_color
          border-radius: 0 100px 100px 0
          padding-right: 0
      &_color
        width: 100%
        height: 100%
        padding-left: 21px
        padding-right: 7px
      &_text
        width: 100%
        color: #fff
        font-weight: bold
        font-size: 12px
        line-height: 28px
        overflow: hidden
        white-space: nowrap
        text-overflow: ellipsis
        transition: max-width 0.2s, min-width 0.2s
      &_arrow,
      &_arrowBorder
        position: absolute
        top: 50%;
        left: 100%;
        margin-top: -14px;
        border: 14px solid transparent;
        border-left: 14px solid #fff;
        z-index: 1
        pointer-events: none
      &_arrowBorder
        transform: translateX(1px)
      &_ex
        position: absolute
        opacity: 0
        top: 0
        left: 100%
        bottom: 0
        width: 14px
        z-index: 1
      &_tip
        opacity: 0
        pointer-events: none
        transition: opacity 0.3s
        position: absolute
        top: -40px
        left: 0
        width: 100%
        display: flex
        justify-content: center
        align-items: center
        &_box
          font-size: 12px
          color: #333
          background #fff
          padding: 4px 8px
          white-space: nowrap
          border-radius: 4px
          box-shadow: 0 2px 8px 0 rgba(0,0,0,0.16)
          z-index: 2
        &:before
          content: ''
          position: absolute
          top: 100%
          left: 50%
          margin-left: -8px
          border: 8px solid transparent
          border-top: 8px solid #fff
          transform: scaleX(0.75)
          z-index: 3
        &:after
          content: ''
          position: absolute
          top: 100%
          left: 50%
          margin-left: -8px
          border: 8px solid transparent
          border-top: 8px solid #fff
          transform: scaleX(0.75)
          filter: drop-shadow(0 2px 3px rgba(0,0,0,0.16))
          z-index: 1
      &:not(:last-child)
        .myProjectStatusInput_progress_item_tip
          transform: translateX(4px)
      &:hover
        .myProjectStatusInput_progress_item_tip
          opacity: 1
        .myProjectStatusInput_progress_item_color,
        .myProjectStatusInput_progress_item_arrow
          filter: brightness(85%)

  &_etc
    flex-shrink: 0
    position: relative
    height: 28px
    background-color: #8F8F8F
    border-radius: 14px
    padding: 0 16px
    border: 1px solid #fff
    margin-left: 8px
    &:hover
      cursor: pointer
    &_icon
      vertical-align: middle
    &_text
      vertical-align: middle
      display: inline-block
      color: #fff
      font-weight: bold
      font-size: 12px
      line-height: 28px
      margin-right: 4px
      max-width: 100px
      text-overflow: ellipsis
      overflow: hidden
      white-space: nowrap
    &_dialog
      position: absolute
      top: 28px
      right: 0
      z-index: 4
      border-radius: 4px
      background-color: #FFFFFF
      box-shadow: 0 2px 8px 0 rgba(0,0,0,0.16)
      padding: 6px 0
      &_item
        display: flex
        flex-wrap: nowrap
        align-items: center
        margin: 4px 0
        padding: 6px 16px
        &:hover
          @extends .themeMenuItemHover
        &_color
          width: 12px
          height: 12px
          border-radius: 50%
          transform: translateY(1px)
        &_text
          padding-left: 8px
          white-space: nowrap
          font-size: 14px
          line-height: 20px
</style>


<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { ProjectStatusCategory } from '@/consts';

interface ProjectStatusOption {
  id: number;
  category: ProjectStatusCategory;
  name: string;
  sort: number;
  color: string | null;
}

interface ProjectStatusOptionWithWidth extends ProjectStatusOption {
  textWidth?: number;
  textWidthDisplay?: number;
}

const styles = {
  textFontFamily: 'Noto Sans CJK JP',
  textFontSize: 12,
  etcMarginLeft: 8,
  etcPaddingHorizontal: 32,
  etcTextMaxWidth: 100,
  etcTextMarginRight: 4,
  etcIconWidth: 10,
  itemPaddingHorizontal: 30,
  itemLastPadding: 14,
};

@Component
export default class MyProjectStatusInput extends Vue {
  $refs!: {
    canvas: HTMLCanvasElement;
  }

  @Prop({ required: true })
  options!: ProjectStatusOption[] | null;

  @Prop({ type: Boolean, default: false })
  disabled!: boolean;

  @Prop({ type: Number, default: null })
  value!: number | null;

  selectingEtc = false;
  inactiveColor = '#C4C4C4';
  defaultColor = '#6FCF97';

  componentWidth: number = 0;
  resizeObserver: ResizeObserver = new window.ResizeObserver(this.onResize);

  get progressOptionsWithTextWidth(): ProjectStatusOptionWithWidth[] {
    const componentWidth = this.componentWidth;
    if (!this.progressOptions.length) return [];
    if (!this.$refs.canvas) return this.progressOptions;

    const ctx = this.$refs.canvas.getContext('2d')!;
    ctx.font = `bold ${styles.textFontSize}px '${styles.textFontFamily}'`;

    const progressOptions: ProjectStatusOptionWithWidth[] = this.progressOptions.concat();
    progressOptions.forEach((o) => {
      o.textWidth = ctx.measureText(o.name).width;
      o.textWidthDisplay = undefined;
    });
    let restWidth = componentWidth - (progressOptions.length * styles.itemPaddingHorizontal) - styles.itemLastPadding;
    if (this.etcOptions.length) {
      const current = this.options!.find((o) => o.id === this.value);
      const etcText = current && current.category === ProjectStatusCategory.Etc ? current.name : this.$t('components.myProjectStatusInput.others').toString();
      const etcTextWidth = Math.min(ctx.measureText(etcText).width, styles.etcTextMaxWidth);
      restWidth = restWidth - etcTextWidth - styles.etcMarginLeft - styles.etcPaddingHorizontal - styles.etcTextMarginRight - styles.etcIconWidth;
    }
    const allWidth = progressOptions.map((o) => o.textWidth!).reduce((prev, current) => prev + current);
    if (allWidth <= restWidth) {
      return progressOptions;
    }

    progressOptions.forEach((o) => {
      o.textWidthDisplay = 0;
    });

    // first + last
    const first = progressOptions[0];
    const last = progressOptions[progressOptions.length - 1];
    if (restWidth > 0) {
      if (restWidth >= first.textWidth! + last.textWidth!) {
        first.textWidthDisplay = first.textWidth;
        last.textWidthDisplay = last.textWidth;
        restWidth = restWidth - first.textWidth! - last.textWidth!;
      } else {
        first.textWidthDisplay = restWidth / 2;
        last.textWidthDisplay = restWidth - first.textWidthDisplay;
        restWidth = 0;
      }
    }

    // current
    const current = progressOptions.find((o) => o.id === this.value);
    if (restWidth > 0 && current && current !== first && current !== last) {
      if (restWidth >= current.textWidth!) {
        current.textWidthDisplay = current.textWidth;
        restWidth = restWidth - current.textWidth!;
      } else {
        current.textWidthDisplay = restWidth;
        restWidth = 0;
      }
    }

    // others
    const others = progressOptions.filter((o) => o !== first && o !== last && o !== current);
    if (restWidth > 0 && others.length) {
      while (true) {
        const restOthers = others.filter((o) => o.textWidthDisplay! < o.textWidth!);
        if (!restOthers.length) break;

        const partWidth = Math.floor(restWidth / restOthers.length);
        if (partWidth <= 0) {
          restOthers[0].textWidthDisplay = restOthers[0].textWidthDisplay! + restWidth;
          restWidth = 0;
          break;
        }

        restOthers.forEach((o) => {
          if (o.textWidthDisplay! + partWidth >= o.textWidth!) {
            restWidth = restWidth - (o.textWidth! - o.textWidthDisplay!);
            o.textWidthDisplay = o.textWidth;
          } else {
            restWidth = restWidth - partWidth;
            o.textWidthDisplay = o.textWidthDisplay! + partWidth;
          }
        });
      }
    }
    others.forEach((o) => {
      if (o.textWidthDisplay === o.textWidth) {
        o.textWidthDisplay = undefined;
      }
    });

    return progressOptions;
  }

  get progressOptions() {
    if (!this.options) return [];
    return this.options.filter((o) => this.isProgress(o))
      .sort((o1, o2) => o1.sort < o2.sort ? -1 : 1);
  }

  get etcOptions() {
    if (!this.options) return [];
    return this.options.filter((o) => this.isEtc(o))
      .sort((o1, o2) => o1.sort < o2.sort ? -1 : 1);
  }

  get selectedOption() {
    if (!this.options) return null;
    if (this.value) {
      const option = this.options.find((o) => o.id === this.value);
      if (option) {
        return option;
      }
    }
    return null;
  }

  select(o: ProjectStatusOption) {
    if (this.disabled) return;
    this.$emit('input', o.id);
  }

  showOtherDialog() {
    if (this.disabled) return;
    this.selectingEtc = !this.selectingEtc;
  }

  isActive(o: ProjectStatusOption) {
    const selectedOption = this.selectedOption;
    if (!selectedOption) {
      return false;
    }
    if (o === selectedOption) {
      return true;
    }
    if (this.isProgress(selectedOption) &&
        this.isProgress(o) &&
        o.sort <= selectedOption.sort
    ) {
      return true;
    }
    return false;
  }

  getColor(o: ProjectStatusOption) {
    return this.isActive(o) ? (o.color || this.defaultColor) : this.inactiveColor;
  }

  isProgress(o: ProjectStatusOption | null) {
    return o && o.category === ProjectStatusCategory.Progress;
  }

  isEtc(o: ProjectStatusOption | null) {
    return o && o.category === ProjectStatusCategory.Etc;
  }

  onDocumentClick(ev: MouseEvent) {
    this.selectingEtc = false;
  }

  onResize(entries: ResizeObserverEntry[]) {
    for (const el of entries) {
      this.componentWidth = el.contentRect.width;
    }
  }

  mounted() {
    document.addEventListener('click', this.onDocumentClick);
    this.resizeObserver.observe(this.$el);
  }

  beforeDestroy() {
    document.removeEventListener('click', this.onDocumentClick);
    if (this.resizeObserver) {
      this.resizeObserver.unobserve(this.$el);
      this.resizeObserver.disconnect();
    }
  }
}
</script>
