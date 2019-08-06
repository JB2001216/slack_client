import { Getters, Mutations, Actions, module } from 'sinai';
import * as api from '@/lib/api';

interface LoggedInUser extends api.MyUser {
  token: string;
}

type SearchScrollType = 'next' | 'prev';
type SearchOrderType = 'asc' | 'desc';

interface NotesGetConditions {
  filter?: Pick<api.NotesGetRequest, 'subject' | 'status' | 'batonUser' | 'writeUser' | 'favorite'>;
  order?: {
    field: 'updatedAt';
    type: SearchOrderType;
  };
}
function _createNotesGetRequest(user: api.MyUser, project: api.Project, cond: Required<NotesGetConditions>) {
  const req: api.NotesGetRequest = Object.assign({
    spaceId: user.space.id,
    projectId: project.id,
  }, cond.filter);
  req.ordering = [cond.order.field, 'id']
    .map((f) => cond.order.type === 'asc' ? f : `-${f}`)
    .join(',');
  return req;
}

interface TasksGetConditions {
  filter?: Pick<api.TasksGetRequest, 'subject' | 'status' | 'batonUser' | 'writeUser' | 'favorite'>;
  order?: {
    field: 'updatedAt';
    type: SearchOrderType;
  };
}
function _createTasksGetRequest(user: api.MyUser, project: api.Project, cond: Required<TasksGetConditions>) {
  const req: api.TasksGetRequest = Object.assign({
    spaceId: user.space.id,
    projectId: project.id,
  }, cond.filter);
  req.ordering = [cond.order.field, 'id']
    .map((f) => cond.order.type === 'asc' ? f : `-${f}`)
    .join(',');
  return req;
}

async function _fetchProjects(user: LoggedInUser) {
  const projectsApi = api.apiRegistry.load(api.ProjectsApi, user.token);
  const res = await projectsApi.projectsGet({ spaceId: user.space.id, limit: 500 });
  return res.results;
}

class ActiveUserState {
  loggedInUser: LoggedInUser | null = null;
  projects: api.Project[] | null = null;
  activeProjectId: number | null = null;

  spaceUsers: api.SpaceUser[] = [];

  // notes
  notes: api.Note[] | null = null;
  notesGetConditions: Required<NotesGetConditions> | null = null;
  noteStatusOptions: api.NoteStatus[] | null = null;

  // tasks
  tasks: api.Task[] | null = null;
  tasksGetConditions: Required<TasksGetConditions> | null = null;
  taskStatusOptions: api.TaskStatus[] | null = null;
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
    this.state.spaceUsers = [];
    this.state.projects = null;
    this.state.activeProjectId = null;
    this.setActiveProjectId(null);
  }

  init(user: LoggedInUser, projects: api.Project[]) {
    this.clear();
    this.state.loggedInUser = user;
    this.state.projects = projects;
    if (projects.length) {
      this.state.activeProjectId = projects[0].id;
    }
  }

  addSpaceUser(spaceUser: api.SpaceUser) {
    const index = this.state.spaceUsers.findIndex((u) => u.id === spaceUser.id);
    if (index >= 0) {
      this.state.spaceUsers.splice(index, 1, spaceUser);
    } else {
      this.state.spaceUsers.push(spaceUser);
    }
  }

  setActiveProjectId(projectId: ActiveUserState['activeProjectId']) {
    if (!projectId || !this.state.projects || !this.state.projects.find((p) => p.id === projectId)) {
      this.state.activeProjectId = null;
    } else {
      this.state.activeProjectId = projectId;
    }
    this.state.notes = null;
    this.state.notesGetConditions = null;
    this.state.noteStatusOptions = null;
    this.state.tasks = null;
    this.state.tasksGetConditions = null;
    this.state.taskStatusOptions = null;
  }

  addProject(project: api.Project) {
    if (!this.state.loggedInUser || !this.state.projects) return;
    if (this.state.loggedInUser.space.id !== project.spaceId) return;
    if (this.state.projects.find((p) => p.id === project.id)) return;
    this.state.projects.push(project);
  }

  fetchedNotes(notes: api.Note[], cond: Required<NotesGetConditions>) {
    this.state.notes = notes;
    this.state.notesGetConditions = cond;
  }

  fetchedNoteStatusOptions(noteStatusOptions: api.NoteStatus[]) {
    this.state.noteStatusOptions = noteStatusOptions;
  }

  scrolledNotes(addNotes: api.Note[], type: SearchScrollType) {
    const notes = this.state.notes!.concat();
    addNotes.forEach((an) => {
      const i = notes.findIndex((n) => an.id === n.id);
      if (i >= 0) {
        notes.splice(i, 1);
      }
    });
    if (type === 'prev') {
      this.state.notes = addNotes.reverse().concat(notes);
    } else {
      this.state.notes = notes.concat(addNotes);
    }
  }

  replaceNote(note: api.Note) {
    if (!this.state.notes) return;
    const index = this.state.notes.findIndex((n) => n.id === note.id);
    if (index >= 0) {
      this.state.notes.splice(index, 1, note);
    }
  }

  deleteNote(id: number) {
    if (!this.state.notes) return;
    const index = this.state.notes.findIndex((n) => n.id === id);
    if (index >= 0) {
      this.state.notes.splice(index, 1);
    }
  }

  fetchedTasks(tasks: api.Task[], cond: Required<TasksGetConditions>) {
    this.state.tasks = tasks;
    this.state.tasksGetConditions = cond;
  }

  fetchedTaskStatusOptions(taskStatusOptions: api.TaskStatus[]) {
    this.state.taskStatusOptions = taskStatusOptions;
  }

  scrolledTasks(addTasks: api.Task[], type: SearchScrollType) {
    const tasks = this.state.tasks!.concat();
    addTasks.forEach((at) => {
      const i = tasks.findIndex((t) => at.id === t.id);
      if (i >= 0) {
        tasks.splice(i, 1);
      }
    });
    if (type === 'prev') {
      this.state.tasks = addTasks.reverse().concat(tasks);
    } else {
      this.state.tasks = tasks.concat(addTasks);
    }
  }

  replaceTask(task: api.Task) {
    if (!this.state.tasks) return;
    const index = this.state.tasks.findIndex((t) => t.id === task.id);
    if (index >= 0) {
      this.state.tasks.splice(index, 1, task);
    }
  }

  deleteTask(id: number) {
    if (!this.state.tasks) return;
    const index = this.state.tasks.findIndex((t) => t.id === id);
    if (index >= 0) {
      this.state.tasks.splice(index, 1);
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

  async getSpaceUser(userId: number) {
    const loggedInUser = this.state.loggedInUser;
    if (!loggedInUser) {
      return null;
    }
    const user = this.state.spaceUsers.find((u) => u.id === userId);
    if (user && user.spaceId === loggedInUser.space.id) {
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
      const spacesApi = api.apiRegistry.load(api.SpacesApi, loggedInUser.token);
      promise = spacesApi.spacesSpaceIdUsersUserIdGet({
        spaceId: loggedInUser.space.id,
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

  async fetchNotes(conditions: NotesGetConditions = {}) {
    const cond: Required<NotesGetConditions> = Object.assign({
      filter: {},
      order: { field: 'updatedAt', type: 'desc' },
    }, conditions);
    const user = this.state.loggedInUser;
    const project = this.getters.activeProject;
    if (!user || !project) {
      return;
    }
    const notesApi = api.apiRegistry.load(api.NotesApi, user.token);
    const req = _createNotesGetRequest(user, project, cond);
    const notes = await notesApi.notesGet(req);
    this.mutations.fetchedNotes(notes.results, cond);
  }

  async fetchNoteStatusOptions() {
    const user = this.state.loggedInUser;
    const project = this.getters.activeProject;
    if (!user || !project) {
      return;
    }
    const notesApi = api.apiRegistry.load(api.NotesApi, user.token);
    const noteStatusOptions = await notesApi.notesStatusGet({
      spaceId: user.space.id,
      projectId: project.id,
    });
    this.mutations.fetchedNoteStatusOptions(noteStatusOptions);
  }

  async scrollNotes(type: SearchScrollType) {
    const user = this.state.loggedInUser;
    const project = this.getters.activeProject;
    if (!user || !project || !this.state.notes) {
      return;
    }
    const notes = this.state.notes;
    if (!notes.length) {
      await this.fetchNotes(this.state.notesGetConditions!);
      return;
    }
    const cond = this.state.notesGetConditions!;
    const notesApi = api.apiRegistry.load(api.NotesApi, user.token);
    const req = _createNotesGetRequest(user, project, cond);
    const current = type === 'next' ? notes[notes.length - 1] : notes[0];
    const d = (
      (cond.order.type === 'asc' && type === 'next') ||
      (cond.order.type === 'desc' && type === 'prev')
    ) ? 'higher' : 'lower';
    const idGtLt = d === 'higher' ? 'idGt' : 'idLt';
    const field = cond.order.field;
    const fieldGtLt = d === 'higher' ? `${field}Gt` : `${field}Lt`;
    const ordering = [field, 'id'].map((f) => d === 'higher' ? f : `-${f}`).join(',');
    const limit = 30;

    const res1 = await notesApi.notesGet(Object.assign({
      [idGtLt]: current.id,
      [field]: current[field],
      limit,
      ordering,
    }, req));
    const addNotes = res1.results;
    if (addNotes.length < limit) {
      const res2 = await notesApi.notesGet(Object.assign({
        [fieldGtLt]: current[field],
        limit: limit - addNotes.length,
        ordering,
      }, req));
      addNotes.push(...res2.results);
    }

    this.mutations.scrolledNotes(addNotes, type);
  }

  async replaceNote(note: api.Note) {
    if (!note || !this.state.notes) {
      return;
    }
    const index = this.state.notes.findIndex((n) => n.id === note.id);
    if (index < 0) {
      await this.fetchNotes(this.state.notesGetConditions || undefined);
    } else {
      this.mutations.replaceNote(note);
    }
  }

  async fetchTasks(conditions: TasksGetConditions = {}) {
    const cond: Required<TasksGetConditions> = Object.assign({
      filter: {},
      order: { field: 'updatedAt', type: 'desc' },
    }, conditions);
    const user = this.state.loggedInUser;
    const project = this.getters.activeProject;
    if (!user || !project) {
      return;
    }
    const tasksApi = api.apiRegistry.load(api.TasksApi, user.token);
    const req = _createTasksGetRequest(user, project, cond);
    const tasks = await tasksApi.tasksGet(req);
    this.mutations.fetchedTasks(tasks.results, cond);
  }

  async fetchTaskStatusOptions() {
    const user = this.state.loggedInUser;
    const project = this.getters.activeProject;
    if (!user || !project) {
      return;
    }
    const tasksApi = api.apiRegistry.load(api.TasksApi, user.token);
    const taskStatusOptions = await tasksApi.tasksStatusGet({
      spaceId: user.space.id,
      projectId: project.id,
    });
    this.mutations.fetchedTaskStatusOptions(taskStatusOptions);
  }

  async scrollTasks(type: SearchScrollType) {
    const user = this.state.loggedInUser;
    const project = this.getters.activeProject;
    if (!user || !project || !this.state.tasks) {
      return;
    }
    const tasks = this.state.tasks;
    if (!tasks.length) {
      await this.fetchTasks(this.state.tasksGetConditions!);
      return;
    }
    const cond = this.state.tasksGetConditions!;
    const tasksApi = api.apiRegistry.load(api.TasksApi, user.token);
    const req = _createTasksGetRequest(user, project, cond);
    const current = type === 'next' ? tasks[tasks.length - 1] : tasks[0];
    const d = (
      (cond.order.type === 'asc' && type === 'next') ||
      (cond.order.type === 'desc' && type === 'prev')
    ) ? 'higher' : 'lower';
    const idGtLt = d === 'higher' ? 'idGt' : 'idLt';
    const field = cond.order.field;
    const fieldGtLt = d === 'higher' ? `${field}Gt` : `${field}Lt`;
    const ordering = [field, 'id'].map((f) => d === 'higher' ? f : `-${f}`).join(',');
    const limit = 30;

    const res1 = await tasksApi.tasksGet(Object.assign({
      [idGtLt]: current.id,
      [field]: current[field],
      limit,
      ordering,
    }, req));
    const addTasks = res1.results;
    if (addTasks.length < limit) {
      const res2 = await tasksApi.tasksGet(Object.assign({
        [fieldGtLt]: current[field],
        limit: limit - addTasks.length,
        ordering,
      }, req));
      addTasks.push(...res2.results);
    }

    this.mutations.scrolledTasks(addTasks, type);
  }

  async replaceTask(task: api.Task) {
    if (!task || !this.state.tasks) {
      return;
    }
    const index = this.state.tasks.findIndex((t) => t.id === task.id);
    if (index < 0) {
      await this.fetchTasks(this.state.tasksGetConditions || undefined);
    } else {
      this.mutations.replaceTask(task);
    }
  }
}

const ActiveUser = module({
  state: ActiveUserState,
  getters: ActiveUserGetters,
  mutations: ActiveUserMutations,
  actions: ActiveUserActions,
});

export default ActiveUser;
