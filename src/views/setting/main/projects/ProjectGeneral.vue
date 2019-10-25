<template>
  <div class="option_mainColumn">
    <h3 class="option_mainColumn_title">
      {{ $t('views.setting.main.projectGeneral.title') }}
    </h3>
    <div class="option_commonColumn option_spaceProjectsGeneral">
      <div class="option_spaceProjectsGeneral_input">
        <input v-model="inputName" type="text" class="basicInput">
      </div>
      <div class="option_spaceProjectsGeneral_addButton">
        <button
          class="basicButtonPrimary wide"
          type="button"
          :disabled="!activeProject || saving"
          @click="save"
        >
          {{ $t('views.setting.main.projectGeneral.save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import store from '@/store';
import { apiRegistry, ProjectsApi } from '@/lib/api';

@Component
export default class ProjectGeneral extends Vue {

  inputName: string = '';
  saving: boolean = false;

  get activeProject() {
    return this.$store.getters.activeUser.activeProject;
  }

  get myUser() {
    return this.$store.state.activeUser.myUser!;
  }

  async save() {
    if (this.saving) return;

    try {
      this.saving = true;
      const projectsApi = apiRegistry.load(ProjectsApi, this.myUser.token);
      const project = await projectsApi.projectsProjectIdPut({
        spaceId: this.myUser.space.id,
        projectId: this.$store.state.activeUser.activeProjectData!.id,
        projectsProjectIdPutRequestBody: { displayName: this.inputName },
      });
      // this.$store.mutations.activeUser.editProject(project); (!!! moved to events-subscription.ts)
      // this.$flash(this.$t('views.setting.main.statusFlow.updatedMessage').toString(), 'success'); (!!! moved to events-subscription.ts)
    } catch (err) {
      this.$appEmit('error', { err });
    } finally {
      this.saving = false;
    }
  }

  beforeMount() {
    if (this.activeProject) {
      this.inputName = this.activeProject.displayName;
    }
  }
}
</script>
