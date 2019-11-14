import store from '@/store/index';
import { appEventBus } from '@/plugins/app-event';
import i18n from '@/i18n';
import {
  apiRegistry, SpacesApi, UsersApi, ProjectsApi, Space, SpaceUser, Project, ProjectUser,
} from '@/lib/api/';
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

      this.source.removeEventListener('createProject', createProjectTask);
      this.source.removeEventListener('updateProject', updateProjectTask);
      this.source.removeEventListener('deleteProject', deleteProjectTask);

      this.source.removeEventListener('createProjectUser', createProjectUserTask);
      this.source.removeEventListener('updateProjectUser', updateProjectUserTask);
      this.source.removeEventListener('deleteProjectUser', deleteProjectUserTask);

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

    this.source.addEventListener('createProject', createProjectTask);
    this.source.addEventListener('updateProject', updateProjectTask);
    this.source.addEventListener('deleteProject', deleteProjectTask);

    this.source.addEventListener('createProjectUser', createProjectUserTask);
    this.source.addEventListener('updateProjectUser', updateProjectUserTask);
    this.source.addEventListener('deleteProjectUser', deleteProjectUserTask);

    // tasks
    function updateSpaceTask(e: any): void {

      const data = JSON.parse(e.data);
      const isFireUser = data.userId === myUser.id;
      const loggedUser = store.state.loggedInUsers.find((user) => user.space.id === data.spaceId);
      if (!loggedUser) return;

      spacesApi.spacesSpaceIdGet({
        spaceId: data.spaceId,
      }).then((space: Space) => {

        store.mutations.editSpace(space);

        l('updateSpace: ' + (space.displayName || space.account), isDebug);

        if (isFireUser) { appEventBus.emit('flash', { 'message': i18n.t('notifications.space.updated', { spaceName: myUser.space.displayName || myUser.space.account }).toString(), 'name': 'success' }); }

      }).catch((err) => { console.log(err); });

    }

    function deleteSpaceTask(e: any): void {

      const data = JSON.parse(e.data);
      const isActiveUser = data.spaceId === myUser.space.id;
      const loggedUser = store.state.loggedInUsers.find((user) => user.space.id === data.spaceId);

      if (!isActiveUser && !loggedUser) return;

      const deleteId = isActiveUser ? myUser.id : loggedUser!.id;

      store.mutations.removeLoggedInUser(deleteId);

      l('deleteSpace: ' + deleteId, isDebug);

      if (isActiveUser) {

        store.actions.settingRouter.close();

        const loggedInUsers = store.state.loggedInUsers;

        if (loggedInUsers.length) {
          appEventBus.emit('flash', { 'message': i18n.t('notifications.space.noLongerMemberOfCurrent', { spaceName: myUser.space.displayName || myUser.space.account }).toString(), 'name': 'success' });
          router.push(getUserLastLocation(loggedInUsers[0].id));
        } else {
          appEventBus.emit('flash', { 'message': i18n.t('notifications.space.noLongerMemberOfAny').toString(), 'name': 'success' });
          router.push({ name: 'space-add1' });
        }

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
          l('updateMyUser: ' + res.account, isDebug);
        })
        .catch((err) => { console.log(err); });

    }

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
            const myUser = store.state.activeUser.myUser!;
            store.actions.activeUser.init(myUser);

            const settingLocation = store.state.settingRouter.name;

            if (user.spaceRoleId === 101 && settingLocation !== 'space-user-profile' && settingLocation !== 'space-user-account') {
              store.actions.settingRouter.close();
            }

            router.push({ name: 'user', params: { userId: store.state.activeUser.myUser!.id.toString() } });

            appEventBus.emit('flash', { 'message': i18n.t('views.projectColumn.roleChangedNotify').toString(), 'name': 'success' });

            l('updateSpaceUser: ' + user.account + ', Role: ' + user.spaceRoleId, isDebug);

          } else if (loggedUser) {

            const updatedLoggedUser = Object.assign({}, loggedUser, user);
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
        appEventBus.emit('flash', { 'message': i18n.t('notifications.space.noLongerMemberOfCurrent', { spaceName: myUser.space.displayName || myUser.space.account }).toString(), 'name': 'success' });
        router.push(getUserLastLocation(loggedInUsers[0].id));
      } else {
        appEventBus.emit('flash', { 'message': i18n.t('notifications.space.noLongerMemberOfAny').toString(), 'name': 'success' });
        router.push({ name: 'space-add1' });
      }

    }

    function createProjectTask(e: any): void {

      const data = JSON.parse(e.data);
      const isFireUser = data.userId === myUser.id;
      const isCurrentSpace = data.spaceId === myUser.space.id;

      if (!isCurrentSpace) return;

      const spaceRole = myUser.spaceRoleId;

      // check administrator permission
      if (spaceRole !== 11 && spaceRole !== 1) return;

      projectsApi.projectsProjectIdGet({
        spaceId: data.spaceId,
        projectId: data.params.projectId,
      }).then((project: Project) => {

        store.mutations.activeUser.addProject(project);

        if (!isFireUser) return;

        appEventBus.emit('flash', { 'message': i18n.t('notifications.project.created', { projectName: project.displayName }).toString(), 'name': 'success' });

        store.actions.activeUser.setActiveProject(project.id).then(() => {
          router.push({
            name: 'project',
            params: { userId: myUser.id.toString(), projectId: project.id.toString() },
          });
        });

        l('createProject: ' + project.displayName, isDebug);

      }).catch((err) => { console.log(err); });

    }

    function updateProjectTask(e: any): void {

      const projects: Project[] | null = store.state.activeUser.projects;
      if (!projects) return;

      const data = JSON.parse(e.data);

      const actualProject = projects.find((project: Project) => project.id === data.params.projectId);
      if (!actualProject) return;

      const isFireUser = data.userId === myUser.id;

      projectsApi.projectsProjectIdGet({
        spaceId: data.spaceId,
        projectId: data.params.projectId,
      }).then((project: Project) => {

        store.mutations.activeUser.editProject(project);

        l('updateProject: ' + project.displayName, isDebug);

        if (isFireUser) { appEventBus.emit('flash', { 'message': i18n.t('notifications.project.updated', { projectName: project.displayName }).toString(), 'name': 'success' }); }

      }).catch((err) => { console.log(err); });

    }

    function deleteProjectTask(e: any): void {

      const projects: Project[] | null = store.state.activeUser.projects;
      if (!projects) return;

      const data = JSON.parse(e.data);

      const actualProject = projects.find((project: Project) => project.id === data.params.projectId);
      if (!actualProject) return;

      const isFireUser = data.userId === myUser.id;
      const isActiveProject = data.params.projectId === store.getters.activeUser.activeProjectId;

      store.mutations.activeUser.removeProject(actualProject);

      l('deleteProject: ' + actualProject.displayName, isDebug);

      if (isFireUser || isActiveProject) {

        store.actions.activeUser.setActiveProject(null);
        store.actions.settingRouter.close();
        router.push({ name: 'user', params: { userId: myUser.id.toString() } });

        appEventBus.emit('flash', { 'message': i18n.t('notifications.project.deleted', { projectName: actualProject.displayName }).toString(), 'name': 'success' });

      }

    }

    function createProjectUserTask(e: any): void {

      const data = JSON.parse(e.data);
      const isCurrentSpace = data.spaceId === myUser.space.id;
      const isCurrentUser = data.params.userId === myUser.id;

      if (!isCurrentSpace || !isCurrentUser) return;

      projectsApi.projectsProjectIdGet({
        spaceId: data.spaceId,
        projectId: data.params.projectId,
      }).then((project: Project) => {

        store.mutations.activeUser.addProject(project);

        l('createProjectUser: ' + project.displayName, isDebug);

      }).catch((err) => { console.log(err); });

    }

    function updateProjectUserTask(e: any): void {

      const data = JSON.parse(e.data);
      const isCurrentUser = data.params.userId === myUser.id;
      const isActiveProject = data.params.projectId === store.getters.activeUser.activeProjectId;

      if (!isCurrentUser || !isActiveProject) return;

      const isSettings = store.state.settingRouter.name !== null;

      projectsApi.projectsProjectIdUsersUserIdGet({
        spaceId: data.spaceId,
        projectId: data.params.projectId,
        userId: data.params.userId,
      }).then((user: ProjectUser) => {

        store.mutations.activeUser.setActiveProjectData({ id: data.params.projectId, user: user });

        store.actions.activeUser.fetchTaskStatus();

        appEventBus.emit('flash', { 'message': i18n.t('notifications.project.changedRole').toString(), 'name': 'success' });

        if (isSettings && user.projectRoleId === 10101) {
          store.actions.settingRouter.to('project-members');
        }

        l('updateProjectUser: ' + user.userId, isDebug);

      }).catch((err) => { console.log(err); });

    }

    function deleteProjectUserTask(e: any): void {

      const projects: Project[] | null = store.state.activeUser.projects;
      if (!projects) return;

      const data = JSON.parse(e.data);
      const isCurrentUser = data.params.userId === myUser.id;
      const isActiveProject = data.params.projectId === store.getters.activeUser.activeProjectId;

      if (!isCurrentUser) return;

      const project = projects.find((p) => p.id === data.params.projectId);
      if (!project) return;

      const projectName = project.displayName;

      store.mutations.activeUser.removeProject(project);

      l('deleteProjectUser: ' + projectName, isDebug);

      if (isActiveProject) {
        store.actions.activeUser.setActiveProject(null);
        store.actions.settingRouter.close();
        router.push({ name: 'user', params: { userId: myUser.id.toString() } });

        appEventBus.emit('flash', { 'message': i18n.t('notifications.project.deletedCrntMember', { projectName }).toString(), 'name': 'success' });
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
