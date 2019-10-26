import store from '@/store/index';
import { appEventBus } from '@/plugins/app-event';
import i18n from '@/i18n';

class EventsSubscription {

  private url: string = process.env.VUE_APP_NOTIFICATION_BASE_PATH + '/notifications/subscribe?space_id=';
  private spaceId: any;
  private isFireUser: boolean = false;
  source: any;

  init(myUser: any): void {

    // check if myUser is defined and not the same spaceId
    if (!myUser || this.spaceId === myUser.space.id) { return; }

    this.spaceId = myUser.space.id;

    // close Event Source if it was already opened
    if (this.source) { this.source.close(); }

    // init Event Source
    this.source = new EventSource(this.url + this.spaceId);

    // open event
    this.source.onopen = () => {
      console.log('Server is opened.');
    };

    // message event
    this.source.onmessage = (res: any) => {

      const resObj: any = JSON.parse(res);

      // check currect user
      this.isFireUser = resObj.data.clientId === myUser.id;

      switch (resObj.event) {

        case 'updateSpace':
          store.mutations.editSpace(resObj.data.params);
          if (this.isFireUser) {
            appEventBus.emit('flash', { 'message': i18n.t('views.setting.main.statusFlow.updatedMessage').toString(), 'name': 'success' });
          }
          break;

        case 'deleteSpace':
          // DO UPDATE HERE
          break;

        case 'updateMyUser':
          store.mutations.editMyUser(resObj.data.params);
          if (this.isFireUser) {
            appEventBus.emit('flash', { 'message': i18n.t('views.setting.main.statusFlow.updatedMessage').toString(), 'name': 'success' });
          }
          break;

        case 'createSpaceUser':
          store.mutations.activeUser.addSpaceUser(resObj.data.params);
          break;

        case 'updateSpaceUser':
          store.mutations.activeUser.editSpaceUser(resObj.data.params);
          if (this.isFireUser) {
            appEventBus.emit('flash', { 'message': i18n.t('views.setting.main.statusFlow.updatedMessage').toString(), 'name': 'success' });
          }
          break;

        case 'deleteSpaceUser':
          // DO UPDATE HERE
          break;

        case 'createProject':
          store.mutations.activeUser.addProject(resObj.data.params);
          break;

        case 'updateProject':
          store.mutations.activeUser.editProject(resObj.data.params);
          if (this.isFireUser) {
            appEventBus.emit('flash', { 'message': i18n.t('views.setting.main.statusFlow.updatedMessage').toString(), 'name': 'success' });
          }
          break;

        case 'deleteProject':
          // DO UPDATE HERE
          break;

        case 'createProjectUser':
          // DO UPDATE HERE
          break;

        case 'updateProjectUser':
          // DO UPDATE HERE
          break;

        case 'deleteProjectUser':
          // DO UPDATE HERE
          break;

        case 'createTask':
          // DO UPDATE HERE
          break;

        case 'updateTask':
          // DO UPDATE HERE
          break;

        case 'deleteTask':
          // DO UPDATE HERE
          break;

        case 'createTaskComment':
          // DO UPDATE HERE
          break;

        case 'updateTaskComment':
          // DO UPDATE HERE
          break;

        case 'deleteTaskComment':
          // DO UPDATE HERE
          break;

        case 'createNote':
          // DO UPDATE HERE
          break;

        case 'updateNote':
          // DO UPDATE HERE
          break;

        case 'deleteNote':
          // DO UPDATE HERE
          break;

        default:
          break;

      }

    };

    // close event
    this.source.onerror = () => {
      console.error('Something went wrong');
    };

  }

}

export const eventsSub = new EventsSubscription();
