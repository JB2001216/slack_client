import { Component, Prop, Mixins } from 'vue-property-decorator';
import { StateChanger } from 'vue-infinite-loading';
import CommonMixin from './CommonMixin';
import { apiRegistry, NotesApi, NoteSummary } from '@/lib/api';
import { escapeHtml } from '@/lib/utils/string-util';

const tagInMarkdownMatcher = /:((\\:|[^:\r\n])*):/;
const inputtingTagInMarkdownMatcher = /:((\\:|[^:\r\n])*)/;
const tagInValueMatcher = /\[\[note:(\d+)\]([^\]\n\r]+)\]/;
const subjectRawToSubjectMarkdown = (subjectRaw: string) => subjectRaw.replace(/:/g, '\\:');
const subjectMarkdownToSubjectRaw = (subjectMd: string) => subjectMd.replace(/\\:/g, ':');
const listMarginHorizontal = -10;
const listMarginVertical = 10;


@Component
export default class NoteLinkMixin extends Mixins(CommonMixin) {
  @Prop({ type: Boolean, default: false })
  enabledNoteLink!: boolean;

  notesForNoteLink: NoteSummary[] = [];
  noteLinkListFilteredNotes: NoteSummary[] = [];
  noteLinkListFilterPage = 1;
  noteLinkListFilterSubject = '';
  noteLinkListStartTagPos = -1;
  noteLinkListSelectedIndex = 0;
  noteLinkListInfiniteId = +new Date();
  noteLinkListNextSearchTimerId: NodeJS.Timeout | null = null;

  get noteLinkListSelecting() {
    return this.noteLinkListStartTagPos >= 0;
  }

  get noteLinkListShowed() {
    return this.noteLinkListFilteredNotes.length > 0;
  }

  get enabledNoteLinkWithConditions(): boolean {
    return this.enabledNoteLink && !!this.myUser && !!this.projectId;
  }

  // onPreviewClick
  onPreviewClickForNoteLink(ev: Event) {
    if (!ev.target) return;

    const el = ev.target as HTMLElement;
    if (el.tagName === 'A' && el.getAttribute('data-type') === 'noteLink' && el.getAttribute('data-id')) {
      ev.preventDefault();
      const id = parseInt(el.getAttribute('data-id')!);
      const note = this.notesForNoteLink.find((n) => n.id === id);
      if (note) {
        this.$emit('note-link-click', note);
      }
    }
  }

  // compileHtml
  compileHtmlForNoteLink(markdown: string): string {
    if (!this.enabledNoteLinkWithConditions) return markdown;
    const html = markdown.replace(new RegExp(tagInMarkdownMatcher, 'g'), (match, subjectMd) => {
      const subject = subjectMarkdownToSubjectRaw(subjectMd);
      const note = this.notesForNoteLink.find((n) => n.subject === subject);
      if (!note) return match;
      return `<a href="#" data-type="noteLink" data-id="${note.id}">${escapeHtml(note.subject)}</a>`;
    });
    return html;
  }

  // compileValue
  async compileValueForNoteLink(markdown: string): Promise<string> {
    if (!this.enabledNoteLinkWithConditions) return markdown;

    markdown = markdown.replace(new RegExp(tagInMarkdownMatcher, 'g'), (match, subjectMd) => {
      const subject = subjectMarkdownToSubjectRaw(subjectMd);
      const note = this.notesForNoteLink.find((n) => n.subject === subject);
      if (!note) return match;
      return `[[note:${note.id}]${encodeURI(subject)}]`;
    });
    return markdown;
  }

  // compileMarkdown
  async compileMarkdownForNoteLink(value: string): Promise<string> {
    if (!this.enabledNoteLinkWithConditions) return value;

    const matches = value.match(new RegExp(tagInValueMatcher, 'g'));
    if (!matches) return value;

    // cache notes
    const notUniqueIds = matches.map((m) => parseInt(m.match(tagInValueMatcher)![1]));
    const ids = [...new Set(notUniqueIds)];
    const noteApi = apiRegistry.load(NotesApi, this.myUser!.token);
    const notes = (await noteApi.notesSummariesGet({
      spaceId: this.myUser!.space.id,
      projectId: this.projectId!,
      id: ids,
      limit: 500,
    })).results;

    // id to subject
    value = value.replace(new RegExp(tagInValueMatcher, 'g'), (match, g1, encodedSubject) => {
      const id = parseInt(g1);
      const note = notes.find((note) => note.id === id);
      const subject = note ? note.subject : decodeURI(encodedSubject);
      return `:${subjectRawToSubjectMarkdown(subject)}:`;
    });

    this.notesForNoteLink = notes;
    return value;
  }

  // onEditorBlur
  onEditorBlurForNoteLink(ev: Event) {
    if (!this.enabledNoteLinkWithConditions) return;
    this.onNoteLinkListHide();
  }

  // onTextareaClick
  onTextareaClickForNoteLink(ev: MouseEvent) {
    if (!this.enabledNoteLinkWithConditions) return;
    this.onNoteLinkListHide();
  }

  // onTextareaScroll
  onTextareaScrollForNoteLink(ev: Event) {
    if (!this.enabledNoteLinkWithConditions) return;
    this.onNoteLinkListHide();
  }

  // onTextareaInput
  async onTextareaInputForNoteLink() {
    if (!this.enabledNoteLinkWithConditions) return;

    this.onNoteLinkListHide();

    // get rowText
    const markdown = this.$refs.textarea.value;
    const curPos = this.$refs.textarea.selectionStart;
    let rowTailPos = markdown.indexOf('\n', curPos);
    rowTailPos = rowTailPos < 0 ? (markdown.length - 1) : (rowTailPos - 1);
    let rowHeadPos = markdown.lastIndexOf('\n', rowTailPos);
    rowHeadPos = rowHeadPos < 0 ? 0 : (rowHeadPos + 1);
    if (rowHeadPos > rowTailPos || rowHeadPos < 0 || rowTailPos < 0) {
      return;
    }
    const rowFromHeadToCurText = markdown.substring(rowHeadPos, curPos);
    const rowText = markdown.substring(rowHeadPos, rowTailPos + 1);

    // get startIndex in rowText
    let deletedLength = 0;
    const tempIndex = rowFromHeadToCurText.replace(new RegExp(tagInMarkdownMatcher, 'g'), (match) => {
      deletedLength += match.length;
      return '';
    }).search(new RegExp(inputtingTagInMarkdownMatcher, 'g'));
    if (tempIndex < 0) {
      return;
    }
    const startIndex = tempIndex + deletedLength;

    // get filterSubject
    let filterSubject = rowText.substring(startIndex).match(inputtingTagInMarkdownMatcher)![1];
    this.noteLinkListFilterSubject = subjectMarkdownToSubjectRaw(filterSubject);

    // set list position
    this.noteLinkListStartTagPos = rowHeadPos + startIndex;
    this.setNoteLinkListPosition();

    // get filteredNotes
    if (this.noteLinkListNextSearchTimerId) {
      clearTimeout(this.noteLinkListNextSearchTimerId);
    }
    this.noteLinkListNextSearchTimerId = setTimeout(() => {
      this.noteLinkListFilterPage = 1;
      this.noteLinkListInfiniteId = +new Date();
    }, 500);
  }

  // onTextareaKeyDown
  onTextareaKeyDownForNoteLink(ev: KeyboardEvent) {
    if (!this.enabledNoteLinkWithConditions) return;

    // keyboard operating
    if (this.noteLinkListSelecting) {
      switch (ev.key) {
        case 'ArrowLeft':
        case 'ArrowRight':
          this.onNoteLinkListHide();
          break;
        case 'ArrowUp':
          this.onNoteLinkListUp();
          ev.preventDefault();
          break;
        case 'ArrowDown':
          this.onNoteLinkListDown();
          ev.preventDefault();
          break;
        case 'Enter':
          this.onNoteLinkListEnter();
          ev.preventDefault();
          break;
        case 'Escape':
          this.onNoteLinkListHide();
          ev.preventDefault();
      }
    }
  }

  async onNoteLinkListInfinite($state: StateChanger) {
    if (!this.enabledNoteLinkWithConditions) return;

    try {
      if (this.$refs.noteLinkListContent) {
        this.$refs.noteLinkListContent.scrollTop = 0;
      }

      const filterSubject = this.noteLinkListFilterSubject;
      const page = this.noteLinkListFilterPage;
      const noteApi = apiRegistry.load(NotesApi, this.myUser!.token);
      const res = await noteApi.notesSummariesGet({
        spaceId: this.myUser!.space.id,
        projectId: this.projectId!,
        subject: filterSubject === '' ? undefined : filterSubject,
        page,
        limit: 10,
      });

      const addNotes = res.results.filter((r) => !this.noteLinkListFilteredNotes.find((n) => n.id === r.id));
      if (addNotes.length) {
        this.noteLinkListFilteredNotes.push(...addNotes);
      }

      if (res.next) {
        this.noteLinkListFilterPage += 1;
        $state.loaded();
      } else {
        $state.complete();
      }

    } catch (err) {
      this.$appEmit('error', { err });
    }
  }

  onNoteLinkListHide() {
    this.noteLinkListFilteredNotes = [];
    this.noteLinkListSelectedIndex = 0;
    this.noteLinkListStartTagPos = -1;
  }

  setNoteLinkListPosition() {
    // Calculates the offset X, Y of the list
    const startTagPos = this.noteLinkListStartTagPos;

    // gets rows and cols
    const markdown = this.$refs.textarea.value.substring(0, startTagPos + 1);
    const row = markdown.split('\n').length;
    let colTextStartIndex = markdown.lastIndexOf('\n');
    colTextStartIndex = colTextStartIndex < 0 ? 0 : colTextStartIndex + 1;
    const colText = markdown.substring(colTextStartIndex);

    // create canvas to measure the width of text
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    // get style of textarea
    const style = window.getComputedStyle(this.$refs.textarea);
    context.font = style.font!;

    // calculates the X of caret
    let offsetX = 0;
    if (style.paddingLeft) {
      offsetX = parseFloat(style.paddingLeft.substring(0, style.paddingLeft.length - 2));
    }
    offsetX = offsetX + Math.ceil(context.measureText(colText).width);
    offsetX = offsetX - this.$refs.textarea.scrollLeft;

    // Calculates the Y of the caret
    let lineHeight = 0;
    if (style.lineHeight) {
      if (style.lineHeight.match(/px$/)) {
        lineHeight = parseInt(style.lineHeight.substring(0, style.lineHeight.length - 2));
      } else {
        lineHeight = Math.floor(parseFloat(style.fontSize!.substring(0, style.fontSize!.length - 2)) * parseFloat(style.lineHeight));
      }
    }
    // lineHeight * line number
    let offsetY = lineHeight * row;
    if (style.paddingTop) {
      offsetY = offsetY + parseFloat(style.paddingTop.substring(0, style.paddingTop.length - 2));
    }
    offsetY = offsetY - this.$refs.textarea.scrollTop;

    // Set x,y axis
    const rect = this.$refs.textarea.getBoundingClientRect();
    const listStyle = window.getComputedStyle(this.$refs.noteLinkList);
    const listMaxWidth = parseInt(listStyle.maxWidth!.substring(0, listStyle.maxWidth!.length - 2));
    const listMaxHeight = parseInt(listStyle.maxHeight!.substring(0, listStyle.maxHeight!.length - 2));
    // x
    const offsetXFromWindowRect = rect.left + offsetX + listMarginHorizontal;
    if (offsetXFromWindowRect + listMaxWidth < window.innerWidth) {
      this.$refs.noteLinkList.style.left = `${offsetXFromWindowRect}px`;
    } else {
      this.$refs.noteLinkList.style.left = `${window.innerWidth - listMaxWidth - 20}px`;
    }
    // y
    const offsetYFromWindowRect = rect.top + offsetY + listMarginVertical;
    if (offsetYFromWindowRect + listMaxHeight < window.innerHeight) {
      this.$refs.noteLinkList.style.top = `${offsetYFromWindowRect}px`;
      this.$refs.noteLinkList.style.bottom = null;
    } else {
      this.$refs.noteLinkList.style.bottom = `${window.innerHeight - (rect.top + offsetY) + listMarginVertical + lineHeight}px`;
      this.$refs.noteLinkList.style.top = null;
    }
  }

  onNoteLinkListUp() {
    this.onNoteLinkListItemFocus((this.noteLinkListFilteredNotes.length + this.noteLinkListSelectedIndex - 1) % this.noteLinkListFilteredNotes.length);
  }

  onNoteLinkListDown() {
    this.onNoteLinkListItemFocus((this.noteLinkListSelectedIndex + 1) % this.noteLinkListFilteredNotes.length);
  }

  onNoteLinkListEnter() {
    this.onNoteLinkListItemSelected(this.noteLinkListFilteredNotes[this.noteLinkListSelectedIndex]);
  }

  onNoteLinkListItemFocus(i: number) {
    this.noteLinkListSelectedIndex = i;
    this.$refs.noteLinkListItems[i].$el.scrollIntoView({ block: 'nearest' });
  }

  onNoteLinkListItemSelected(note: NoteSummary) {
    // cache the note
    if (!this.notesForNoteLink.find((n) => n.subject === note.subject)) {
      this.notesForNoteLink.push(note);
    }

    // gets rowText, rowStartTagPos
    const markdown = this.$refs.textarea.value;
    const startTagPos = this.noteLinkListStartTagPos;
    let rowTailPos = markdown.indexOf('\n', startTagPos);
    rowTailPos = rowTailPos < 0 ? (markdown.length - 1) : (rowTailPos - 1);
    let rowHeadPos = markdown.lastIndexOf('\n', rowTailPos);
    rowHeadPos = rowHeadPos < 0 ? 0 : (rowHeadPos + 1);
    const rowText = markdown.substring(rowHeadPos, rowTailPos + 1);
    const rowStartTagPos = startTagPos - rowHeadPos;

    // get replaceText
    let replaceText = subjectRawToSubjectMarkdown(note.subject);
    const replacedRowTextWithEndTag =
        rowText.substring(0, rowStartTagPos + 1) +
        rowText.substring(rowStartTagPos).replace(inputtingTagInMarkdownMatcher, replaceText + ':');
    const endTagNeeds = !replacedRowTextWithEndTag
      .replace(new RegExp(tagInMarkdownMatcher, 'g'), '')
      .match(inputtingTagInMarkdownMatcher);
    if (endTagNeeds) {
      replaceText += ':';
    }

    // Insert the subject of the note
    this.markdown =
      markdown.substring(0, startTagPos + 1) +
      markdown.substring(startTagPos).replace(inputtingTagInMarkdownMatcher, replaceText);
    this.onNoteLinkListHide();

    // Set Focus
    const caret = startTagPos + replaceText.length + 1 + (endTagNeeds ? 0 : 1);
    this.$nextTick(() => {
      this.$refs.textarea.focus();
      this.$refs.textarea.setSelectionRange(caret, caret);
    });
  }
}
