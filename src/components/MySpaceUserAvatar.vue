<template>
  <div class="mySpaceUserAvatar" :class="{[`shape-${shape}`]: true}" :style="{width:`${size}px`, height:`${size}px`}">
    <img v-if="imageUrl" :src="imageUrl" class="mySpaceUserAvatar_image">
    <div
      v-else
      class="mySpaceUserAvatar_initials"
      :style="{
        'font-size':`${nameInitialSize}px`,
        'line-height':`${nameInitialSize}px`,
      }"
    >
      <span>{{ nameInitials }}</span>
    </div>
  </div>
</template>


<style lang="stylus">
@import '../stylus/_settings'

.mySpaceUserAvatar
  box-sizing: border-box
  overflow: hidden
  display: inline-block
  user-select: none
  &.shape-circle
    border-radius: 50%
  &.shape-roundedSquare
    border-radius: 4px
  &_image
    object-fit: cover
    width: 100%
    height: 100%
  &_initials
    width: 100%
    height: 100%
    themeBackgroundColor('icon')
    color: #fff
    display: flex
    justify-content: center
    align-items: center
    font-weight: bold
    white-space: nowrap
</style>


<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { SpaceUser, MyUser } from '@/lib/api';

@Component
export default class MySpaceUserAvatar extends Vue {
  @Prop({ default: null })
  user!: SpaceUser | MyUser | null;

  @Prop({ type: Number, default: 40 })
  size!: number;

  @Prop({ type: String, default: 'circle' })
  shape!: 'circle' | 'square' | 'roundedSquare';

  get imageUrl() {
    if (!this.user) return null;
    return this.size > 128 ? this.user.avatarUrl : this.user.avatarSmallUrl;
  }

  get nameInitials() {
    if (!this.user) return '';
    // eslint-disable-next-line no-irregular-whitespace
    const splits = (this.user.displayName || this.user.account).split(/\s|　|_|＿|,|、/);
    if (splits.length < 2) {
      return splits[0].slice(0, 1);
    } else {
      return splits[0].slice(0, 1) + splits[1].slice(0, 1);
    }
  }

  get nameInitialSize() {
    const initials = this.nameInitials;
    if (initials.length <= 1) {
      return this.size * 0.67;
    }
    if (initials.match(/^[a-zA-Z0-9]+$/)) {
      return this.size * 0.56;
    }
    return this.size * 0.42;
  }
}
</script>
