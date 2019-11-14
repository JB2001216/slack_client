import Router from 'vue-router';
import electron from 'electron';
import { apiRegistry, UsersApi } from '@/lib/api';
import { appEventBus } from '@/plugins/app-event';
import * as WebRouter from '@/lib/web-router';
import i18n from '@/i18n';
import store from '../store';

export function bindOpenUrl(router: Router) {
  // Access via browser
  electron.ipcRenderer.on('open-url', async(ev: any, urlraw: string) => {
    const match = urlraw.match(new RegExp(`^${process.env.VUE_APP_URL_SCHEME}://([a-zA-Z0-9_-]+)`));
    if (match) {
      const method = match[1];
      const url = new URL(urlraw);
      const sparams = url.searchParams;

      if (method === WebRouter.WebRouterCbMethod.task) {
        const params = WebRouter.getTaskParamsFromOpenUrl(sparams);
        if (!params) return;
        const user = await store.actions.getViewableTaskUser(params);
        if (!user) return;
        return router.push({
          name: 'task',
          params: {
            userId: user.id.toString(),
            projectId: params.projectId.toString(),
            taskId: params.taskId.toString(),
          },
        });
      }

      if (method === WebRouter.WebRouterCbMethod.note) {
        const params = WebRouter.getNoteParamsFromOpenUrl(sparams);
        if (!params) return;
        const user = await store.actions.getViewableNoteUser(params);
        if (!user) return;
        return router.push({
          name: 'note',
          params: {
            userId: user.id.toString(),
            projectId: params.projectId.toString(),
            noteId: params.noteId.toString(),
          },
        });
      }

      if (method === 'create_space') {
        return router.push({
          name: 'space-add2',
          params: {
            email: sparams.get('email') || '',
            token: sparams.get('token') || '',
          },
        });
      }

      if (method === 'email_login') {
        return router.push({
          name: 'login-space-select',
          query: {
            token: sparams.get('token') || '',
            type: 'email',
          },
        });
      }

      if (method === 'login') {
        const loginToken = sparams.get('token');
        const spaceIdStr = sparams.get('sid');
        const userIdStr = sparams.get('uid');
        if (loginToken && spaceIdStr && userIdStr && isFinite(spaceIdStr as any) && isFinite(userIdStr as any)) {
          const spaceId = parseInt(spaceIdStr);
          const userId = parseInt(userIdStr);
          if (store.state.loggedInUsers.find((u) => u.space.id === spaceId && u.id === userId)) {
            appEventBus.emit('flash', { 'message': i18n.t('common.alreadyLoggedIn').toString(), 'name': 'error' });

          } else {
            try {
              const usersApi = apiRegistry.load(UsersApi);
              const res = await usersApi.usersLoginPost({
                usersLoginPostRequestBody: {
                  token: loginToken,
                  spaceId,
                  userId,
                },
              });
              const user = await store.actions.addLoggedInUser(res.token, true);
              return router.push({
                name: 'user',
                params: {
                  userId: user.id.toString(),
                },
              });

            } catch (err) {
              appEventBus.emit('error', { err });
            }
          }
        }
      }

      if (method === 'update_email') {
        const emailToken = sparams.get('token')!;
        const userIdStr = sparams.get('uid')!;
        if (emailToken && userIdStr && isFinite(userIdStr as any)) {
          const userId = parseInt(userIdStr);
          const myUser = store.state.loggedInUsers.find((u) => u.id === userId);
          if (myUser) {
            try {
              const usersApi = apiRegistry.load(UsersApi, myUser.token);
              const res = await usersApi.usersMeEmailPut({ usersMeEmailPutRequestBody: { token: emailToken } });
              const newMyUser = Object.assign({}, myUser, { email: res.email });
              appEventBus.emit('my-user-edited', { myUser: newMyUser });
              appEventBus.emit('flash', { 'message': i18n.t('views.setting.main.statusFlow.updatedMessage').toString(), 'name': 'success' });
            } catch (err) {
              appEventBus.emit('error', { err });
            }
          }
        }
      }
    }
  });
}
