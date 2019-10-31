<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="markdownEditor" :class="{hideEditor}">
    <div v-if="!hideEditor" :class="editorClass" @blur="hideList()">
      <textarea
        ref="textarea"
        v-model="input"
        :placeholder="editorPlaceholder"
        @input="onInput($event)"
        @click="hideList()"
        @keydown="onKeyDown($event)"
      />
      <div ref="dropdown" :class="{ dropdown: true, inactive: !isListAllowed }">
        <ul
          class="dropdown-menu"
          role="menu"
          aria-labelledby="dropdownMenu"
        >
          <li
            v-for="(note, i) in allNotes"
            ref="noteList"
            :key="note.id"
            :class="{focused: focusedNote === i}"
            @click="onNoteSelected(note.subject)"
            @mousemove="onSetFocus(i)"
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
  .focused
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
import { Event, BrowserWindow } from 'electron';

@Component
export default class MyMarkdownEditor extends Vue {
  $refs!: {
    textarea: HTMLTextAreaElement;
    dropdown: HTMLDivElement;
    noteList: HTMLLIElement[];
  }

  isListAllowed = false;
  input: string | null = '';
  focusedNote: number = 0;

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
  onInput(event: any) {
    console.log(event);
    this.emitInput(this.$refs.textarea.value);
  }

  emitInput(v: string) {
    this.$emit('input', v);
  }

  onKeyDown(event: KeyboardEvent) {
    console.log(event);
    switch (event.key) {
      case ':':
        this.onShowList();
        break;
      case 'ArrowUp':
        if (this.isListAllowed) {
          this.onUpList(event);
        }
        break;
      case 'ArrowDown':
        if (this.isListAllowed) {
          this.onDownList(event);
        }
        break;
      case 'Enter':
        if (this.isListAllowed) {
          this.onEnterList(event);
        }
        break;
      default:
        this.hideList();
    }
  }

  onShowList() {
    this.setListPosition();
    // shows list
    this.isListAllowed = true;
    // focus the first item
    this.focusedNote = 0;
  }

  setListPosition() {
    // Calculates the offset X, Y of the list
    // current caret position from start
    var offset = this.$refs.textarea.selectionStart;
    if (this.input === null) {
      return;
    }

    // gets rows and cols
    let row = this.input.substring(0, offset).split('\n').length + 1;
    let lastIndex = this.input.substring(0, offset).lastIndexOf('\n');
    // text from line start to caret
    let rowText = this.input.substring(lastIndex, offset);
    // text block from start to caret in lines
    let colText = this.input.substring(0, lastIndex);

    // create canvas to measure the width of text
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    if (context === null) {
      return;
    }
    // get style of textarea
    let style = window.getComputedStyle(this.$refs.textarea);
    context.font = style.font!;

    // calculates the X of caret
    let offsetX = 0;
    if (style.paddingLeft) {
      offsetX = parseInt(style.paddingLeft.substring(0, style.paddingLeft.length - 2));
    }
    // offset in the textarea
    offsetX = offsetX + Math.ceil(context.measureText(rowText).width);
    // adds the textarea left offset
    offsetX = offsetX + this.$refs.textarea.offsetLeft;
    // move the list to left 10px
    offsetX = offsetX - 10;

    // Calculates the Y of the caret
    let offsetY = 0;
    if (style.fontSize) {
      offsetY = parseInt(style.fontSize.substring(0, style.fontSize.length - 2));
    }
    // fontSize * line number
    offsetY = offsetY * row;
    // adds the textarea top offset
    offsetY = offsetY + this.$refs.textarea.offsetTop;
    // display the list above the line
    let height = window.getComputedStyle(this.$refs.dropdown).height;
    if (height !== null) {
      offsetY = offsetY - parseInt(height.substr(0, height.length - 2));
    }

    // apply styles
    this.$refs.dropdown.style.left = offsetX.toString() + 'px';
    this.$refs.dropdown.style.top = offsetY.toString() + 'px';
  }

  hideList() {
    this.isListAllowed = false;
  }

  onNoteSelected(subject: string) {
    this.hideList();

    // Apply changes to the value
    var offset = this.$refs.textarea.selectionStart;
    let newValue = '';
    if (this.input !== null) {
      newValue = this.input;
    }
    // Insert the subject of the note
    let frontText = newValue.substring(0, offset) + subject + ':';
    let caretPos = frontText.length;
    newValue = frontText + newValue.substring(offset);
    // Save the changes
    this.input = newValue;
    this.emitInput(newValue);
    // Set Focus
    this.$nextTick(() => {
      this.$refs.textarea.focus();
      this.$refs.textarea.setSelectionRange(caretPos, caretPos);
    });
  }

  onUpList(event: KeyboardEvent) {
    event.preventDefault();
    this.onSetFocus((this.allNotes.length + this.focusedNote - 1) % this.allNotes.length);
  }

  onDownList(event: KeyboardEvent) {
    event.preventDefault();
    this.onSetFocus((this.focusedNote + 1) % this.allNotes.length);
  }

  onEnterList(event: KeyboardEvent) {
    event.preventDefault();
    this.onNoteSelected(this.allNotes[this.focusedNote].subject);
  }

  onSetFocus(i: number) {
    this.focusedNote = i;
    this.$refs.noteList[i].scrollIntoView({ block: 'nearest' });
  }
}
</script>
