<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="markdownEditor" :class="{hideEditor}">
    <div v-if="!hideEditor" :class="editorClass">
      <textarea
        ref="textarea"
        v-model="input"
        :placeholder="editorPlaceholder"
        @input="onInput"
        @keypress.shift.58="showList($event)"
      />
      <div ref="dropdown" :class="{ dropdown: true, inactive: !isListAllowed }">
        <ul
          class="dropdown-menu"
          role="menu"
          aria-labelledby="dropdownMenu"
        >
          <li
            v-for="note in allNotes"
            :key="note.id"
            class="noteSubject"
            @click="selectNoteLink(note.subject)"
          >
            {{ note.subject }}
          </li>
        </ul>
      </div>
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
  .dropdown
    position: absolute
    top: 0
    left: 0
    overflow: scroll
    height: 200px
    background: white
    border: 1px solid gray
    border-radius: 10px
    overflow-x: hidden
  .inactive
    display: none;
  .noteSubject
    &:hover
      background: gray
  ::-webkit-scrollbar
    background: none
  ::-webkit-scrollbar-thumb
    background: gray
    border-radius: 10px
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import marked from '@/lib/marked';
import highlight from 'highlight.js';
import sanitizeHtml from 'sanitize-html';
import * as api from '@/lib/api';
import { Event } from 'electron';

@Component
export default class MyMarkdownEditor extends Vue {
  $refs!: {
    textarea: HTMLTextAreaElement;
    dropdown: HTMLDivElement;
  }

  isListAllowed = false;
  input: string | null = '';

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

  @Prop({ default: function() { return []; } })
  allNotes!: Array<api.Note>;

  created() {
    this.input = this.value;
  }

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

  showList(event: Event) {
    var offset = this.$refs.textarea.selectionStart;
    if (this.input === null) {
      return;
    }

    let row = this.input.substr(0, offset).split('\n').length + 1;
    let lastIndex = this.input.substr(0, offset).lastIndexOf('\n');
    let rowText = this.input.substr(lastIndex, offset);
    let colText = this.input.substr(0, lastIndex);

    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    if (context === null) {
      return;
    }
    let style = window.getComputedStyle(this.$refs.textarea);
    context.font = style.font!;

    let offsetX = 0;
    if (style.paddingLeft) {
      offsetX = parseInt(style.paddingLeft.substr(0, style.paddingLeft.length - 2));
    }
    offsetX = offsetX + Math.ceil(context.measureText(rowText).width);
    offsetX = offsetX + this.$refs.textarea.offsetLeft;

    let offsetY = 0;
    if (style.fontSize) {
      offsetY = parseInt(style.fontSize.substr(0, style.fontSize.length - 2));
    }
    offsetY = offsetY * row;
    offsetY = offsetY + this.$refs.textarea.offsetTop;

    console.log(offsetX, offsetY);
    this.$refs.dropdown.style.left = offsetX.toString() + 'px';
    this.$refs.dropdown.style.top = offsetY.toString() + 'px';
    this.isListAllowed = true;
  }

  selectNoteLink(subject: string) {
    this.isListAllowed = false;
    var offset = this.$refs.textarea.selectionStart;
    console.log(offset);
    let newValue = this.input;
    if (newValue === null) {
      return;
    }
    newValue = newValue.substring(0, offset) + subject + ':' + newValue.substring(offset);
    this.input = newValue;
    this.emitInput(newValue);
  }

}
</script>
