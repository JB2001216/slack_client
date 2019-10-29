<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="markdownEditor" :class="{hideEditor}">
    <div v-if="!hideEditor" :class="editorClass">
      <textarea
        ref="textarea"
        v-model="input"
        :placeholder="editorPlaceholder"
        @input="onInput"
        @keypress.shift.58="showList"
      />
      <div v-if="isListAllowed" class="dropdown">
        <ul
          id="dropdown"
          class="dropdown-menu"
          role="menu"
          aria-labelledby="dropdownMenu"
        >
          <li
            v-for="note in allNotes"
            :key="note.id"
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
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import marked from '@/lib/marked';
import highlight from 'highlight.js';
import sanitizeHtml from 'sanitize-html';
import * as api from '@/lib/api';

@Component
export default class MyMarkdownEditor extends Vue {
  $refs!: {
    textarea: HTMLTextAreaElement;
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

  showList() {
    this.isListAllowed = true;
    var offset = this.$refs.textarea.selectionStart;
    console.log(offset);
    // var offset = sel.anch;

    // //Get the text before and after the caret
    // var firsttext = this.$refs.textarea.innerHTML.substr(0,sel.baseOffset);
    // var nexttext = (sel.baseOffset != this.$refs.textarea.length ) ?this.$refs.textarea..innerHTML.substr( sel.baseOffset, this.$refs.textarea.length) : "";

    // //Add in @ + dummy, because @ is not in there yet on keydown
    // this.$refs.textarea..innerHTML = firsttext + subject + nexttext;
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
