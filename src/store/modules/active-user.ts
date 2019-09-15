import { Getters, Mutations, Actions, module } from 'sinai';
import * as api from '@/lib/api';
import { SpaceRoles, ProjectRoles } from '@/lib/permissions';

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

interface FilesGetConditions {
  filter?: Pick<api.FilesGetRequest, 'name'>;
  order?: {
    field: 'updatedAt';
    type: SearchOrderType;
  };
}
function _createFilesGetRequest(user: api.MyUser, project: api.Project, cond: Required<FilesGetConditions>) {
  const req: api.FilesGetRequest = Object.assign({
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
  myUser: LoggedInUser | null = null;
  projects: api.Project[] | null = null;
  activeProjectData: { id: number; user: api.ProjectUser | null } | null = null
  spaceUsers: api.SpaceUser[] = [];

  // notes
  notes: api.Note[] | null = null;
  notesGetConditions: Required<NotesGetConditions> | null = null;
  noteStatusOptions: api.NoteStatus[] | null = null;

  // files
  files: api.FileRecord[] | null = null;
  filesGetConditions: Required<FilesGetConditions> | null = null;
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
    } else {
      this.state.activeProjectData = value;
    }
    this.state.notes = null;
    this.state.notesGetConditions = null;
    this.state.noteStatusOptions = null;
    this.state.files = null;
    this.state.filesGetConditions = null;
  }

  addProject(project: api.Project) {
    if (!this.state.myUser || !this.state.projects) return;
    if (this.state.myUser.space.id !== project.spaceId) return;
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

  replaceInNotes(note: api.Note) {
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

  fetchedFiles(files: api.FileRecord[], cond: Required<FilesGetConditions>) {
    this.state.files = files;
    this.state.filesGetConditions = cond;
  }

  scrolledFiles(addFiles: api.FileRecord[], type: SearchScrollType) {
    const files = this.state.files!.concat();
    addFiles.forEach((af) => {
      const i = files.findIndex((f) => af.id === f.id);
      if (i >= 0) {
        files.splice(i, 1);
      }
    });
    if (type === 'prev') {
      this.state.files = addFiles.reverse().concat(files);
    } else {
      this.state.files = files.concat(addFiles);
    }
  }

  replaceInFiles(file: api.FileRecord) {
    if (!this.state.files) return;
    const index = this.state.files.findIndex((f) => f.id === file.id);
    if (index >= 0) {
      this.state.files.splice(index, 1, file);
    }
  }

  deleteFile(id: string) {
    if (!this.state.files) return;
    const index = this.state.files.findIndex((f) => f.id === id);
    if (index >= 0) {
      this.state.files.splice(index, 1);
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

  async fetchNotes(conditions: NotesGetConditions = {}) {
    const cond: Required<NotesGetConditions> = Object.assign({
      filter: {},
      order: { field: 'updatedAt', type: 'desc' },
    }, conditions);
    const user = this.state.myUser;
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
    const user = this.state.myUser;
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
    const user = this.state.myUser;
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

  async replaceInNotes(note: api.Note) {
    if (!note || !this.state.notes) {
      return;
    }
    const index = this.state.notes.findIndex((n) => n.id === note.id);
    if (index < 0) {
      await this.fetchNotes(this.state.notesGetConditions || undefined);
    } else {
      this.mutations.replaceInNotes(note);
    }
  }

  async fetchFiles(conditions: FilesGetConditions = {}) {
    const cond: Required<FilesGetConditions> = Object.assign({
      filter: {},
      order: { field: 'updatedAt', type: 'desc' },
    }, conditions);
    const user = this.state.myUser;
    const project = this.getters.activeProject;
    if (!user || !project) {
      return;
    }
    const filesApi = api.apiRegistry.load(api.FilesApi, user.token);
    const req = _createFilesGetRequest(user, project, cond);
    const files = await filesApi.filesGet(req);
    this.mutations.fetchedFiles(files.results, cond);
  }

  async scrollFiles(type: SearchScrollType) {
    const user = this.state.myUser;
    const project = this.getters.activeProject;
    if (!user || !project || !this.state.files) {
      return;
    }
    const files = this.state.files;
    if (!files.length) {
      await this.fetchFiles(this.state.filesGetConditions!);
      return;
    }
    const cond = this.state.filesGetConditions!;
    const filesApi = api.apiRegistry.load(api.FilesApi, user.token);
    const req = _createFilesGetRequest(user, project, cond);
    const current = type === 'next' ? files[files.length - 1] : files[0];
    const d = (
      (cond.order.type === 'asc' && type === 'next') ||
      (cond.order.type === 'desc' && type === 'prev')
    ) ? 'higher' : 'lower';
    const idGtLt = d === 'higher' ? 'idGt' : 'idLt';
    const field = cond.order.field;
    const fieldGtLt = d === 'higher' ? `${field}Gt` : `${field}Lt`;
    const ordering = [field, 'id'].map((f) => d === 'higher' ? f : `-${f}`).join(',');
    const limit = 30;

    const res1 = await filesApi.filesGet(Object.assign({
      [idGtLt]: current.id,
      [field]: current[field],
      limit,
      ordering,
    }, req));
    const addFiles = res1.results;
    if (addFiles.length < limit) {
      const res2 = await filesApi.filesGet(Object.assign({
        [fieldGtLt]: current[field],
        limit: limit - addFiles.length,
        ordering,
      }, req));
      addFiles.push(...res2.results);
    }

    this.mutations.scrolledFiles(addFiles, type);
  }

  async replaceInFiles(file: api.FileRecord) {
    if (!file || !this.state.files) {
      return;
    }
    const index = this.state.files.findIndex((f) => f.id === file.id);
    if (index < 0) {
      await this.fetchFiles(this.state.filesGetConditions || undefined);
    } else {
      this.mutations.replaceInFiles(file);
    }
  }
}

const activeUser = module({
  state: ActiveUserState,
  getters: ActiveUserGetters,
  mutations: ActiveUserMutations,
  actions: ActiveUserActions,
});

export default activeUser;
