import { Getters, Mutations, Actions, module } from 'sinai';
import { createConfiguration, BaseAPI } from '@/lib/api';

interface ClassType<T> {
  new (...args: any[]): T;
}

class ApiState {
  instanceList: {[token: string]: BaseAPI[]} = {
    '': [],
  };
}

class ApiGetters extends Getters<ApiState>() {
}

class ApiMutations extends Mutations<ApiState>() {
  setInstance(instance: BaseAPI, token = '') {
    const instances = this.state.instanceList[token];
    if (!instances.find((ins) => ins.constructor === instance.constructor)) {
      this.state.instanceList[token].push(instance);
    }
  }

  releaseToken(token: string) {
    if (token === '') { return; }
    delete this.state.instanceList[token];
  }

  setToken(token: string) {
    if (token === '') { return; }
    if (!this.state.instanceList[token]) {
      this.state.instanceList[token] = [];
    }
  }
}

class ApiActions extends Actions<ApiState, ApiGetters, ApiMutations>() {
  async loadApi<T extends BaseAPI>(Cls: ClassType<T>, token = ''): Promise<T> {
    const instances = this.state.instanceList[token];
    let instance = instances.find((ins) => ins.constructor === Cls);
    if (!instance) {
      instance = new Cls(createConfiguration(token));
      this.mutations.setInstance(instance);
    }
    return <T>instance;
  }
}

const api = module({
  state: ApiState,
  getters: ApiGetters,
  mutations: ApiMutations,
  actions: ApiActions,
});

export default api;
