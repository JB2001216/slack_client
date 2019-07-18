import { BaseAPI } from './openapi';
import { createConfiguration } from './configuration';

interface ClassType<T> {
  new (...args: any[]): T;
}

class ApiRegistry {
  private list: {[token: string]: BaseAPI[]} = {
    '': [],
  };

  release(token: string) {
    if (token === '') { return; }
    delete this.list[token];
  }

  load<T extends BaseAPI>(Cls: ClassType<T>, token = ''): T {
    let instances = this.list[token];
    if (!instances) {
      this.list[token] = instances = [];
    }
    let instance = instances.find((ins) => ins.constructor === Cls);
    if (!instance) {
      instance = new Cls(createConfiguration(token));
      this.list[token].push(instance);
    }
    return <T>instance;
  }
}

export default new ApiRegistry();
