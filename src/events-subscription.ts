import store from '@/store/index';
import { appEventBus } from '@/plugins/app-event';
import i18n from '@/i18n';
import { apiRegistry, SpacesApi, UsersApi, ProjectsApi, TasksApi, SpaceUser } from '@/lib/api/';
import router, { getUserLastLocation } from '@/router';

class EventsSubscription {

  private url: string = process.env.VUE_APP_NOTIFICATION_BASE_PATH + '/notifications/subscribe?space_id=';
  private users: any = [];
  source: any;
  updatingTask: any;

  init(usersArr: any = null): void {

    // get myUser
    const myUser = store.state.activeUser.myUser!;

    // get users array
    if (usersArr && usersArr.length >= 0) { this.users = usersArr; }

    // check if myUser and users is defined and not empty
    if (!myUser || this.users.length === 0) { return; }

    const spacesApi = apiRegistry.load(SpacesApi, myUser.token);
    const usersApi = apiRegistry.load(UsersApi, myUser.token);

    const usersSpaceIds = this.users.map((user: any) => { return user.space.id; }).join('_');

    const isDebug: boolean = true;

    // close Event Source if it was already opened
    if (this.source) {
      // remove listeners
      this.source.removeEventListener('updateSpace', updateSpaceTask);
      this.source.removeEventListener('deleteSpace', deleteSpaceTask);
      this.source.removeEventListener('updateMyUser', updateMyUserTask);

      this.source.removeEventListener('updateSpaceUser', updateSpaceUserTask);
      this.source.removeEventListener('deleteSpaceUser', deleteSpaceUserTask);

      this.source.close();
      l('events-subscriptions closed', isDebug);
    }

    // init Event Source
    this.source = new EventSource(this.url + usersSpaceIds);
    l('events-subscriptions initialized', isDebug);

    // init listeners
    this.source.addEventListener('updateSpace', updateSpaceTask);
    this.source.addEventListener('deleteSpace', deleteSpaceTask);
    this.source.addEventListener('updateMyUser', updateMyUserTask);

    this.source.addEventListener('updateSpaceUser', updateSpaceUserTask);
    this.source.addEventListener('deleteSpaceUser', deleteSpaceUserTask);

    // tasks
    function updateSpaceTask(e: any): void {

      const data = JSON.parse(e.data);
      const isFireUser = data.userId === myUser.id;

      spacesApi.spacesSpaceIdGet({
        spaceId: data.spaceId,
      }).then((res) => {
        store.mutations.editSpace(res);
        if (isFireUser) { appEventBus.emit('flash', { 'message': i18n.t('views.setting.main.statusFlow.updatedMessage').toString(), 'name': 'success' }); }
      }).catch((err) => {
        console.log(err);
      });

    }

    function deleteSpaceTask(e: any): void {

      const data = JSON.parse(e.data);
      const isFireUser = data.userId === myUser.id;

      store.mutations.removeLoggedInUser(data.userId);

      if (isFireUser) {

        const loggedInUsersArr = store.state.loggedInUsers;

        if (loggedInUsersArr.length > 0) {
          const loggedInUser = loggedInUsersArr[0];
          router.push(getUserLastLocation(loggedInUser.id));
        } else {
          router.push({ name: 'space-add1' });
        }

        appEventBus.emit('flash', { 'message': i18n.t('common.deleted').toString(), 'name': 'success' });

      }

    }

    function updateMyUserTask(e: any): void {

      const data = JSON.parse(e.data);
      const isFireUser = data.userId === myUser.id;

      if (!isFireUser) { return; }

      usersApi.usersMeGet()
        .then((res) => {
          appEventBus.emit('my-user-edited', { myUser: res });
          appEventBus.emit('flash', { 'message': i18n.t('views.setting.main.statusFlow.updatedMessage').toString(), 'name': 'success' });
        })
        .catch((err) => { console.log(err); });

    }

    // -----------------------------------------

    function updateSpaceUserTask(e: any): void {

      const data = JSON.parse(e.data);
      const isCurrentUser = data.params.userId === myUser.id;
      const loggedUser = store.state.loggedInUsers.find((user) => user.id === data.params.userId);

      if (!isCurrentUser && !loggedUser) return;

      apiRegistry.load(SpacesApi, isCurrentUser ? myUser.token : loggedUser!.token)
        .spacesSpaceIdUsersUserIdGet({
          spaceId: data.spaceId,
          userId: data.params.userId,
        }).then((user: SpaceUser) => {

          if (isCurrentUser) {

            appEventBus.emit('space-user-edited', { spaceUser: user });

            const settingLocation = store.state.settingRouter.name;

            if (user.spaceRoleId === 101 && settingLocation !== 'space-user-profile' && settingLocation !== 'space-user-account') {
              store.actions.settingRouter.close();
            }

            appEventBus.emit('flash', { 'message': i18n.t('views.projectColumn.roleChangedNotify').toString(), 'name': 'success' });

            l('updateSpaceUser: ' + user.account + ', Role: ' + user.spaceRoleId, isDebug);

          } else if (loggedUser) {

            const updatedLoggedUser = Object.assign(loggedUser, user);
            store.mutations.updateLoggedInUser(updatedLoggedUser);

            l('updateSpaceUser: ' + updatedLoggedUser.account + ', Role: ' + updatedLoggedUser.spaceRoleId, isDebug);

          }

        }).catch((err) => { console.log(err); });

    }

    function deleteSpaceUserTask(e: any): void {

      const data = JSON.parse(e.data);
      const isCurrentUser = data.params.userId === myUser.id;
      const loggedUser = store.state.loggedInUsers.find((user) => user.id === data.params.userId);

      if (!isCurrentUser && !loggedUser) return;

      store.mutations.removeLoggedInUser(data.params.userId);

      l('deleteSpaceUser: ' + (isCurrentUser ? myUser.account : loggedUser!.account), isDebug);

      if (!isCurrentUser) return;

      const loggedInUsers = store.state.loggedInUsers;

      if (loggedInUsers.length) {
        appEventBus.emit('flash', { 'message': i18n.t('common.noLongerMemberOfCurrentSpaceNotify', { spaceName: myUser.space.displayName }).toString(), 'name': 'success' });
        router.push(getUserLastLocation(loggedInUsers[0].id));
      } else {
        appEventBus.emit('flash', { 'message': i18n.t('common.noLongerMemberOfAnySpacesNotify').toString(), 'name': 'success' });
        router.push({ name: 'space-add1' });
      }

    }

    function l(msg: string, debug: boolean = false) {
      if (!debug) return;
      console.log(msg);
    }

  }

}

const eventsSub = new EventsSubscription();

export default eventsSub;
