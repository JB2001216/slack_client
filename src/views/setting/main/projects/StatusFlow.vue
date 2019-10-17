<template>
  <div class="option_mainColumn setting_main_statusFlow">
    <h3 class="option_mainColumn_title">
      {{ $t(`views.setting.main.statusFlow.title.${category}`) }}
    </h3>
    <div class="option_spaceProjectsTask">
      <div class="setting_main_statusFlow_preview">
        <div class="setting_main_statusFlow_preview_title">
          {{ $t('views.setting.main.statusFlow.preview') }}
        </div>
        <my-project-status-input v-model="previewStatus" :options="previewStatusList" />
      </div>
      <dl class="option_commonColumn clearfix">
        <dd>
          <h3 class="option_commonColumn_title">
            {{ $t('views.setting.main.statusFlow.flow') }}
          </h3>
          <ul class="option_commonColumn_list">
            <li v-for="(s, $index) in progressStatusList" :key="s.id" :class="{dragging: s === draggingItem}" @dragenter="onDragEnter($event, s)">
              <table>
                <tr>
                  <td class="option_commonColumn_list_number">
                    {{ $index+1 }}
                  </td>
                  <td class="option_commonColumn_list_input">
                    <div :class="{[itemClassName]: true}">
                      <my-color-picker
                        v-model="s.color"
                        v-slot="{opened, open, close}"
                        :custom-colors="customColors"
                        class="option_commonColumn_list_input_parts_color"
                        :style="{background: s.color}"
                      >
                        <div class="option_commonColumn_list_input_parts_color_content" @click.stop="opened ? close() : open()" />
                      </my-color-picker>
                      <div
                        draggable="true"
                        class="option_commonColumn_list_input_parts_toggle"
                        @dragstart="onDragStart($event, s)"
                        @dragend="onDragEnd($event, s)"
                      >
                        <span />
                        <span />
                        <span />
                      </div>
                      <input v-model="s.name" type="text" class="basicInput">
                    </div>
                  </td>
                  <td class="option_commonColumn_list_button">
                    <button v-if="progressStatusList.length > minimumProgressRowCount" @click="deleteRow(s)" />
                  </td>
                </tr>
              </table>
            </li>
          </ul>
          <div class="option_commonColumn_addButton">
            <div class="iconButtonPlus" @click="addProgressRow()">
              {{ $t('views.setting.main.statusFlow.addAnEntryField') }}
            </div>
          </div>
        </dd>
        <dd>
          <h3 class="option_commonColumn_title">
            {{ $t('views.setting.main.statusFlow.others') }}
          </h3>
          <ul class="option_commonColumn_list">
            <li v-for="(s, $index) in etcStatusList" :key="s.id" :class="{dragging: s === draggingItem}" @dragenter="onDragEnter($event, s)">
              <table>
                <tr>
                  <td class="option_commonColumn_list_number">
                    {{ $index+1 }}
                  </td>
                  <td class="option_commonColumn_list_input">
                    <div class="option_commonColumn_list_input_parts">
                      <my-color-picker
                        v-model="s.color"
                        v-slot="{opened, open, close}"
                        :custom-colors="customColors"
                        class="option_commonColumn_list_input_parts_color"
                        :style="{background: s.color}"
                        @click.stop="opened ? close() : open()"
                      />
                      <div
                        class="option_commonColumn_list_input_parts_toggle"
                        draggable="true"
                        @dragstart="onDragStart($event, s)"
                        @dragend="onDragEnd($event, s)"
                      >
                        <span />
                        <span />
                        <span />
                      </div>
                      <input v-model="s.name" type="text" class="basicInput">
                    </div>
                  </td>
                  <td class="option_commonColumn_list_button">
                    <button @click="deleteRow(s)" />
                  </td>
                </tr>
              </table>
            </li>
          </ul>
          <div class="option_commonColumn_addButton">
            <div class="iconButtonPlus" @click="addEtcRow()">
              {{ $t('views.setting.main.statusFlow.addAnEntryField') }}
            </div>
          </div>
        </dd>
      </dl>

      <div class="option_commonColumn_bottomButtons">
        <button type="submit" class="option_commonColumn_bottomButtons_button basicButtonPrimary wide" @click="save()">
          {{ $t('views.setting.main.statusFlow.save') }}
        </button>
      </div>
    </div>
  </div>
</template>


<style lang="stylus">
@import '../../../../stylus/_fixed/base/_variable'

.setting_main_statusFlow
  &_preview
    box-sizing: border-box
    border: 1px solid #E0E0E0
    border-radius: 8px
    background-color: $colors.whiteDarken1
    padding: 16px
    margin-top: 24px
    &_title
      margin-bottom: 8px
      color: #999999
      font-size: 14px
      font-weight: bold
      line-height: 20px
  .myColorPicker_pop
    left: -20px
    top: 20px
  .option_commonColumn
    &_list
      > li.dragging
        opacity: 0.2
      &_input_parts_color_content
        width: 100%
        height: 100%
    &_bottomButtons
      margin-top: 20px
      &_button
        float: right
</style>


<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { apiRegistry, TasksApi, NotesApi } from '@/lib/api';
import MyColorPicker from '@/components/MyColorPicker.vue';
import MyProjectStatusInput from '@/components/MyProjectStatusInput.vue';
import { colorPickerDefaultColors, ProjectStatusCategory } from '@/consts';

interface Status {
  id?: number;
  category: number;
  name: string;
  color: string | null;
  sort: number;
}
interface StatusPostRequest {
  items: Status[];
}
type StatusGet = () => Promise<Status[]>;
type StatusPost = (req: StatusPostRequest) => Promise<Status[]>;

@Component({
  components: {
    MyColorPicker,
    MyProjectStatusInput,
  },
})
export default class StatusFlow extends Vue {
  saving = false;
  statusList: Status[] = [];
  minimumProgressRowCount = 2;
  itemClassName = 'option_commonColumn_list_input_parts';
  draggingItem: Status | null = null;
  previewStatus: number | null = null;

  get previewStatusList() {
    const list = this.statusList.concat();
    let current = Math.max(...list.filter((o) => o.id).map((o) => o.id!)) || 0;
    list.forEach((o, i) => {
      if (!o.id) {
        o.id = ++current;
      }
    });
    return list;
  }

  get customColors() {
    const customColors: string[] = [];
    this.statusList.forEach((s) => {
      if (s.color && !customColors.includes(s.color) && !colorPickerDefaultColors.includes(s.color)) {
        customColors.push(s.color);
      }
    });
    return customColors;
  }

  get myUser() {
    return this.$store.state.activeUser.myUser!;
  }

  get category() {
    if (this.$store.state.settingRouter.name === 'task-status') {
      return 'task';
    }
    if (this.$store.state.settingRouter.name === 'note-status') {
      return 'note';
    }
    return undefined;
  }

  get progressStatusList() {
    return this.statusList.filter((o) => this.isProgress(o))
      .sort((o1, o2) => o1.sort < o2.sort ? -1 : 1);
  }

  get etcStatusList() {
    return this.statusList.filter((o) => this.isEtc(o))
      .sort((o1, o2) => o1.sort < o2.sort ? -1 : 1);
  }

  get api(): { fetch: StatusGet; update: StatusPost } | undefined {
    if (this.category === 'task') {
      const tasksApi = apiRegistry.load(TasksApi, this.myUser.token);
      return {
        fetch: () => tasksApi.tasksStatusGet({
          spaceId: this.myUser.space.id,
          projectId: this.$store.state.activeUser.activeProjectData!.id,
        }),
        update: async(req: StatusPostRequest) => {
          const statusList = await tasksApi.tasksStatusPost({
            spaceId: this.myUser.space.id,
            projectId: this.$store.state.activeUser.activeProjectData!.id,
            tasksStatusPostRequestBodyItem: req.items,
          });
          this.$store.mutations.activeUser.setTaskStatusList(statusList);
          return statusList;
        },
      };
    }
    if (this.category === 'note') {
      const notesApi = apiRegistry.load(NotesApi, this.myUser.token);
      return {
        fetch: () => notesApi.notesStatusGet({
          spaceId: this.myUser.space.id,
          projectId: this.$store.state.activeUser.activeProjectData!.id,
        }),
        update: async(req: StatusPostRequest) => {
          const statusList = await notesApi.notesStatusPost({
            spaceId: this.myUser.space.id,
            projectId: this.$store.state.activeUser.activeProjectData!.id,
            tasksStatusPostRequestBodyItem: req.items,
          });
          this.$store.mutations.activeUser.setNoteStatusList(statusList);
          return statusList;
        },
      };
    }
    return undefined;
  }

  isProgress(o: Status | null) {
    return o && o.category === ProjectStatusCategory.Progress;
  }

  isEtc(o: Status | null) {
    return o && o.category === ProjectStatusCategory.Etc;
  }

  onDragStart(ev: DragEvent, o: Status) {
    this.draggingItem = o;
    const el = (ev.target as HTMLElement).closest(`.${this.itemClassName}`)!;
    const rect = el.getBoundingClientRect();
    ev.dataTransfer!.setDragImage(el, rect.width - 20, rect.height / 2);
  }

  async onDragEnter(ev: DragEvent, targetItem: Status) {
    if (!this.draggingItem ||
        targetItem === this.draggingItem ||
        targetItem.category !== this.draggingItem.category
    ) {
      return;
    }

    const list = (
      this.draggingItem.category === ProjectStatusCategory.Progress
        ? this.progressStatusList : this.etcStatusList
    ).concat();
    const oldIndex = list.indexOf(this.draggingItem);
    const newIndex = list.indexOf(targetItem);
    list.splice(oldIndex, 1);
    if (newIndex < list.length) {
      list.splice(newIndex, 0, this.draggingItem);
    } else {
      list.push(this.draggingItem);
    }
    list.forEach((s, i) => {
      s.sort = i + 1;
    });
    this.setLastPreviewStatus();
  }

  onDragEnd(ev: DragEvent, target: Status) {
    this.draggingItem = null;
  }

  addProgressRow() {
    this.statusList.push({
      name: '',
      category: ProjectStatusCategory.Progress,
      color: colorPickerDefaultColors[0],
      sort: (this.progressStatusList.length ? Math.max(...this.progressStatusList.map((s) => s.sort)) : 0) + 1,
    });
    this.setLastPreviewStatus();
  }

  addEtcRow() {
    this.statusList.push({
      name: '',
      category: ProjectStatusCategory.Etc,
      color: colorPickerDefaultColors[colorPickerDefaultColors.length - 1],
      sort: (this.etcStatusList.length ? Math.max(...this.etcStatusList.map((s) => s.sort)) : 0) + 1,
    });
    this.setLastPreviewStatus();
  }

  deleteRow(status: Status) {
    if (status.category === ProjectStatusCategory.Progress &&
        this.progressStatusList.length <= this.minimumProgressRowCount
    ) {
      return;
    }
    const index = this.statusList.findIndex((s) => status === s);
    if (index >= 0) {
      this.statusList.splice(index, 1);
      this.setLastPreviewStatus();
    }
  }

  setLastPreviewStatus() {
    const list = this.previewStatusList.filter((o) => this.isProgress(o))
      .sort((o1, o2) => o1.sort < o2.sort ? -1 : 1);
    if (list.length) {
      this.previewStatus = list[list.length - 1].id!;
    }
  }

  async fetch() {
    if (!this.api) return;
    this.statusList = await this.api.fetch();
    this.setLastPreviewStatus();
  }

  validate() {
    for (let s of this.statusList) {
      if (s.name.trim() === '') {
        this.$flash(this.$t('views.setting.main.statusFlow.blankItemExists').toString(), 'error');
        return false;
      }
    }
    return true;
  }

  async save() {
    if (!this.api || this.saving) return;
    if (!this.validate()) return;

    try {
      this.saving = true;
      await this.api.update({ items: this.statusList });
      this.$flash(this.$t('views.setting.main.statusFlow.updatedMessage').toString(), 'success');
    } catch (err) {
      this.$appEmit('error', { err });
    } finally {
      this.saving = false;
    }
  }

  async beforeMount() {
    await this.fetch();
  }

  @Watch('category')
  async onCategoryChange(newVal: this['category']) {
    await this.fetch();
  }
}
</script>
