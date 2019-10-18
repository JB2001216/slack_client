<template>
  <input
    ref="input"
    :value="value"
    :type="type"
    :placeholder="placeholder"
    @change="$emit('change', $event)"
    @input="onInput($event)"
  >
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class MyInput extends Vue {
  $refs!: {
    input: HTMLInputElement;
  };

  @Prop({ type: String, default: '' })
  value!: string;

  @Prop({ type: String, default: '' })
  type!: string;

  @Prop({ type: String, default: '' })
  placeholder!: string;

  @Prop({ type: Boolean, default: false })
  autoResize!: boolean;

  onInput(ev: Event) {
    this.resize();
    this.$emit('input', this.$refs.input.value);
  }

  async resize() {
    if (this.autoResize) {
      await this.$nextTick();
      this.$refs.input.style.width = '0';
      this.$refs.input.style.width = `${this.$refs.input.scrollWidth + 4}px`;
    }
  }

  @Watch('value')
  onValueChange() {
    this.resize();
  }

  @Watch('resize')
  onResizeChange() {
    this.resize();
  }

  mounted() {
    this.resize();
  }
}
</script>
