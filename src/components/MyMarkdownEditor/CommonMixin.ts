import { Component, Vue, Prop } from 'vue-property-decorator';
import { LoggedInUser } from '@/store/root';

@Component
export default class CommonMixin extends Vue {
  $refs!: {
    preview: HTMLDivElement;
    textarea: HTMLTextAreaElement;
    noteLinkList: HTMLDivElement;
    noteLinkListContent: HTMLDivElement;
    noteLinkListItems: Vue[];
  }

  @Prop({ default: null })
  myUser!: LoggedInUser | null;

  @Prop({ default: null })
  projectId!: number | null;

  markdown: string = '';
}
