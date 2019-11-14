import { Component, Vue, Watch } from 'vue-property-decorator';
import { Route, NavigationGuard } from 'vue-router';
import { NextFunction as SettingRouterNextFunction, BeforeLeaveListener as BeforeSettingRouterLeaveListener } from '@/store/modules/setting-router';

class SettingRoute {
  constructor(private _name: string | null) { }
  get name() { return this._name; }
}

@Component
export default class ConfirmChangeDiscardForSettingMixin extends Vue {

  nextRouteForConfirmChangeDiscard: SettingRoute | null = null;
  forceForConfirmChangeDiscard = false;
  symbolForConfirmChangeDiscard = Symbol('ConfirmChangeDiscardForSettingMixin');

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
      this.$store.actions.settingRouter.to(nextRoute.name);
    } else {
      this.onInitForConfirmChangeDiscard();
    }
  }

  onBeforeSettingRouteLeaveForConfirmChangeDiscard(
    to: Parameters<BeforeSettingRouterLeaveListener>[0],
    from: Parameters<BeforeSettingRouterLeaveListener>[1],
    next: SettingRouterNextFunction
  ) {
    if (this.forceForConfirmChangeDiscard) {
      next();
      this.onInitForConfirmChangeDiscard();
    } else if (this.nextRouteForConfirmChangeDiscard) {
      next(false);
    } else if (this.changes) {
      next(false);
      this.nextRouteForConfirmChangeDiscard = new SettingRoute(to.name);
    } else {
      next();
    }
  }

  @Watch('$route')
  onRouteChangeForConfirmChangeDiscard() {
    this.onInitForConfirmChangeDiscard();
  }

  created() {
    this.$store.mutations.settingRouter.addBeforeLeaveListener(this.symbolForConfirmChangeDiscard, this.onBeforeSettingRouteLeaveForConfirmChangeDiscard);
    this.onInitForConfirmChangeDiscard();
  }
}
