import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';
import SpaceAdd1 from '../views/single/space-add/SpaceAdd1.vue';
import SpaceAdd2 from '../views/single/space-add/SpaceAdd2.vue';
import Login from '../views/single/login/Login.vue';
import LoginSms from '../views/single/login/LoginSms.vue';
import LoginSpaceSelect from '../views/single/login/LoginSpaceSelect.vue';
import MainContainer from '../views/main/MainContainer.vue';
import ProjectColumn from '../views/main/columns/project/ProjectColumn.vue';
import SubColumnPass from '../views/main/columns/sub/SubColumnPass.vue';
import FilesColumn from '../views/main/columns/sub/FilesColumn.vue';
import NotesColumn from '../views/main/columns/sub/NotesColumn';
import TasksColumn from '../views/main/columns/sub/TasksColumn';
import MainColumnPass from '../views/main/columns/main/MainColumnPass.vue';
import ProjectAddColumn from '../views/main/columns/main/ProjectAddColumn.vue';
import FileColumn from '../views/main/columns/main/FileColumn.vue';
import NoteColumn from '../views/main/columns/main/NoteColumn.vue';
import TaskColumn from '../views/main/columns/main/TaskColumn';
import { bindOpenUrl } from './open-url';
import { bindLastLocation } from './last-location';

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
      redirect(to) {
        if (to.path === '/' && store.state.location.appLastLocation) {
          return store.state.location.appLastLocation;

        } else if (store.state.loggedInUsers.length) {
          return {
            name: 'user',
            params: {
              userId: store.state.loggedInUsers[0].id.toString(),
            },
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

bindOpenUrl(router);
bindLastLocation(router);

export default router;
