<template>
  <div class="markdownEditor">
    <div :class="editorClass" v-if="!hideEditor">
      <textarea ref="textarea" :value="value" @input="onInput" />
    </div>
    <div :class="previewClass" v-html="compiledValue" />
  </div>
</template>

<style lang="stylus" scoped>
@import '../../node_modules/highlight.js/styles/github.css'
.markdownEditor
  textarea
    width: 100%
    height: 100%
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import marked from 'marked';
import highlight from 'highlight.js';

@Component
export default class MyMarkdownEditor extends Vue {
  $refs!: {
    textarea: HTMLTextAreaElement;
  }

  // props
  @Prop({ type: String, default: '' })
  value!: string;

  @Prop({ default: {} })
  editorClass!: {[k: string]: boolean} | string;

  @Prop({ default: {} })
  previewClass!: {[k: string]: boolean} | string;

  @Prop({ type: Boolean, default: false })
  hideEditor!: boolean;

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
