import { Getters, Mutations, Actions, module } from 'sinai';
import i18n, { Locale, loadLocale, defaultLocale } from '@/i18n';
import localStorage from '@/lib/local-storage';
import { apiRegistry, UsersApi, MyUser, Space, SpaceUser } from '@/lib/api';
import activeUser from './modules/active-user';
import settingRouter from './modules/setting-router';

interface LoggedInUser extends MyUser{
  token: string;
}

class RootState {
  locale: Locale = defaultLocale;
  titleKey?: string = undefined;
  loggedInUsers: LoggedInUser[] = [];
  fullMainColumn = false;
}

class RootGetters extends Getters<RootState>() {
  get title() {
    if (!this.state.titleKey) {
      return '';
    }
    return i18n.t(this.state.titleKey).toString();
  }

  get documentTitle() {
    const title = this.title;
    return (title === '' ? '' : `${title} - `) + process.env.VUE_APP_TITLE;
  }
}

class RootMutations extends Mutations<RootState>() {
  setLocale(locale: Locale) {
    this.state.locale = locale;
    localStorage.locale = locale;
  }

  setTitleKey(titleKey: string) {
    this.state.titleKey = titleKey;
  }

  addLoggedInUser(user: MyUser, token: string, saveToken = true) {
    if (!this.state.loggedInUsers.find((u) => u.id === user.id)) {
      const loggedInUser: LoggedInUser = Object.assign(user, { token });
      this.state.loggedInUsers.push(loggedInUser);
    }
    if (saveToken) {
      const tokens = localStorage.tokens;
      if (!tokens.includes(token)) {
        tokens.push(token);
        localStorage.tokens = tokens;
      }
    }
  }

  removeLoggedInUser(userId: number, saveToken = true) {
    const index = this.state.loggedInUsers.findIndex((u) => u.id === userId);
    if (index >= 0) {
      const user = this.state.loggedInUsers[index];
      this.state.loggedInUsers.splice(index, 1);
      if (saveToken) {
        const tokens = localStorage.tokens;
        const tokenIndex = tokens.indexOf(user.token);
        if (tokenIndex >= 0) {
          tokens.splice(tokenIndex, 1);
          localStorage.tokens = tokens;
        }
      }
      apiRegistry.release(user.token);
    }
  }

  setFullMainColumn(v: boolean) {
    this.state.fullMainColumn = v;
  }

  editSpace(space: Space) {
    this.state.loggedInUsers.forEach((u) => {
      if (u.space.id === space.id) {
        u.space = Object.assign({}, space);
      }
    });
  }

  editMyUser(user: MyUser) {
    const index = this.state.loggedInUsers.findIndex((u) => u.id === user.id);
    const loggedInUser: LoggedInUser = Object.assign({}, user, { token: this.state.loggedInUsers[index].token });
    this.state.loggedInUsers.splice(index, 1, loggedInUser);
  }
}

class RootActions extends Actions<RootState, RootGetters, RootMutations>() {
  async initLocale() {
    this.mutations.setLocale(await loadLocale(localStorage.locale || defaultLocale));
  }

  async setLocale(locale: Locale) {
    this.mutations.setLocale(await loadLocale(locale));
  }

  async initLoggedInUsers() {
    await Promise.all(localStorage.tokens.map((t) => {
      return this.addLoggedInUsers(t, false)
        .catch((err) => {
          console.error(err);
        });
    }));
  }

  async addLoggedInUsers(token: string, saveToken = true) {
    const user = await apiRegistry.load(UsersApi, token).usersMeGet();
    this.mutations.addLoggedInUser(user, token, saveToken);
    return user;
  }
}

const root = module({
  state: RootState,
  getters: RootGetters,
  mutations: RootMutations,
  actions: RootActions,
}).child('activeUser', activeUser)
  .child('settingRouter', settingRouter);

export default root;
