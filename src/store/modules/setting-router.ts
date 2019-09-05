import { Getters, Mutations, Actions, module } from 'sinai';

class SettingRouterState {
  name: string | null = null;
}

class SettingRouterGetters extends Getters<SettingRouterState>() {
}

class SettingRouterMutations extends Mutations<SettingRouterState>() {
  to(name: string) {
    this.state.name = name;
  }
  close() {
    this.state.name = null;
  }
}

class SettingRouterActions extends Actions<SettingRouterState, SettingRouterGetters, SettingRouterMutations>() {
}

const settingRouter = module({
  state: SettingRouterState,
  getters: SettingRouterGetters,
  mutations: SettingRouterMutations,
  actions: SettingRouterActions,
});

export default settingRouter;
