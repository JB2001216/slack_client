<template>
  <div class="markdownEditor" :class="{hideEditor}">
    <div :class="editorClass" v-if="!hideEditor">
      <textarea ref="textarea" :value="value" @input="onInput" :placeholder="editorPlaceholder" />
    </div>
    <div :class="previewClass" v-html="compiledValue !== '' ? compiledValue : previewPlaceholderHtml" />
  </div>
</template>

<style lang="stylus">
@import '../../node_modules/highlight.js/styles/github.css'
.markdownEditor
  textarea
    width: 100%
    height: 100%
  &_previewPlaceholder
    color: #C4C4C4
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import marked from '@/lib/marked';
import highlight from 'highlight.js';

@Component
export default class MyMarkdownEditor extends Vue {
  $refs!: {
    textarea: HTMLTextAreaElement;
  }

  // props
  @Prop({ type: String, default: null })
  value!: string | null;

  @Prop({ type: String, default: '' })
  editorPlaceholder!: string;

  @Prop({ default: '' })
  editorClass!: {[k: string]: boolean} | string;

  @Prop({ type: String, default: '' })
  previewPlaceholder!: string;

  @Prop({ default: '' })
  previewClass!: {[k: string]: boolean} | string;

  @Prop({ type: Boolean, default: false })
  hideEditor!: boolean;

  // computed
  get compiledValue() {
    var value = marked(this.value || '', {
      langPrefix: '',
      breaks: true,
      highlight(code, lang) {
        return highlight.highlightAuto(code, [lang]).value;
      },
    });
    return value;
  }

  get previewPlaceholderHtml() {
    if (!this.previewPlaceholder || this.previewPlaceholder === '') {
      return '';
    }
    return `<span class="markdownEditor_previewPlaceholder">${this.previewPlaceholder}</span>`;
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
