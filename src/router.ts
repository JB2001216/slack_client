import electron from 'electron';
import Vue from 'vue';
import Router from 'vue-router';
import store from './store';
import { apiRegistry, UsersApi } from '@/lib/api';
import { appEventBus } from '@/plugins/app-event';
import i18n from '@/i18n';
import SpaceAdd1 from './views/single/space-add/SpaceAdd1.vue';
import SpaceAdd2 from './views/single/space-add/SpaceAdd2.vue';
import Login from './views/single/login/Login.vue';
import LoginSms from './views/single/login/LoginSms.vue';
import LoginSpaceSelect from './views/single/login/LoginSpaceSelect.vue';
import MainContainer from './views/main/MainContainer.vue';
import ProjectColumn from './views/main/columns/project/ProjectColumn.vue';
import SubColumnPass from './views/main/columns/sub/SubColumnPass.vue';
import FilesColumn from './views/main/columns/sub/FilesColumn.vue';
import NotesColumn from './views/main/columns/sub/NotesColumn';
import TasksColumn from './views/main/columns/sub/TasksColumn';
import MainColumnPass from './views/main/columns/main/MainColumnPass.vue';
import ProjectAddColumn from './views/main/columns/main/ProjectAddColumn.vue';
import FileColumn from './views/main/columns/main/FileColumn.vue';
import NoteColumn from './views/main/columns/main/NoteColumn.vue';
import TaskColumn from './views/main/columns/main/TaskColumn';

Vue.use(Router);

const router = new Router({
  routes: [
    // single
    {
      path: '/space-add1',
      name: 'space-add1',
      component: SpaceAdd1,
    },
    {
      path: '/space-add2/:email/:token',
      name: 'space-add2',
      component: SpaceAdd2,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/login-sms',
      name: 'login-sms',
      component: LoginSms,
    },
    {
      path: '/login-space-select',
      name: 'login-space-select',
      component: LoginSpaceSelect,
    },

    // main
    {
      path: '/main/users',
      name: 'users',
      component: MainContainer,
      children: [
        {
          path: ':userId',
          name: 'user',
          components: {
            projectColumn: ProjectColumn,
            subColumn: SubColumnPass,
            mainColumn: MainColumnPass,
          },
          children: [
            {
              path: 'projects/add',
              name: 'project-add',
              components: {
                subColumn: SubColumnPass,
                mainColumn: ProjectAddColumn,
              },
            },
            {
              path: 'projects/:projectId',
              name: 'project',
              components: {
                subColumn: SubColumnPass,
                mainColumn: MainColumnPass,
              },
              children: [
                {
                  path: 'files',
                  name: 'files',
                  components: {
                    subColumn: FilesColumn,
                    mainColumn: MainColumnPass,
                  },
                  children: [
                    {
                      path: ':fileId',
                      name: 'file',
                      components: {
                        mainColumn: FileColumn,
                      },
                    },
                  ],
                },
                {
                  path: 'notes',
                  name: 'notes',
                  components: {
                    subColumn: NotesColumn,
                    mainColumn: MainColumnPass,
                  },
                  children: [
                    {
                      path: ':noteId',
                      name: 'note',
                      components: {
                        mainColumn: NoteColumn,
                      },
                    },
                  ],
                },
                {
                  path: 'tasks',
                  name: 'tasks',
                  components: {
                    subColumn: TasksColumn,
                    mainColumn: MainColumnPass,
                  },
                  children: [
                    {
                      path: ':taskId',
                      name: 'task',
                      components: {
                        mainColumn: TaskColumn,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    {
      path: '*',
      redirect: (to) => {
        if (store.state.loggedInUsers.length) {
          return {
            name: 'user',
            params: { userId: store.state.loggedInUsers[0].id.toString() },
          };
        } else {
          return {
            name: 'space-add1',
          };
        }
      },
    },
  ],
});


// ブラウザ経由
electron.ipcRenderer.on('open-url', async(ev: any, urlraw: string) => {
  const match = urlraw.match(new RegExp(`^${process.env.VUE_APP_URL_SCHEME}://([a-zA-Z0-9_-]+)`));
  if (match) {
    const method = match[1];
    const url = new URL(urlraw);
    const sparams = url.searchParams;

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
            const user = await store.actions.addLoggedInUsers(res.token, true);
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
  }
});

export default router;
