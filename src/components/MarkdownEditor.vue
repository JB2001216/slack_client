<template>
  <div class="markdownEditor">
    <div id="editor">
      <textarea ref="textarea" :value="value" @input="onInput" />
    </div>
    <div id="preview" v-html="compiledValue" />
  </div>
</template>

<style lang="stylus" scoped>
@import '../../node_modules/highlight.js/styles/github.css'
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import marked from 'marked';
import highlight from 'highlight.js';

@Component
export default class HelloWorld extends Vue {
  $refs!: {
    textarea: HTMLTextAreaElement;
  }

  // props
  @Prop({ type: String, default: '' })
  value!: string;

  // computed
  get compiledValue() {
    return marked(this.value, {
      langPrefix: '',
      highlight(code, lang) {
        return highlight.highlightAuto(code, [lang]).value;
      },
    });
  }

  // methods
  onInput() {
    this.emitInput(this.$refs.textarea.value);
  }

  emitInput(v: string) {
    this.$emit('input', v);
  }
}
</script>
