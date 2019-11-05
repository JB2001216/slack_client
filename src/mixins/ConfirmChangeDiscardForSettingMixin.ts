import { Component, Vue } from 'vue-property-decorator';
import { Route, NavigationGuard } from 'vue-router';
import { NextFunction as SettingRouterNextFunction, BeforeLeaveListener as BeforeSettingRouterLeaveListener } from '@/store/modules/setting-router';

Component.registerHooks([
  'beforeRouteUpdate',
  'beforeRouteLeave',
]);
@Component
export default class ConfirmChangeDiscardForSettingMixin extends Vue {

  nextForConfirmChangeDiscard: Parameters<NavigationGuard>[2] | SettingRouterNextFunction | null = null;

  symbolForConfirmChangeDiscard = Symbol('ConfirmChangeDiscardForSettingMixin');

  get changes(): boolean {
    console.warn('"changes" not implemented');
    return false;
  }

  onBeforeSettingRouteLeave(to: Parameters<BeforeSettingRouterLeaveListener>[0], from: Parameters<BeforeSettingRouterLeaveListener>[1], next: SettingRouterNextFunction) {
    if (this.nextForConfirmChangeDiscard) {
      next(false);
    } else if (this.changes) {
      this.nextForConfirmChangeDiscard = next;
    } else {
      next();
    }
  }

  onInitForConfirmChangeDiscardDialog() {
    this.nextForConfirmChangeDiscard = null;
    this.$store.mutations.settingRouter.addBeforeLeaveListener(this.symbolForConfirmChangeDiscard, this.onBeforeSettingRouteLeave);
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
    this.onInitForConfirmChangeDiscardDialog();
    next();
  }

  beforeMount() {
    this.onInitForConfirmChangeDiscardDialog();
  }
}
