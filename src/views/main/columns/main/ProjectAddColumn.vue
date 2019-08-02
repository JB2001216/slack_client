<template>
  <div class="columnWrap">
    <div class="columnWrap_right">
      <h3><strong>プロジェクト追加</strong></h3>
      <form @submit.prevent="save()">
        <div class="columnWrap_right_inputText">
          <my-text-input v-model="displayName" :message="displayNameMessage" type="text" placeholder="プロジェクト名" />
        </div>
        <button type="submit" v-show="false" />
      </form>
    </div>
  </div>
</template>

<style lang="stylus" scoped>
.columnWrap
  width: 100%
  .columnWrap_right
    width: 100%
    padding: 0
</style>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { MyTextInputMessage } from '@/components/MyTextInput';
import { first } from 'rxjs/operators';
import { AjaxError } from 'rxjs/ajax';
import { apiRegistry, ProjectsApi, ApiErrors } from '@/lib/api';

@Component
export default class ProjectAddColumn extends Vue {
  displayName = '';
  displayNameMessage: MyTextInputMessage = null;
  saving = false;

  async save() {
    if (this.saving) return;

    const loginUser = this.$store.state.activeUser.loggedInUser!;
    const projectsApi = apiRegistry.load(ProjectsApi, loginUser.token);

    try {
      this.saving = true;

      const project = await projectsApi.projectsPost({
        spaceId: loginUser.space.id,
        projectsPostRequestBody: {
          displayName: this.displayName,
        },
      }).pipe(first()).toPromise();
      this.$store.mutations.activeUser.addProject(project);
      this.$router.push({
        name: 'project',
        params: {
          userId: loginUser.id.toString(),
          projectId: project.id.toString(),
        },
      });

    } catch (err) {
      if (err instanceof AjaxError) {
        if (err.response && err.response.error === ApiErrors.ValidationError) {
          this.displayNameMessage = {
            type: 'error',
            text: err.response.data[Object.keys(err.response.data)[0]],
          };
        }
      }

      this.$showApiError(this, err);
      this.saving = false;
    }
  }
}
</script>
