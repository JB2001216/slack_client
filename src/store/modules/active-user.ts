import { Getters, Mutations, Actions, module } from 'sinai';
import { first } from 'rxjs/operators';
import { MyUser, Project, ProjectsApi, apiRegistry } from '@/lib/api';

interface LoggedInUser extends MyUser{
  token: string;
}

async function _fetchProjects(user: LoggedInUser) {
  const projectsApi = apiRegistry.load(ProjectsApi, user.token);
  const res = await projectsApi.projectsGet({ spaceId: user.space.id, limit: 500 }).pipe(first()).toPromise();
  return res.results;
}

class ActiveUserState {
  loggedInUser: LoggedInUser | null = null;
  projects: Project[] | null = null;
  activeProjectId: number | null = null;
}

class ActiveUserGetters extends Getters<ActiveUserState>() {
  get activeProject() {
    if (!this.state.projects) {
      return undefined;
    }
    return this.state.projects.find((p) => p.id === this.state.activeProjectId);
  }
}

class ActiveUserMutations extends Mutations<ActiveUserState>() {
  clear() {
    this.state.loggedInUser = null;
    this.state.projects = null;
    this.state.activeProjectId = null;
  }

  init(user: LoggedInUser, projects: Project[]) {
    this.clear();
    this.state.loggedInUser = user;
    this.state.projects = projects;
    if (projects.length) {
      this.state.activeProjectId = projects[0].id;
    }
  }

  setActiveProjectId(projectId: ActiveUserState['activeProjectId']) {
    if (!projectId || !this.state.projects || !this.state.projects.find((p) => p.id === projectId)) {
      this.state.activeProjectId = null;
    } else {
      this.state.activeProjectId = projectId;
    }
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
}

const ActiveUser = module({
  state: ActiveUserState,
  getters: ActiveUserGetters,
  mutations: ActiveUserMutations,
  actions: ActiveUserActions,
});

export default ActiveUser;
