<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="markdownEditor" :class="{hideEditor}">
    <div v-if="!hideEditor" class="markdownEditor_editor" :class="editorClass" @blur="onEditorBlur">
      <textarea
        ref="textarea"
        v-model="markdown"
        :placeholder="editorPlaceholder"
        :disabled="compiling"
        @input="onTextareaInput"
        @click="onTextareaClick"
        @keydown="onTextareaKeyDown"
        @scroll="onTextareaScroll"
        @change="onTextareaChange"
      />
      <div
        v-if="enabledNoteLinkWithConditions"
        v-show="noteLinkListSelecting"
        ref="noteLinkList"
        class="markdownEditor_editor_noteLinkList"
        :class="{hide: !noteLinkListShowed}"
      >
        <div ref="noteLinkListContent" class="markdownEditor_editor_noteLinkList_content">
          <my-space-user
            v-for="(note, i) in noteLinkListFilteredNotes"
            :key="note.id"
            ref="noteLinkListItems"
            v-slot="{user}"
            tag="div"
            :user-id="null"
            class="markdownEditor_editor_noteLinkList_item"
            :class="{focused: noteLinkListSelectedIndex === i}"
            @click="onNoteLinkListItemSelected(note)"
            @mousemove="onNoteLinkListItemFocus(i)"
          >
            <my-space-user-avatar class="markdownEditor_editor_noteLinkList_item_avatar" :user="user" :size="32" shape="circle" />
            <div class="markdownEditor_editor_noteLinkList_item_info">
              <span class="markdownEditor_editor_noteLinkList_item_info_subject">{{ note.subject }}</span>
              <span class="markdownEditor_editor_noteLinkList_item_info_updatedAt">{{ $t('components.myMarkdownEditor.noteLink.lastUpdated') }}：{{ note.updatedAt | dateFormat('YYYY/M/D') }}</span>
            </div>
          </my-space-user>
          <infinite-loading :identifier="noteLinkListInfiniteId" @infinite="onNoteLinkListInfinite" />
        </div>
        <div class="markdownEditor_editor_noteLinkList_footer">
          <span>↑↓：{{ $t('components.myMarkdownEditor.noteLink.move') }}</span>
          <span>↵：{{ $t('components.myMarkdownEditor.noteLink.enter') }}</span>
          <span>esc：{{ $t('components.myMarkdownEditor.noteLink.cancel') }}</span>
        </div>
      </div>
    </div>

    <div
      ref="preview"
      class="markdownEditor_preview markdownPreview"
      :class="previewClass"
      @click="onPreviewClick"
      v-html="previewHtml !== '' ? previewHtml : previewPlaceholderHtml"
    />
  </div>
</template>

<style lang="stylus">
@import '../../../node_modules/highlight.js/styles/github.css'
@import '../../stylus/_settings'

.markdownEditor
  &_preview
    &_placeholder
      color: $colors.lightGray
    pre
      white-space: pre-wrap !important
  &_editor
    textarea
      width: 100%
      height: 100%
      line-height: 1.3
      overflow-y: scroll
    &_noteLinkList
      box-sizing: border-box
      position: fixed
      width: 300px
      max-width: 300px
      max-height: 300px
      padding-top: 8px
      background: $colors.white
      border-radius: 8px
      box-shadow: 0 2px 8px 0 rgba(0,0,0,0.16)
      overflow: hidden
      user-select: none
      z-index: 10
      *
        box-sizing: border-box
      &.hide
        opacity: 0
        pointer-events: none
      &_content
        overflow-y: scroll
        max-height: 300px - 40px - 8px
        margin-bottom: 40px
      &_footer
        font-size: 11px
        display: flex
        justify-content: space-evenly
        align-items: center
        background: $colors.white
        color: $colors.grayLighten2
        box-shadow: 0 2px 8px 0 rgba(0,0,0,0.16)
        position: absolute
        height: 40px
        bottom: 0
        left: 0
        right: 0
        z-index: 1
      &_item
        padding: 12px
        display: flex
        align-items: center
        justify-content: space-around
        cursor: pointer
        &_info
          width: calc(100% - 50px)
          &_subject
            font-size: 14px
            color: $colors.primaryBlack
            overflow: hidden
            white-space: nowrap
            text-overflow: ellipsis
            display: block
          &_updatedAt
            font-size: 11px
            color: $colors.grayLighten2
            display: block
        &.focused
          background: $themeColors.accent
          .markdownEditor_editor_noteLinkList_item_info
            &_subject
              color: $colors.white
            &_updatedAt
              color: $colors.white
</style>

<script lang="ts">
import { Component, Prop, Watch, Mixins } from 'vue-property-decorator';
import CommonMixin from './CommonMixin';
import NoteLinkMixin from './NoteLinkMixin';
import marked from '@/lib/marked';
import highlight from 'highlight.js';
import sanitizeHtml from 'sanitize-html';

@Component
export default class MyMarkdownEditor extends Mixins(CommonMixin, NoteLinkMixin) {

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

  beforeCompiledValue: this['value'] = null;
  compilingValue = false;
  compilingMarkdown = false;

  get compiling() {
    return this.compilingValue || this.compilingMarkdown;
  }

  get previewHtml() {
    let html = marked(
      sanitizeHtml(this.markdown || '', {
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

    html = this.compileHtmlForNoteLink(html);

    return sanitizeHtml(html, {
      allowedTags: [
        'em', 'strong', 'strike',
        'p', 'a', 'div', 'span', 'blockquote', 'pre', 'code',
        'ul', 'ol', 'li', 'nl', 'dl', 'dt', 'dd',
        'br', 'hr',
        'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      ],
      allowedAttributes: {
        '*': ['class'],
        a: ['href', 'target', 'name', 'data-type', 'data-id'],
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

  // compile value from textareaValue
  async compileValue() {
    if (this.compilingValue) return;
    try {
      this.compilingValue = true;
      let v = this.markdown;
      v = await this.compileValueForNoteLink(v);
      this.emitInput(v, true);
    } finally {
      this.compilingValue = false;
    }
  }

  // compile textareaValue from value
  async compileMarkdown() {
    if (this.compilingMarkdown) return;
    try {
      this.compilingMarkdown = true;
      let v = this.value || '';
      v = await this.compileMarkdownForNoteLink(v);
      this.markdown = v;
    } finally {
      this.compilingMarkdown = false;
    }
  }

  async onTextareaInput() {
    await this.onTextareaInputForNoteLink();
  }

  onTextareaKeyDown(ev: KeyboardEvent) {
    this.onTextareaKeyDownForNoteLink(ev);
  }

  onTextareaClick(ev: MouseEvent) {
    this.onTextareaClickForNoteLink(ev);
  }

  onTextareaScroll(ev: Event) {
    this.onTextareaScrollForNoteLink(ev);
  }

  onTextareaChange(ev: Event) {
    this.$emit('change', ev);
  }

  onEditorBlur(ev: Event) {
    this.onEditorBlurForNoteLink(ev);
  }

  onPreviewClick(ev: Event) {
    this.onPreviewClickForNoteLink(ev);
  }

  emitInput(v: string, compiled = false) {
    if (compiled) {
      this.beforeCompiledValue = v;
    }
    this.$emit('input', v);
  }

  beforeMount() {
    this.compileMarkdown();
  }

  @Watch('value')
  onValueChange(newVal: this['value']) {
    // Exclude when generating value from markdown
    if (this.beforeCompiledValue && this.beforeCompiledValue === newVal) {
      this.beforeCompiledValue = null;
      return;
    }
    this.compileMarkdown();
  }
}
</script>
