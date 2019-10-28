import store from '@/store/index';
import { appEventBus } from '@/plugins/app-event';
import i18n from '@/i18n';
import { apiRegistry, SpacesApi, SpaceUser } from '@/lib/api/';

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
    this.source.addEventListener('updateSpace', (e: any) => {
      console.log('updateSpace');
      const spacesApi = apiRegistry.load(SpacesApi, myUser.token);
      spacesApi.spacesSpaceIdGet({
        spaceId: myUser.space.id,
      }).then((result) => {
        console.log(result);
        store.mutations.editSpace(result);
      }).catch((error) => {
        console.log(error);
      });
    });

    this.source.addEventListener('deleteSpace', (e: any) => {
      console.log('deleteSpace');
      const spacesApi = apiRegistry.load(SpacesApi, myUser.token);
      spacesApi.spacesSpaceIdDelete({
        spaceId: myUser.space.id,
      }).then((result) => {
        console.log(result);
        // DO UPDATE HERE

      }).catch((error) => {
        console.log(error);
      });
    });

    this.source.addEventListener('updateMyUser', (e: any) => {
      console.log('updateMyUser');
      const data = JSON.parse(e.data);
      const spacesApi = apiRegistry.load(SpacesApi, myUser.token);
      // spacesApi.spacesSpaceIdUsersUserIdGet({
      //   spaceId: myUser.space.id,
      //   userId: data.params.userId,
      // }).then((result) => {
      //   console.log(result);
      //   store.mutations.editMyUser({
      //     id: result.id,
      //     account: result.account,
      //     displayName: result.displayName,
      //     email: result.email,
      //     spaceRoleId: result.spaceRoleId,
      //     avatarUrl: result.avatarUrl,
      //     avatarSmallUrl: result.avatarSmallUrl,
      //     locale: 'en',
      //     timezone: 'asdfasdfsafdsa',
      //     space: {
      //       id: result.spaceId,
      //       account: result.account,
      //       displayName: result.displayName,
      //       avatarUrl: result.avatarUrl,
      //       avatarSmallUrl: result.avatarSmallUrl,
      //     },
      //   });
      //   // DO UPDATE HERE

      // }).catch((error) => {
      //   console.log(error);
      // });
    });

    this.source.addEventListener('createSpaceUser', (e: any) => {
      console.log('createSpaceUser');
      const data = JSON.parse(e.data);
      const spacesApi = apiRegistry.load(SpacesApi, myUser.token);
      spacesApi.spacesSpaceIdUsersUserIdGet({
        spaceId: myUser.space.id,
        userId: data.params.userId,
      }).then((result) => {
        console.log(result);
        store.mutations.activeUser.addSpaceUser(result);
      }).catch((error) => {
        console.log(error);
      });
    });

    this.source.addEventListener('updateSpaceUser', (e: any) => {
      console.log('updateSpaceUser');
      const data = JSON.parse(e.data);
      const spacesApi = apiRegistry.load(SpacesApi, myUser.token);
      spacesApi.spacesSpaceIdUsersUserIdGet({
        spaceId: myUser.space.id,
        userId: data.params.userId,
      }).then((result) => {
        console.log(result);
        store.mutations.activeUser.addSpaceUser(result);
        // DO UPDATE HERE

      }).catch((error) => {
        console.log(error);
      });
    });

    this.source.addEventListener('deleteSpaceUser', (e: any) => {
      console.log('deleteSpaceUser');
      const data = JSON.parse(e.data);
      // DO UPDATE HERE
    });

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

    this.source.onmessage = (res: any) => {

      const resObj: any = JSON.parse(res);

      // check currect user
      this.isFireUser = resObj.data.clientId === myUser.id;

      console.log(resObj);

      switch (resObj.event) {

        // case 'updateSpace':
        //   store.mutations.editSpace(resObj.data.params);
        //   if (this.isFireUser) {
        //     appEventBus.emit('flash', { 'message': i18n.t('views.setting.main.statusFlow.updatedMessage').toString(), 'name': 'success' });
        //   }
        //   break;

      }

    };

    // close event
    this.source.onerror = () => {
      console.error('Something went wrong');
    };

  }

}

export const eventsSub = new EventsSubscription();
