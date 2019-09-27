<template>
  <div class="option_mainColumn">
    <h3 class="option_mainColumn_title">{{$t('views.setting.main.projectGeneral.title')}}</h3>
    <div class="option_commonColumn option_spaceProjectsGeneral">
      <div class="option_spaceProjectsGeneral_input">
        <input type="text" v-model="inputName">
      </div>
      <div class="option_spaceProjectsGeneral_addButton">
        <button class="option_spaceProjectsGeneral_button"
                type="button"
                :disabled="activeProject && activeProject.displayName === inputName || !inputName || saving"
                @click="save"
        >{{$t('views.setting.main.projectGeneral.save')}}</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import store from '@/store';
import { apiRegistry, ProjectsApi } from '@/lib/api';

interface Project {
  id: number;
  spaceId: number;
  displayName: string;
}

interface ProjectPutRequest {
  displayName: string;
}

type ProjectPut = (req: ProjectPutRequest) => Promise<Project>;

@Component
export default class ProjectGeneral extends Vue {

  inputName: string = '';

  saving: boolean = false;

  get activeProject() {
    const activeProject: Project | undefined = this.$store.getters.activeUser.activeProject;
    this.inputName = activeProject ? activeProject.displayName : '';

    return activeProject;
  }

  get myUser() {
    return this.$store.state.activeUser.myUser!;
  }

  get api(): { update: ProjectPut } {

    const projectsApi = apiRegistry.load(ProjectsApi, this.myUser.token);

    return {
      update: async(req: ProjectPutRequest) => {
        const project = await projectsApi.projectsProjectIdPut({
          spaceId: this.myUser.space.id,
          projectId: this.$store.state.activeUser.activeProjectData!.id,
          projectsProjectIdPutRequestBody: { displayName: req.displayName },
        });
        return project;
      },
    };

  }

  async save() {
    if (!this.api) return;

    try {
      this.saving = true;
      await this.api.update({ displayName: this.inputName });
      this.$flash(this.$t('views.setting.main.statusFlow.updatedMessage').toString(), 'success');
    } catch (err) {
      this.$appEmit('error', { err });
    } finally {
      this.saving = false;
    }
  }

}
</script>
