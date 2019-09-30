<template>
  <div class="tasksColumn_filterForm searchWrap">
    <h2>{{$t('views.tasksColumn.filterForm.status')}}</h2>
    <dl class="searchWrap_checkBox" v-if="statusOptions">
      <dd>
        <input v-model="checkedStatusOptionAll" @change="onCheckedStatusOptionAllChange" type="checkbox" name="status" id="status_all">
        <label for="status_all" class="checkbox">{{$t('views.tasksColumn.filterForm.all')}}</label>
      </dd>
      <dd>
        <input v-model="checkedStatusOptionNotClosed" @change="onCheckedStatusOptionNotClosedChange" type="checkbox" name="status" id="status_not_closed">
        <label for="status_not_closed" class="checkbox">{{$t('views.tasksColumn.filterForm.notClosed', {closedName: closedStatusOption.name})}}</label>
      </dd>
      <dd v-for="s in options" :key="s.id">
        <input v-model="checkedStatusOptionIdList" @change="onCheckedStatusOptionIdListChange($event, s.id)" type="checkbox" name="status" :value="s.id" :id="`status_${s.id}`">
        <label :for="`status_${s.id}`" class="checkbox">{{s.name}}</label>
      </dd>
    </dl>

    <h2>{{$t('views.tasksColumn.filterForm.assignedUsers')}}</h2>
    <ul class="searchWrap_tabBox">
      <li><a class="open_tab_task" :class="{active: assignedUserField === 'chargeUsers'}" @click.prevent="onUserFieldChange('chargeUsers')" href="#">{{$t('views.tasksColumn.filterForm.assignedUser')}}</a></li>
      <li><a class="open_tab_file" :class="{active: assignedUserField === 'batonUser'}" @click.prevent="onUserFieldChange('batonUser')" href="#">{{$t('views.tasksColumn.filterForm.batonHolder')}}</a></li>
    </ul>
    <dl class="searchWrap_humanBox">
      <dd class="searchWrap_humanBox_item_all">
        <input v-model="checkedAssignedUserAll" @change="onCheckedAssignedUserAllChange" type="checkbox" name="human" id="human_all">
        <label for="human_all" class="checkbox">{{$t('views.tasksColumn.filterForm.all')}}</label>
      </dd>
      <my-space-user tag="dd" v-for="pu in projectUsers" :key="pu.userId" :user-id="pu.userId" v-slot="{user}">
        <my-space-user-avatar :user="user" :size="24" shape="circle"/>
        <input v-model="checkedAssignedUserIdList" @change="onCheckedAssignedUserIdListChange($event, pu.userId)" type="checkbox" name="human" :value="pu.userId" :id="`human_${pu.userId}`">
        <label :for="`human_${pu.userId}`" class="checkbox">{{user ? (user.displayName || user.account) : 'unknown'}}</label>
      </my-space-user>
    </dl>

    <h2>{{$t('views.tasksColumn.filterForm.tags')}}</h2>
    <dl class="searchWrap_checkBox">
      <dd>
        <input v-model="checkedTagAll" @change="onCheckedTagAllChange" type="checkbox" name="tag" id="tag_all">
        <label for="tag_all" class="checkbox">{{$t('views.tasksColumn.filterForm.all')}}</label>
      </dd>
      <dd v-for="t in tags" :key="t.id">
        <input v-model="checkedTagIdList" @change="onCheckedTagIdListChange" type="checkbox" name="tag" :value="t.id" :id="`tag_${t.id}`">
        <label :for="`tag_${t.id}`" class="checkbox">{{t.name}}</label>
      </dd>
    </dl>
  </div>
</template>


<style lang="stylus" scoped>
.tasksColumn_filterForm
  position: fixed
  right: 0
  top: 0
  bottom: 0
  width: 40%
  overflow-y: scroll
  box-shadow: -1px 0 8px 1px rgba(0,0,0,0.1)
  background: #fff
  z-index: 2
  .searchWrap_humanBox
    dd
      background: none
      position: relative
      .mySpaceUserAvatar
        position: absolute
        left: 12px
        top: 9px
    dd.searchWrap_humanBox_item_all
      label
        padding-left: 13px
</style>


<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { TaskStatus, apiRegistry, ProjectsApi, ProjectUser, TasksApi } from '@/lib/api';
import { ProjectStatusCategory } from '@/consts';
import { FilterFormValue } from './types';

@Component
export default class FilterForm extends Vue {
  @Prop()
  statusOptions!: TaskStatus[] | null;

  @Prop({ default: {} })
  value!: FilterFormValue;

  projectUsers: ProjectUser[] = [];

  tags: {id: number; name: string}[] = [];

  checkedStatusOptionIdList: number[] = [];
  checkedStatusOptionAll = true;
  checkedStatusOptionNotClosed = false;
  checkedAssignedUserIdList: number[] = [];
  checkedAssignedUserAll = true;
  checkedTagIdList: number[] = [];
  checkedTagAll = true;

  assignedUserField: 'chargeUsers' | 'batonUser' = 'chargeUsers';


  get progressOptions() {
    return (this.statusOptions || []).filter((o) => this.isProgress(o))
      .sort((o1, o2) => o1.sort < o2.sort ? -1 : 1);
  }

  get etcOptions() {
    return (this.statusOptions || []).filter((o) => this.isEtc(o))
      .sort((o1, o2) => o1.sort < o2.sort ? -1 : 1);
  }

  get options() {
    return this.progressOptions.concat(this.etcOptions);
  }

  get closedStatusOption() {
    return this.progressOptions[this.progressOptions.length - 1];
  }

  isProgress(o: TaskStatus) {
    return o && o.category === ProjectStatusCategory.Progress;
  }

  isEtc(o: TaskStatus) {
    return o && o.category === ProjectStatusCategory.Etc;
  }

  onCheckedStatusOptionAllChange(ev: Event) {
    if ((ev.target as HTMLInputElement).checked) {
      this.checkedStatusOptionIdList = [];
      this.checkedStatusOptionNotClosed = false;
    } else {
      this.checkedStatusOptionIdList = this.options.map((o) => o.id);
    }
    this.emitInput();
  }

  onCheckedStatusOptionNotClosedChange(ev: Event) {
    if ((ev.target as HTMLInputElement).checked) {
      this.checkedStatusOptionIdList = [];
      this.checkedStatusOptionAll = false;
    } else {
      this.checkedStatusOptionAll = true;
    }
    this.emitInput();
  }

  onCheckedStatusOptionIdListChange(ev: Event, id: number) {
    if ((ev.target as HTMLInputElement).checked) {
      this.checkedStatusOptionAll = false;
      this.checkedStatusOptionNotClosed = false;
    } else {
      if (!this.checkedStatusOptionIdList.length ||
          (this.checkedStatusOptionIdList.length === 1 && this.checkedStatusOptionIdList.includes(id))
      ) {
        this.checkedStatusOptionAll = true;
      }
    }
    this.emitInput();
  }

  onCheckedAssignedUserAllChange(ev: Event) {
    if ((ev.target as HTMLInputElement).checked) {
      this.checkedAssignedUserIdList = [];
    } else {
      this.checkedAssignedUserIdList = this.projectUsers.map((r) => r.userId);
    }
    this.emitInput();
  }

  onCheckedAssignedUserIdListChange(ev: Event, id: number) {
    if ((ev.target as HTMLInputElement).checked) {
      this.checkedAssignedUserAll = false;
    } else {
      if (!this.checkedAssignedUserIdList.length ||
          (this.checkedAssignedUserIdList.length === 1 && this.checkedAssignedUserIdList.includes(id))
      ) {
        this.checkedAssignedUserAll = true;
      }
    }
    this.emitInput();
  }

  onCheckedTagAllChange(ev: Event) {
    if ((ev.target as HTMLInputElement).checked) {
      this.checkedTagIdList = [];
    } else {
      this.checkedTagIdList = this.tags.map((t) => t.id);
    }
    this.emitInput();
  }

  onCheckedTagIdListChange(ev: Event, id: number) {
    if ((ev.target as HTMLInputElement).checked) {
      this.checkedTagAll = false;
    } else {
      if (!this.checkedTagIdList.length ||
          (this.checkedTagIdList.length === 1 && this.checkedTagIdList.includes(id))
      ) {
        this.checkedTagAll = true;
      }
    }
    this.emitInput();
  }

  onUserFieldChange(field: this['assignedUserField']) {
    this.assignedUserField = field;
    this.emitInput();
  }

  async emitInput() {
    await this.$nextTick();

    const value: FilterFormValue = {};

    // status
    if (!this.checkedStatusOptionAll && this.checkedStatusOptionIdList.length) {
      value.status = this.checkedStatusOptionIdList.concat();
    } else if (this.checkedStatusOptionNotClosed) {
      const closedStatusOptionId = this.closedStatusOption.id;
      value.status = this.options.filter((o) => o.id !== closedStatusOptionId).map((o) => o.id);
    }
    // users
    if (!this.checkedAssignedUserAll && this.checkedAssignedUserIdList.length) {
      if (this.assignedUserField === 'chargeUsers') {
        value.chargeUsers = this.checkedAssignedUserIdList.concat();
      } else if (this.assignedUserField === 'batonUser') {
        value.batonUser = this.checkedAssignedUserIdList.concat();
      }
    }
    // tags
    if (!this.checkedTagAll && this.checkedTagIdList.length) {
      value.tags = this.checkedTagIdList.map((tid) => this.tags.find((t) => t.id === tid)!.name);
    }

    if (JSON.stringify(value) !== JSON.stringify(this.value)) {
      this.$emit('input', value);
    }
  }

  @Watch('value')
  onValueChange(newVal: this['value']) {
    // status
    if (newVal.status && newVal.status.length) {
      const statusIdList = newVal.status.filter((id) => this.options.find((o) => o.id === id));
      if (this.checkedStatusOptionNotClosed &&
          statusIdList.length + 1 === this.options.length &&
          !statusIdList.includes(this.closedStatusOption.id)
      ) {
        this.checkedStatusOptionIdList = [];
        this.checkedStatusOptionAll = false;
      } else {
        this.checkedStatusOptionIdList = statusIdList;
        this.checkedStatusOptionAll = !statusIdList.length;
        this.checkedStatusOptionNotClosed = false;
      }

    } else {
      this.checkedAssignedUserIdList = [];
      this.checkedAssignedUserAll = true;
      this.checkedStatusOptionNotClosed = false;
    }

    // users
    if ((newVal.chargeUsers && newVal.chargeUsers.length) ||
        (newVal.batonUser && newVal.batonUser.length)
    ) {
      const field = newVal.chargeUsers && newVal.chargeUsers.length ? 'chargeUsers' : 'batonUser';
      const users = (field === 'chargeUsers' ? newVal.chargeUsers : newVal.batonUser) as number[];
      const userIdList = users.filter((id) => this.projectUsers.find((pu) => pu.userId === id));
      this.checkedAssignedUserIdList = userIdList;
      this.checkedAssignedUserAll = !userIdList.length;
      this.assignedUserField = field;

    } else {
      this.checkedAssignedUserIdList = [];
      this.checkedAssignedUserAll = true;
    }

    // tags
    if (newVal.tags && newVal.tags.length) {
      const tagIdList = newVal.tags
        .map((name) => {
          const tag = this.tags.find((t) => t.name === name);
          return tag ? tag.id : undefined;
        })
        .filter((tid) => tid) as number[];
      this.checkedTagIdList = tagIdList;
      this.checkedTagAll = !tagIdList.length;

    } else {
      this.checkedTagIdList = [];
      this.checkedTagAll = true;
    }
  }


  async beforeMount() {
    const myUser = this.$store.state.activeUser.myUser!;
    const projectId = this.$store.getters.activeUser.activeProjectId!;
    const projectsApi = apiRegistry.load(ProjectsApi, myUser.token);
    const tasksApi = apiRegistry.load(TasksApi, myUser.token);

    // ProjectUser
    const res = await projectsApi.projectsProjectIdUsersGet({
      spaceId: myUser.space.id,
      projectId,
      limit: 500,
    });
    // - 自分を最初に持ってくる
    const index = res.results.findIndex((pu) => pu.userId === myUser.id);
    const myProjectUser = res.results[index];
    res.results.splice(index, 1);
    res.results.unshift(myProjectUser);
    this.projectUsers = res.results;

    // Tag
    this.tags = await tasksApi.tasksTagsGet({
      spaceId: myUser.space.id,
      projectId,
    });

    // 初期のバインド
    this.onValueChange(this.value);
  }
}
</script>
