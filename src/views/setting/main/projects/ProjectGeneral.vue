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
          :disabled="!activeProject || !changes || saving"
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
          :disabled="!activeProject || deleting"
          @click="confirmDeleting = true"
        >
          {{ $t('views.setting.main.projectGeneral.delete') }}
        </button>
      </div>
    </div>

    <my-confirm-change-discard-dialog
      :changes="changes"
      :next="!!nextForConfirmChangeDiscard"
      @answer="onAnswerForConfirmChangeDiscardDialog"
    />
    <my-modal
      v-if="confirmDeleting"
      :value="true"
      class="modalDialog"
      content-class="modalDialog_content"
      @input="activeProject"
    >
      <p class="modalDialog_content_title">
        {{ $t('views.setting.main.projectGeneral.confirmationMsg') }}
      </p>
      <p class="modalDialog_content_description">
        {{ activeProject.displayName }}
      </p>

      <div class="modalDialog_content_footerButtons">
        <button class="basicButtonNormal modalDialog_content_footerButtons_button" @click="confirmDeleting = false">
          {{ $t('views.setting.main.projectGeneral.cancel') }}
        </button>
        <button class="basicButtonDanger modalDialog_content_footerButtons_button" @click="actions('delete')">
          {{ $t('views.setting.main.projectGeneral.confirm') }}
        </button>
      </div>
    </my-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from 'vue-property-decorator';
import store from '@/store';
import { apiRegistry, ProjectsApi } from '@/lib/api';
import ConfirmChangeDiscardForSettingMixin from '@/mixins/ConfirmChangeDiscardForSettingMixin';


@Component
export default class ProjectGeneral extends Mixins(ConfirmChangeDiscardForSettingMixin) {

  inputName: string = '';
  saving: boolean = false;
  confirmDeleting: boolean = false;
  deleting: boolean = false;

  get activeProject() {
    return this.$store.getters.activeUser.activeProject!;
  }

  get myUser() {
    return this.$store.state.activeUser.myUser!;
  }

  get api() {
    return apiRegistry.load(ProjectsApi, this.myUser.token);
  }

  get changes() {
    return !!this.activeProject && this.activeProject.displayName !== this.inputName;
  }

  async actions(type: string) {

    if (this.saving || this.deleting) return;

    try {

      if (type === 'save') {

        this.saving = true;

        await this.api.projectsProjectIdPut({
          spaceId: this.myUser.space.id,
          projectId: this.activeProject.id,
          projectsProjectIdPutRequestBody: { displayName: this.inputName },
        });

      } else if (type === 'delete') {

        this.confirmDeleting = false;

        this.deleting = true;

        await this.api.projectsProjectIdDelete({
          spaceId: this.myUser.space.id,
          projectId: this.activeProject.id,
        });

      }

    } catch (err) {
      this.$appEmit('error', { err });
    } finally {
      this.saving = false;
      this.deleting = false;
    }

  }

  beforeMount() {
    if (this.activeProject) {
      this.inputName = this.activeProject.displayName;
    }
  }

}
</script>
