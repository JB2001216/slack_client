import { Getters, Mutations, Actions, module } from 'sinai';
import * as api from '@/lib/api';
import { SpaceRoles, ProjectRoles, Perm } from '@/lib/permissions';

interface LoggedInUser extends api.MyUser {
  token: string;
}

async function _fetchProjects(user: LoggedInUser) {
  const projectsApi = api.apiRegistry.load(api.ProjectsApi, user.token);
  const res = await projectsApi.projectsGet({ spaceId: user.space.id, limit: 500 });
  return res.results;
}

class ActiveUserState {
  myUser: LoggedInUser | null = null;
  projects: api.Project[] | null = null;
  activeProjectData: { id: number; user: api.ProjectUser | null } | null = null
  spaceUsers: api.SpaceUser[] = [];
  taskStatusList: api.TaskStatus[] | null = null;
  noteStatusList: api.NoteStatus[] | null = null;
}

class ActiveUserGetters extends Getters<ActiveUserState>() {
  get mySpaceRole() {
    if (!this.state.myUser) return undefined;
    return SpaceRoles.get(this.state.myUser.spaceRoleId);
  }

  get activeProject() {
    if (!this.state.projects || !this.state.activeProjectData) {
      return undefined;
    }
    return this.state.projects.find((p) => p.id === this.state.activeProjectData!.id);
  }

  get activeProjectId() {
    return this.state.activeProjectData ? this.state.activeProjectData.id : undefined;
  }

  get activeProjectMyRole() {
    const projectUser = this.state.activeProjectData ? this.state.activeProjectData!.user : null;
    return projectUser && projectUser.projectRoleId ? ProjectRoles.get(projectUser.projectRoleId) : null;
  }

  get activeProjectMyPerms() {
    if (!this.mySpaceRole) {
      return [];
    }
    if (!this.mySpaceRole.settableProjectRole || !this.activeProjectMyRole) {
      return this.mySpaceRole.perms.concat();
    }
    return this.mySpaceRole.perms.concat(this.activeProjectMyRole.perms);
  }

  taskUpdatable(task: api.Task) {
    if (!this.state.myUser) return false;
    return this.activeProjectMyPerms.includes(Perm.UPDATE_ALL_TASK) ||
      (
        this.activeProjectMyPerms.includes(Perm.UPDATE_MY_TASK) &&
        (
          task.writeUser === this.state.myUser.id ||
          task.batonUser === this.state.myUser.id ||
          task.chargeUsers.includes(this.state.myUser.id)
        )
      );
  }

  taskDeletable(task: api.Task) {
    if (!this.state.myUser) return false;
    return this.activeProjectMyPerms.includes(Perm.DELETE_ALL_TASK) ||
      (
        this.activeProjectMyPerms.includes(Perm.DELETE_MY_TASK) &&
        task.writeUser === this.state.myUser.id
      );
  }

  noteUpdatable(note: api.Note) {
    if (!this.state.myUser) return false;
    return this.activeProjectMyPerms.includes(Perm.UPDATE_ALL_NOTE) ||
      (
        this.activeProjectMyPerms.includes(Perm.UPDATE_MY_NOTE) &&
        (
          note.writeUser === this.state.myUser.id ||
          note.batonUser === this.state.myUser.id ||
          note.chargeUsers.includes(this.state.myUser.id)
        )
      );
  }

  noteDeletable(note: api.Note) {
    if (!this.state.myUser) return false;
    return this.activeProjectMyPerms.includes(Perm.DELETE_ALL_NOTE) ||
      (
        this.activeProjectMyPerms.includes(Perm.DELETE_MY_NOTE) &&
        note.writeUser === this.state.myUser.id
      );
  }
}

class ActiveUserMutations extends Mutations<ActiveUserState>() {
  clear() {
    this.state.myUser = null;
    this.state.spaceUsers = [];
    this.state.projects = null;
    this.setActiveProjectData(null);
  }

  init(user: LoggedInUser, projects: api.Project[]) {
    this.clear();
    this.state.myUser = user;
    this.state.projects = projects;
  }

  addSpaceUser(...spaceUsers: api.SpaceUser[]) {
    for (const user of spaceUsers) {
      const index = this.state.spaceUsers.findIndex((u) => u.id === user.id);
      if (index >= 0) {
        this.state.spaceUsers.splice(index, 1, user);
      } else {
        this.state.spaceUsers.push(user);
      }
    }
  }

  setActiveProjectData(value: ActiveUserState['activeProjectData']) {
    if (!value || !this.state.projects || !this.state.projects.find((p) => p.id === value.id)) {
      this.state.activeProjectData = null;
      this.state.taskStatusList = null;
      this.state.noteStatusList = null;
    } else {
      this.state.activeProjectData = value;
    }
  }

  addProject(project: api.Project) {
    if (!this.state.myUser || !this.state.projects) return;
    if (this.state.myUser.space.id !== project.spaceId) return;
    if (this.state.projects.find((p) => p.id === project.id)) return;
    this.state.projects.push(project);
  }

  editProject(project: api.Project) {
    if (!this.state.myUser || !this.state.projects) return;
    if (this.state.myUser.space.id !== project.spaceId) return;
    const index = this.state.projects.findIndex((p) => p.id === project.id);
    if (index >= 0) {
      this.state.projects.splice(index, 1, project);
    }
  }

  editMyUser(user: api.MyUser) {
    if (!this.state.myUser || this.state.myUser.id !== user.id) return;
    const loggedInUser: LoggedInUser = Object.assign({}, user, { token: this.state.myUser.token });
    this.state.myUser = loggedInUser;
  }

  setTaskStatusList(statusList: api.TaskStatus[]) {
    this.state.taskStatusList = statusList;
  }

  setNoteStatusList(statusList: api.NoteStatus[]) {
    this.state.noteStatusList = statusList;
  }
}

class ActiveUserActions extends Actions<ActiveUserState, ActiveUserGetters, ActiveUserMutations>() {
  async init(user: LoggedInUser | null) {
    if (!user) {
      this.mutations.clear();
      return;
    }
    const projects = await _fetchProjects(user);
    this.mutations.init(user, projects);
  }

  async setActiveProject(id: number | null) {
    const myUser = this.state.myUser;
    if (!myUser || !id) {
      this.mutations.setActiveProjectData(null);
      return;
    }

    let projectUser: api.ProjectUser | null | undefined;
    if (this.getters.mySpaceRole!.settableProjectRole) {
      try {
        const projectsApi = api.apiRegistry.load(api.ProjectsApi, myUser.token);
        projectUser = await projectsApi.projectsProjectIdUsersUserIdGet({
          spaceId: myUser.space.id,
          projectId: id,
          userId: myUser.id,
        });
      } catch (err) {
        if (err instanceof Response) {
          const json = await api.getJsonFromResponse(err);
          if (json && json.error === api.ApiErrors.NotFound) {
            projectUser = null;
          }
        }
        if (typeof projectUser === 'undefined') {
          this.mutations.setActiveProjectData(null);
          throw err;
        }
      }
    }

    this.mutations.setActiveProjectData({ id, user: projectUser || null });
  }

  async getSpaceUser(userId: number) {
    const myUser = this.state.myUser;
    if (!myUser) return null;

    const user = this.state.spaceUsers.find((u) => u.id === userId);
    if (user && user.spaceId === myUser.space.id) {
      return user;
    }

    // すでに取得中の場合重複しないようにする
    const attr = '_fetchingSpaceUserPromises';
    if (!(this as any)[attr]) {
      (this as any)[attr] = {};
    }
    const promises: {[userId: number]: Promise<api.SpaceUser>} = (this as any)[attr];
    let promise = promises[userId];
    if (!promise) {
      const spacesApi = api.apiRegistry.load(api.SpacesApi, myUser.token);
      promise = spacesApi.spacesSpaceIdUsersUserIdGet({
        spaceId: myUser.space.id,
        userId,
      });
      promises[userId] = promise;
    }

    try {
      const fetchedUser = await promise;
      this.mutations.addSpaceUser(fetchedUser);
      return fetchedUser;
    } finally {
      delete promises[userId];
    }
  }

  async fetchTaskStatus(force = false) {
    if (!force && this.state.taskStatusList) return;
    const myUser = this.state.myUser;
    const activeProjectData = this.state.activeProjectData;
    if (!myUser || !activeProjectData) return;
    const tasksApi = api.apiRegistry.load(api.TasksApi, myUser.token);
    const statusList = await tasksApi.tasksStatusGet({
      spaceId: myUser.space.id,
      projectId: activeProjectData.id,
    });
    this.mutations.setTaskStatusList(statusList);
  }

  async fetchNoteStatus(force = false) {
    if (!force && this.state.noteStatusList) return;
    const myUser = this.state.myUser;
    const activeProjectData = this.state.activeProjectData;
    if (!myUser || !activeProjectData) return;
    const notesApi = api.apiRegistry.load(api.NotesApi, myUser.token);
    const statusList = await notesApi.notesStatusGet({
      spaceId: myUser.space.id,
      projectId: activeProjectData.id,
    });
    this.mutations.setNoteStatusList(statusList);
  }
}

const activeUser = module({
  state: ActiveUserState,
  getters: ActiveUserGetters,
  mutations: ActiveUserMutations,
  actions: ActiveUserActions,
});

export default activeUser;
