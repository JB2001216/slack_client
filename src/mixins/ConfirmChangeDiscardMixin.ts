import { Component, Vue, Watch } from 'vue-property-decorator';
import { Route, NavigationGuard } from 'vue-router';

Component.registerHooks([
  'beforeRouteUpdate',
  'beforeRouteLeave',
]);
@Component
export default class ConfirmChangeDiscardMixin extends Vue {

  nextRouteForConfirmChangeDiscard: Route | null = null;
  forceForConfirmChangeDiscard = false;

  get changes(): boolean {
    console.warn('"changes" not implemented');
    return false;
  }

  onInitForConfirmChangeDiscard() {
    this.nextRouteForConfirmChangeDiscard = null;
    this.forceForConfirmChangeDiscard = false;
  }

  onAnswerForConfirmChangeDiscard(answer: 'yes' | 'no') {
    const nextRoute = this.nextRouteForConfirmChangeDiscard;
    if (!nextRoute) return;
    if (answer === 'yes') {
      this.forceForConfirmChangeDiscard = true;
      this.nextRouteForConfirmChangeDiscard = null;
      this.$router.push(nextRoute);
    } else {
      this.onInitForConfirmChangeDiscard();
    }
  }

  beforeRouteLeave(to: Route, from: Route, next: Parameters<NavigationGuard>[2]) {
    if (this.forceForConfirmChangeDiscard) {
      next();
    } else if (this.nextRouteForConfirmChangeDiscard) {
      next(false);
    } else if (this.changes) {
      next(false);
      this.nextRouteForConfirmChangeDiscard = to;
    } else {
      next();
    }
  }

  beforeRouteUpdate(to: Route, from: Route, next: Parameters<NavigationGuard>[2]) {
    if (this.forceForConfirmChangeDiscard) {
      next();
    } else if (this.nextRouteForConfirmChangeDiscard) {
      next(false);
    } else if (to.name === from.name && this.changes) {
      next(false);
      this.nextRouteForConfirmChangeDiscard = to;
    } else {
      next();
    }
  }

  @Watch('$route')
  onRouteChangeForConfirmChangeDiscard() {
    this.onInitForConfirmChangeDiscard();
  }

  created() {
    this.onInitForConfirmChangeDiscard();
  }
}
