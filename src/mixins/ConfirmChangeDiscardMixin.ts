import { Component, Vue } from 'vue-property-decorator';
import { Route, NavigationGuard } from 'vue-router';

Component.registerHooks([
  'beforeRouteUpdate',
  'beforeRouteLeave',
]);
@Component
export default class ConfirmChangeDiscardMixin extends Vue {

  nextForConfirmChangeDiscard: Parameters<NavigationGuard>[2] | null = null;

  get changes(): boolean {
    console.warn('"changes" not implemented');
    return false;
  }

  onInitForConfirmChangeDiscardDialog() {
    this.nextForConfirmChangeDiscard = null;
  }

  onAnswerForConfirmChangeDiscardDialog(answer: 'yes' | 'no') {
    if (!this.nextForConfirmChangeDiscard) return;
    this.nextForConfirmChangeDiscard(answer === 'yes' ? undefined : false);
    this.nextForConfirmChangeDiscard = null;
  }

  beforeRouteLeave(to: Route, from: Route, next: Parameters<NavigationGuard>[2]) {
    if (this.nextForConfirmChangeDiscard) {
      next(false);
    } else if (this.changes) {
      this.nextForConfirmChangeDiscard = next;
    } else {
      next();
    }
  }

  beforeRouteUpdate(to: Route, from: Route, next: Parameters<NavigationGuard>[2]) {
    if (this.nextForConfirmChangeDiscard) {
      next(false);
    } else if (to.name === from.name && this.changes) {
      this.nextForConfirmChangeDiscard = next;
    } else {
      this.onInitForConfirmChangeDiscardDialog();
      next();
    }
  }

  beforeMount() {
    this.onInitForConfirmChangeDiscardDialog();
  }
}
