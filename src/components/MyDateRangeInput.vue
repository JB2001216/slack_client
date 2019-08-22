<template>
  <div class="myDateRangeInput" :class="{disabled}" ref="container">
    <transition name="fade">
      <div
        class="myDateRangeInput_pop"
        ref="pop"
        v-if="poped"
        :style="{
          left: `${popLeft}px`,
          top: `${popTop}px`,
        }">
        <div
          class="myDateRangeInput_pop_arrow"
          :style="{
            width: `${popArrowWidth}px`,
            height: `${popArrowHeight}px`,
            left: `${popArrowLeft}px`,
            top: `${popArrowTop}px`,
            transform: `rotate(${popArrowRotate}deg) translateX(${popArrowTransrateX}px) translateY(${popArrowTransrateY}px)`,
          }">
          <div class="myDateRangeInput_pop_arrow_outer" />
          <div class="myDateRangeInput_pop_arrow_inner" />
        </div>
        <vc-date-picker
          mode="range"
          show-caps
          v-model="pickerValue"
          :columns="2"
          is-inline
          :locale="locale"
        />
        <button @click="onSaveButtonClick">{{$t('components.myDateRangeInput.save')}}</button>
        <button @click="onCancelButtonClick">{{$t('components.myDateRangeInput.cancel')}}</button>
        <button @click="onClearButtonClick">{{$t('components.myDateRangeInput.clear')}}</button>
      </div>
    </transition>
    <slot :range="value" :pop="onPop">
      <div class="myDateRangeInput_view" @click.stop="onPop">
        <svg class="myDateRangeInput_view_icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path class="myDateRangeInput_view_icon_path" d="M6.16667 2V5.33333H7.83333V2H6.16667ZM16.1667 2V5.33333H17.8333V2H16.1667ZM2.83333 4.5C2.37435 4.5 2 4.87435 2 5.33333V7.83333C2 8.29232 2.37435 8.66667 2.83333 8.66667V22H21.1667V8.66667C21.6257 8.66667 22 8.29232 22 7.83333V5.33333C22 4.87435 21.6257 4.5 21.1667 4.5H18.6667V6.16667H15.3333V4.5H8.66667V6.16667H5.33333V4.5H2.83333ZM4.5 8.66667H19.5V20.3333H4.5V8.66667ZM6.16667 10.3333V12H7.83333V10.3333H6.16667ZM9.5 10.3333V12H11.1667V10.3333H9.5ZM12.8333 10.3333V12H14.5V10.3333H12.8333ZM16.1667 10.3333V12H17.8333V10.3333H16.1667ZM6.16667 13.6667V15.3333H7.83333V13.6667H6.16667ZM9.5 13.6667V15.3333H11.1667V13.6667H9.5ZM12.8333 13.6667V15.3333H14.5V13.6667H12.8333ZM16.1667 13.6667V15.3333H17.8333V13.6667H16.1667ZM6.16667 17V18.6667H7.83333V17H6.16667ZM9.5 17V18.6667H11.1667V17H9.5ZM12.8333 17V18.6667H14.5V17H12.8333ZM16.1667 17V18.6667H17.8333V17H16.1667Z" fill="#333333" fill-opacity="0.72"/>
        </svg>
        <span class="myDateRangeInput_view_value" v-if="value">{{formatedEnd}}</span>
      </div>
    </slot>
  </div>
</template>

<style lang="stylus" scoped>
.myDateRangeInput
  display: inline-block
  &_view
    cursor: pointer
    user-select: none
    &_icon
      vertical-align: middle
    &_value
      vertical-align: middle

  &_pop
    position: fixed
    padding: 10px
    background: #fff
    border: solid 1px #eee
    z-index: 10
    &_arrow
      position: fixed
      z-index: 11
      &_outer
        position: absolute
        display: block
        width: 0
        height: 0
        left: 0
        top: -9px
        border-right: 9px solid transparent
        border-bottom: 9px solid #ddd
        border-left: 9px solid transparent
      &_inner
        position: absolute
        display: block
        width: 0
        height: 0
        left: 1px
        top: -8px
        border-right: 8px solid transparent
        border-bottom: 8px solid #fff
        border-left: 8px solid transparent

  &.disabled
    .myDateRangeInput_view
      cursor: default
  &:not(.disabled)
    &:hover
      .myDateRangeInput_view_icon
        &_path
          fill: #2f80ed
      .myDateRangeInput_view_value
        color: #2f80ed
  .vc-container
    border: none !important
  .vc-w-full
    border: none !important
</style>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator';
import moment from 'moment';

type Position = 'left' | 'right' | 'top' | 'bottom';

@Component
export default class MyDateRangeInput extends Vue {
  $refs!: {
    container: HTMLDivElement;
    pop: HTMLDivElement;
  };

  @Prop({ required: true })
  value!: {
    start: Date;
    end: Date;
  } | null;

  @Prop({ type: Boolean, default: false })
  disabled!: boolean;

  @Prop({ default: 'right' })
  position!: Position;

  positionPriority: Position[] = ['top', 'bottom', 'right', 'left'];

  pickerValue!: {
    start: Date;
    end: Date;
  } | null;

  popArrowWidth = 18;
  popArrowHeight = 9;
  popArrowLeft = 0;
  popArrowTop = 0;
  popArrowRotate = 0;
  popArrowTransrateX = 0;
  popArrowTransrateY = 0;
  popWidth = 534;
  popHeight = 312;
  popLeft = 0;
  popTop = 0;
  popMargin = 4;
  poped = false;

  get formatedEnd() {
    const value = this.value;
    if (!value) return '';

    const end = moment(value.end);
    const now = moment();
    if (now.year() === end.year()) {
      return end.format('M/D');
    }
    return end.format('YYYY/M/D');
  }

  get locale() {
    return this.$store.state.locale;
  }

  setPopPosition() {
    const rect = this.$refs.container.getBoundingClientRect();
    const priority = this.positionPriority.concat();
    priority.splice(priority.indexOf(this.position), 1);
    priority.unshift(this.position);
    priority.push(this.position);

    let left = 0;
    let top = 0;
    let pos = priority[0];
    for (pos of priority) {
      if (pos === 'left' || pos === 'right') {
        if (pos === 'left') {
          left = rect.left - this.popWidth - this.popArrowHeight - this.popMargin;
        } else if (pos === 'right') {
          left = rect.right + this.popArrowHeight + this.popMargin;
        }
        top = rect.top + (rect.height / 2) - (this.popHeight / 2);
        if (top < 0) {
          top = 0;
        }
        if (top + this.popHeight >= window.innerHeight) {
          top = window.innerHeight - this.popHeight;
        }
      } else if (pos === 'top' || pos === 'bottom') {
        if (pos === 'top') {
          top = rect.top - this.popHeight - this.popArrowHeight - this.popMargin;
        } else if (pos === 'bottom') {
          top = rect.bottom + this.popArrowHeight + this.popMargin;
        }
        left = rect.left + (rect.width / 2) - (this.popHeight / 2);
        if (left < 0) {
          left = 0;
        }
        if (left + this.popWidth >= window.innerWidth) {
          left = window.innerWidth - this.popWidth;
        }
      }

      if (
        top >= 0 &&
        top + this.popHeight <= window.innerHeight &&
        left >= 0 &&
        left + this.popWidth <= window.innerWidth
      ) {
        break;
      }
    }
    this.popLeft = left;
    this.popTop = top;

    if (pos === 'left') {
      this.popArrowRotate = 90;
      this.popArrowTransrateX = -1 * (this.popArrowWidth - this.popArrowHeight) / 2;
      this.popArrowTransrateY = -1 * (this.popArrowHeight - this.popArrowWidth) / 2;
      this.popArrowLeft = rect.left - (this.popArrowHeight * 2) - this.popMargin - 1;
      this.popArrowTop = rect.top + (rect.height / 2) - (this.popArrowWidth / 2);
    } else if (pos === 'right') {
      this.popArrowRotate = 270;
      this.popArrowTransrateX = -1 * (this.popArrowWidth - this.popArrowHeight) / 2;
      this.popArrowTransrateY = -1 * (this.popArrowHeight - this.popArrowWidth) / 2;
      this.popArrowLeft = rect.right + this.popMargin + 1;
      this.popArrowTop = rect.top + (rect.height / 2) - (this.popArrowWidth / 2);
    } else if (pos === 'top') {
      this.popArrowRotate = 180;
      this.popArrowTransrateX = 0;
      this.popArrowTransrateY = 0;
      this.popArrowTop = rect.top - (this.popArrowHeight * 2) - this.popMargin - 1;
      this.popArrowLeft = rect.left + (rect.width / 2) - (this.popArrowWidth / 2);
    } else if (pos === 'bottom') {
      this.popArrowRotate = 0;
      this.popArrowTransrateX = 0;
      this.popArrowTransrateY = 0;
      this.popArrowTop = rect.bottom + this.popArrowHeight + this.popMargin + 1;
      this.popArrowLeft = rect.left + (rect.width / 2) - (this.popArrowWidth / 2);
    }
  }

  onSaveButtonClick() {
    this.poped = false;
    this.$emit('input', this.pickerValue);
  }

  onCancelButtonClick() {
    this.poped = false;
  }

  onClearButtonClick() {
    this.poped = false;
    this.$emit('input', null);
  }

  onPop() {
    if (this.disabled) {
      return false;
    }
    this.setPopPosition();
    this.pickerValue = this.value;
    this.poped = true;
  }

  onWindowWheel() {
    this.poped = false;
  }

  onWindowResize() {
    this.poped = false;
  }

  onWindowMouseDownUseCapture(ev: MouseEvent) {
    if (this.poped) {
      if (this.$refs.pop !== ev.target && !this.$refs.pop.contains(ev.target as Element)) {
        this.poped = false;
      }
    }
  }

  beforeMount() {
    window.addEventListener('wheel', this.onWindowWheel);
    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('mousedown', this.onWindowMouseDownUseCapture, true);
  }

  beforeDestroy() {
    window.removeEventListener('wheel', this.onWindowWheel);
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('mousedown', this.onWindowMouseDownUseCapture, true);
  }
}
</script>
