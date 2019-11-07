import store from '@/store/index';
import { appEventBus } from '@/plugins/app-event';
import i18n from '@/i18n';
import { apiRegistry, SpacesApi, UsersApi, ProjectsApi, TasksApi } from '@/lib/api/';
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
    const projectsApi = apiRegistry.load(ProjectsApi, myUser.token);
    const tasksApi = apiRegistry.load(TasksApi, myUser.token);

    const usersSpaceIds = this.users.map((user: any) => { return user.space.id; }).join('_');

    // close Event Source if it was already opened
    if (this.source) {
      // remove listeners
      this.source.removeEventListener('updateSpace', updateSpaceTask);
      this.source.removeEventListener('deleteSpace', deleteSpaceTask);
      this.source.removeEventListener('updateMyUser', updateMyUserTask);
      this.source.removeEventListener('createSpaceUser', createSpaceUserTask);
      this.source.removeEventListener('updateSpaceUser', updateSpaceUserTask);
      this.source.removeEventListener('deleteSpaceUser', deleteSpaceUserTask);
      this.source.removeEventListener('createProject', createProjectTask);
      this.source.removeEventListener('updateProject', updateProjectTask);
      this.source.removeEventListener('deleteProject', deleteProjectTask);
      this.source.removeEventListener('deleteProjectUser', deleteProjectUserTask);
      this.source.removeEventListener('createProjectUser', createProjectUserTask);
      this.source.removeEventListener('updateProjectUser', updateProjectUserTask);

      this.source.close();
    }

    // init Event Source
    this.source = new EventSource(this.url + usersSpaceIds);

    // init listeners
    this.source.addEventListener('updateSpace', updateSpaceTask);
    this.source.addEventListener('deleteSpace', deleteSpaceTask);
    this.source.addEventListener('updateMyUser', updateMyUserTask);
    this.source.addEventListener('createSpaceUser', createSpaceUserTask);
    this.source.addEventListener('updateSpaceUser', updateSpaceUserTask);
    this.source.addEventListener('deleteSpaceUser', deleteSpaceUserTask);
    this.source.addEventListener('createProject', createProjectTask);
    this.source.addEventListener('updateProject', updateProjectTask);
    this.source.addEventListener('deleteProject', deleteProjectTask);
    this.source.addEventListener('createProjectUser', createProjectUserTask);
    this.source.addEventListener('deleteProjectUser', deleteProjectUserTask);
    this.source.addEventListener('updateProjectUser', updateProjectUserTask);

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

    function createSpaceUserTask(e: any): void {

      const data = JSON.parse(e.data);
      const isFireUser = data.userId === myUser.id;

      spacesApi.spacesSpaceIdUsersGet({
        spaceId: data.spaceId,
      }).then((res) => {
        store.mutations.activeUser.addSpaceUser(...res.results);
        if (isFireUser) {
          store.actions.settingRouter.to('space-members');
          appEventBus.emit('flash', { 'message': i18n.t('views.setting.main.spaceMemberInvite.invitedMessage').toString(), 'name': 'success' });
        }
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

    function createProjectTask(e: any): void {

      const data = JSON.parse(e.data);
      const isFireUser = data.userId === myUser.id;

      if (!isFireUser) { return; }

      projectsApi.projectsProjectIdGet({
        spaceId: data.spaceId,
        projectId: data.params.projectId,
      }).then((res) => {

        store.mutations.activeUser.addProject(res);

        router.push({
          name: 'project',
          params: {
            userId: myUser.id + '',
            projectId: res.id + '',
          },
        });

        appEventBus.emit('flash', { 'message': i18n.t('views.projectAddColumn.createNotification').toString(), 'name': 'success' });

      }).catch((err) => { console.log(err); });

    } // +

    function updateProjectTask(e: any): void {

      const data = JSON.parse(e.data);
      const isFireUser = data.userId === myUser.id;

      projectsApi.projectsProjectIdGet({
        spaceId: data.spaceId,
        projectId: data.params.projectId,
      }).then((res) => {

        store.mutations.activeUser.editProject(res);

        if (isFireUser) { appEventBus.emit('flash', { 'message': i18n.t('views.setting.main.projectGeneral.updateNotification').toString(), 'name': 'success' }); }

      }).catch((err) => { console.log(err); });

    } // +

    function deleteProjectTask(e: any): void {

      const data = JSON.parse(e.data);
      const isFireUser = data.userId === myUser.id;
      const activeProjectId = store.state.activeUser.activeProjectData!.id;
      const isActiveProject = data.params.projectId === activeProjectId;

      store.actions.activeUser.init(myUser);

      if (isFireUser || isActiveProject) {
        store.actions.activeUser.setActiveProject(null);
        store.actions.settingRouter.close();
      }

      if (isFireUser) {
        appEventBus.emit('flash', { 'message': i18n.t('views.setting.main.projectGeneral.deleteNotification').toString(), 'name': 'success' });
      } else if (isActiveProject) {
        appEventBus.emit('flash', { 'message': i18n.t('views.projectColumn.deleteNotification').toString(), 'name': 'success' });
      } else {
        store.actions.activeUser.setActiveProject(activeProjectId);
      }

    } // +

    function createProjectUserTask(e: any): void {

      const data = JSON.parse(e.data);
      const isCurrentUser = data.params.userId === myUser.id;

      if (!isCurrentUser) { return; }

      projectsApi.projectsProjectIdGet({
        spaceId: data.spaceId,
        projectId: data.params.projectId,
      }).then((res) => {
        store.mutations.activeUser.addProject(res);
      }).catch((err) => { console.log(err); });

    } // +

    function deleteProjectUserTask(e: any): void {

      const data = JSON.parse(e.data);
      const isFireUser = data.userId === myUser.id;
      const isCurrentUser = data.params.userId === myUser.id;
      const activeProjectId = store.state.activeUser.activeProjectData!.id;
      const isActiveProject = data.params.projectId === activeProjectId;

      if (isCurrentUser) {

        store.actions.activeUser.init(myUser);

        if (isActiveProject) {
          store.actions.activeUser.setActiveProject(null);
          store.actions.settingRouter.close();
          appEventBus.emit('flash', { 'message': i18n.t('views.setting.main.projectMembers.removedCrntUserMessage').toString(), 'name': 'success' });
        } else {
          store.actions.activeUser.setActiveProject(activeProjectId);
        }

      }

      if (isFireUser) { appEventBus.emit('flash', { 'message': i18n.t('views.setting.main.projectMembers.removedMessage').toString(), 'name': 'success' }); }

    } // +

    function updateProjectUserTask(e: any): void {

      const data = JSON.parse(e.data);
      const isCurrentUser = data.params.userId === myUser.id;
      const activeProjectId = store.state.activeUser.activeProjectData!.id;
      const isActiveProject = data.params.projectId === activeProjectId;
      const isSettings = store.state.settingRouter.name !== null;

      projectsApi.projectsProjectIdUsersUserIdGet({
        spaceId: data.spaceId,
        projectId: data.params.projectId,
        userId: data.params.userId,
      }).then((res) => {

        if (!isCurrentUser || !isActiveProject) { return; }

        store.mutations.activeUser.setActiveProjectData({ id: data.params.projectId, user: res });

        if (!isSettings) { return; }

        if (res.projectRoleId === 10101) {
          store.actions.settingRouter.to('project-members');
        }

        appEventBus.emit('flash', { 'message': i18n.t('views.setting.main.projectMembers.changedProjectRole').toString(), 'name': 'success' });

      }).catch((err) => { console.log(err); });

    } // +

    // this.source.addEventListener('createTaskComment', (e: any) => {
    //   console.log('createTaskComment');
    //   const data = JSON.parse(e.data);
    //   // DO UPDATE HERE
    // });

    // this.source.addEventListener('updateTaskComment', (e: any) => {
    //   console.log('updateTaskComment');
    //   const data = JSON.parse(e.data);
    //   // DO UPDATE HERE
    // });

    // this.source.addEventListener('deleteTaskComment', (e: any) => {
    //   console.log('deleteTaskComment');
    //   const data = JSON.parse(e.data);
    //   // DO UPDATE HERE
    // });

    // this.source.addEventListener('createNote', (e: any) => {
    //   console.log('createNote');
    //   const data = JSON.parse(e.data);
    //   // DO UPDATE HERE
    // });

    // this.source.addEventListener('updateNote', (e: any) => {
    //   console.log('updateNote');
    //   const data = JSON.parse(e.data);
    //   // DO UPDATE HERE
    // });

    // this.source.addEventListener('deleteNote', (e: any) => {
    //   console.log('deleteNote');
    //   const data = JSON.parse(e.data);
    //   // DO UPDATE HERE
    // });

    // error event
    this.source.onerror = (err: any) => {
      console.error(err);
    };

  }

}

const eventsSub = new EventsSubscription();

export default eventsSub;
