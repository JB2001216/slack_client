import Vue from 'vue';
import Router, { Route } from 'vue-router';
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
import NoteColumn from '../views/main/columns/main/NoteColumn';
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

router.beforeEach(async(to, from, next) => {
  // main route
  if (to.matched[0].name === 'users') {
    const routeUserId = to.params.userId ? parseInt(to.params.userId) : null;
    const routeProjectId = to.params.projectId ? parseInt(to.params.projectId) : null;

    // users
    if (to.name === 'users') {
      // If the user exists but has not selected a user, select the first user.
      if (store.state.loggedInUsers.length) {
        const user = store.state.loggedInUsers[0];
        if (user) {
          return next({
            name: 'user',
            params: {
              userId: user.id.toString(),
            },
          });
        }
      }
      return next();
    }

    // Load activeUser
    if (to.name === 'user') {
      const user = store.state.loggedInUsers.find((u) => u.id === routeUserId);
      if (!user) {
        return next({ name: 'users' });
      }
      if (!store.state.activeUser.myUser || user.id !== store.state.activeUser.myUser.id) {
        await store.actions.activeUser.init(user);
      }
      if (!store.state.activeUser.myUser) {
        return next({ name: 'users' });
      }
    }
    const myUser = store.state.activeUser.myUser;

    // When myUser is different from the user of params.userId,
    // once access the "user" route and get the myUser data again.
    if (to.name !== 'user') {
      if (!routeUserId) {
        return next();
      }
      if (!myUser || myUser.id !== routeUserId) {
        return next({
          name: 'user',
          params: {
            userId: to.params.userId,
            redirectUrl: to.fullPath,
          },
        });
      }
    }

    // If you have temporarily accessed to get myUser, return to the original route.
    // If the project exists but no project is selected, select the first project.
    if (to.name === 'user') {
      if (to.params.redirectUrl) {
        return next(to.params.redirectUrl);
      }
      const projects = store.state.activeUser.projects;
      if (projects && projects.length) {
        return next({
          name: 'project',
          params: {
            userId: to.params.userId,
            projectId: projects[0].id.toString(),
          },
        });
      }
    }

    // Load activeProject
    if (to.name === 'project') {
      const project = store.state.activeUser.projects!.find((p) => p.id === routeProjectId);
      if (!project) {
        return next({ name: 'user', params: { userId: to.params.userId } });
      }
      if (project.id !== store.getters.activeUser.activeProjectId) {
        await store.actions.activeUser.setActiveProject(project.id);
      }
      if (!store.state.activeUser.activeProjectData) {
        return next({ name: 'user', params: { userId: to.params.userId } });
      }
    }
    const activeProjectData = store.state.activeUser.activeProjectData;

    // When activeProject is different from the project of params.projectId,
    // once access the "project" route and get the activeProject data again.
    if (to.name !== 'project') {
      if (!routeProjectId) {
        return next();
      }
      if (!activeProjectData || activeProjectData.id !== routeProjectId) {
        return next({
          name: 'project',
          params: {
            userId: to.params.userId,
            projectId: to.params.projectId,
            redirectUrl: to.fullPath,
          },
        });
      }
    }

    // If you have temporarily accessed to get activeProject, return to the original route.
    // If the project exists but no tab is selected, select the first tab.
    if (to.name === 'project') {
      if (to.params.redirectUrl) {
        return next(to.params.redirectUrl);
      }
      return next({
        name: 'tasks',
        params: {
          userId: to.params.userId,
          projectId: to.params.projectId,
        },
      });
    }

    next();
  }
});


bindOpenUrl(router);
bindLastLocation(router);

export default router;
