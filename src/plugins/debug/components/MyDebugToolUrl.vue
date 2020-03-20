<template>
  <form class="debugToolUrl" @click="onCoverClick" @submit.prevent="onSubmit">
    <my-single-form-text-input
      ref="input"
      v-model="url"
      class="debugToolUrl_input"
      placeholder="URL"
      @click.stop
    />
  </form>
</template>

<style lang="stylus" scoped>
.debugToolUrl
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  z-index 10001
  background: rgba(0,0,0,0.5)
  display: flex
  justify-content: center
  align-items: center
  &_input
    width: 50%
    margin: 0
    padding: 0
</style>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import MySingleFormTextInput from '@/components/MySingleFormTextInput';
import electron from 'electron';

@Component
export default class MyDebugToolUrl extends Vue {
  url = '';

  $refs!: {
    input: MySingleFormTextInput;
  };

  emitClose() {
    this.$emit('close');
  }

  onSubmit(ev: Event) {
    if (this.url.trim() !== '') {
      this.$router.push(this.url);
      this.$emit('success');
    }
  }

  onKeyDown(ev: KeyboardEvent) {
    if (ev.key === 'Escape') {
      this.emitClose();
    }
  }

  onCoverClick(ev: Event) {
    this.emitClose();
  }

  beforeMount() {
    this.url = this.$route.fullPath;
  }

  mounted() {
    document.addEventListener('keydown', this.onKeyDown, true);
    this.$refs.input.$refs.input.focus();
  }

  beforeDestroy() {
    document.removeEventListener('keydown', this.onKeyDown, true);
  }
}
</script>
