import Vue from 'vue';
import { appEventBus } from '@/plugins/app-event';

export function subscribeSyncEvents(store: Vue['$store']) {
  appEventBus.on('my-user-edited', (ev) => {
    store.mutations.editMyUser(ev.myUser);
    store.mutations.activeUser.editMyUser(ev.myUser);
    const from = ev.myUser;
    const su = store.state.activeUser.spaceUsers.find((su) => su.id === from.id);
    if (su) {
      const newSu = Object.assign({}, su, {
        account: from.account,
        displayName: from.displayName,
        email: from.email,
        spaceRoleId: from.spaceRoleId,
        avatarUrl: from.avatarUrl,
        avatarSmallUrl: from.avatarSmallUrl,
      });
      store.mutations.activeUser.editSpaceUser(newSu);
    }
  });

  appEventBus.on('space-user-edited', (ev) => {
    store.mutations.activeUser.editSpaceUser(ev.spaceUser);
    const from = ev.spaceUser;
    const myUser = store.state.loggedInUsers.find((u) => u.id === from.id);
    if (myUser) {
      const newMyUser = Object.assign({}, myUser, {
        account: from.account,
        displayName: from.displayName,
        email: from.email,
        spaceRoleId: from.spaceRoleId,
        avatarUrl: from.avatarUrl,
        avatarSmallUrl: from.avatarSmallUrl,
      });
      store.mutations.editMyUser(newMyUser);
      store.mutations.activeUser.editMyUser(newMyUser);
    }
  });
}
