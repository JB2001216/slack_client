<template>
  <transition name="fade">
    <div v-if="value" class="myModal" @mousedown="onClose()">
      <div class="myModal_content" :class="contentClass" @mousedown.stop>
        <slot />
      </div>
    </div>
  </transition>
</template>

<style lang="stylus">
.myModal
  z-index: 10000
  position: fixed
  left: 0
  top: 0
  right: 0
  bottom: 0
  display: flex
  justify-content: center
  align-items: center
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class MyModal extends Vue {

  @Prop({ type: Boolean, default: false })
  value!: boolean;

  @Prop({ default: '' })
  contentClass!: string | {[key: string]: boolean};

  onClose() {
    this.$emit('input', false);
  }
}
</script>
