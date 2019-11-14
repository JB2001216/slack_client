<template>
  <div class="option_mainColumn">
    <h3 class="option_mainColumn_title">
      {{ $t('views.setting.main.projectGeneral.title') }}
    </h3>

    <div class="option_commonColumn option_spaceProjectsGeneral">
      <div class="option_spaceProjectsGeneral_input">
        <input v-model="inputName" type="text" class="basicInput">
      </div>
      <div class="option_spaceProjectsGeneral_addButton clearfix">
        <button
          class="basicButtonPrimary wide"
          type="button"
          :disabled="!project || !changes || saving"
          @click="actions('save')"
        >
          {{ $t('views.setting.main.projectGeneral.save') }}
        </button>
      </div>
      <div />
      <div class="option_spaceProjectsGeneral_addButton clearfix">
        <button
          class="basicButtonDanger wide"
          type="button"
          :disabled="!project || deleting"
          @click="confirmDeleting = true"
        >
          {{ $t('views.setting.main.projectGeneral.delete') }}
        </button>
      </div>
    </div>

    <my-confirm-change-discard-dialog
      v-if="!deleting"
      :changes="changes"
      :next="nextRouteForConfirmChangeDiscard"
      @answer="onAnswerForConfirmChangeDiscard"
    />

    <my-modal
      v-if="confirmDeleting"
      :value="true"
      class="modalDialog"
      content-class="modalDialog_content"
      @input="project"
    >
      <p class="modalDialog_content_title">
        {{ $t('views.setting.main.projectGeneral.deleteConfirmDialog', { projectName: project.displayName }) }}
      </p>

      <div class="modalDialog_content_footerButtons">
        <button class="basicButtonDanger modalDialog_content_footerButtons_button" @click="actions('delete')">
          {{ $t('common.confirm') }}
        </button>
        <button class="basicButtonNormal modalDialog_content_footerButtons_button" @click="confirmDeleting = false">
          {{ $t('common.cancel') }}
        </button>
      </div>
    </my-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from 'vue-property-decorator';
import { apiRegistry, ProjectsApi } from '@/lib/api';
import ConfirmChangeDiscardForSettingMixin from '@/mixins/ConfirmChangeDiscardForSettingMixin';

@Component
export default class ProjectGeneral extends Mixins(ConfirmChangeDiscardForSettingMixin) {

  inputName: string = '';
  saving: boolean = false;
  confirmDeleting: boolean = false;
  deleting: boolean = false;

  get myUser() {
    return this.$store.state.activeUser.myUser!;
  }

  get project() {
    return this.$store.getters.activeUser.activeProject;
  }

  get changes() {
    return !!this.project && this.project.displayName !== this.inputName;
  }

  get api() {
    return apiRegistry.load(ProjectsApi, this.myUser.token);
  }

  created() {
    this.inputName = this.project ? this.project.displayName : '';
  }

  async actions(type: string) {

    if (this.saving || this.deleting || !this.project) return;

    try {

      if (type === 'save') {

        this.saving = true;

        await this.api.projectsProjectIdPut({
          spaceId: this.myUser.space.id,
          projectId: this.project.id,
          projectsProjectIdPutRequestBody: { displayName: this.inputName },
        });

      } else if (type === 'delete') {

        this.confirmDeleting = false;

        this.deleting = true;

        await this.api.projectsProjectIdDelete({
          spaceId: this.myUser.space.id,
          projectId: this.project.id,
        });

      }

    } catch (err) {
      this.$appEmit('error', { err });
      this.deleting = false;
    } finally {
      this.saving = false;
    }

  }

}
</script>
