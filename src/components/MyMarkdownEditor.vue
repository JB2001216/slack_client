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
    return marked(this.value || '', {
      langPrefix: '',
      breaks: true,
      highlight(code, lang) {
        return highlight.highlightAuto(code, [lang]).value;
      },
    });
  }

  filterForItalicAndBold(text: string | null) {
    if (text === null) {
      return null;
    }
    // **** several asterisks
    text = text.replace(/\*+\*/g, function(match, group) {
      return '\\*'.repeat(match.length);
    });
    // \*text* -> \*text\*
    text = text.replace(/\\\*([^*\n]+[^\\\n]+)\*/g, function(match, group) {
      return match.replace(/.$/, '\\*');
    });
    // *text\* -> \*text\*
    text = text.replace(/([^\\*\n]+|^)\*([^*\n]+)\\\*/g, function(match, group) {
      return match.replace('*', '\\*'); // affects only the first character
    });
    // *text* -> **text**
    text = text.replace(/\*([^*\n]*[^\\\n])\*/g, function(match, group) {
      return '**' + group + '**';
    });
    // _text_ -> *text*
    text = text.replace(/_([^_\n]+)_/g, function(match, group) {
      return '*' + group + '*';
    });
    return text;
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
