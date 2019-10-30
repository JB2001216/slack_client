import store from '@/store/index';
import { appEventBus } from '@/plugins/app-event';
import i18n from '@/i18n';
import { apiRegistry, SpacesApi, UsersApi, SpaceUser } from '@/lib/api/';
import router, { getUserLastLocation } from '@/router';


class EventsSubscription {

  private url: string = process.env.VUE_APP_NOTIFICATION_BASE_PATH + '/notifications/subscribe?space_id=';
  private spaceId: any;
  source: any;

  init(myUser: any): void {

    // check if myUser is defined and not the same spaceId
    if (!myUser || this.spaceId === myUser.space.id) { return; }

    const spacesApi = apiRegistry.load(SpacesApi, myUser.token);
    const usersApi = apiRegistry.load(UsersApi, myUser.token);

    this.spaceId = myUser.space.id;

    // close Event Source if it was already opened
    if (this.source) {
      // remove listeners
      this.source.removeEventListener('updateSpace', updateSpaceTask);
      this.source.removeEventListener('deleteSpace', deleteSpaceTask);
      this.source.removeEventListener('updateMyUser', updateMyUserTask);
      this.source.removeEventListener('createSpaceUser', createSpaceUserTask);
      this.source.removeEventListener('updateSpaceUser', updateSpaceUserTask);
      this.source.removeEventListener('deleteSpaceUser', deleteSpaceUserTask);

      this.source.close();
    }

    // init Event Source
    this.source = new EventSource(this.url + this.spaceId);

    // init listeners
    this.source.addEventListener('updateSpace', updateSpaceTask);
    this.source.addEventListener('deleteSpace', deleteSpaceTask);
    this.source.addEventListener('updateMyUser', updateMyUserTask);
    this.source.addEventListener('createSpaceUser', createSpaceUserTask);
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

      const loggedInUsersArr = store.state.loggedInUsers;

      if (loggedInUsersArr.length > 0) {
        const loggedInUser = loggedInUsersArr[0];
        router.push(getUserLastLocation(loggedInUser.id));
      } else {
        router.push({ name: 'space-add1' });
      }

      if (isFireUser) { appEventBus.emit('flash', { 'message': i18n.t('common.deleted').toString(), 'name': 'success' }); }

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

    function createSpaceUserTask(e: any): void {

      const data = JSON.parse(e.data);
      const isFireUser = data.userId === myUser.id;

      spacesApi.spacesSpaceIdUsersGet({
        spaceId: data.spaceId,
      }).then((res) => {
        store.mutations.activeUser.addSpaceUser(...res.results);
        store.mutations.settingRouter.to('space-members');
        if (isFireUser) { appEventBus.emit('flash', { 'message': i18n.t('views.setting.main.spaceMemberInvite.invitedMessage').toString(), 'name': 'success' }); }
      }).catch((err) => { console.log(err); });

    }

    function updateSpaceUserTask(e: any): void {

      const data = JSON.parse(e.data);
      const isFireUser = data.userId === myUser.id;

      spacesApi.spacesSpaceIdUsersUserIdGet({
        spaceId: data.spaceId,
        userId: data.userId,
      }).then((res) => {
        appEventBus.emit('space-user-edited', { spaceUser: res });
        if (isFireUser) { appEventBus.emit('flash', { 'message': i18n.t('views.setting.main.statusFlow.updatedMessage').toString(), 'name': 'success' }); }
      }).catch((error) => { console.log(error); });

    }

    function deleteSpaceUserTask(e: any): void {

      const data = JSON.parse(e.data);
      const isFireUser = data.userId === myUser.id;

      spacesApi.spacesSpaceIdUsersGet({
        spaceId: data.spaceId,
      }).then((res) => {
        store.mutations.activeUser.addSpaceUser(...res.results);
        if (isFireUser) { appEventBus.emit('flash', { 'message': i18n.t('common.deleted').toString(), 'name': 'success' }); }
      }).catch((err) => { console.log(err); });

    }

    this.source.addEventListener('createProject', (e: any) => {
      console.log('createProject');
      const data = JSON.parse(e.data);
      // store.mutations.activeUser.addProject(e);
      // DO UPDATE HERE
    });

    this.source.addEventListener('updateProject', (e: any) => {
      console.log('updateProject');
      const data = JSON.parse(e.data);
      // store.mutations.activeUser.editProject(resObj.data.params);
      // DO UPDATE HERE
    });

    this.source.addEventListener('deleteProject', (e: any) => {
      console.log('deleteProject');
      const data = JSON.parse(e.data);
      // DO UPDATE HERE
    });

    this.source.addEventListener('createProjectUser', (e: any) => {
      console.log('createProjectUser');
      const data = JSON.parse(e.data);
      // DO UPDATE HERE
    });

    this.source.addEventListener('updateProjectUser', (e: any) => {
      console.log('updateProjectUser');
      const data = JSON.parse(e.data);
      // DO UPDATE HERE
    });

    this.source.addEventListener('createTask', (e: any) => {
      console.log('createTask');
      const data = JSON.parse(e.data);
      // DO UPDATE HERE
    });

    this.source.addEventListener('updateTask', (e: any) => {
      console.log('updateTask');
      const data = JSON.parse(e.data);
      // DO UPDATE HERE
    });

    this.source.addEventListener('createTaskComment', (e: any) => {
      console.log('createTaskComment');
      const data = JSON.parse(e.data);
      // DO UPDATE HERE
    });

    this.source.addEventListener('updateTaskComment', (e: any) => {
      console.log('updateTaskComment');
      const data = JSON.parse(e.data);
      // DO UPDATE HERE
    });

    this.source.addEventListener('deleteTaskComment', (e: any) => {
      console.log('deleteTaskComment');
      const data = JSON.parse(e.data);
      // DO UPDATE HERE
    });

    this.source.addEventListener('createNote', (e: any) => {
      console.log('createNote');
      const data = JSON.parse(e.data);
      // DO UPDATE HERE
    });

    this.source.addEventListener('updateNote', (e: any) => {
      console.log('updateNote');
      const data = JSON.parse(e.data);
      // DO UPDATE HERE
    });

    this.source.addEventListener('deleteNote', (e: any) => {
      console.log('deleteNote');
      const data = JSON.parse(e.data);
      // DO UPDATE HERE
    });

    // error event
    this.source.onerror = () => {
      console.error('Something went wrong');
    };

  }

}

export const eventsSub = new EventsSubscription();
