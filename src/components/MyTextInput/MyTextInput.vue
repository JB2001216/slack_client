<template>
  <div class="columnWrap_right_inputText_container">
    <input
      ref="input"
      :value="value"
      :type="type"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :minlength="minlength"
      :required="required"
      :readonly="readonly"
      @focus="onFocus($event)"
      @blur="onBlur($event)"
      @input="onInput($event)"
      @click="onClick($event)"
    >
    <p
      v-if="message && !active"
      :class="{
        columnWrap_right_inputText_container_blue: message.type === 'success',
        columnWrap_right_inputText_container_red: message.type === 'error',
      }"
    >
      {{ typeof message.text === 'string' ? message.text : message.text[0] }}
    </p>
  </div>
</template>

<style lang="stylus" scoped>
.columnWrap_right_inputText_container
  input[readonly]
    background: #ddd
  p
    z-index 1
    background: #fff
    pointer-events: none
</style>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { MyTextInputMessage } from './types';

@Component
export default class MyTextInput extends Vue {
  $refs!: {
    input: HTMLInputElement;
  }

  @Prop({ type: String, default: '' })
  value!: string;

  @Prop({ type: String, default: 'text' })
  type!: string;

  @Prop({ type: String, default: '' })
  placeholder!: string;

  @Prop({ type: Boolean })
  required?: boolean;

  @Prop({ type: Number })
  maxlength?: number;

  @Prop({ type: Number })
  minlength?: number;

  @Prop({ type: Boolean })
  readonly?: boolean;

  @Prop({ type: Object, default: null })
  message!: MyTextInputMessage;

  active = false;

  onFocus(ev: Event) {
    this.active = true;
    this.$emit('focus', ev);
  }

  onBlur(ev: Event) {
    this.active = false;
    this.$emit('blur', ev);
  }

  onInput(ev: Event) {
    this.$emit('input', (ev.target as HTMLInputElement).value);
  }

  onClick(ev: Event) {
    this.$emit('click', ev);
  }

  @Watch('message')
  async onMessageChange(message: this['message']) {
    if (message && this.active) {
      this.$refs.input.blur();
    }
  }
}
</script>
