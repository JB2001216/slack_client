<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="markdownEditor" :class="{hideEditor}">
    <div v-if="!hideEditor" :class="editorClass">
      <textarea ref="textarea" :value="value" :placeholder="editorPlaceholder" @input="onInput" />
    </div>
    <div class="markdownEditor_preview" :class="previewClass" v-html="compiledValue !== '' ? compiledValue : previewPlaceholderHtml" />
  </div>
</template>

<style lang="stylus">
@import '../../node_modules/highlight.js/styles/github.css'
@import '../stylus/_fixed/base/_variable'

.markdownEditor
  textarea
    width: 100%
    height: 100%
  &_preview
    &_placeholder
      color: $colors.lightGray
    pre
      white-space: pre-wrap !important
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import marked from '@/lib/marked';
import highlight from 'highlight.js';
import sanitizeHtml from 'sanitize-html';

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
    const value = marked(
      sanitizeHtml(this.value || '', {
        allowedTags: [],
        allowedAttributes: {},
      }),
      {
        langPrefix: '',
        breaks: true,
        highlight(code, lang) {
          return highlight.highlightAuto(code, [lang]).value;
        },
      }
    );
    return sanitizeHtml(value, {
      allowedTags: [
        'em', 'strong', 'strike',
        'p', 'a', 'div', 'span', 'blockquote', 'pre', 'code',
        'ul', 'ol', 'li', 'nl', 'dl', 'dt', 'dd',
        'br', 'hr',
        'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td',
      ],
      allowedAttributes: {
        '*': ['class'],
        a: ['href', 'name', 'target'],
        img: ['src'],
      },
    });
  }

  get previewPlaceholderHtml() {
    if (!this.previewPlaceholder || this.previewPlaceholder === '') {
      return '';
    }
    return `<span class="markdownEditor_preview_placeholder">${this.previewPlaceholder}</span>`;
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
