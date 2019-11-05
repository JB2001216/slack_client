import { Getters, Mutations, Actions, module } from 'sinai';

export type SettingRouteName = string | null;
export type NextFunction = (nextto?: false) => void;
type NextTo = Parameters<NextFunction>[0];
export type BeforeLeaveListener = (to: {name: SettingRouteName}, from: {name: SettingRouteName}, next: NextFunction) => void;

async function getNextTo(to: {name: SettingRouteName}, from: {name: SettingRouteName}, beforeLeaveListeners: BeforeLeaveListener[]): Promise<NextTo> {
  const promises = beforeLeaveListeners.map((fn) => new Promise<NextTo>((resolve) => {
    fn(to, from, (nextto: NextTo) => {
      resolve(nextto);
    });
  }));
  const results = await Promise.all(promises);
  if (results.findIndex((r) => r === false) >= 0) {
    return false;
  }
  return undefined;
}


class SettingRouterState {
  name: SettingRouteName = null;
  beforeLeaveListeners: { symbol: Symbol; fn: BeforeLeaveListener }[] = [];
}

class SettingRouterGetters extends Getters<SettingRouterState>() {
}

class SettingRouterMutations extends Mutations<SettingRouterState>() {
  setName(name: SettingRouterState['name']) {
    if (name === this.state.name) return;
    this.state.beforeLeaveListeners = [];
    this.state.name = name;
  }
  addBeforeLeaveListener(symbol: Symbol, fn: BeforeLeaveListener) {
    const index = this.state.beforeLeaveListeners.findIndex((obj) => obj.fn.toString() === fn.toString());
    if (index < 0) {
      this.state.beforeLeaveListeners.push({ symbol, fn });
    } else {
      this.state.beforeLeaveListeners.splice(index, 1, { symbol, fn });
    }
  }
}

class SettingRouterActions extends Actions<SettingRouterState, SettingRouterGetters, SettingRouterMutations>() {
  async to(name: string | null) {
    if (this.state.name === name) return;
    const nextto = await getNextTo({ name }, { name: this.state.name }, this.state.beforeLeaveListeners.map((obj) => obj.fn));
    if (nextto === false) return;
    this.mutations.setName(name);
  }
  async close() {
    await this.to(null);
  }
}

const settingRouter = module({
  state: SettingRouterState,
  getters: SettingRouterGetters,
  mutations: SettingRouterMutations,
  actions: SettingRouterActions,
});

export default settingRouter;
