/** 権限一覧 */
export enum Perm {
  // ワークスペース
  UPDATE_SPACE,
  DELETE_SPACE,
  // ワークスペース所属ユーザー
  ADD_SPACE_USER,
  UPDATE_SPACE_USER,
  DELETE_SPACE_USER,
  // プロジェクト
  ADD_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT,
  // プロジェクト所属ユーザー
  ADD_PROJECT_USER,
  UPDATE_PROJECT_USER,
  DELETE_PROJECT_USER,
  // ファイル
  ADD_FILE,
  UPDATE_MY_FILE,
  UPDATE_ALL_FILE,
  DELETE_MY_FILE,
  DELETE_ALL_FILE,
  // タスク
  ADD_TASK,
  UPDATE_MY_TASK,
  UPDATE_ALL_TASK,
  DELETE_MY_TASK,
  DELETE_ALL_TASK,
  // タスクコメント
  ADD_TASK_COMMENT,
  UPDATE_MY_TASK_COMMENT,
  UPDATE_ALL_TASK_COMMENT,
  DELETE_MY_TASK_COMMENT,
  DELETE_ALL_TASK_COMMENT,
  // ノート
  ADD_NOTE,
  UPDATE_MY_NOTE,
  UPDATE_ALL_NOTE,
  DELETE_MY_NOTE,
  DELETE_ALL_NOTE,
}

function getPerms(options: { ignore?: Perm[] } = {}) {
  let perms = Object.values(Perm).filter((v) => typeof v === 'number') as Perm[];
  if (options.ignore && options.ignore.length) {
    perms = perms.filter((p) => !options.ignore!.includes(p));
  }
  return perms;
}

/** ワークスペース権限クラス */
export class SpaceRole {
  constructor(
    private _id: number,
    private _priorityOrder: number,
    private _key: string,
    private _selectable: boolean,
    private _joinAllProjects: boolean,
    private _settableProjectRole: boolean,
    private _perms: Perm[],
  ) {
    Object.freeze(_perms);
  }

  get id() { return this._id; }
  get key() { return this._key; }
  get perms() { return this._perms; }

  /** ユーザー権限設定で指定可能な権限か */
  get selectable() { return this._selectable; }

  /** 自動的に全プロジェクトに参加(OWNERやADMIN) */
  get joinAllProjects() { return this._joinAllProjects; }

  /** スペース権限に加え、プロジェクト権限も上書き付与可能か(ユーザー権限だがプロジェクト管理者になれたりなど) */
  get settableProjectRole() { return this._settableProjectRole; }

  /** 自身がtargetRoleのユーザーを編集可能かチェックする */
  checkManageable(targetRole: this) {
    return this._priorityOrder < targetRole._priorityOrder;
  }

  /** 自身が他ユーザーをselectRoleに変更可能かチェックする */
  checkSelectable(selectRole: this) {
    return selectRole.selectable && this._priorityOrder <= selectRole._priorityOrder;
  }
}

/** プロジェクト権限クラス */
export class ProjectRole {
  constructor(
    private _id: number,
    private _priorityOrder: number,
    private _key: string,
    private _perms: Perm[],
  ) {
    Object.freeze(_perms);
  }

  get id() { return this._id; }
  get key() { return this._key; }
  get perms() { return this._perms; }

  /** 自身がtargetRoleのユーザーを編集可能なチェックする */
  checkManageable(targetRole: this) {
    return this._priorityOrder < targetRole._priorityOrder;
  }

  /** 自身が他ユーザーをselectRoleに変更可能かチェックする */
  checkSelectable(selectRole: this) {
    return this._priorityOrder <= selectRole._priorityOrder;
  }
}

/** ワークスペース権限グループ一覧 */
export class SpaceRoles {
  static readonly OWNER = new SpaceRole(1, 1, 'OWNER', false, true, false, getPerms());
  static readonly ADMIN = new SpaceRole(11, 11, 'ADMIN', true, true, false, getPerms({ ignore: [Perm.DELETE_SPACE] }));
  static readonly USER = new SpaceRole(101, 101, 'USER', true, false, true, []);

  static * all() {
    yield this.OWNER;
    yield this.ADMIN;
    yield this.USER;
  }

  static get(id: number): SpaceRole {
    for (const r of this.all()) {
      if (r.id === id) {
        return r;
      }
    }
    throw new Error('SpaceRole not found.');
  }

  static * getSelectables(myRole: SpaceRole) {
    for (const r of this.all()) {
      if (myRole.checkSelectable(r)) {
        yield r;
      }
    }
  }
}

/** プロジェクト権限グループ一覧 */
export class ProjectRoles {
  static readonly PROJECT_ADMIN = new ProjectRole(10001, 10001, 'PROJECT_ADMIN', [
    Perm.UPDATE_PROJECT,
    Perm.ADD_PROJECT_USER,
    Perm.UPDATE_PROJECT_USER,
    Perm.DELETE_PROJECT_USER,

    Perm.ADD_FILE,
    Perm.UPDATE_MY_FILE,
    Perm.UPDATE_ALL_FILE,
    Perm.DELETE_MY_FILE,
    Perm.DELETE_ALL_FILE,

    Perm.ADD_TASK,
    Perm.UPDATE_MY_TASK,
    Perm.UPDATE_ALL_TASK,
    Perm.DELETE_MY_TASK,
    Perm.DELETE_ALL_TASK,

    Perm.ADD_TASK_COMMENT,
    Perm.UPDATE_MY_TASK_COMMENT,
    Perm.UPDATE_ALL_TASK_COMMENT,
    Perm.DELETE_MY_TASK_COMMENT,
    Perm.DELETE_ALL_TASK_COMMENT,

    Perm.ADD_NOTE,
    Perm.UPDATE_MY_NOTE,
    Perm.UPDATE_ALL_NOTE,
    Perm.DELETE_MY_NOTE,
    Perm.DELETE_ALL_NOTE,
  ]);

  static readonly PROJECT_USER = new ProjectRole(10101, 10101, 'PROJECT_USER', [
    Perm.ADD_FILE,
    Perm.UPDATE_MY_FILE,
    Perm.DELETE_MY_FILE,

    Perm.ADD_TASK,
    Perm.UPDATE_MY_TASK,

    Perm.ADD_TASK_COMMENT,
    Perm.UPDATE_MY_TASK_COMMENT,
    Perm.DELETE_MY_TASK_COMMENT,

    Perm.ADD_NOTE,
    Perm.UPDATE_MY_NOTE,
    Perm.DELETE_MY_NOTE,
  ]);

  /*
  static readonly USER_READONLY = new ProjectRole(10102, 10102, 'USER_READONLY', [
    Perm.ADD_TASK_COMMENT,
    Perm.UPDATE_MY_TASK_COMMENT,
    Perm.DELETE_MY_TASK_COMMENT,
  ]);
  */

  static * all() {
    yield this.PROJECT_ADMIN;
    yield this.PROJECT_USER;
    // yield this.USER_READONLY;
  }

  static get(id: number) {
    for (const r of this.all()) {
      if (r.id === id) {
        return r;
      }
    }
    throw new Error('ProjectRole not found.');
  }

  static * getSelectables(mySpaceRole: SpaceRole, myProjectRole: ProjectRole | null) {
    if (mySpaceRole.joinAllProjects && mySpaceRole.perms.includes(Perm.UPDATE_PROJECT_USER)) {
      for (const r of this.all()) {
        yield r;
      }
    }
    if (myProjectRole && (mySpaceRole.perms.includes(Perm.UPDATE_PROJECT_USER) || myProjectRole.perms.includes(Perm.UPDATE_PROJECT_USER))) {
      for (const r of this.all()) {
        if (myProjectRole.checkSelectable(r)) {
          yield r;
        }
      }
    }
  }
}
